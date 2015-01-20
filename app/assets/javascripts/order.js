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

function set_delivery_type(object) {
    console.log($(object).val());
    if ($('.link_destroy_29734').length) {
        $('.link_destroy_29734').click();
    }
    if ($('.link_destroy_29735').length) {
        $('.link_destroy_29735').click();
    }
    setTimeout(function() {
        if ($(object).val() == 'В Ленинградскую область [1500 рублей]') {
            $('.quantity_product_id_29735').val('1');
            $('.form_product_id_29735').submit();
        }
        if ($(object).val() == 'В пределах КАД [400 рублей]') {
            $('.quantity_product_id_29734').val('1');
            $('.form_product_id_29734').submit();
        }
    }, 500);

}