const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


//Load idea schema/model
require('../models/Idea');
const Idea = mongoose.model('idea');

//Load Auth helper
const {ensureAuthenticated} = require('../helpers/auth');


//Add idea  form route
router.get('/add',ensureAuthenticated,(req,res)=>{
    res.render('ideas/add');
});

//Idea Index Page
router.get('/',ensureAuthenticated,(req,res)=>{
    Idea.find({user: req.user.id})
    .sort({date:'desc'})
    .then(ideas => {
        res.render('ideas/index',{
            ideas:ideas
        });
    })
    
});

//Edit Idea Form
router.get('/edit/:id',ensureAuthenticated,(req,res)=>{
    Idea.findOne({
        _id: req.params.id
    })
    .then(idea=>{
        res.render('ideas/edit',{
            idea: idea
        });
    });
    
});

//Process Edit Form
router.put('/:id',ensureAuthenticated,(req,res)=>{
    Idea.findOne({
        _id: req.params.id
    })
    .then(idea => {
        //New values
        idea.title = req.body.title;
        idea.details = req.body.details;

        idea.save()
        .then(idea => {
            req.flash('success_msg','Video idea updated');
            res.redirect('/ideas');
        })
    })
});

//Delete idea
router.delete('/:id',ensureAuthenticated, (req,res) => {
    Idea.remove({
        _id: req.params.id
    })
    .then(() => {
        req.flash('success_msg','Video idea removed');
        res.redirect('/ideas');
    });
});


//Process AddForm
router.post('/', ensureAuthenticated,(req,res) => {
    let errors = [];

    if (!req.body.title){
        errors.push({text: 'Please add a title!'});
    }
    if (!req.body.details){
        errors.push({text: 'Please add a details'});
    }

    if(errors.length > 0){
        res.render('ideas/add',{
            errors:errors,
            title: req.body.title,
            details: req.body.details
        });
    }
    else {
        const newIdea = {
            title: req.body.title,
            details: req.body.details,
            user: req.user.id
        }
        new Idea(newIdea)
        .save()
        .then(idea => {
            req.flash('success_msg','Video idea added');
            res.redirect('/ideas');
        })
        
    }
});


module.exports = router;