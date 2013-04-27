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
  var key = req.params.username+"/"+req.params.repo;
  datastore[key] = datastore[key] ? datastore[key] += 1 : 1;
  res.header('Content-Type', 'image/svg+xml');
  res.render('counter', { value : datastore[key] });
});

app.listen(4000);
console.log('up!')
