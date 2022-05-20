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