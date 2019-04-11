const mongoose = require("mongoose");

let comment = new mongoose.Schema({
  // 视频id
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
  // 评论回复
  commentResponse: [{
    // 回复人
    responseUser: String,
    // 被回复的人
    beResponseUser: String,
    // 回复内容
    responseContent: String,
    // 回复时间
    responseTime: String,
  }]
});

module.exports = mongoose.model("Comment", comment);
