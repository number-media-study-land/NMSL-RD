const router = require("koa-router")();
const Comment = require("../dbs/models/comment");

router.prefix("/comment");

// 增加评论
router.post("/addComment", async (ctx, next) => {
  const comment = ctx.request.body;
  console.log(comment)

  let newComment = await Comment.create({
    ...comment.params
  });
  if (newComment) {
    ctx.body = {
      code: 0,
      msg: "",
      data: {
        code: 0,
        msg: "评论成功"
      }
    };
  } else {
    ctx.body = {
      code: -1,
      msg: "评论失败",
      data: {}
    };
  }
});

// 查询评论
router.get("/getComment", async (ctx, next) => {
  const {
    videoId
  } = ctx.request.query;

  let comments = await Comment.find({videoId}).sort({
    _id: -1
  })
  ctx.body = {
    code: 0,
    msg: "",
    data: {
      code: 0,
      msg: "success",
      data: {
        comments
      }
    }
  };
});

module.exports = router;
