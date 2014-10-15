/**
 * Created by apple on 09.05.14.
 */

function addToBascet (id) {
    message('success', 'Товар добавлен в корзину');
    $('#addToBascet .close').click();

    article = article.replace('арт. ', '');

    var quantity = $('.model-product-quantity').val();
    $('.quantity_' + article).val(quantity);
    $('.form_' + article).submit();
}

$('#orders a').click(function (e) {
    e.preventDefault()
    $(this).tab('show')
});

var article = '';
function showAddToBascet(product) {

    clearFormAddToBascet();
    var productObj = $('#product_' + product);
    var img_src =        productObj.find('.product_img').attr('src');
    var img_alt =        productObj.find('.product_img').attr('alt');
    var title =          productObj.find('.product_title').html();
    var product_href =   productObj.find('.product_title').attr('href');
    article =            productObj.find('.product_article').html();
    var price =          productObj.find('.price').html();

    $('.modal-product-image').attr({src: img_src, alt: img_alt});
    $('.modal-product-title').html(title).attr({href: product_href});
    $('.modal-product-article').html(article);
    $('.model-product-price').html(price);
}

function clearFormAddToBascet() {
    $('.modal-product-image').attr({src: '', alt: ''});
    $('.modal-product-title').html('').attr({href: ''});
    $('.modal-product-article').html('');
    $('.model-product-quantity').val('1');
}

function changeCountCart(newCount) {
    var newCountObject = $('.count-cart');
    var cartLink = $('.cart-link-menu');
    if (newCount == 0) {
        newCountObject.addClass('hidden');
        cartLink.addClass('hidden');
    } else {
        newCountObject.html(newCount);
        newCountObject.removeClass('hidden');
        cartLink.removeClass('hidden');
    }
}

function changeCountItemCart(objCount) {
    objCount = $(objCount);
    var quantity = objCount.val();
    var article = objCount.attr('article');

    $('.quantity_' + article).val(quantity);
    $('.form_edit_' + article).submit();
}

function destroyItemCart(objCount) {
    objCount = $(objCount);
    var article = objCount.attr('article');
    $('.button_destroy_' + article).click();
}