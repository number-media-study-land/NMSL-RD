const router = require("koa-router")();
const Courses = require("../dbs/models/courses");

router.get("/newestCourse", async (ctx, next) => {
	let result = await Courses.find({}).limit(3).sort({_id: -1});
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
