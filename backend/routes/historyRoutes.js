const express = require("express");
const {
  getMessages,
  createChat,
  deleteHistory,
} = require("../controllers/historyController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

// router.route("/").post(protect, accessChat);
router.route("/create").post(createChat);
router.route("/get").get(getMessages);
router.route("/delete").delete(deleteHistory);

// router.route("/createChat").post(protect, createGroupChat);
// router.route("/renameChat").put(protect, renameGroupChat);

module.exports = router;
