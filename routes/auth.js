//Routes for auth users
const express=require('express');
const router=express.Router();
const auth=require('../middleware/auth');
const authController = require('../controllers/authController');

//Login an user
//Api/auth
router.post('/', 
    authController.authentUser
);
//get authenticated user
router.get('/',
    auth,
    authController.getAuthenticatedUser
);
module.exports=router;