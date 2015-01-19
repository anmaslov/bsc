jQuery(function($){
    $("#phone").mask("+7 999 999-99-99");
});

function hidden_registration(object) {
    if ($(object).prop('checked')) {
        $('.registration').removeClass('hidden');
    } else {
        $('.registration').addClass('hidden');
    }
}