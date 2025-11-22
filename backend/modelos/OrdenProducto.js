import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Orden } from "./Orden.js";
import { Producto } from "./Producto.js";

export const OrdenProducto = sequelize.define("orden_producto", {
  id_orden_producto: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  subtotal: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
}, {
  freezeTableName: true,
});

// Relaciones
Orden.belongsToMany(Producto, { through: OrdenProducto, foreignKey: "orden_id" });
Producto.belongsToMany(Orden, { through: OrdenProducto, foreignKey: "producto_id" });

Orden.hasMany(OrdenProducto, { foreignKey: 'orden_id' });
OrdenProducto.belongsTo(Orden, { foreignKey: 'orden_id' });

Producto.hasMany(OrdenProducto, { foreignKey: 'producto_id' });
OrdenProducto.belongsTo(Producto, { foreignKey: 'producto_id' });