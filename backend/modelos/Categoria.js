import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const Categoria = sequelize.define("categoria", {
  categoria_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  nueva_categoria: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  }
}, {
  freezeTableName: true,
  timestamps: false 
});