const mongoose = require('mongoose');

const FoodSchema = new mongoose.Schema({
    foodName: {type: String, required: true},
    carbs:    {type: Number, required: true},
    protein:  {type: Number, required: true},
    fat:      {type: Number, required: true}
}, {collection: 'food'} );

const Food = mongoose.model('FoodSchema', FoodSchema);

module.exports = {Food, FoodSchema};
