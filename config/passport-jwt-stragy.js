
const passport = require('passport');
const jwtstragy = require('passport-jwt').Strategy;
const jwtExtract= require('passport-jwt').ExtractJwt;
const admin = require("../model/admin/admin")

var option = {
    jwtFromRequest:jwtExtract.fromAuthHeaderAsBearerToken(),
    secretOrKey : 'akshar',
}

passport.use(new jwtstragy(option,async(record,done)=>{
    let checkAdmin = await admin.findById(record.Admindata._id);
    // console.log("checkAdmin",checkAdmin);
    if (checkAdmin) {
        return done(null, checkAdmin);
    }
    else {
        return done(null, false);
    }
}));

passport.serializeUser( (user, done)=> {
    return done(null, user.id);
})

passport.deserializeUser(async  (id, done)=> {
    let recheck = await admin.findById(id);
    if (recheck) {
        return done(null, recheck);
    }
    else {
        return done(null, false);        
    }
})
