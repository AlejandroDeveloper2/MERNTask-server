const express=require('express');
const connectDB=require('./config/db');
const cors=require('cors');
const request=require('request');

//Create the server
const app = express();
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});
  
app.get('/jokes/random', (req, res) => {
    request(
      { url: 'https://joke-api-strict-cors.appspot.com/jokes/random' },
      (error, response, body) => {
        if (error || response.statusCode !== 200) {
          return res.status(500).json({ type: 'error', message: err.message });
        }
  
        res.json(JSON.parse(body));
      }
    )
});
//Connect to the db
connectDB();

//run cors
app.use(cors());

//express.json
app.use(express.json({extended: true}));
// App port
const port = process.env.port || 5000;

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
app.listen(port, '0.0.0.0', ()=>{
    console.log(`The server works on ${PORT}`);
})