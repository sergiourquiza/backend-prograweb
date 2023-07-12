import { sequelize } from "../database/database.js";
import { DataTypes } from "sequelize";

export const Usuario = sequelize.define("Usuario", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    username : {
        type: DataTypes.STRING,
    },
    email : {
        type: DataTypes.STRING,
    },
    password : {
        type: DataTypes.STRING,
    },
    nombre : {
        type: DataTypes.STRING,
    },
    apellido : {
        type: DataTypes.STRING,
    },
    tipo_documento : {
        type: DataTypes.STRING,
    },
    numero_documento : {
        type: DataTypes.STRING,
    },
    rol : {
        type: DataTypes.STRING,
    }
}, {
    freezeTableName: true,
    timestamps: false,
});