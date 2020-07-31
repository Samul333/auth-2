const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const {User} = require('../models/user')
const bcrypt = require('bcryptjs')
const cookieParser = require('cookie-parser')
const app = express();
const {auth} = require('./middleware/auth')

mongoose.Promise = global.Promise;

mongoose.connect('mongodb+srv://Samul:killinginthenameof@cluster0.h638k.mongodb.net/pushProd?retryWrites=true&w=majority',{useNewUrlParser:true,useUnifiedTopology:true,useCreateIndex:true},
()=>console.log('Connected to the Database'))

//Middleware
app.use(express.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(cookieParser())

const port = process.env.PORT || 3000;

app.get('/',(req,res)=>{
    res.json({message:'Hey welcome to this simple API application'})
})
app.post('/api/user',(req,res)=>{
        const user = new User({
            email:req.body.email,
            password:req.body.password,
        });

        user.save((err,doc)=>{
                if(err) res.status(400).send(err)
                res.status(200).send(doc)
        })
})


app.post('/api/user/login',(req,res)=>{
        User.findOne({'email':req.body.email},(err,user)=>{
            if(!user) res.json({message:'The user doesnt exist'})
           
            user.comaprePassword(req.body.password,(err,isMatch)=>{
                if(err) throw err
                if(!isMatch) return res.status(400).json({message:'Wrong password'})
                
              

            });

            user.generateToken((err,user)=>{
                    if(err) return res.status(400).send(err);
                    res.cookie('auth',user.token).send('ok')
            })
            
        })
})


app.get('/user/profile',auth,(req,res)=>{
    res.status(200).send(res.token)
   
   
})


app.listen(port,()=>{
    console.log('The server has started')
})