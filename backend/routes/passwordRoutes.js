const express = require("express");
const router = express.Router();

const {
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

router.route("/forgotPassword").post(forgotPassword);
router.route("/resetPassword").post(resetPassword);

module.exports = router;
