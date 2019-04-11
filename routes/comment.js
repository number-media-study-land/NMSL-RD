const router = require("koa-router")();
const Comment = require("../dbs/models/comment");

router.prefix("/comment");

// 增加评论
router.get("/addComment", async (ctx, next) => {

});

// 增加回复
router.get("/addResponse", async (ctx, next) => {

});

// 查询评论
router.get("/getComment", async (ctx, next) => {

});

module.exports = router;
