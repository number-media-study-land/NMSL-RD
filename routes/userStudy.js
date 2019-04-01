const router = require("koa-router")();
const UserStudy = require("../dbs/models/userStudy");
const Courses = require("../dbs/models/courses");
const CourseVideo = require("../dbs/models/courseVideo");

router.prefix("/userStudy");

// 查询用户学习的课程
router.get("/userStudyList", async (ctx, next) => {
  const { userId } = ctx.request.query;
  let result = await UserStudy.findOne({ userId });
  console.log(ctx.request.query);
  if (result != null) {
    ctx.body = {
      code: 0,
      msg: "",
      data: {
        code: 0,
        msg: "success",
        data: result.studyList
      }
    };
  } else {
    ctx.body = {
      code: 0,
      msg: "",
      data: {
        code: 0,
        msg: "success",
        data: null
      }
    };
  }
});
// 查看用户是否学过该课程，学过则返回，没有则添加
router.post("/courseInUser", async (ctx, next) => {
  let { userId, courseId } = ctx.request.body;
  let result = await UserStudy.findOne({
    userId,
    studyList: { $elemMatch: { courseId } }
  });
  if (result) {
    // 如果学过该课程则返回
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
    // 如果没有学过课程则添加
    let courseInfo = await Courses.findOne({ _id: courseId });
    let courseCap = await CourseVideo.findOne({ name: courseInfo.name });
    let addCourseToUser = await UserStudy.update(
      { userId },
      {
        $push: {
          studyList: {
            courseId,
            name: courseInfo.name,
            cover: courseInfo.cover,
            progress: [1, 1],
            progressName: courseCap.videoList[0].list[0].title
          }
        }
      }
    );
    if (addCourseToUser) {
      ctx.body = {
        code: 0,
        msg: "",
        data: {
          code: 0,
          msg: "success",
          data: null
        }
      };
    }
  }
});
// 更新学习进度
router.post("/updateProgress", async (ctx, next) => {
  let { userId, courseId, progress, progressName } = ctx.request.body;
  let addCourseToUser = await UserStudy.findOneAndUpdate(
    { userId, "studyList.courseId": courseId },
    {
      $set: {
        "studyList.$.progress":progress,
        "studyList.$.progressName":progressName
      }
    }
  );
  console.log(addCourseToUser);
});
module.exports = router;
