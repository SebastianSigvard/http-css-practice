const bodyParser = require('body-parser');
const express    = require('express');
const path       = require('path');

const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
const User     = require('./model/user');
const { use }  = require('express/lib/application');
const jwt      = require('jsonwebtoken');

const nodemailer = require('nodemailer');

const JWT_SECRET = "kjhlnbsdkfjgh@#$%(@#)(*&NCKAJBXC&@)%_asddddddddddasdaxfvxzcv"
const app = express();

mongoose.connect('mongodb://localhost:27017/calCounter');

app.use(express.static('./public'))
app.use(bodyParser.json());


app.get('/', async (request, response) => {
    response.sendFile( path.resolve(__dirname,'./public/index.html'));
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
        from: "contactmesigvard@gmail.com",
        to:   "sebastiansigvard@gmail.com",
        subject: "Mail From Contact Form",
        text: textBody,
        html: htmlBody
    };

    transporter.sendMail(mail, (err, info) => {
        if(err) {
            console.log(err);
            return response.json({status: "error", error: "An error has ocurred"});
        } else {

            response.json({status: "ok", data: `Message sent with ID: ${info.messageId}`})
        }
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
        console.log('user created succesfully');
    
    } catch(error) {
        if(error.code === 11000) { //duplicated key
            return response.json({status: "error", error: "Username allready in use"});
        }
        console.error(error);
        throw(error);
    }

    response.json({status: "ok"});
});

// app.post('/change-password', async (request, response) => {
//     //TODO:
// });

//###############################################################################

app.listen(5000, () => { 
    console.log('App aviable on http://localhost:5000');
});