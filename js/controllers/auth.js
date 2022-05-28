const db = require('../routers/db-config')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const dateTime = require('node-datetime')
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


let wrongPassword = 0;
let loginAbnormality = 0;
let lockIndefinitely = 0;
const role = 1;
exports.login = async (req, res) => {
    try{

        const {username,pwd} = req.body
        console.log(req.body)
        if (lockIndefinitely != 1) {        
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
                        console.log("wrong password")
                        wrongPassword++;
                        console.log(wrongPassword);
                        db.query('UPDATE lockAccount SET wrongPassword = ? WHERE username = ?', [wrongPassword, username]);
                        if(wrongPassword === 3){
                            if(loginAbnormality === 1) {
                                lockIndefinitely = 1;
                                db.query('UPDATE lockAccount SET lockIndefinitely = ?, lockTime = NOW() WHERE username = ?', [lockIndefinitely, username]);
                                return res.json({status:"error", error:"Tài khoản đã bị khóa do nhập sai mật khẩu nhiều lần, vui lòng liên hệ quản trị viên để được hỗ trợ"});
                            }
                            loginAbnormality += 1;
                            db.query('UPDATE lockAccount SET loginAbnormality = ? WHERE username = ?', [loginAbnormality, username]);
                            wrongPassword = 0;
                            return res.json({status:"error", error:"Tài khoản hiện đang bị tạm khóa, vui lòng thử lại sau 1 phút"});
                        }
                        return res.json({status:"error", error:"Mật khẩu không chính xác"})
                    }else{
                        if(loginAbnormality === 1) {
                            wrongPassword = 0;
                            loginAbnormality = 0;
                            db.query('UPDATE lockAccount SET wrongPassword = ?, loginAbnormality = ? WHERE username = ?', [wrongPassword, loginAbnormality, username]);
                        }
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
        }
        else {
            return res.json({status:"error", error:"Tài khoản đã bị khóa do nhập sai mật khẩu nhiều lần, vui lòng liên hệ quản trị viên để được hỗ trợ"});
        }

    }catch(error){
        console.log(error)
    }
}

exports.register = async (req, res) => {

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
    // }else if(!images){
    //     return res.json({status:"error", error:"Hãy tải ảnh chứng minh nhân dân"});
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
            db.query('INSERT INTO register SET ?',{username : username, pass: hashedpass, name: nameeee, email: email, phone_number: phone, identity: cmnd, birth: birth ,address: address, status: 'chờ xác minh',role: 2, change_pass: 0}, (error, result)=>{
                if(error){
                    console.log(error)
                } else{
                    //mail
                    // var mailOptions = {
                    //     from: 'sinhvien@phongdaotao.com',
                    //     to: email,
                    //     subject: 'Gửi thông tin đăng nhập',
                    //     text: 'Tên đăng nhập: '+ username +' , Mật khẩu: ' + password,
                    // }
    
                    // transporter.sendMail(mailOptions,function(error, info) {
                    //     if(error){
                    //         console.log(error)
                    //     }else{
                    //         return res.json({status: "success", success: "Hãy kiểm tra mail để biết username và password" });
                    //     }
                    // })
                    return res.json({status: "success", success: "Tên đăng nhập là: "+username+", Mật khẩu là: " + password });
                }
            })
    
        })
        db.query('INSERT INTO lockAccount SET ?', {username : username, wrongPassword: 0, loginAbnormality: 0, lockIndefinitely: 0, lockTime: ''});
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
        db.query("UPDATE register SET pass = ?, change_pass = ? WHERE id = ?", [hashedpass,1,req.user.id], async (err,result) => {
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
        return res.json({status:"error", error:"Hãy nhập mật khẩu hiện tại"});
    }else if(!pwdnew){
        return res.json({status:"error", error:"Hãy nhập mật khẩu mới"});
    }else if(pwdnew.length < 6){
        return res.json({status:"error", error:"Mật khẩu mới phải tối thiểu 6 ký tự"});
    }else if(pwdnew === pwd){
        return res.json({status:"error", error:"Mật khẩu mới không được giống mật khẩu cũ"});
    }else if(!pwdcf){
        return res.json({status:"error", error:"Hãy xác nhận mật khẩu mới"});
    }else if(!(pwdnew === pwdcf)){
        return res.json({status:"error", error:"Mật khẩu xác nhận không khớp"});
    }else{
        db.query('SELECT pass FROM register WHERE id = ?',[req.user.id], async (error, result) => {
            if(error){
                console.log(error)
            }else{
                if(!(await bcrypt.compare(pwd,result[0].pass))){
                    return res.json({status:"error", error:"Mật khẩu hiện tại không chính xác"});
                }else{
                    let hashedpass = await bcrypt.hash(pwdnew, 8)
                    db.query('UPDATE register SET pass = ? WHERE id = ?', [hashedpass, req.user.id], (error, result) => {
                        if(error){
                            console.log(error)
                        }else{
                            return res.json({status:"success", success:"Đổi mật khẩu thành công"});
                        }
                    })
                }
            }
        })
    }
}

