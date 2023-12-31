import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const Calificacion = sequelize.define("Calificacion", {
    id_calificacion: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
    },
    date: {
        type: DataTypes.STRING,
    },
    rating: {
        type: DataTypes.INTEGER,
    },
    comment: {
        type: DataTypes.STRING,
    }
}, {
    freezeTableName: true,
});
