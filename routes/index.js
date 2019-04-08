const router = require("koa-router")();
const Courses = require("../dbs/models/courses");

// 查询最新3个课程端口
router.get("/newestCourse", async (ctx, next) => {
	let result = await Courses.find({ del: false, videos: true}).limit(3).sort({_id: -1});
	if (result != null) {
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
				code: 0,
				msg: "success",
				data: []
			}
		};
	}
});

module.exports = router;
