
document.getElementById('close').onclick = function(){
    dialogCont.style.display = "none"
    window.location.reload()
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
