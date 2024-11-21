const mongoose = require('mongoose')

const courseSchema = new mongoose.Schema({
    name:String,
    image:String,
    tags:Array,
    price:Number,
    link:String
})


const Series = mongoose.model('serie',courseSchema);
module.exports = Series