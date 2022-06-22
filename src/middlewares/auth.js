const jwt = require("jsonwebtoken");


const authenticate = function(req, res, next){
    try{
        let token = req.headers["x-Api-key"];
        if (!token) token = req.headers["x-api-key"];

        //If no token is present in the request header return error
        if (!token) return res.send({ status: false, msg: "token must be present" });
        
        
        // If a token is present then decode the token with verify function
        // verify takes two inputs:
        // Input 1 is the token to be decoded
        // Input 2 is the same secret with which the token was generated
        // Check the value of the decoded token yourself

        // Check if the token present is a valid token
        // Return a different error message in this case
        let decodedToken = jwt.verify(token, "functionup-radon");
        if (!decodedToken)
            return res.status(401).send({ status: false, msg: "token is invalid" });

        else{
            req.decodedToken = decodedToken;
            next();
        }
    }
    catch(err){
        res.status(500).send({status:false,error:err.message})
    }
    
  
}

const authorise = function(req, res, next) {

    try{
        // comapre the logged in author's id and the author id for requested blog
        
        let userToBeModified = req.params.userId
        //userId for the logged-in user
        let {userId} = req.decodedToken

        //userId comparision to check if the logged-in user is requesting for their own data
        if(userToBeModified != userId) 
            return res.status(403).send({status: false, msg: 'Author logged in is not allowed to modify the requested blog data'})

        next()
    }
    catch(err){
        res.status(500).send({status:false,error:err.message})
    }
}


module.exports = {authenticate, authorise } 

