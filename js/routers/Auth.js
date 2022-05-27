const express = require('express');
const authController = require('../controllers/auth');
const loggedIn = require('../controllers/LoggedIn')
const multer = require('multer')
const fsExtra = require('fs-extra')

const Router = express.Router();

// const fileStorage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null,'/public/images')
//     },
//     filename: function (req, file, cb) {
//         cb(null, Date.now() + '-' + file.originalname)
//     }
// });

//const upload = multer({ storage: fileStorage});

Router.post('/register', authController.register)
Router.post('/login', authController.login)
Router.post('/forgot', authController.checkmail)
Router.post('/firststep', loggedIn.loggedIn, authController.change_passft)
Router.post('/changepassword', loggedIn.loggedIn, authController.change_pass)
Router.post('/update', loggedIn.loggedIn, authController.update_info)

module.exports = Router;