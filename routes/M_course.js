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
    let newCourse = await Courses.create({...course});
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
// 更新课程
router.post("/updateCourse", async (ctx, next) => {
  const course = ctx.request.body;
  let result = await Courses.update(
    { name: course.name },
    {
      name: course.name,
      type: course.type,
      level: course.level,
      intro: course.intro,
      detail: course.detail,
      time: course.time,
      cover: course.cover
    }
  );
  if (result) {
    ctx.body = {
      code: 0,
      msg: "",
      data: {
        code: 0,
        msg: "更新成功"
      }
    };
  } else {
    ctx.body = {
      code: 0,
      msg: "",
      data: {
        code: -1,
        msg: "更新失败"
      }
    };
  }
});
// 删除课程
router.post("/delCourse", async (ctx, next) => {
  const course = ctx.request.body;
  let result = await Courses.update(
    { _id: course._id },
    { del: true }
  );
  if (result) {
    ctx.body = {
      code: 0,
      msg: "",
      data: {
        code: 0,
        msg: "删除成功"
      }
    };
  } else {
    ctx.body = {
      code: 0,
      msg: "",
      data: {
        code: -1,
        msg: "删除失败"
      }
    };
  }
});
// 创建课程视频
router.post("/addCourseVideo", async (ctx, next) => {
  const params = ctx.request.body;
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
      await Courses.update(
        { name: params.name },
        { videos: true }
      );
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
