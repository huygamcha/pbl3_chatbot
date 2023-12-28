const express = require("express");
const router = express.Router();

const {
  getMessages,
  createChat,
  deleteHistory,
  getAllChat,
} = require("../controllers/historyController");
const { protect } = require("../middleware/authMiddleware");

router.route("/create").post(createChat);
router.route("/get").get(getMessages);
router.route("/delete").delete(deleteHistory);
router.route("/getAll").get(getAllChat);

module.exports = router;
