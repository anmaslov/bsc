var filtr_on = false;
function showFiltr() {
    if (filtr_on == false) {
        $('.product-list').removeClass('col-md-12').removeClass('col-xs-12').addClass('col-md-8').addClass('col-xs-8');
        $('.filt-product').removeClass('hidden');
        filtr_on = true;
    } else {
        $('.product-list').removeClass('col-md-8').removeClass('col-xs-8').addClass('col-md-12').addClass('col-xs-12');
        $('.filt-product').addClass('hidden');
        filtr_on = false;
    }
}

function formatMoney(number, places, symbol, thousand, decimal) {
    number = number || 0;
    places = !isNaN(places = Math.abs(places)) ? places : 0;
    symbol = symbol !== undefined ? symbol : "";
    thousand = thousand || " ";
    decimal = decimal || ".";
    var negative = number < 0 ? "-" : "",
        i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + "",
        j = (j = i.length) > 3 ? j % 3 : 0;
    return symbol + negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : "");
}

function changeFiltr(product_character_id, character_filtr_id) {
    $('.popover_product_character').addClass('hidden');

    console.log();
    form_data = $('#filtr').serializeArray();
    $.get(
        "/products/countfiltr.js",
        form_data,
        function () {
            $('#popover_product_character_' + product_character_id + '_' + character_filtr_id).removeClass('hidden');
            return false;
        }
    );
}