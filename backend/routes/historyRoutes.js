const express = require("express");
const router = express.Router();

const {
  getMessages,
  createChat,
  deleteHistory,
} = require("../controllers/historyController");
const { protect } = require("../middleware/authMiddleware");

router.route("/create").post(createChat);
router.route("/get").get(getMessages);
router.route("/delete").delete(deleteHistory);

module.exports = router;
