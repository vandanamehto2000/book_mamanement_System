const mongoose = require("mongoose")
const cartSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "bookModel",
        required:true
    },
    quantity: {
        type: Number,
        required: true
    }
}, { timestamps: true })

const carts = new mongoose.model("carts", cartSchema)
module.exports = carts;
