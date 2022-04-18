module.exports = {
  HOST: "localhost",
  USER: "root",
  PASSWORD: "",
  // set your database name here => DB: "database name"
  DB: "test",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
