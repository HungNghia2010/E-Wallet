require('dotenv').config()
const path = require('path')
const express = require('express')
const mysql = require('mysql')
const cookieparser = require('cookie-parser')


const app = express()
app.use(cookieparser)
const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

const publicDirectory = path.join(__dirname, './public')
app.use(express.static(publicDirectory))

app.set('view engine', 'hbs');

db.connect( (error) => {
    if(error){
        console.log(error)
    }else {
        console.log("MYSQL connected")
    }
})

app.use(express.urlencoded({extended: false}))
app.use(express.json())

//define routers
app.use('/', require('./routers/Page'))


app.use('/auth', require('./routers/Auth'))

const port = process.env.PORT || 8080
app.listen(port, () => {
    console.log('http://localhost:' + port+'/login')
})