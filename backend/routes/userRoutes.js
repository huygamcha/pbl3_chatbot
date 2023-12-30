const express = require("express");
const {
  registerUser,
  authUser,
  searchUsers,
  updateUser,
  getAllUsers,
  newUser,
  deleteUser,
  updateUserByAdmin,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.route("/").post(registerUser);
router.route("/login").post(authUser);
router.route("/").get(protect, searchUsers);
router.route("/").patch(updateUser);
router.route("/getAll").get(protect, getAllUsers);
router.route("/newUser").get(protect, newUser);

// chưa phân quyền
router.route("/deleteUser").delete(deleteUser);
router.route("/updateUserByAdmin").patch(updateUserByAdmin);

module.exports = router;
