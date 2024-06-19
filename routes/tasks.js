const express = require("express")
const router = express.Router()

router.get("/", (req, res) => {
    res.send("Tasks Array should go here")
})

module.exports = router