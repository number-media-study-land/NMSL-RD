const Koa = require("koa");
const app = new Koa();
const views = require("koa-views");
const json = require("koa-json");
const onerror = require("koa-onerror");
const bodyparser = require("koa-bodyparser");
const logger = require("koa-logger");
const mongoose = require("mongoose");
const cors = require('koa2-cors');
// 引入radis中间件
const session = require("koa-generic-session");
const Redis = require("koa-redis");
// 引入数据库配置
const dbConfig = require("./dbs/config");
// 引入自定义中间间
const pv = require("./middleware/koa-pv");
// 引入路由
const index = require("./routes/index");
const users = require("./routes/users");
// 其他文件
const passport = require("./utils/passport");

// mongodb
mongoose.connect(dbConfig.dbs, {
  useNewUrlParser: true
});

// error handler
onerror(app);

// middlewares
app.keys = ["nmsl", "keyskeys"];
app.use(
  session({
    key: "nmsl",
    prefix: "nmsl:uid",
    store: new Redis()
  })
);
app.use(cors({
  origin: function (ctx) {
    return 'http://localhost:8080';
  },
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
  maxAge: 5,
  credentials: true,
  allowMethods: ['GET', 'POST', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}))
app.use(
  bodyparser({
    enableTypes: ["json", "form", "text"]
  })
);

app.use(pv());
app.use(json());
app.use(logger());
app.use(require("koa-static")(__dirname + "/public"));

app.use(
  views(__dirname + "/views", {
    extension: "pug"
  })
);
app.use(passport.initialize());
app.use(passport.session());

// logger
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// routes
app.use(index.routes(), index.allowedMethods());
app.use(users.routes(), users.allowedMethods());

// error-handling
app.on("error", (err, ctx) => {
  console.error("server error", err, ctx);
});

module.exports = app;
