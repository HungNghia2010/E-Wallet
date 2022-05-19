const mysql = require('mysql')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')

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

exports.register = (req, res) => {
    console.log(req.body)

    const { name, birth, email, phone, cmnd, address} = req.body;
    
    db.query('SELECT email FROM register WHERE email = ? or phone_number = ?', [email,phone], (error, result) => {
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
                
                var mailOptions = {
                    from: 'sinhvien@phongdaotao.com',
                    to: email,
                    subject: 'Gửi thông tin đăng nhập',
                    text: '<h1>Tên đăng nhập: {{username}} , Mật khẩu: {{password}}</h1>'
                }

                transporter.sendMail(mailOptions,function(error, info) {
                    if(error){
                        console.log(error)
                    }else{
                        console.log('Email sent: ' + info.response)
                    }
                })


                return res.render('register',{
                    message: 'Đăng ký thành công'
                })
 
            }
        })

    })

}

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