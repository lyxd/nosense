var $ = require('jquery');


function redirectTo(to, sec) {
    setTimeout(function() {
        window.location.href = "http://" + window.location.host + to;
    }, sec)
}

function sendData(to, data, success, fail) {
    $.ajax(to, {
        method: 'post',
        data: data,
        contentType: 'application/json',
        dataType: "json"
    }).done(success).fail(fail)
}


function init(params) {
    var loginForm = $('.login-form');
    var registerForm = $('.register-form');


    loginForm.find('.login-form-submit').on('click', function(event) {
        event.preventDefault();

        var data = JSON.stringify({
            name: loginForm.find('.login-form-name').val(),
            hash: loginForm.find('.login-form-password').val()
        });

        sendData('login', data, function(data) {
            redirectTo('/nosense', 0);
        }, function(err) {
            console.log(err);
        })

    });

    registerForm.children('.register-form-submit').on('click', function(event) {
        event.preventDefault();

        var data = JSON.stringify({
            name: registerForm.find('.register-form-name').val(),
            hash: registerForm.find('.register-form-password').val()
        });

        sendData('register', data, function(data) {
            redirectTo('/nosense', 0);
        }, function(err) {
            console.log(err);
        })

    });
    //
}

module.exports = init;