var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

var USASchema = new Schema({

    province: {
        type: String,
        required: true,
    },

    country: {
        type: String,
        required: true,
    },

    lastUpdate: [{
        type: String,
        required: true,
    }],

    confirmed: [{
        type: String,
        required: true,
    }],

    deaths: [{
        type: String,
        required: true,
    }],

    recovered: [{
        type: String,
        required: true,
    }],
});


// This creates our model from the above schema, using mongoose's model method
//  this article is a Collection called "Users", defined by UsersSchema
var USA = mongoose.model("USA", USASchema);

module.exports = USA;