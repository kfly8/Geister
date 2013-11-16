
var app    = require('express')()
  , server = require('http').createServer(app)
  , io     = require('socket.io').listen(server);


// https://devcenter.heroku.com/articles/realtime-polyglot-app-node-ruby-mongodb-socketio#pushing-messages-to-the-browser-with-socket-io
io.configure(function () {
  io.set("transports", ["xhr-polling"]);
  io.set("polling duration", 10);
});

server.listen(5000);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});
