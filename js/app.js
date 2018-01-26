function CustomTooltip(tooltipId, width){
	var tooltipId = tooltipId;
        var positionFixed = false;
	$("body").append("<div class='tooltip' id='"+tooltipId+"'></div>");
	
	if(width){
		$("#"+tooltipId).css("width", width);
	}
	
	hideTooltip();
	
	function showTooltip(content, event){
		$("#"+tooltipId).html(content);
		$("#"+tooltipId).show();
		
		if(event) updatePosition(event);
	}
	
	function hideTooltip(){
		if(!positionFixed) $("#"+tooltipId).hide();
	}
	
	function updatePosition(event){
		var ttid = "#"+tooltipId;
		var xOffset = 20;
		var yOffset = 10;
		
		 var ttw = $(ttid).width();
		 var tth = $(ttid).height();
		 var wscrY = $(window).scrollTop();
		 var wscrX = $(window).scrollLeft();
		 var curX = (document.all) ? event.clientX + wscrX : event.pageX;
		 var curY = (document.all) ? event.clientY + wscrY : event.pageY;
		 var ttleft = ((curX - wscrX + xOffset*2 + ttw) > $(window).width()) ? curX - ttw - xOffset*2 : curX + xOffset;
		 if (ttleft < wscrX + xOffset){
		 	ttleft = wscrX + xOffset;
		 } 
		 var tttop = ((curY - wscrY + yOffset*2 + tth) > $(window).height()) ? curY - tth - yOffset*2 : curY + yOffset;
		 if (tttop < wscrY + yOffset){
		 	tttop = curY + yOffset;
		 } 
		 if(!positionFixed) $(ttid).css('top', tttop + 'px').css('left', ttleft + 'px');
	}

        function fixPosition(fixed,parent) {
		positionFixed = fixed;
		var node = $("#"+tooltipId);
		node.remove();
		if(fixed) {
			node.css({top:"0px",left:"0px",width:"100%",height:"100%"});
			parent.append(node);
			showTooltip();
                } else {
			node.css({top:"0px",left:"0px",width:"auto",height:"auto"});
			$(document.body).append(node);
			hideTooltip();
		}
        }
	
	return {
		showTooltip: showTooltip,
		hideTooltip: hideTooltip,
		updatePosition: updatePosition,
                fixPosition: fixPosition
	}
}
angular.module('app', ['partials', 'ngResource', 'app.controllers', 'app.directives', 'app.filters', 'app.services', 'ui.directives', 'ui.state']).config(['$stateProvider', '$urlRouterProvider', '$locationProvider'].concat(function($stateProvider, $urlRouterProvider, $locationProvider){
  $stateProvider.state('view2', {
    url: '/view2',
    templateUrl: '/partials/partial2.html'
  }).state('view3', {
    url: '/view3',
    templateUrl: '/partials/partial3.html',
    controller: 'BudgetItem'
  }).state('budget', {
    url: '/budget',
    templateUrl: '/partials/partial4.html',
    controller: 'BudgetItem'
  }).state('budget.detail', {
    url: '/{code}',
    templateUrl: '/partials/partial4.html'
  }).state('debtclock', {
    url: '/debtclock',
    templateUrl: '/partials/debtclock.html'
  }).state('profile', {
    url: '/profile',
    templateUrl: '/partials/profile.html'
  });
  $urlRouterProvider.otherwise('/budget');
  return $locationProvider.html5Mode(true);
})).run(['$rootScope', '$state', '$stateParams', '$location'].concat(function($rootScope, $state, $stateParams, $location){
  $rootScope.$state = $state;
  $rootScope.$stateParam = $stateParams;
  $rootScope.go = function(it){
    return $location.path(it);
  };
  return $rootScope.$on('$stateChangeSuccess', function(e, arg$){
    var url, name;
    url = arg$.url, name = arg$.name;
    return typeof window != 'undefined' && window !== null ? typeof window.ga === 'function' ? window.ga('send', 'pageview', {
      page: url,
      title: name
    }) : void 8 : void 8;
  });
}));var mod;
mod = {};
mod.AppCtrl = [
  '$scope', '$location', '$resource', '$rootScope', function(s, $location, $resource, $rootScope){
    s.$location = $location;
    s.$watch('$location.path()', function(path){
      return s.activeNavId = path || '/';
    });
    return s.getClass = function(id){
      if (s.activeNavId.substring(0, id.length) === id) {
        return 'active';
      } else {
        return '';
      }
    };
  }
];
mod.LoginController = ['$scope', '$http', 'authService'].concat(function($scope, $http, authService){
  $scope.$on('event:auth-loginRequired', function(){
    return $scope.loginShown = true;
  });
  $scope.$on('event:auth-loginConfirmed', function(){
    return $scope.loginShown = false;
  });
  window.addEventListener('message', function(arg$){
    var data;
    data = arg$.data;
    return $scope.$apply(function(){
      if (data.auth) {
        $scope.message = '';
        authService.loginConfirmed();
      }
      if (data.authFailed) {
        return $scope.message = data.message || 'login failed';
      }
    });
  });
  $scope.message = '';
  return $scope.submit = function(){
    return $http.post('auth/login', {
      email: $scope.email,
      password: $scope.password
    }).success(function(){
      $scope.message = '';
      return authService.loginConfirmed();
    }).error(function(it){
      return $scope.message = typeof it === 'object' ? it.message : it;
    });
  };
});
mod.Profile = ['$scope', '$http'].concat(function($scope, $http){
  $scope.name = 'Guest';
  return $http.get('/1/profile').success(function(res){
    var name;
    name = res.name;
    return $scope.name = name;
  });
});
mod.MyCtrl1 = ['$scope', 'ProductSearch'].concat(function($scope, productSearch){
  $scope.updateblah = function(which){
    var i;
    i = parseInt($('#categories').scrollLeft() / 150);
    if ($scope.category_index_old !== i) {
      return $scope.category_index_old = i;
    }
  };
  $scope.blah = function(which){
    var i;
    i = 1 + Math.abs(which - parseInt($('#categories').scrollLeft() / 150));
    if (i >= 3) {
      i = 3;
    }
    return i;
  };
  $scope.moreProducts = productSearch.moreResults;
  $scope.search = 'HTC';
  $scope.cc = 1;
  return productSearch.search("htc", function(results){
    $scope.results = results;
  });
});
mod.BudgetItem = ['$scope', '$state', 'BudgetItem'].concat(function($scope, $state, BudgetItem){
  var update_from_item;
  $scope.$watch('$state.params.code', function(code){
    return $scope.code = code;
  });
  update_from_item = function(res){
    return $scope.nlikes = res.nlikes, $scope.nhates = res.nhates, $scope.ncuts = res.ncuts, $scope.nconfuses = res.nconfuses, $scope.tags = res.tags, $scope;
  };
  $scope.$watch('key', function(){
    return BudgetItem.get($scope.key, function(res){
      return update_from_item(res);
    });
  });
  return import$($scope, {
    nlikes: '???',
    nconfuses: '???',
    nhates: '???',
    ncuts: '???',
    like: function(){
      return BudgetItem.update($scope.key, 'likes', update_from_item);
    },
    hate: function(){
      return BudgetItem.update($scope.key, 'hates', update_from_item);
    },
    confuse: function(){
      return BudgetItem.update($scope.key, 'confuses', update_from_item);
    },
    cut: function(){
      return BudgetItem.update($scope.key, 'cuts', update_from_item);
    },
    addtag: function(){
      if ($scope.tagname) {
        return BudgetItem.addtag($scope.key, $scope.tagname, update_from_item);
      }
    },
    addunit: function(){
      if (!$scope.addunit_quantity) {
        return $('#addunit-modal input:eq(0)').tooltip("show");
      }
      if (!$scope.addunit_unit) {
        return $('#addunit-modal input:eq(1)').tooltip("show");
      }
      if (!jQuery.isNumeric($scope.addunit_value)) {
        return $('#addunit-modal input:eq(2)').tooltip("show");
      }
      return $('#addunit-modal').modal('hide');
    },
    units: [["", '元', '1'], ['份', '營養午餐', '25'], ['份', '營養午餐(回扣)', '30'], ['人', '的一年薪水', '308000'], ['座', '釣魚台', '80000000'], ['秒', '太空旅遊', '16666'], ['碗', '鬍鬚張魯肉飯', '68'], ['個', '便當', '50'], ['杯', '珍奶', '30'], ['份', '雞排加珍奶', '60'], ['個', '晨水匾', '700000000'], ['個', '夢想家', '200000000'], ['個', '林益世(粗估)', '83000000'], ['座', '冰島', '2000080000000'], ['坪', '帝寶', '2500000'], ['支', 'iPhone5', '25900'], ['座', '硬兔的小島', '2000080000000']]
  });
});
mod.DebtClock = ['$scope', '$timeout'].concat(function($scope, $timeout){
  var nationalDebt, nationalPayable;
  nationalDebt = 59412 * 10000 * 10000;
  nationalPayable = 109703 * 10000 * 10000;
  $scope.data = {
    yr2012: {
      base: nationalDebt + nationalPayable,
      interest: 7389
    }
  };
  $scope.refreshDebtClock = function(){
    var now, spday, message, a;
    now = new Date();
    spday = new Date(2013, 1 - 1, 1);
    message = '';
    a = (now.getTime() - spday.getTime()) / 1000 * $scope.data.yr2012.interest + $scope.data.yr2012.base;
    a = Math.ceil(a);
    return $scope.total = {
      debt: a,
      avg: Math.round(a / 23367320)
    };
  };
  $scope.scheduleDebtClockRefresh = function(){
    var timeoutId;
    return timeoutId = $timeout(function(){
      $scope.refreshDebtClock();
      $scope.scheduleDebtClockRefresh();
    }, 1000);
  };
  return $scope.scheduleDebtClockRefresh();
});
mod.DailyBread = ['$scope', '$http'].concat(function($scope, $http){
  $scope.tax = 80000;
  $scope.$watch('tax', function(){
    var ref$;
    return (ref$ = window.__db) != null ? ref$.setTax($scope.tax) : void 8;
  });
  return dailybread();
});
mod.UnitMapper = ['$scope'].concat(function($scope){
  return $scope.units = UnitMapper.table;
});
mod.MyCtrl2 = [
  '$scope', function(s){
    return s.Title = "MyCtrl2";
  }
];
angular.module('app.controllers', ['http-auth-interceptor']).controller(mod);
function import$(obj, src){
  var own = {}.hasOwnProperty;
  for (var key in src) if (own.call(src, key)) obj[key] = src[key];
  return obj;
}var mod;
mod = {};
mod.appVersion = [
  'version', function(version){
    return function(scope, elm, attrs){
      return elm.text(version);
    };
  }
];
mod.whenScrolled = function(){
  return function(scope, elm, attr){
    var raw;
    raw = elm[0];
    return elm.bind('scroll', function(){
      if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight) {
        return scope.$apply(attr.whenScrolled);
      }
    });
  };
};
mod.whenHScrolled = function(){
  return function(scope, elm, attr){
    var raw;
    raw = elm[0];
    return elm.bind('scroll', function(){
      return scope.$apply(attr.whenHScrolled);
    });
  };
};
angular.module('app.directives', ['app.services']).directive(mod);angular.module('app.filters', []).filter('interpolate', [
  'version', function(version){
    return function(text){
      return String(text).replace(/\%VERSION\%/mg, version);
    };
  }
]);
angular.module('app.filters', []).filter('unitconvert', [
  '$filter', function($filter){
    return function(v){
      var idx, c;
      idx = UnitMapper.get();
      c = CurrencyData[idx];
      v = parseInt(10000 * v / c[2]) / 10000;
      if (v > 1 && v < 1000) {
        v = parseInt(10 * v) / 10;
      }
      v = $filter('number')(v, 0);
      return v + c[0] + c[1];
    };
  }
]);var mod;
mod = {};
mod.version = function(){
  return "0.1";
};
mod.ProductSearch = ['$http'].concat(function($http){
  var currentQuery, results;
  currentQuery = '';
  results = {};
  return {
    search: function(query, cb){
      var currentQuery;
      currentQuery = query;
      return $http.get('/1/products/' + currentQuery).success(cb);
    },
    getResults: function(){
      return results;
    },
    moreResults: function(which){
      console.log('more');
      return results[which].products.push({
        name: 'newly added'
      });
    }
  };
});
mod.BudgetItem = ['$http'].concat(function($http){
  return {
    get: function(key, cb){
      return $http.get("/1/budgetitems/" + key).success(cb);
    },
    update: function(key, verb, cb){
      console.log('updating', key, verb);
      return $http.post("/1/budgetitems/" + key + "/" + verb).success(cb);
    },
    addtag: function(key, tag, cb){
      return $http.post("/1/budgetitems/" + key + "/tags/" + tag).success(cb);
    }
  };
});
angular.module('app.services', []).factory(mod);var BubbleChart, root;
BubbleChart = (function(){
  BubbleChart.displayName = 'BubbleChart';
  var prototype = BubbleChart.prototype, constructor = BubbleChart;
  function BubbleChart(arg$){
    var ref$, this$ = this;
    this.data = arg$.data, this.width = (ref$ = arg$.width) != null ? ref$ : 1004, this.height = (ref$ = arg$.height) != null ? ref$ : 650, this.damper = (ref$ = arg$.damper) != null ? ref$ : 0.1, this.layout_gravity = (ref$ = arg$.layout_gravity) != null ? ref$ : 0.01, this.amount_attr = (ref$ = arg$.amount_attr) != null ? ref$ : 'amount';
    this.charge = bind$(this, 'charge', prototype);
    $('#bubble_tooltip').remove();
    this.tooltip = CustomTooltip('bubble_tooltip', 370);
    this.center = {
      x: this.width / 2 + 210,
      y: this.height / 2
    };
    this.mode = 'default';
    this.nodes = [];
    this.change_scale = d3.scale.linear().domain([-0.25, 0.25]).clamp(true).range([this.height / 9 * 5, this.height / 9 * 4]);
    this.fill_color = d3.scale.quantile().domain([-0.5, -0.25, -0.1, -0.02, 0, 0.02, 0.1, 0.25, 0.5]).range(['#C51B7D', '#DE77AE', '#F1B6DA', '#FDE0EF', '#E6F5D0', '#B8E186', '#7FBC41', '#4D9221']);
    this.radius_scale = d3.scale.pow().exponent(0.5).domain([
      0, d3.max(this.data, function(d){
        return +d[this$.amount_attr];
      })
    ]).range([2, 65]);
    this.create_nodes();
    this.create_vis();
  }
  prototype.create_nodes = function(){
    var this$ = this;
    return this.nodes = this.data.map(function(d){
      return {
        id: d.code,
        radius: this$.radius_scale(+d[this$.amount_attr]),
        value: +d[this$.amount_attr],
        data: d,
        org: d.depname,
        orgcat: d.depcat,
        change: d.change,
        group: d.cat,
        year: 2013,
        x: Math.random() * 900,
        y: Math.random() * 800
      };
    });
  };
  prototype.create_vis = function(){
    var colors, x, y, change, x$, i$, ref$, len$, i, val, r, y$, this$ = this;
    this.vis = d3.select('#bubble-chart').append('svg').attr('width', this.width).attr('height', this.height).attr('id', 'svg_vis');
    this.circles = this.vis.selectAll("circle.budget").data(this.nodes, function(it){
      return it.id;
    });
    colors = [-1].concat(this.fill_color.quantiles(), [NaN]);
    x = d3.scale.ordinal().rangeRoundBands([200, 0], 0.1).domain(colors);
    y = d3.scale.ordinal().rangeRoundBands([200, 0], 0.1).domain(colors);
    change = d3.format('+%');
    x$ = this.vis.selectAll('.change-lenged').data(colors);
    x$.enter().append('rect').attr('class', 'change-legend').attr('x', function(it){
      return 260 + x(it) * 1.5;
    }).attr('y', 20).attr('width', function(){
      return x.rangeBand();
    }).attr('height', function(){
      return 10;
    }).attr('fill', function(it){
      return this$.fill_color(it);
    }).attr('stroke', 'none');
    x$.enter().append('text').attr('x', function(it){
      return 246 + (isNaN(it)
        ? x.rangeBand() / 2
        : x.rangeBand()) + x(it) * 1.55;
    }).attr('y', 15).attr('text-anchor', 'right').text(function(it){
      var ref$;
      switch (ref$ = [it], false) {
      case !isNaN(ref$[0]):
        return '新增';
      case !(function(it){
          return it === -1;
        })(ref$[0]):
        return '';
      default:
        return change(it);
      }
    });
    this.locking = function(d, i, node){
      var x$, y$;
      if (this$.lockcell.node) {
        this$.lockcell.node.attr('fill', function(it){
          return this$.fill_color(it.change);
        }).attr('stroke', function(d){
          return d3.rgb(this$.fill_color(d.change)).darker();
        }).style('opacity', 1.0);
      }
      if (!d || d.id === this$.lockcell.id) {
        if (this$.mode !== 'default') {
          InfoPanel.setState(2);
        } else {
          InfoPanel.setState(1);
        }
        x$ = this$.lockcell;
        x$.id = null;
        x$.node = null;
        return;
      }
      InfoPanel.setState(3);
      d3.select('#bubble-info-right *').remove();
      d3.select('#bubble-info-right').insert('fb:comments', ':first-child').attr('href', 'http://budget.g0v.tw/budget/' + d.id).attr('num-posts', '2').attr('width', '470').attr('class', 'fb-comments');
      FB.XFBML.parse(document.getElementById("bubble-info-right"));
      y$ = this$.lockcell;
      y$.id = d.id;
      y$.node = d3.select(node || d3.event.target);
      this$.show_details(d, i);
      return this$.lockcell.node.attr('fill', 'url(#MyGradient)').attr('stroke', '#f00').style('opacity', 0.5);
    };
    this.lockcell = {
      node: null,
      id: null
    };
    d3.select('#bubble-info-close').on('click', function(d, i){
      return this$.locking(null, i);
    });
    this.circles.enter().append('circle').attr('class', function(){
      return 'bubble-budget';
    }).attr('r', function(it){
      return it.radius;
    }).attr('fill', function(it){
      return this$.fill_color(it.change);
    }).attr('stroke-width', 2).attr('stroke', function(it){
      return d3.rgb(this$.fill_color(it.change)).darker();
    }).attr('id', function(it){
      return "bubble_" + it.id;
    }).on('mousemove', function(d, i){
      if (!this$.lockcell.node) {
        return this$.show_details(d, i, d3.event.target);
      }
    }).on('mouseover', function(d, i){
      var scope;
      if (!this$.lockcell.node) {
        scope = angular.element('#BudgetItem').scope();
        return scope.$apply(function(){
          return scope.key = d.id;
        });
      }
    }).on('mouseout', function(d, i){
      if (!this$.lockcell.node) {
        return this$.hide_details(d, i, d3.event.target);
      }
    }).on('click', function(d, i){
      this$.locking(d, i);
      return this$.force.start();
    });
    this.code = angular.element('#BudgetItem').scope().code;
    this.depict = this.vis.append('g').style('opacity', 0.0).style('display', 'none').attr('transform', "translate(430,150)");
    this.depict.append('rect').attr('width', 550).attr('height', 350).attr('rx', 10).attr('ry', 10).attr('fill', '#222');
    for (i$ = 0, len$ = (ref$ = [100, 10000, 100000, 284400].map(fn$)).length; i$ < len$; ++i$) {
      i = i$;
      val = ref$[i$];
      r = this.radius_scale(val);
      y$ = this.depict.append('circle').attr('r', r).attr('cx', 275 - r).attr('cy', 310 - 2 * r).attr('fill', 'none').attr('stroke-width', 2).attr('stroke', '#fff');
      if (i === 3) {
        y$.attr('stroke-dasharray', '5, 1, 5');
      }
      this.depict.append('text').attr('x', 285).attr('y', 315 - 2 * r).attr('text-anchor', 'bottom').attr('text-anchor', 'left').attr('fill', '#fff').text(CurrencyConvert(val) + (i === 3 ? '(2013預計舉債)' : ''));
    }
    return d3.select('#bubble-circle-size').on('mouseover', function(d, i){
      return this$.depict.transition().duration(750).style('opacity', 0.7).style('display', 'block');
    }).on('mouseout', function(d, i){
      this$.depict.transition().duration(750).style('opacity', 0.0);
      return this$.depict.transition().delay(750).style('display', 'none');
    });
    function fn$(it){
      return it * 1000 * 1000;
    }
  };
  prototype.charge = function(d){
    var ref$;
    return d.id === this.lockcell.id
      ? -Math.pow((ref$ = d.radius) > 20 ? ref$ : 20, 2)
      : (-Math.pow(d.radius, 2)) / 8;
  };
  prototype.start = function(){
    return this.force = d3.layout.force().nodes(this.nodes).size([this.width, this.height]);
  };
  prototype.display_group_all = function(){
    var i, k, ref$, v, this$ = this;
    this.mode = 'default';
    if (!angular.element('#BudgetItem').scope().code) {
      i = parseInt(Math.random() * this.nodes.length);
      this.show_details(this.nodes[i], i);
    }
    if (!this.code) {
      InfoPanel.setState(1);
    }
    this.circles.each(function(d, i){
      if (d.id === this$.code) {
        InfoPanel.setState(3);
        this$.show_details(d, i, this$.circles[0][i]);
        return this$.locking(d, i, this$.circles[0][i]);
      }
    });
    this.vis.selectAll('.attr-legend').remove();
    this.force.gravity(this.layout_gravity).charge(this.charge).friction(0.7).on('tick', function(e){
      return this$.circles.each(this$.move_towards_center(e.alpha)).attr('cx', function(it){
        return it.x;
      }).attr('cy', function(it){
        return it.y;
      });
    });
    for (k in ref$ = this.groups) {
      v = ref$[k];
      this.groups[k].transition().style("opacity", 0);
    }
    return this.force.start();
  };
  prototype.move_towards_center = function(alpha){
    var this$ = this;
    return function(d){
      var cy, ref$;
      cy = (ref$ = this$.change_scale(d.change)) != null
        ? ref$
        : this$.center.y;
      if (isNaN(cy)) {
        cy = this$.center.y;
      }
      d.x += (this$.center.x - d.x) * (this$.damper + 0.02) * alpha;
      return d.y += (cy - d.y) * (this$.damper + 0.02) * alpha;
    };
  };
  prototype.display_by_attr = function(attr){
    var nest, entries, amount_attr, sums, curr_x, curr_y, y_offset, centers, i$, len$, entry, key, values, r, ref$, group_relocate, group_sparser, k, v, move_towards, x$, this$ = this;
    this.mode = attr;
    InfoPanel.setState(2);
    nest = d3.nest().key(function(it){
      return it[attr];
    });
    entries = nest.entries(this.data);
    amount_attr = this.amount_attr;
    sums = nest.rollup(function(it){
      return it.map(function(it){
        return it[amount_attr];
      }).map(function(it){
        return +it;
      }).reduce(curry$(function(x$, y$){
        return x$ + y$;
      }));
    }).entries(this.data).sort(function(a, b){
      return b.values - a.values;
    });
    curr_x = 50;
    curr_y = 100;
    y_offset = null;
    centers = {};
    for (i$ = 0, len$ = sums.length; i$ < len$; ++i$) {
      entry = sums[i$], key = entry.key, values = entry.values;
      r = this.radius_scale(values);
      curr_x += Math.max(150, r * 2);
      if (curr_x > this.width - 50) {
        curr_x = 50 + r * 2;
        curr_y += y_offset;
        y_offset = null;
      }
      y_offset == null && (y_offset = r + 170);
      centers[key] = {
        key: key,
        sum: values,
        top: curr_y,
        x: curr_x - r,
        y: curr_y + y_offset / 2,
        r: r,
        group: {
          r: r > (ref$ = 30 * (130 - (r < 100 ? r : 100)) / 100) ? r : ref$,
          sparse: false
        }
      };
    }
    group_relocate = function(d, des, sparse){
      if (des.key === d.data[attr]) {
        if (sparse) {
          d.des_x = des.x + Math.random() * 80 - 40;
          return d.des_y = des.y + Math.random() * 80 - 40;
        } else {
          d.des_x = des.x + Math.random() * 10 - 5;
          return d.des_y = des.y + Math.random() * 10 - 5;
        }
      }
    };
    group_sparser = function(d){
      var a, b;
      a = Math.pow(d.group.r, 2);
      b = Math.pow(d3.event.pageX - $('#bubble-chart svg').offset().left - d.x, 2) + Math.pow(d3.event.pageY - $('#bubble-chart svg').offset().top - d.y, 2);
      if (a > b && !d.group.sparse) {
        d.group.sparse = true;
        this$.circles.each(group_relocate(d, true));
        this$.force.start(0.1);
      }
      if (a <= b && d.group.sparse) {
        d.group.sparse = false;
        this$.circles.each(group_relocate(d, false));
        return this$.force.start(0.1);
      }
    };
    this.circles.each(function(d, i){
      return d.c = centers[d.data[attr]];
    }).each(function(d, i){
      return group_relocate(d, d.c, true);
    });
    if (!this.groups) {
      this.groups = {};
    }
    if (!this.groups[attr]) {
      this.groups[attr] = this.vis.insert("g", ":first-child").attr("class", ".group-" + attr).style("opacity", 0);
      this.groups[attr].selectAll("g.group-" + attr + " circle.bubble-groups").data(d3.map(centers).values()).enter().insert('circle').attr('class', function(){
        return 'bubble-groups';
      }).attr('r', function(d){
        return d.group.r;
      }).attr('cx', function(d){
        return d.x;
      }).attr('cy', function(d){
        return d.y;
      }).attr('fill', '#f5f5f5').attr('stroke', '#000').attr('stroke-dasharray', "2,8");
    }
    for (k in ref$ = this.groups) {
      v = ref$[k];
      if (k !== attr) {
        this.groups[k].transition().duration(750).style("opacity", 0);
      } else {
        this.groups[k].transition().duration(750).style("opacity", 1);
      }
    }
    curr_y += y_offset * 2;
    if (curr_y > this.vis.attr('height')) {
      this.vis.attr('height', curr_y);
    }
    move_towards = function(alpha){
      return function(d){
        var ref$, x, y, r, factor;
        ref$ = centers[d.data[attr]], x = ref$.x, y = ref$.y, r = ref$.r;
        factor = (this$.damper + 0.22 + 1.0 * (100 - (r < 100 ? r : 100)) / 130) * alpha * 0.9;
        d.x += (((ref$ = d.des_x) != null
          ? ref$
          : d.des_x = x) - d.x) * factor;
        return d.y += (((ref$ = d.des_y) != null
          ? ref$
          : d.des_y = y) - d.y) * factor;
      };
    };
    this.force.gravity(this.layout_gravity).charge(this.charge).friction(0.9).on('tick', function(e){
      return this$.circles.each(move_towards(e.alpha)).attr('cx', function(it){
        return it.x;
      }).attr('cy', function(it){
        return it.y;
      });
    });
    this.force.start();
    this.vis.selectAll('.attr-legend').remove();
    x$ = this.vis.selectAll('.attr-legend').data(d3.entries(centers));
    x$.enter().append('text').attr('class', "attr-legend fade bubbletext").attr('x', function(it){
      return it.value.x;
    }).attr('y', function(it){
      return it.value.y - it.value.group.r - 28;
    }).attr('text-anchor', 'middle').text(function(it){
      return it.key;
    });
    x$.enter().append('text').attr('class', "attr-legend fade amount bubbletext").attr('x', function(it){
      return it.value.x;
    }).attr('y', function(it){
      return it.value.y - it.value.group.r - 14;
    }).attr('text-anchor', 'middle').text(function(it){
      return UnitMapper.convert(it.value.sum, null, true);
    });
    x$.exit().remove();
    return flip$(setTimeout)(500, function(){
      return this$.vis.selectAll('.attr-legend.fade').classed('in', true);
    });
  };
  prototype.show_details = function(data, i, element){
    var value, change, content;
    value = d3.format(',');
    change = d3.format('+.2%');
    if (element) {
      d3.select(element).attr('stroke', 'black');
    }
    content = "<span class='name'>Title:</span><span class='value'> " + data.data.name + " / " + data.id + " </span><br/>";
    content += "<span class='name'>Amount:</span><span class='value'> $" + value(data.value) + "</span><br/>";
    content += "<span class='name'>Dep:</span><span class='value'> " + data.data.depname + "/ " + data.data.depcat + " </span><br/>";
    content += "<span class='name'>change:</span><span class='change'> " + change(data.change) + "</span>";
    content += "<div id='bubble-detail-change-bar2'></div>";
    $('#bubble-detail-name').text(data.data.name);
    $('#bubble-detail-depname').text(data.data.depname + '/' + data.data.depcat);
    $('#bubble-detail-amount-value').text(UnitMapper.convert(data.value, void 8, false));
    $('#bubble-detail-amount-quantifier').text(UnitMapper.getQuantifier());
    $('#bubble-detail-amount-unit').text(UnitMapper.getUnit());
    $('#bubble-detail-amount-change').text(change(data.change));
    $('#bubble-detail-amount-alt').text(UnitMapper.convert(data.value, -1, true));
    $('#bubble-detail-link').attr('href', 'http://budget.g0v.tw/budget/' + data.data.code);
    $('#bubble-detail-link').text('http://budget.g0v.tw/budget/' + data.data.code);
    if (this.mode !== 'default') {
      this.tooltip.showTooltip(content, d3.event);
    }
    if (this.do_show_details) {
      this.do_show_details(data, element ? this.mode : 'default');
    }
    if (!element) {
      return this.tooltip.hideTooltip();
    }
  };
  prototype.hide_details = function(data, i, element){
    var this$ = this;
    d3.select(element).attr('stroke', function(d){
      return d3.rgb(this$.fill_color(d.change)).darker();
    });
    return this.tooltip.hideTooltip();
  };
  return BubbleChart;
}());
root = typeof exports != 'undefined' && exports !== null ? exports : this;
function bind$(obj, key, target){
  return function(){ return (target || obj)[key].apply(obj, arguments) };
}
function curry$(f, bound){
  var context,
  _curry = function(args) {
    return f.length > 1 ? function(){
      var params = args ? args.concat() : [];
      context = bound ? context || this : this;
      return params.push.apply(params, arguments) <
          f.length && arguments.length ?
        _curry.call(context, params) : f.apply(context, params);
    } : f;
  };
  return _curry();
}
function flip$(f){
  return curry$(function (x, y) { return f(y, x); });
}var CurrencyData, CurrencyConvert;
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
};dailybread = function () {
    var os_path = '/openspendingjs';

    var db_load_data = function load_data(db, data) {
      $('#content-wrap').show();
      $('#preloader').remove();
      
      db.setDataFromAggregator(data, ['unknown']);
      db.setIconLookup(function(name) {
        var style = OpenSpending.Styles.Cofog[name];
        if (style != undefined) {
         return style['icon'];
        }
        return os_path+'/app/dailybread/icons/unknown.svg';
      });
      db.draw();
    } 

    var db_init = function db_init() {
      $('#preloader .txt').html('loading data');
      
      var db = new OpenSpending.DailyBread($('#dailybread'));   
      window.__db = db;

      new OpenSpending.Aggregator({
        apiUrl: 'http://openspending.org/api',
        dataset: 'twbudget',
        drilldowns: ['cat', 'depcat', 'name'],
        cuts: ['year:2013'],
        rootNodeLabel: 'Total', 
        breakdown: 'topname',
        callback: function (data) { db_load_data(db, data); }
      });
    }

    yepnope({
      load: [
        // 'http://wheredoesmymoneygo.org/wp-content/themes/wdmmg/wdmmg.css',
        //'http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.6/themes/ui-lightness/jquery-ui.css',
        //'http://ajax.googleapis.com/ajax/libs/jquery/1.7/jquery.min.js',
        //'http://ajax.googleapis.com/ajax/libs/jqueryui/1.8/jquery-ui.min.js',
        os_path + '/lib/vendor/base64.js',
        os_path + '/lib/vendor/underscore.js',
        os_path + '/lib/vendor/raphael-min.js',
        os_path + '/lib/aggregator.js',
        os_path + '/app/dailybread/css/dailybread.css',
        os_path + '/app/dailybread/js/cofog.js'
      ],
      complete: function () {dailybread.loaded=1; jQuery(function ($) { db_init() } ); }
    });
    if(dailybread.loaded==1) db_init(); // db_init if re-enter partial2
}


