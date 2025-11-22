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

  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,   // 👈 Referencia correcta
      key: "user_id",
    },
  },

  pago_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Pago,   // 👈 Referencia correcta
      key: "pago_id",
    },
  },

  envio_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Envio,  // 👈 Referencia correcta
      key: "entrega_id",
    },
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


// Usuario -> Orden
User.hasMany(Orden, {
  foreignKey: "usuario_id",
  sourceKey: "user_id",
});
Orden.belongsTo(User, {
  foreignKey: "usuario_id",
  targetKey: "user_id",
});

// Pago -> Orden
Pago.hasOne(Orden, {
  foreignKey: "pago_id",
  sourceKey: "pago_id",
});
Orden.belongsTo(Pago, {
  foreignKey: "pago_id",
  targetKey: "pago_id",
});

// Envio -> Orden
Envio.hasOne(Orden, {
  foreignKey: "envio_id",
  sourceKey: "entrega_id",
});
Orden.belongsTo(Envio, {
  foreignKey: "envio_id",
  targetKey: "entrega_id",
});
