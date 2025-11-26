import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Categoria } from "./Categoria.js";

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
  categoria_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Categoria,
      key: "categoria_id",
    },
  },
  nuevo_producto: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  }
}, {
  freezeTableName: true,
  timestamps: false 
});

// Relaciones
Categoria.hasMany(Producto, {
  foreignKey: "categoria_id",
  sourceKey: "categoria_id",
});
Producto.belongsTo(Categoria, {
  foreignKey: "categoria_id",
  targetKey: "categoria_id",
});