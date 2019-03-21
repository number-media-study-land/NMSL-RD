const router = require("koa-router")();
const Courses = require("../dbs/models/courses");
const courseVideo = require("../dbs/models/courseVideo");

router.prefix("/manage/course");
// 创建新课程
router.post("/addCourse", async (ctx, next) => {
  const course = ctx.request.body;
  let result = await Courses.findOne({ name: course.name });
  if (result) {
    ctx.body = {
      code: 0,
      msg: "",
      data: {
        code: -1,
        msg: "已有该课程，请不要重新添加"
      }
    };
  } else {
    let newCourse = await Courses.create(course);
    if (newCourse) {
      ctx.body = {
        code: 0,
        msg: "",
        data: {
          code: 0,
          msg: "课程添加成功"
        }
      };
    } else {
      ctx.body = {
        code: -1,
        msg: "课程添加失败",
        data: {}
      };
    }
  }
});
// 创建课程视频
router.post("/addCourseVideo", async (ctx, next) => {
  const params = ctx.request.body;
  console.log(params);
  let result = await courseVideo.findOne({ name: params.name });
  if (result) {
    ctx.body = {
      code: 0,
      msg: "",
      data: {
        code: -1,
        msg: "已有该课程，请不要重新添加"
      }
    };
  } else {
    let newCourse = await courseVideo.create(params);
    if (newCourse) {
      ctx.body = {
        code: 0,
        msg: "",
        data: {
          code: 0,
          msg: "视频添加成功"
        }
      };
    } else {
      ctx.body = {
        code: -1,
        msg: "视频添加失败",
        data: {}
      };
    }
  }
});

module.exports = router;
