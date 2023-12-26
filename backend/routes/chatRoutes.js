const express = require("express");
const {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroupChat,
} = require("../controllers/chatControllers");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.route("/").post(protect, accessChat);
router.route("/fetchChat").get(protect, fetchChats);
router.route("/createChat").post(protect, createGroupChat);
router.route("/renameChat").put(protect, renameGroupChat);

module.exports = router;
