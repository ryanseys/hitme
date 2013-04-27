var express = require('express');
var app = express();
var datastore = {};

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  // app.use(express.static(__dirname + '/public'));
});

app.get('/', function(req, res) {
  res.end('Point to /<username>/<repo>.svg for your counter :)')
});

app.get('/:username/:repo.svg', function(req, res) {
  var username  = req.params.username,
      repo      = req.params.repo,
      key       = username + '/' + repo;

  if(req.headers.referer == ('https://github.com/' + username + '/' + repo + '/')) {
    datastore[key] = datastore[key] ? datastore[key] += 1 : 1; //increment value in db
  }
  var count = datastore[key] || 0; //get from database
  res.header('Content-Type', 'image/svg+xml');
  res.render('counter', { value : count });
});

app.listen(4000);
console.log('up!')
