const mongoose = require("mongoose");

let coursesSchema = new mongoose.Schema({
  // 课程名
  name: {
    type: String,
    required: true,
  },
  // 课程类型
  type: {
    type: String,
    required: true
  },
  // 难度
  level: {
    type: String,
    required: true
  },
  // 简介
  intro: {
    type: String,
    required: true
  },
  // 详细介绍
  detail: {
    type: String,
    required: true
  },
  // 学习时间
  time: {
    type: String,
    required: true
  },
  // 封面
  cover: {
    type: String,
    required: true
  },
});

module.exports = mongoose.model("Course", coursesSchema);
