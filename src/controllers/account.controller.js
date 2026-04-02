const accountmodel = require("../models/account.model");

// Create Account
async function createaccountcontroller(req, res) {
    try {
        const user = req.user;

        const account = await accountmodel.create({
            user: user._id
        });

        res.status(201).json({
            account
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

// Get All Accounts of User
async function getuseraccountcontroller(req, res) {
    try {
        const account = await accountmodel.find({
            user: req.user._id
        });

        res.status(200).json({
            account
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

// Get Account Balance
async function getaccountbalancecontroller(req, res) {
    try {
        const { accountId } = req.params;

        const account = await accountmodel.findOne({
            _id: accountId,
            user: req.user._id
        });

        if (!account) {
            return res.status(404).json({
                message: "account not found"
            });
        }

        const balance = await account.getbalance();

        res.status(200).json({
            accountId: account._id,
            balance: balance
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

module.exports = {
    createaccountcontroller,
    getuseraccountcontroller,
    getaccountbalancecontroller
};