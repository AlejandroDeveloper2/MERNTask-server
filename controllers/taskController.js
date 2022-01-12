const Task=require('../models/Task');
const Project=require('../models/Project');
const {validationResult}=require('express-validator')

//Create a new Task
exports.createTask=async(req, res) => {
    //Check if error ocurred
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    //Get the project to find out if it exists
    const{project}=req.body;

    try{
        const existProject=await Project.findById(project);
        if(!existProject){
            return res.status(404).json({msg: 'Project not found'})
        }
        //Check if current project belongs to the logged user
        if(existProject.creator.toString()!== req.user.id){
            return res.status(401).json({msg:'No authorized'})
        }
        //Create task
        const task=new Task(req.body);
        await task.save();
        res.json({task});

    }catch(error){
        console.log(error);
        res.status(500).send("An error occurred")
    }
}

//get tasks per project
exports.getTasks=async(req, res)=>{

    try{
        //Get the project to find out if it exists
        const{project}=req.query;

        const existProject=await Project.findById(project);
        if(!existProject){
            return res.status(404).json({msg: 'Project not found'})
        }
        //Check if current project belongs to the logged user
        if(existProject.creator.toString()!== req.user.id){
            return res.status(401).json({msg:'No authorized'})
        }
        //Get tasks per project
        const tasks=await Task.find({project}).sort({created:-1});
        res.json({ tasks});

    }catch(error){
        console.log(error);
        res.status(500).send("An error ocurred")
    }
}

//Update task
exports.updateTask=async(req, res) => {
    try {

        //Get the project to find out if it exists
        const{project, name, status }=req.body;

        //if task exists
        let task = await Task.findById(req.params.id);

        if(!task) {
            return res.status(404).json({msg:'That task was not found'})
        }
        //get the project
        const existProject=await Project.findById(project);
      

        //Check if current project belongs to the logged user
        if(existProject.creator.toString()!== req.user.id){
            return res.status(401).json({msg:'No authorized'})
        }

        //Create an object with new information
        const newTask={};

        newTask.name = name;                 
        newTask.status = status;          

        //Update task
        task=await Task.findOneAndUpdate({_id:req.params.id}, newTask,
            {new:true} );
        res.json({task});

    }catch(error){
        console.log(error);
        res.status(500).send("An error ocurred");
    }
}

//Delete a task
exports.deleteTask=async(req, res) => {
    try {

        //Get the project to find out if it exists
        const{project}=req.query;

        //if task exists
        let task = await Task.findById(req.params.id);

        if(!task) {
            return res.status(404).json({msg:'That task was not found'})
        }
        //get the project
        const existProject=await Project.findById(project);
      

        //Check if current project belongs to the logged user
        if(existProject.creator.toString()!== req.user.id){
            return res.status(401).json({msg:'No authorized'})
        }

        //delete
        await Task.findByIdAndRemove({_id:req.params.id});
        res.json({msg:'Task deleted successfully!'})
        
    }catch(error){
        console.log(error);
        res.status(500).send("An error ocurred");
    }
}