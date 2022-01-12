const Project=require('../models/Project');
const {validationResult}=require('express-validator');

exports.createProject=async (req, res)=>{
    //Check if there are errors
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    try{
        //Create a new project
        const project=new Project(req.body);

        //Save project creator
        project.creator=req.user.id

        project.save();
        res.json(project);

    }catch(error){
        console.log(error);
        res.status(500).send('An error occurred');
    }
}
//Get all projects of current user
exports.getProjects=async(req, res)=>{
    try{
        const projects=await Project.find({creator:req.user.id}).sort({creationDate:-1})
        res.json({projects});
    }catch(error){
        console.log(error);
        res.status(500).send('An error occurred');
    }
}
//Update a project
exports.updateProject=async(req, res)=>{
    //Check if there are errors
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    //get project data
    const {name}=req.body;
    const newProject={};
    if(name){
        newProject.name=name;
    }

    try{
        //Check id project
        let project= await Project.findById(req.params.id);
        //If project exists
        if(!project) {
            return res.status(404).json({msg:'Project not found'})
        }
        //verify  Project's creator
        if(project.creator.toString()!== req.user.id){
            return res.status(401).json({msg:'No authorized'})
        }
        //Update project
        project=await Project.findByIdAndUpdate({_id:req.params.id}, {$set:
            newProject}, {new:true});
        res.json({project})

    }catch(error){
        console.log(error);
        res.status(500).send('A server error occurred');
    }
}
//Delete project
exports.deleteProject=async(req, res)=>{  
    try{
        //Check id project
        let project= await Project.findById(req.params.id);
        //If project exists
        if(!project) {
            return res.status(404).json({msg:'Project not found'})
        }
        //verify  Project's creator
        if(project.creator.toString()!== req.user.id){
            return res.status(401).json({msg:'No authorized'})
        }
        //Delete Project
        await Project.findByIdAndRemove({_id:req.params.id});
        res.json({msg:'Project deleted!'});

    }catch(error){
        console.log(error);
        res.status(500).send('A server error occurred')
    }
}