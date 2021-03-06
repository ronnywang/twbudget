(function(){
  this.include = function(){
    var fs, CurrencyData, CurrencyConvert;
    fs = require('fs');
    CurrencyData = [["", "元", 1], ["份", "營養午餐", 25], ["份", "營養午餐(回扣)", 30], ["人的", "年薪", 308000], ["座", "釣魚台", 80000000], ["分鐘", "太空旅遊", 1000000], ["碗", "鬍鬚張魯肉飯", 68], ["個", "便當", 50], ["杯", "珍奶", 30], ["份", "雞排加珍奶", 60], ["個", "晨水匾", 700000000], ["個", "夢想家", 200000000], ["個", "林益世(粗估)", 83000000], ["座", "冰島", 2000080000000], ["坪", "帝寶", 2500000], ["支", "iPhone5", 25900], ["座", "硬兔的小島", 2000080000000]];
    CurrencyConvert = function(v, idx, full){
      var c;
      idx == null && (idx = 0);
      c = CurrencyData[idx];
      v = parseInt(10000 * v / c[2]) / 10000;
      if (v > 1 && v < 1000) {
        v = parseInt(10 * v) / 10;
      }
      if (v >= 1000 && v < 10000) {
        v = parseInt(v / 1000) + "千";
      } else if (v >= 10000 && v < 100000000) {
        v = parseInt(v / 10000) + "萬";
      } else if (v >= 100000000 && v < 1000000000000) {
        v = parseInt(v / 100000000) + "億";
      } else {
        if (v >= 1000000000000) {
          v = parseInt(v / 1000000000000) + "兆";
        }
      }
      return v + (full ? c[0] + c[1] : "");
    };
    this.loadCsv = function(fn, cb){
      return fs.readFile(fn, 'utf8', function(err, data){
        var hash, arr, i$, i;
        hash = {};
        if (err) {
          return console.log(err);
        }
        arr = data.split('\n').filter(function(e, i, a){
          return e.length > 0;
        });
        for (i$ = arr.length - 1; i$ >= 0; --i$) {
          i = i$;
          arr[i] = arr[i].split(',');
          hash[arr[i][1]] = arr[i];
        }
        return cb(hash);
      });
    };
    return this.getOpenGraph = function(hash, code){
      var item, ret;
      item = hash[code];
      ret = {
        og_title: "",
        og_url: "",
        og_description: ""
      };
      if (!item) {
        return ret;
      }
      ret.og_title = " : 預算項目「" + item[3] + "」(屬於" + item[4] + " > " + item[5] + " > " + item[6] + ")";
      ret.og_url = "budget/" + code;
      ret.og_description = "【" + item[4] + " > " + item[5] + " > " + item[6] + " > " + item[3] + "】的年度預算為" + CurrencyConvert(item[2], 0, true) + ", 相當於" + CurrencyConvert(item[2], parseInt(Math.random() * CurrencyData.length), true) + ", 也等於" + CurrencyConvert(item[2], parseInt(Math.random() * CurrencyData.length), true);
      return ret;
    };
  };
}).call(this);
