import  express  from "express";
import { sequelize } from "./database/database.js";
import {Usuario} from "./models/Usuario.js";
import cors from "cors";
import bodyParser from "body-parser"
import bcrypt from 'bcryptjs';


const app = express()
app.use(express.json());
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

const port = process.env.PORT || 3001;

async function conexionDB() {
    try {
        await sequelize.authenticate();
        await sequelize.sync({ force: true});
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

    //Encriptar contraseña
    const saltRounds = 10; 
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    if(await Usuario.findOne({where: {username: username}}, {where: {email: email}}, {where: {numero_documento: numero_documento}})){
        res.send(`El usuario ya existe`)
    }
    else{
    await Usuario.create({
        username: username,
        email: email,
        password: hashedPassword,
        nombre: nombre,
        apellido: apellido,
        tipo_documento: tipo_documento,
        numero_documento: numero_documento,
        rol: rol
    })
    res.send(`Usuario creado satisfactoriamente`)
    }
})

app.get('/listar-usuarios', async (req, res) => {
    let usuarios = await Usuario.findAll();
    res.json(usuarios)
})


app.get("/", (req, res) => {
    res.send("Bienvenido a mi API");
});

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await Usuario.findOne({ where: { username: username } });

        if (!user) {
            res.json({ message: 'Usuario o contraseña incorrectos' });
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (isPasswordValid) {
            res.json({ message: 'Login exitoso' });
        } else {
            res.json({ message: 'Usuario o contraseña incorrectos' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ha ocurrido un error en el servidor' });
    }
});

app.get("/agregar-cita", async function (req, res) {
    const { profesor, alumno, curso, diaSemana, horaInicio, horaFin, enlace, estado } = req.query;
  
    try {
      const nuevaCita = await Cita.create({
        Profesor: profesor,
        Alumno: alumno,
        Curso: curso,
        DiaSemana: diaSemana,
        HoraInicio: horaInicio,
        HoraFin: horaFin,
        Enlace: enlace,
        Estado: estado,
      });
  
      res.send("Cita agregada satisfactoriamente");
    } catch (error) {
      console.log("Error al agregar cita:", error);
      res.status(500).send("Error al agregar cita");
    }
});

app.get("/mostrar-citas", async function (req, res) {
  const citas = await Cita.findAll();
  res.send(citas);
});

app.get("/eliminar-cita/:id", async function (req, res) {
  const id = req.params.id;
  await Cita.destroy({
    where: {
      CitasID: id,
    },
  });
  res.send("Cita eliminada");
});

app.get("/guardar-horario/:dia/:horaInicio/:horaFin/:enlace", async function(req, res) {
  let dia = req.params.dia;
  let horaInicio = req.params.horaInicio;
  let horaFin = req.params.horaFin;
  let enlace = req.params.enlace;

  await Horario.create({
    dia: dia,
    horaInicio: horaInicio,
    horaFin: horaFin,
    enlace: enlace
  });

  res.send("Horario de atención creado satisfactoriamente");
});

app.get("/listar-horarios", async function(req, res) {
  const horarios = await Horario.findAll();

  res.send(horarios);
});

app.get("/eliminar-horario/:horarioId", async function(req, res) {
  await Horario.destroy({
    where: {
      horarioId: req.params.horarioId
    }
  });

  res.send("Horario de atención eliminado");
});

app.get('/docentes-disponibles/init', async (req, res) => {
  try {
    // Crea al menos 5 docentes diferentes en la base de datos usando bulkCreate
    await ProfesorDisp.bulkCreate([
      {
        name: 'Pepe',
        university: 'Universidad de Lima',
        course: 'Ingeniería de Sistemas',
        dias_disponible: ['lunes', 'jueves', 'viernes', 'sabado']
      },
      {
        name: 'Steven',
        university: 'Universidad de Lima',
        course: 'Programación Web',
        dias_disponible: ['martes', 'jueves', 'sabado']
      },
      {
        name: 'Sergio',
        university: 'Universidad de Ibagué',
        course: 'Programación Móvil',
        dias_disponible: ['lunes', 'martes']
      },
      {
        name: 'Valentina',
        university: 'Universidad de Lima',
        course: 'Programación Web',
        dias_disponible: ['lunes', 'miercoles', 'viernes']
      },
      {
        name: 'Random',
        university: 'Universidad de Lima',
        course: 'Random Course',
        dias_disponible: ['martes', 'jueves', 'sabado']
      }
    ]);

    res.send("Docentes creados satisfactoriamente");
  } catch (e) {
    res.status(500).send("Error al agregar docentes");
  }
});

const normalizeString = (str) => diacritics.remove(str).toLowerCase();

app.post('/docentes-disponibles', async (req, res) => {
  const { search, fecha } = req.body;

  try {
    let filteredData;
    if (search) {
      // Realiza la búsqueda por nombre si se proporciona un valor de búsqueda
      filteredData = await ProfesorDisp.findAll({
        where: {
          name: {
            [Op.iLike]: `%${search}%`
          }
        }
      });
    } else if (fecha) {
      // Realiza la búsqueda por fecha si se proporciona una fecha en el cuerpo de la solicitud
      const normalizedFecha = normalizeString(fecha);
      console.log("Esta es la fecha " + normalizedFecha)
      filteredData = await ProfesorDisp.findAll({
        where: {
          dias_disponible: {
            [Op.contains]: [normalizedFecha]
          }
        }
      });
      console.log("Encontré: " + filteredData.toString())
    } else {
      // Si no se proporciona ni el valor de búsqueda ni la fecha, se envía toda la lista de docentes disponibles
      filteredData = await ProfesorDisp.findAll();
    }

    res.send(filteredData);
  } catch (e) {
    res.status(500).send("Error al obtener docentes");
  }
});

app.listen(port, () => {
    console.log(`Activado en el puerto: ${port}`)
    conexionDB()
})  