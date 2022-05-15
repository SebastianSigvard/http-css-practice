const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const express = require('express');
const bcrypt = require('bcryptjs');
const path = require('path');

const app = express();

mongoose.connect('mongodb://localhost:27017/calCounter');

app.use(express.static('./public'))
app.use(bodyParser.json());


app.get('/', async (request, response) => {
    response.sendFile( path.resolve(__dirname,'./public/index.html'));
});

app.post('/login', async (request, response) => {
    const {userName, password} = request.body;

    response.send( JSON.stringify("good job my friend login"));
    
    console.log("login");
});

app.post('/register', async (request, response) => {
    const {userName, password} = request.body;

    response.send( JSON.stringify("good job my friend registration"));
    
    console.log("registered");
});

app.get('*', async (request, response) => {
    response.status(404).send( 'Resource not found');
});


app.listen(5000, () => { 
    console.log('App aviable on http://localhost:5000')
});