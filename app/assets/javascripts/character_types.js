function replaceCharacter(old_id, new_id) {
    console.log('replaceCharacter');

    $.ajax({
        url: "/charecter_types/replace_character.json",
        type: "GET",
        data: {
            old_id: old_id,
            new_id: new_id
        },
        success: function(data) {
            console.log('Данные изменены ' + data);
            $('#tr_charecter_type_' + old_id).hide('slow').remove();

        },
        error: function (data) {
            //
        }
    });
}

function changeTypeCharacter(character_id, value) {
    console.log('changeTypeCharacter');

    $.ajax({
        url: "/charecter_types/change_type_character.json",
        type: "GET",
        data: {
            character_id: character_id,
            value: value
        },
        success: function(data) {
            console.log('Данные изменены ' + data);
        },
        error: function (data) {
            //
        }
    });
}
