module.exports = {
  dbs: "mongodb://localhost:27017/test",
  redis: {
    get host() {
      return "localhost";
    },
    get port() {
      return 6379;
    }
  }
};
