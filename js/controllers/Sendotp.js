const jwt = require('jsonwebtoken')
const db = require('../routers/db-config')

exports.otp = async (req, res, next) => {
    if (!req.cookies.userOTP) return next();
    try{
        const decoded = jwt.verify(req.cookies.userOTP, process.env.JWT_SECRET)
        db.query('SELECT * FROM otp WHERE id = ?', [decoded.id], (err, result) => {
            if(err) return next()
            req.otp = result[0]
            return next()
        })
    }catch (err){
        if(err) return next()
    }
}
