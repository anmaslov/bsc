var fileUploadErrors = {
    maxFileSize: 'File is too big',
    minFileSize: 'File is too small',
    acceptFileTypes: 'Filetype not allowed',
    maxNumberOfFiles: 'Max number of files exceeded',
    uploadedBytes: 'Uploaded bytes exceed file size',
    emptyResult: 'Empty file upload result'
};

$(document).ready(function() {
    $('#fileupload').fileupload();

});

function add_fields(link, association, content) {
    var new_id = new Date().getTime();
    var regexp = new RegExp("new_" + association, "g");
    $(link).parent().before(content.replace(regexp, new_id));
}

function rename_title(product_id, new_title) {

    console.log('rename_title');

    $.ajax({
        url: "/products/rename_title.json",
        type: "GET",
        data: {
            product_id: product_id,
            new_title: new_title
        },
        success: function(data) {
            console.log('Данные изменены ' + data);
            //$('#tr_charecter_type_' + old_id).hide('slow').remove();
            message('success', 'Данные изменены');

        },
        error: function (data) {
            //
        }
    });
}