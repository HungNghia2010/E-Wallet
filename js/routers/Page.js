const express = require('express')
const Router = express.Router()
const loggedIn = require('../controllers/LoggedIn')
const logout = require('../controllers/Logout')

Router.get('/login', (req, res) => {
    res.render('login')
})

Router.get('/register', (req, res) => {
    res.render('register')
})

Router.get('/index', loggedIn.loggedIn, (req,res) => {
    if(req.user){
        res.render('index',{status:"loggedIn",user: req.user})
    }else{
        res.render('no',{status:"no",user: "nothing"})
    }
})

Router.get('/logout',logout.logout)

Router.get('/info', loggedIn.loggedIn,(req, res) => {
    if(req.user){
        res.render('info',{status:"info",user: req.user})
    }else{
        res.render('no',{status:"no",user: "nothing"})
    }
})

module.exports = Router