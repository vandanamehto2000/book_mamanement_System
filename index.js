const express = require("express");
const app = express();
const dotenv = require("dotenv").config()

const db = require("./config/dbConfig");

app.use(express.json())

const userController = require("./routes/user");
app.use(userController)

let port = process.env.PORT
app.listen(port, () => {
    console.log(`server has started on port ${port}`)
})

db();