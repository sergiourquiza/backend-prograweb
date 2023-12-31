import  express  from "express";
import { sequelize } from "./database/database.js";
import { Usuario } from "./models/Usuario.js";
import { Cita } from "./models/Cita.js";
import { Horario } from "./models/Horario.js";
import { ProfesorDisp } from "./models/DocentesDisponibles.js";
import { Calificacion } from "./models/Calificacion.js";
import { Alumno } from "./models/Alumno.js";
import { Docente } from "./models/Docente.js";
import cors from "cors";
import bodyParser from "body-parser"
import bcrypt from 'bcryptjs';
import { Op } from 'sequelize';
import diacritics from 'diacritics';
import multer from "multer";

const app = express()
app.use(express.json());
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
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

app.get('/calificaciones/init', async (req, res) => {
  try {
    await Calificacion.bulkCreate([
      {
        name: 'Andres',
        date: '23 de abril de 2021',
        rating: 5,
        comment: 'El profesor fue fabuloso'
      },
      {
        name: 'Pepe',
        date: '21 de abril de 2022',
        rating: 4,
        comment: 'El profesor fue muy bueno pero no me dedicaba tiempo'
      },
      {
        name: 'Steven',
        date: '8 de julio de 2023',
        rating: 3,
        comment: 'Se notaba conocimiento pero no lo lograba impartir bien'
      }
    ])
  } catch (e) {
    res.status(500).send("Error al agregar calificaciones");
  }
})

app.get('/calificaciones', async (req, res) => {
  try {
    const calificaciones = await Calificacion.findAll();
    res.send(calificaciones);
  } catch (e) {
    res.status(500).send("Error al obtener calificaciones");
  }
})

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

// Guardar o actualizar datos de un docente
app.post('/guardar-actualizar-docente', async (req, res) => {
  const { nombres, apellidos, tipoDocumento, numeroDocumento, fotoInput, cursos, universidad, carrera, titulo, descripcion, usuario, contraseñaActual, contraseñaNueva, contraseñaRepetir } = req.body;

  try {
    // Verificar si el docente existe en la base de datos
    const docenteExistente = await Docente.findOne({ where: { numeroDocumento } });

    if (docenteExistente) {
      // El docente ya existe, realizar actualización
      if (contraseñaActual !== docenteExistente.contraseña) {
        // La contraseña actual no coincide, devolver un error
        res.status(400).json({ message: 'La contraseña actual no es válida.' });
      } else if (contraseñaNueva && contraseñaNueva !== contraseñaRepetir) {
        // Las contraseñas nuevas no coinciden, devolver un error
        res.status(400).json({ message: 'Las contraseñas nuevas no coinciden.' });
      } else {
        // Crear un objeto con los datos de actualización
        const datosActualizacion = {
          nombres,
          apellidos,
          tipoDocumento,
          fotoInput,
          cursos,
          universidad,
          carrera,
          titulo,
          descripcion,
          usuario,
        };

        // Actualizar los datos del docente, incluyendo la contraseña si se proporciona
        if (contraseñaNueva) {
          datosActualizacion.contraseña = contraseñaNueva;
        }

        await Docente.update(datosActualizacion, { where: { numeroDocumento } });

        res.status(200).json({ message: 'Datos del docente actualizados exitosamente.' });
      }
    } else {
      // El docente no existe, entonces agrega
      await Docente.create({ nombres, apellidos, tipoDocumento, numeroDocumento, fotoInput, cursos, universidad, carrera, titulo, descripcion, usuario, contraseña: contraseñaNueva });

      res.status(200).json({ message: 'Datos del docente guardados exitosamente.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al guardar o actualizar los datos del docente.' });
  }
});


// Guardar o actualizar datos de un alumno
app.post('/guardar-actualizar-alumno', async (req, res) => {
  const { nombres, apellidos, tipoDocumento, numeroDocumento, fotoInput, universidad, carrera, usuario, contraseñaActual, contraseñaNueva, contraseñaRepetir } = req.body;

  try {
    // Verificar si el alumno ya existe en la base de datos
    const alumnoExistente = await Alumno.findOne({ where: { numeroDocumento } });

    if (alumnoExistente) {
      // El alumno ya existe, realizar actualización
      if (contraseñaActual !== alumnoExistente.contraseña) {
        // La contraseña actual no coincide, devolver un error
        res.status(400).json({ message: 'La contraseña actual no es válida.' });
      } else if (contraseñaNueva && contraseñaNueva !== contraseñaRepetir) {
        // Las contraseñas nuevas no coinciden, devolver un error
        res.status(400).json({ message: 'Las contraseñas nuevas no coinciden.' });
      } else {
        // Crear un objeto con los datos de actualización
        const datosActualizacion = {
          nombres,
          apellidos,
          tipoDocumento,
          fotoInput,
          universidad,
          carrera,
          usuario,
        };

        // Actualizar los datos del alumno, incluyendo la contraseña si se proporciona
        if (contraseñaNueva) {
          datosActualizacion.contraseña = contraseñaNueva;
        }

        await Alumno.update(datosActualizacion, { where: { numeroDocumento } });

        res.status(200).json({ message: 'Datos del alumno actualizados exitosamente.' });
      }
    } else {
      // El alumno no existe, entonces agrega
      await Alumno.create({ nombres, apellidos, tipoDocumento, numeroDocumento, fotoInput, universidad, carrera, usuario, contraseña: contraseñaNueva });

      res.status(200).json({ message: 'Datos del alumno guardados exitosamente.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al guardar o actualizar los datos del alumno.' });
  }
});

app.listen(port, () => {
    console.log(`Activado en el puerto: ${port}`)
    conexionDB()
})  