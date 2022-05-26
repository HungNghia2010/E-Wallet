//login
var login = document.getElementById('form-login')
//register
var register = document.getElementById("form")

var infochange = document.getElementById('form-changepass')

if(login){
    validateLogin()
}else if(register){
    validateRegister()
}else if(infochange){
    validatechangepassinfo()
}

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

function validatechangepassinfo(){
    infochange.addEventListener("submit", ()=>{
        const pass = {
            pwd: pwd.value,
            pwdnew: pwdnew.value,
            pwdcf: pwdcf.value
    
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


document.getElementById('eye').onclick = function(){
    var temp = document.getElementById('pwd')
    if(temp.type === "password"){
        temp.type = "text"
    }else{
        temp.type = "password"
    }
}

document.getElementById('close').onclick = function(){
    dialogCont.style.display = "none"
    window.location.reload()
}

let navbar = document.querySelector('.navbar');

document.querySelector('#menu-btn').onclick = () => {
    navbar.classList.toggle('active');
}


window.onscroll = () => {
    navbar.classList.remove('active');
}

var slideIndex = 1;
showDivs(slideIndex);

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
    x[slideIndex - 1].style.display = "block";
}





