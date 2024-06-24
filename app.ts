import express, { ErrorRequestHandler } from "express";
import { HttpError } from "http-errors";
// var express = require('express');
var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var tasksRouter = require('./routes/tasks')

const port = 3000;

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', (req: Express.Request, res: Response) => {
//   const name = "req.query.name;" // Assuming you have a query parameter called "name"
//   res.send(name)
// });
app.use("/", indexRouter)
app.use('/tasks', tasksRouter)
app.use("/static", express.static(path.join(__dirname, "public")))

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err: HttpError, req: express.Request, res: express.Response, next: express.NextFunction) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
const errorHandler: ErrorRequestHandler = (err: Error, req: express.Request, res: express.Response) => {
  res.status(500).send({ error: err.message })
}
app.use(errorHandler)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;
