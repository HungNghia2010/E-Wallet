const express = require('express');
const authController = require('../controllers/auth');
const loggedIn = require('../controllers/LoggedIn')
const multer = require('multer')
const fsExtra = require('fs-extra')


const Router = express.Router();

const fileStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        let path = '../public/images';
        if (!fsExtra.existsSync(path)) {
            fsExtra.mkdirSync(path)
        }

        cb(null,path)
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
});

const upload = multer({ storage: fileStorage});

Router.post('/register', upload.single('images') , authController.register)
Router.post('/login', authController.login)
Router.post('/forgot', authController.checkmail)
Router.post('/firststep', loggedIn.loggedIn, authController.change_passft)
Router.post('/changepassword', loggedIn.loggedIn, authController.change_pass)

module.exports = Router;