import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const Alumno= sequelize.define("Alumno", {
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
    usuario:{
        type: DataTypes.STRING,
    },
    contraseña: {
        type: DataTypes.STRING,
    },
   
},{
    freezeTableName: true
})
/*
Alumno.hasMany(Curso,{
    foreignKey: "alumnoId",
    sourceKey: "id"
})

Curso.hasMany(Alumno,{
    foreignKey: "cursoId",
    sourceKey:"id"
})
*/