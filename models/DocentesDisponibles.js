import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const ProfesorDisp = sequelize.define("ProfesorDisp", {
    ProfesorDispID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
    },
    university: {
        type: DataTypes.STRING,
    },
    course: {
        type: DataTypes.STRING,
    },
    //Puede ser uno o varios días de la semana entre lunes y sábado
    dias_disponible: {
        type: DataTypes.ARRAY(DataTypes.STRING),
    }
}, {
    freezeTableName: true,
});
