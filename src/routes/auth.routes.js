const express = require('express')
const authcontroller=require("../controllers/auth.controller")
const authmiddleware = require("../middleware/auth.middleware");

const router = express.Router()


router.post('/register', authcontroller.userregistercontrol)
router.post("/login",authcontroller.userlogin)
/*
logout api
*/
router.post(
    "/logout",
    authmiddleware.authmiddleware,
    authcontroller.userlogoutcontroller
  )
module.exports = router