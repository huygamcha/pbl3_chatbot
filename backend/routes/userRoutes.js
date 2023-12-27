const express = require("express");
const {
  registerUser,
  authUser,
  searchUsers,
  updateUser,
  getAllUsers,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.route("/").post(registerUser);
router.route("/login").post(authUser);
router.route("/").get(protect, searchUsers);
router.route("/").patch(protect, updateUser);
router.route("/getAll").get(protect, getAllUsers);

module.exports = router;
