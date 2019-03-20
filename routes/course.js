const router = require("koa-router")();
const Courses = require("../dbs/models/courses");

router.prefix("/course");

router.post("/addCourse", async (ctx, next) => {
  const course = ctx.request.body;
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
});

router.get("/courseDetail", async (ctx, next) => {
  const { _id } = ctx.request.query;
  try {
    let result = await Courses.findOne({ _id });
    ctx.body = {
      code: 0,
      msg: "",
      data: {
        code: 0,
        msg: "success",
        data: result
      }
    };
  } catch (error) {
    ctx.body = {
      code: 0,
      msg: "",
      data: {
        code: -1,
        msg: "该课程不存在",
        data: {}
      }
    };
  }
});

router.get("/courseList", async (ctx, next) => {
  const { page, pageItem, ...params } = ctx.request.query;
  try {
    let list = await Courses.find(params)
      .sort({ _id: -1 })
      .skip((page - 1) * pageItem)
      .limit(Number(pageItem));
    let totalPage = await Courses.find(params).countDocuments();
    ctx.body = {
      code: 0,
      msg: "",
      data: {
        code: 0,
        msg: "success",
        data: { list, totalPage: Math.ceil(totalPage / 30) }
      }
    };
  } catch (error) {
    ctx.body = {
      code: 0,
      msg: "",
      data: {
        code: -1,
        msg: "没有课程",
        data: {}
      }
    };
  }
});

router.get("/searchCourse", async (ctx, next) => {
  const { page, pageItem, ...params } = ctx.request.query;
  try {
    let result = await Courses.find({
      name: { $regex: params.name }
    })
      .sort({ _id: -1 })
      .skip((page - 1) * pageItem)
      .limit(Number(pageItem));
    let totalPage = await Courses.find({
      name: { $regex: params.name }
    }).countDocuments();
    ctx.body = {
      code: 0,
      msg: "",
      data: {
        code: 0,
        msg: "success",
        data: { result, totalPage: Math.ceil(totalPage / 30) }
      }
    };
  } catch (error) {
    ctx.body = {
      code: 0,
      msg: "",
      data: {
        code: -1,
        msg: "没有课程",
        data: {}
      }
    };
  }
});
module.exports = router;
