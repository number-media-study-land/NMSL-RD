module.exports = {
  smtp: {
    get host() {
      return "smtp.qq.com";
    },
    get user() {
      return "610033941@qq.com";
    },
    get pass() {
      return "tpkukoxdzpdfbdjf";
    },
    get code() {
      return () => {
        return Math.random()
          .toString(16)
          .slice(2, 6)
          .toUpperCase();
      };
    },
    get expire() {
      return () => {
        return new Date().getTime();
      };
    }
  }
};
