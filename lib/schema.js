(function(){
  var mongoose, Schema, s, res$, i$, ref$, len$, name;
  mongoose = require('mongoose');
  Schema = mongoose.Schema;
  s = {
    ProductSchema: Schema({
      name: String,
      brand: String,
      image: String,
      excerpt: String,
      description: String,
      variant: [],
      meta: {},
      tags: []
    })
  };
  s.ItemSchema = Schema({
    product: String,
    price: Number,
    merchant: String
  });
  s.BudgetItemSchema = Schema({
    key: String,
    nlikes: Number,
    nconfuses: Number,
    nhates: Number,
    ncuts: Number,
    likes: [],
    confuses: [],
    hates: [],
    cuts: [],
    tags: []
  });
  res$ = {};
  for (i$ = 0, len$ = (ref$ = ['Product', 'BudgetItem']).length; i$ < len$; ++i$) {
    name = ref$[i$];
    res$[name] = mongoose.model(name, s[name + 'Schema']);
  }
  module.exports = res$;
}).call(this);