exports.checkmail = async(req, res) => {
    const {email} = req.body

    if(!email){
        return res.render('forgotpass',{msg: 'Hãy nhập email'})
    }else{
        db.query('SELECT * FROM register WHERE email = ?', [email], async (error,result) => {
            if(error){
                console.log(error)
            }else{
                if(result.length === 0){
                    return res.render('forgotpass',{msg: 'Email này không tồn tại'})
                }else{
                    const otp = generateRandomString(6)
                    const dt = dateTime.create()
                    const formatted = dt.format('H:M:S')
                    db.query('SELECT * FROM otp WHERE id = ?',[result[0].id] , async (error,result1) => {
                        if(error){
                            console.log(error)
                        }if(result1.length === 0){
                            db.query('INSERT INTO otp SET ? ',{id: result[0].id, otp: otp, expiry: formatted});
                        }else{
                            db.query('UPDATE otp SET ? WHERE ?',[{otp: otp, expiry: formatted}, result[0].id]);
                        }
                    })
                    // var mailOptions = {
                    //     from: 'sinhvien@phongdaotao.com',
                    //     to: email,
                    //     subject: 'Gửi OTP đổi mật khẩu',
                    //     text: 'Tên đăng nhập: '+ username +' , Mật khẩu: ' + password,
                    // }
    
                    // transporter.sendMail(mailOptions,function(error, info) {
                    //     if(error){
                    //         console.log(error)
                    //     }else{
                    //         return res.json({status: "success", success: "Hãy kiểm tra mail để biết username và password" });
                    //     }
                    // })
                    const token = jwt.sign({ id: result[0].id }, process.env.JWT_SECRET, {
                        expiresIn: process.env.JWT_EXPIRRES
                    })
                    const cookieOptions = {
                        expiresIn: new Date(Date.now() + process.env.COOKIE_EXPIRRES * 24 * 60 * 60 * 1000),
                        httpOnly: true
                    }
                    res.cookie("userOTP", token, cookieOptions)

                    res.render('forgotpass',{success: 'Mã otp của bạn là: ' + otp})
                }
            }
        })
    }
}

exports.checkotp = async(req, res) => {
    const {otp} = req.body
    
    if(!otp){
        return res.render('otp',{msg: 'Hãy nhập otp'})
    }else{
        db.query('')
    }

}

exports.update_info = async (req, res) => {
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
        db.query("UPDATE register SET ? WHERE ?",[{name: nameeee, email: email, phone_number: phone, identity: cmnd, birth: birth ,address: address}, req.user.id ] , (err,result) => {
            if(err){
                console.log(err)
            }else {
                return res.json({status:"success", success:"Cập nhật thành công"});
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