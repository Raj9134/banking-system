const mongoose = require("mongoose");

const tokenblacklistschema = new mongoose.Schema(
{
    token: {
        type: String,
        required: [true, "token is required to blacklist"],
        unique: true
    }
},
{
    timestamps: true
}
);

// TTL index (auto delete after 3 days)
tokenblacklistschema.index(
    { createdAt: 1 },
    { expireAfterSeconds: 60 * 60 * 24 * 3 }
);

// model
const tokenBlacklistModel = mongoose.model("tokenblacklist", tokenblacklistschema);


module.exports = tokenBlacklistModel;