const mongoose = require("mongoose");

const transactionschema = new mongoose.Schema({
    fromaccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "account",
        required: false,   // ✅ deposit allowed
        index: true
    },

    toaccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "account",
        required: [true, "transaction must be associated with to account"],
        index: true
    },

    status: {
        type: String,
        enum: {
            values: ["PENDING", "COMPLETED", "FAILED", "REVERSED"],
            message: "invalid transaction status"
        },
        default: "PENDING"
    },

    amount: {
        type: Number,
        required: [true, "Amount is required for creating a transaction"],
        min: [1, "transaction amount cannot be negative"]
    },

    idempotencykey: {
        type: String,
        required: [true, "idempotency key is required for creating transaction"],
        index: true,
        unique: true
    }
}, {
    timestamps: true
});


// ✅ FIXED: no next()
transactionschema.pre("save", function () {
    if (
        this.fromaccount &&
        this.toaccount &&
        this.fromaccount.toString() === this.toaccount.toString()
    ) {
        throw new Error("from and to account cannot be same");
    }
});

const transactionmodel = mongoose.model("transaction", transactionschema);
module.exports = transactionmodel;