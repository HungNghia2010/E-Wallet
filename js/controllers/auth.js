

exports.register = (req, res) => {
    console.log(req.body)

    //const { name, birth, email, phone, cmnd, address} = req.body

    // db.query('SELECT email FROM register WHERE email = ?', [email], (error, result) => {
    //     if(error){
    //         console.log(error)
    //     }
    //     if(result.length > 0){
    //         return res.render('register', {
    //             message: 'Email này đã tồn tại'
    //         })
    //     }
    // })


    res.send("Form submitted")
}