const express = require('express');
const transactioncontroller = require("../controllers/transaction.controller");
const authmiddleware = require("../middleware/auth.middleware");

const router = express.Router();

// Create Transaction (transfer money)
router.post(
  "/transfer",
  authmiddleware.authmiddleware,
  transactioncontroller.createtransaction
);

// Add initial funds (system use)
router.post(
  "/fund",
  authmiddleware.authmiddleware,
  transactioncontroller.createinitialfundstransaction
);

module.exports = router;