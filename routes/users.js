const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


//User Login Form
router.get('/login',(req,res)=>{
    res.render('users/login');
});

//User Register Form
router.get('/register',(req,res)=>{
    res.render('users/register');
});

//Register form POST
router.post('/register',(req,res) =>{
    let errors = [];

    if(req.body.password != req.body.password2){
        errors.push({text:'Passowrds do not match!'});

    }
    if (req.body.password.length > 4){
        errors.push({text:'Passowrds to short!'});
    }
    if(error.length > 0){
        res.render('users/register',{
            errors:errors,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            password2: req.body.password2

        })
    }
});


module.exports = router;
