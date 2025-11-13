import { Sequelize } from "sequelize";

// Nombre de BD, Nombre usuarios, Contraseña de Usuario
export const sequelize = new Sequelize("bdprograweb", "postgres", "admin123", {
  host: "localhost",
  dialect: "postgres",
  port: 5432,
});

// npm install sequelize pg
// npm install cors
// npm install express