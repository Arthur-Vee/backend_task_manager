import express, { ErrorRequestHandler } from "express"
import { HttpError } from "http-errors"
import mongoose from "mongoose"

var createError = require('http-errors')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
var cors = require('cors')

const indexRouter = require('./routes/index')
const tasksRouter = require('./routes/tasks')
const usersRouter = require('./routes/users')
const loginRouter = require('./routes/login')

const uri = `${process.env.DB_CONNCETION_STRING}`
const options = {
  dbName: `${process.env.DATABASE_NAME}`,
}

const port = 3000

var app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(cors())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use("/", indexRouter)
app.use('/tasks', tasksRouter)
app.use('/users', usersRouter)
app.use('/login', loginRouter)
app.use("/static", express.static(path.join(__dirname, "public")))

mongoose.connect(uri, options).then(() => { console.log("Connedted to database") }).catch((error) => {
  console.error("Error connecting to MongoDB:", error)
  process.exit(1)
})
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err: HttpError, req: express.Request, res: express.Response, next: express.NextFunction) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})
const errorHandler: ErrorRequestHandler = (err: Error, req: express.Request, res: express.Response) => {
  res.status(500).send({ error: err.message })
}
app.use(errorHandler)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})


module.exports = app
