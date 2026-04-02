const mongoose = require('mongoose');
const ledgermodel = require("./ledger.model");

const accountschema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: [true, "account must be associated with user"],
        index: true
    },
    status: {
        type: String,
        enum: {
            values: ["ACTIVE", "FROZEN", "CLOSED"],
            message: "status can be ACTIVE, FROZEN, or CLOSED",
        },
        default: "ACTIVE"
    },
    currency: {
        type: String,
        required: [true, "currency is required for creating account"],
        default: "INR"
    }
}, {
    timestamps: true
});

// index for faster queries
accountschema.index({ user: 1, status: 1 });

//GET BALANCE METHOD
accountschema.methods.getbalance = async function () {

    const balancedata = await ledgermodel.aggregate([
        { $match: { account: this._id } },
        {
            $group: {
                _id: null,
                totaldebit: {
                    $sum: {
                        $cond: [
                            { $eq: ["$type", "DEBIT"] },
                            "$amount",
                            0
                        ]
                    }
                },
                totalcredit: {
                    $sum: {
                        $cond: [
                            { $eq: ["$type", "CREDIT"] },
                            "$amount",
                            0
                        ]
                    }
                }
            }
        }
    ]);

    if (balancedata.length === 0) return 0;

    // FINAL BALANCE
    return balancedata[0].totalcredit - balancedata[0].totaldebit;
};

const accountmodel = mongoose.model("account", accountschema);

module.exports = accountmodel;