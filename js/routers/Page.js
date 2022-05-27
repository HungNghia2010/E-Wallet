const express = require('express')
const Router = express.Router()
const loggedIn = require('../controllers/LoggedIn')
const logout = require('../controllers/Logout')
const OTP = require('../controllers/Sendotp')

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
    res.render('login')
})

Router.get('/register', (req, res) => {
    res.render('register')
})

Router.get('/forgot', (req, res) => {
    res.render('forgotpass')
})

Router.get('/otp',OTP.otp ,(req, res) => {
    if(req.otp){
        res.render('otp')
    }else{
        res.render('404')
    }
})

Router.get('/index', loggedIn.loggedIn, (req,res) => {
    console.log(req.user)
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

Router.get('/naptien', loggedIn.loggedIn, (req, res) => {
    if(req.user){
        if(req.user.change_pass === 0){
            res.redirect('/firststep')
        }else if(req.user.status === "chờ xác minh"){
            res.render('404',{status:"no",user: "nothing"})
        }
        else res.render('nap',{status:"info",user: req.user})
    }else{
        res.render('404',{status:"no",user: "nothing"})
    }
})

module.exports = Router