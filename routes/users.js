const router = require("koa-router")();
const Redis = require("koa-redis");
const nodeMailer = require("nodemailer");
const User = require("../dbs/models/users");
const UserStudy = require("../dbs/models/userStudy");
const Passport = require("../utils/passport");
const Email = require("../utils/smtp");

const Store = new Redis().client;

function getSalt() {
  const x = "0123456789qwertyuioplkjhgfdsazxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM";
  let emp = "";
  for (let i = 0; i < 5; i++) {
    emp += x.charAt(Math.ceil(Math.random() * 62));
  }
  return emp;
}

router.prefix("/users");
// 获取验证码
router.post("/verify", async ctx => {
  let email = ctx.request.body.email;

  // 检验邮箱是否被注册
  let DB_email = await User.find({ email });
  if (DB_email.length) {
    ctx.body = {
      code: 0,
      msg: "",
      data: {
        code: -1,
        msg: "该邮箱已被注册"
      }
    };
    return false;
  }

  // 检验是否已经发送过验证码
  const saveExpire = await Store.hget(`nodemail:${email}`, "expire");
  if (saveExpire && new Date().getTime() - saveExpire < 65000) {
    ctx.body = {
      code: 0,
      msg: "",
      data: {
        code: -1,
        msg: `验证请求过于频繁,1分钟内一次`
      }
    };
    return false;
  } else {
    // 创建邮件发送的内容
    let transporter = nodeMailer.createTransport({
      host: Email.smtp.host,
      port: 587,
      secure: false,
      auth: {
        user: Email.smtp.user,
        pass: Email.smtp.pass
      }
    });
    let ko = {
      code: Email.smtp.code(),
      expire: Email.smtp.expire,
      email
    };
    let mailOptions = {
      from: Email.smtp.user,
      to: ko.email,
      subject: "邮箱验证",
      html: `你的验证码是${ko.code}`
    };

    // 发送邮件
    let info = await transporter.sendMail(mailOptions);
    if (info.accepted.length > 0) {
      Store.hmset(
        `nodemail:${ko.email}`,
        "code",
        ko.code,
        "expire",
        ko.expire(),
        "email",
        ko.email
      );
      Store.expire(`nodemail:${ko.email}`, 300);
      ctx.body = {
        code: 0,
        msg: "",
        data: {
          code: 0,
          msg: "验证码发送成功,5分钟内有效"
        }
      };
    } else {
      ctx.body = {
        code: -1,
        msg: "邮件发送失败"
      };
    }
  }
});
// 注册端口
router.post("/register", async ctx => {
  const { email, password, name, code } = ctx.request.body;
  // 检验邮箱是否被注册
  let DB_email = await User.find({ email });
  if (DB_email.length) {
    ctx.body = {
      code: 0,
      msg: "",
      data: {
        code: -1,
        msg: "该邮箱已被注册"
      }
    };
    return false;
  }
  // 验证 验证码
  if (code) {
    const saveCode = await Store.hget(`nodemail:${email}`, "code");
    const saveExpire = await Store.hget(`nodemail:${email}`, "expire");
    if (code === saveCode) {
      if (new Date().getTime() - saveExpire > 300000) {
        ctx.body = {
          code: 0,
          msg: "",
          data: {
            code: -1,
            msg: "验证码已过期，请重新获取验证码"
          }
        };
        return false;
      }
    } else {
      ctx.body = {
        code: 0,
        msg: "",
        data: {
          code: -1,
          msg: "验证码错误"
        }
      };
      return false;
    }
  } else {
    ctx.body = {
      code: 0,
      msg: "",
      data: {
        code: -1,
        msg: "验证码不能为空"
      }
    };
    return false;
  }
  const salt = getSalt();
  const DB_pass = password + salt;

  // 保存数据到数据库
  let newUser = await User.create({
    email: email,
    password: DB_pass,
    name: name,
    salt: salt,
    role: 1
  });

  if (newUser) {
    await UserStudy.create({
      userId: newUser._id,
      studyList: []
    });
    ctx.body = {
      code: 0,
      msg: "",
      data: {
        code: 0,
        msg: "注册成功"
      }
    };
  } else {
    ctx.body = {
      code: -1,
      msg: "注册失败",
      data: {}
    };
  }
});
// 登录
router.post("/login", async (ctx, next) => {
  return Passport.authenticate("local", function(err, user, info, status) {
    if (err) {
      ctx.body = {
        code: -1,
        msg: err,
        data: {}
      };
    } else {
      if (user) {
        ctx.body = {
          code: 0,
          msg: "",
          data: {
            code: 0,
            msg: "登录成功",
            data: {
              email: user.email,
              name: user.name,
              _id: user._id
            }
          }
        };
        return ctx.login(user);
      } else {
        ctx.body = {
          code: 0,
          msg: "",
          data: {
            code: -1,
            msg: info
          }
        };
      }
    }
  })(ctx, next);
});
// 退出
router.get("/exit", async (ctx, next) => {
  await ctx.logout();
  if (!ctx.isAuthenticated()) {
    ctx.body = {
      code: 0,
      msg: "",
      data: {
        code: 0,
        msg: "已退出"
      }
    };
  } else {
    ctx.body = {
      code: -1,
      msg: "退出失败",
      data: {}
    };
  }
});
// 验证是否登录
router.get("/getUser", async (ctx, next) => {
  if (ctx.isAuthenticated()) {
    const { email, name, _id } = ctx.session.passport.user;
    ctx.body = {
      code: 0,
      msg: "",
      data: {
        code: 0,
        msg: "用户已登录",
        data: {
          _id,
          email,
          name
        }
      }
    };
  } else {
    ctx.body = {
      code: 0,
      msg: "",
      data: {
        code: -1,
        msg: "用户未登录"
      }
    };
  }
});
// 管理员登录
router.post("/Mlogin", async (ctx, next) => {
  const { user, password } = ctx.request.body;
  let DB_user = await User.findOne({ user });
  if (DB_user) {
    if (DB_user.password === password) {
      ctx.body = {
        code: 0,
        msg: "",
        data: {
          code: 0,
          msg: "success"
        }
      };
    } else {
      ctx.body = {
        code: 0,
        msg: "",
        data: {
          code: -1,
          msg: "用户名或者密码错误"
        }
      };
    }
  } else {
    ctx.body = {
      code: 0,
      msg: "",
      data: {
        code: -1,
        msg: "用户名或者密码错误"
      }
    };
  }
})
module.exports = router;
