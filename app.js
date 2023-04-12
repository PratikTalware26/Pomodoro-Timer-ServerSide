const express= require("express")
const mongoose = require('mongoose');
const registerRoute= require("./Routes/registerRoute")
const cors= require("cors")
const dotenv= require("dotenv")
dotenv.config()

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('Connected!'));

const app= express()
app.use(cors())
const port= 8081 || process.env.PORT

app.use("/api", registerRoute)

app.listen(port, ()=> console.log(`app is connected on port ${port}`))