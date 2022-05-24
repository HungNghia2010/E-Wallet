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
