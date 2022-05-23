document.getElementById('form-login').addEventListener("submit", ()=>{
    const pass = {
        pwd: pwd.value,
        pwdcf: pwd-confirm.value
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