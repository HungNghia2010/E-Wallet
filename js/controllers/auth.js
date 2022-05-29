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
const role = 1; //admin

let minutesStartLock = 0;
let minutesEndLock = 0;
let tempLock = 0;
exports.login = async (req, res) => {
    const time = dateTime.create();
    const timeFM = time.format('H:M:S');
    const minutesNow = parseInt(timeFM.split(':')[1]);
    const secondNow = parseInt(timeFM.split(':')[2]);
    
    try{

        const {username,pwd} = req.body
        //console.log(req.body)
        db.query('SELECT * FROM lockaccount WHERE username = ?', [username], async (error,result) => {
            if(result.length === 0){
                return res.json({status:"error", error:"Tài khoản không tồn tại"})
            }
            else if (result[0].loginAbnormality <= 1) {     
                if(tempLock != 1){
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
                                db.query('SELECT * FROM register WHERE username = ? and role = ?', [username, role], async (error,result) => {
                                    if(result.length === 0) {
                                        wrongPassword++;
                                        db.query('UPDATE lockaccount SET wrongPassword = ? WHERE username = ?', [wrongPassword, username]);
                                        db.query('SELECT * FROM lockaccount WHERE username = ?', [username], async (error,result) => {
                                                if(result[0].wrongPassword === 3){
                                                    if(result[0].loginAbnormality === 1) {
                                                        loginAbnormality += 1;
                                                        wrongPassword = 0;
                                                        db.query('UPDATE lockaccount SET wrongPassword = ?, loginAbnormality = ?, lockTime = NOW() WHERE username = ?', [wrongPassword, loginAbnormality, username]);
                                                        return res.json({status:"error", error:"Tài khoản đã bị khóa do nhập sai mật khẩu nhiều lần, vui lòng liên hệ quản trị viên để được hỗ trợ"});
                                                    }
                                                    loginAbnormality += 1;
                                                    wrongPassword = 0;
                                                    const startLockTime = dateTime.create();
                                                    const startLockTimeFM = startLockTime.format('H:M:S');
                                                    minutesStartLock = startLockTimeFM.split(':')[1];
                                                    secondEndLock = startLockTimeFM.split(':')[2];
                                                    minutesEndLock = parseInt(minutesStartLock) + 1;
                                                    tempLock = 1;
                                                    db.query('UPDATE lockaccount SET wrongPassword = ?, loginAbnormality = ? WHERE username = ?', [wrongPassword, loginAbnormality, username]);
                                                    return res.json({status:"error", error:"Tài khoản hiện đang bị tạm khóa, vui lòng thử lại sau 1 phút"});
                                                }
                                                return res.json({status:"error", error:"Mật khẩu không chính xác"})
                                        });
                                    }
                                    else {
                                        return res.json({status:"error", error:"Mật khẩu không chính xác"})
                                    }
                                })
                            }else{
                                db.query('SELECT * FROM account WHERE id = ?',[result[0].id], async(err, result01) => {
                                    if(result01.length === 0){
                                        db.query('INSERT INTO account SET ?', {id: result[0].id, money: 0})
                                    }
                                })
                                wrongPassword = 0;
                                loginAbnormality = 0;
                                db.query('UPDATE lockaccount SET wrongPassword = ?, loginAbnormality = ? WHERE username = ?', [wrongPassword, loginAbnormality, username]);
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
                else if((minutesEndLock <= minutesNow) && (secondEndLock <= secondNow)) {
                    tempLock = 0;
                }
                else {
                    return res.json({status:"error", error:"Tài khoản hiện đang bị tạm khóa, vui lòng thử lại sau 1 phút"})
                }
            }
            else {
                return res.json({status:"error", error:"Tài khoản đã bị khóa do nhập sai mật khẩu nhiều lần, vui lòng liên hệ quản trị viên để được hỗ trợ"});
            }
        });

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
        const username = Math.floor(1000000000 + Math.random() * 9000000000);
        db.query('SELECT * FROM register WHERE email = ? OR phone_number = ?', [email,phone], async (error, result) => {
            if(error){
                console.log(error)
            }
    
            if(result.length > 0){
                return res.json({status:"error", error:"Email hoặc số điện thoại này đã được sử dụng"});
            }

            const password = generateRandomString(6);
            let hashedpass = await bcrypt.hash(password,8)
            db.query('INSERT INTO register SET ?',{username : username, pass: hashedpass, name: nameeee, email: email, phone_number: phone, identity: cmnd, birth: birth ,address: address, status: 'chờ xác minh',role: 2, change_pass: 0}, (error, result)=>{
                if(error){
                    console.log(error)
                } else{
                    //Gửi mail
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
                    //vì không gửi được nên thông báo username + password ra dialog
                    return res.json({status: "success", success: "Tên đăng nhập là: "+username+", Mật khẩu là: " + password });
                }
            })
    
        })
        db.query('INSERT INTO lockaccount SET ?', {username : username, wrongPassword: 0, loginAbnormality: 0, lockTime: ''});
    }

}

exports.change_passft = async (req, res) => {
    const {pwd,pwdcf} = req.body
    if(!pwd){
        return res.json({status:"error", error:"Hãy nhập mật khẩu mới"})
    }else if(!pwdcf){
        return res.json({status:"error", error:"Hãy xác nhận lại mật khẩu"})
    }else if(pwd != pwdcf){
        return res.json({status:"error", error:"Mật khẩu xác nhận không đúng"})
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
    const {pwd, pwdnew, pwdconfirm} = req.body
   
    if(!pwd){
        return res.json({status:"error", error:"Hãy nhập mật khẩu hiện tại"});
    }else if(!pwdnew){
        return res.json({status:"error", error:"Hãy nhập mật khẩu mới"});
    }else if(pwdnew.length < 6){
        return res.json({status:"error", error:"Mật khẩu mới phải tối thiểu 6 ký tự"});
    }else if(pwdnew === pwd){
        return res.json({status:"error", error:"Mật khẩu mới không được giống mật khẩu cũ"});
    }else if(!pwdconfirm){
        return res.json({status:"error", error:"Hãy xác nhận mật khẩu mới"});
    }else if(!(pwdnew === pwdconfirm)){
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
                    const checkotp = 0
                    db.query('SELECT * FROM otp WHERE id = ?',[result[0].id] , async (error,result1) => {
                        if(error){
                            console.log(error)
                        }if(result1.length === 0){
                            db.query('INSERT INTO otp SET ? ',{id: result[0].id, otp: otp, expiry: formatted, checkotp: checkotp});
                        }
                        else{
                            db.query('UPDATE otp SET ? WHERE ?',[{otp: otp, expiry: formatted, checkotp: checkotp}, result[0].id]);
                        }
                    })
                    // var mailOptions = {
                    //     from: 'sinhvien@phongdaotao.com',
                    //     to: email,
                    //     subject: 'Gửi OTP đổi mật khẩu',
                    //     text: 'OTP của bạn là '+ otp +' , OTP này có hiệu quả trong vòng 1 phút,
                    // }
    
                    // transporter.sendMail(mailOptions,function(error, info) {
                    //     if(error){
                    //         console.log(error)
                    //     }else{
                    //         res.render('forgotpass',{success: 'Hãy kiểm tra mail để lấy otp'});
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
        db.query('SELECT * FROM otp WHERE id = ?', [req.otp.id] ,  async (err,result) => {
            const dt = dateTime.create()
            const formatted = dt.format('H:M:S')
            hn = formatted.split(':')[0] * 3600;
            mn = formatted.split(':')[1] * 60;
            sn = formatted.split(':')[2];

            const time = result[0].expiry
            h = time.split(':')[0] * 3600;
            m = time.split(':')[1] * 60;
            s = time.split(':')[2];

            const timeexpiry = (hn + mn + sn) - (h + m + s);

            if(err){
                console.log(error)
            }else if(otp != result[0].otp){
                return res.render('otp',{msg: 'Mã otp này không đúng'})
            }else if(timeexpiry > 60){
                res.clearCookie("userOTP")
                return res.render('otp',{out: 'Mã otp đã hết hạn hãy gửi lại'})
            }else {
                db.query('UPDATE otp SET checkotp = ? WHERE otp = ?', [1,otp] , (err,result) => {
                    if(err){
                        console.log(error)
                    }else{
                        return res.render('otp',{success: 'OTP chính xác hãy qua trang đổi mật khẩu'})
                    }
                })
            }

        })
    }

}

exports.change_passforgot = async(req,res) => {
    const {pwd,pwdconfirm} = req.body
    if(!pwd){
        return res.render('changepassforgot',{msg: 'Hãy nhập mật khẩu mới'})
    }else if (!pwdconfirm){
        return res.render('changepassforgot',{msg: 'Hãy nhập mật khẩu xác nhận'})
    }else if(pwd != pwdconfirm){
        return res.render('changepassforgot',{msg: 'Mật khẩu xác nhận không đúng'})
    }else if(pwd.length < 6){
        return res.render('changepassforgot',{msg: 'Độ dài mật khẩu phải tối thiểu 6 ký tự'})
    }else{
        let hashedpass = await bcrypt.hash(pwd,8)
        db.query("UPDATE register SET pass = ? WHERE id = ?", [hashedpass,req.otp.id], async (err,result) => {
            if(err){
                console.log(err)
            } else{
                db.query("UPDATE otp set checkotp = ? WHERE id = ?", [0, req.otp.id])
                res.clearCookie("userOTP")
                return res.render('changepassforgot',{success: 'Đổi mật khẩu thành công'})
            }
        })
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

// Check activated

exports.isActivated = async(req,res,next) => {
    if (!req.cookies.userRegistered) return next();
    try{
        const decoded = jwt.verify(req.cookies.userRegistered, process.env.JWT_SECRET)
        db.query('SELECT * FROM register INNER JOIN account WHERE register.id = account.id AND register.id = ?', [decoded.id], async (error,result) => {
        if(error) return next()
            req.user = result[0]
            if(result[0].role === 1){
                req.user.auth = 'Admin'
            }
            return next()
        })
    }catch (err){
        if(err) return next()
    }
}

exports.nap_tien = async(req, res) => {
    const {sotk, dayex, cvv, tien} = req.body
    
    if(!sotk){
        return res.json({status:"error", error:"Hãy nhập số tài khoản"})
    }else if(!dayex){
        return res.json({status:"error", error:"Hãy nhập ngày hết hạn"})
    }else if(!cvv){
        return res.json({status:"error", error:"Hãy nhập cvv"})
    }else if(!tien){
        return res.json({status:"error", error:"Hãy nhập số tiền muốn nạp"})
    }else if(Number.isNaN(Number(tien))){
        return res.json({status:"error", error:"Hãy nhập đúng số tiền"})
    }else if(sotk === '333333'){
        if(dayex != '12/12/2022'){
            return res.json({status:"error", error:"Sai ngày hết hạn"})
        }else if(cvv != '577'){
            return res.json({status:"error", error:"CVV nhập không đúng"})
        }else{
            return res.json({status:"error", error:"Thẻ đã hết tiền không thể nạp được"})
        }
    }else if(sotk === '222222'){
        if(dayex != '11/11/2022'){
            return res.json({status:"error", error:"Sai ngày hết hạn"})
        }else if(cvv != '443'){
            return res.json({status:"error", error:"CVV nhập không đúng"})
        }else if(tien > 1000000){
            return res.json({status:"error", error:"Số tiền không được vượt quá 1 triệu"})
        }else{
            db.query('SELECT * FROM account WHERE id = ?',[req.user.id],(err,result) => {
                const money = parseInt(tien) + parseInt(result[0].money)
                db.query('UPDATE account SET money = ? WHERE id = ?',[money,req.user.id], (err,result1) => {
                    if(err){
                        console.log(err)
                    }else{
                        return res.json({status:"success", success:"Nạp tiền thành công"})
                    }
                })
            })
        }
    }else if(sotk === '111111'){
        if(dayex != '10/10/2022'){
            return res.json({status:"error", error:"Sai ngày hết hạn"})
        }else if(cvv != '411'){
            return res.json({status:"error", error:"CVV nhập không đúng"})
        }else{
            db.query('SELECT * FROM account WHERE id = ?',[req.user.id],(err,result) => {
                const money = parseInt(tien) + parseInt(result[0].money)
                db.query('UPDATE account SET money = ? WHERE id = ?',[money,req.user.id], (err,result1) => {
                    if(err){
                        console.log(err)
                    }else{
                        return res.json({status:"success", success:"Nạp tiền thành công"})
                    }
                })
            })
        }
    }else{
        return res.json({status:"error", error:"Thẻ này không được hỗ trợ"})
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