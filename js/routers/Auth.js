const express = require('express');
const authController = require('../controllers/auth');
const loggedIn = require('../controllers/LoggedIn')
const otp = require('../controllers/Sendotp')
//const multer = require('multer')
//const fsExtra = require('fs-extra')

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

Router.post('/otp',otp.otp,authController.checkotp)

Router.post('/newpassword', otp.otp, authController.change_passforgot)

Router.post('/firststep', loggedIn.loggedIn, authController.change_passft)

Router.post('/changepassword', loggedIn.loggedIn, authController.change_pass)

Router.post('/update', loggedIn.loggedIn, authController.update_info)

Router.post('/nap', loggedIn.loggedIn, authController.nap_tien)

Router.post('/ruttien', loggedIn.loggedIn, authController.rut_tien)

Router.post('/chuyen', loggedIn.loggedIn, authController.chuyen_tien)

Router.post('/choduyet', loggedIn.loggedIn, authController.cho_duyet)

Router.post('/xacnhan',loggedIn.loggedIn, authController.xacnhan_chuyen)

Router.post('/muatheviettel',loggedIn.loggedIn, authController.muatheviettel)

module.exports = Router;