const express = require('express')
const app = express()
require('dotenv/config')
const userRouter = require('./ROUTES/userRouter')
const adminRouter = require('./ROUTES/adminRouter');
const hbs = require('express-handlebars')
const session = require('express-session')
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser')
const fs = require('fs')
const logger = require('morgan')

app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(cookieParser())
app.use(session({
    secret:'thisismysecretkey',
    saveUninitialized:true,
    cookie:{maxAge:1000000}, //one hour
    resave: false
}))
app.use((req, res, next) => {
    res.set(
        "Cache-Control",
        "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
    );
    next()
})  
// app.use(logger('dev'))
mongoose.connect('mongodb://localhost/weareShop')

app.use(express.static('./PUBLIC'))
app.set('views','./VIEWS')
app.set('view engine','hbs')
app.engine('hbs',hbs.engine({extname:'hbs',defaultLayout:'layout',layoutDir:'./VIEWS/layout/',partialsDir:'./VIEWS/partials'}))

//for multer purpose
if (!fs.existsSync("./uploads")) {
    fs.mkdirSync("./uploads");
}
app.use("/uploads", express.static("uploads"));

//handlebars index start 1
var Handlebars = require('handlebars');

Handlebars.registerHelper("inc", function(value, options)
{
    return parseInt(value) + 1;
});
//handlears for loop register
Handlebars.registerHelper('times', function(n, block) {
    var accum = '';
    for(var i = 1; i <= n; ++i)
        accum += block.fn(i);
    return accum;
});
//handlebars if equal register
Handlebars.registerHelper('if_eq', function(a, b, opts) {   
    if (a === b) {
        return opts.fn(this);
    } else {
        return opts.inverse(this);
    }
});
//handlebars for multiplying 
Handlebars.registerHelper("multiple",function(index,value){
    return index * value;
});
//not equal to check
Handlebars.registerHelper('ifnoteq', function (a, b, options) {
    if (a != b) { return options.fn(this); }
    return options.inverse(this);
});

app.use('/',userRouter)
app.use('/admin',adminRouter)

app.listen(process.env.PORT,()=>console.log('server connected to',process.env.PORT));
