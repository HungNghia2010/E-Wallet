const mysql = require('mysql')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer');
const { text } = require('express');

var transporter = nodemailer.createTransport({
    host: "mail.phongdaotao.com",
    port: 25,
    secure: false,
  auth: {
    user: "sinhvien@phongdaotao.com",
    pass: 'svtdtu'
  },
  tls:{
    rejectUnauthorized:false
  }
});


const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

exports.login = async (req, res) => {

    try{

        const {username,pwd} = req.body
        
        db.query('SELECT * FROM register WHERE username = ?', [username], async (error,result) => {
            console.log(result)
            if(result.length = 0){
                res.render('login',{
                    message: 'Username này không tồn tại'
                })
            }
        })

    }catch(error){
        console.log(error)
    }
}

exports.register = (req, res) => {
    console.log(req.body)

    const { name, birth, email, phone, cmnd, address} = req.body;
    
    db.query('SELECT email FROM register WHERE email = ?', [email,phone], (error, result) => {
        if(error){
            console.log(error)
        }

        if(result.length > 0){
            return res.render('register',{
                message: 'Email hoặc số điện thoại này đã được sử dụng'
            })
        }

        const username = Math.floor(1000000000 + Math.random() * 9000000000);
        const password = generateRandomString(6);

        db.query('INSERT INTO register SET ?',{username : username, pass: password, name: name, email: email, phone_number: phone, identity: cmnd, address: address}, (error, result)=>{
            if(error){
                console.log(error)
            } else{
                //mail
                // var mailOptions = {
                //     from: 'sinhvien@phongdaotao.com',
                //     to: email,
                //     subject: 'Gửi thông tin đăng nhập',
                //     text: '<h1>Tên đăng nhập: {{username}} , Mật khẩu: {{password}}</h1>',
                // }

                // transporter.sendMail(mailOptions,function(error, info) {
                //     if(error){
                //         console.log(error)
                //     }else{
                //         console.log('Email sent: ' + info.response)
                //     }
                // })

                //send message to register.hbs
                return res.render('register',{
                    message: 'Đăng ký thành công, tên đăng nhập là: ' + username + ', mật khẩu là: ' + password
                })
 
            }
        })

    })

}

//random string for password
const generateRandomString = (myLength) => {
    const chars =
      "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz1234567890";
    const randomArray = Array.from(
      { length: myLength },
      (v, k) => chars[Math.floor(Math.random() * chars.length)]
    );
  
    const randomString = randomArray.join("");
    return randomString;
};