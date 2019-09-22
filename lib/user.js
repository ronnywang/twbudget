(function(){
  var bcrypt, mongoose, Schema, s, User, res$, i$, ref$, len$, name;
  bcrypt = require('bcrypt');
  mongoose = require('mongoose');
  Schema = mongoose.Schema;
  s = {};
  User = s.UserSchema = new Schema({
    name: String,
    email: {
      type: String,
      sparse: true,
      unique: true
    },
    salt: {
      type: String
    },
    hash: {
      type: String
    },
    votepref: String,
    votearea: String,
    accounts: []
  });
  User.virtual('password').get(function(){
    return this._password;
  }).set(function(password){
    var salt;
    this._password = password;
    salt = this.salt = bcrypt.genSaltSync(10);
    return this.hash = bcrypt.hashSync(password, salt);
  });
  User.method('verifyPassword', function(password, callback){
    return bcrypt.compare(password, this.hash, callback);
  });
  User['static']('authenticate', function(email, password, callback){
    console.log('auth', email);
    return this.findOne({
      email: email
    }, function(err, user){
      if (err) {
        return callback(err);
      }
      if (!user) {
        return callback(null, null, {
          message: "Unknown User"
        });
      }
      return user.verifyPassword(password, function(err, passwordCorrect){
        switch (false) {
        case !err:
          return callback(err);
        case !!passwordCorrect:
          return callback(null, false, {
            message: "Invalid Password"
          });
        default:
          return callback(null, user);
        }
      });
    });
  });
  res$ = {};
  for (i$ = 0, len$ = (ref$ = ['User']).length; i$ < len$; ++i$) {
    name = ref$[i$];
    res$[name] = mongoose.model(name, s[name + 'Schema']);
  }
  module.exports = res$;
}).call(this);
