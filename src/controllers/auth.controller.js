const usermodel = require('../models/user.model');
const emailservice = require("../services/email");
const jwt = require("jsonwebtoken");
const tokenBlacklistModel=require("../models/blacklist.model")

async function userregistercontrol(req, res) {
  try {
    const { email, password, name } = req.body;

    const isexist = await usermodel.findOne({ email });

    if (isexist) {
      return res.status(422).json({
        message: "user already exists",
        status: "failed",
      });
    }

    const user = await usermodel.create({
      email,
      password,
      name,
    });

    const token = jwt.sign(
      { userid: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "3d" }
    );

    //  secure cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, 
    });

    // ✅ Send response first
    res.status(201).json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
      token,
    });

    // ✅ Send email in background (don't block response)
    emailservice
      .sendregisterationemail(user.email, user.name)
      .catch(err => console.error("Email error:", err));

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
}

// ✅ FIXED LOGIN
async function userlogin(req, res) {
  try {
    const { email, password } = req.body;

    const user = await usermodel
      .findOne({ email })
      .select("+password");

    if (!user) {
      return res.status(401).json({
        message: "invalid user",
      });
    }

    const isvalidpassword = await user.comparePassword(password);

    if (!isvalidpassword) {
      return res.status(401).json({
        message: "email or password is invalid",
      });
    }

    const token = jwt.sign(
      { userid: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "3d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
    });

    return res.status(200).json({
      message: "login successful",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
      token,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
}

async function userlogoutcontroller(req,res){
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1]

  if(!token){
    return res.status(400).json({
      message:"user logout successfully"
    })
  }
  res.clearCookie("token")
  await tokenBlacklistModel.create({
    token:token
  })

   res.status(200).json({
    message:"user logout successfully "
  })
}

module.exports = { userregistercontrol, userlogin ,userlogoutcontroller};