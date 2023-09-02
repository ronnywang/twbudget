(function(){
  var argv, json, default_port, port, host, basepath, replace$ = ''.replace;
  argv = (function(){
    try {
      return require('optimist').argv;
    } catch (e$) {}
  }());
  json = (function(){
    try {
      return JSON.parse(require('fs').readFileSync('environment.json', 'utf8'));
    } catch (e$) {}
  }());
  default_port = process.env.NODE_ENV === 'production' ? 80 : 8000;
  port = Number((argv != null ? argv.port : void 8) || (json != null ? json.PORT_NODEJS : void 8) || process.env.PORT || process.env.VCAP_APP_PORT) || default_port;
  host = (argv != null ? argv.host : void 8) || process.env.VCAP_APP_HOST || '0.0.0.0';
  basepath = replace$.call((argv != null ? argv.basepath : void 8) || "", /\/$/, '');
  console.log("Please connect to: http://" + (host === '0.0.0.0' ? require('os').hostname() : host) + ":" + port + "/");
  require('zappajs')(port, host, function(){
    var ref$;
    this.BASEPATH = basepath;
    this.config = json != null
      ? json
      : {};
    (ref$ = this.config).cookieSecret == null && (ref$.cookieSecret = 'its-secret');
    (ref$ = this.config).authproviders == null && (ref$.authproviders = {});
    return this.include('main');
  });
}).call(this);
