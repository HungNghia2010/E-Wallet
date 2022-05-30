
//login
var login = document.getElementById('form-login')
//register
var register = document.getElementById("form")
//đổi mật khẩu info
var infochange = document.getElementById('form-changepass')
//đổi mật khẩu lần đầu đăng nhập
var firststep = document.getElementById("form-first-changePass")
//cập nhật thông tin
var updateinfo = document.getElementById("form-update-info")
//nạp tiền
var nap = document.getElementById("form-nap-tien")
//rút tiền
var rut = document.getElementById("form-rut-tien")
//chuyển tiền
var chuyen = document.getElementById("form-chuyen-tien")

var navbar = document.querySelector('.navbar');

if(login){
    validateLogin()
}else if(register){
    validateRegister()
}else if(infochange){
    validatechangepassinfo()
    document.getElementById('close').onclick = function(){
        dialogCont.style.display = "none"
        window.location.reload()
    }
}else if(firststep){
    validatefirststep()
}else if(updateinfo){
    valideUpdateform()
    document.getElementById('close').onclick = function(){
        dialogCont.style.display = "none"
        window.location.reload()
    }
}else if(nap){
    const s = document.getElementById('money').value;
    document.getElementById('money').setAttribute('value',formatCash(s) + 'đ');

    document.getElementById('close').onclick = function(){
        dialogCont.style.display = "none"
        window.location.reload()
    }
    
    naptien()
}else if(rut){
    const s = document.getElementById('money').value;
    document.getElementById('money').setAttribute('value',formatCash(s) + 'đ');

    document.getElementById('close').onclick = function(){
        dialogCont.style.display = "none"
        window.location.reload()
    }
    ruttien()
    
}else if(chuyen){
    const s = document.getElementById('money').value;
    document.getElementById('money').setAttribute('value',formatCash(s) + 'đ');
    
}else if (navbar){
    
    document.querySelector('#menu-btn').onclick = () => {
        navbar.classList.toggle('active');
    }
    
    window.onscroll = () => {
        navbar.classList.remove('active');
    }
    var slideIndex = 1;
    showDivs(slideIndex);


}
 else {
    // Slide show
    var slideIndex = 1;
    showDivs(slideIndex);
}
//login
function validateLogin(){
    login.addEventListener("submit", ()=>{
        const login = {
            username: username.value,
            pwd: pwd.value
        }
        fetch("/auth/login",{
            method: "POST",
            body: JSON.stringify(login),
            headers: {
                "Content-type":"application/json"
            }
        }).then(res => res.json())
        .then(data => {
            if(data.status == "error"){
                errorMessage.style.display = "block"
                error.innerText = data.error
            }else{
                document.location.replace("/index")
            }
        })
    })
}

//register
function validateRegister(){
    register.addEventListener("submit", ()=>{
        const register = {
            nameeee: nameeee.value,
            birth: birth.value,
            email: email.value,
            phone: phone.value,
            cmnd: cmnd.value,
            address: address.value
        }
        fetch("/auth/register",{
            method: "POST",
            enctype: "multipart/form-data",
            body: JSON.stringify(register),
            headers: {
                "Content-type":"application/json"
            }
        }).then(res => res.json())
        .then(data => {
            if(data.status == "error"){
                dialogCont.style.display = "none"
                alerterror.style.display = "block"
                error.innerText = data.error
            }else {
                dialogCont.style.display = "block"
                alerterror.style.display = "none"
                success.innerText = data.success    
            }
        })
    })
}

//changepass
function validatechangepassinfo(){
    infochange.addEventListener("submit", ()=>{
        const pass = {
            pwd: pwd.value,
            pwdnew: pwdnew.value,
            pwdconfirm: pwdconfirm.value
    
        }
        fetch("/auth/changepassword",{
            method: "POST",
            body: JSON.stringify(pass),
            headers: {
                "Content-type":"application/json"
            }
        }).then(res => res.json())
        .then(data => {
            if(data.status == "error"){
                dialogCont.style.display = "none"
                errorMessage.style.display = "block"
                error.innerText = data.error
            }else{
                dialogCont.style.display = "block"
                errorMessage.style.display = "none"
                success.innerText = data.success 
            }
        })
    })
}

