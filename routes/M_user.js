const router = require("koa-router")();
const User = require("../dbs/models/users");

router.prefix("/manage/user");
// 获取用户列表
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
        data: { list, totalPage: Math.ceil(totalPage / pageItem) }
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
// 搜索用户信息
router.get("/searchUser", async (ctx, next) => {
  const { page = 1, pageItem = 20, searchVal, searchType } = ctx.request.query;
  let where;
  if (searchType === "_id") {
    where = {
      _id: searchVal
    };
  } else if (searchType === "email") {
    where = {
      email: searchVal
    };
  } else {
    where = {
      name: { $regex: searchVal }
    };
  }

  try {
    let result, totalPage;
    if (searchType === "name") {
      result = await User.find(where)
        .sort({ _id: -1 })
        .skip((page - 1) * pageItem)
        .limit(Number(pageItem))
        .select({ email: 1, name: 1 });

      totalPage = await User.find(where).countDocuments();
    } else {
      result = await User.findOne(where).select({ email: 1, name: 1 });
      totalPage = 1;
    }
    ctx.body = {
      code: 0,
      msg: "",
      data: {
        code: 0,
        msg: "success",
        data: { result, page, pageItem, totalPage: Math.ceil(totalPage / pageItem) }
      }
    };
  } catch (error) {
    ctx.body = {
      code: 0,
      msg: "",
      data: {
        code: 0,
        msg: "success",
        data: { page, pageItem, totalPage: 1 }
      }
    };
  }
});
module.exports = router;
