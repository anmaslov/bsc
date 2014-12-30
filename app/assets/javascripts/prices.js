function updatePrice(id) {

    $.ajax({
        url: "/prices/update_price.json",
        type: "GET",
        data: {
            id: id
        },
        success: function(data) {
            console.log('Данные изменены ' + data);
            $('#button_update_price_' + data.id).attr({disabled: 'disabled'}).html('Обновлен');
//            if (station_to != '' && station_from != '') {
//                $('#distance_div').show();
//            } else {
//                $('#distance_div').hide();
//            }
//            $('#distance').html(data);
        },
        error: function (data) {
            //$('#distance').html('Расстояние не найдено');
        }
    });
}