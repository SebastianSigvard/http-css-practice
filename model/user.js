const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    userName: {type: String, required: true, unique: true},
    password: {type: String, required: true}
}, {collation: 'users'} );

const model = mongoose.model('UserSchema', UserSchema);

module.exports = model;