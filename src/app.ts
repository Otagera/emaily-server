//To  make sure any property i add to response or request would be recognized
declare module 'express-serve-static-core' {
	interface Response {
		statusJson: (statusCode: number, data: {})=>void
	}
}

import { Express } from 'express-serve-static-core';
import express, { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import createError from 'http-errors';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import dotenv from 'dotenv';
import * as http from 'http';
import { normalizePort, onError, onListening } from './middlewares/app_utility';

dotenv.config();

const app: Express = express();

/**
 * Create HTTP server.
 */
const server: http.Server = http.createServer(app);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use('/api/uploads', express.static('uploads'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use((req: Request, res: Response, next: NextFunction)=>{
	res.statusJson = (statusCode: number, data: {}): void=>{
		let obj = {
			...data,
			statusCode: statusCode
		}
		res.status(statusCode).json(obj);
		return;
	};
	next();
});

import { AppRouter } from './AppRouter';
app.use(AppRouter.getInstance());

import './controllers/RootController';
import './controllers/APIController';

// catch 404 and forward to error handler
app.use((req: Request, res: Response, next: NextFunction)=>{
  next(createError(404));
});

// error handler
app.use((err: any, req: Request, res: Response, next: NextFunction)=>{
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

/**
 * Module dependencies.
 */

var debug = require('debug')('emaily:server');

/**
 * Get port from environment and store in Express.
 */
var port: string = normalizePort(process.env.PORT || '3000');


app.set('port', port);


/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);