const APP_SECRET = 'c4d50c3f61b5f1bea14d51dc8cfbdb01';
const VALIDATION_TOKEN = '123456';
const PAGE_ACCESS_TOKEN = 'EAAGHR0oFup4BAIFY8XUXPB0B4rkX9D4emPXsVSKdqaAqtvdj83ZCZCK8GtsRe5Gx4VCApL8COPBABikP6uZBjGOrQUp3FWHHouEYt6ZB2Eka50ioHrrpLfZAhDg6iWUv8x0ZAk4ZAFGnIEXaviDZC56s6DT5SsIq2QWv8kPQGWdVTmiOCPRjQvtoZBvBjZAxAEjAgZD';

var http = require('http');
var bodyParser = require('body-parser');
var express = require('express');

var app = express();
app.use(bodyParser.urlencoded({
  extended: false
}));
var server = http.createServer(app);
var request = require("request");

app.get('/', (req, res) => {
  res.send("Home page. Server running okay.");
});

app.get('/webhook', function(req, res) { 
  if (req.query['hub.verify_token'] === VALIDATION_TOKEN) {
    res.send(req.query['hub.challenge']);
  }
  res.send('Error, wrong validation token');
});

app.post('/webhook', function(req, res) { 
  var entries = req.body.entry;
  for (var entry of entries) {
    var messaging = entry.messaging;
    for (var message of messaging) {
      var senderId = message.sender.id;
      if (message.message) {
        if (message.message.text) {
          var text = message.message.text;
          sendMessage(senderId, "Hello!! I'm a bot. Your message: " + text);
        }
      }
    }
  }
  res.status(200).send("OK");
});

function sendMessage(senderId, message) {
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {
      access_token: PAGE_ACCESS_TOKEN,
    },
    method: 'POST',
    json: {
      recipient: {
        id: senderId
      },
      message: {
        text: message
      },
    }
  });
}

app.set('port', process.env.PORT || 5000);
app.set('ip', process.env.IP || "0.0.0.0");

server.listen(app.get('port'), app.get('ip'), function() {
  console.log("Chat bot server listening at %s:%d ", app.get('ip'), app.get('port'));
});
