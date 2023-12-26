const asyncHandler = require("express-async-handler");
const generateToken = require("../config/generateToken");
const User = require("../models/userModel");
const { fuzzySearch } = require("../utils/index");

const registerUser = asyncHandler(async (req, res, next) => {
  console.log("««««« req.body »»»»»", req.body);
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    res.send(400);
    throw new Error("Invalid username");
  }

  const userExits = await User.findOne({ email });
  if (userExits) {
    res.send(404);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    pic,
  });

  if (user) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      password: user.password,
      pic: user.pic,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(404);
    throw new Error("Error creating user");
  }
});

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      password: user.password,
      pic: user.pic,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(404);
    throw new Error("Invalid password or email ");
  }
});

const searchUsers = asyncHandler(async (req, res) => {
  const { keyword } = req.query;
  const regex = new RegExp(keyword, "i");

  const users = await User.find({
    $or: [{ email: fuzzySearch(keyword) }, { name: fuzzySearch(keyword) }],
  });

  if (users) {
    res.json({
      users,
    });
  } else {
    res.status(404);
    throw new Error("Invalid password or email ");
  }
});

const updateUser = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const { password, name, pic } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      res.send(404, {
        error,
        message: "User not found",
      });
    } else {
      user.password = password || user.password;
      user.name = name || user.name;
      user.pic = pic || user.pic;
    }

    const updateComplete = await user.save();

    res.send(200, {
      message: "Updated",
      updateComplete,
    });
  } catch (error) {
    res.send(400, {
      error,
      message: "Update failed",
    });
  }
});

module.exports = { registerUser, authUser, searchUsers, updateUser };
