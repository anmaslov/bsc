/**
 * Created by Pavel Osetrov on 04.05.14.
 */

$(document).on('scroll', window, function() {
    var documentScrollTop = $(document).scrollTop();

    var navbarInverse = $('.navbar-inverse');
    var header = $('.header');


    var feedback = $('.popover.float');
    var feedbackLeft = 0;
    if (typeof (feedback.offset()) != 'undefined' ) {
        feedbackLeft = feedback.offset().left;
    }


    if (documentScrollTop > 60) {
        navbarInverse.addClass('navbar-fixed-top');
        navbarInverse.css('background-position', '0 0');
        $('.navbar-header').addClass('hidden');
        header.css({'height': '34px'});
        $('.container.content').css({'padding-top': '114px'});
        $('.navbar-nav').css({'padding': '0 15px'});
        feedback.attr({'style': 'top: 32px; left: ' + feedbackLeft + 'px; display: block;'});
    } else {
        navbarInverse.removeClass('navbar-fixed-top');
        navbarInverse.css('background-position', '0 60px');
        $('.navbar-header').removeClass('hidden');
        header.css({'height': '96px'});
        $('.container.content').css({'padding-top': '0'});
        $('.navbar-nav').css({'padding': '0'});

        var feedbackTop = $('#feedback').offset().top - documentScrollTop + 30;

        feedback.attr({'style': 'top: ' + feedbackTop + 'px; left: ' + feedbackLeft + 'px; display: block;'});
    }
});