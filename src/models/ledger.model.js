const mongoose = require('mongoose');

const ledgerschema = new mongoose.Schema({
    account: {
        type: mongoose.Schema.ObjectId,
        ref: "account",
        required: [true, "ledger must be associated with account"],
        index: true,
        immutable: true
    },

    amount: {
        type: Number,
        required: [true, "amount is required for creating a ledger entry"],
        immutable: true
    },

    transaction: {
        type: mongoose.Schema.ObjectId,
        ref: "transaction",
        required: [true, "ledger must be associated with transaction"],
        index: true,
        immutable: true
    },

    type: {
        type: String,
        enum: {
            values: ["CREDIT", "DEBIT"],
            message: "type can be either CREDIT or DEBIT",
        },
        required: [true, "ledger type is required"],
        immutable: true
    }

}, {
    timestamps: true 
});

// prevent modification
function preventledgermodification() {
    throw new Error("ledger entry is immutable and cannot be modified or deleted");
}

ledgerschema.pre('findOneAndDelete', preventledgermodification);
ledgerschema.pre('updateOne', preventledgermodification);
ledgerschema.pre('deleteOne', preventledgermodification);
ledgerschema.pre('deleteMany', preventledgermodification); 
ledgerschema.pre('findOneAndUpdate', preventledgermodification);
ledgerschema.pre('findOneAndReplace', preventledgermodification);

const ledgermodel = mongoose.model('ledger', ledgerschema);

module.exports = ledgermodel;