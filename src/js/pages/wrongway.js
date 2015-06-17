var $ = require('jquery');

function addElement(wikiUrl) {
    var field = document.querySelector('.random-field');
    var position = getRandomWith(0, field.children.length - 1);

    var container = document.createElement('div');
    container.className = "random-item";
    container.innerHTML = '<div class="random-body"><a target="_blank"></a></div>';

    var itemBody = $(container).find('.random-body');

    $(itemBody).find('a').attr('href', wikiUrl);

    var randomColor = getRandomColor();
    var randomSize = getRandomWith(60, 130);
    var randomTop = getRandomWith(-15, 20);
    var randomLeft = getRandomWith(10, 40);


    itemBody.css({
        background: randomColor,
        width: randomSize,
        height: randomSize,
        top: randomTop,
        left: randomLeft
    });

    setTimeout(function() {
        itemBody.addClass('loaded');
    }, 0);

    field.insertBefore(container, field.children[position]);

}

function getRandomWith(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function getWikipediaRandomLink(success) {
    $.getJSON("http://ru.wikipedia.org/w/api.php?action=query&generator=random&grnnamespace=0&prop=extracts&explaintext&exintro=&format=json&callback=?", function (data) {
        $.each(data.query.pages, function(k, v) {
            $.getJSON('http://ru.wikipedia.org/w/api.php?action=query&prop=info&pageids='+v.pageid+'&inprop=url&format=json&callback=?', function(url) {
                $.each(url.query.pages, function(key, page) {
                    var url = page.fullurl;
                    success(url);
                });
            });
        });
    });
}


function init(params) {

    $('.add-item').on('click', function(event) {
       getWikipediaRandomLink(addElement);
    });
}

module.exports = init;