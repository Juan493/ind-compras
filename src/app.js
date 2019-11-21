/* eslint-disable no-unused-vars */
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import logger from 'morgan';
import parseError from 'parse-error';
import passport from 'passport';
import path from 'path';

import CONFIG from './config/config';

import userRouter from './routes/userRoutes';

const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(express.static(path.join(__dirname, '../public')));
app.use(cors());

//Log Env
console.log('Environment:', CONFIG.app);

// routes
app.use('/user', userRouter);

// catch 404 and forward to error handler
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

	// render the error page
	res.status(err.status || 500);
});

//This is here to handle all the uncaught promise rejections
process.on('unhandledRejection', error => {
	console.error('Uncaught Error', parseError(error));
});

export default app;