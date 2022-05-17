const mongoose = require('mongoose');
const { FoodSchema } = require('./food');

const UserSchema = new mongoose.Schema({
    userName: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    food:     [{type: mongoose.Schema.Types.ObjectId, ref: "FoodSchema" }]
}, {collection: 'users'} );

const model = mongoose.model('UserSchema', UserSchema);

module.exports = model;