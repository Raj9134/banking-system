const usermodel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const tokenBlacklistModel = require("../models/blacklist.model");

async function authmiddleware(req, res, next) {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    console.log("AUTH HEADER:", req.headers.authorization);
    console.log("TOKEN:", token);   

    if (!token) {
        return res.status(401).json({
            message: "unauthorized access, token is missing"
        });
    }

    const isblacklisted = await tokenBlacklistModel.findOne({ token });

    if (isblacklisted) {
        return res.status(401).json({
            message: "unauthorized access, token is blacklisted"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("DECODED:", decoded);   

        const user = await usermodel.findById(decoded.userid);

        if (!user) {
            return res.status(401).json({
                message: "user not found"
            });
        }

        req.user = user;
        next();

    } catch (error) {
        console.log("JWT ERROR:", error.message);  

        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                message: "Token expired, please login again"
            });
        }

        return res.status(401).json({
            message: error.message
        });
    }
}


async function authsystemiddleware(req, res, next) {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    console.log("AUTH HEADER:", req.headers.authorization);
    console.log("TOKEN:", token);  

    if (!token) {
        return res.status(401).json({
            message: "unauthorized access, token is missing"
        });
    }

    const isblacklisted = await tokenBlacklistModel.findOne({ token });

    if (isblacklisted) {
        return res.status(401).json({
            message: "unauthorized access, token is blacklisted"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("DECODED:", decoded);  

        const user = await usermodel
            .findById(decoded.userid)
            .select("+systemuser");

        if (!user) {
            return res.status(401).json({
                message: "user not found"
            });
        }

        if (!user.systemuser) {
            return res.status(403).json({
                message: "forbidden access, not a system user"
            });
        }

        req.user = user;
        next();

    } catch (err) {
        console.log("JWT ERROR:", err.message);   

        if (err.name === "TokenExpiredError") {
            return res.status(401).json({
                message: "Token expired, please login again"
            });
        }

        return res.status(401).json({
            message: err.message
        });
    }
}

module.exports = {
    authmiddleware,
    authsystemiddleware
};