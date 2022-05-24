document.getElementById('form-login').addEventListener("submit", ()=>{
    const checkmail = {
        email: email.value
    }
    fetch("/auth/forgot",{
        method: "POST",
        body: JSON.stringify(checkmail),
        headers: {
            "Content-type":"application/json"
        }
    }).then(res => res.json())
    .then(data => {
        if(data.status == "error"){
            errorMessage.style.display = "block"
            error.innerText = data.error
        }else {
  
        }
    })
})

