// npm install mongodb express cors dotenv mongoose
// mongodb: This package allows me to interact with a MongoDB DATABASE
// from my Node.js application. I use it to connect to the database
// perform CRUD operations, and manage data.
// express: Is a framework application for Node.js. It simplifies the process of
// creating web applications, API's and servers. It provides features for routing
// middleware, and handling HTTP Requests and responses.
// cors: (Cross-Origin Resource Sharing) is a security feature implemented in web
// browsers to prevent web pages from making requests to a different domain than
// the one served in the webpage/
// dotenv: This package helps me to manage environment variables in my Node.js
// we can store configuration information , such as API keys, database
// connection strings and other sensitive data.
// mongoose: is an Object-Dta Modeling library for MongoDB and Node.js
// I use it to define data models and perform database operations
// "Mongoose provides a higher-level, schema-based interface,"
// we mean that Mongoose offers a more user-friendly and structured way to work with MongoDB
// Nodemon automatically restarts your server when changes are detected. So, when you run npm run dev,
// it starts your server using nodemon to enable automatic server restarts as you make code changes.

// Right now this is a 
// This code is a basic setup for a Node.js web server using the Express
//  framework and connecting to a MongoDB database. 

//const app = express();: This line creates an instance of an Express application. 
// It's like setting up a blank canvas for building a web server.

// const port = process.env.PORT || 3550; determines the port where the server will listen
// for incoming requests. It checks if there's a predifined PORT environment variable
// and if not defaults to port 3550

// dotenv.config(); This line loads environment variables from an .env file int othe application
// it allows you to store configuration setting separately from your code

// app.use(express.json()); sets up the middleware to parse incopming JSON data.
// It enables the server to understand and work with JSON data sent requests
// //application to parse JSON request bodies.
// // refers to interpreting structured data formats like 
// //JSON (JavaScript Object Notation). When you parse a JSON string,
// // you convert it into a data structure that can be manipulated in your code,
// typically an object or dictionary.
// app.use(express.json()); 

//app.use(cors()); It allows the server to accept requestsfrom different domains or ports
// which is essential when your frontend and backend are on separate servers.

//mongoose.connection(process.env.MONGO_URI, { useNewUrlParser: true}); This line of code
// connects my server to a MongoDB Dtabase. It uses MONGO_URI environment variable to determine 
// the database's location

// app.listen(port, () => {     }) this line starts the server and makes it listen
// for incoming requests on the specified port. It also logs a message to the console
// to indicate the server is running

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Task from './models/task.mjs'

const app = express();
const port = process.env.PORT || 3550;
dotenv.config();

app.use(express.json());
app.use(cors());

// Now lets connect the MONGODB database

 mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });


app.get('/api/tasks', async (req, res) => {
    const task = await Task.find();
    res.json(task)

})

app.post('/api/tasks', async (req, res) => {
    const task = new Task(req.body);
    await task.save();
    res.status(201).json(task);

})

app.put('/api/tasks/:id', async (req, res) => {
    const taskId = req.params.id;
    const updatedTask = req.body;

    await Task.findByIdAndUpdate(taskId, updatedTask);
    res.json(updatedTask)

})

app.delete('/api/tasks/:id', async (req, res) => {
    const taskId = req.params.id;
    const task = await Task.findByIdAndDelete(taskId);

    if (!task) {
        return res.status(404).json({ message: 'Task Not Found' });
    }
    res.json({ message: 'Task has been deleted Successfully!' });
});


app.listen(port, () => {
    console.log(`Server is running on PORT ${port}`);
    console.log(`Server is connected to MongoDB`);
})