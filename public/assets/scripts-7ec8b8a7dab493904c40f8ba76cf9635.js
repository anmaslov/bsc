/**
 * Created by apple on 07.05.14.
 */




$(document).ready(function(){
    //var feedbackObject = $('#feedback');
    //var login_link = $('#login_link');

    //feedbackObject.popover();
    //login_link.popover();

    floatingPopover('feedback');
    floatingPopover('login_link');

    $('.product2-view-toggle label').on('click', function() {
        var obj = $(this).children('span');
        if ( obj.hasClass('glyphicon-th-list')) {
            $('.thumbnail.product').addClass('hidden');
            $('.tr.product').removeClass('hidden');
        }
        if ( obj.hasClass('glyphicon-th-large')) {
            $('.thumbnail.product').removeClass('hidden');
            $('.tr.product').addClass('hidden');
        }
    });

    $('.catalog-view-toggle label').click(function() {
        var obj = $(this).children('span');
        if ( obj.hasClass('glyphicon-th-list')) {
            $('.thumbnail.catalog').addClass('hidden');
            $('.tr.catalog').removeClass('hidden');
        }
        if ( obj.hasClass('glyphicon-th-large')) {
            $('.thumbnail.catalog').removeClass('hidden');
            $('.tr.catalog').addClass('hidden');
        }
    });

    $('.mini-slider').each(function(){
        $(this).carousel({
            interval: false
        });
    });


});

function floatingPopover(what) {

    popoverObject = $('#' + what);
    //popoverObject.popover();

    popoverObject.on('shown.bs.popover', function () {
        var popoverObj = $('.popover');
        popoverObj.removeClass('feedback').removeClass('login_link');
        popoverObj.addClass(what);
        popoverObj.addClass('float');
        var pop = $('.popover.' + what);
        var documentScrollTop = $(document).scrollTop();
        var popTop = popoverObject.offset().top - documentScrollTop + 32;
        var popLeft = 0;
        if (typeof ($(this).offset()) != 'undefined' ) {
            popLeft = $(this).offset().left;
        }

        if (what == 'login_link') {
            popLeft -= pop.width()/5;
        }

        pop.attr({'style': 'top: ' + popTop + 'px; left: ' + popLeft + 'px; display: block;'});
    })
}

function message(type, conent) {
    $('.alert.alert-' + type + ' .alert-content').html(conent);

    $('.alert.alert-' + type).removeClass('hidden');

    setTimeout(function() {
        $('.alert.alert-' + type).addClass('hidden');
    }, 2000);
}
;
