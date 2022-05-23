document.getElementById('form-login').addEventListener("submit", ()=>{
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
            errorMessage.style.display = "block"
            error.innerText = data.error
        }else{
            //document.location.replace("/index")
            errorMessage.style.display = "block"
            error.innerText = data.success
        }
    })
})