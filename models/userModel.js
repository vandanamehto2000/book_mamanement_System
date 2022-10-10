const mongoose = require("mongoose");
const adminDetails = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: false,
        default: "user"
    }
}, { timestamps: true })

const user = new mongoose.model("users", (adminDetails));
module.exports = user;