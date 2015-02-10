/**
 * Created by apple on 09.05.14.
 */

function addToBascet (id) {
    console.log('addtoBascet ' + id);
    message('success', 'Товар добавлен в корзину');
    $('#addToBascet .close').click();

    article = article.replace('арт. ', '');
    console.log(article);
    var quantity = $('.model-product-quantity').val();
    $('.quantity_product_id_' + product_id).val(quantity);
    $('.form_product_id_' + product_id).submit();
}

$('#orders a').click(function (e) {
    e.preventDefault()
    $(this).tab('show')
});

var article = '';
var product_id = 0;
function showAddToBascet(product) {
    console.log(product);
    clearFormAddToBascet();
    var productObj = $('.product_id_' + product);
    var img_src =        productObj.find('.product_img').attr('src');
    var img_alt =        productObj.find('.product_img').attr('alt');
    var title =          productObj.find('.product_title').html();
    var product_href =   productObj.find('.product_title').attr('href');
    var quantity_prod =  productObj.find('.quantity_product').html();
    article =            productObj.find('.product_article').html();
    product_id =         product;
    var price =          productObj.find('.price').html();
    console.log(img_src);
    $('.modal-product-image').attr({src: img_src, alt: img_alt});
    $('.modal-product-title').html(title).attr({href: product_href});
    $('.modal-product-article').html(article);
    $('.model-product-price').html(price);
    console.log(quantity_prod);
    if (quantity_prod > 0) {
        $('.model-product-quantity-out-of-stock').html('');
    } else {
        $('.model-product-quantity-out-of-stock').html('<b>К сожалению нет в наличии, добавьте в корзину, и мы сообщим вам когда появится или предложим альтернативы</b>');
    }

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
        cartLink.addClass('disabled');
    } else {
        newCountObject.html(newCount);
        newCountObject.removeClass('hidden');
        cartLink.removeClass('disabled');
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