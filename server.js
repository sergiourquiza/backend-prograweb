import  express  from "express";
import { sequelize } from "./database/database.js";
import {Usuario} from "./models/Usuario.js";
import cors from "cors";
import bodyParser from "body-parser"

const app = express()
app.use(express.json());
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

const port = process.env.PORT || 3001;

async function conexionDB() {
    try {
        await sequelize.authenticate();
        await sequelize.sync({ force: false});
        console.log("Conexion exitosa");
    } catch (error) {
        console.log("Error en la conexion");
    }
}


app.get('/crear-usuario/:username/:email/:password/:nombre/:apellido/:tipo_documento/:numero_documento/:rol', async (req, res) => {
    let username = req.params.username
    let email = req.params.email
    let password = req.params.password
    let nombre = req.params.nombre
    let apellido = req.params.apellido
    let tipo_documento = req.params.tipo_documento
    let numero_documento = req.params.numero_documento
    let rol = req.params.rol

    await Usuario.create({
        username: username,
        email: email,
        password: password,
        nombre: nombre,
        apellido: apellido,
        tipo_documento: tipo_documento,
        numero_documento: numero_documento,
        rol: rol
    })
    res.send(`Usuario creado satisfactoriamente`)
})

app.get('/listar-usuarios', async (req, res) => {
    let usuarios = await Usuario.findAll();
    res.json(usuarios)
})


app.get("/", (req, res) => {
    res.send("Bienvenido a mi API");
});

app.post('/api/login', async (req, res) => {
    const {username, password} = req.body;
    console.log(req.body);
    const user = await Usuario.findOne({where: {username: username, password: password}});
    if(user){
        res.json({message: 'Login exitoso'});
    }else{
        res.json({message: 'Usuario o contraseña incorrectos'});
    }
});


app.listen(port, () => {
    console.log(`Activado en el puerto: ${port}`)
    conexionDB()
})  