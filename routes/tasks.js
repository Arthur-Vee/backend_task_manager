const express = require("express")
const router = express.Router()

router.get("/", async (req, res) => {
    res.send("user went to /tasks route")
    
})

module.exports = router