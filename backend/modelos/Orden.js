import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { User } from "./User.js";
import { Pago } from "./Pago.js";
import { Envio } from "./Envio.js";

export const Orden = sequelize.define("orden", {
  id_orden: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  fecha_orden: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  estado: {
    type: DataTypes.STRING,
    defaultValue: "Pendiente",
  },
}, {
  freezeTableName: true,
});

// Relaciones
User.hasMany(Orden, { foreignKey: "usuario_id" });
Orden.belongsTo(User, { foreignKey: "usuario_id" });

Pago.hasOne(Orden, { foreignKey: "pago_id" });
Orden.belongsTo(Pago, { foreignKey: "pago_id" });

Envio.hasOne(Orden, { foreignKey: "envio_id" });
Orden.belongsTo(Envio, { foreignKey: "envio_id" });
