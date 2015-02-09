function addToCompare (id) {
    console.log('addToCompare id ' + id);
    message('success', 'Товар добавлен в сравнение');

    $('.add_form_compare_submit_' + id).click();
}

function changeCountCompare(newCount) {
    var newCountObject = $('.count-compare');
    var compareLink = $('.compare-link-menu');
    if (newCount == 0) {
        newCountObject.addClass('disabled');
        compareLink.addClass('disabled');
    } else {
        newCountObject.html(newCount);
        newCountObject.removeClass('disabled');
        compareLink.removeClass('disabled');
    }
}

function destroyItemCompareSmall(product_id) {
    console.log('small ' + product_id);
    $('.link_destroy_compare_' + product_id).click();
}

function destroyItemCompare(product_id) {
    console.log(product_id);
    $('.button_destroy_' + product_id).click();
}

function identical(object_link) {
    object_link = $(object_link);
    text = object_link.html();
    console.log(text)
    if (text == 'Скрыть одинаковые параметры') {
        $('.identical').hide();
        object_link.html('Показать все параметры');
    } else {
        $('.identical').show();
        object_link.html('Скрыть одинаковые параметры');
    }
}

$(document).on('scroll', window, function() {
    var documentScrollTop = $(document).scrollTop();
    var compares = $('#compares');
    if (documentScrollTop > 250) {
        compares.find('.caption').hide();
        compares.find('.product_img').attr({style: 'max-height: 50px; max-width: 50px; position: relative;'});
        compares.find('.compare-item-head').attr({style: 'height: 50px; width: 100%; text-align: center; position: relative'});
        compares.find('.compare-item-head-title').attr({style: 'height: 50px; font-size: 11px;'});
    } else {
        compares.find('.caption').show();
        compares.find('.product_img').attr({style: 'max-height: 100px; max-width: 100px; position: relative;'});
        compares.find('.compare-item-head').attr({style: 'height: 100px; width: 100%; text-align: center; position: relative'});
        compares.find('.compare-item-head-title').attr({style: 'height: 100px;'});
    }
});