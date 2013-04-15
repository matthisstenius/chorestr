
/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    hbs = require('express-hbs'),
    chores = require('./routes/chores'),
    http = require('http'),
    path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.engine('hbs', hbs.express3({partialsDir: __dirname + '/views'}));
  app.set('view engine', 'hbs');
  app.set('views', __dirname + '/views');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});


// Index
app.get('/', routes.index);

// Chores
app.get('/:user/chores', chores.all);
app.post('/:user/chores/:id', chores.add);
app.put('/:user/chores/:id', chores.edit);
app.delete('/:user/chores/:id', chores.remove);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
