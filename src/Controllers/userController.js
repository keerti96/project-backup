const userModel= require("../model/userModel")
const bcrypt = require ('bcrypt');

//<========================Validation Functions=============>
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
let NameRegex = /^(?![\. ])[a-zA-Z\. ]+(?<! )$/
let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
let phoneRegex = /^[6-9]\d{9}$/   


//<==========================CreateUser API===========================>

const createUser = async function (req, res) {
    try {
        let data = req.body
        let files = req.files


        if (!files || files.length == 0) return res.status(400).send({ status: false, message: "Please enter image file!!" })


        let { fname, lname, email, address, password, phone } = data
        if (!keyValid(fname) || !NameRegex.test(fname)) return res.status(400).send({ status: false, message: "Please enter fname" })
        if (!keyValid(lname) || !NameRegex.test(lname)) return res.status(400).send({ status: false, message: "Please enter lname" })

        if (!keyValid(email)) return res.status(400).send({ status: false, message: "Please enter EmailId" })
        if (!emailRegex.test(email)) return res.status(400).send({ status: false, message: "Invalid email" })
        const findEmail = await userModel.findOne({ email: email })
        if (findEmail) return res.status(400).send({ status: false, msg: "Email Already exist!!!" })

        if (!phone) return res.status(400).send({ status: false, message: "Phone number is required" })
        if (!phoneRegex.test(phone)) return res.status(400).send({ status: false, message: "Invalid Number" })
        const existingMobile = await userModel.findOne({ phone: phone })
        if (existingMobile) return res.status(400).send({ status: false, message: "Mobile number is already exists" })



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


const loginUser= async function (req,res){
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

        //res.setHeader("x-auth-token", token);
        res.status(200).send({ status: true, token: token })

        return res.status(200).send({ status: true, token: token, msg: "author logged in successfully" });


    }
    catch (err) {
        return res.status(500).send(err.message);

    }
}



const getUser = async function (req, res) {
    try {
        const userId = req.params.userId;

        //<-----------------validating userId----------------------->

        //if userId is present
        // if(!userId){
        //     return res.status(400).send({ status: false, message: " Please provide a userId" });
        // }

        if (!isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: " enter a valid userId" });
        }

        //<---------------finding book with bookid----------------->
        const details = await userModel.findOne({ _id: userId});

        //console.log({...details});//<----check destructered output of moongodb call----->

        if (!details) {
            return res.status(404).send({ status: false, message: "Requested user not found!!!" });
        }

        res.status(200).send({ status: true, message: 'User profile details', data: details })
    } catch (err) {
        res.status(500).send({ status: false, message: err.message });
    }
}



module.exports={createUser, loginUser, getUser}
//module.exports={loginuser}
//module.exports = {getUser}