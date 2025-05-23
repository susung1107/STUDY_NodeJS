const mongoose = require("mongoose");

const { Schema } = mongoose;

const roomSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  max: {
    type: Number,
    required: true,
    default: 10, // 기본
    min: 2, // 최소
  },
  owner: {
    type: String,
    required: true,
  },
  password: String,
  createAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Room", roomSchema);
