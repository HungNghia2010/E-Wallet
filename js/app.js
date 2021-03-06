require('dotenv').config()
const path = require('path')
const express = require('express')
const db = require('./routers/db-config')
const cookieparser = require('cookie-parser')
const exphbs = require('express-handlebars');
const session = require('express-session')
const app = express()
//app.use(cookieparser)


const publicDirectory = path.join(__dirname, './public')
app.use(express.static(publicDirectory))

app.set('view engine', 'hbs');
app.engine('hbs', exphbs.engine({
    extname: 'hbs',
    defaultLayout: 'main',
    helpers: {
        equals: function(arr1,arr2,options) {
            if (arr1 == arr2) return options.fn(this) 
            return options.inverse(this);
        },
        count: function (index){
            return index + 1;
        },
        equalsOr: function (arr1, arr2, arr3, options) {
            if ((arr1 == arr2) || (arr1 == arr3)) return options.fn(this)
            return options.inverse(this);
        }
    }
}))

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
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
  }))

//define routers
app.use('/', require('./routers/Page'))


app.use('/auth', require('./routers/Auth'))

const port = process.env.PORT || 8080
app.listen(port, () => {
    console.log('http://localhost:' + port+'/login')
})