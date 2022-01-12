const User=require('../models/User')
const bcryptjs = require('bcryptjs')
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')

exports.createUser=async(req, res)=>{

    //Check if there are any errors
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    //get email and password
    const {email, password}=req.body;


    try{
        //Check if the created user is unique 
        let user=await User.findOne({email});

        if(user){
            return res.status(400).json({msg:'User already exists!'})
        }
        //Create a new user
        user=new User(req.body);
        //Hash password
        const salt=await bcryptjs.genSalt(10);
        user.password = await bcryptjs.hash(password, salt);

        //Save the new user
        await user.save();
        //Create and sign JWT
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
        res.status(400).send('An error has occurred')
    }
}