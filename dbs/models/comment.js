const mongoose = require("mongoose");

let comment = new mongoose.Schema({
  // 所属章节名
  progressName: {
    type: String,
    required: true
  },
  // 对应章节id
  videoId: {
    type: String,
    required: true
  },
  // 评论人
  commentUser: {
    type: String,
    required: true
  },
  // 评论内容
  commentContent: {
    type: String,
    required: true,
  },
  // 评论创建时间
  createTime:{
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Comment", comment);
