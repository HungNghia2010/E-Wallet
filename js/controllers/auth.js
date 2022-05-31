const db = require('../routers/db-config')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const dateTime = require('node-datetime')
const nodemailer = require('nodemailer');
const { text } = require('express');
const { parse } = require('dotenv');

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
            db.query('INSERT INTO register SET ?',{username : username, pass: hashedpass, name: nameeee, email: email, phone_number: phone, identity: cmnd, birth: birth ,address: address, status: 'chờ xác minh',role: 2, change_pass: 0, time_create_account: (dateTime.create()).format('d-m-Y')}, (error, result)=>{
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
                            db.query('UPDATE otp SET ? WHERE id = ?',[{otp: otp, expiry: formatted, checkotp: checkotp}, result[0].id]);
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
    }else if(tien < 0){
        return res.json({status:"error", error:"Số tiền không hợp lệ"})
    }else if (isNaN(Date.parse(dayex))){
        return res.json({status:"error", error:"Ngày không đúng định dạng"})
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
                        // Lịch sử
                        const ma_Giao_Dich = generateRandomString(6);
                        const date = dateTime.create();
                        const today = new Date();
                        const day = ("0" + today.getDate()).slice(-2);
                        const month = ("0" + (today.getMonth() + 1)).slice(-2);
                        const day_trading = day + "-" + month + "-" + today.getFullYear() ;
                        const time_trading = date.format('H:M:S');
                        db.query('INSERT INTO trading SET ?',{ma_Giao_Dich : ma_Giao_Dich , ma_Khach_Hang: req.user.id , money_trading : tien , day_trading : day_trading , time_trading : time_trading , trading_type : "Nạp tiền", trading_status : "Thành công"}, (error)=>{
                            if(error){
                                console.log(error)
                            } else{
                                return res.json({status:"success", success:"Nạp tiền thành công"})
                            }
                        })
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
                        const ma_Giao_Dich = generateRandomString(6);
                        const date = dateTime.create();
                        const today = new Date();
                        const day = ("0" + today.getDate()).slice(-2);
                        const month = ("0" + (today.getMonth() + 1)).slice(-2);
                        const day_trading = day + "-" + month + "-" + today.getFullYear() ;
                        const time_trading = date.format('H:M:S');
                        db.query('INSERT INTO trading SET ?',{ma_Giao_Dich : ma_Giao_Dich , ma_Khach_Hang: req.user.id , money_trading : tien , day_trading : day_trading , time_trading : time_trading , trading_type : "Nạp tiền", trading_status : "Thành công"}, (error)=>{
                            if(error){
                                console.log(error)
                            } else{
                                return res.json({status:"success", success:"Nạp tiền thành công"})
                            }
                        })
                    }
                })
            })
        }
    }else{
        return res.json({status:"error", error:"Thẻ này không được hỗ trợ"})
    }
}

