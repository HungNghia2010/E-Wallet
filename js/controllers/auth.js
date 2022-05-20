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
        console.log(req.body)

        
        db.query('SELECT * FROM register WHERE username = ?', [username], async (error,result) => {
            if(result.length === 0){
                res.render('login',{
                    message: 'Username này không tồn tại'
                })
            }
            else if(!result || !(await bcrypt.compare(pwd,result[0].pass))){
                res.render('login',{
                    message: 'Mật khẩu không đúng'
                })
            }else{
                const id = result[0].id
                const token = jwt.sign({id}, process.env.JWT_SECRET,{
                    expiresIn: process.env.JWT_EXPIRRES_IN
                })
                const cookieOptions = {
                    expires : new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRRES * 24 * 60 * 60 * 1000
                    ),
                    httponly: true,
                }
                res.cookie('jwt', token, cookieOptions)
                res.status(200).redirect("/index")
            }
        })

    }catch(error){
        console.log(error)
    }
}

exports.register = (req, res) => {
    console.log(req.body)

    const { name, birth, email, phone, cmnd, address} = req.body;

    if(!name){
        return res.render('register',{
            message: 'Họ và tên không được trống'
        })
    }else if(!birth){
        return res.render('register',{
            message: 'Ngày sinh không được trống'
        })
    }else if(!email){
        return res.render('register',{
            message: 'Email không được trống'
        })
    }else if(!phone){
        return res.render('register',{
            message: 'Số điện thoại không được trống'
        })
    }else if(!cmnd){
        return res.render('register',{
            message: 'Số chứng minh nhân dân không được trống'
        })
    }else if(!address){
        return res.render('register',{
            message: 'Địa chỉ không được trống'
        })
    }else{
        db.query('SELECT * FROM register WHERE email = ? OR phone_number = ?', [email,phone], async (error, result) => {
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
            let hashedpass = await bcrypt.hash(password,8)
            console.log(hashedpass)
            db.query('INSERT INTO register SET ?',{username : username, pass: hashedpass, name: name, email: email, phone_number: phone, identity: cmnd, address: address}, (error, result)=>{
                if(error){
                    console.log(error)
                } else{
                    // //mail
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
                        success: 'Đăng ký thành công, tên đăng nhập là: ' + username + ', mật khẩu là: ' + password
                    })
     
                }
            })
    
        })
    }

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