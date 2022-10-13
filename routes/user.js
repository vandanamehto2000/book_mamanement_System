const User = require("../models/userModel");
const Book = require("../models/bookModel");
const router = require("express").Router();
const checkUserAuth = require("../middleware/auth_middleware");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Cart = require("../models/cart");
const multer = require("multer");

// file upload

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "image")
    }, filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname)
        // cb(null, file.originalname)
    }

})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "image/jpg") {
        cb(null, true)
    } else {
        return cb(new Error("only jpg,png and jpeg is allow"))
    }

}

var upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
})


// register
router.post("/register", async (req, res) => {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
        return res.json({ msg: "This email is already exists, please login your account" })
    }
    else {
        let saltRound = 10;
        let password = req.body.password;
        let encryptedPassword = await bcrypt.hash(password, saltRound);
        user = new User({
            name: req.body.name,
            email: req.body.email,
            password: encryptedPassword,
            role: req.body.role
        })
        let data = await user.save()
        res.json({
            msg: "you have register successfully",
            data
        })
    }
})

// login
router.post("/login", async (req, res) => {
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.json({ msg: "email is incorrect" })
    }
    let secretkey = process.env.SECRETKEY;
    let comparePassword = await bcrypt.compare(req.body.password, user.password)
    if (comparePassword) {
        let token = jwt.sign({ email: req.body.email }, secretkey)
        res.json({
            msg: "you have login successfully",
            token
        })
    } else {
        res.json({ msg: "password does not match" })
    }
})

// user verify
router.get("/userVerify", (req, res) => {
    let secretkey = process.env.SECRETKEY;
    if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer") || !req.headers.authorization.split(" ")[1]) {
        return res.json({ msg: "please provide the token" })
    }
    let token = req.headers.authorization.split(" ")[1]
    let decode = jwt.verify(token, secretkey)
    res.json({ msg: "data has fetched successfully", decode })
})




router.put("/admin/changePassword", async (req, res) => {
    const { password, password_confirmation } = req.body;
    let secretkey = process.env.SECRETKEY;
    if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer") || !req.headers.authorization.split(" ")[1]) {
        return res.json({ msg: "please provide the token" })
    }
    let token = req.headers.authorization.split(" ")[1]
    let decode = jwt.verify(token, secretkey)
    let decodeEmail = decode.email

    if (password && password_confirmation) {
        if (password !== password_confirmation) {
            res.json({ msg: "password and password_confirmation does not match" })
        }
        else {
            let saltRound = 10;
            let newHashedPassword = await bcrypt.hash(password, saltRound)
            await User.updateMany({ email: decodeEmail }, { $set: { password: newHashedPassword } })
            res.json({ status: "success", message: "change password successfully" })
        }

    } else {
        res.json({ status: "failed", message: " all fields are required" })
    }
})



// update admin details by admin
// router.put("/admin/update/:email", checkUserAuth("admin"), async (req, res) => {
//     try {
//         let email = req.params.email
//         const data = await User.find({ email })
//         if (data) {
//             await User.updateMany(
//                 { email: req.params.email },
//                 {
//                     $set: {
//                         name: req.body.name
//                     }
//                 },
//                 { new: true })
//         }
//         console.log(data, "rrrrrrrrrr")
//         res.send("name updated")
//     }
//     catch (err) {
//         console.log(err, "qqqqqqqqqqq")
//         res.send(err)
//     }
// })

router.put("/admin/update", checkUserAuth("admin"), async (req, res) => {
    try {
        let secretkey = process.env.SECRETKEY;
        let token = req.headers.authorization.split(" ")[1]
        let decode = jwt.verify(token, secretkey)
        let decodeEmail = decode.email
        console.log(decodeEmail)
        let data = await User.updateMany({ email: decodeEmail }, req.body, { new: true })
        res.json({ msg: "data has updated successfully", data })

    }
    catch (err) {
        res.send(err);
    }
})



// delete admin account
// router.delete("/admin/delete/:email", checkUserAuth("admin"), async (req, res) => {
//     try {
//         let email = req.params.email
//         const data = await User.find({ email })
//         if (data) {
//             await User.deleteMany({ email })
//         }
//         res.send("data has deleted.....")

//     }
//     catch (err) {
//         res.send(err)
//     }
// })

router.delete("/admin/delete", checkUserAuth("admin"), async (req, res) => {
    try {
        let secretkey = process.env.SECRETKEY;
        let token = req.headers.authorization.split(" ")[1]
        let decode = jwt.verify(token, secretkey)
        let decodeEmail = decode.email
        console.log(decodeEmail)
        let data = await User.deleteMany({ email: decodeEmail })
        res.send("data has deleted successfully")
    }
    catch (err) {
        console.log(err);
        res.send(err)
    }
})


// read books by admin
router.get("/admin/readBook", checkUserAuth("admin"), async (req, res) => {
    try {
        let data = await Book.find()
        res.send(data)

    }
    catch (err) {
        res.send(err)
    }
})

// get book details by id form admin token 
router.get("/admin/readBook/:id", checkUserAuth("admin"), async (req, res) => {
    try {
        let data = await Book.findById(req.params.id)
        res.send(data)
    }
    catch (err) {
        res.send(err)
    }
})


// post book by admin
router.post("/books", upload.single("file"), checkUserAuth("admin"), async (req, res) => {
    let book = await Book.findOne({ BSN_no: req.body.BSN_no })
    if (book) {
        return res.json({ msg: "This BSN_no is already exists" })
    }
    book = new Book({
        bookName: req.body.bookName,
        bookAuthor: req.body.bookAuthor,
        bookPage: req.body.bookPage,
        bookPrice: req.body.bookPrice,
        bookState: req.body.bookState,
        BSN_no: req.body.BSN_no,
        bookImage: req.file.filename

    })
    let data = await book.save()
    res.json({ msg: "book has posted successfully", data })
})


// read book by user
router.get("/user/readBook", async (req, res) => {
    try {
        const data = await Book.find()
        res.send(data)
    }
    catch (err) {
        res.send(err)
    }
})


// read book details by id for user
router.get("/user/readBook/:id", async (req, res) => {
    try {
        const data = await Book.findById(req.params.id);
        res.send(data)
    }
    catch (err) {
        res.send(err)
    }
})


// update book deatils by admin
router.put("/book/update/:id", checkUserAuth("admin"), async (req, res) => {
    try {
        let data = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true })
        res.send(data)

    }
    catch (err) {
        res.send(err)
    }
})

// delete book by admin
router.delete("/book/delete/:id", checkUserAuth("admin"), async (req, res) => {
    try {
        let data = await Book.findByIdAndRemove(id)
        res.send("book has deleted....")
    }
    catch (err) {
        res.send(err)
    }
})


// add to cart 
router.post("/addToCart", async (req, res) => {
    try {
        let cartDetails = new Cart({
            productId: req.body.productId,
            quantity: req.body.quantity
        })

        let data = await cartDetails.save()
        res.send(data);
    }
    catch (err) {
        res.send(err)
    }
})


module.exports = router;