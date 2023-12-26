const asyncHandler = require("express-async-handler");
const History = require("../models/historyModel");
const mongoose = require("mongoose");

// truy cập vào đoạn chat, với userId là biến truyền lên
//  req.user._id là id login vào

// lấy các đoạn chat của id đăng nhập
const createChat = asyncHandler(async (req, res) => {
  try {
    let id;
    id = req.query.id;
    const { question, answer, userId } = req.body;
    if (!id) {
      const history = await History.create({
        userId,
        question,
        answer,
      });
      if (history) {
        res.status(200).json({
          _id: history._id,
          question: history.question,
          answer: history.answer,
          password: history.password,
          userId: history.userId,
        });
      } else {
        res.status(404);
        throw new Error("Error creating user");
      }
    } else {
      const history = await History.findByIdAndUpdate(
        { _id: id },
        {
          userId,
          $push: {
            question: question,
            answer: answer,
          },
        },
        {
          new: true,
        }
      );
      if (history) {
        res.status(200).json({
          _id: history._id,
          question: history.question,
          answer: history.answer,
          password: history.password,
          userId: history.userId,
        });
      } else {
        res.status(404);
        throw new Error("here");
      }
    }
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const getMessages = asyncHandler(async (req, res) => {
  try {
    const id = req.query.id;
    const histories = await History.find({
      userId: id,
    }).sort({ createdAt: -1 });

    if (histories.length > 0) {
      const formattedHistories = histories.map((history) => ({
        _id: history._id,
        question: history.question,
        answer: history.answer,
        password: history.password,
        userId: history.userId,
      }));

      res.status(200).json(formattedHistories);
    } else {
      res.status(404).json({ message: "No history found for the user" });
    }
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const deleteHistory = asyncHandler(async (req, res) => {
  const { id } = req.query;

  try {
    const deleteMessage = await History.findOneAndDelete({ _id: id });
    if (!deleteMessage) {
      res.status(404).json({ success: false, message: "Can't find history" });
    }
    res.status(200).json({ success: true, message: "Delete successfully" });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

module.exports = { createChat, getMessages, deleteHistory };
