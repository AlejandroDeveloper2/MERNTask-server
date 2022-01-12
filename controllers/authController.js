const User=require('../models/User')
const bcryptjs = require('bcryptjs')
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')


exports.authentUser=async (req, res) => {  
    //Check if there are any errors
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    //get email and password
    const {email, password}=req.body;

    try{
        //Check if it's a valid user
        let user=await User.findOne({email});
        if(!user){
            return res.status(400).json({msg:'User not found!'})
        }

        //Check password
        const correctPassword=await  bcryptjs.compare(password, user.password);
        if(!correctPassword){
            return res.status(400).json({msg:'Password incorrect!'})
        }

        //If everything is correct then Create and sign JWT
         const payload={
            user:{
                id:user.id
            }
        }
        //Sign JWT
        jwt.sign(payload, process.env.SECRET, {
            expiresIn:3600// 1 hour
        }, (error, token)=>{
            if(error) throw error;
            //Confirmation message
            res.json({token})
        })

    }catch(error){
        console.log(error)
    }
}
//Get authenticated User
exports.getAuthenticatedUser=async(req, res)=>{
    try{
        const user=await User.findById(req.user.id).select('-password')
        res.json({user})
    }catch(error){
        console.log(error)
        res.status(500).json({msg:'An error ocurred'})
    }
}