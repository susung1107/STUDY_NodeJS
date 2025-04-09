const Sequelize = require("sequelize");
const User = require("./user");

const env = process.env.NODE_ENV || "development";
const config = require("../config/config")[env];
const db = {};

// 생성자라서 여러개의 데이터베이스를 연결할 수 있음
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

db.sequelize = sequelize;

db.User = User;

User.init(sequelize);
User.associate(db);

module.exports = db;
