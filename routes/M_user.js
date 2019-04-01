const router = require("koa-router")();
const User = require("../dbs/models/users");

router.prefix("/manage/user");
// 创建新课程
router.get("/getUserList", async (ctx, next) => {
  const { page = 1, pageItem = 20 } = ctx.request.query;
  let list = await User.find({ role: 1 })
    .sort({ _id: -1 })
    .skip((page - 1) * pageItem)
    .limit(Number(pageItem))
    .select({ email: 1, name: 1 });
  let totalPage = await User.find({ role: 1 }).countDocuments();
  if (list) {
    ctx.body = {
      code: 0,
      msg: "",
      data: {
        code: 0,
        msg: "success",
        data: { list, totalPage: Math.ceil(totalPage / 20) }
      }
    };
  } else {
    ctx.body = {
      code: 0,
      msg: "",
      data: {
        code: 0,
        msg: "success",
        data: { totalPage: 1 }
      }
    };
  }
});

module.exports = router;
