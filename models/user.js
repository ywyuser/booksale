var mongoose = require('./db')


var userSchema = mongoose.Schema({

    nickname: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },



    gender: {
        type: String,
        default: ''
    },
    place: {
        type: String,
        default: ''
    },

    tel: {
        type: Number,
        default: 0
    },
    shopcar: {
        type: Array,

    },
    order: {
        type: Array,

    },
    borrow: {
        type: Array,

    },





})

module.exports = mongoose.model('User', userSchema)