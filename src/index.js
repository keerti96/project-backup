const express = require("express")
const bodyParser = express.json()
// const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const app = express()
const route = require("./routes/route")
const multer= require("multer");
const { AppConfig } = require('aws-sdk');

app.use(bodyParser)
//app.use(bodyParser.urlencoded({ extended: true }));
app.use( multer().any())


mongoose.connect("mongodb+srv://Jagcho:71nEXJtXcYfVx8T6@cluster0.5bg4mzz.mongodb.net/group25Database"
    , { useNewUrlParser: true })
    .then(() => console.log("MongoDb is connected"))
    .catch(err => console.log(err))

app.use("/", route)


app.listen(process.env.PORT || 3001, function () { console.log("Express is running on port " + (process.env.PORT || 3001)) });

