module.exports = {
  dbs: "mongodb://localhost:27017/nmsl",
  redis: {
    get host() {
      return "localhost";
    },
    get port() {
      return 6379;
    }
  }
};
