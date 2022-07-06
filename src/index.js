const express=require("express")
const bodyParser=require("body-parser")
const mongoose= require("mongoose")
const app=express()
const route=require("./routes/route")

app.use(bodyParser.json())

mongoose.connect("mongodb+srv://Jagcho:71nEXJtXcYfVx8T6@cluster0.5bg4mzz.mongodb.net/group25Database",{useNewUrlParser:true})
.then(()=>console.log("MongoDb is connected"))
.catch(err=>console.log(err.message))

app.use("/",route)



app.listen(process.env.PORT||3000,function(){console.log("Express is running on port"+(process.env.PORT||3000))})

