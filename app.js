
var express = require('express')
  , app     = express()
  , path    = require('path')
  , server  = require('http').createServer(app)
  , io      = require('socket.io').listen(server)
  , redis   = require('redis-url').connect(process.env.REDISTOGO_URL || '');

/******************************
 * config
 ******************************/

app.configure('development', function () {
    app.use(express.logger('dev'));
    app.use(express.errorHandler());
});

app.configure(function () {
    app.set('port', process.env.PORT || 5000);
    app.set('view engine', 'ejs');
    app.use(express.favicon());
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use('/favicon.ico', express.static(path.join(__dirname, 'public')));
    app.use('/css', express.static(path.join(__dirname, 'public/css')));
    app.use('/img', express.static(path.join(__dirname, 'public/img')));
    app.use('/js', express.static(path.join(__dirname, 'public/js')));
});
 
/******************************
 * socket.io
 ******************************/

// https://devcenter.heroku.com/articles/realtime-polyglot-app-node-ruby-mongodb-socketio#pushing-messages-to-the-browser-with-socket-io
io.configure(function () {
  io.set("transports", ["xhr-polling"]);
  io.set("polling duration", 10);
});

io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('signin', function (data) {
    console.log(data);
    var username = data.username;
    redis.set(username, 1);
  });

  socket.on('login', function (data) {
    console.log(data);
    var username = data.username;
    redis.set(username, 1);
  });
});


/***************************
 * router
 ***************************/
app.get('/', function (req, res) {

  res.render('index.ejs', {
      hello: 'world',
      user: ''

  });
});


server.listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});

