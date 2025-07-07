import express from "express"
var router = express.Router()

router.get('/', function (req: express.Request, res: express.Response) {
  res.render('index', { title: 'Express' })
  return
})

module.exports = router
