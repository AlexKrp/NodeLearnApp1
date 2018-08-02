const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');

//Load User Model
require('../models/User');
const User = mongoose.model('users');


//User Login Form
router.get('/login',(req,res)=>{
    res.render('users/login');
});

//Login form post
router.post('/login',(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect: '/ideas',
        failureRedirect: '/users/login',
        failureFlash: true,

    })(req,res,next);
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
    if(errors.length > 0){
        console.log('Error');
        res.render('users/register',{
            errors:errors,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            password2: req.body.password2

        })
    } else {
        User.findOne({email: req.body.email})
        .then(user => {
            if(user){
                req.flash('error_msg','Email already registered');
                res.redirect('/users/register');
            }else{
                //New User Object
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password
                  });

                  //Crypt Password
                  bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                      if(err) throw err;
                      newUser.password = hash;
                      newUser.save()
                        .then(user => {
                          req.flash('success_msg', 'You are now registered and can log in');
                          res.redirect('/users/login');
                        })
                        .catch(err => {
                          console.log(err);
                          return;
                        });
                    });
                  });


            }
        })
        

          
    }

    
});

//Logout user
router.get('/logout', (req,res)=>{
    req.logout();
    req.flash('success_msg','You are loged out');
    res.redirect('/users/login');
});


module.exports = router;
