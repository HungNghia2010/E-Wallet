document.getElementById('form-changepass').addEventListener("submit", ()=>{
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

// document.getElementById('close').onclick = function(){
//     dialogCont.style.display = "none"
//     window.location.reload()
// }

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
