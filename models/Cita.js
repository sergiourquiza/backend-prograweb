import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const Cita = sequelize.define("Cita", {
  CitasID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Profesor: {
    type: DataTypes.STRING,
  },
  Alumno: {
    type: DataTypes.STRING,
  },
  Curso: {
    type: DataTypes.STRING,
  },
  DiaSemana: {
    type: DataTypes.STRING,
  },
  HoraInicio: {
    type: DataTypes.TIME,
  },
  HoraFin: {
    type: DataTypes.TIME,
  },
  Enlace: {
    type: DataTypes.STRING,
  },
  Estado: {
    type: DataTypes.STRING,
  },
}, {
  freezeTableName: true,
});
