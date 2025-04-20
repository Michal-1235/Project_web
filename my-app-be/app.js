var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
const PgSession = require("connect-pg-simple")(session);
var pool = require('./config/db.js');
const { config } = require('./config/config.js');




//var projectcreationRouter = require('./routes/project_creation_api/project_creation');
var registerRouter = require('./routes/register_api/register');
var authRouter = require('./routes/auth_api/auth');

require('dotenv').config();

var app = express();

// various middlewares
// logs HTTP requests to the console
app.use(logger('dev'));
// parses HTTP requests with JSON payloads
app.use(express.json());
// parses HTTP requests with URL-encoded data
app.use(express.urlencoded({ extended: false }));
// parses cookies
app.use(cookieParser());

if (process.env.STATUS === 'production') {
    // trust proxy needed for secure cookie to work on render.com
    // because render.com uses a reverse proxy to handle HTTPS requests
    // and forwards the requests to the backend server over HTTP
    app.set('trust proxy', 1);
    }




// express-session middleware
app.use(
    session({
        store: new PgSession({
            pool, 
            tableName: "session", 
        }),        
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        name: config.session.cookieName,
        cookie: {
            secure: process.env.STATUS === 'production',
            httpOnly: true,
            sameSite: process.env.STATUS === 'production'?'none':'lax',
        }            
             
    })    
);    
app.use('/api/register', registerRouter);
app.use('/api/auth', authRouter);


module.exports = app;
