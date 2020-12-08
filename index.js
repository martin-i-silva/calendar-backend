const express = require('express')
require('dotenv').config()
const cors = require('cors');
const {dbConection} = require('./database/config')


// Crear el servidor de Express
const app = express()
const port = process.env.PORT

// Base de datos
dbConection()

// CORS
app.use(cors())

//Directorio Publico 
app.use(express.static(`public`))

// Lectura y Parseo del Body

app.use(express.json())


// RUTAS
// AUTH: register, login
app.use('/api/auth', require('./routes/auth'))
// CRUD: Eventos
app.use('/api/events', require('./routes/events')) 

// Escucahr peticiones
app.listen(port, () => console.log(`Example app listening on port port! ${port}`))