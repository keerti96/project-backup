const collegeModel = require("../models/collegeModel")
// const internModel = require("../models/internModel")

const mongoose = require("mongoose")

// const isValidObjectId = function (objectId) {
//     return mongoose.Types.ObjectId.isValid(objectId)
// }

const isValidRequestBody = function (requestBody){
    return Object.keys(requestBody).length > 0;
}

const isValid = function(value){
    if(typeof value === 'undefined' || value === null) return false;
    if(typeof value === 'string' && value.trim().length === 0) return false;
    return true;    
} 


const createCollege = async function (req, res) {
    try{
        //<<----------Validation of request body parameters--------->>  
        const requestBody = req.body
        console.log(requestBody)

        if (!isValidRequestBody(requestBody)){
            return res.status(400).send({ status: false, message: "Request body is empty!! Please provide the college details" })
        }

        const {name, fullName, logoLink} = requestBody;

        if(!isValid(name)){
            return res.status(400).send({ status: false, message: "Please provide the name of college" })
        }

        if(!isValid(fullName)){
            return res.status(400).send({ status: false, message: "Please provide the fullName of college" })
        }

        if(!isValid(logoLink)){
            return res.status(400).send({ status: false, message: "Please provide the logoLink of college" })
        }

        //----check if name is unique
        const nameCheck=await collegeModel.find({name:name})
        if(nameCheck.length!=0){
            return res.status(400).send({ status: false, message: "this name(abbr) already exists" })
        }


        //<----create a college document---->
        const savedData = await collegeModel.create(requestBody)
        res.status(201).send({ status: true, data: savedData })
    }
    catch (err) {
        res.status(500).send({ status: false, error: err.message })
    }

}

module.exports = {createCollege}


