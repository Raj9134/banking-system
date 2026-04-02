const accountmodel = require("../models/account.model");
const transactionmodel = require("../models/transaction.model");
const ledgermodel = require("../models/ledger.model");
const emailservice = require("../services/email");
const mongoose = require("mongoose");


// ✅ TRANSFER (user → user)
async function createtransaction(req, res) {
    const { fromaccount, toaccount, amount, idempotencykey } = req.body;

    if (!fromaccount || !toaccount || !amount || !idempotencykey) {
        return res.status(400).json({
            message: "fromaccount, toaccount, amount and idempotencykey are required"
        });
    }

    if (fromaccount === toaccount) {
        return res.status(400).json({
            message: "fromaccount and toaccount cannot be same"
        });
    }

    try {
        const fromuseraccount = await accountmodel.findOne({
            _id: fromaccount,
            user: req.user._id
        });

        const touseraccount = await accountmodel.findById(toaccount);

        if (!fromuseraccount || !touseraccount) {
            return res.status(400).json({
                message: "invalid account"
            });
        }

        if (fromuseraccount.status !== "ACTIVE" || touseraccount.status !== "ACTIVE") {
            return res.status(400).json({
                message: "both accounts must be ACTIVE"
            });
        }

        const existingTxn = await transactionmodel.findOne({ idempotencykey });
        if (existingTxn) {
            return res.status(200).json({
                message: "transaction already processed",
                transaction: existingTxn
            });
        }

        const balance = await fromuseraccount.getbalance();

        if (balance < amount) {
            return res.status(400).json({
                message: `insufficient balance. current: ${balance}`
            });
        }

        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const transaction = new transactionmodel({
                fromaccount,
                toaccount,
                amount,
                idempotencykey,
                status: "PENDING"
            });

            await transaction.save({ session });

            // ✅ DEBIT
            await ledgermodel.create([{
                account: fromaccount,
                amount,
                transaction: transaction._id,
                type: "DEBIT"
            }], { session });

            // ✅ CREDIT
            await ledgermodel.create([{
                account: toaccount,
                amount,
                transaction: transaction._id,
                type: "CREDIT"
            }], { session });

            transaction.status = "COMPLETED";
            await transaction.save({ session });

            await session.commitTransaction();
            session.endSession();

            // ================= EMAIL LOGIC =================

            // Populate receiver user
            const receiverAccount = await accountmodel
                .findById(toaccount)
                .populate("user");

            const senderEmail = req.user.email;
            const senderName = req.user.name;

            const receiverEmail = receiverAccount?.user?.email;
            const receiverName = receiverAccount?.user?.name;

            // ✅ Email to sender
            await emailservice.sendtransactionemail(
                senderEmail,
                senderName,
                amount,
                toaccount
            );

            // ✅ Email to receiver
            if (receiverEmail) {
                await emailservice.sendEmail(
                    receiverEmail,
                    "Money Received 💰",
                    `Hello ${receiverName},

You have received ₹${amount} from another user.

Date: ${new Date().toLocaleString()}

- Backend Ledger Team`
                );
            }

            // ==============================================

            return res.status(201).json({
                message: "transaction completed successfully",
                transaction
            });

        } catch (err) {
            await session.abortTransaction();
            session.endSession();

            // ❌ Failure email
            await emailservice.sendtransactionfailureemail(
                req.user.email,
                req.user.name,
                amount,
                toaccount
            );

            return res.status(500).json({
                message: "transaction failed",
                error: err.message
            });
        }

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}


// ✅ DEPOSIT (SYSTEM → USER)
async function createinitialfundstransaction(req, res) {
    const { toaccount, amount, idempotencykey } = req.body;

    if (!toaccount || !amount || !idempotencykey) {
        return res.status(400).json({
            message: "toaccount, amount and idempotencykey are required"
        });
    }

    try {
        const touseraccount = await accountmodel.findById(toaccount);

        if (!touseraccount) {
            return res.status(400).json({
                message: "invalid account"
            });
        }

        if (touseraccount.status !== "ACTIVE") {
            return res.status(400).json({
                message: "account must be ACTIVE"
            });
        }

        const existingTxn = await transactionmodel.findOne({ idempotencykey });
        if (existingTxn) {
            return res.status(200).json({
                message: "transaction already processed",
                transaction: existingTxn
            });
        }

        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const transaction = new transactionmodel({
                fromaccount: null,
                toaccount,
                amount,
                idempotencykey,
                status: "PENDING"
            });

            await transaction.save({ session });

            // ✅ CREDIT ONLY
            await ledgermodel.create([{
                account: toaccount,
                amount,
                transaction: transaction._id,
                type: "CREDIT"
            }], { session });

            transaction.status = "COMPLETED";
            await transaction.save({ session });

            await session.commitTransaction();
            session.endSession();

            return res.status(201).json({
                message: "fund added successfully",
                transaction
            });

        } catch (err) {
            await session.abortTransaction();
            session.endSession();

            return res.status(500).json({
                message: "transaction failed",
                error: err.message
            });
        }

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

module.exports = {
    createtransaction,
    createinitialfundstransaction
};