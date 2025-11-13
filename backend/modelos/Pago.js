import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const Pago = sequelize.define("pago", {
  pago_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  fecha_pago: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  estado_pago: {
    type: DataTypes.STRING,
  },
  metodo_pago: {
    type: DataTypes.STRING,
  },
}, {
  freezeTableName: true,
});
