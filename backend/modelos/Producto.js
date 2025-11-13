import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const Producto = sequelize.define("producto", {
  // 👇 LA CLAVE PRIMARIA DEBE LLAMARSE ASÍ
  id_producto: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.TEXT,
  },
  precio: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  imagen_url: {
    type: DataTypes.STRING,
  },
  rareza: {
    type: DataTypes.STRING,
  },
  categoria: {
    type: DataTypes.STRING,
  },
}, {
  freezeTableName: true,
  timestamps: false 
});