exports.rut_tien = async(req,res) => {
    const {sotk, dayex, cvv, tien, ghichu} = req.body
    
    if(!sotk){
        return res.json({status:"error", error:"Hãy nhập số tài khoản"})
    }else if(!dayex){
        return res.json({status:"error", error:"Hãy nhập ngày hết hạn"})
    }else if(!cvv){
        return res.json({status:"error", error:"Hãy nhập cvv"})
    }else if(!tien){
        return res.json({status:"error", error:"Hãy nhập số tiền muốn nạp"})
    }else if (isNaN(Date.parse(dayex))){
        return res.json({status:"error", error:"Ngày không đúng định dạng"})
    }else if(Number.isNaN(Number(tien))){
        return res.json({status:"error", error:"Hãy nhập đúng số tiền"})
    }else if(!ghichu){
        return res.json({status:"error", error:"Hãy nhập ghi chú"})
    }else if(sotk === '333333'){
        if(dayex != '12/12/2022'){
            return res.json({status:"error", error:"Thông tin thẻ không hợp lệ"})
        }else if(cvv != '577'){
            return res.json({status:"error", error:"Thông tin thẻ không hợp lệ"})
        }else{
            return res.json({status:"error", error:"Thẻ này không được hỗ trợ để rút tiền"})
        }
    }else if(sotk === '222222'){
        if(dayex != '11/11/2022'){
            return res.json({status:"error", error:"Thông tin thẻ không hợp lệ"})
        }else if(cvv != '443'){
            return res.json({status:"error", error:"Thông tin thẻ không hợp lệ"})
        }else{
            return res.json({status:"error", error:"Thẻ này không được hỗ trợ để rút tiền"})
        }
    }else if(sotk === '111111'){
        if(dayex != '10/10/2022'){
            return res.json({status:"error", error:"Sai ngày hết hạn"})
        }else if(cvv != '411'){
            return res.json({status:"error", error:"CVV nhập không đúng"})
        }else{
            db.query('SELECT * FROM account WHERE id = ?',[req.user.id],(err,result) => {
                if(err){
                    console.log(err)
                }else if(parseInt(tien) % 50000 !== 0){
                    return res.json({status:"error", error:"Vui lòng nhập số tiền là bội số của 50,000vnđ"})
                }else if(parseInt(tien) < 50000){
                    return res.json({status:"error", error:"Vui lòng rút từ 50,000vnđ trở lên"})
                }else if(parseInt(tien) > parseInt(result[0].money)){
                    return res.json({status:"error", error:"Số tiền nhập lớn hơn số tiền hiện có"})
                }else if(parseInt(tien) < parseInt(result[0].money)){
                    const s = parseInt(tien*0.05) + parseInt(tien)
                    const phi = parseInt(tien*0.05)

                    const ma_Giao_Dich = generateRandomString(6);
                    const date = dateTime.create();
                    const today = new Date();
                    const day = ("0" + today.getDate()).slice(-2);
                    const month = ("0" + (today.getMonth() + 1)).slice(-2);
                    const day_trading = day + "-" + month + "-" + today.getFullYear() ;
                    const time_trading = date.format('H:M:S');

                    db.query('SELECT * FROM trading WHERE day_trading = ? AND trading_type = ? AND ma_Khach_Hang = ?',[day_trading,"Rút tiền",req.user.id], (err,result123) => {
                        if(err){
                            console.log(err)
                        }
                        else if(result123.length === 2){
                            return res.json({status:"error", error:"Hôm nay bạn đã rút tiền 2 lần, hãy rút tiếp vào ngày sau"})
                        }else if(parseInt(s) > parseInt(result[0].money)){
                            return res.json({status:"error", error:"Số tiền nhập cộng phí lớn hơn số tiền hiện có"})
                        }else if(tien > 5000000){
                            // add lịch sử
                            db.query('INSERT INTO trading SET ?',{ma_Giao_Dich : ma_Giao_Dich , ma_Khach_Hang: req.user.id , money_trading : s , day_trading : day_trading , time_trading : time_trading , trading_type : "Rút tiền", trading_status : "đang chờ", note_trading : ghichu}, (error)=>{
                                if (error){
                                    console.log(error)
                                }else{
                                    return res.json({status:"success", success:"Nộp đơn rút tiền thành công, số tiền phí là: " + phi + ", đợi admin xác nhận"})
                                }
                            })     
                        }else{
                            const money = parseInt(result[0].money) - parseInt(s)
                            db.query('UPDATE account SET money = ? WHERE id = ?',[money,req.user.id], (err,result1) => {
                                if(err){
                                    console.log(err)
                                }else{
                                    //add lịch sử
                                    const ma_Giao_Dich = generateRandomString(6);
                                    const date = dateTime.create();
                                    const today = new Date();
                                    const day = ("0" + today.getDate()).slice(-2);
                                    const month = ("0" + (today.getMonth() + 1)).slice(-2);
                                    const day_trading = day + "-" + month + "-" + today.getFullYear() ;
                                    const time_trading = date.format('H:M:S');
                                    db.query('INSERT INTO trading SET ?',{ma_Giao_Dich : ma_Giao_Dich , ma_Khach_Hang: req.user.id , money_trading : s , day_trading : day_trading , time_trading : time_trading , trading_type : "Rút tiền", trading_status : "Thành công", note_trading : ghichu}, (error)=>{
                                        if(error){
                                            console.log(error)
                                        } else{
                                            return res.json({status:"success", success:"Rút tiền thành công, số tiền phí bị trừ là:" + phi})
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
        }
    }else{
        return res.json({status:"error", error:"Thẻ này không được hỗ trợ"})
    }
}


exports.chuyen_tien = async (req, res) => {
    const {phone, tien, chiuphi, ghichu} = req.body
    var data = {
        phone: phone,
        tien: tien,
        chiuphi: chiuphi,
        ghichu: ghichu,
        phi : null,
        tennguoinhan: ""
    }
    if (data.chiuphi == 0){
        data.chiuphi = "người chuyển";
    }else{
        data.chiuphi = "người nhận";
    }

    if(!phone){
        return res.render('chuyen',{msg: 'Hãy nhập số điện thoại người nhận',user: req.user,data: data})
    }else if(!tien){
        return res.render('chuyen',{msg: 'Hãy nhập số tiền',user: req.user,data: data})
    }else if((data.tien <= 0) || Number.isNaN(Number(data.tien))){
        return res.render('chuyen',{msg: 'Tiền nhập không hợp lệ',user: req.user,data: data})
    }else if(!chiuphi){
        return res.render('chuyen',{msg: 'Hãy chọn người chịu phí',user: req.user,data: data})
    }else if(!ghichu){
        return res.render('chuyen',{msg: 'Mã nhập ghi chú',user: req.user,data: data})
    }else{
        db.query('SELECT * FROM register WHERE phone_number = ?',[data.phone],(err,result) => {
            if(err){
                console.log(err)
            }else if(result.length === 0){
                return res.render('chuyen',{msg: 'Không tồn tại người dùng có số điện thoại này',user: req.user,data: data})
            }else if (phone === req.user.phone_number){
                return res.render('chuyen',{msg: 'Không thể tự chuyển tiền cho chính mình',user: req.user,data: data})
            }else{
                db.query('SELECT * FROM account WHERE id = ?',[req.user.id],(err,result1) => {
                    if(err){
                        console.log(err)
                    }else if(parseInt(tien) > parseInt(result1[0].money)){
                        return res.render('chuyen',{msg: 'Số tiền nhập lớn hơn số tiền hiện có',user: req.user,data: data})
                    }
                    else {
                        db.query('SELECT * FROM register WHERE id = ?',[req.user.id], (err, result123) =>{
                            db.query('SELECT * FROM otp WHERE id = ?',[result[0].id] , async (error,result1) => {
                                const otp = generateRandomString(6)
                                const dt = dateTime.create()
                                const formatted = dt.format('H:M:S')
                                if(error){
                                    console.log(error)
                                }if(result1.length === 0){
                                    db.query('INSERT INTO otp SET ? ',{id: result[0].id, otp: otp, expiry: formatted});
                                }
                                else{
                                    db.query('UPDATE otp SET ? WHERE ?',[{otp: otp, expiry: formatted}, result[0].id]);
                                }
                            })
                            // var mailOptions = {
                            //     from: 'sinhvien@phongdaotao.com',
                            //     to: result123[0].email,
                            //     subject: 'Gửi OTP xác nhận chuyển khoản',
                            //     text: 'OTP của bạn là '+ otp +' , OTP này có hiệu quả trong vòng 1 phút,
                            // }
            
                            // transporter.sendMail(mailOptions,function(error, info) {
                            //     if(error){
                            //         console.log(error)
                            //     }
                            // })


                            data.phi = parseInt(data.tien) * 0.05;
                            data.tennguoinhan = result[0].name;
       
                            return res.render('xacnhanchuyen',{data});
                        })
                    }
                })
            }

           
        })
    }
}

exports.xacnhan_chuyen = async (req, res) => {
    const {tennguoinhan , phone , tien , phi , nguoichiuphi , ghichu ,otp} = req.body
    var data = {
        tennguoinhan : tennguoinhan,
        phone : phone,
        tien : tien,
        phi : phi,
        chiuphi : nguoichiuphi,
        ghichu : ghichu,
        otp : otp
    }
 
    if(!otp){
        return res.render('xacnhanchuyen',{msg: 'Vui lòng nhập mã OTP',user: req.user,data})
    }else {
        db.query('SELECT * FROM register WHERE phone_number = ?',[data.phone_Number],(err,result) => {
            if(err){
                console.log(err)
            }else if (data.tien > 5000000){
                const ma_Giao_Dich = generateRandomString(6);
                const date = dateTime.create();
                const today = new Date();
                const day = ("0" + today.getDate()).slice(-2);
                const month = ("0" + (today.getMonth() + 1)).slice(-2);
                const day_trading = day + "-" + month + "-" + today.getFullYear() ;
                const time_trading = date.format('H:M:S');
                const ma_Nguoi_Nhan = result[0].id;
                const ten_Nguoi_Nhan = result[0].name
                
                //lịch sử
                db.query('INSERT INTO transfer_trading SET ?',{ma_Giao_Dich : ma_Giao_Dich , ma_Khach_Hang : req.user.id , ma_Nguoi_Nhan : ma_Nguoi_Nhan , ten_Nguoi_Nhan : ten_Nguoi_Nhan , sdt_Nguoi_Nhan : phone , money_transfer : tien , day_trading : day_trading , time_trading : time_trading , trading_type : "Chuyển tiền", trading_status : "đang chờ", note_trading : ghichu},(error)=>{
                    if(error){
                        console.log(error)
                    } else{
                        return res.render('xacnhanchuyen',{success: 'Chuyển tiền thành công, số tiền phí bị trừ là:' + phi,user: req.user,data: data})
                    }
                })
            }
            else {
                db.query('SELECT * FROM account WHERE id = ?',[req.user.id],(err,result1) => {
                    if(err){
                        console.log(err)
                    }else if (data.chiuphi === "người chuyển"){
                        const money = parseInt(result1[0].money) - parseInt(tien)*1.05; 
                        db.query('UPDATE account SET money = ? WHERE id = ?',[money,req.user.id], (err,result2) => {
                            if(err){
                                console.log(err)
                            }else{
                                const ma_Giao_Dich = generateRandomString(6);
                                const date = dateTime.create();
                                const today = new Date();
                                const day = ("0" + today.getDate()).slice(-2);
                                const month = ("0" + (today.getMonth() + 1)).slice(-2);
                                const day_trading = day + "-" + month + "-" + today.getFullYear() ;
                                const time_trading = date.format('H:M:S');
                                //lịch sử
                                db.query('INSERT INTO transfer_trading SET ?',{ma_Giao_Dich : ma_Giao_Dich , ma_Khach_Hang: req.user.id , ma_Nguoi_Nhan : result[0].id , ten_Nguoi_Nhan : result[0].name , sdt_Nguoi_Nhan : phone , money_transfer : data.tien , day_trading : day_trading , time_trading : time_trading , trading_type : "Chuyển tiền", trading_status : "thành công", note_trading : ghichu},(error)=>{
                                    if(error){
                                        console.log(error)
                                    } else{
                                        db.query('SELECT * FROM account WHERE id = ?',[result[0].id], (err,result2) => {
                                            if (err){
                                                console.log(err)
                                            }else {
                                                const reciever = parseInt(result2[0].money) + parseInt(tien)
                                                db.query('UPDATE account SET money = ? WHERE id = ?',[reciever,result[0].id], (err) => {
                                                    if (err){
                                                        console.log(err);
                                                    }else{
                                                        return res.render('xacnhanchuyen',{success: 'Chuyển tiền thành công, số tiền phí bị trừ là:' + phi,user: req.user,data: data})
                                                    }
                                                })
                                                //return res.json({status:"success", success:"Chuyển tiền thành công, số tiền phí bị trừ là:" + phi})
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }else if (data.chiuphi === "người nhận"){
                        const money = parseInt(result1[0].money) - parseInt(tien); 
                        db.query('UPDATE account SET money = ? WHERE id = ?',[money,req.user.id], (err,result2) => {
                            if(err){
                                console.log(err)
                            }else{
                                const ma_Giao_Dich = generateRandomString(6);
                                const date = dateTime.create();
                                const today = new Date();
                                const day = ("0" + today.getDate()).slice(-2);
                                const month = ("0" + (today.getMonth() + 1)).slice(-2);
                                const day_trading = day + "-" + month + "-" + today.getFullYear() ;
                                const time_trading = date.format('H:M:S');
                                //lịch sử
                                db.query('INSERT INTO transfer_trading SET ?',{ma_Giao_Dich : ma_Giao_Dich , ma_Khach_Hang: req.user.id , ma_Nguoi_Nhan : result[0].id , ten_Nguoi_Nhan : result[0].name , sdt_Nguoi_Nhan : phone , money_transfer : data.tien , day_trading : day_trading , time_trading : time_trading , trading_type : "Chuyển tiền", trading_status : "thành công", note_trading : ghichu},(error)=>{
                                    if(error){
                                        console.log(error)
                                    }else{
                                        db.query('SELECT * FROM account WHERE id = ?',[result[0].id], (err,result2) => {
                                            if (err){
                                                console.log(err)
                                            }else {
                                                const reciever = parseInt(result2[0].money) + parseInt(tien)*0.95
                                                db.query('UPDATE account SET money = ? WHERE id = ?',[reciever,result[0].id], (err) => {
                                                    if (err){
                                                        console.log(err);
                                                    }else{
                                                        return res.render('xacnhanchuyen',{success: 'Chuyển tiền thành công, số tiền phí bị trừ là:' + phi,user: req.user,data: data})
                                                    }
                                                })
                                                //return res.json({status:"success", success:"Chuyển tiền thành công, số tiền phí bị trừ là:" + phi})
                                            }
                                        })
                                    }   
                                })
                            }
                        })
                    }
                })
            }
        })
    }
}
exports.cho_duyet = async (req, res) => {
    const {id_user, xacminh, bosungxacminh, huyxacminh} = req.body
    var data = {
        id_user: id_user,
        xacminh: xacminh,
        bosungxacminh:bosungxacminh,
        huyxacminh: huyxacminh

    }
    res.redirect('/xemchoduyet/'+id_user)
}

exports.vohieuhoa = async (req, res) => {
    const {id_user, mokhoa, huymokhoa} = req.body
    var data = {
        id_user: id_user,
        mokhoa: mokhoa,
        huymokhoa: huymokhoa
    }
    res.redirect('/xemvohieuhoa/'+id_user)
}

exports.vothoihan = async (req, res) => {
    const {id_user, mokhoavothoihan, huykhoavothoihan} = req.body
    var data = {
        id_user: id_user,
        mokhoavothoihan: mokhoavothoihan,
        huykhoavothoihan: huykhoavothoihan
    }
    res.redirect('/xemvothoihan/'+id_user)
}

exports.xemruttien = async (req, res) => {
    const {ma_Giao_Dich, id_user, money_trading, pheduyet, tuchoi} = req.body
    var data = {
        ma_Giao_Dich: ma_Giao_Dich,
        id_user: id_user,
        money_trading: money_trading,
        pheduyet: pheduyet,
        tuchoi: tuchoi
    }
        res.redirect('/xemruttien/'+ma_Giao_Dich)
}

exports.xemchuyentien = async (req, res) => {
    const {id_user, money_transfer, sdt_Nguoi_Nhan, ma_Giao_Dich, pheduyetchuyentien, tuchoichuyentien} = req.body
    var data = {
        id_user: id_user,
        money_transfer: money_transfer,
        sdt_Nguoi_Nhan: sdt_Nguoi_Nhan,
        ma_Giao_Dich: ma_Giao_Dich,
        pheduyetchuyentien: pheduyetchuyentien,
        tuchoichuyentien: tuchoichuyentien
    }
    res.redirect('/xemchuyentien/'+ma_Giao_Dich)
}

exports.muatheviettel = async (req, res) => {
    const{gia, soluong} = req.body;
    const tongtien = parseInt(gia) * parseInt(soluong)
   
    const n = parseInt(soluong)
    var test = new Array();
    
    db.query('SELECT * FROM account WHERE id = ?',[req.user.id],(err,result) => {
        if(tongtien > result[0].money){
            return res.render('muatheviettel',{msg: 'Số dư không đủ để thực hiện giao dịch này',user: req.user,data})
        }else{
            for (let i = 0 ; i < soluong  ; i++){
                const username = Math.floor(1000 + Math.random() * 9000);
                const seriThe = Math.floor(1000000000 + Math.random() * 900000000);
                const s = '11111';
                const the = s + username;
                var data = {
                    gia  : gia,
                    seri : "",
                    the  : "",
                    loai : ""
                }
                data.loai = "Viettel"
                data.seri = seriThe.toString();
                data.the = the;
                test.push(data)
            }
            for (let j = 0 ; j < test.length; j++){
                const ma_Giao_Dich = generateRandomString(6);
                const date = dateTime.create();
                const today = new Date();
                const day = ("0" + today.getDate()).slice(-2);
                const month = ("0" + (today.getMonth() + 1)).slice(-2);
                const day_trading = day + "-" + month + "-" + today.getFullYear() ;
                const time_trading = date.format('H:M:S');
              
                db.query('INSERT INTO trading_card SET ?',{ma_Giao_Dich : ma_Giao_Dich , ma_Khach_Hang: req.user.id , card_seri : test[0].seri , ma_The : test[j].the , card_type : test[j].loai , day_trading : day_trading , time_trading : time_trading , price : test[j].gia, trading_type : 'Thẻ cào', trading_status : 'Thành công'},(error)=>{
                    if (error){
                        console.log(error);
                    }else{
                        //return res.json({success: 'Mua thẻ cào thành công',user: req.user})
                        //return res.render('muatheviettel',{success: 'Mua thẻ cào thành công', user: req.user,data})
                    }
                })
            }
            return res.render('muatheviettel',{success: 'Mua thẻ cào thành công', user: req.user,data})
            //return res.render('muatheviettel',{success: 'Mua thẻ cào thành công',user: req.user,test})
        }
    })
}

exports.muathemobi = async (req, res) => {
    const{gia, soluong} = req.body;
    const tongtien = parseInt(gia) * parseInt(soluong)
   
    const n = parseInt(soluong)
    var test = new Array();
    
    db.query('SELECT * FROM account WHERE id = ?',[req.user.id],(err,result) => {
        if(tongtien > result[0].money){
            return res.render('muathemobi',{msg: 'Số dư không đủ để thực hiện giao dịch này',user: req.user,data})
        }else{
            for (let i = 0 ; i < soluong  ; i++){
                const username = Math.floor(1000 + Math.random() * 9000);
                const seriThe = Math.floor(1000000000 + Math.random() * 900000000);
                const s = '22222';
                const the = s + username;
                var data = {
                    gia  : gia,
                    seri : "",
                    the  : "",
                    loai : ""
                }
                data.loai = "Mobifone"
                data.seri = seriThe.toString();
                data.the = the;
                test.push(data)
            }
            for (let j = 0 ; j < test.length; j++){
                const ma_Giao_Dich = generateRandomString(6);
                const date = dateTime.create();
                const today = new Date();
                const day = ("0" + today.getDate()).slice(-2);
                const month = ("0" + (today.getMonth() + 1)).slice(-2);
                const day_trading = day + "-" + month + "-" + today.getFullYear() ;
                const time_trading = date.format('H:M:S');
              
                db.query('INSERT INTO trading_card SET ?',{ma_Giao_Dich : ma_Giao_Dich , ma_Khach_Hang: req.user.id , card_seri : test[0].seri , ma_The : test[j].the , card_type : test[j].loai , day_trading : day_trading , time_trading : time_trading , price : test[j].gia , trading_type : 'Thẻ cào', trading_status : 'Thành công'},(error)=>{
                    if (error){
                        console.log(error);
                    }else{
                        //return res.json({success: 'Mua thẻ cào thành công',user: req.user})
                        //return res.render('muatheviettel',{success: 'Mua thẻ cào thành công', user: req.user,data})
                    }
                })
            }
            return res.render('muathemobi',{success: 'Mua thẻ cào thành công', user: req.user,data})
            //return res.render('muatheviettel',{success: 'Mua thẻ cào thành công',user: req.user,test})
        }
    })
}


exports.muathevina = async (req, res) => {
    const{gia, soluong} = req.body;
    const tongtien = parseInt(gia) * parseInt(soluong)
   
    const n = parseInt(soluong)
    var test = new Array();
    
    db.query('SELECT * FROM account WHERE id = ?',[req.user.id],(err,result) => {
        if(tongtien > result[0].money){
            return res.render('muathevina',{msg: 'Số dư không đủ để thực hiện giao dịch này',user: req.user,data})
        }else{
            for (let i = 0 ; i < soluong  ; i++){
                const username = Math.floor(1000 + Math.random() * 9000);
                const seriThe = Math.floor(1000000000 + Math.random() * 900000000);
                const s = '33333';
                const the = s + username;
                var data = {
                    gia  : gia,
                    seri : "",
                    the  : "",
                    loai : ""
                }
                data.loai = "Vinaphone"
                data.seri = seriThe.toString();
                data.the = the;
                test.push(data)
            }
            for (let j = 0 ; j < test.length; j++){
                const ma_Giao_Dich = generateRandomString(6);
                const date = dateTime.create();
                const today = new Date();
                const day = ("0" + today.getDate()).slice(-2);
                const month = ("0" + (today.getMonth() + 1)).slice(-2);
                const day_trading = day + "-" + month + "-" + today.getFullYear() ;
                const time_trading = date.format('H:M:S');
              
                db.query('INSERT INTO trading_card SET ?',{ma_Giao_Dich : ma_Giao_Dich , ma_Khach_Hang: req.user.id , card_seri : test[0].seri , ma_The : test[j].the , card_type : test[j].loai , day_trading : day_trading , time_trading : time_trading , price : test[j].gia, trading_type : 'Thẻ cào', trading_status : 'Thành công'},(error)=>{
                    if (error){
                        console.log(error);
                    }else{
                        //return res.json({success: 'Mua thẻ cào thành công',user: req.user})
                        //return res.render('muatheviettel',{success: 'Mua thẻ cào thành công', user: req.user,data})
                    }
                })
            }
            return res.render('muathevina',{success: 'Mua thẻ cào thành công', user: req.user,data})
            //return res.render('muatheviettel',{success: 'Mua thẻ cào thành công',user: req.user,test})
        }
    })
}


//random string for password
function generateRandomString(myLength) {
    const chars = "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz1234567890";
    const randomArray = Array.from(
        { length: myLength },
        (v, k) => chars[Math.floor(Math.random() * chars.length)]
    );

    const randomString = randomArray.join("");
    return randomString;
}

