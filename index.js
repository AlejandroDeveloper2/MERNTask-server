const express=require('express');
const connectDB=require('./config/db');
const cors=require('cors');

//Create the server
const app = express();

//Connect to the db
connectDB();

//run cors
app.use(cors());

//express.json
app.use(express.json({extended: true}));
// App port
const PORT = process.env.PORT || 5000;

//Import routes
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/tasks', require('./routes/tasks'));
// // Define the main page
// app.get('/', (req, res) => {
//     res.send('hello world')
// })

//Run the app
app.listen(PORT, ()=>{
    console.log(`The server works on ${PORT}`);
})