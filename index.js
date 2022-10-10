const express = require("express");
const app = express();
const multer = require("multer");


const db = require("./config/dbConfig");

app.use(express.json())

const userController = require("./routes/user");
app.use(userController)

app.listen(8000, () => {
    console.log("server has started on port 8000")
})



// // file upload

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, "image")
//     }, filename: function (req, file, cb) {
//         cb(null, Date.now() + file.originalname)
//     }

// })

// const fileFilter = (req, file, cb) => {
//     if (file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "image/jpg") {
//         cb(null, true)
//     } else {
//         return cb(new Error("only jpg,png and jpeg is allow"))
//     }

// }

// var upload = multer({
//     storage: storage,
//     limits: {
//         fileSize: 1024 * 1024 * 5
//     },
//     fileFilter: fileFilter
// })

// app.post("/upload",upload.single("file"), (req, res) => {
//     res.send("file upload")

// })



db();