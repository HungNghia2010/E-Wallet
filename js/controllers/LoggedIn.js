
const jwt = require('jsonwebtoken')
const db = require('../routers/db-config')

exports.loggedIn = async (req, res, next) => {
    if (!req.cookies.userRegistered) return next();
    try{
        const decoded = jwt.verify(req.cookies.userRegistered, process.env.JWT_SECRET)
        db.query('SELECT * FROM register INNER JOIN account WHERE register.id = account.id AND register.id = ?', [decoded.id], (err, result) => {
            if(err) return next()
            req.user = result[0]
            if(result[0].role === 1){
                req.user.auth = 'Admin'
            }else if(result[0].status === 'chờ xác minh'){
                req.user.test = 'NOUSE'
            }
            return next()
        })
    }catch (err){
        if(err) return next()
    }
}
