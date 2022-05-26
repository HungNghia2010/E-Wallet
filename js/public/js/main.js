//login
// document.getElementById('form-login').addEventListener("submit", ()=>{
//     const login = {
//         username: username.value,
//         pwd: pwd.value
//     }
//     fetch("/auth/login",{
//         method: "POST",
//         body: JSON.stringify(login),
//         headers: {
//             "Content-type":"application/json"
//         }
//     }).then(res => res.json())
//     .then(data => {
//         if(data.status == "error"){
//             errorMessage.style.display = "block"
//             error.innerText = data.error
//         }else{
//             document.location.replace("/index")
//         }
//     })
// })

//register
form.addEventListener("submit", ()=>{
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



