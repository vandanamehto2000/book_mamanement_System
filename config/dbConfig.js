const mongoose = require("mongoose");
const db = () => {
    mongoose.connect(
        "mongodb://127.0.0.1:27017/books"
    )
        .then(data => {
            console.log("connected to the database")
        })
        .catch(err => {
            console.log("cannot connected to the database", err)
        })
}
module.exports = db;