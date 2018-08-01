const express = require('express');
const exphbs  = require('express-handlebars');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const path = require('path');
const passport = require('passport');


const app = express();


//Load ideas routes
const ideas = require('./routes/ideas');

//Load users routes
const users = require('./routes/users');

//Passport config
require('./config/passport')();


//Map global promise --get rid of the warning!
mongoose.Promise = global.Promise;
//Connect to DB
mongoose.connect('mongodb://localhost:27017/vidjot-dev', {
    useNewUrlParser: true 
})
.then(()=> console.log('MongoDB Connected...'))
.catch(err=>console.log(err));



//Handlebar middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//Flash midleware
app.use(flash());

//Static folder
app.use(express.static(path.join(__dirname,'public')));



//Express session midleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  }));

//Global variables
app.use((req,res,next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

//Method Override midleware
app.use(methodOverride('_method'));


//Body Parser midleware //Parse request body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



//Index route
app.get('/',(req,res)=>{
    const title = 'Welcome';
    res.render('index',{
        title:title,
    });
});

//About route
app.get('/about',(req,res)=>{
    res.render('about');
});




//Use /ideas routes
app.use('/ideas',ideas);

//Use /users routes
app.use('/users',users);




const port = 5000;

app.listen(port, ()=>{
    console.log(`Server started on port ${port}`);
});