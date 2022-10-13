const User = require("../models/userModel")
const jwt = require("jsonwebtoken")

// function checkUserAuth(roles) {
//     return checkUserAuth[roles] || (checkUserAuth[roles] = async function (req, res, next) {
//         let isAllowed = false
//         console.log(roles, "rrrrrrrrrrr")
//         let id = req.params.id
//         console.log(id, "qqqqqqqqqqqqqq")


//         let data = await User.findById(id)
//         console.log(data, "tttttttttttttt")

// if (data.role === roles) {
//     isAllowed = true
// }

// if (!isAllowed) {
//     res.send(401, { message: 'Unauthorized' });
// } else {
//     next();
// }
//     });
// } 



function checkUserAuth(roles) {
    return checkUserAuth[roles] || (checkUserAuth[roles] = async function (req, res, next) {
        let isAllowed = false
        // let secretkey = "hjd748738hfj876484yuf";
        let secretkey = process.env.SECRETKEY;
        if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer") || !req.headers.authorization.split(" ")[1]) {
            return res.json({ msg: "please provide the token" })
        }
        let token = req.headers.authorization.split(" ")[1]
        let decode = jwt.verify(token, secretkey)
        let decodeData = decode.email
        let email = decodeData
        let data = await User.find({ email })
        if (data[0].role === roles) {
            isAllowed = true
        }

        if (!isAllowed) {
            res.send(401, { message: 'Unauthorized' });
        } else {
            next();
        }
    })
}

module.exports = checkUserAuth;