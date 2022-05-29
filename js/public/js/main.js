
//login
var login = document.getElementById('form-login')
//register
var register = document.getElementById("form")

var infochange = document.getElementById('form-changepass')

var firststep = document.getElementById("form-first-changePass")

var updateinfo = document.getElementById("form-update-info")

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
    }
}else if (navbar){
    document.querySelector('#menu-btn').onclick = () => {
        navbar.classList.toggle('active');
    }
    
    window.onscroll = () => {
        navbar.classList.remove('active');
    }
} else {
    // Slide show
    var slideIndex = 1;
    showDivs(slideIndex);
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

$("input[data-type='currency']").on({
    keyup: function() {
      formatCurrency($(this));
    },
    blur: function() { 
      formatCurrency($(this), "blur");
    }
});

function formatNumber(n) {
    // format number 1000000 to 1,234,567
    return n.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }
  
  
  function formatCurrency(input, blur) {
    // appends $ to value, validates decimal side
    // and puts cursor back in right position.
    
    // get input value
    var input_val = input.val();
    
    // don't validate empty input
    if (input_val === "") { return; }
    
    // original length
    var original_len = input_val.length;
  
    // initial caret position 
    var caret_pos = input.prop("selectionStart");
      
    // check for decimal
    if (input_val.indexOf(".") >= 0) {
  
      // get position of first decimal
      // this prevents multiple decimals from
      // being entered
      var decimal_pos = input_val.indexOf(".");
  
      // split number by decimal point
      var left_side = input_val.substring(0, decimal_pos);
      var right_side = input_val.substring(decimal_pos);
  
      // add commas to left side of number
      left_side = formatNumber(left_side);
  
      // validate right side
      right_side = formatNumber(right_side);
      
      // On blur make sure 2 numbers after decimal
      if (blur === "blur") {
        right_side += "00";
      }
      
      // Limit decimal to only 2 digits
      right_side = right_side.substring(0, 2);
  
      // join number by .
      input_val = "$" + left_side + "." + right_side;
  
    } else {
      // no decimal entered
      // add commas to number
      // remove all non-digits
      input_val = formatNumber(input_val);
      input_val = "$" + input_val;
      
      // final formatting
      if (blur === "blur") {
        input_val += ".00";
      }
    }
    
    // send updated string to input
    input.val(input_val);
  
    // put caret back in the right position
    var updated_len = input_val.length;
    caret_pos = updated_len - original_len + caret_pos;
    input[0].setSelectionRange(caret_pos, caret_pos);
  }