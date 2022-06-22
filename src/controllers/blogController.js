const timestamp = require('time-stamp')
const authorModel = require('../models/authorModel')
const blogModel = require('../models/blogModel')
//--------------------------------------------CREATEBLOG-------------------------------------------------------------
const createBlog = async function (req, res) {
    try {
        const data = req.body
        if (Object.keys(data).length == 0)
            return res.status(400).send({ status: false, msg: "please send the data" })
        authorid = await authorModel.findById(data.authorId)
        if (!authorid)
            return res.status(404).send({ status: false, msg: "enter a valid authorId" })
        
            const savedData = await blogModel.create(data)
        res.status(201).send({ status: true, msg: savedData })
    }
    catch (err) {
        res.status(500).send({ status: false, error: err.message })
    }
}

//----------------------------------------------GETBLOG--------------------------------------------------------------

const getBlog = async function (req, res) {
    try {
        const check = req.query

        if (Object.keys(check).length == 0) {
            const getData = await blogModel.find({ $and: [{ isDeleted: false }, { isPublished: true }] }).populate('authorId')
            return res.status(200).send({ status: true, msg: getData })
        }
        else {
            //fetch all query parameters
            const {authorId,category,tags,subcategory} = req.query;
            
            const filters = {}
            
            if (authorId) {
                filters.authorId = authorId
            }
            if (category) {
                filters.category = category
            }
            if (tags) {
                filters.tag = tags
            }
            if (subcategory) {
                filters.subcategory = subcategory
            }
            const savedData = await blogModel.find({ $and: [{ isDeleted: false }, { isPublished: true }, filters] }).populate("authorId")
            res.status(200).send({ status: true, msg: savedData })
        }
    }
    catch (err) {
        res.status(500).send({ status: false, error: err.message })
    }
}


//---------------------------------------------AUTHORLOGIN---------------------------------------------------------------

const authorLogin=async function(req ,res){
    try{
        const check = req.body
        if (Object.keys(check) == 0) {
            return res.status(400).send({ status: false, msg: "no credentials recieved in request" })
        }
    
        let userName = req.body.emailId;
        let password = req.body.password;

        let user = await userModel.findOne({ emailId: userName, password: password });
        if (!user)
            return res.status(403).send({
            status: false,
            msg: "username or the password is not corerct",
            });

        // Once the login is successful, create the jwt token with sign function
        // Sign function has 2 inputs:
        // Input 1 is the payload or the object containing data to be set in token
        // The decision about what data to put in token depends on the business requirement
        // Input 2 is the secret
        // The same secret will be used to decode tokens
        let token = jwt.sign(
            {
            author: user._id.toString(),
            batch: "thorium",
            organisation: "FunctionUp",
            },
            "functionup-radon"
        );
        res.setHeader("x-auth-token", token);
        res.status(200).send({ status: true, token: token });
        console.log(token);
    }
    catch(err){
        res.status(500).send({status:false,error:err.message})  
    }
}

//--------------------------------------------UPDATE BLOG-----------------------------------------------------------
const updateBlog = async function (req, res) {
    try {
        const blogId = req.params.blogId
        if (!blogId) {
            return res.status(400).send({ status: false, msg: "please send blogId" })
        }


        const validId = await blogModel.findById(blogId)

        if (!validId)
            return res.status(404).send({ status: false, msg: "plese send a valid blogId" })

        const check = req.body
        if (Object.keys(check) == 0) {
            return res.status(400).send({ status: false, msg: "no data recieved to update" })
        }

        let {title,body, tags, subcategory} = req.body;

        const update = {}
        if (title) {
            update.title = title
        }
        if (body) {
            update.body = body
        }
        if (tags) {
            update.tags = tags
        }
        if (subcategory) {
            update.subcategory = subcategory
        }
        update.isPublished='true'
        const time = timestamp('YYYY/MM/DD:mm:ss')
        update.publishedAt=time
        const updateData = await blogModel.findOneAndUpdate({ _id: blogId }, update, { new: true })
        res.status(200).send({ status: true, msg: updateData })
    }
    catch (err) {
        res.status(500).send({ status: false, error: err.message })
    }
}

//-------------------------------------------DELETE-BY-ID-----------------------------------------------------------

const deleteById = async function (req, res) {
    try {
        const blogId = req.params.blogId
        if (!blogId) {
            return res.status(400).send({ status: false, msg: "please enter a blogId" })
        }
        const validId = await blogModel.findById(blogId)
        if (!validId)
            return res.status(404).send({ status: false, msg: "plese send a valid blogId" })
        if (validId.isDeleted === 'true')
            return res.status(404).send({ status: false, msg: "resource not found!!! already deleted" })
        
            const time = timestamp('YYYY/MM/DD:mm:ss')
        const update = { isDeleted: true, deletedAt: time }
        const saveData = await blogModel.findOneAndUpdate({ _id: blogId }, update)
        res.status(200).send({ status: true, msg: "Deleted Sucessfully" })

    }
    catch (err) {
        res.status(500).send({ status: false, error: err.message })
    }
}

//---------------------------DELETEBLOG by filters-------------------------------------------------

const deleteBlog = async function (req, res) {
    try {
       const check=req.query
       if(Object.keys(check).length==0){
           res.status(400).send({status:false,msg:"no data recieved in request"})
       }

       let {category, authorId,tags, subcategory} = req.query
       filter={}
       if(category){
        filter.category = category
        }
       if(authorId){
        filter.authorId = authorId}
       if(tags){
        filter.tags = tags
        }
       if(subcategory){
        filter.subcategory = subcategory
       }
      // if(req.query.is){filter.=req.query}
      const time = timestamp('YYYY/MM/DD:mm:ss')
      update={isDeleted:true,deletedAt:time}
      const saveData = await blogModel.updateMany(filter,update)
      res.status(200).send({ status: true, msg: "Deleted Sucessfully" })
        }
    catch (err) {
        res.status(500).send({ status: false, error: err.message })
    }
}


module.exports = {createBlog, deleteById, deleteBlog, getBlog, updateBlog, authorLogin}
