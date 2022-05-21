exports.logout = (req, res) => {
    res.clearCookie("userRegistered")
    res.redirect("/login")
}