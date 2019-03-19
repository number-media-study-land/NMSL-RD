const mongoose = require("mongoose");

let courseVideoSchema = new mongoose.Schema({
  // 课程名
  name: {
    type: String,
    required: true,
    unique: true
  },
  videoList: [{
    title: String,
    list: [{
      title: String,
      src: String
    }]
  }]
});

module.exports = mongoose.model("CourseVideo", courseVideoSchema);
