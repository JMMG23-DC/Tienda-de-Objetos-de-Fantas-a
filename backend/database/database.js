import "dotenv/config";
import { Sequelize } from "sequelize";

// Configuración de Sequelize usando variables de entorno
export const sequelize = new Sequelize(
  process.env.DB_NAME || "bdprograweb",
  process.env.DB_USER || "postgres",
  process.env.DB_PASS || "admin1234",
  {
    host: process.env.DB_HOST || "bdprograweb.c7e664ucw625.us-east-2.rds.amazonaws.com",
    dialect: "postgres",
    port: Number(process.env.DB_PORT || 5432),
    dialectOptions: {
      ssl: {
        require: process.env.DB_SSL === "true" || true,
        rejectUnauthorized: false
      }
    },
    logging: false
  }
);
