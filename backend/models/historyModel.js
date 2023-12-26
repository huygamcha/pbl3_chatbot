const mongoose = require("mongoose");

const historyModel = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    question: {
      type: Array,
      required: true,
    },
    answer: {
      type: Array,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const History = mongoose.model("History", historyModel);
module.exports = History;
