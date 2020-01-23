const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  // 변수를 쓰기위해 js로 config 파일을 변환했다.
  development: {
    username: "root",
    password: process.env.DB_PASSWORD,
    database: "react-sns",
    host: "127.0.0.1",
    dialect: "mysql"
  },
  test: {
    username: "root",
    password: process.env.DB_PASSWORD,
    database: "react-sns",
    host: "127.0.0.1",
    dialect: "mysql"
  },
  production: {
    username: "root",
    password: process.env.DB_PASSWORD,
    database: "react-sns",
    host: "127.0.0.1",
    dialect: "mysql",
    dialectOptions: {
      useUTC: false, //for reading from database
      dateStrings: true,
      typeCast: true
    },
    timezone: "+09:00" //for writing to database
  }
};