//changepassfirsttime
function validatefirststep(){
    firststep.addEventListener("submit", ()=>{
        const pass = {
            pwd: pwd.value,
            pwdcf: pwdconfirm.value
        }
        fetch("/auth/firststep",{
            method: "POST",
            body: JSON.stringify(pass),
            headers: {
                "Content-type":"application/json"
            }
        }).then(res => res.json())
        .then(data => {
            if(data.status == "error"){
                dialogCont.style.display = "none"
                errorMessage.style.display = "block"
                error.innerText = data.error
            }else{
                //document.location.replace("/index")
                dialogCont.style.display = "block"
                errorMessage.style.display = "none"
                success.innerText = data.success 
            }
        })
    })
}

//updateinfo
function valideUpdateform(){
    updateinfo.addEventListener("submit", ()=>{
        const update = {
            nameeee: nameeee.value,
            birth: birth.value,
            email: email.value,
            phone: phone.value,
            cmnd: cmnd.value,
            address: address.value
        }
        fetch("/auth/update",{
            method: "POST",
            enctype: "multipart/form-data",
            body: JSON.stringify(update),
            headers: {
                "Content-type":"application/json"
            }
        }).then(res => res.json())
        .then(data => {
            if(data.status == "error"){
                dialogCont.style.display = "none"
                errorMessage.style.display = "block"
                error.innerText = data.error
            }else {
                dialogCont.style.display = "block"
                errorMessage.style.display = "none"
                success.innerText = data.success    
            }
        })
    })
}

//naptien
function naptien(){
    nap.addEventListener("submit", ()=>{
        const naptien = {
            sotk: sotk.value,
            dayex: dayex.value,
            cvv: cvv.value,
            tien: tien.value
        }
        fetch("/auth/nap",{
            method: "POST",
            body: JSON.stringify(naptien),
            headers: {
                "Content-type":"application/json"
            }
        }).then(res => res.json())
        .then(data => {
            if(data.status == "error"){
                dialogCont.style.display = "none"
                errorMessage.style.display = "block"
                error.innerText = data.error
            }else{
                dialogCont.style.display = "block"
                errorMessage.style.display = "none"
                success.innerText = data.success 
            }
        })
    })
}

//ruttien
function ruttien(){
    rut.addEventListener("submit", ()=>{
        const ruttien = {
            sotk: sotk.value,
            dayex: dayex.value,
            cvv: cvv.value,
            tien: tien.value,
            ghichu: ghichu.value
        }
        fetch("/auth/ruttien",{
            method: "POST",
            body: JSON.stringify(ruttien),
            headers: {
                "Content-type":"application/json"
            }
        }).then(res => res.json())
        .then(data => {
            if(data.status == "error"){
                dialogCont.style.display = "none"
                errorMessage.style.display = "block"
                error.innerText = data.error
            }else{
                dialogCont.style.display = "block"
                errorMessage.style.display = "none"
                success.innerText = data.success 
            }
        })
    })
}


document.getElementById('eye').onclick = function(){
    var temp = document.getElementById('pwd')
    if(temp.type === "password"){
        temp.type = "text"
    }else{
        temp.type = "password"
    }
}

document.getElementById('eye1').onclick = function(){
    var temp = document.getElementById('pwdconfirm')
    if(temp.type === "password"){
        temp.type = "text"
    }else{
        temp.type = "password"
    }
}

document.getElementById('eye2').onclick = function(){
    var temp = document.getElementById('pwdnew')
    if(temp.type === "password"){
        temp.type = "text"
    }else{
        temp.type = "password"
    }
}

function plusDivs(n) {
    showDivs(slideIndex += n);
}

function showDivs(n) {
    var i;
    var x = document.getElementsByClassName("mySlides");
    if (n > x.length) { slideIndex = 1 }
    if (n < 1) { slideIndex = x.length }
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    console.log(slideIndex);
    x[slideIndex - 1].style.display = "block";
}

function formatCash(str) {
    return str.split('').reverse().reduce((prev, next, index) => {
        return ((index % 3) ? next : (next + ',')) + prev
    })
}
