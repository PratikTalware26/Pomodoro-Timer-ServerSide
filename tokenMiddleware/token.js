const dotenv= require("dotenv")
const jwt= require("jsonwebtoken")
const secret= process.env.SECRET

module.exports= function(req, res, next){
    try {
        let userToken= req.header('authorization')
        if(!userToken){
            return res.status(400).send("Token not found")
        }
        let userDecoded= jwt.sign(userToken, secret)
        req.user= userDecoded
        next()
    } catch (error) {
        return res.status(500).send(error.message)
    }
}