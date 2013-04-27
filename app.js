var express = require('express'),
    app = express(),
    datastore = {},
    ips = {};

app.configure(function(){
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

app.get('/:username/:repo.svg', function(req, res) {
  var username  = req.params.username,
      repo      = req.params.repo,
      key       = username + '/' + repo,
      ip        = getIP(req);

  if((req.headers.referer == 'https://github.com/' + username + '/' + repo + '/') && (!ips[ip])) {
    datastore[key] = datastore[key] ? datastore[key] += 1 : 1; //increment value in db
    ips[ip] = true; // store ip in db
  }

  var count = datastore[key] || 0; //get count from database
  res.header('Content-Type', 'image/svg+xml');
  res.header('Cache-Control','public, max-age=31557600'); // make sure this is 1 day
  res.render('counter', { value : count });
});

app.listen(4000);
console.log('hitme up on port 4000!')
