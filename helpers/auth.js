module.exports = {
    ensureAuthenticated: (req,res,next) => {
        if(req.isAuthenticated){
            return next();
        }
        req.flash('error_msg','401 Not Authorised');
        res.redirect('/users/login');
    }
}