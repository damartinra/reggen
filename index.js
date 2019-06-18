const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const cors = require('cors')

require('dotenv').config()

const app = express()

const middlewares = require('./routes/middlewares')

app.use(express.json())
app.use(morgan('dev'))
app.use(cors({
    origin: '*',
    methods: '*',

}))
app.use(middlewares.checkTokenSetUser)

app.use('/user', require('./routes'))
app.use('/admin', middlewares.isAdmin, require('./api/admin'))
app.use('/registers', middlewares.isLoggedIn, require('./api/registers'))
app.use('/users', middlewares.isLoggedIn, require('./api/users'))

//Error handler
function errorHandler(err, req, res, next) {
    res.status(res.statusCode || 500);
    res.json({
        message: err.message,
        stack: err.stack
    });
}

app.use(errorHandler);

//Server
app.listen(3000, () => {
    console.log('Servidor corriendo en el puerto 3000...')
})

//Database
mongoose.connect('mongodb://localhost:27017/reggen', { useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true })
    .then(() => console.log('Base de datos conectada...')
    )