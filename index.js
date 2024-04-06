const express = require('express');
const port = 8003;

const app = express();
const mongoose = require('mongoose')
const db = require('./config/mongoose');
// mongoose.connect(("mongodb+srv://kanabarakshar08:AKSHAR@akshar.7qjb0c5.mongodb.net/rollbaseapi"), {
//     useUnifiedTopology: true,
//     useNewUrlParser: true
// })
//     .then(() => console.log('Database Connected'))
//     .catch((err) => console.log(err));
const register = require('./model/admin/admin');
const passport = require('passport');
const passportJwt = require("./config/passport-jwt-stragy");

const session = require('express-session');
app.use(express.urlencoded());



app.use(session({
    name: "aksharJwtSession",
    secret: "akshar",
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 100
    }
}))
app.use(passport.initialize());
app.use(passport.session());

app.use("/admin", require('./router/admin/admin'));

app.listen(port, (err) => {
    if (err) console.log("Something is Worng");
    console.log("Server is running :", port);
});