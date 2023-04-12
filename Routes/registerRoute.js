const express= require("express")
const registerModel= require("../Model/registerModel")
const bcrypt= require("bcrypt")
const jwt= require("jsonwebtoken")
const dotenv= require("dotenv")
dotenv.config()

const router= express.Router()
router.use(express.json())

const secret= process.env.SECRET

//REGISTER
router.post("/user",async (req, res)=>{
    try {
        // console.log(req.body)
        const existingUser= await registerModel.findOne({email:req.body.email})
        if(existingUser){
            return res.status(400).send("Email already exists")
        }
        bcrypt.hash(req.body.password, 10, async function (err, hash) {
            // Store hash in your password DB.
            if(err){
                return res.status(400).send(err.message)
            }
            const newUser= await registerModel.create({
                name:req.body.name,
                email:req.body.email,
                password:hash
            })
            return res.status(200).send("Success")
        });

    } catch (error) {
        return res.status(400).send(error.message)
    }
})

//LOGIN
router.post('/userLogin', async (req, res)=>{
    try {
        const user= await registerModel.findOne({email:req.body.email})
        if(!user){
            return res.status(400).send("user not found please register or enter valid credentials")
        }
        bcrypt.compare(req.body.password, user.password, function(err, result) {
            // result == true
            if(err){
                return res.status(400).send(err.message)
            }
            if(result){
                let userPayload= {userId: user.id};
                jwt.sign(userPayload, secret, {expiresIn:"1h"}, (error, token)=>{
                    if(error){
                        return res.status(400).send(error.message)
                    }
                    return res.status(200).send({status:"Success", token:token})
                })
            }
        });

    } catch (error) {
        return res.status(400).send(error.message)
    }
})

module.exports= router