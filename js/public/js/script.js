//login
function validateInput() {
    let userBox = document.getElementById("username")
    let passwordBox = document.getElementById("pwd")
    let messageBox = document.getElementById("errorMessage")

    let user = userBox.value;
    let password = passwordBox.value;


    if (user === "") {
        messageBox.innerHTML = "Please enter your username";
        emailBox.focus();
        return false;
    } else if (password === "") {
        messageBox.innerHTML = "Please enter your password";
        passwordBox.focus();
        return false;
    } else if (password.length < 6) {
        messageBox.innerHTML = "Your password must contain at least 6 characters";
        passwordBox.focus();
        return false;
    }
    messageBox.innerHTML = "";
    return true;
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

$('#eye').click(function() {
    $(this).toggleClass('open');
    $(this).children('i').toggleClass("fa-eye-slash fa-eye");
    if ($(this).hasClass('open')) {
        $(this).prev().attr("type", "text");
    } else {
        $(this).prev().attr("type", "password");
    }
});

function eye() {
    $('#eye').toggleClass('open');
    $('#eye').children('i').toggleClass("fa-eye-slash fa-eye");
    if ($('#eye').hasClass('open')) {
        $('#eye').prev().attr("type", "text");
    } else {
        $('#eye').prev().attr("type", "password");
    };
}