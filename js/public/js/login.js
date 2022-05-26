//login
document.getElementById('form-login').addEventListener("submit", ()=>{
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

document.getElementById('eye').onclick = function(){
    var temp = document.getElementById('pwd')
    if(temp.type === "password"){
        temp.type = "text"
    }else{
        temp.type = "password"
    }
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