import dotenv from "dotenv";
dotenv.config();
import { Sequelize } from "sequelize";


const {
  DB_NAME = "bdprograweb",
  DB_USER = "postgres",
  DB_PASS = "admin1234",
  DB_HOST = "bdprograweb.c7e664ucw625.us-east-2.rds.amazonaws.com",
  DB_PORT = 5432,
  DB_SSL = "true",
} = process.env;

export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  dialect: "postgres",
  port: DB_PORT,
  dialectOptions: {
    ssl: DB_SSL === "true" ? { require: true, rejectUnauthorized: false } : false,
  },
  logging: false, // Opcional: para que no llene la consola de texto
});

// npm install sequelize pg
// npm install cors
// npm install express

