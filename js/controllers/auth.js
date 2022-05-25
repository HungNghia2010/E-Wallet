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

        if(!username){
            return res.json({status:"error", error:"Hãy nhập tên đăng nhập"})
        }else if(!pwd){
            return res.json({status:"error", error:"Hãy nhập mật khẩu"})
        }else if(pwd.length < 6){
            return res.json({status:"error", error:"Mật khẩu phải có tối thiểu 6 ký tự"})
        }
        else{
            db.query('SELECT * FROM register WHERE username = ?', [username], async (error,result) => {
                if(result.length === 0){
                    return res.json({status:"error", error:"Tên đăng nhập không tồn tại"})
                }
                else if(!result || !(await bcrypt.compare(pwd,result[0].pass))){
                    return res.json({status:"error", error:"Mật khẩu không chính xác"})
                }else{
                    const token = jwt.sign({ id: result[0].id }, process.env.JWT_SECRET, {
                        expiresIn: process.env.JWT_EXPIRRES
                    })
                    const cookieOptions = {
                        expiresIn: new Date(Date.now() + process.env.COOKIE_EXPIRRES * 24 * 60 * 60 * 1000),
                        httpOnly: true
                    }
                    res.cookie("userRegistered", token, cookieOptions)
                    return res.json({status: "success", success: "User has been logged In"})
                }
            })
        }

    }catch(error){
        console.log(error)
    }
}

exports.register = async (req, res) => {
    //console.log(req.body)

    const { nameeee, birth, email, phone, cmnd, address} = req.body;

    if(!nameeee){
        return res.json({status:"error", error:"Hãy nhập tên"})
    }else if(!birth){
        return res.json({status:"error", error:"Hãy nhập ngày sinh"});
    }else if(!email){
        return res.json({status:"error", error:"Hãy nhập email"});
    }else if(!phone){
        return res.json({status:"error", error:"Hãy nhập số điện thoại"});
    }else if(!cmnd){
        return res.json({status:"error", error:"Hãy nhập chứng minh nhân dân"});
    }else if(!address){
        return res.json({status:"error", error:"Hãy nhập địa chỉ"});
    }else{
        db.query('SELECT * FROM register WHERE email = ? OR phone_number = ?', [email,phone], async (error, result) => {
            if(error){
                console.log(error)
            }
    
            if(result.length > 0){
                return res.json({status:"error", error:"Email hoặc số điện thoại này đã được sử dụng"});
            }
    
            const username = Math.floor(1000000000 + Math.random() * 9000000000);
            const password = generateRandomString(6);
            let hashedpass = await bcrypt.hash(password,8)
            db.query('INSERT INTO register SET ?',{username : username, pass: hashedpass, name: nameeee, email: email, phone_number: phone, identity: cmnd, birth: birth ,address: address, status: 'Đang chờ', role: 2, change_pass: 0}, (error, result)=>{
                if(error){
                    console.log(error)
                } else{
                    //mail
                    var mailOptions = {
                        from: 'sinhvien@phongdaotao.com',
                        to: email,
                        subject: 'Gửi thông tin đăng nhập',
                        text: 'Tên đăng nhập: '+ username +' , Mật khẩu: ' + password,
                    }
    
                    transporter.sendMail(mailOptions,function(error, info) {
                        if(error){
                            console.log(error)
                        }else{
                            return res.json({status: "success", success: "Hãy kiểm tra mail để biết username và password" });
                        }
                    })
                }
            })
    
        })
    }

}

exports.change_passft = async (req, res) => {
    const {pwd,pwdcf} = req.body
    if(!pwd){
        return res.json({status:"error", error:"Hãy nhập mật khẩu mới"})
    }else if(!pwdcf){
        return res.json({status:"error", error:"Hãy xác nhận lại mật khẩu"})
    }else if(pwd.length < 6){
        return res.json({status:"error", error:"Mật khẩu phải có tối thiểu 6 ký tự"})
    }else {
        let hashedpass = await bcrypt.hash(pwd,8)
        db.query("UPDATE register SET pass = ?, change_pass = ? WHERE id = ?", [hashedpass,1,req.user.id], (err,result) => {
            if(err){
                console.log(err)
            } else{
                return res.json({status:"success", success:"Đổi mật khẩu thành công"})
            }
        })
    }
}

exports.change_pass = async (req, res) => {
    const {pwd, pwdnew, pwdcf} = req.body
    
    if(!pwd){
        console.log('123142')
    }
}

exports.checkmail = async(req, res) => {
    const {email} = req.body

    if(!email){
        return res.json({status:"error", error:"Hãy nhập email"})
    }else{
        db.query('SELECT * FROM register WHERE email = ?', [email], async (error,result) => {
            if(error){
                console.log(error)
            }else{
                if(result.length === 0){
                    return res.json({status:"error", error:"Email không tồn tại"})
                }else{
                    var mailOptions = {
                        from: 'sinhvien@phongdaotao.com',
                        to: email,
                        subject: 'Gửi OTP đổi mật khẩu',
                        text: 'Tên đăng nhập: '+ username +' , Mật khẩu: ' + password,
                    }
    
                    transporter.sendMail(mailOptions,function(error, info) {
                        if(error){
                            console.log(error)
                        }else{
                            return res.json({status: "success", success: "Hãy kiểm tra mail để biết username và password" });
                        }
                    })
                }
            }
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