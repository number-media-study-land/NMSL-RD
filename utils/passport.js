const passport = require("koa-passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../dbs/models/user");

passport.use(new LocalStrategy({
  usernameField: 'email'
  },
  async function(username, password, done) {
    let where = {
      email: username
    };
    let result = await User.findOne(where);
    if (result != null) {
      if (result.password === password+result.salt) {
        return done(null, result);
      } else {
        return done(null, false, "密码错误");
      }
    } else {
      return done(null, false, "用户不存在");
    }
  })
);

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  return done(null, user);
});

module.exports = passport;
