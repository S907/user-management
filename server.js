const express = require('express');
const mongoose = require('mongoose');
const app = express();
require('dotenv').config()
const path = require('path');
const session =require('express-session');
const flash=require('connect-flash');
const cookieParser= require('cookie-parser');
const port = 2040;

app.use(cookieParser());
app.use(session({
   secret:'MAWTYRR',
   saveUninitialized: true,
   resave:true 
}));
app.use(flash()); 
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({
    extended:true
}));
//app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));

const dbDriver = process.env.db_URL;

const jwtAuth=require('./middleware/userAuth');
app.use(jwtAuth.authJwt);

const initiateAdminRoute= require('./routes/admin.routes');
app.use('/admin',initiateAdminRoute);
const initiateUserRoute = require('./routes/user.routes');
app.use('/users',initiateUserRoute);

mongoose.connect(dbDriver, {
    useNewUrlParser: true,
    useUnifiedTopology:true
}).then((res)=>{
    app.listen(port, ()=>{
        console.log(`Server running at @ http://localhost:${port}/admin/register`);
    });

}).catch((err)=> `${err}`)


