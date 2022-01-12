const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    //Read header's token 
    const token=req.header('x-auth-token');

    //Check if there's not a token
    if(!token){
        return res.status(401).json({msg:"There's not token, please try again!"})
    }
    //Validate token
    try{
        const encoded=jwt.verify(token, process.env.SECRET);
        req.user=encoded.user;
        next();
        
    }catch(error){
        res.status(401).json({msg:"Token is not valid!"})
    }
}