require("dotenv").config();

const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_DIALECT } = process.env;

module.exports = {
  development: {
    username: DB_USER || "postgres",
    password: DB_PASSWORD || "postgres",
    database: DB_NAME || "wa_api",
    host: DB_HOST || "127.0.0.1",
    dialect: DB_DIALECT || "postgres",
    logging: false,
  },
  test: {
    username: "root",
    password: null,
    database: "database_test",
    host: "127.0.0.1",
    dialect: "mysql",
  },
  production: {
    username: DB_USER || "postgres",
    password: DB_PASSWORD || "postgres",
    database: DB_NAME || "wa_api",
    host: DB_HOST || "127.0.0.1",
    dialect: DB_DIALECT || "postgres",
    logging: false,
  },
};
