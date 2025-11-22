import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const Producto = sequelize.define("producto", {
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
    defaultValue: "Artefacto clasificado",
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
    defaultValue: "Raro",
  },
  categoria: {
    type: DataTypes.STRING,

  },
  nuevo_producto: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  nueva_categoria: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  descripcion_categoria: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  estado: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  }
}, {
  freezeTableName: true,
  timestamps: false 
});