dailybread.loaded = 0;
var OpenSpending;
OpenSpending == null && (OpenSpending = {});
$(function(){
  var TAXMAN_URL;
  TAXMAN_URL = "http://taxman.openspending.org";
  return OpenSpending.DailyBread = function(elem){
    var self;
    self = this;
    this.$e = $(elem);
    this.$e.data("wdmmg.dailybread", this);
    this.tiers = [];
    this.areas = [];
    this.iconLookup = function(name){};
    this.divby = 365;
    this.init = function(){
      this.setSalary(22000);
      /* TODO remove after confirming that this is redundent
      @$e.find(".wdmmg-slider").slider do
        value: @salaryVal
        min: 10000
        max: 200000
        step: 10
        animate: true
        slide: ->
          self.sliderSlide.apply self, arguments_
        change: ->
          self.sliderChange.apply self, arguments_
      */
      return this.$e.delegate(".db-area-col", "click", self.handleClick);
    };
    this.formatCurrency = function(val, prec, sym, dec, sep){
      var str, valAry, sepAry, i;
      val /= this.divby;
      prec = prec != null ? 2 : prec;
      sym = sym || "$";
      dec = dec || ".";
      sep = sep || ",";
      str = void 8;
      valAry = val.toFixed(prec).split(".");
      sepAry = [];
      i = valAry[0].length;
      while (i > 2) {
        sepAry.unshift(valAry[0].slice(i - 3, i));
        i -= 3;
      }
      if (i !== 0) {
        sepAry.unshift(valAry[0].slice(0, i));
      }
      str = sym + sepAry.join(sep);
      if (prec > 0) {
        str += dec + valAry[1];
      }
      return str;
    };
    this.setTax = function(tax){
      this.taxVal = parseFloat(tax);
      return self.draw();
    };
    this.sliderSlide = function(evt, sld){
      self.setSalary(sld.value);
      return self.drawTotals();
    };
    this.sliderChange = function(evt, sld){
      self.setSalary(sld.value);
      return self.draw(true);
    };
    this.handleClick = function(){
      var tier, tierId, areaId;
      tier = $(this).closest(".db-tier");
      tierId = parseInt(tier.attr("data-db-tier"), 10);
      areaId = parseInt($(this).attr("data-db-area"), 10);
      self.areas[tierId] = areaId;
      self.areas = self.areas.slice(0, tierId + 1);
      tier.find(".db-area-col").css({
        "opacity": "1"
      }).end().find("[data-db-area=" + areaId + "]").css({
        "opacity": "0.5"
      });
      self.drawTier(tierId + 1);
      self.$e.find(".db-tier").each(function(){
        if ($(this).attr("data-db-tier") > tierId + 1) {
          return $(this).hide();
        }
      });
      return $(self.$e).click();
    };
    this.setData = function(data){
      return self.data = data;
    };
    this.setDataFromAggregator = function(data, skip){
      var handleChildren;
      handleChildren = function(node, absolute){
        return _.map(_.filter(node.children, function(child){
          return _.indexOf(skip, child.name);
        }), function(child){
          var daily;
          daily = child.amount / node.amount;
          return [child.name, child.label, daily, handleChildren(child, false)];
        });
      };
      return self.setData(handleChildren(data, true));
    };
    this.setIconLookup = function(lookup){
      return self.iconLookup = lookup;
    };
    this.setSalary = function(salary){
      return self.salaryVal = salary;
    };
    this.getTaxVal = function(){
      return this.taxVal = 80000;
    };
    this.draw = function(sliderUpdate){
      var _draw, taxUndef;
      _draw = function(){
        var i, tot, results$ = [];
        self.drawTotals();
        if (self.tiers.length === 0) {
          return self.drawTier(0, sliderUpdate);
        } else {
          i = 0;
          tot = self.tiers.length;
          while (i < tot) {
            self.drawTier(i, sliderUpdate);
            results$.push(i += 1);
          }
          return results$;
        }
      };
      taxUndef = typeof self.taxVal === "undefined" || self.taxVal == null;
      if (taxUndef) {
        self.getTaxVal();
      }
      return _draw();
    };
    this.drawTotals = function(){
      $('#db-salary p').text(this.formatCurrency(self.salaryVal, 0));
      return $('#db-tax p').text(this.formatCurrency(self.taxVal, 0));
    };
    this.drawTier = function(tierId, sliderUpdate){
      var tdAry, tax, data, t, n, w, icons, tpl, valEls, this$ = this;
      tdAry = self.taxAndDataForTier(tierId);
      if (!tdAry) {
        return;
      }
      tax = tdAry[0];
      data = tdAry[1];
      t = self.tiers[tierId] = self.tiers[tierId] || $("<div class='db-tier' data-db-tier='" + tierId + "'></div>").appendTo(self.$e);
      data = data.sort(function(a, b){
        return b[2] - a[2];
      }).slice(0, 10);
      n = data.length;
      w = 100.0 / n;
      icons = _.map(data, function(d){
        return self.iconLookup(d[0]);
      });
      if (!sliderUpdate) {
        tpl = "<div class='db-area-row'>" + "<% _.each(areas, function(area, idx) { %>" + "  <div class='db-area-col db-area-title' style='width: <%= width %>%;' data-db-area='<%= idx %>'>" + "    <h3><%= area[1] %></h3>" + "  </div>" + "<% }); %>" + "</div>" + "<div class='db-area-row'>" + "<% _.each(areas, function(area, idx) { %>" + "  <div class='db-area-col' style='width: <%= width %>%;' data-db-area='<%= idx %>'>" + "    <div class='db-area-icon' data-svg-url='<%= icons[idx] %>'></div>" + "    <div class='db-area-value'></div>" + "  </div>" + "<% }); %>" + "</div>";
        t.html(_.template(tpl, {
          activeArea: self.areas[tierId],
          areas: data,
          width: w,
          icons: icons
        }));
        self.drawIcons(t);
      }
      valEls = t.find(".db-area-value");
      _.each(data, function(area, idx){
        return valEls.eq(idx).text(this$.formatCurrency(tax * area[2], 2));
      });
      return t.show();
    };
    this.taxAndDataForTier = function(tierId){
      var data, tax, areaId, i, tot;
      data = self.data;
      tax = self.taxVal;
      areaId = void 8;
      i = 0;
      tot = tierId;
      while (i < tierId) {
        areaId = self.areas[i];
        if (data[areaId]) {
          tax = tax * data[areaId][2];
          data = data[areaId][3];
        } else {
          return null;
        }
        i += 1;
      }
      return [tax, data];
    };
    this.drawIcons = function(t){
      var iconRad;
      iconRad = 35;
      $(".db-area-icon svg", t).remove();
      return $(".db-area-icon", t).each(function(i, e){
        var iconUrl, paper;
        iconUrl = void 8;
        paper = void 8;
        iconUrl = $(e).data("svg-url");
        paper = Raphael(e, iconRad + iconRad, iconRad + iconRad + 5);
        paper.circle(iconRad, iconRad, iconRad).attr({
          fill: '#830242',
          stroke: "none"
        });
        paper.circle(iconRad, iconRad, iconRad - 2).attr({
          fill: "none",
          stroke: '#eee',
          opacity: 0.8,
          "stroke-dasharray": "- "
        });
        return $.get(iconUrl, function(svg){
          var j, icon, joined, paths;
          if (typeof svg === "string") {
            svg = $(svg);
            svg = svg[svg.length - 1];
          }
          if (!svg.getElementsByTagName) {
            return;
          }
          j = void 8;
          icon = void 8;
          joined = "";
          paths = svg.getElementsByTagName("path");
          j = 0;
          while (j < paths.length) {
            joined += paths[j].getAttribute("d") + " ";
            j++;
          }
          icon = paper.path(joined);
          icon.attr({
            fill: "white",
            stroke: "none"
          });
          return icon.scale(iconRad / 50, iconRad / 50, 0, 0);
        });
      });
    };
    this.init();
    return this;
  };
});var InfoPanel;
InfoPanel = {
  setState: function(s){
    this.state = s;
    if (s === 1) {
      d3.select('#bubble-info-right').transition().duration(750).style('opacity', 0.0);
      d3.select('#bubble-info-right').transition().delay(750).style('display', 'none');
      d3.select('#bubble-info').transition().duration(750).style('width', '360px').style('opacity', 1.0).style('margin-right', '-100px');
      d3.select('#bubble-info').transition().ease(function(){
        return 1;
      }).delay(750).style('position', 'absolute').style('left', '5px').style('margin-left', '0').style('top', '55px').style('z-index', -1);
      d3.select('#bubble-info-close').transition().duration(750).style('opacity', 0.0);
    }
    if (s === 2) {
      d3.select('#bubble-info').style('z-index', -1).transition().duration(475).style('opacity', 0.2);
      d3.select('#bubble-info-right').style('display', 'block');
      d3.select('#bubble-info-right').transition().duration(750).style('opacity', 1.0);
      d3.select('#bubble-info').transition().duration(750).style('width', '994px').style('opacity', 0.2);
      d3.select('#bubble-info-close').transition().duration(750).style('opacity', 1.0).style('margin-right', '0px');
      d3.select('#bubble-info').transition().ease(function(){
        return 1;
      }).delay(750).style('position', 'fixed').style('left', '50%').style('margin-left', '-497px').style('top', '107px').style('z-index', -1);
    }
    if (s === 3) {
      d3.select('#bubble-info').style('z-index', 100).transition().duration(475).style('opacity', 0.9);
      d3.select('#bubble-info-right').style('display', 'block');
      d3.select('#bubble-info-right').transition().duration(750).style('opacity', 1.0);
      d3.select('#bubble-info').transition().duration(750).style('width', '994px').style('opacity', 0.9);
      return d3.select('#bubble-info-close').transition().duration(750).style('opacity', 1.0).style('margin-right', '0px');
    }
  }
};angular.element(document).ready(function(){
  return angular.bootstrap(document, ['app']);
});var blah, showspending;
blah = function(){
  OpenSpending.scriptRoot = '/openspendingjs';
  OpenSpending.localeGroupSeparator = ',';
  OpenSpending.localeDecimalSeparator = '.';
  return showspending(1);
};
showspending = function(type){
  return jQuery.ajax({
    url: '/openspendingjs/widgets/treemap/main.js',
    cache: true,
    dataType: "script"
  }).done(function(){
    var dfd;
    dfd = new OpenSpending.Treemap($('#bubbletree'), {
      dataset: 'twbudget',
      siteUrl: 'http://openspending.org'
    }, {
      drilldowns: ['cat', 'depname']
    });
    return dfd.done(function(){});
  });
};var taiwanPersonalTax;
taiwanPersonalTax = function(salary){
  var baseTaxFree, rawTax;
  baseTaxFree = 82000 + 76000 + 104000;
  salary = salary > baseTaxFree ? salary - baseTaxFree : 0;
  return rawTax = (function(){
    switch (false) {
    case !(salary > 4230000):
      return salary * 0.4 - 774400;
    case !(salary > 2260000):
      return salary * 0.3 - 351400;
    case !(salary > 1130000):
      return salary * 0.2 - 125400;
    case !(salary > 500000):
      return salary * 0.12 - 35000;
    default:
      return salary * 0.05;
    }
  }());
};var mapforyear, dataforyear, dataOverYears, by_year, init_year_data, bar_chart, test_bubble, testd3;
mapforyear = function(year, cb){
  return d3.csv("/data/tw" + year + "ap.csv", function(json){
    var entry, code;
    return cb((function(){
      var i$, ref$, len$, results$ = {};
      for (i$ = 0, len$ = (ref$ = json).length; i$ < len$; ++i$) {
        entry = ref$[i$], code = entry.code;
        results$[code] = entry;
      }
      return results$;
    }()));
  });
};
dataforyear = function(year, cb){
  return d3.csv("/data/tw" + year + "ap.csv", function(json){
    json = d3.nest().key(function(it){
      return it.cat;
    }).key(function(it){
      return it.depname;
    }).map(json);
    return cb({
      key: 'root',
      values: json
    });
  });
};
dataOverYears = function(y2017, y2018){
  var code, entry, ref$, results$ = [];
  for (code in y2018) {
    entry = y2018[code];
    entry.byYear = {
      2018: +entry.amount,
      2017: +((ref$ = y2017[code]) != null ? ref$.amount : void 8)
    };
    if (entry.byYear[2017]) {
      entry.change = (entry.byYear[2018] - entry.byYear[2017]) / entry.byYear[2017];
    }
    if (entry.amount === 'NaN') {
      entry.amount = 0;
    }
    results$.push(entry);
  }
  return results$;
};
by_year = null;
init_year_data = function(cb){
  if (by_year) {
    return cb(by_year);
  }
  by_year = {};
  return mapforyear(2007, function($2007){
    by_year[2007] = $2007;
    return mapforyear(2008, function($2008){
      by_year[2008] = $2008;
      return mapforyear(2009, function($2009){
        by_year[2009] = $2009;
        return mapforyear(2010, function($2010){
          by_year[2010] = $2010;
          return mapforyear(2011, function($2011){
            by_year[2011] = $2011;
            return mapforyear(2012, function($2012){
              by_year[2012] = $2012;
              return mapforyear(2013, function($2013){
                by_year[2013] = $2013;
                return mapforyear(2014, function($2014){
                  by_year[2014] = $2014;
                  return mapforyear(2015, function($2015){
                    by_year[2015] = $2015;
                    return mapforyear(2016, function($2016){
                      by_year[2016] = $2016;
                      return mapforyear(2017, function($2017){
                        by_year[2017] = $2017;
                        return mapforyear(2018, function($2018){
                          by_year[2018] = $2018;
                          return cb(by_year);
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
};
bar_chart = function(id, mode){
  return init_year_data(function(by_year){
    var data, res$, i$, ref$, len$, year, ref1$, ref2$, margin, width, height, x, y, xAxis, yAxis, svg;
    res$ = [];
    for (i$ = 0, len$ = (ref$ = [2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018]).length; i$ < len$; ++i$) {
      year = ref$[i$];
      res$.push({
        year: year,
        amount: +((ref1$ = (ref2$ = by_year[year] && by_year[year][id]) != null ? ref2$.amount : void 8) != null ? ref1$ : 0)
      });
    }
    data = res$;
    margin = {
      top: 10,
      right: 30,
      bottom: 20,
      left: 90
    };
    width = 360 - margin.left - margin.right;
    height = 140 - margin.top - margin.bottom;
    x = d3.scale.ordinal().rangeRoundBands([0, width], 0.1);
    y = d3.scale.linear().range([height, 0]);
    xAxis = d3.svg.axis().scale(x).orient("bottom");
    yAxis = d3.svg.axis().scale(y).orient("left");
    svg = d3.select('#bubble-detail-change-bar' + (mode === 'default' ? '' : '2')).html('').append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    x.domain(data.map(function(it){
      return it.year;
    }));
    y.domain([
      0, d3.max(data, function(it){
        return it.amount / 1000000;
      })
    ]);
    svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call(xAxis);
    svg.append("g").attr("class", "y axis").call(yAxis).append("text").attr("transform", "rotate(-90)").attr("y", -86).attr("dy", ".71em").style("text-anchor", "end").text("金額(百萬元)");
    return svg.selectAll('.bar').data(data).enter().append('rect').attr('class', 'bar').attr('x', function(it){
      return x(it.year);
    }).attr('width', x.rangeBand()).attr('y', function(it){
      return y(it.amount / 1000000);
    }).attr('height', function(it){
      return height - y(it.amount / 1000000);
    });
  });
};
test_bubble = function(){
  var chart, render_vis;
  chart = null;
  render_vis = function(data){
    var x$;
    x$ = chart = new BubbleChart({
      data: data
    });
    x$.do_show_details = function(data, mode){
      return bar_chart(data.id, mode);
    };
    x$.start();
    x$.display_group_all();
    return x$;
  };
  return mapforyear(2017, function(y2017){
    return mapforyear(2018, function(y2018){
      var data;
      data = dataOverYears(y2017, y2018);
      data = data.sort(function(a, b){
        return b.amount - a.amount;
      });
      render_vis(data);
      $('.btn.bycat').click(function(){
        return chart.display_by_attr('cat');
      });
      $('.btn.bytop').click(function(){
        return chart.display_by_attr('topname');
      });
      return $('.btn.default').click(function(){
        return chart.display_group_all();
      });
    });
  });
};
testd3 = function(){
  var cell, width, height, color, treemap, div;
  cell = function(){
    return this.style('left', function(it){
      return it.x + 'px';
    }).style('top', function(it){
      return it.y + 'px';
    }).style('width', function(it){
      return Math.max(0, it.dx - 1) + 'px';
    }).style('height', function(it){
      return Math.max(0, it.dy - 1) + 'px';
    });
  };
  width = 960;
  height = 500;
  color = d3.scale.category20c();
  treemap = d3.layout.treemap().children(function(it){
    return it.values;
  }).size([width, height]).sticky(true).value(function(it){
    return it.change;
  });
  div = d3.select('#bubble-chart').append("div").style('position', 'relative').style('width', width + 'px').style('height', height + 'px');
  return mapforyear(2017, function(y2017){
    return mapforyear(2018, function(y2018){
      var data, json;
      data = dataOverYears(y2017, y2018);
      json = d3.nest().key(function(it){
        return it.cat;
      }).key(function(it){
        return it.depname;
      }).entries(data);
      json = {
        key: 'root',
        values: json
      };
      div.data([json]).selectAll("div").data(treemap.nodes).enter().append("div").attr('class', 'cell').style('background', function(it){
        if (it.values) {
          return null;
        } else {
          return color(it.cat);
        }
      }).call(cell).text(function(it){
        if (it.values) {
          return null;
        } else {
          return it.name;
        }
      });
      d3.select('#y2018').on('click', function(){
        return div.selectAll("div").data(treemap.value(function(it){
          var ref$;
          return (ref$ = it.byYear) != null ? ref$[2018] : void 8;
        })).transition().duration(1500).call(cell);
      });
      return d3.select('#y2017').on('click', function(){
        return div.selectAll("div").data(treemap.value(function(it){
          var ref$;
          return (ref$ = it.byYear) != null ? ref$[2017] : void 8;
        })).transition().duration(1500).call(cell);
      });
    });
  });
};var raw = {"drilldown": [{"depname": "\u6559\u80b2\u90e8", "amount": 341129548000.0, "num_entries": 32, "cat": "\u6559\u80b2\u652f\u51fa"}, {"depname": "\u570b\u9632\u90e8\u6240\u5c6c", "amount": 317123750000.0, "num_entries": 13, "cat": "\u570b\u9632\u652f\u51fa"}, {"depname": "\u570b\u5eab\u7f72", "amount": 129536037000.0, "num_entries": 1, "cat": "\u50b5\u52d9\u4ed8\u606f\u652f\u51fa"}, {"depname": "\u4ea4\u901a\u90e8", "amount": 105917148000.0, "num_entries": 19, "cat": "\u4ea4\u901a\u652f\u51fa"}, {"depname": "\u885b\u751f\u7f72", "amount": 104058397000.0, "num_entries": 6, "cat": "\u793e\u6703\u4fdd\u96aa\u652f\u51fa"}, {"depname": "\u570b\u8ecd\u9000\u9664\u5f79\u5b98\u5175\u8f14\u5c0e\u59d4\u54e1\u6703", "amount": 99454535000.0, "num_entries": 1, "cat": "\u9000\u4f11\u64ab\u5379\u7d66\u4ed8\u652f\u51fa"}, {"depname": "\u52de\u5de5\u59d4\u54e1\u6703", "amount": 85339080000.0, "num_entries": 1, "cat": "\u793e\u6703\u4fdd\u96aa\u652f\u51fa"}, {"depname": "\u5167\u653f\u90e8", "amount": 83117319000.0, "num_entries": 1, "cat": "\u793e\u6703\u4fdd\u96aa\u652f\u51fa"}, {"depname": "\u516c\u8def\u7e3d\u5c40\u53ca\u6240\u5c6c", "amount": 80347799000.0, "num_entries": 7, "cat": "\u4ea4\u901a\u652f\u51fa"}, {"depname": "\u570b\u5bb6\u79d1\u5b78\u59d4\u54e1\u6703", "amount": 74637193000.0, "num_entries": 6, "cat": "\u79d1\u5b78\u652f\u51fa"}, {"depname": "\u88dc\u52a9\u76f4\u8f44\u5e02\u53ca\u7e23\u5e02\u653f\u5e9c", "amount": 59191950000.0, "num_entries": 1, "cat": "\u6559\u80b2\u652f\u51fa"}, {"depname": "\u8fb2\u696d\u59d4\u54e1\u6703", "amount": 51147450000.0, "num_entries": 1, "cat": "\u798f\u5229\u670d\u52d9\u652f\u51fa"}, {"depname": "\u8fb2\u696d\u59d4\u54e1\u6703", "amount": 44619909000.0, "num_entries": 6, "cat": "\u8fb2\u696d\u652f\u51fa"}, {"depname": "\u6c34\u5229\u7f72\u53ca\u6240\u5c6c", "amount": 30902488000.0, "num_entries": 7, "cat": "\u8fb2\u696d\u652f\u51fa"}, {"depname": "\u5916\u4ea4\u90e8", "amount": 27597715000.0, "num_entries": 13, "cat": "\u5916\u4ea4\u652f\u51fa"}, {"depname": "\u88dc\u52a9\u76f4\u8f44\u5e02\u53ca\u7e23\u5e02\u653f\u5e9c", "amount": 26004639000.0, "num_entries": 1, "cat": "\u798f\u5229\u670d\u52d9\u652f\u51fa"}, {"depname": "\u88dc\u52a9\u76f4\u8f44\u5e02\u53ca\u7e23\u5e02\u653f\u5e9c", "amount": 25353317000.0, "num_entries": 1, "cat": "\u5c08\u6848\u88dc\u52a9\u652f\u51fa"}, {"depname": "\u4e2d\u592e\u7814\u7a76\u9662", "amount": 24801163000.0, "num_entries": 12, "cat": "\u79d1\u5b78\u652f\u51fa"}, {"depname": "\u88dc\u52a9\u76f4\u8f44\u5e02\u53ca\u7e23\u5e02\u653f\u5e9c", "amount": 23500000000.0, "num_entries": 1, "cat": "\u5176\u4ed6\u7d93\u6fdf\u670d\u52d9\u652f\u51fa"}, {"depname": "\u76f4\u8f44\u5e02\u8207\u7e23\u5e02\u5e73\u8861\u9810\u7b97\u53ca\u7e73\u6b3e\u5c08\u6848\u88dc\u52a9", "amount": 21900000000.0, "num_entries": 1, "cat": "\u5e73\u8861\u9810\u7b97\u88dc\u52a9\u652f\u51fa"}, {"depname": "\u9293\u6558\u90e8", "amount": 21101746000.0, "num_entries": 1, "cat": "\u9000\u4f11\u64ab\u5379\u7d66\u4ed8\u652f\u51fa"}, {"depname": "\u8b66\u653f\u7f72\u53ca\u6240\u5c6c", "amount": 20999643000.0, "num_entries": 12, "cat": "\u6c11\u653f\u652f\u51fa"}, {"depname": "\u570b\u8ecd\u9000\u9664\u5f79\u5b98\u5175\u8f14\u5c0e\u59d4\u54e1\u6703", "amount": 20262721000.0, "num_entries": 11, "cat": "\u798f\u5229\u670d\u52d9\u652f\u51fa"}, {"depname": "\u7d93\u6fdf\u90e8", "amount": 19440345000.0, "num_entries": 4, "cat": "\u79d1\u5b78\u652f\u51fa"}, {"depname": "\u8ca1\u653f\u90e8", "amount": 19263637000.0, "num_entries": 1, "cat": "\u793e\u6703\u4fdd\u96aa\u652f\u51fa"}, {"depname": "\u6587\u5316\u5efa\u8a2d\u59d4\u54e1\u6703\u53ca\u6240\u5c6c", "amount": 19179464000.0, "num_entries": 31, "cat": "\u6587\u5316\u652f\u51fa"}, {"depname": "\u76f4\u8f44\u5e02\u53ca\u7e23\u5e02\u4fdd\u969c\u8ca1\u6e90\u88dc\u52a9", "amount": 16387044000.0, "num_entries": 1, "cat": "\u5c08\u6848\u88dc\u52a9\u652f\u51fa"}, {"depname": "\u6559\u80b2\u90e8", "amount": 15890647000.0, "num_entries": 1, "cat": "\u9000\u4f11\u64ab\u5379\u7d66\u4ed8\u652f\u51fa"}, {"depname": "\u88dc\u52a9\u76f4\u8f44\u5e02\u53ca\u7e23\u5e02\u653f\u5e9c", "amount": 14526083000.0, "num_entries": 1, "cat": "\u793e\u6703\u4fdd\u96aa\u652f\u51fa"}, {"depname": "\u88dc\u52a9\u76f4\u8f44\u5e02\u53ca\u7e23\u5e02\u653f\u5e9c", "amount": 12500000000.0, "num_entries": 1, "cat": "\u4ea4\u901a\u652f\u51fa"}, {"depname": "\u76f4\u8f44\u5e02\u8207\u7e23\u5e02\u5e73\u8861\u9810\u7b97\u53ca\u7e73\u6b3e\u5c08\u6848\u88dc\u52a9", "amount": 12100000000.0, "num_entries": 1, "cat": "\u5c08\u6848\u88dc\u52a9\u652f\u51fa"}, {"depname": "\u77ef\u6b63\u7f72\u53ca\u6240\u5c6c", "amount": 11653014000.0, "num_entries": 6, "cat": "\u53f8\u6cd5\u652f\u51fa"}, {"depname": "\u570b\u8ecd\u9000\u9664\u5f79\u5b98\u5175\u8f14\u5c0e\u59d4\u54e1\u6703", "amount": 11395250000.0, "num_entries": 1, "cat": "\u793e\u6703\u4fdd\u96aa\u652f\u51fa"}, {"depname": "\u71df\u5efa\u7f72\u53ca\u6240\u5c6c", "amount": 11217096000.0, "num_entries": 1, "cat": "\u74b0\u5883\u4fdd\u8b77\u652f\u51fa"}, {"depname": "\u5152\u7ae5\u5c40", "amount": 9902200000.0, "num_entries": 5, "cat": "\u798f\u5229\u670d\u52d9\u652f\u51fa"}, {"depname": "\u8ca1\u653f\u90e8", "amount": 9674552000.0, "num_entries": 8, "cat": "\u5176\u4ed6\u7d93\u6fdf\u670d\u52d9\u652f\u51fa"}, {"depname": "\u885b\u751f\u7f72", "amount": 9627311000.0, "num_entries": 14, "cat": "\u91ab\u7642\u4fdd\u5065\u652f\u51fa"}, {"depname": "\u71df\u5efa\u7f72\u53ca\u6240\u5c6c", "amount": 9352196000.0, "num_entries": 4, "cat": "\u5de5\u696d\u652f\u51fa"}, {"depname": "\u7d93\u6fdf\u5efa\u8a2d\u59d4\u54e1\u6703", "amount": 9078811000.0, "num_entries": 17, "cat": "\u5176\u4ed6\u7d93\u6fdf\u670d\u52d9\u652f\u51fa"}, {"depname": "\u74b0\u5883\u4fdd\u8b77\u7f72", "amount": 9042872000.0, "num_entries": 14, "cat": "\u74b0\u5883\u4fdd\u8b77\u652f\u51fa"}, {"depname": "\u71df\u5efa\u7f72\u53ca\u6240\u5c6c", "amount": 9027115000.0, "num_entries": 1, "cat": "\u4ea4\u901a\u652f\u51fa"}, {"depname": "\u6797\u52d9\u5c40", "amount": 8505823000.0, "num_entries": 7, "cat": "\u8fb2\u696d\u652f\u51fa"}, {"depname": "\u8ce6\u7a05\u7f72", "amount": 8488337000.0, "num_entries": 4, "cat": "\u8ca1\u52d9\u652f\u51fa"}, {"depname": "\u570b\u5eab\u7f72", "amount": 8458400000.0, "num_entries": 1, "cat": "\u5c08\u6848\u88dc\u52a9\u652f\u51fa"}, {"depname": "\u7b2c\u4e8c\u9810\u5099\u91d1", "amount": 8000000000.0, "num_entries": 1, "cat": "\u7b2c\u4e8c\u9810\u5099\u91d1"}, {"depname": "\u9ad4\u80b2\u59d4\u54e1\u6703", "amount": 7855931000.0, "num_entries": 8, "cat": "\u6587\u5316\u652f\u51fa"}, {"depname": "\u65b0\u805e\u5c40", "amount": 7724792000.0, "num_entries": 16, "cat": "\u6587\u5316\u652f\u51fa"}, {"depname": "\u5167\u653f\u90e8", "amount": 7550658000.0, "num_entries": 2, "cat": "\u798f\u5229\u670d\u52d9\u652f\u51fa"}, {"depname": "\u6d77\u5cb8\u5de1\u9632\u7e3d\u5c40\u53ca\u6240\u5c6c", "amount": 7321084000.0, "num_entries": 7, "cat": "\u6c11\u653f\u652f\u51fa"}, {"depname": "\u6d77\u6d0b\u5de1\u9632\u7e3d\u5c40", "amount": 6618996000.0, "num_entries": 5, "cat": "\u6c11\u653f\u652f\u51fa"}, {"depname": "\u6559\u80b2\u90e8", "amount": 6483068000.0, "num_entries": 7, "cat": "\u6587\u5316\u652f\u51fa"}, {"depname": "\u88dc\u52a9\u76f4\u8f44\u5e02\u53ca\u7e23\u5e02\u653f\u5e9c", "amount": 6343855000.0, "num_entries": 1, "cat": "\u793e\u6703\u6551\u52a9\u652f\u51fa"}, {"depname": "\u95dc\u7a05\u7e3d\u5c40\u53ca\u6240\u5c6c", "amount": 6318063000.0, "num_entries": 6, "cat": "\u8ca1\u52d9\u652f\u51fa"}, {"depname": "\u4e2d\u5c0f\u4f01\u696d\u8655", "amount": 6199201000.0, "num_entries": 3, "cat": "\u5176\u4ed6\u7d93\u6fdf\u670d\u52d9\u652f\u51fa"}, {"depname": "\u5de5\u696d\u5c40", "amount": 5945820000.0, "num_entries": 1, "cat": "\u79d1\u5b78\u652f\u51fa"}, {"depname": "\u8ce6\u7a05\u7f72", "amount": 5791730000.0, "num_entries": 1, "cat": "\u5c08\u6848\u88dc\u52a9\u652f\u51fa"}, {"depname": "\u885b\u751f\u7f72", "amount": 5766128000.0, "num_entries": 3, "cat": "\u79d1\u5b78\u652f\u51fa"}, {"depname": "\u7acb\u6cd5\u9662", "amount": 5587618000.0, "num_entries": 17, "cat": "\u7acb\u6cd5\u652f\u51fa"}, {"depname": "\u8abf\u67e5\u5c40", "amount": 5533205000.0, "num_entries": 8, "cat": "\u53f8\u6cd5\u652f\u51fa"}, {"depname": "\u4e2d\u592e\u5065\u5eb7\u4fdd\u96aa\u5c40", "amount": 5485085000.0, "num_entries": 3, "cat": "\u793e\u6703\u4fdd\u96aa\u652f\u51fa"}, {"depname": "\u75be\u75c5\u7ba1\u5236\u5c40", "amount": 5267132000.0, "num_entries": 3, "cat": "\u91ab\u7642\u4fdd\u5065\u652f\u51fa"}, {"depname": "\u6f01\u696d\u7f72\u53ca\u6240\u5c6c", "amount": 4871588000.0, "num_entries": 6, "cat": "\u8fb2\u696d\u652f\u51fa"}, {"depname": "\u5165\u51fa\u570b\u53ca\u79fb\u6c11\u7f72", "amount": 4339151000.0, "num_entries": 5, "cat": "\u6c11\u653f\u652f\u51fa"}, {"depname": "\u5f79\u653f\u7f72", "amount": 4232066000.0, "num_entries": 3, "cat": "\u6c11\u653f\u652f\u51fa"}, {"depname": "\u5167\u653f\u90e8", "amount": 4058006000.0, "num_entries": 11, "cat": "\u6c11\u653f\u652f\u51fa"}, {"depname": "\u539f\u4f4f\u6c11\u65cf\u59d4\u54e1\u6703", "amount": 3976972000.0, "num_entries": 8, "cat": "\u6c11\u653f\u652f\u51fa"}, {"depname": "\u570b\u969b\u8cbf\u6613\u5c40\u53ca\u6240\u5c6c", "amount": 3714431000.0, "num_entries": 5, "cat": "\u5176\u4ed6\u7d93\u6fdf\u670d\u52d9\u652f\u51fa"}, {"depname": "\u570b\u9632\u90e8\u6240\u5c6c", "amount": 3641074000.0, "num_entries": 2, "cat": "\u79d1\u5b78\u652f\u51fa"}, {"depname": "\u71df\u5efa\u7f72\u53ca\u6240\u5c6c", "amount": 3640925000.0, "num_entries": 10, "cat": "\u8fb2\u696d\u652f\u51fa"}, {"depname": "\u7d93\u6fdf\u90e8", "amount": 3627510000.0, "num_entries": 17, "cat": "\u5176\u4ed6\u7d93\u6fdf\u670d\u52d9\u652f\u51fa"}, {"depname": "\u89c0\u5149\u5c40\u53ca\u6240\u5c6c", "amount": 3390043000.0, "num_entries": 4, "cat": "\u5176\u4ed6\u7d93\u6fdf\u670d\u52d9\u652f\u51fa"}, {"depname": "\u6838\u80fd\u7814\u7a76\u6240", "amount": 3376622000.0, "num_entries": 10, "cat": "\u79d1\u5b78\u652f\u51fa"}, {"depname": "\u8077\u696d\u8a13\u7df4\u5c40\u53ca\u6240\u5c6c", "amount": 3369379000.0, "num_entries": 21, "cat": "\u570b\u6c11\u5c31\u696d\u652f\u51fa"}, {"depname": "\u570b\u6c11\u5065\u5eb7\u5c40", "amount": 3179261000.0, "num_entries": 4, "cat": "\u91ab\u7642\u4fdd\u5065\u652f\u51fa"}, {"depname": "\u81fa\u7063\u7701\u5317\u5340\u570b\u7a05\u5c40\u53ca\u6240\u5c6c", "amount": 3031911000.0, "num_entries": 6, "cat": "\u8ca1\u52d9\u652f\u51fa"}, {"depname": "\u5ba2\u5bb6\u59d4\u54e1\u6703\u53ca\u6240\u5c6c", "amount": 3002188000.0, "num_entries": 4, "cat": "\u6587\u5316\u652f\u51fa"}, {"depname": "\u6c34\u571f\u4fdd\u6301\u5c40", "amount": 2979447000.0, "num_entries": 3, "cat": "\u8fb2\u696d\u652f\u51fa"}, {"depname": "\u8ca1\u7a05\u8cc7\u6599\u4e2d\u5fc3", "amount": 2577548000.0, "num_entries": 6, "cat": "\u8ca1\u52d9\u652f\u51fa"}, {"depname": "\u81fa\u5317\u5e02\u570b\u7a05\u5c40", "amount": 2564827000.0, "num_entries": 3, "cat": "\u8ca1\u52d9\u652f\u51fa"}, {"depname": "\u89c0\u5149\u5c40\u53ca\u6240\u5c6c", "amount": 2446808000.0, "num_entries": 2, "cat": "\u4ea4\u901a\u652f\u51fa"}, {"depname": "\u52de\u5de5\u59d4\u54e1\u6703", "amount": 2369550000.0, "num_entries": 12, "cat": "\u798f\u5229\u670d\u52d9\u652f\u51fa"}, {"depname": "\u6d88\u9632\u7f72\u53ca\u6240\u5c6c", "amount": 2353561000.0, "num_entries": 4, "cat": "\u6c11\u653f\u652f\u51fa"}, {"depname": "\u539f\u4f4f\u6c11\u65cf\u59d4\u54e1\u6703", "amount": 2349542000.0, "num_entries": 2, "cat": "\u793e\u6703\u6551\u52a9\u652f\u51fa"}, {"depname": "\u81fa\u7063\u7701\u4e2d\u5340\u570b\u7a05\u5c40\u53ca\u6240\u5c6c", "amount": 2306023000.0, "num_entries": 6, "cat": "\u8ca1\u52d9\u652f\u51fa"}, {"depname": "\u4eba\u4e8b\u884c\u653f\u5c40", "amount": 2091924000.0, "num_entries": 1, "cat": "\u5176\u4ed6\u652f\u51fa"}, {"depname": "\u52d5\u690d\u7269\u9632\u75ab\u6aa2\u75ab\u5c40\u53ca\u6240\u5c6c", "amount": 2058856000.0, "num_entries": 6, "cat": "\u8fb2\u696d\u652f\u51fa"}, {"depname": "\u4e2d\u592e\u6c23\u8c61\u5c40", "amount": 2001496000.0, "num_entries": 5, "cat": "\u79d1\u5b78\u652f\u51fa"}, {"depname": "\u707d\u5bb3\u6e96\u5099\u91d1", "amount": 2000000000.0, "num_entries": 1, "cat": "\u5176\u4ed6\u652f\u51fa"}, {"depname": "\u570b\u9632\u90e8\u6240\u5c6c", "amount": 1908820000.0, "num_entries": 1, "cat": "\u5176\u4ed6\u652f\u51fa"}, {"depname": "\u8fb2\u7ce7\u7f72\u53ca\u6240\u5c6c", "amount": 1889428000.0, "num_entries": 5, "cat": "\u8fb2\u696d\u652f\u51fa"}, {"depname": "\u6a19\u6e96\u6aa2\u9a57\u5c40\u53ca\u6240\u5c6c", "amount": 1852437000.0, "num_entries": 3, "cat": "\u5176\u4ed6\u7d93\u6fdf\u670d\u52d9\u652f\u51fa"}, {"depname": "\u570b\u6709\u8ca1\u7522\u5c40\u53ca\u6240\u5c6c", "amount": 1812584000.0, "num_entries": 6, "cat": "\u8ca1\u52d9\u652f\u51fa"}, {"depname": "\u81fa\u7063\u7701\u5357\u5340\u570b\u7a05\u5c40\u53ca\u6240\u5c6c", "amount": 1808735000.0, "num_entries": 5, "cat": "\u8ca1\u52d9\u652f\u51fa"}, {"depname": "\u4e2d\u592e\u9078\u8209\u59d4\u54e1\u6703\u53ca\u6240\u5c6c", "amount": 1795559000.0, "num_entries": 8, "cat": "\u6c11\u653f\u652f\u51fa"}, {"depname": "\u5167\u653f\u90e8", "amount": 1793676000.0, "num_entries": 1, "cat": "\u793e\u6703\u6551\u52a9\u652f\u51fa"}, {"depname": "\u81fa\u7063\u9ad8\u7b49\u6cd5\u9662", "amount": 1644412000.0, "num_entries": 7, "cat": "\u53f8\u6cd5\u652f\u51fa"}, {"depname": "\u50d1\u52d9\u59d4\u54e1\u6703", "amount": 1639990000.0, "num_entries": 11, "cat": "\u50d1\u52d9\u652f\u51fa"}, {"depname": "\u81fa\u7063\u9ad8\u96c4\u5730\u65b9\u6cd5\u9662", "amount": 1630521000.0, "num_entries": 8, "cat": "\u53f8\u6cd5\u652f\u51fa"}, {"depname": "\u9ad8\u96c4\u5e02\u570b\u7a05\u5c40", "amount": 1593115000.0, "num_entries": 5, "cat": "\u8ca1\u52d9\u652f\u51fa"}, {"depname": "\u81fa\u7063\u81fa\u5317\u5730\u65b9\u6cd5\u9662", "amount": 1579171000.0, "num_entries": 8, "cat": "\u53f8\u6cd5\u652f\u51fa"}, {"depname": "\u98df\u54c1\u85e5\u7269\u7ba1\u7406\u5c40", "amount": 1559037000.0, "num_entries": 3, "cat": "\u91ab\u7642\u4fdd\u5065\u652f\u51fa"}, {"depname": "\u4e2d\u90e8\u79d1\u5b78\u5de5\u696d\u5712\u5340\u7ba1\u7406\u5c40\u53ca\u6240\u5c6c", "amount": 1439858000.0, "num_entries": 11, "cat": "\u79d1\u5b78\u652f\u51fa"}, {"depname": "\u884c\u653f\u57f7\u884c\u7f72\u53ca\u6240\u5c6c", "amount": 1439380000.0, "num_entries": 7, "cat": "\u53f8\u6cd5\u652f\u51fa"}, {"depname": "\u4e3b\u8a08\u8655", "amount": 1381207000.0, "num_entries": 21, "cat": "\u884c\u653f\u652f\u51fa"}, {"depname": "\u570b\u9632\u90e8\u6240\u5c6c", "amount": 1346000000.0, "num_entries": 1, "cat": "\u9000\u4f11\u64ab\u5379\u7d66\u4ed8\u652f\u51fa"}, {"depname": "\u667a\u6167\u8ca1\u7522\u5c40", "amount": 1320553000.0, "num_entries": 3, "cat": "\u5176\u4ed6\u7d93\u6fdf\u670d\u52d9\u652f\u51fa"}, {"depname": "\u5357\u90e8\u79d1\u5b78\u5de5\u696d\u5712\u5340\u7ba1\u7406\u5c40\u53ca\u6240\u5c6c", "amount": 1294200000.0, "num_entries": 12, "cat": "\u79d1\u5b78\u652f\u51fa"}, {"depname": "\u81fa\u7063\u81fa\u4e2d\u5730\u65b9\u6cd5\u9662", "amount": 1276196000.0, "num_entries": 8, "cat": "\u53f8\u6cd5\u652f\u51fa"}, {"depname": "\u7a7a\u4e2d\u52e4\u52d9\u7e3d\u968a", "amount": 1273632000.0, "num_entries": 6, "cat": "\u6c11\u653f\u652f\u51fa"}, {"depname": "\u4e2d\u592e\u8b66\u5bdf\u5927\u5b78", "amount": 1256110000.0, "num_entries": 5, "cat": "\u6c11\u653f\u652f\u51fa"}, {"depname": "\u539f\u4f4f\u6c11\u65cf\u59d4\u54e1\u6703", "amount": 1245593000.0, "num_entries": 1, "cat": "\u6559\u80b2\u652f\u51fa"}, {"depname": "\u79d1\u5b78\u5de5\u696d\u5712\u5340\u7ba1\u7406\u5c40\u53ca\u6240\u5c6c", "amount": 1243510000.0, "num_entries": 10, "cat": "\u79d1\u5b78\u652f\u51fa"}, {"depname": "\u81fa\u7063\u677f\u6a4b\u5730\u65b9\u6cd5\u9662", "amount": 1197614000.0, "num_entries": 8, "cat": "\u53f8\u6cd5\u652f\u51fa"}, {"depname": "\u570b\u8ecd\u9000\u9664\u5f79\u5b98\u5175\u8f14\u5c0e\u59d4\u54e1\u6703", "amount": 1192791000.0, "num_entries": 2, "cat": "\u6559\u80b2\u652f\u51fa"}, {"depname": "\u7814\u7a76\u767c\u5c55\u8003\u6838\u59d4\u54e1\u6703", "amount": 1175333000.0, "num_entries": 13, "cat": "\u884c\u653f\u652f\u51fa"}, {"depname": "\u81fa\u7063\u9ad8\u96c4\u5730\u65b9\u6cd5\u9662\u6aa2\u5bdf\u7f72", "amount": 1165105000.0, "num_entries": 6, "cat": "\u53f8\u6cd5\u652f\u51fa"}, {"depname": "\u5927\u9678\u59d4\u54e1\u6703", "amount": 1133540000.0, "num_entries": 9, "cat": "\u884c\u653f\u652f\u51fa"}, {"depname": "\u884c\u653f\u9662", "amount": 1101497000.0, "num_entries": 19, "cat": "\u884c\u653f\u652f\u51fa"}, {"depname": "\u5be9\u8a08\u90e8", "amount": 1065200000.0, "num_entries": 7, "cat": "\u76e3\u5bdf\u652f\u51fa"}, {"depname": "\u7e3d\u7d71\u5e9c", "amount": 1064159000.0, "num_entries": 11, "cat": "\u570b\u52d9\u652f\u51fa"}, {"depname": "\u570b\u7acb\u6545\u5bae\u535a\u7269\u9662", "amount": 1058043000.0, "num_entries": 11, "cat": "\u6587\u5316\u652f\u51fa"}, {"depname": "\u79d1\u5b78\u5de5\u696d\u5712\u5340\u7ba1\u7406\u5c40\u53ca\u6240\u5c6c", "amount": 1057662000.0, "num_entries": 4, "cat": "\u6559\u80b2\u652f\u51fa"}, {"depname": "\u6cd5\u52d9\u90e8", "amount": 1038257000.0, "num_entries": 6, "cat": "\u53f8\u6cd5\u652f\u51fa"}, {"depname": "\u53f8\u6cd5\u9662", "amount": 1014112000.0, "num_entries": 11, "cat": "\u53f8\u6cd5\u652f\u51fa"}, {"depname": "\u81fa\u7063\u81fa\u5357\u5730\u65b9\u6cd5\u9662", "amount": 955590000.0, "num_entries": 9, "cat": "\u53f8\u6cd5\u652f\u51fa"}, {"depname": "\u9818\u4e8b\u4e8b\u52d9\u5c40", "amount": 941290000.0, "num_entries": 5, "cat": "\u5916\u4ea4\u652f\u51fa"}, {"depname": "\u53f8\u6cd5\u9662", "amount": 925694000.0, "num_entries": 1, "cat": "\u798f\u5229\u670d\u52d9\u652f\u51fa"}, {"depname": "\u81fa\u7063\u6843\u5712\u5730\u65b9\u6cd5\u9662", "amount": 914825000.0, "num_entries": 9, "cat": "\u53f8\u6cd5\u652f\u51fa"}, {"depname": "\u570b\u9632\u90e8\u6240\u5c6c", "amount": 913826000.0, "num_entries": 1, "cat": "\u74b0\u5883\u4fdd\u8b77\u652f\u51fa"}, {"depname": "\u570b\u9632\u90e8", "amount": 908891000.0, "num_entries": 4, "cat": "\u570b\u9632\u652f\u51fa"}, {"depname": "\u81fa\u7063\u81fa\u5317\u5730\u65b9\u6cd5\u9662\u6aa2\u5bdf\u7f72", "amount": 882308000.0, "num_entries": 3, "cat": "\u53f8\u6cd5\u652f\u51fa"}, {"depname": "\u4e2d\u592e\u6c23\u8c61\u5c40", "amount": 870054000.0, "num_entries": 5, "cat": "\u5176\u4ed6\u7d93\u6fdf\u670d\u52d9\u652f\u51fa"}, {"depname": "\u9752\u5e74\u8f14\u5c0e\u59d4\u54e1\u6703\u53ca\u6240\u5c6c", "amount": 810483000.0, "num_entries": 10, "cat": "\u570b\u6c11\u5c31\u696d\u652f\u51fa"}, {"depname": "\u76e3\u5bdf\u9662", "amount": 805611000.0, "num_entries": 9, "cat": "\u76e3\u5bdf\u652f\u51fa"}, {"depname": "\u6d77\u5cb8\u5de1\u9632\u7f72", "amount": 805410000.0, "num_entries": 3, "cat": "\u6c11\u653f\u652f\u51fa"}, {"depname": "\u81fa\u7063\u6843\u5712\u5730\u65b9\u6cd5\u9662\u6aa2\u5bdf\u7f72", "amount": 780051000.0, "num_entries": 6, "cat": "\u53f8\u6cd5\u652f\u51fa"}, {"depname": "\u81fa\u7063\u9ad8\u7b49\u6cd5\u9662\u6aa2\u5bdf\u7f72", "amount": 774374000.0, "num_entries": 3, "cat": "\u53f8\u6cd5\u652f\u51fa"}, {"depname": "\u570b\u8ecd\u9000\u9664\u5f79\u5b98\u5175\u8f14\u5c0e\u59d4\u54e1\u6703", "amount": 748540000.0, "num_entries": 1, "cat": "\u793e\u6703\u6551\u52a9\u652f\u51fa"}, {"depname": "\u81fa\u5317\u9ad8\u7b49\u884c\u653f\u6cd5\u9662", "amount": 726320000.0, "num_entries": 6, "cat": "\u53f8\u6cd5\u652f\u51fa"}, {"depname": "\u570b\u5eab\u7f72", "amount": 725042000.0, "num_entries": 3, "cat": "\u8ca1\u52d9\u652f\u51fa"}, {"depname": "\u81fa\u7063\u81fa\u4e2d\u5730\u65b9\u6cd5\u9662\u6aa2\u5bdf\u7f72", "amount": 715388000.0, "num_entries": 5, "cat": "\u53f8\u6cd5\u652f\u51fa"}, {"depname": "\u570b\u5bb6\u6559\u80b2\u7814\u7a76\u9662", "amount": 710558000.0, "num_entries": 4, "cat": "\u6559\u80b2\u652f\u51fa"}, {"depname": "\u81fa\u7063\u58eb\u6797\u5730\u65b9\u6cd5\u9662", "amount": 694506000.0, "num_entries": 8, "cat": "\u53f8\u6cd5\u652f\u51fa"}, {"depname": "\u4eba\u4e8b\u884c\u653f\u5c40", "amount": 693995000.0, "num_entries": 11, "cat": "\u884c\u653f\u652f\u51fa"}, {"depname": "\u539f\u5b50\u80fd\u59d4\u54e1\u6703", "amount": 680929000.0, "num_entries": 7, "cat": "\u79d1\u5b78\u652f\u51fa"}, {"depname": "\u98df\u54c1\u85e5\u7269\u7ba1\u7406\u5c40", "amount": 678252000.0, "num_entries": 1, "cat": "\u79d1\u5b78\u652f\u51fa"}, {"depname": "\u81fa\u7063\u5f70\u5316\u5730\u65b9\u6cd5\u9662", "amount": 677664000.0, "num_entries": 9, "cat": "\u53f8\u6cd5\u652f\u51fa"}, {"depname": "\u81fa\u7063\u677f\u6a4b\u5730\u65b9\u6cd5\u9662\u6aa2\u5bdf\u7f72", "amount": 674007000.0, "num_entries": 3, "cat": "\u53f8\u6cd5\u652f\u51fa"}, {"depname": "\u8fb2\u696d\u59d4\u54e1\u6703", "amount": 672366000.0, "num_entries": 1, "cat": "\u79d1\u5b78\u652f\u51fa"}, {"depname": "\u53f8\u6cd5\u4eba\u54e1\u7814\u7fd2\u6240", "amount": 668113000.0, "num_entries": 6, "cat": "\u53f8\u6cd5\u652f\u51fa"}, {"depname": "\u81fa\u7063\u9ad8\u7b49\u6cd5\u9662\u81fa\u4e2d\u5206\u9662", "amount": 633426000.0, "num_entries": 5, "cat": "\u53f8\u6cd5\u652f\u51fa"}, {"depname": "\u52de\u5de5\u5b89\u5168\u885b\u751f\u7814\u7a76\u6240", "amount": 622122000.0, "num_entries": 10, "cat": "\u79d1\u5b78\u652f\u51fa"}, {"depname": "\u4e2d\u5c0f\u4f01\u696d\u8655", "amount": 603649000.0, "num_entries": 1, "cat": "\u79d1\u5b78\u652f\u51fa"}, {"depname": "\u570b\u5bb6\u901a\u8a0a\u50b3\u64ad\u59d4\u54e1\u6703", "amount": 597428000.0, "num_entries": 2, "cat": "\u4ea4\u901a\u652f\u51fa"}, {"depname": "\u6797\u696d\u8a66\u9a57\u6240", "amount": 588293000.0, "num_entries": 5, "cat": "\u8fb2\u696d\u652f\u51fa"}, {"depname": "\u6700\u9ad8\u6cd5\u9662", "amount": 587276000.0, "num_entries": 5, "cat": "\u53f8\u6cd5\u652f\u51fa"}, {"depname": "\u8fb2\u696d\u8a66\u9a57\u6240", "amount": 580735000.0, "num_entries": 5, "cat": "\u8fb2\u696d\u652f\u51fa"}, {"depname": "\u570b\u5eab\u7f72", "amount": 567963000.0, "num_entries": 1, "cat": "\u9084\u672c\u4ed8\u606f\u4e8b\u52d9\u652f\u51fa"}, {"depname": "\u5de5\u696d\u5c40", "amount": 535416000.0, "num_entries": 3, "cat": "\u5de5\u696d\u652f\u51fa"}, {"depname": "\u81fa\u7063\u65b0\u7af9\u5730\u65b9\u6cd5\u9662", "amount": 535003000.0, "num_entries": 9, "cat": "\u53f8\u6cd5\u652f\u51fa"}, {"depname": "\u516c\u5171\u5de5\u7a0b\u59d4\u54e1\u6703", "amount": 525124000.0, "num_entries": 5, "cat": "\u884c\u653f\u652f\u51fa"}, {"depname": "\u95dc\u7a05\u7e3d\u5c40\u53ca\u6240\u5c6c", "amount": 522083000.0, "num_entries": 1, "cat": "\u5176\u4ed6\u7d93\u6fdf\u670d\u52d9\u652f\u51fa"}, {"depname": "\u50d1\u52d9\u59d4\u54e1\u6703", "amount": 519974000.0, "num_entries": 3, "cat": "\u6559\u80b2\u652f\u51fa"}, {"depname": "\u570b\u5bb6\u5716\u66f8\u9928", "amount": 519238000.0, "num_entries": 9, "cat": "\u6587\u5316\u652f\u51fa"}, {"depname": "\u81fa\u7063\u5c4f\u6771\u5730\u65b9\u6cd5\u9662", "amount": 510194000.0, "num_entries": 9, "cat": "\u53f8\u6cd5\u652f\u51fa"}, {"depname": "\u52a0\u5de5\u51fa\u53e3\u5340\u7ba1\u7406\u8655\u53ca\u6240\u5c6c", "amount": 490449000.0, "num_entries": 6, "cat": "\u5de5\u696d\u652f\u51fa"}, {"depname": "\u6a19\u6e96\u6aa2\u9a57\u5c40\u53ca\u6240\u5c6c", "amount": 485686000.0, "num_entries": 2, "cat": "\u79d1\u5b78\u652f\u51fa"}, {"depname": "\u65b0\u805e\u5c40", "amount": 482110000.0, "num_entries": 5, "cat": "\u5916\u4ea4\u652f\u51fa"}, {"depname": "\u8ca1\u653f\u90e8", "amount": 476764000.0, "num_entries": 3, "cat": "\u8ca1\u52d9\u652f\u51fa"}, {"depname": "\u81fa\u7063\u81fa\u5357\u5730\u65b9\u6cd5\u9662\u6aa2\u5bdf\u7f72", "amount": 474787000.0, "num_entries": 5, "cat": "\u53f8\u6cd5\u652f\u51fa"}, {"depname": "\u81fa\u7063\u9ad8\u7b49\u6cd5\u9662\u9ad8\u96c4\u5206\u9662", "amount": 459398000.0, "num_entries": 5, "cat": "\u53f8\u6cd5\u652f\u51fa"}, {"depname": "\u5efa\u7bc9\u7814\u7a76\u6240", "amount": 453470000.0, "num_entries": 3, "cat": "\u79d1\u5b78\u652f\u51fa"}, {"depname": "\u81fa\u7063\u65b0\u7af9\u5730\u65b9\u6cd5\u9662\u6aa2\u5bdf\u7f72", "amount": 453204000.0, "num_entries": 4, "cat": "\u53f8\u6cd5\u652f\u51fa"}, {"depname": "\u81fa\u7063\u5609\u7fa9\u5730\u65b9\u6cd5\u9662", "amount": 447759000.0, "num_entries": 8, "cat": "\u53f8\u6cd5\u652f\u51fa"}, {"depname": "\u8fb2\u696d\u8a66\u9a57\u6240", "amount": 439968000.0, "num_entries": 1, "cat": "\u79d1\u5b78\u652f\u51fa"}, {"depname": "\u755c\u7522\u8a66\u9a57\u6240", "amount": 426526000.0, "num_entries": 4, "cat": "\u8fb2\u696d\u652f\u51fa"}, {"depname": "\u516c\u5e73\u4ea4\u6613\u59d4\u54e1\u6703", "amount": 417152000.0, "num_entries": 11, "cat": "\u5176\u4ed6\u7d93\u6fdf\u670d\u52d9\u652f\u51fa"}, {"depname": "\u9293\u6558\u90e8", "amount": 415357000.0, "num_entries": 3, "cat": "\u8003\u8a66\u652f\u51fa"}, {"depname": "\u81fa\u7063\u9ad8\u7b49\u6cd5\u9662\u81fa\u5357\u5206\u9662", "amount": 411795000.0, "num_entries": 6, "cat": "\u53f8\u6cd5\u652f\u51fa"}, {"depname": "\u6c34\u7522\u8a66\u9a57\u6240", "amount": 405189000.0, "num_entries": 5, "cat": "\u8fb2\u696d\u652f\u51fa"}, {"depname": "\u8fb2\u696d\u91d1\u878d\u5c40", "amount": 392996000.0, "num_entries": 3, "cat": "\u8fb2\u696d\u652f\u51fa"}, {"depname": "\u81fa\u7063\u96f2\u6797\u5730\u65b9\u6cd5\u9662", "amount": 386005000.0, "num_entries": 8, "cat": "\u53f8\u6cd5\u652f\u51fa"}, {"depname": "\u81fa\u7063\u58eb\u6797\u5730\u65b9\u6cd5\u9662\u6aa2\u5bdf\u7f72", "amount": 380521000.0, "num_entries": 3, "cat": "\u53f8\u6cd5\u652f\u51fa"}, {"depname": "\u8003\u9078\u90e8", "amount": 378251000.0, "num_entries": 8, "cat": "\u8003\u8a66\u652f\u51fa"}, {"depname": "\u8003\u8a66\u9662", "amount": 373570000.0, "num_entries": 7, "cat": "\u8003\u8a66\u652f\u51fa"}, {"depname": "\u5ec9\u653f\u7f72", "amount": 372353000.0, "num_entries": 3, "cat": "\u53f8\u6cd5\u652f\u51fa"}, {"depname": "\u4e2d\u90e8\u79d1\u5b78\u5de5\u696d\u5712\u5340\u7ba1\u7406\u5c40\u53ca\u6240\u5c6c", "amount": 369967000.0, "num_entries": 1, "cat": "\u6559\u80b2\u652f\u51fa"}, {"depname": "\u6aa2\u67e5\u5c40", "amount": 356770000.0, "num_entries": 3, "cat": "\u8ca1\u52d9\u652f\u51fa"}, {"depname": "\u570b\u7acb\u81fa\u7063\u53f2\u524d\u6587\u5316\u535a\u7269\u9928", "amount": 353534000.0, "num_entries": 5, "cat": "\u6587\u5316\u652f\u51fa"}, {"depname": "\u4e3b\u8a08\u8655\u96fb\u5b50\u8655\u7406\u8cc7\u6599\u4e2d\u5fc3", "amount": 325115000.0, "num_entries": 10, "cat": "\u884c\u653f\u652f\u51fa"}, {"depname": "\u81fa\u7063\u57fa\u9686\u5730\u65b9\u6cd5\u9662", "amount": 319892000.0, "num_entries": 8, "cat": "\u53f8\u6cd5\u652f\u51fa"}, {"depname": "\u9280\u884c\u5c40", "amount": 314773000.0, "num_entries": 3, "cat": "\u8ca1\u52d9\u652f\u51fa"}, {"depname": "\u81fa\u7063\u7701\u653f\u5e9c", "amount": 313733000.0, "num_entries": 6, "cat": "\u884c\u653f\u652f\u51fa"}, {"depname": "\u81fa\u7063\u5f70\u5316\u5730\u65b9\u6cd5\u9662\u6aa2\u5bdf\u7f72", "amount": 307556000.0, "num_entries": 3, "cat": "\u53f8\u6cd5\u652f\u51fa"}, {"depname": "\u81fa\u7063\u5357\u6295\u5730\u65b9\u6cd5\u9662", "amount": 306987000.0, "num_entries": 8, "cat": "\u53f8\u6cd5\u652f\u51fa"}, {"depname": "\u52d5\u690d\u7269\u9632\u75ab\u6aa2\u75ab\u5c40\u53ca\u6240\u5c6c", "amount": 306844000.0, "num_entries": 1, "cat": "\u79d1\u5b78\u652f\u51fa"}, {"depname": "\u81fa\u7063\u82d7\u6817\u5730\u65b9\u6cd5\u9662", "amount": 305821000.0, "num_entries": 8, "cat": "\u53f8\u6cd5\u652f\u51fa"}, {"depname": "\u570b\u5bb6\u6587\u5b98\u5b78\u9662\u53ca\u6240\u5c6c", "amount": 304950000.0, "num_entries": 6, "cat": "\u8003\u8a66\u652f\u51fa"}, {"depname": "\u8b49\u5238\u671f\u8ca8\u5c40", "amount": 302896000.0, "num_entries": 3, "cat": "\u8ca1\u52d9\u652f\u51fa"}, {"depname": "\u904b\u8f38\u7814\u7a76\u6240", "amount": 301091000.0, "num_entries": 4, "cat": "\u4ea4\u901a\u652f\u51fa"}, {"depname": "\u755c\u7522\u8a66\u9a57\u6240", "amount": 293360000.0, "num_entries": 1, "cat": "\u79d1\u5b78\u652f\u51fa"}, {"depname": "\u6c11\u7528\u822a\u7a7a\u5c40", "amount": 293295000.0, "num_entries": 3, "cat": "\u4ea4\u901a\u652f\u51fa"}, {"depname": "\u81fa\u7063\u82b1\u84ee\u5730\u65b9\u6cd5\u9662", "amount": 283415000.0, "num_entries": 7, "cat": "\u53f8\u6cd5\u652f\u51fa"}, {"depname": "\u5ba2\u5bb6\u59d4\u54e1\u6703\u53ca\u6240\u5c6c", "amount": 283136000.0, "num_entries": 3, "cat": "\u6c11\u653f\u652f\u51fa"}, {"depname": "\u6a94\u6848\u7ba1\u7406\u5c40", "amount": 277266000.0, "num_entries": 12, "cat": "\u884c\u653f\u652f\u51fa"}, {"depname": "\u53f8\u6cd5\u5b98\u8a13\u7df4\u6240", "amount": 264568000.0, "num_entries": 5, "cat": "\u53f8\u6cd5\u652f\u51fa"}, {"depname": "\u74b0\u5883\u6aa2\u9a57\u6240", "amount": 264003000.0, "num_entries": 8, "cat": "\u74b0\u5883\u4fdd\u8b77\u652f\u51fa"}, {"depname": "\u81fa\u7063\u5b9c\u862d\u5730\u65b9\u6cd5\u9662", "amount": 260609000.0, "num_entries": 7, "cat": "\u53f8\u6cd5\u652f\u51fa"}, {"depname": "\u4e2d\u592e\u5730\u8cea\u8abf\u67e5\u6240", "amount": 256183000.0, "num_entries": 1, "cat": "\u79d1\u5b78\u652f\u51fa"}, {"depname": "\u5357\u90e8\u79d1\u5b78\u5de5\u696d\u5712\u5340\u7ba1\u7406\u5c40\u53ca\u6240\u5c6c", "amount": 254034000.0, "num_entries": 1, "cat": "\u6559\u80b2\u652f\u51fa"}, {"depname": "\u81fa\u7063\u5609\u7fa9\u5730\u65b9\u6cd5\u9662\u6aa2\u5bdf\u7f72", "amount": 244629000.0, "num_entries": 3, "cat": "\u53f8\u6cd5\u652f\u51fa"}, {"depname": "\u81fa\u7063\u5c4f\u6771\u5730\u65b9\u6cd5\u9662\u6aa2\u5bdf\u7f72", "amount": 237583000.0, "num_entries": 3, "cat": "\u53f8\u6cd5\u652f\u51fa"}, {"depname": "\u81fa\u7063\u9ad8\u96c4\u5c11\u5e74\u6cd5\u9662", "amount": 231644000.0, "num_entries": 7, "cat": "\u53f8\u6cd5\u652f\u51fa"}, {"depname": "\u570b\u53f2\u9928", "amount": 231338000.0, "num_entries": 6, "cat": "\u6587\u5316\u652f\u51fa"}, {"depname": "\u7279\u6709\u751f\u7269\u7814\u7a76\u4fdd\u80b2\u4e2d\u5fc3", "amount": 224075000.0, "num_entries": 5, "cat": "\u8fb2\u696d\u652f\u51fa"}, {"depname": "\u81fa\u7063\u81fa\u6771\u5730\u65b9\u6cd5\u9662", "amount": 222204000.0, "num_entries": 8, "cat": "\u53f8\u6cd5\u652f\u51fa"}, {"depname": "\u516c\u52d9\u4eba\u54e1\u4fdd\u969c\u66a8\u57f9\u8a13\u59d4\u54e1\u6703", "amount": 219238000.0, "num_entries": 7, "cat": "\u8003\u8a66\u652f\u51fa"}, {"depname": "\u6c34\u7522\u8a66\u9a57\u6240", "amount": 215696000.0, "num_entries": 1, "cat": "\u79d1\u5b78\u652f\u51fa"}, {"depname": "\u9293\u6558\u90e8", "amount": 215254000.0, "num_entries": 1, "cat": "\u793e\u6703\u4fdd\u96aa\u652f\u51fa"}, {"depname": "\u75be\u75c5\u7ba1\u5236\u5c40", "amount": 213853000.0, "num_entries": 1, "cat": "\u79d1\u5b78\u652f\u51fa"}, {"depname": "\u570b\u5bb6\u5b89\u5168\u6703\u8b70", "amount": 213728000.0, "num_entries": 8, "cat": "\u570b\u52d9\u652f\u51fa"}, {"depname": "\u81fa\u5317\u5340\u652f\u4ed8\u8655", "amount": 212501000.0, "num_entries": 3, "cat": "\u8ca1\u52d9\u652f\u51fa"}, {"depname": "\u5bb6\u755c\u885b\u751f\u8a66\u9a57\u6240", "amount": 209131000.0, "num_entries": 1, "cat": "\u79d1\u5b78\u652f\u51fa"}, {"depname": "\u6c34\u5229\u7f72\u53ca\u6240\u5c6c", "amount": 208270000.0, "num_entries": 1, "cat": "\u79d1\u5b78\u652f\u51fa"}, {"depname": "\u667a\u6167\u8ca1\u7522\u5c40", "amount": 203159000.0, "num_entries": 1, "cat": "\u79d1\u5b78\u652f\u51fa"}, {"depname": "\u570b\u7acb\u6559\u80b2\u5ee3\u64ad\u96fb\u81fa", "amount": 202341000.0, "num_entries": 3, "cat": "\u6587\u5316\u652f\u51fa"}, {"depname": "\u667a\u6167\u8ca1\u7522\u6cd5\u9662", "amount": 200608000.0, "num_entries": 5, "cat": "\u53f8\u6cd5\u652f\u51fa"}, {"depname": "\u4e2d\u592e\u5730\u8cea\u8abf\u67e5\u6240", "amount": 199619000.0, "num_entries": 3, "cat": "\u5de5\u696d\u652f\u51fa"}, {"depname": "\u4e2d\u91ab\u85e5\u59d4\u54e1\u6703", "amount": 197135000.0, "num_entries": 10, "cat": "\u91ab\u7642\u4fdd\u5065\u652f\u51fa"}, {"depname": "\u53f8\u6cd5\u9662", "amount": 194807000.0, "num_entries": 1, "cat": "\u9000\u4f11\u64ab\u5379\u7d66\u4ed8\u652f\u51fa"}, {"depname": "\u8fb2\u696d\u85e5\u7269\u6bd2\u7269\u8a66\u9a57\u6240", "amount": 192255000.0, "num_entries": 3, "cat": "\u8fb2\u696d\u652f\u51fa"}, {"depname": "\u6700\u9ad8\u6cd5\u9662\u6aa2\u5bdf\u7f72", "amount": 192052000.0, "num_entries": 3, "cat": "\u53f8\u6cd5\u652f\u51fa"}, {"depname": "\u80fd\u6e90\u5c40", "amount": 191268000.0, "num_entries": 2, "cat": "\u5de5\u696d\u652f\u51fa"}, {"depname": "\u91d1\u878d\u76e3\u7763\u7ba1\u7406\u59d4\u54e1\u6703", "amount": 183518000.0, "num_entries": 5, "cat": "\u8ca1\u52d9\u652f\u51fa"}, {"depname": "\u81fa\u7063\u57fa\u9686\u5730\u65b9\u6cd5\u9662\u6aa2\u5bdf\u7f72", "amount": 183396000.0, "num_entries": 3, "cat": "\u53f8\u6cd5\u652f\u51fa"}, {"depname": "\u81fa\u7063\u96f2\u6797\u5730\u65b9\u6cd5\u9662\u6aa2\u5bdf\u7f72", "amount": 183119000.0, "num_entries": 5, "cat": "\u53f8\u6cd5\u652f\u51fa"}, {"depname": "\u9ad8\u96c4\u9ad8\u7b49\u884c\u653f\u6cd5\u9662", "amount": 180959000.0, "num_entries": 5, "cat": "\u53f8\u6cd5\u652f\u51fa"}, {"depname": "\u81fa\u7063\u82d7\u6817\u5730\u65b9\u6cd5\u9662\u6aa2\u5bdf\u7f72", "amount": 180403000.0, "num_entries": 3, "cat": "\u53f8\u6cd5\u652f\u51fa"}, {"depname": "\u6797\u696d\u8a66\u9a57\u6240", "amount": 179581000.0, "num_entries": 1, "cat": "\u79d1\u5b78\u652f\u51fa"}, {"depname": "\u6700\u9ad8\u884c\u653f\u6cd5\u9662", "amount": 176930000.0, "num_entries": 5, "cat": "\u53f8\u6cd5\u652f\u51fa"}, {"depname": "\u6587\u5316\u5712\u5340\u7ba1\u7406\u5c40", "amount": 175556000.0, "num_entries": 5, "cat": "\u6c11\u653f\u652f\u51fa"}, {"depname": "\u81fa\u7063\u5357\u6295\u5730\u65b9\u6cd5\u9662\u6aa2\u5bdf\u7f72", "amount": 174427000.0, "num_entries": 3, "cat": "\u53f8\u6cd5\u652f\u51fa"}, {"depname": "\u81fa\u7063\u9ad8\u7b49\u6cd5\u9662\u81fa\u4e2d\u5206\u9662\u6aa2\u5bdf\u7f72", "amount": 169943000.0, "num_entries": 5, "cat": "\u53f8\u6cd5\u652f\u51fa"}, {"depname": "\u81fa\u5357\u5340\u8fb2\u696d\u6539\u826f\u5834", "amount": 167584000.0, "num_entries": 4, "cat": "\u8fb2\u696d\u652f\u51fa"}, {"depname": "\u516c\u52d9\u4eba\u54e1\u9000\u4f11\u64ab\u5379\u57fa\u91d1\u7ba1\u7406\u59d4\u54e1\u6703", "amount": 167000000.0, "num_entries": 1, "cat": "\u9000\u4f11\u64ab\u5379\u7d66\u4ed8\u652f\u51fa"}, {"depname": "\u8336\u696d\u6539\u826f\u5834", "amount": 164875000.0, "num_entries": 4, "cat": "\u8fb2\u696d\u652f\u51fa"}, {"depname": "\u81fa\u7063\u9ad8\u7b49\u6cd5\u9662\u9ad8\u96c4\u5206\u9662\u6aa2\u5bdf\u7f72", "amount": 164672000.0, "num_entries": 3, "cat": "\u53f8\u6cd5\u652f\u51fa"}, {"depname": "\u8fb2\u7ce7\u7f72\u53ca\u6240\u5c6c", "amount": 162645000.0, "num_entries": 1, "cat": "\u79d1\u5b78\u652f\u51fa"}, {"depname": "\u5bb6\u755c\u885b\u751f\u8a66\u9a57\u6240", "amount": 162217000.0, "num_entries": 2, "cat": "\u8fb2\u696d\u652f\u51fa"}, {"depname": "\u81fa\u7063\u82b1\u84ee\u5730\u65b9\u6cd5\u9662\u6aa2\u5bdf\u7f72", "amount": 162060000.0, "num_entries": 3, "cat": "\u53f8\u6cd5\u652f\u51fa"}, {"depname": "\u81fa\u7063\u9ad8\u7b49\u6cd5\u9662\u82b1\u84ee\u5206\u9662", "amount": 154022000.0, "num_entries": 5, "cat": "\u53f8\u6cd5\u652f\u51fa"}, {"depname": "\u81fa\u7063\u5b9c\u862d\u5730\u65b9\u6cd5\u9662\u6aa2\u5bdf\u7f72", "amount": 153328000.0, "num_entries": 3, "cat": "\u53f8\u6cd5\u652f\u51fa"}, {"depname": "\u81fa\u4e2d\u5340\u8fb2\u696d\u6539\u826f\u5834", "amount": 151287000.0, "num_entries": 4, "cat": "\u8fb2\u696d\u652f\u51fa"}, {"depname": "\u516c\u52d9\u4eba\u54e1\u9000\u4f11\u64ab\u5379\u57fa\u91d1\u7ba1\u7406\u59d4\u54e1\u6703", "amount": 148621000.0, "num_entries": 3, "cat": "\u9000\u4f11\u64ab\u5379\u696d\u52d9\u652f\u51fa"}, {"depname": "\u904b\u8f38\u7814\u7a76\u6240", "amount": 148436000.0, "num_entries": 1, "cat": "\u79d1\u5b78\u652f\u51fa"}, {"depname": "\u6843\u5712\u5340\u8fb2\u696d\u6539\u826f\u5834", "amount": 146638000.0, "num_entries": 4, "cat": "\u8fb2\u696d\u652f\u51fa"}, {"depname": "\u7a2e\u82d7\u6539\u826f\u7e41\u6b96\u5834", "amount": 145264000.0, "num_entries": 4, "cat": "\u8fb2\u696d\u652f\u51fa"}, {"depname": "\u81fa\u7063\u9ad8\u7b49\u6cd5\u9662\u81fa\u5357\u5206\u9662\u6aa2\u5bdf\u7f72", "amount": 142417000.0, "num_entries": 3, "cat": "\u53f8\u6cd5\u652f\u51fa"}, {"depname": "\u570b\u6c11\u5065\u5eb7\u5c40", "amount": 141227000.0, "num_entries": 1, "cat": "\u79d1\u5b78\u652f\u51fa"}, {"depname": "\u516c\u52d9\u4eba\u529b\u767c\u5c55\u4e2d\u5fc3", "amount": 139728000.0, "num_entries": 3, "cat": "\u884c\u653f\u652f\u51fa"}, {"depname": "\u8499\u85cf\u59d4\u54e1\u6703", "amount": 139548000.0, "num_entries": 4, "cat": "\u908a\u653f\u652f\u51fa"}, {"depname": "\u5730\u65b9\u884c\u653f\u7814\u7fd2\u4e2d\u5fc3", "amount": 138367000.0, "num_entries": 3, "cat": "\u884c\u653f\u652f\u51fa"}, {"depname": "\u6f01\u696d\u7f72\u53ca\u6240\u5c6c", "amount": 138295000.0, "num_entries": 1, "cat": "\u79d1\u5b78\u652f\u51fa"}, {"depname": "\u8fb2\u696d\u85e5\u7269\u6bd2\u7269\u8a66\u9a57\u6240", "amount": 137812000.0, "num_entries": 1, "cat": "\u79d1\u5b78\u652f\u51fa"}, {"depname": "\u81fa\u4e2d\u9ad8\u7b49\u884c\u653f\u6cd5\u9662", "amount": 137229000.0, "num_entries": 5, "cat": "\u53f8\u6cd5\u652f\u51fa"}, {"depname": "\u4fdd\u96aa\u5c40", "amount": 135898000.0, "num_entries": 5, "cat": "\u8ca1\u52d9\u652f\u51fa"}, {"depname": "\u9ad8\u96c4\u5340\u8fb2\u696d\u6539\u826f\u5834", "amount": 135717000.0, "num_entries": 4, "cat": "\u8fb2\u696d\u652f\u51fa"}, {"depname": "\u570b\u7acb\u4e2d\u570b\u91ab\u85e5\u7814\u7a76\u6240", "amount": 133519000.0, "num_entries": 3, "cat": "\u91ab\u7642\u4fdd\u5065\u652f\u51fa"}, {"depname": "\u570b\u53f2\u9928\u81fa\u7063\u6587\u737b\u9928", "amount": 131972000.0, "num_entries": 5, "cat": "\u6587\u5316\u652f\u51fa"}, {"depname": "\u81fa\u7063\u81fa\u6771\u5730\u65b9\u6cd5\u9662\u6aa2\u5bdf\u7f72", "amount": 129134000.0, "num_entries": 3, "cat": "\u53f8\u6cd5\u652f\u51fa"}, {"depname": "\u653e\u5c04\u6027\u7269\u6599\u7ba1\u7406\u5c40", "amount": 126133000.0, "num_entries": 6, "cat": "\u74b0\u5883\u4fdd\u8b77\u652f\u51fa"}, {"depname": "\u52de\u5de5\u9000\u4f11\u57fa\u91d1\u76e3\u7406\u6703", "amount": 120508000.0, "num_entries": 3, "cat": "\u798f\u5229\u670d\u52d9\u652f\u51fa"}, {"depname": "\u81fa\u7063\u6f8e\u6e56\u5730\u65b9\u6cd5\u9662", "amount": 115297000.0, "num_entries": 8, "cat": "\u53f8\u6cd5\u652f\u51fa"}, {"depname": "\u6cd5\u91ab\u7814\u7a76\u6240", "amount": 110971000.0, "num_entries": 3, "cat": "\u53f8\u6cd5\u652f\u51fa"}, {"depname": "\u82d7\u6817\u5340\u8fb2\u696d\u6539\u826f\u5834", "amount": 109951000.0, "num_entries": 4, "cat": "\u8fb2\u696d\u652f\u51fa"}, {"depname": "\u8f3b\u5c04\u5075\u6e2c\u4e2d\u5fc3", "amount": 108409000.0, "num_entries": 5, "cat": "\u74b0\u5883\u4fdd\u8b77\u652f\u51fa"}, {"depname": "\u82b1\u84ee\u5340\u8fb2\u696d\u6539\u826f\u5834", "amount": 105131000.0, "num_entries": 2, "cat": "\u8fb2\u696d\u652f\u51fa"}, {"depname": "\u81fa\u4e2d\u5340\u8fb2\u696d\u6539\u826f\u5834", "amount": 99690000.0, "num_entries": 1, "cat": "\u79d1\u5b78\u652f\u51fa"}, {"depname": "\u516c\u52d9\u54e1\u61f2\u6212\u59d4\u54e1\u6703", "amount": 99058000.0, "num_entries": 5, "cat": "\u53f8\u6cd5\u652f\u51fa"}, {"depname": "\u7a2e\u82d7\u6539\u826f\u7e41\u6b96\u5834", "amount": 96165000.0, "num_entries": 1, "cat": "\u79d1\u5b78\u652f\u51fa"}, {"depname": "\u81fa\u5357\u5340\u8fb2\u696d\u6539\u826f\u5834", "amount": 95876000.0, "num_entries": 1, "cat": "\u79d1\u5b78\u652f\u51fa"}, {"depname": "\u5927\u9678\u59d4\u54e1\u6703", "amount": 95255000.0, "num_entries": 1, "cat": "\u6587\u5316\u652f\u51fa"}, {"depname": "\u81fa\u6771\u5340\u8fb2\u696d\u6539\u826f\u5834", "amount": 94736000.0, "num_entries": 4, "cat": "\u8fb2\u696d\u652f\u51fa"}, {"depname": "\u6843\u5712\u5340\u8fb2\u696d\u6539\u826f\u5834", "amount": 92222000.0, "num_entries": 1, "cat": "\u79d1\u5b78\u652f\u51fa"}, {"depname": "\u9ad8\u96c4\u5340\u8fb2\u696d\u6539\u826f\u5834", "amount": 91884000.0, "num_entries": 1, "cat": "\u79d1\u5b78\u652f\u51fa"}, {"depname": "\u7279\u6709\u751f\u7269\u7814\u7a76\u4fdd\u80b2\u4e2d\u5fc3", "amount": 88977000.0, "num_entries": 1, "cat": "\u79d1\u5b78\u652f\u51fa"}, {"depname": "\u8ca1\u7a05\u4eba\u54e1\u8a13\u7df4\u6240", "amount": 85844000.0, "num_entries": 3, "cat": "\u8ca1\u52d9\u652f\u51fa"}, {"depname": "\u81fa\u7063\u7701\u8aee\u8b70\u6703", "amount": 85381000.0, "num_entries": 14, "cat": "\u884c\u653f\u652f\u51fa"}, {"depname": "\u74b0\u5883\u4fdd\u8b77\u4eba\u54e1\u8a13\u7df4\u6240", "amount": 85246000.0, "num_entries": 3, "cat": "\u74b0\u5883\u4fdd\u8b77\u652f\u51fa"}, {"depname": "\u798f\u5efa\u91d1\u9580\u5730\u65b9\u6cd5\u9662", "amount": 84385000.0, "num_entries": 7, "cat": "\u53f8\u6cd5\u652f\u51fa"}, {"depname": "\u4e2d\u91ab\u85e5\u59d4\u54e1\u6703", "amount": 83574000.0, "num_entries": 1, "cat": "\u79d1\u5b78\u652f\u51fa"}, {"depname": "\u5be9\u8a08\u90e8\u9ad8\u96c4\u5e02\u5be9\u8a08\u8655", "amount": 79013000.0, "num_entries": 3, "cat": "\u76e3\u5bdf\u652f\u51fa"}, {"depname": "\u570b\u7acb\u81fa\u7063\u85dd\u8853\u6559\u80b2\u9928", "amount": 78883000.0, "num_entries": 3, "cat": "\u6559\u80b2\u652f\u51fa"}, {"depname": "\u5916\u4ea4\u9818\u4e8b\u4eba\u54e1\u8b1b\u7fd2\u6240", "amount": 78359000.0, "num_entries": 4, "cat": "\u5916\u4ea4\u652f\u51fa"}, {"depname": "\u885b\u751f\u7f72", "amount": 77965000.0, "num_entries": 1, "cat": "\u6559\u80b2\u652f\u51fa"}, {"depname": "\u81fa\u7063\u6f8e\u6e56\u5730\u65b9\u6cd5\u9662\u6aa2\u5bdf\u7f72", "amount": 76286000.0, "num_entries": 3, "cat": "\u53f8\u6cd5\u652f\u51fa"}, {"depname": "\u82b1\u84ee\u5340\u8fb2\u696d\u6539\u826f\u5834", "amount": 76245000.0, "num_entries": 1, "cat": "\u79d1\u5b78\u652f\u51fa"}, {"depname": "\u5be9\u8a08\u90e8\u81fa\u5317\u5e02\u5be9\u8a08\u8655", "amount": 74422000.0, "num_entries": 3, "cat": "\u76e3\u5bdf\u652f\u51fa"}, {"depname": "\u798f\u5efa\u7701\u653f\u5e9c", "amount": 72493000.0, "num_entries": 1, "cat": "\u5c08\u6848\u88dc\u52a9\u652f\u51fa"}, {"depname": "\u8336\u696d\u6539\u826f\u5834", "amount": 71919000.0, "num_entries": 1, "cat": "\u79d1\u5b78\u652f\u51fa"}, {"depname": "\u516c\u52d9\u4eba\u54e1\u4f4f\u5b85\u53ca\u798f\u5229\u59d4\u54e1\u6703", "amount": 70708000.0, "num_entries": 3, "cat": "\u884c\u653f\u652f\u51fa"}, {"depname": "\u4eba\u4e8b\u884c\u653f\u5c40", "amount": 70669000.0, "num_entries": 3, "cat": "\u9000\u4f11\u64ab\u5379\u7d66\u4ed8\u652f\u51fa"}, {"depname": "\u798f\u5efa\u7701\u653f\u5e9c", "amount": 69888000.0, "num_entries": 6, "cat": "\u884c\u653f\u652f\u51fa"}, {"depname": "\u4ea4\u901a\u90e8", "amount": 64448000.0, "num_entries": 1, "cat": "\u79d1\u5b78\u652f\u51fa"}, {"depname": "\u5be9\u8a08\u90e8\u81fa\u4e2d\u5e02\u5be9\u8a08\u8655", "amount": 63122000.0, "num_entries": 3, "cat": "\u76e3\u5bdf\u652f\u51fa"}, {"depname": "\u5be9\u8a08\u90e8\u81fa\u5357\u5e02\u5be9\u8a08\u8655", "amount": 62607000.0, "num_entries": 3, "cat": "\u76e3\u5bdf\u652f\u51fa"}, {"depname": "\u6cd5\u52d9\u90e8", "amount": 61120000.0, "num_entries": 1, "cat": "\u5176\u4ed6\u652f\u51fa"}, {"depname": "\u7814\u7a76\u767c\u5c55\u8003\u6838\u59d4\u54e1\u6703", "amount": 60899000.0, "num_entries": 1, "cat": "\u79d1\u5b78\u652f\u51fa"}, {"depname": "\u5be9\u8a08\u90e8\u65b0\u5317\u5e02\u5be9\u8a08\u8655", "amount": 60510000.0, "num_entries": 3, "cat": "\u76e3\u5bdf\u652f\u51fa"}, {"depname": "\u81fa\u6771\u5340\u8fb2\u696d\u6539\u826f\u5834", "amount": 57102000.0, "num_entries": 1, "cat": "\u79d1\u5b78\u652f\u51fa"}, {"depname": "\u81fa\u7063\u9ad8\u7b49\u6cd5\u9662\u82b1\u84ee\u5206\u9662\u6aa2\u5bdf\u7f72", "amount": 56876000.0, "num_entries": 3, "cat": "\u53f8\u6cd5\u652f\u51fa"}, {"depname": "\u6797\u52d9\u5c40", "amount": 53287000.0, "num_entries": 1, "cat": "\u79d1\u5b78\u652f\u51fa"}, {"depname": "\u7d93\u6fdf\u90e8", "amount": 52006000.0, "num_entries": 1, "cat": "\u5de5\u696d\u652f\u51fa"}, {"depname": "\u74b0\u5883\u4fdd\u8b77\u7f72", "amount": 49873000.0, "num_entries": 1, "cat": "\u79d1\u5b78\u652f\u51fa"}, {"depname": "\u4e2d\u592e\u5065\u5eb7\u4fdd\u96aa\u5c40", "amount": 47193000.0, "num_entries": 1, "cat": "\u79d1\u5b78\u652f\u51fa"}, {"depname": "\u798f\u5efa\u91d1\u9580\u5730\u65b9\u6cd5\u9662\u6aa2\u5bdf\u7f72", "amount": 46194000.0, "num_entries": 5, "cat": "\u53f8\u6cd5\u652f\u51fa"}, {"depname": "\u516c\u52d9\u4eba\u54e1\u9000\u4f11\u64ab\u5379\u57fa\u91d1\u76e3\u7406\u59d4\u54e1\u6703", "amount": 42339000.0, "num_entries": 3, "cat": "\u9000\u4f11\u64ab\u5379\u696d\u52d9\u652f\u51fa"}, {"depname": "\u82d7\u6817\u5340\u8fb2\u696d\u6539\u826f\u5834", "amount": 40412000.0, "num_entries": 1, "cat": "\u79d1\u5b78\u652f\u51fa"}, {"depname": "\u6cd5\u52d9\u90e8", "amount": 40000000.0, "num_entries": 1, "cat": "\u9000\u4f11\u64ab\u5379\u7d66\u4ed8\u652f\u51fa"}, {"depname": "\u570b\u8ecd\u9000\u9664\u5f79\u5b98\u5175\u8f14\u5c0e\u59d4\u54e1\u6703", "amount": 38245000.0, "num_entries": 1, "cat": "\u9000\u4f11\u64ab\u5379\u696d\u52d9\u652f\u51fa"}, {"depname": "\u6cd5\u52d9\u90e8", "amount": 31733000.0, "num_entries": 1, "cat": "\u79d1\u5b78\u652f\u51fa"}, {"depname": "\u6cd5\u91ab\u7814\u7a76\u6240", "amount": 31287000.0, "num_entries": 1, "cat": "\u79d1\u5b78\u652f\u51fa"}, {"depname": "\u9293\u6558\u90e8", "amount": 28825000.0, "num_entries": 1, "cat": "\u798f\u5229\u670d\u52d9\u652f\u51fa"}, {"depname": "\u798f\u5efa\u9ad8\u7b49\u6cd5\u9662\u91d1\u9580\u5206\u9662", "amount": 28599000.0, "num_entries": 5, "cat": "\u53f8\u6cd5\u652f\u51fa"}, {"depname": "\u798f\u5efa\u9023\u6c5f\u5730\u65b9\u6cd5\u9662", "amount": 26434000.0, "num_entries": 7, "cat": "\u53f8\u6cd5\u652f\u51fa"}, {"depname": "\u52de\u5de5\u59d4\u54e1\u6703", "amount": 25059000.0, "num_entries": 1, "cat": "\u570b\u6c11\u5c31\u696d\u652f\u51fa"}, {"depname": "\u798f\u5efa\u9ad8\u7b49\u6cd5\u9662\u91d1\u9580\u5206\u9662\u6aa2\u5bdf\u7f72", "amount": 18446000.0, "num_entries": 3, "cat": "\u53f8\u6cd5\u652f\u51fa"}, {"depname": "\u81fa\u7063\u9ad8\u7b49\u6cd5\u9662\u6aa2\u5bdf\u7f72\u667a\u6167\u8ca1\u7522\u5206\u7f72", "amount": 16399000.0, "num_entries": 3, "cat": "\u53f8\u6cd5\u652f\u51fa"}, {"depname": "\u798f\u5efa\u9023\u6c5f\u5730\u65b9\u6cd5\u9662\u6aa2\u5bdf\u7f72", "amount": 15773000.0, "num_entries": 3, "cat": "\u53f8\u6cd5\u652f\u51fa"}, {"depname": "\u8abf\u67e5\u5c40", "amount": 15361000.0, "num_entries": 1, "cat": "\u79d1\u5b78\u652f\u51fa"}, {"depname": "\u570b\u53f2\u9928", "amount": 13210000.0, "num_entries": 1, "cat": "\u79d1\u5b78\u652f\u51fa"}, {"depname": "\u5927\u9678\u59d4\u54e1\u6703", "amount": 11270000.0, "num_entries": 1, "cat": "\u79d1\u5b78\u652f\u51fa"}, {"depname": "\u74b0\u5883\u6aa2\u9a57\u6240", "amount": 10388000.0, "num_entries": 1, "cat": "\u79d1\u5b78\u652f\u51fa"}, {"depname": "\u7d93\u6fdf\u90e8", "amount": 9122000.0, "num_entries": 1, "cat": "\u9000\u4f11\u64ab\u5379\u7d66\u4ed8\u652f\u51fa"}, {"depname": "\u7d93\u6fdf\u90e8", "amount": 7623000.0, "num_entries": 1, "cat": "\u798f\u5229\u670d\u52d9\u652f\u51fa"}, {"depname": "\u6c34\u571f\u4fdd\u6301\u5c40", "amount": 7529000.0, "num_entries": 1, "cat": "\u79d1\u5b78\u652f\u51fa"}, {"depname": "\u570b\u53f2\u9928\u81fa\u7063\u6587\u737b\u9928", "amount": 7130000.0, "num_entries": 1, "cat": "\u79d1\u5b78\u652f\u51fa"}, {"depname": "\u6a94\u6848\u7ba1\u7406\u5c40", "amount": 6827000.0, "num_entries": 1, "cat": "\u79d1\u5b78\u652f\u51fa"}, {"depname": "\u81fa\u7063\u7701\u8aee\u8b70\u6703", "amount": 5013000.0, "num_entries": 1, "cat": "\u6587\u5316\u652f\u51fa"}, {"depname": "\u9293\u6558\u90e8", "amount": 3928000.0, "num_entries": 2, "cat": "\u9000\u4f11\u64ab\u5379\u696d\u52d9\u652f\u51fa"}, {"depname": "\u81fa\u7063\u5b9c\u862d\u5730\u65b9\u6cd5\u9662\u6aa2\u5bdf\u7f72", "amount": 1862000.0, "num_entries": 1, "cat": "\u79d1\u5b78\u652f\u51fa"}, {"depname": "\u77ef\u6b63\u7f72\u53ca\u6240\u5c6c", "amount": 1314000.0, "num_entries": 1, "cat": "\u79d1\u5b78\u652f\u51fa"}, {"depname": "\u885b\u751f\u7f72", "amount": 1000000.0, "num_entries": 1, "cat": "\u793e\u6703\u6551\u52a9\u652f\u51fa"}, {"depname": "\u8fb2\u696d\u91d1\u878d\u5c40", "amount": 900000.0, "num_entries": 1, "cat": "\u79d1\u5b78\u652f\u51fa"}], "summary": {"num_drilldowns": 344, "pagesize": 10000, "cached": true, "num_entries": 1615, "page": 1, "currency": {"amount": "TWD"}, "amount": 2376261515000.0, "cache_key": "8311c0ab057432fb04ac54847f5fc214e24c69cc", "pages": 1}};

function initTreeMap() {
    $("#treemap-backbtn").hide();
    function setdebit(v) {
      var debit = $("#debitmask");
      debit.css({"top": v+"px", "height": (520-v)+"px", "line-height": (520-v)+"px"});
      debit.text(v+"億");
    }
    setdebit(123);
    var kx = 1, ky = 1;
    var w = 710 - 80,
        h = 740 - 180,
        x = d3.scale.linear().range([0, w]),
        y = d3.scale.linear().range([0, h]),
        color = d3.scale.category20c(),
        root,
        node;

    var treemap = d3.layout.treemap()
        .round(false)
        .size([w, h])
        .sticky(true)
        .value(function(d) { return d.size; });

    var svg = d3.select("#treemap-root").append("div")
        .attr("class", "budget-treemap")
        .style("width", w + "px")
        .style("height", h + "px")
      .append("svg:svg")
        .attr("width", w)
        .attr("height", h)
        .attr("id", "treemap-svg")
      .append("svg:g")
        .attr("transform", "translate(.5,.5)");

    var CurrencyData = [
      ["", "元", 1],
      ["份","營養午餐",25],
      ["份","營養午餐(回扣)",30],
      ["人的","年薪",308000],
      ["座","釣魚台",80000000],
      ["分鐘","太空旅遊",1000000],
      ["碗","鬍鬚張魯肉飯",68],
      ["個","便當",50],
      ["杯","珍奶",30],
      ["份","雞排加珍奶",60],
      ["個","晨水匾",700000000],
      ["個","夢想家",200000000],
      ["個","林益世(粗估)",83000000],
      ["座","冰島",2000080000000],
      ["坪","帝寶",2500000],
      ["支","iPhone5",25900],
      ["座","硬兔的小島",2000080000000]
    ]; //todo: merge with scope

    function CurrencyConvert(v,idx,full) {
      if(idx==undefined) idx = 0;
      var c = CurrencyData[idx];
      v = parseInt(10000*v/c[2])/10000;
      if(v>1 && v<1000) v=parseInt(10*v)/10;
      if(v>=1000 && v<10000) v=parseInt(v/1000)+"千";
      else if(v>=10000 && v<100000000) v=parseInt(v/10000)+"萬";
      else if(v>=100000000 && v<1000000000000) v=parseInt(v/100000000)+"億";
      else if(v>=1000000000000) v=parseInt(v/1000000000000)+"兆";
      return v+(full?c[0]+c[1]:"");
    }
    var lastcell = null;
    var lockcell = null;
    function foo(data) {
      node = root = data;

      var nodes = treemap.nodes(root)
          .filter(function(d) { return !d.children; });
      var cell = svg.selectAll("g.cell")
          .data(nodes)
        .enter().append("svg:g")
          .attr("class", "cell")
          .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
          .on("mouseover", function(d) {
             var i;
             if(lockcell || d==lastcell) return; else lastcell=d;
             update_detail_amount();
             var scope = angular.element("#BudgetItem").scope()
             scope.$apply(function() { scope.key="view3:"+d.cat+":"+d.name; });
          })
          .on("click", function(d) {
             if(lockcell && lockcell.find) lockcell.find("rect").css({"stroke": "none"});
             if(!lockcell || lockcell.get(0)!=$(this).get(0)) {
               $(this).find("rect").css({"stroke": "rgb(255,0,0)"});
               lockcell = $(this), lastcell = d;
               update_detail_amount();
               var scope = angular.element("#BudgetItem").scope()
               scope.$apply(function() { scope.key="view3:"+d.cat+":"+d.name; });
             } else { lockcell=null; }
             if(node!=d.parent) {
               $("#treemap-backbtn").fadeIn("slow");
               return zoom(d.parent);
             } // if node==d.parent: we need zoom to root. else zoom to d.parent.
          });
      var _k=1, _n=1;
      var _n = svg.selectAll("g.cell")[0].length;
      svg.selectAll("g.cell").filter(function(d,i) {
        if(parseInt(Math.random()*_n)==_k-1) {
          _k--;
          lastcell = d;
          update_detail_amount();
        } _n--;
      });
      cell.append("svg:rect")
          .attr("width", function(d) { return (d.dx>1?d.dx - 1:0); })
          .attr("height", function(d) { return (d.dy>1?d.dy - 1:0); })
          .style("fill", function(d) { return color(d.parent.name); });

      var texts = cell.append("svg:g").attr("class", "texts");
      texts.append("svg:text")
          .attr("class", "name")
          .attr("x", function(d) { return d.dx / 2; })
          .attr("y", function(d) { return d.dy / 2-7; })
          .attr("dy", ".35em")
          .attr("text-anchor", "middle")
          .text(function(d) { return d.name; });
      texts.append("svg:text")
          .attr("class", "amount")
          .attr("x", function(d) { return d.dx / 2; })
          .attr("y", function(d) { return d.dy / 2+7; })
          .attr("dy", ".35em")
          .attr("text-anchor", "middle")
          .text(function(d) { return CurrencyConvert(d.size, budget_unit, true); });
      texts.style("display", function(d) { return textSize(d,this,["block","none"]); });

      d3.select("#treemap-backbtn").on("click",function() { zoom(root); $("#treemap-backbtn").fadeOut("slow"); });
    };
    function size(d) {
      return d.size;
    }

    function count(d) {
      return 1;
    }

    var dx = 0;
    function zoom(d) {
      kx = w / d.dx, ky = h / d.dy;
      x.domain([d.x, d.x + d.dx]);
      y.domain([d.y, d.y + d.dy]);

      var t = svg.selectAll("g.cell").transition()
          .duration(750)
          .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });

      t.select("rect")
          .attr("width", function(d) { return (kx*d.dx>1?kx * d.dx - 1:0); })
          .attr("height", function(d) { return (ky*d.dy>1?ky * d.dy - 1:0); })

      t.select("text.name")
          .attr("x", function(d) { return kx * d.dx / 2; })
          .attr("y", function(d) { return ky * d.dy / 2 - 7; });

      t.select("text.amount")
          .attr("x", function(d) { return kx * d.dx / 2; })
          .attr("y", function(d) { return ky * d.dy / 2 + 7; });
      svg.selectAll("g.texts")
      .transition().style("display", function(d) { return textSize(d,this,["block",$(this).css("display")]);  })
      .transition().duration(750).style("opacity", function(d) { return textSize(d,this,[1,0]); })
      .transition().delay(750).style("display", function(d) { return textSize(d,this,[$(this).css("display"),"none"]); });

      node = d;
      d3.event.stopPropagation();
    }

    var unit_selector;
    var budget_unit=0;
    function textSize(d,item, values) {
        if(kx*d.dx+5 > item.childNodes[0].getComputedTextLength()
         && kx*d.dx+5 > item.childNodes[1].getComputedTextLength()
         && ky*d.dy>20) return values[0]; else return values[1];
    }

    foo(parse(raw));

    function update_unit(idx) {
      //unit_selector=$("#unit-selector"); // move to sth like $(doc).ready
      /*
      if(budget_unit>=0) $("#unit-selector li:eq("+budget_unit+") a i").css({"visibility":"hidden"});
      if(idx==-1) {
        budget_unit = parseInt(Math.random()*CurrencyData.length);
        $("#unit-selector li:eq("+budget_unit+") a i").style("display","inline-block");
      } else if(idx==undefined) budget_unit = unit_selector.val();
      else budget_unit = idx;
      $("#unit-selector li:eq("+budget_unit+") a i").css({"visibility":"visible"});
      update_detail_amount();
      d3.selectAll("text.amount").text(function(d) {
        return CurrencyConvert(d.size, budget_unit, true);
      });*/
      update_detail_amount();
      svg.selectAll("g.texts")
      .transition().style("display", function(d) { return textSize(d,this,["block",$(this).css("display")]);  })
      .transition().duration(750).style("opacity", function(d) { return textSize(d,this,[1,0]); })
      .transition().delay(750).style("display", function(d) { return textSize(d,this,[$(this).css("display"),"none"]); });
    }

    function update_detail_amount() {
      if(lastcell) {
        $("#budget-detail-depname-field").text(lastcell.name);
        $("#budget-detail-category-field").text(lastcell.cat);

        alt_unit = (UnitMapper.get()==0?parseInt(Math.random()*(CurrencyData.length-1))+1:0);
        $("#budget-detail-amount-field1-value").text(
          UnitMapper.convert(lastcell.size) + UnitMapper.getQuantifier());
        $("#budget-detail-amount-field1-unit").text(UnitMapper.getUnit());
        $("#budget-detail-amount-field2").text(UnitMapper.convert(lastcell.size, alt_unit, true));

        /*alt_unit = (budget_unit==0?parseInt(Math.random()*(CurrencyData.length-1))+1:0);
        $("#budget-detail-amount-field1-value").text(
          CurrencyConvert(lastcell.size,budget_unit)+CurrencyData[budget_unit][0]);
        $("#budget-detail-amount-field1-unit").text(CurrencyData[budget_unit][1]);
        $("#budget-detail-amount-field2").text(CurrencyConvert(lastcell.size, alt_unit)+
          CurrencyData[alt_unit][0]+CurrencyData[alt_unit][1]);*/
      }
    }

    $(document).ready(function() { UnitMapper.onchange(update_unit); })

}
var UnitMapper;
UnitMapper = {
  unit: 0,
  callbacks: [],
  random: function(){
    return this.unit = parseInt(Math.random() * this.table.length);
  },
  get: function(){
    return this.unit;
  },
  getUnit: function(des_unit){
    des_unit == null && (des_unit = this.unit);
    return this.table[des_unit][1];
  },
  getQuantifier: function(des_unit){
    des_unit == null && (des_unit = this.unit);
    return this.table[des_unit][0];
  },
  convert: function(value, des_unit, full_desc){
    var unitdata;
    if (des_unit === -1) {
      des_unit = parseInt(Math.random() * this.table.length);
    }
    des_unit == null && (des_unit = this.unit);
    unitdata = this.table[des_unit];
    value = parseInt(10000 * value / unitdata[2]) / 10000;
    value = value >= 1000000000000
      ? parseInt(value / 1000000000000) + "兆"
      : value >= 100000000
        ? parseInt(value / 100000000) + "億"
        : value >= 10000
          ? parseInt(value / 10000) + "萬"
          : value >= 1000
            ? parseInt(value / 1000) + "千"
            : value >= 1 ? parseInt(10 * value) / 10 : value;
    return value + (full_desc ? unitdata[0] + unitdata[1] : "");
  },
  onchange: function(func){
    return this.callbacks.push(func);
  },
  update: function(idx){
    if (this.unit >= 0) {
      $('#unit-selector li:eq(' + this.unit + ') ').removeClass('active');
    }
    this.unit = idx === -1
      ? parseInt(Math.random() * this.table.length)
      : idx === void 8 ? 0 : idx;
    $('#unit-selector li:eq(' + this.unit + ')').addClass('active');
    d3.selectAll('text.amount').text(function(d){
      return UnitMapper.convert(d.size || d.value.sum, UnitMapper.unit, true);
    });
    jQuery.each($(".unit-convert"), function(){
      return $(this).text(UnitMapper.convert($(this).attr("cc-value"), UnitMapper.unit, true));
    });
    return jQuery.each(this.callbacks, function(x){
      return this();
    });
  },
  init: function(){},
  table: [["", '元', 1], ['份', '營養午餐', '25'], ['份', '營養午餐(回扣)', '30'], ['人的', '年薪', '308000'], ['座', '釣魚台', '80000000'], ['分鐘', '太空旅遊', '1000000'], ['碗', '鬍鬚張魯肉飯', '68'], ['個', '便當', '50'], ['杯', '珍奶', '30'], ['份', '雞排加珍奶', '60'], ['個', '晨水匾', '700000000'], ['個', '夢想家', '200000000'], ['個', '林益世(粗估)', '83000000'], ['座', '冰島', '2000080000000'], ['坪', '帝寶', '2500000'], ['支', 'iPhone5', '25900'], ['座', '硬兔的小島', '2000080000000']]
};