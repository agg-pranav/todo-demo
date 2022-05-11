const passport = require('passport');
const cookieParser = require('cookie-parser')
const session = require('express-session')



module.exports = function passportConfig(app){
    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser((user, done) => {
        done(null, user); 
    });


    passport.deserializeUser((user, done) => {
        done(null, user);
        });
}