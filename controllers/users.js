const User = require('../models/user');

module.exports.renderSignupForm = (req, res) => {
    res.render('users/signup.ejs', { title: 'Sign Up' });
}

module.exports.signup = async (req, res) => {
        try{
            let { username, email, password } = req.body;
            const newUser = new User({ username, email });
            const registeredUser = await User.register(newUser, password);
            console.log('registeredUser', registeredUser);
            req.login(registeredUser, (err) => {
                if (err) {
                    return next(err);
                }
                req.flash('success', 'Welcome to Wanderlust!');
                res.redirect('/listings');
            })
        }
        catch (err) {
            req.flash('error', err.message);
            res.redirect('/signup');
        }
}

module.exports.renderLoginForm = (req, res) => {
    res.render('users/login.ejs', { title: 'Login' });
};

module.exports.login = async (req, res) => {
            req.flash('success', 'Welcome back to Wanderlust!');
            res.redirect(res.locals.redirectUrl || '/listings');
        }

module.exports.logout = (req, res) => {
    req.logout((err)=> {
        if(err) {
            next(err);
        }
        req.flash('success', 'Goodbye! See you soon!');
        res.redirect('/listings');
    })
}