const mongoose = require('mongoose')

const OrderSchema = new mongoose.Schema({
    image:String,
    name:String,
    price:Number,
    link:String
})

const Order = mongoose.model('order',OrderSchema)

module.exports=Order