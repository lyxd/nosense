var _ = require('lodash');
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var hash = require('./server/hash');
var request = require('request');

process.env.secretKey = "sa3ifasfadolja345jooc8522345";




var app = express();

mongoose.connect('mongodb://localhost/nosense');

var userSchema = mongoose.Schema({
    name: {type : String , unique : true, required : true},
    hash: {type : String , required : true}
});

var User = mongoose.model('User', userSchema);


//SESSIONS

var onlineUsers = {

};

//Configure express
app.set('view engine', 'ejs');
app.set('views', __dirname + '/server/templates');
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static( __dirname + '/dest'));


//Check auth
app.use(function(req, res, next) {

    if(req.path !== '/login') {

        if(req.method === 'GET') {
            if( req.cookies['token'] === undefined ||
                req.cookies['name'] === undefined ||
                _.isEmpty(onlineUsers)) {
                return res.redirect('/login');
            }
        }

        if(!_.isEmpty(onlineUsers) && req.path !== '/register') {
            if(onlineUsers[req.cookies.name].token !== req.cookies.token) {
                if(req.method === 'GET') {
                    return res.redirect('/login');
                } else {
                    return res.status(500).end();
                }
            }
        }
    }

    next();
});

//--PAGES--

//Index
app.get('/', function(req, res) {
    res.redirect('/nosense');
});

app.get('/nosense', function(req, res) {
    res.render('nosense');
});

app.get('/login', function(req, res) {
    res.render('login');
});

app.get('/rightway', function(req, res) {
    res.render('rightway');
});

app.get('/wrongway', function(req, res) {
    res.render('wrongway');
});

app.get('/ways', function(req, res) {
    res.render('ways');
});

app.get('*', function(req, res, next) {
    res.render('404');
});


//API

app.post('/register', function(req, res, next) {

    var user = new User({
        name: req.body.name,
        hash: hash.createSaltHash(req.body.hash, process.env.secretKey)
    });

    user.save(function(err, user) {
        if(err) {
            res.status(500).send({
                error: err
            });
            return;
        }

        var token = hash.generateKey();

        onlineUsers[req.body.name] = {
            token: token
        };

        res.cookie('name', req.body.name);
        res.cookie('token', token);

        res.send({
            token: token
        });
    });


});

app.post('/login', function(req, res, next) {

    User.find({ name: req.body.name}, function(err, users) {

        if (err || users.length == 0) {
            return res.status(500).send('Username or password invalid!');
        }

        var user = users[0];

        if(hash.checkHash(req.body.hash, user.hash)) {
            var token = hash.generateKey();

            onlineUsers[req.body.name] = {
                token: token
            };

            res.cookie('token', token);
            res.cookie('name', user.name);

            res.send({
                token: token
            });
        } else {
            res.send('Username or password invalid!');
        }
    })
});


app.post('/help', function(req, res, next) {

    User.find({}, function(err, users) {
        var regUsers = [];
        var onlUsers = [];

        _.find(users, function(user) {
            regUsers.push(user.name);
        });

        _.find(onlineUsers, function(user, key) {
            onlUsers.push(key);
        });


        res.send({
            title : 'Помощь',
            about : {
                title: "Немного о смысле этого сайта",
                text: "Если вам скучно сдесь можно найти целых два развлечения!",
                playsTitles: ['Поиграть в рандом', 'Посмотреть Котов'],
                plays: [
                    {
                        title: "Игра в рандом",
                        description: "Вы добавляете иконку, которая откроет вам рандомную статью в Википедии."
                    }, {
                        title: "Просмотр котов",
                        description: "Вы сможете увидеть разных кошек и котов. Картинки берутся из google и показываются случайным образом."
                    }
                ]
            },
            users: {
                online: {
                    names: onlUsers,
                    count: onlUsers.length
                },
                registered: {
                    names: regUsers,
                    count: regUsers.length
                }
            }
        });

    });
});

app.post('/cat', function(req, res, next) {
    request({
        method: "HEAD",
        uri: 'http://thecatapi.com/api/images/get'
    }, function(err, response, body) {
        res.send(response.request.uri.href);
    });
});




//Start server
var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Server started at: ', host, port);
});