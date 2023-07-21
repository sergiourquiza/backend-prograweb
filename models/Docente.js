import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const Docente= sequelize.define("Docente", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombres:{
        type: DataTypes.STRING
    },
    apellidos:{
        type: DataTypes.STRING
    },
    tipoDocumento:{
        type:DataTypes.STRING
    },
    numeroDocumento:{
        type: DataTypes.INTEGER
    },
    fotoInput:{
        type: DataTypes.BLOB,
        allowNull: true
    },
    universidad:{
        type: DataTypes.STRING,
    },
    carrera:{
        type: DataTypes.STRING,
    },
    cursos:{
        type: DataTypes.STRING,
    },
    titulo:{
        type: DataTypes.STRING,
    },
    descripcion:{
        type: DataTypes.STRING,
    },
    usuario:{
        type: DataTypes.STRING,
    },
    contraseña: {
        type: DataTypes.STRING,
    },
   
},{
    freezeTableName: true
})

