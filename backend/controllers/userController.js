const asyncHandler = require("express-async-handler");
const generateToken = require("../config/generateToken");
const User = require("../models/userModel");
const { fuzzySearch } = require("../utils/index");
const bcrypt = require("bcrypt");

const getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find({ email: fuzzySearch(".com") });
  if (users) {
    res.send(200, {
      message: "Get successful",
      payload: users,
    });
  } else {
    res.send(404, {
      message: "No users found",
    });
  }
});

const registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password, pic } = req.body;
  console.log("««««« email »»»»»", email);

  if (!name || !email || !password) {
    res.send(400);
    throw new Error("Invalid username");
  }
  const error = [];

  const userExits = await User.findOne({ email });
  const nameExits = await User.findOne({ name });

  if (userExits) error.push("User already exists");
  if (nameExits) error.push("Name already exists");
  if (error.length >= 1) {
    res.send(404, {
      message: error,
    });
  } else {
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
  }
});

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    console.log("««««« user.isOnline »»»»»", user.isOnline);
    // set status user
    if (user.isOnline) {
      res.send(400, {
        message: "User is not online, you can't access it",
      });
    } else {
      payload = await User.findOneAndUpdate(
        { email: email },
        { isOnline: true },
        { new: true }
      );
      if (payload) {
        res.send(200, {
          message: {
            _id: user._id,
            name: user.name,
            email: user.email,
            password: user.password,
            pic: user.pic,
            isAdmin: user.isAdmin,
            isOnline: user.isOnline,
            token: generateToken(user._id),
          },
        });
      }
    }
  } else {
    res.status(404);
    throw new Error("Invalid password or email ");
  }
});

const searchUsers = asyncHandler(async (req, res) => {
  const { keyword } = req.query;

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
  const updateUser = await User.findOne({
    name: req.body.name,
    _id: { $ne: req.query.id },
  });

  if (updateUser) {
    res.send(404, {
      message: "Name already exists",
    });
  }
  try {
    const userId = req.query.id;
    let { password } = req.body;

    let payload;
    if (password) {
      const salt = await bcrypt.genSalt(10); // 10 ký tự ABCDEFGHIK + 123456

      // generate password = salt key + hash key
      const hashPass = await bcrypt.hash(password, salt);
      payload = await User.findOneAndUpdate(
        { _id: userId },
        { ...req.body, password: hashPass },
        { new: true }
      );
    } else {
      console.log("««««« password  first»»»»»", password);
      password = undefined;
      typeof password === undefined;
      console.log("««««« password »»»»»", password, typeof password);
      payload = await User.findOneAndUpdate(
        { _id: userId },
        // loại trừ password
        { ...req.body, password: password },
        { new: true }
      );
      console.log("««««« payload »»»»»", payload);
    }

    if (!payload) {
      res.send(404, {
        error,
        message: "User not found",
      });
    } else {
      res.send(200, {
        message: "Updated",
        payload,
      });
    }
  } catch (error) {
    res.send(400, {
      error,
      message: "Update failed",
    });
  }
});

const newUser = asyncHandler(async (req, res) => {
  let fromDate = new Date();
  fromDate.setHours(0, 0, 0, 0);
  const query = {
    createdAt: { $gte: fromDate },
  };

  const newUsers = await User.find(query);
  const total = await newUsers.length;
  if (newUsers) {
    res.send(200, {
      message: "Get new users successfully",
      payload: {
        data: newUsers,
        total: total,
      },
    });
  } else {
    res.send(404, {
      message: "Get new users failed",
    });
  }
});

const deleteUser = asyncHandler(async (req, res) => {
  try {
    const { id } = req.query;
    console.log("««««« id »»»»»", id);

    const user = await User.findByIdAndDelete(id);
    if (user) {
      res.send(200, {
        message: "User deleted successfully",
      });
    } else {
      res.send(404, {
        message: "User not found",
      });
    }
  } catch (error) {
    console.log("««««« error »»»»»", error);
  }
});

//admin

const updateUserByAdmin = asyncHandler(async (req, res) => {
  const updateUser = await User.findOne({
    name: req.body.name,
    _id: { $ne: req.query.id },
  });

  if (updateUser) {
    res.send(404, {
      message: "Name already exists",
    });
  }
  try {
    const userId = req.query.id;
    console.log("«««««userId  »»»»»", userId);
    let { password } = req.body;
    let payload;
    console.log("««««« req.body »»»»»", req.body);
    if (password) {
      const salt = await bcrypt.genSalt(10); // 10 ký tự ABCDEFGHIK + 123456
      // generate password = salt key + hash key
      const hashPass = await bcrypt.hash(password, salt);
      payload = await User.findOneAndUpdate(
        { _id: userId },
        { ...req.body, password: hashPass },
        { new: true }
      );
    } else {
      password = undefined;
      typeof password === undefined;
      payload = await User.findOneAndUpdate(
        { _id: userId },
        { ...req.body, password: password, isAdmin: req.body.admin },
        { new: true }
      );
    }
    if (payload) {
      res.send(200, {
        message: "Updated user successfully",
        payload: payload,
      });
    } else {
      res.send(404, {
        message: "Updated user failed",
      });
    }
  } catch (error) {
    res.send(400, {
      error,
      message: "Update failed",
    });
  }
});

module.exports = {
  registerUser,
  authUser,
  searchUsers,
  updateUser,
  getAllUsers,
  newUser,
  deleteUser,
  updateUserByAdmin,
};
