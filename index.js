var express = require('express');
var passport = require('passport');
var express_session = require('express-session') 
require('./config/passport-local-strategy');
var connect_Mongo = require('connect-mongo');
var app = express();
require('./config/mongoose');
app.use(express.urlencoded());


var express_layout =require("express-ejs-layouts");
const MongoStore = require("connect-mongo");
app.use(express_layout);
app.set("view engine","ejs");
app.set("views",__dirname+"/views");
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);
app.use(express.static('./Assets'));


app.use(express_session({
    name : 'ERS',
    secret : 'devil',
    cookie : {
        maxAge: 1000 * 60 * 60 * 24
    },
    store : connect_Mongo.create({
        mongoUrl : 'mongodb+srv://mohitpal9513:mpal9513@cluster0.gbojmyb.mongodb.net/Session?retryWrites=true&w=majority'
    })
 }))

 app.use(passport.initialize());
 app.use(passport.session());

 app.use(passport.setAuthenticatedUser);

 var port =8000 || process.env.port;


 app.use('/',require('./Router/index.js'));




 app.listen(port,()=>{
    console.log('server is running');
 })
