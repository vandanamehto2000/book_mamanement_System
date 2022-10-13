const mongoose = require("mongoose")

const bookSchema = new mongoose.Schema({
    bookName: {
        type: String,
        required: true
    },
    bookAuthor: {
        type: String,
        required: true
    },
    bookPage: {
        type: Number,
        required: true
    },
    bookPrice: {
        type: Number,
        required: true
    },
    bookState: {
        type: String,
        enum: ["Available", "Not Available"],
        required: true
    },
    BSN_no: {
        type: Number,
        unique: true,
        required: true
    },
    bookImage: {
        type: String,
        required: true
    }

}, { timestamps: true })

const books = new mongoose.model("books", bookSchema)
module.exports = books;