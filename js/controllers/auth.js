const mysql = require('mysql')

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

exports.register = (req, res) => {
    console.log(req.body)

    const { name, birth, email, phone, cmnd, address} = req.body
    // if(!name){
    //     return res.render('register',{
    //         message: 'Vui lòng nhập tên'
    //     })
    // }else {
    //     db.query('SELECT email FROM register WHERE email = ?', [email], (error, result) => {
    //         if(error){
    //             console.log(error)
    //         }
    //         if(result.length > 0){
    //             return res.render('register', {
    //                 message: 'Email này đã tồn tại'
    //             })
    //         }
    //     })
    // }

}