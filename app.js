
/**
 * Module dependencies.
 */

var express = require('express'),
    connectionEnv = require('./dbConfig'),
    MongoStore = require('connect-mongo')(express),
    routes = require('./routes'),
    hbs = require('express-hbs'),
    chores = require('./routes/chores'),
    register = require('./routes/register'),
    completed = require('./routes/completed'),
    failed = require('./routes/failed'),
    users = require('./routes/users'),
    badges = require('./routes/badges'),
    activity = require('./routes/activity'),
    login = require('./routes/login'),
    http = require('http'),
    db = require('./models/model'),
    util = require('util'),
    expressValidator = require('express-validator'),
    path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.use(express.compress());
  app.engine('hbs', hbs.express3({partialsDir: __dirname + '/views'}));
  app.set('view engine', 'hbs');
  app.set('views', __dirname + '/views');
  app.use(expressValidator);
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));

  app.use(express.session({
    secret: '_:2a.c/BpD?!=C7AQzZzC+Mx1Rj)l%4$SG<)I<ven~aqX`>#S>Zs]o0qj|6mj7-|',
    expires: new Date(Date.now() + 5 * 86400 * 1000), // 5 days

    store: new MongoStore({
      url: connectionEnv.dbConnection
    })
  }));

  app.use(function(req, res, next) {
    // Notification for activity log
    app.locals.notification = req.session.notification;
    next();
  });

  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));

  // 404
  app.use(function(req, res) {
    var username;

    if (req.session.user) {
      username = req.session.user.username;
    }

    res.status = 404;
    res.render('404', {
      title: '404',
      user: username
    });
  });

  // Error handeler
  app.use(function(err, req, res, next) {
    var username;

    if (req.session.user) {
      username = req.session.user.username;
    }

    console.log(err);
    res.status = 500;

    res.render('500', {
      title: '500',
      user: username
    });
  });
});

app.configure('development', function(){
  app.use(express.errorHandler());
});


// Kolla om användare finns i session
app.param('user', function(req, res, next, id) {
  var session = req.session.user;

  if (session) {
    if (session.username === id) {
       req.user = session;
       res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
       next();
    }

    else {
      res.redirect('/login');
    }
  }

  else {
    res.redirect('/login');
  }

});

// Index
app.get('/', routes.index);

// Chores
app.get('/:user/chores', chores.all);
app.get('/:user/chores/new', chores.new);
app.post('/:user/chores/new', chores.add);
app.get('/:user/chores/edit/:id', chores.edit)
app.put('/:user/chores/:id', chores.update);
app.delete('/:user/chores/:id', chores.remove);

// Completed
app.get('/:user/chores/completed', completed.showCompleted);
app.post('/:user/chores/completed/:id', completed.completed);

// Failed
app.get('/:user/chores/failed', failed.showFailed);

// Register
app.get('/register', register.register);
app.post('/register', register.add);

// Login
app.get('/login', login.show);
app.post('/login', login.login);
app.post('/forgot', login.forgot);
app.get('/forgot', login.showForgot);
app.get('/reset/:userId/:token', login.showReset);
app.post('/reset/:userId/:token', login.reset);
app.get('/logout', login.logout);

//User
app.get('/account/:user', users.details);
app.get('/account/:user/edit', users.edit);
app.get('/account/:user/badges', badges.showBadges);
app.get('/account/:user/activity', activity.showActivity);
app.put('/account/:user/edit', users.save);
app.delete('/account/:user', users.remove);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
