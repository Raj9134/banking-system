const express = require("express");
const authmiddleware = require("../middleware/auth.middleware");
const accountcontroller = require("../controllers/account.controller");

const router = express.Router();

router.post("/", authmiddleware.authmiddleware, accountcontroller.createaccountcontroller);

router.get("/", authmiddleware.authmiddleware, accountcontroller.getuseraccountcontroller);

router.get(
  "/balance/:accountId",
  authmiddleware.authmiddleware,
  accountcontroller.getaccountbalancecontroller
);

module.exports = router;