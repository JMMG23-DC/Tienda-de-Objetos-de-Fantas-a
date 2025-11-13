import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";



export const Envio = sequelize.define("envio", {
  entrega_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  metodo_envio: {
    type: DataTypes.STRING,
  },
  ciudad: {
    type: DataTypes.STRING,
  },
  direccion: {
    type: DataTypes.STRING,
  },
}, {
  freezeTableName: true,
});
