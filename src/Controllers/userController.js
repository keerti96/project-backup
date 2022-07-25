const userModel= require("../model/userModel")
const bcrypt = require ('bcrypt');








const createUser = async function (req, res) {
    try {
        let data = req.body
        let files = req.files


        if (!files || files.length == 0) return res.status(400).send({ status: false, message: "Please enter image file!!" })


        
const keyValid = (key) => {
    if (typeof (key) === 'undefined' || typeof (key) === 'null') return false
    if (typeof (key) === 'String' && key.trim().length === 0) return false
    if (typeof (key) == 'Number' && key.toString().trim().length == 0) return false
    return true
}

const isValidObjectId = function (ObjectId) {
    return mongoose.Types.ObjectId.isValid(ObjectId)
}

const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0;
};

        

        let { fname, lname, email, address, password, phone } = data



        let uploadedFileURL = await awsConfig.uploadFile(files[0])
        data.profileImage = uploadedFileURL

        let saltRounds = await bcrypt.genSalt(10)
        let encryptedPassword = await bcrypt.hash(password, saltRounds)
        let data1 = {
            fname: fname,
            lname: lname,
            email: email,
            profileImage: uploadedFileURL,
            phone: phone,
            password: encryptedPassword,
            address: address

        }
        const createUser = await userModel.create(data1)
        return res.status(201).send({ status: true, data: createUser })

    } catch (err) {
        console.log(err)
        res.status(500).send({ status: false, message: err.message })
    }
}


const loginuser= async function (req,res){
    try{
        let userName=req.body.email;
        let password=req.body.password;
        if(!userName){
            return res.status(400).send({status:false,msg:"email is required"})
        }
        if(!password){
            return res.status(400).send({status:false,msg:"password is required"})
        }
        let user = await userModel.findOne({email:userName,password:password})
        if(!user){
            return res.status(400).send({status:false,msg:"Invalid Email or Password"})
        }

        let token = jwt.sign(
            {
                userId:user_Id.toString(),
                batch:"radon",
                organization:"FunctionUp",
            },
            "functionup-radon-secretKey"
        );

        res.setHeader("x-auth-token", token);
        res.status(200).send({ status: true, token: token })

        return res.status(200).send({ status: true, token: token, msg: "author logged in successfully" });


    }
    catch (err) {
        return res.status(500).send(err.message);

    }
}

module.exports={createUser}
module.exports={loginuser}