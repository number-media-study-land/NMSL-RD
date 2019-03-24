const mongoose = require("mongoose");

let userStudySchema = new mongoose.Schema({
  // 用户id
  userId: {
    type: String,
    required: true,
  },
  // 学习目录
  studyList: [{
    courseId: String,
    name: String,
    cover: String,
    progress: Array,
    progressName: String,
  }]
});

module.exports = mongoose.model("UserStudy", userStudySchema);
