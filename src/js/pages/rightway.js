var $ = require('jquery');

function getCatImageLink(sucess) {
    $.ajax('cat', {
        method: 'post'
    }).success(sucess);
}

function setRangomCat(data) {
    console.log(data);
    $(".cats img").attr('src', data);
}


function init(params) {
    $('.random-cat').on('click', function() {
        getCatImageLink(setRangomCat);
    })
}

module.exports = init;