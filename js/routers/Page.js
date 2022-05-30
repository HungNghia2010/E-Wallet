const express = require('express')
const Router = express.Router()
const loggedIn = require('../controllers/LoggedIn')
const logout = require('../controllers/Logout')
const OTP = require('../controllers/Sendotp')
const controllers = require('../controllers/auth')
const db = require('./db-config')

Router.get('/404', (req, res) => {
    res.render('404')
})

Router.get('/firststep', loggedIn.loggedIn,(req,res) => {
    if(req.user && req.user.change_pass === 0){
        res.render('firststep',{status:"change",user: req.user})
    }else{
        res.render('404',{status:"no",user: "nothing"})
    }
})

Router.get('/login', (req, res) => {
    if(!req.cookies.userRegistered){
        res.render('login')
    }else{
        res.render('404')
    }
})

Router.get('/register', (req, res) => {
    if(!req.cookies.userRegistered){
        res.render('register')
    }else{
        res.render('404')
    }
})

Router.get('/forgot', (req, res) => {
    if(!req.cookies.userRegistered){
        res.render('forgotpass')
    }else{
        res.render('404')
    }
})

Router.get('/otp',OTP.otp ,(req, res) => {
    if(req.otp){
        res.render('otp')
    }else{
        res.render('404')
    }
})

Router.get('/newpassword', OTP.otp,(req, res) => {
    if(req.otp.checkotp === '1'){
        res.render('changepassforgot')
    }else{
        res.render('404')
    }
})

Router.get('/index', loggedIn.loggedIn, (req,res) => {
    //console.log(req.user)
    if(req.user){
        if(req.user.change_pass === 0){
            res.redirect('/firststep')
        }
        else res.render('index',{status:"loggedIn",user: req.user})
    }else{
        res.render('404',{status:"no",user: "nothing"})
    }
})

Router.get('/logout',logout.logout)

Router.get('/info', loggedIn.loggedIn,(req, res) => {
    if(req.user){
        if(req.user.change_pass === 0){
            res.redirect('/firststep')
        }
        else res.render('info',{status:"info",user: req.user})
    }else{
        res.render('404',{status:"no",user: "nothing"})
    }
})

Router.get('/info/update', loggedIn.loggedIn, (req, res) => {
    if(req.user){
        if(req.user.change_pass === 0){
            res.redirect('/firststep')
        }
        else res.render('updateinfo',{status:"info",user: req.user})
    }else{
        res.render('404',{status:"no",user: "nothing"})
    }
})

Router.get('/info/changepassword', loggedIn.loggedIn, (req, res) => {
    if(req.user){
        if(req.user.change_pass === 0){
            res.redirect('/firststep')
        }
        else res.render('changepas',{status:"info",user: req.user})
    }else{
        res.render('404',{status:"no",user: "nothing"})
    }
})

Router.get('/naptien', controllers.isActivated , (req, res) => {
    if(req.user){
        if(req.user.status === "chờ xác minh" || req.user.status === 'chờ cập nhật'){
            res.redirect('/index')
        }
            else res.render('nap',{status:"info",user: req.user})

    }else{
        res.render('404',{status:"no",user: "nothing"})
    }
})

Router.get('/ruttien', controllers.isActivated , (req, res) => {
    if(req.user){
        if(req.user.status === "chờ xác minh" || req.user.status === 'chờ cập nhật'){
            res.redirect('/index')
        }
        else res.render('ruttien',{status:"info",user: req.user})
    }else{
        res.render('404',{status:"no",user: "nothing"})
    }
})

Router.get('/chuyentien', controllers.isActivated , (req, res) => {
    if(req.user){
        if(req.user.status === "chờ xác minh" || req.user.status === 'chờ cập nhật'){
            res.redirect('/index')
        }
        else res.render('chuyen',{status:"info",user: req.user})
    }else{
        res.render('404',{status:"no",user: "nothing"})
    }
})

Router.get('/lichsu', controllers.isActivated , (req, res) => {
    if(req.user){
        if(req.user.status === "chờ xác minh" || req.user.status === 'chờ cập nhật'){
            res.redirect('/index')
        }
        else res.render('lichsu',{status:"info",user: req.user})
    }else{
        res.render('404',{status:"no",user: "nothing"})
    }
})

Router.get('/manager', loggedIn.loggedIn, (req, res) => {
    if(req.user.auth === 'Admin'){
        db.query('SELECT * FROM register', (err, rows) => {
            db.query('SELECT * FROM trading', (err, rows1) => {
                if(!err) {
                    res.render('manager',{status:"info",user: req.user, rows, rows1})
                }
                else {
                    console.log(err);
                }
            })
        })
    }else{
        res.render('404',{status:"no",user: "nothing"})
    }
})

Router.get('/xemchoduyet', loggedIn.loggedIn, (req, res) => {
    if(req.user.auth === 'Admin'){
        res.render('xemchoduyet',{status:"info", user: req.user})
    }else{
        res.render('404',{status:"no",user: "nothing"})
    }
})

Router.get('/xemchuyentien', loggedIn.loggedIn, (req, res) => {
    if(req.user.auth === 'Admin'){
        res.render('xemchuyentien',{status:"info", user: req.user})
    }else{
        res.render('404',{status:"no",user: "nothing"})
    }
})

Router.get('/xemdakichhoat', loggedIn.loggedIn, (req, res) => {
    if(req.user.auth === 'Admin'){
        res.render('xemdakichhoat',{status:"info", user: req.user})
    }else{
        res.render('404',{status:"no",user: "nothing"})
    }
})

Router.get('/xemruttien', loggedIn.loggedIn, (req, res) => {
    if(req.user.auth === 'Admin'){
        res.render('xemruttien',{status:"info", user: req.user})
    }else{
        res.render('404',{status:"no",user: "nothing"})
    }
})

Router.get('/xemvohieuhoa', loggedIn.loggedIn, (req, res) => {
    if(req.user.auth === 'Admin'){
        res.render('xemvohieuhoa',{status:"info", user: req.user})
    }else{
        res.render('404',{status:"no",user: "nothing"})
    }
})

Router.get('/xemvothoihan', loggedIn.loggedIn, (req, res) => {
    if(req.user.auth === 'Admin'){
        res.render('xemvothoihan',{status:"info", user: req.user})
    }else{
        res.render('404',{status:"no",user: "nothing"})
    }
})

Router.get('/muathe', (req,res) => {
    res.render('muathe');
})
module.exports = Router