const mongoose = require('mongoose')

const movieSchema = new mongoose.Schema({
    name:String,
    image:String,
    tags:Array,
    price:Number,
    link:String
})


const Movie = mongoose.model('movie',movieSchema);
module.exports = Movie