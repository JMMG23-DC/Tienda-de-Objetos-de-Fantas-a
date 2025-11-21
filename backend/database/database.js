import { Sequelize } from "sequelize";

// Nombre de BD, Nombre usuarios, Contraseña de Usuario
export const sequelize = new Sequelize("bdprograweb", "postgres", "admin1234", { 
  host: "bdprograweb.c7e664ucw625.us-east-2.rds.amazonaws.com",
  dialect: "postgres",
  port: 5432,
  dialectOptions: {
      ssl: {
          require: true,
          rejectUnauthorized: false // Esto evita errores de certificado con AWS
      }
  },
  logging: false // Opcional: para que no llene la consola de texto
});

// npm install sequelize pg
// npm install cors
// npm install express

