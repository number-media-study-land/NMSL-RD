const mongoose = require("mongoose");

let usersSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  salt: {
    type: String,
    required: true
  },
  role: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model("User", usersSchema);
