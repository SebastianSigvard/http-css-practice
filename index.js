const bodyParser = require('body-parser');
const express    = require('express');
const path       = require('path');
const mongoose   = require('mongoose');
const bcrypt     = require('bcryptjs');
const User       = require('./model/user');
const { Food }   = require('./model/food');
const { use }    = require('express/lib/application');
const jwt        = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const JWT_SECRET = "kjhlnbsdkfjgh@#$%(@#)(*&NCKAJBXC&@)%_asddddddddddasdaxfvxzcv"
const app = express();

mongoose.connect('mongodb://localhost:27017/calCount');

app.use(express.static('./public'))
app.use(bodyParser.json());


app.get('/', async (request, response) => {
    response.sendFile( path.resolve(__dirname,'./public/index.html'));
});

app.get('/dist/main.js', async (request, response) => {
    response.sendFile( path.resolve(__dirname,'./dist/main.js'));
});

app.post('/send_contactme', async (request, response) => {
    const {name, email, message} = request.body;

    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: "contactmesigvard@gmail.com",
            pass: "nomeimporta1/"
        }
    });

    let textBody = `FROM: ${name}; EMAIL: ${email}; MESSAGE: ${message}`;
    let htmlBody = `<h2>Mail From Contact Form</h2><p>from: ${name}
                    <a href='mailto:${email}'>${email}</a><p>${message}</p></p>`;

    let mail = {
        from:    "contactmesigvard@gmail.com",
        to:      "sebastiansigvard@gmail.com",
        subject: "Mail From Contact Form",
        text:    textBody,
        html:    htmlBody
    };

    transporter.sendMail(mail, (err, info) => {
        if(err) {
            console.error(err);
            return response.json({status: "error", error: "An error has ocurred"});
        } 
        response.json({status: "ok", data: `Message sent with ID: ${info.messageId}`})
    });
});

app.get('*', async (request, response) => {
    response.status(404).send( 'Resource not found');
});

//###############################################################################
// Cal Counter API

app.post('/login', async (request, response) => {
    const {userName, password} = request.body;

    const user = await User.findOne({userName}).lean();

    if( ! user ) return response.json({status: "error", error: "Invalid Username"});

    if( await bcrypt.compare(password, user.password) ) {

        const token = jwt.sign( {
            id: user._id,
            username: user.userName
        }, JWT_SECRET );

        return response.json( {status: "ok", data: token} );
    }

    response.json({status: "error", error: "Invalid password"});
});

app.post('/register', async (request, response) => {
    const {userName, password: plainTextPassword} = request.body;

    if( !userName || typeof userName != 'string') {
        return response.json({status: "error", error: "Bad username"});
    }

    if( !plainTextPassword || typeof plainTextPassword != 'string') {
        return response.json({status: "error", error: "Bad password"});
    }

    if( plainTextPassword.length < 6 ) {
        return response.json({status: "error", error: "Small password, at least 6 chars are needed "});
    }

    const password = await bcrypt.hash(plainTextPassword, 10);

    try {
        const res = await User.create( {userName, password} );
    
    } catch(error) {
        if(error.code === 11000) { //duplicated key
            return response.json({status: "error", error: "Username allready in use"});
        }
        console.error(error);
        throw(error);
    }

    response.json({status: "ok"});
});

app.post('/calApi/add-food', async (request, response) => {
    const {token, fields} = request.body;

    let userName;
    try {
        const user_data = jwt.verify(token, JWT_SECRET);
        userName = user_data.username;
    } catch(error) {
        response.json({status: "error", error: "Corronped Token"});
    }

    const user = await User.findOne({userName}).lean();

    if( ! user ) return response.json({status: "error", error: "Invalid Username"});

    const res = await Food.create( {foodName: fields.name, carbs: fields.carbs, protein: fields.protein, fat: fields.fat} );

    await User.findByIdAndUpdate( user._id, 
        { "$push": { "food": res._id } }
    );

    response.json({status: "ok"});
});

app.post('/calApi/get-user-food', async (request, response) => {
    const {token} = request.body;

    let userName;
    try {
        const user_data = jwt.verify(token, JWT_SECRET);
        userName = user_data.username;
    } catch(error) {
        response.json({status: "error", error: "Corronped Token"});
    }

    const user = await User.findOne({userName}).lean();

    if( ! user ) return response.json({status: "error", error: "Invalid Username"});

    let documents = [];

    for(const item of user.food) {
        let res = await Food.findById(item._id).lean();
        documents.push( {
            name:    res.foodName, 
            carbs:   res.carbs,
            protein: res.protein, 
            fat:     res.fat} );
    };

    response.json({status: "ok", documents});
});

app.post('/calApi/clean-user-entrys', async (request, response) => {
    const {token} = request.body;

    let userName;
    try {
        const user_data = jwt.verify(token, JWT_SECRET);
        userName = user_data.username;
    } catch(error) {
        response.json({status: "error", error: "Corronped Token"});
    }

    const user = await User.findOne({userName}).lean();

    if( ! user ) return response.json({status: "error", error: "Invalid Username"});

    await User.findByIdAndUpdate( user._id, 
        { "$set": { "food": [] } }
    );

    response.json({status: "ok"});
});


// app.post('/change-password', async (request, response) => {
//     //TODO:
// });

//###############################################################################

app.listen(5000, () => { 
    console.log('App aviable on http://localhost:5000');
});