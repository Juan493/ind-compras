/* eslint-disable no-unused-vars */
'use strict';

/**
 * Module dependencies.
 */

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const logger = require('morgan');
const parseError = require('parse-error');
const passport = require('passport');

/**
 * Importacion de Variables de Entorno.
 */
const CONFIG = require('./config/config');

/**
 * Importacion de Rutas.
 */
const userRouter = require('./routes/user.routes');

/**
 * Declaracion de Middlewares y Configuraciones.
 */
const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(cors());

/**
 * Inicia instancia de Base de Datos
 */
console.log('Environment:', CONFIG.app);
const models = require('./models');
models.sequelize.authenticate()
	.then(() => {
		console.log('Connected to SQL database:', CONFIG.db_name);
	})
	.then(() => {
		if (CONFIG.app === 'development') {
			models.sequelize.sync({ force: true })// crea una tabla si aún no existen
				.then(() => console.log('Tables created successfully'))
				.catch(err => console.log('oooh, did you enter wrong database credentials?'));

		}
	})
	.catch(err => {
		console.error('Unable to connect to SQL database:', CONFIG.db_name, err);
	});


/**
 * Declaracion de Rutas.
 */
app.use('/api/user', userRouter);

// atrapar 404 y reenviar al controlador de errores
app.use(function (req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};
	res.status(err.status || 500);
});

module.exports = app;

//Esto está aquí para manejar todos los rechazos de promesa no alcanzados
process.on('unhandledRejection', error => {
	console.error('Uncaught Error', parseError(error));
});
