var mongoose = require('./db')


var userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    btype: {
        type: String,
        required: true
    },
    num: {
        type: Number,
        required: true
    },

    price: {
        type: String,
        required: true
    },
    path: {
        type: String,
        required: true
    },


})

module.exports = mongoose.model('Book', userSchema)