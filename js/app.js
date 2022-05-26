require('dotenv').config()
const path = require('path')
const express = require('express')
const db = require('./routers/db-config')
const cookieparser = require('cookie-parser')


const app = express()
//app.use(cookieparser)


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
app.use(cookieparser())

//define routers
app.use('/', require('./routers/Page'))


app.use('/auth', require('./routers/Auth'))

const port = process.env.PORT || 8080
app.listen(port, () => {
    console.log('http://localhost:' + port+'/login')
})