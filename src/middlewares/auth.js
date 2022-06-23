const jwt = require("jsonwebtoken");
//const authorModel = require('../models/authorModel')
const blogModel = require('../models/blogModel')


const authenticate = function(req, res, next){
    try{
        const token = req.headers["X-Api-Key"] || req.headers["x-api-key"]
        
        //If no token is present in the request header return error
        if (!token) return res.status(401).send({ status: false, msg: "token must be present" });
        
        
        // If a token is present then decode the token with verify function
        // verify takes two inputs:
        // Input 1 is the token to be decoded
        // Input 2 is the same secret with which the token was generated
        // Check the value of the decoded token yourself

        // Check if the token present is a valid token
        // Return a different error message in this case
        let decodedToken = jwt.verify(token, "group9");
        if (!decodedToken)
            return res.status(401).send({ status: false, msg: "token is invalid" });

        else{
            req['x-api-key'] = decodedToken;
            next();
        }
    }
    catch(err){
        res.status(500).send({status:false,error:err.message})
    }
    
  
}

const authorise = function(req, res, next) {

    try{
        const blogId = req.params.blogId
        if (!blogId) {//doubt
            return res.status(400).send({ status: false, msg: "please enter a blogId" })
        }

        const validBlog = blogModel.findById(blogId)
        // if (!isValidObjectId(blogId)) {
        //     return res.status(400).send({ status: false, msg: "blogId is not valid" })
        // }

        if (!validBlog)
            return res.status(404).send({ status: false, msg: "plese send a valid blogId" })


        // comapre the logged in author's id and the author id for requested blog
        

       

       let ownerOfBlog = validBlog.authorId;
        
        //userId for the logged-in user
        let authorId = req['x-api-key'].authorId

        //userId comparision to check if the logged-in user is requesting for their own data
        if(ownerOfBlog != authorId) 
            return res.status(403).send({status: false, msg: 'Author logged in is not allowed to modify the requested blog data'})

        //req.isDeleted = validBlog.isDeleted;

        next()
    }
    catch(err){
        res.status(500).send({status:false,error:err.message})
    }
}


module.exports = {authenticate, authorise } 

