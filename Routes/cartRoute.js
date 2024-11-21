const express = require('express')
const CartItem = require('../Model/cartschema')
const router = express.Router()

//Add to cart

router.post('/add', async(req,res)=>{
    const {productId} = req.body
    let cartItem = await CartItem.findOne({productId})
    if(cartItem){
        cartItem
    }
    else{
        cartItem = new CartItem({productId})
    }
    await cartItem.save()
    res.json(cartItem)
})

//View cart

router.get('/',async(req,res)=>{
    const cartItems = await CartItem.find().populate('productId')
    res.json(cartItems)
})

//Remove from cart

router.post('/remove',async(req,res)=>{
    const {productId} = req.body
    await CartItem.deleteOne({productId})
    res.json({message:'Item removed'})
})

module.exports = router