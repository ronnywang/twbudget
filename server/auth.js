(function(){
  var Strategy, LocalStrategy, findOrCreateUser, slice$ = [].slice;
  import$(global, require('../lib/user'));
  Strategy = {};
  LocalStrategy = require('passport-local').Strategy;
  Strategy.GitHub = require('passport-github').Strategy;
  Strategy.Twitter = require('passport-twitter').Strategy;
  Strategy.Facebook = require('passport-facebook').Strategy;
  findOrCreateUser = function(profile, provider, done){
    return User.findOne({
      'accounts.id': profile.id,
      'accounts.provider': provider
    }, function(err, user){
      var ref$, ref1$;
      if (user != null && user.id) {
        return done(null, user);
      }
      console.log(profile);
      user = new User({
        accounts: [{
          provider: provider,
          id: profile.id
        }],
        email: (ref$ = profile.emails) != null ? (ref1$ = ref$[0]) != null ? ref1$.value : void 8 : void 8,
        name: profile.displayName
      });
      return user.save(function(err){
        if (err) {
          return done(err, null);
        }
        console.log('newuser', user);
        return done(null, user);
      });
    });
  };
  this.include = function(){
    var passport, mount_auth, _provider, ref$, strategy_class, this$ = this;
    passport = this.passport;
    passport.serializeUser(function(user, done){
      return done(null, user.id);
    });
    passport.deserializeUser(function(id, done){
      return User.findById(id, null, null, function(err, user){
        if (err) {
          console.log(err);
          return done(null, null);
        }
        return done(null, user);
      });
    });
    mount_auth = function(provider, args){
      var ref$;
      args == null && (args = {});
      this$.app.get("/auth/" + provider, passport.authenticate(provider, args), function(){});
      return this$.get((ref$ = {}, ref$["/auth/" + provider + "/callback"] = function(){
        var auth, this$ = this;
        auth = passport.authenticate(provider, function(err, user, info){
          var done;
          done = function(err, user, info){
            var result;
            result = user
              ? {
                auth: 1,
                user: user
              }
              : {
                authFailed: 1,
                challenges: info
              };
            return this$.render({
              'authdone.jade': {
                profile: JSON.stringify(result),
                layout: false
              }
            });
          };
          if (user) {
            this$.request.logIn(user, function(err){
              if (err) {
                return done(err);
              }
              return done(null, user);
            });
          }
          return done(err, user, info);
        });
        return auth(this.request, this.response, function(){});
      }, ref$));
    };
    for (_provider in ref$ = Strategy) {
      strategy_class = ref$[_provider];
      (fn$.call(this, strategy_class, _provider.toLowerCase(), _provider));
    }
    this.view({
      'authdone.jade': '!!! 5\nhtml\n    head\n        title done\n        //script(src=\'/js/vendor.js\')\n        script(type=\'text/javascript\')\n            window.opener.postMessage(!{profile}, window.location);\n            window.close();\n    body'
    });
    passport.use(new LocalStrategy({
      usernameField: 'email'
    }, function(){
      var args;
      args = slice$.call(arguments);
      return User.authenticate.apply(User, args);
    }));
    this.post({
      '/auth/login': function(){
        var auth, this$ = this;
        auth = passport.authenticate('local', function(err, user, info){
          if (err) {
            return next(err);
          }
          if (!user) {
            return this$.response.send(info, 403);
          }
          return this$.request.logIn(user, function(err){
            if (err) {
              return next(err);
            }
            return this$.response.send(user);
          });
        });
        return auth(this.request, this.response, function(){});
      }
    });
    return this.app.get('/auth/logout', function(req, res){
      req.logout();
      return res.send('ok');
    });
    function fn$(strategy_class, provider, _provider){
      var config, strategy, params;
      config = this.config.authproviders[provider];
      if (!config) {
        return;
      }
      strategy = (params = import$({
        callbackURL: this.config.base_uri + ("auth/" + provider + "/callback")
      }, config.client_id
        ? {
          clientID: config.client_id,
          clientSecret: config.secret
        }
        : {
          consumerKey: config.consumer_key,
          consumerSecret: config.consumer_secret
        }), new strategy_class(params, function(accessToken, refreshToken, profile, done){
        return process.nextTick(function(){
          return findOrCreateUser(profile, provider, done);
        });
      }));
      passport.use(strategy);
      mount_auth(provider, config.options);
    }
  };
  function import$(obj, src){
    var own = {}.hasOwnProperty;
    for (var key in src) if (own.call(src, key)) obj[key] = src[key];
    return obj;
  }
}).call(this);
