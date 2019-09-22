(function(){
  var ref$, Product, BudgetItem, replace$ = ''.replace;
  ref$ = require('../lib/schema'), Product = ref$.Product, BudgetItem = ref$.BudgetItem;
  this.include = function(){
    var CookieStore, RealBin, sendFile, JsonType, getOpenGraph, this$ = this;
    this.passport = require('passport');
    CookieStore = require('cookie-sessions');
    this.use(this.express['static'](__dirname + '/../_public'));
    this.use('bodyParser');
    this.use(CookieStore({
      secret: this.config.cookieSecret,
      onError: function(){
        return {};
      }
    }));
    this.app.use(this.passport.initialize());
    this.app.use(this.passport.session());
    this.use(this.app.router);
    this.app.set("trust proxy", true);
    this.app.set("views", __dirname + "/../app");
    RealBin = require('path').dirname(require('fs').realpathSync(__filename));
    RealBin = replace$.call(RealBin, /\/server/, '');
    sendFile = function(file){
      return function(){
        this.response.contentType('text/html');
        return this.response.sendfile(RealBin + "/_public/" + file);
      };
    };
    JsonType = {
      'Content-Type': 'application/json; charset=utf-8'
    };
    this.helper({
      ensureAuthenticated: function(next){
        var ref$;
        if ((ref$ = this.request) != null && ref$.isAuthenticated()) {
          return next();
        }
        return this.response.send(401);
      }
    });
    this.get({
      '/1/products/:query': function(){
        var this$ = this;
        return Product.find().exec(function(err, res){
          var results, res$, i$, ref$, len$, i;
          res$ = [];
          for (i$ = 0, len$ = (ref$ = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).length; i$ < len$; ++i$) {
            i = ref$[i$];
            res$.push({
              name: 'ONE',
              categoryKey: 'htc:one',
              products: res
            });
          }
          results = res$;
          return this$.response.send(results);
        });
      }
    });
    this.get({
      '/1/profile': function(){
        var this$ = this;
        return this.ensureAuthenticated(function(){
          return this$.response.send(this$.request.user);
        });
      }
    });
    this.get({
      '/1/budgetitems': function(){
        var this$ = this;
        return BudgetItem.find({}, 'key nhates nconfuses nlikes ncuts').exec(function(err, item){
          return this$.response.send(item);
        });
      }
    });
    this.get({
      '/1/budgetitems/:key': function(){
        var this$ = this;
        return BudgetItem.findOne({
          key: this.params.key
        }, 'key nhates nconfuses nlikes ncuts tags').exec(function(err, item){
          console.log(this$.params.key, item);
          return this$.response.send(item);
        });
      }
    });
    this.post({
      '/1/budgetitems/:key/tags/:tag': function(){
        var key, tag, done, this$ = this;
        key = this.params.key;
        tag = this.params.tag;
        done = function(err, item){
          return item.update({
            $addToSet: {
              tags: tag
            }
          }, function(errr, updated){
            console.log(errr, updated);
            return BudgetItem.findOne({
              'key': key
            }, function(err, item){
              return this$.response.send(item);
            });
          });
        };
        return BudgetItem.findOne({
          'key': key
        }, function(err, item){
          if (item != null && item.id) {
            return done(null, item);
          }
          item = new BudgetItem({
            key: key
          });
          return item.save(function(err){
            if (err) {
              return done(err, null);
            }
            return done(null, item);
          });
        });
      }
    });
    this.post({
      '/1/budgetitems/:key/:what': function(){
        var key, done, this$ = this;
        key = this.params.key;
        done = function(err, item){
          var ref$, user_id, ref1$;
          console.log(item);
          if ((ref$ = this$.params.what) == 'likes' || ref$ == 'confuses' || ref$ == 'hates' || ref$ == 'cuts') {
            console.log(item._id);
            user_id = (ref$ = (ref1$ = this$.request.user) != null ? ref1$._id : void 8) != null
              ? ref$
              : this$.request.ip;
            return BudgetItem.update((ref$ = {
              _id: item._id
            }, ref$[this$.params.what + ""] = {
              $ne: user_id
            }, ref$), {
              $inc: (ref$ = {}, ref$["n" + this$.params.what] = 1, ref$),
              $push: (ref$ = {}, ref$[this$.params.what + ""] = user_id, ref$)
            }, function(errr, updated){
              console.log(errr, updated);
              return BudgetItem.findOne({
                'key': key
              }, function(err, item){
                return this$.response.send(item);
              });
            });
          } else {
            return this$.response.send(item);
          }
        };
        return BudgetItem.findOne({
          'key': key
        }, function(err, item){
          if (item != null && item.id) {
            return done(null, item);
          }
          item = new BudgetItem({
            key: key
          });
          return item.save(function(err){
            if (err) {
              return done(err, null);
            }
            return done(null, item);
          });
        });
      }
    });
    this.include('auth');
    this.include('opengraph');
    this.csv2012 = null;
    this.loadCsv('app/assets/data/tw2012ap.csv', function(hash){
      return this$.csv2012 = hash;
    });
    getOpenGraph = function(code){
      return this$.getOpenGraph(this$.csv2012, code);
    };
    this.get({
      '/:what': sendFile('index.html')
    });
    return this.get({
      '/budget/:code': function(){
        var code;
        code = this.request.path.match(/\/budget\/(\S+)/)[1];
        return this.render({
          'index.static.jade': getOpenGraph(code)
        });
      }
    });
  };
}).call(this);
