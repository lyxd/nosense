var $ = require('jquery');
var login = require('./pages/login');
var nosense = require('./pages/nosense');
var page404 = require('./pages/page404');
var rightway = require('./pages/rightway');
var wrongway = require('./pages/wrongway');
var ways = require('./pages/ways');



var path = window.location.pathname.replace('/', '');

//Simple router
switch(path) {
    case "":
        nosense();
        break;
    case "404":
        page404();
        break;
    case "login":
        login();
        break;
    case "nosense":
        nosense();
        break;
    case "rightway":
        rightway();
        break;
    case "wrongway":
        wrongway();
        break;
    case "ways":
        ways();
        break;
    default :
        page404();
}

//Menu

$('.menu').on('click', function(event) {
   $(this).toggleClass('open');
});

//Strange exit

$('.strange-exit-secret').on('click', function(event) {
   window.location.href = "http://" + window.location.host + $(this).attr('data-link');
});

//Open Help

$('.open-help').on('click', function(event) {
    event.preventDefault();
    $('.help').toggleClass('open');
    getHelpData();
});

$(document).keydown(function(event) {
    if(event.keyCode === 32) {
        $('.help').toggleClass('open');
        getHelpData();
    }
});

$('form input').not('form input[type="submit"]').focusin(function() {
    $(this).closest('.input-tooltip').addClass('show-tip');
});

$('form input').not('form input[type="submit"]').focusout(function() {
    $(this).closest('.input-tooltip').removeClass('show-tip');
});

//GET HELP

function getHelpData() {

    var success = function(data) {
        var html = '<h1>' + data.title + '</h1>'
            + '<div class="help-columns">'
            + '<div class="left-col">'
            + '<h2>' + data.about.title + '</h2>'
            + ' <p>' + data.about.text + '</p>'
            + ' <ul>';

        data.about.playsTitles.forEach(function(elem) {
           html +=  '<li>' + elem + '</li>';
        });

        html += ' </ul>';

        data.about.plays.forEach(function(elem) {
            html += '<h3>'+ elem.title +'</h3> <p>'+ elem.description +'</p>';
        });

        html +='</div>'
            + '<div class="right-col">'
            + '<table class="users">'
            + '<thead>'
            + '<tr>'
            + '<th>Online users</th>'
            + '<th>Registered users</th>'
            + '</tr>'
            + '</thead>'
            + '<tbody>';

        var onlineUsers =  data.users.online.names;

        data.users.registered.names.forEach(function(name, index) {


            html +='<tr>';

            if(onlineUsers[index] !== undefined) {
                html += '<td>' + onlineUsers[index] + '</td>';
            } else {
                html += '<td></td>';
            }

            html += '<td>'+ name +'</td>'
                + '</tr>';
        });

        html += '</tbody>'
            + '<tfoot>'
            + '<tr>'
            + '<td>Count: <span class="online-users-count">' + data.users.online.count + '</span></td>'
            + '<td>Count: <span class="reg-users-count">' + data.users.registered.count + '</span></td>'
            + '</tr>'
            + '</tfoot>'
            + '</table>'
            + '</div>'
            + '</div>';

        document.getElementsByClassName('help-content')[0].innerHTML = html;

        console.log(data);
    };

    var fail = function(err) {
      console.log(err);
    };

    $.ajax('help', {
        method: 'post',
        data: {},
        contentType: 'application/json',
        dataType: "json"
    }).done(success).fail(fail)
}