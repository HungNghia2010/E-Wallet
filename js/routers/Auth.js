const express = require('express');
const authController = require('../controllers/auth');
const loggedIn = require('../controllers/LoggedIn')

const Router = express.Router();

Router.post('/register', authController.register)
Router.post('/login', authController.login)
Router.post('/firststep', loggedIn.loggedIn, authController.change_passft)

module.exports = Router;