document.getElementById('form-about-me').addEventListener("submit", ()=>{
    const pass = {
        pwd: pwd.value,
        pwdnew: pwdnew.value,
        pwdcf: pwdcf.value

    }
    fetch("/auth/info/changepassword",{
        method: "POST",
        body: JSON.stringify(pass),
        headers: {
            "Content-type":"application/json"
        }
    }).then(res => res.json())
    .then(data => {
        if(data.status == "error"){
            // dialogCont.style.display = "none"
            errorMessage.style.display = "block"
            error.innerText = data.error
        }else{
            // dialogCont.style.display = "block"
            // errorMessage.style.display = "none"
            // success.innerText = data.success 
        }
    })
})