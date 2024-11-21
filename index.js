const express = require('express');
const mongoose = require('mongoose')
const cors = require('cors')
const bodyparser=require('body-parser')
const empModel = require('./Model/usermodel')
const movieModel = require('./Model/movieschema')
const courseModel = require('./Model/courseschema')
const cartRoutes = require('./Routes/cartRoute')
const orderModel = require('./Model/orderschema')
const crypto = require('crypto')
const Razorpay = require('razorpay')

const app = express()
app.use(express.json())
app.use(cors())
app.use(bodyparser.json())
app.use('/api/cart',cartRoutes)

mongoose.connect("mongodb://127.0.0.1:27017/sparked")

//Server for Register

app.post('/register',(req,res)=>{
   empModel.create(req.body)
   .then(users=>res.json(users))
   .catch(err=>console.log(err))
})

//Server for Login

app.post('/login',(req,res)=>{
    const {email,password}=req.body;
    empModel.findOne({email:email})
    .then(user=>{
        if(user){
            if(user.password===password){
                res.json('success')
            }
            else
            {
                res.json('Invalid Password')
            }
        }
        else{
            res.json('No Records')
        }
        })
    })

    const razorpay = new Razorpay({
        key_id: 'rzp_test_2jjNlbGkQ1TiUs',
        key_secret: 'k7GuZWqRq9vOcEEpP3tz162A'
    })

    app.post('/create-order',async(req,res)=>{
        const {amount,currency} = req.body;
    
        try{
            const options = {
                amount: amount * 100, //Amount in paise
                currency,
                receipt: `receipt_${Math.floor(Math.random() * 10000)}`,
                payment_capture: 1
            }
            const order = await razorpay.orders.create(options);
            res.status(200).json({
                order_id: order.id, 
                amount: order.amount, 
                currency: order.currency
            })
        }
        catch(error){
            console.error("Error creating order :",error);
            res.status(500).send("Error creating order")
        }
    })

    app.post('/verify-payment',(req,res)=>{
        const {razorpay_order_id, razorpay_payment_id, razorpay_signature} = req.body
    
        const body = razorpay_order_id + "|" + razorpay_payment_id
        const expectedSignature = crypto.createHmac('sha256','k7GuZWqRq9vOcEEpP3tz162A')//Use your razorpay secret key
        .update(body.toString())
        .digest('hex')
    
        if (expectedSignature === razorpay_signature)
        {
            res.status(200).json({message: 'Payment successful'})
        }
        else
        {
            res.status(400).json({message: 'Payment verification failed'})
        }
    })


// For Importing Movies from DB

app.get('/getmovie',(req,res)=>{
    movieModel.find()
    .then(movie=>res.json(movie))
    .catch(err => res.json(err) )
})

// For Importing Courses Form DB

app.get('/getcourse',(req,res)=>{
    courseModel.find()
    .then(course=>res.json(course))
    .catch(err => res.json(err) )
})

app.post('/order',(req,res)=>{
    orderModel.create(req.body)
    .then(order=>res.json(order))
    .catch(err=>console.log(err))
})

app.delete('/drop', (req,res)=>{
    mongoose.connection.dropCollection('cartitems')
    res.send("Collection Dropped")
})

app.get('/getorder',(req,res)=>{
    orderModel.find()
    .then(items => res.json(items))
    .catch(err => res.json(err))
})


//Server Connection

app.listen(3001,()=>{
    console.log(`Server is running on port`)
})