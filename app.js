var express = require('express'),
    app = express(),
    datastore = {},
    ips = {},
    redis = require("redis"),
    client = redis.createClient(19029, "redis-19029.us-east-1-1.1.ec2.garantiadata.com").auth("xX2mayBhlpowekNh", function() {}),
    DEBUG = false;


app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
});

app.get('/', function(req, res) {
  res.end('Point to /<username>/<repo>.svg for your counter :)')
});

function getIP(req) {
  var ip = req.headers['x-forwarded-for'];
  if(!ip) {
    ip = req.connection.remoteAddress;
  }
  return ip;
};

function renderViewCount(res, key) {
  client.get(key, function(err, reply) {
    if(!err && reply != null) {
      res.render('counter', { value : reply });
    }
    else {
      res.render('counter', { value : 0 }); //error occurred
    }
  });
};

app.get('/:username/:repo.svg', function(req, res) {
  var username  = req.params.username,
      repo      = req.params.repo,
      key       = username + '/' + repo,
      ip        = getIP(req);

  res.header('Content-Type', 'image/svg+xml');
  res.header('Cache-Control','public, max-age=31557600'); // make sure this is 1 day
  if(req.headers.referer == 'https://github.com/' + username + '/' + repo + '/') {
    client.hexists(key+'ips', ip, function(err, reply) {
      if(reply == 0) {
        client.hset(key+'ips', ip, 1, function(err, reply) {
          client.incr(key, renderViewCount(res, key));
        });
      }
      else {
        renderViewCount(res, key);
      }
    });
  }
  else {
    renderViewCount(res, key);
  }
});

// 404 all other requests
app.get('*', function(req, res) {
  res.send(404);
});

app.listen(4000);
console.log('hitme up on port 4000!');
