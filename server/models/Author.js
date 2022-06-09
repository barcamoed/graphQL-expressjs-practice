const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const authorSchema = new Schema({
    // id:String,// dont need it,will get created by monogodb itself
    name:String,
    age:Number
});

module.exports = mongoose.model('Author',authorSchema);
