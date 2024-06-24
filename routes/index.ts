import express from "express";
var router = express.Router();

/* GET home page. */
router.get('/', function (req: express.Request, res: express.Response) {
  res.render('index', { title: 'Express' });
  return
});

module.exports = router;
