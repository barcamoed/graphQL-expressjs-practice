const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
    // id:String,// dont need it,will get created by monogodb itself
    name:String,
    genre:String,
    authorId:String
});

module.exports = mongoose.model('Book',bookSchema);
