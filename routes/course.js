const router = require("koa-router")();
const Courses = require("../dbs/models/courses");
const courseVideo = require("../dbs/models/courseVideo");

router.prefix("/course");

// 课程详情页端口
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
// 课程详情页-视频目录端口
router.get("/courseDetailVideoMenu", async (ctx, next) => {
  const { name } = ctx.request.query;

  let result = await courseVideo.findOne({name});
  if (result) {
    let videoList = result.videoList;
    videoList.map(item => {
      item.list.map(video => {
        delete video.src
        return video
      })
      return item
    })
    ctx.body = {
      code: 0,
      msg: "",
      data: {
        code: 0,
        msg: "success",
        data: result
      }
    };
  } else {
    ctx.body = {
      code: 0,
      msg: "",
      data: {
        code: -1,
        msg: "该课程没有教学视频，请联系管理员",
        data: {}
      }
    };
  }
})
// 查询所有课程端口
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
// 搜索课程端口
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
        msg: "课程不存在",
        data: {}
      }
    };
  }
});
// 课程学习页-查询视频端口
router.get("/courseVideoList", async (ctx, next) => {
  const {_id} = ctx.request.query;
  let course = await Courses.findOne({_id});
  if (course) {
    let result = await courseVideo.findOne({name:course.name});
    if (result) {
      ctx.body = {
        code: 0,
        msg: "",
        data: {
          code: 0,
          msg: "success",
          data: result
        }
      };
    } else {
      ctx.body = {
        code: 0,
        msg: "",
        data: {
          code: -1,
          msg: "该课程没有教学视频，请联系管理员",
          data: {}
        }
      };
    }
  } else {
    ctx.body = {
      code: 0,
      msg: "",
      data: {
        code: -1,
        msg: "课程不存在",
        data: {}
      }
    };
  }
})
module.exports = router;
