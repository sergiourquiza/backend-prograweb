import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const Horario = sequelize.define("Horario", {
  horarioId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  profesor: {
    type: DataTypes.STRING,
    defaultValue: "Prof"
  },
  dia: {
    type: DataTypes.STRING
  },
  horaInicio: {
    type: DataTypes.TIME
  },
  horaFin: {
    type: DataTypes.TIME
  },
  enlace: {
    type: DataTypes.STRING
  }
}, {
  freezeTableName: true
});
