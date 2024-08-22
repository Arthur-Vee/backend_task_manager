"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var mongoose_1 = require("mongoose");
var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var indexRouter = require('./routes/index');
var tasksRouter = require('./routes/tasks');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login');
var uri = "".concat(process.env.DB_CONNCETION_STRING);
var options = {
    dbName: "".concat(process.env.DATABASE_NAME),
};
var port = 3000;
var app = (0, express_1.default)();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(cors());
app.use(logger('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express_1.default.static(path.join(__dirname, 'public')));
app.use("/", indexRouter);
app.use('/tasks', tasksRouter);
app.use('/users', usersRouter);
app.use('/login', loginRouter);
app.use("/static", express_1.default.static(path.join(__dirname, "public")));
mongoose_1.default.connect(uri, options).then(function () { console.log("Connedted to database"); }).catch(function (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
});
app.use(function (req, res, next) {
    next(createError(404));
});
// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
var errorHandler = function (err, req, res) {
    res.status(500).send({ error: err.message });
};
app.use(errorHandler);
app.listen(port, function () {
    console.log("Server is running on port ".concat(port));
});
module.exports = app;
