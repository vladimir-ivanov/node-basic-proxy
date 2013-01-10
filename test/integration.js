$(document).ready(function () {


    $.ajax({
        url: 'http://localhost:3000/get?url=http://google.com',
        success: function (data) {
            $('body').append('<h2>Test 1 ajax.get</h2>');
            $('body').append('<h3>Test 1 success</h3>');
            console.log(data);
        },
        error: function (error) {
            $('body').append('<h3>Test 1 failed</h3>' + JSON.stringify(error));
        }
    });


    $.ajax({
        url: 'http://localhost:3000/post?url=http://closure-compiler.appspot.com/compile',
        success: function (data) {
            $('body').append('<h2>Test 2 ajax.post</h2>');
            $('body').append('<h3>Test 2 success</h3>');
            console.log(data);
        },
        error: function (error) {
            $('body').append('<h3>Test 2 failed</h3>' + JSON.stringify(error));
        }
    });
});