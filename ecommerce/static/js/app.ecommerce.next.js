var app = angular.module('app', ['ui.router', 'ui.bootstrap', 'flash', 'ngSanitize', 'mwl.confirm', 'ui.bootstrap.datetimepicker', 'rzModule', 'ngMeta', 'angular-owl-carousel-2']);

app.config(function($stateProvider, $urlRouterProvider, $httpProvider, $provide, $locationProvider) {

  $urlRouterProvider.otherwise('/');
  $httpProvider.defaults.xsrfCookieName = 'csrftoken';
  $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
  $httpProvider.defaults.withCredentials = true;
  $locationProvider.html5Mode(true);
  // $cookies.set("time" : new Date())
});

app.run(['$rootScope', '$state', '$stateParams', '$users', '$http', function($rootScope, $state, $stateParams, $users, $http, $timeout) {
  $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
    $rootScope.preloader = true
  })
  $rootScope.$state = $state;
  $rootScope.$stateParams = $stateParams;
  $rootScope.previousState;
  $rootScope.currentState;
  var startTime = new Date();
  $rootScope.$on("$stateChangeError", console.log.bind(console));
  $rootScope.$on("$stateChangeSuccess", function(params, to, toParams, from, fromParams) {
    $rootScope.preloader = false
    $rootScope.previousState = from.name;
    $rootScope.currentState = to.name;
    document.getElementById('hidemeinallpage').style.display = 'none'
    document.getElementById("catpositionfetch").style.display = "none";
    document.getElementById("searchinnav").style.display = "none";
    document.getElementById("wishicons").style.display = "none";
    document.getElementById("logoinnav").style.display = "none";
    if ($rootScope.$state.current.name == 'ecommerce') {
      document.getElementById('hidemeinallpage').style.display = 'block'
      window.addEventListener("scroll", function(event) {
        if (this.scrollY < 165 && $rootScope.$state.current.name == 'ecommerce') {
          document.getElementById("catpositionfetch").style.display = "none";
          document.getElementById("searchinnav").style.display = "none";
          document.getElementById("wishicons").style.display = "none";
          document.getElementById("logoinnav").style.display = "none";
        } else {
          document.getElementById("catpositionfetch").style.display = "none";
          document.getElementById("searchinnav").style.display = "block";
          document.getElementById("wishicons").style.display = "inline";
          document.getElementById("logoinnav").style.display = "inline";
        }

      });

    } else {
      document.getElementById('hidemeinallpage').style.display = 'none'
      document.getElementById("catpositionfetch").style.display = "none";
      document.getElementById("searchinnav").style.display = "block";
      document.getElementById("wishicons").style.display = "inline";
      document.getElementById("logoinnav").style.display = "inline";
    }

    setTimeout(function() {
      window.scrollTo(0, 0);
    }, 1000)


    var me = $users.get('mySelf');

    var now = new Date();
    var timeSpent = (now.getTime() - startTime.getTime()) / 1000;
    startTime = new Date();
    // console.log('time spent', timeSpent, 'on', $rootScope.previousState);


    function getCookie(cname) {
      // console.log(cname, '##################################');
      var name = cname + "=";
      var decodedCookie = decodeURIComponent(document.cookie);
      // console.log(decodedCookie, 'hhhhhhhhhhhhhhhhhhhhhh');
      var ca = decodedCookie.split(';');
      // console.log(ca);
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
          c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
        }
      }
      return "";
    }

    function setCookie(cname, cvalue, exdays) {
      // console.log('set cookie');
      var d = new Date();
      d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
      var expires = "expires=" + d.toUTCString();
      document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    if (me != null) {
      if ($rootScope.previousState == '') {
        // console.log('logged in ');
        dataToSend = {
          user: me.pk,
          typ: 'loggedIn'
        }

      }

      if ($rootScope.previousState == 'details') {
        var data = {
          timeSpent: timeSpent,
          product: fromParams.id
        }
        data = JSON.stringify(data)
        dataToSend = {
          user: me.pk,
          typ: 'productView',
          product: fromParams.id,
          data: data
        }
        $http({
          method: 'POST',
          url: '/api/ecommerce/activities/',
          data: dataToSend
        }).
        then(function(response) {})
      }

      if ($rootScope.previousState == 'categories') {
        var data = {
          timeSpent: timeSpent,
          category: fromParams.name
        }
        data = JSON.stringify(data)
        dataToSend = {
          user: me.pk,
          typ: 'categoryView',
          data: data
        }
        $http({
          method: 'POST',
          url: '/api/ecommerce/activities/',
          data: dataToSend
        }).
        then(function(response) {})
      }
    } else {
      // console.log('cookieeee', $rootScope.previousState);
      if ($rootScope.previousState == 'details') {
        // console.log(fromParams);
        var data = {
          timeSpent: timeSpent,
          product: fromParams.id
        }
        data = JSON.stringify(data)
        dataToSend = {
          typ: 'productView',
          product: fromParams.id,
          data: data
        }
        detail = getCookie("unknownUserRecentViewed");
        if (detail != "") {
          // console.log('already there');
          document.cookie = encodeURIComponent("unknownUserRecentViewed") + "=deleted; expires=" + new Date(0).toUTCString()
        }
        setCookie("unknownUserRecentViewed", JSON.stringify(dataToSend), 365);
      }
    }

  });
}]);

app.config(function($stateProvider) {

  $stateProvider
    .state('ecommerce', {
      url: "/",
      templateUrl: '/static/ngTemplates/app.ecommerce.next.html',
      controller: 'controller.ecommerce.list'
    })

  $stateProvider
    .state('details', {
      url: "/details/:id/:name/:sku",
      templateUrl: '/static/ngTemplates/app.ecommerce.details.next.html',
      controller: 'controller.ecommerce.details'
    })

  $stateProvider
    .state('blog', {
      url: "/blog",
      templateUrl: '/static/ngTemplates/app.ecommerce.blog.html',
      controller: 'controller.ecommerce.blog'
    })
  $stateProvider.state('orderSuccessful', {
    url: "/orderSuccessful/",
    templateUrl: '/static/ngTemplates/app.eccommerce.orderSuccessfull.next.html',
    controller: 'controller.ecommerce.orderSuccessfull'
  })
  $stateProvider.state('orderFailure', {
    url: "/orderFailure",
    templateUrl: '/static/ngTemplates/app.ecommerce.orderFailure.html',
    controller: 'controller.ecommerce.orderFailure'
  })


  $stateProvider
    .state('pages', {
      url: "/:title",
      templateUrl: '/static/ngTemplates/app.ecommerce.PagesDetails.html',
      controller: 'controller.ecommerce.PagesDetails'
    })


  $stateProvider
    .state('categories', {
      url: "/categories/:name",
      templateUrl: '/static/ngTemplates/app.ecommerce.categories.next.html',
      controller: 'controller.ecommerce.categories'
    })

  $stateProvider
    .state('categories_mobile', {
      url: "/categories_mobile/",
      templateUrl: '/static/ngTemplates/app.ecommerce.categories_mobile.next.html',
      controller: 'controller.ecommerce.categories_mobile'
    })

  $stateProvider
    .state('explore', {
      url: "/explore/",
      templateUrl: '/static/ngTemplates/app.ecommerce.explore.html',
      controller: 'controller.ecommerce.explore'
    })
  $stateProvider
    .state('search', {
      url: "/search/",
      templateUrl: '/static/ngTemplates/app.ecommerce.search.html',
      controller: 'controller.ecommerce.search'
    })
  $stateProvider
    .state('expand', {
      url: "/expand/",
      templateUrl: '/static/ngTemplates/app.ecommerce.expand.html',
      controller: 'controller.ecommerce.expand'
    })

  $stateProvider
    .state('checkout', {
      url: "/checkout/:pk",
      templateUrl: '/static/ngTemplates/app.ecommerce.checkout.next.html',
      controller: 'controller.ecommerce.checkout'
    })
  // $stateProvider
  //   .state('setupstore', {
  //     url: "/setupStore/",
  //     templateUrl: '/static/ngTemplates/app.ecommerce.partnerlogin.html',
  //     controller: 'controller.ecommerce.setupstore'
  //   })


  $stateProvider
    .state('account', {
      url: "/user/account",
      views: {
        "": {
          templateUrl: '/static/ngTemplates/app.ecommerce.account.html',
        },
        "menu@account": {
          templateUrl: '/static/ngTemplates/app.ecommerce.account.menu.html',
        },
        "topMenu@account": { //this is for top menu for mobile view
          templateUrl: '/static/ngTemplates/app.ecommerce.account.topMenu.html',
        },
        "@account": {
          templateUrl: '/static/ngTemplates/app.ecommerce.account.default.html',
        }
      }
    })

    .state('account.cart', {
      url: "/cart",
      templateUrl: '/static/ngTemplates/app.ecommerce.account.cart.html',
      controller: 'controller.ecommerce.account.cart'
    })
    .state('account.orders', {
      url: "/orders",
      templateUrl: '/static/ngTemplates/app.ecommerce.account.orders.item.html',
      controller: 'controller.ecommerce.account.orders'
    })
    .state('account.settings', {
      url: "/settings",
      templateUrl: '/static/ngTemplates/app.ecommerce.account.settings.html',
      controller: 'controller.ecommerce.account.settings'
    })
    .state('account.support', {
      url: "/support",
      templateUrl: '/static/ngTemplates/app.ecommerce.account.support.html',
      controller: 'controller.ecommerce.account.support'
    })
    .state('account.saved', {
      url: "/saved",
      templateUrl: '/static/ngTemplates/app.ecommerce.account.saved.html',
      controller: 'controller.ecommerce.account.saved'
    })



});


app.controller('controller.ecommerce.search', function($scope, $rootScope, $state, $http, $timeout, $uibModal, $users, Flash, $window) {

  $scope.openDetails = function(id, name, sku) {
    $state.go('details', {
      id: id,
      name: name,
      sku: sku
    })
  }


  $scope.addToCart = function(model) {



    // for (var i = 0; i < $rootScope.inCart.length; i++) {
    //   if ($rootScope.inCart[i].product.pk == model.pk) {
    //     if ($rootScope.inCart[i].prodSku!=model.serialNo) {
    //       Flash.create('warning' , 'You cant buy product and combo together')
    //       return
    //     }
    //   }
    // }



    // console.log('coming here', model);
    var dataToSend = {
      product: model.pk,
      qty: model.minTrashold,
      typ: 'cart',
      user: $users.get('mySelf').pk,
      prodSku: model.serialNo,
    }
    // console.log(dataToSend);
    $http({
      method: 'POST',
      url: '/api/ecommerce/cart/',
      data: dataToSend
    }).
    then(function(response) {
      $scope.match.model.added = model.minTrashold;

      var prod_variants = response.data.product.product_variants
      for (var i = 0; i < prod_variants.length; i++) {
        if (prod_variants[i].sku == response.data.prodSku) {
          response.data.prod_var = prod_variants[i]
        }
      }

      $rootScope.inCart.push(response.data);
    });
  }



  $scope.incrementCart = function(modal) {
    // console.log(modal, 'aaaaaaaaaaaaaaaaaaaaaaa');
    // $scope.match.model.added++
    if ($scope.match.model.added < modal.orderTrashold) {
      $scope.match.model.added++
    } else {
      // Flash.create('warning','You cannot order more than '+String($scope.list.added_cart))
      return

    }
    for (var i = 0; i < $rootScope.inCart.length; i++) {
      if ($rootScope.inCart[i].product.pk == modal.pk) {
        if ($rootScope.inCart[i].typ == 'cart') {
          $rootScope.inCart[i].qty = $rootScope.inCart[i].qty + 1;
          $http({
            method: 'PATCH',
            url: '/api/ecommerce/cart/' + $rootScope.inCart[i].pk + '/',
            data: {
              qty: $rootScope.inCart[i].qty
            }
          }).
          then(function(response) {})
        }
      }
    }
  }
  $scope.decrementCart = function(modal) {
    $scope.match.model.added--
    for (var i = 0; i < $rootScope.inCart.length; i++) {
      if ($rootScope.inCart[i].product.pk == modal.pk) {
        if ($rootScope.inCart[i].typ == 'cart') {
          if ($scope.match.model.added == 0 || $scope.match.model.added < modal.minTrashold) {
            $rootScope.inCart[i].qty = $rootScope.inCart[i].qty - 1;
            $http({
              method: 'DELETE',
              url: '/api/ecommerce/cart/' + $rootScope.inCart[i].pk + '/',
            }).
            then(function(response) {
              Flash.create('success', 'Removed From Cart');
              $scope.match.model.added = 0
            })
            $rootScope.inCart.splice(i, 1)
          } else if ($scope.match.model.added != 0) {
            $rootScope.inCart[i].qty = $rootScope.inCart[i].qty - 1;
            $http({
              method: 'PATCH',
              url: '/api/ecommerce/cart/' + $rootScope.inCart[i].pk + '/',
              data: {
                qty: $rootScope.inCart[i].qty
              }
            }).
            then(function(response) {})

          }
        }
      }
    }
  }






  // console.log('bloggggggggggggggggggggggggggggggggggg', BRAND_TITLE);
  $scope.genericProductSearch = function(query) {
    return $http.get('/api/ecommerce/searchProduct/?search=' + query + '&limit=6').
    then(function(response) {
      if (query != "") {
        $scope.matchedproducts = response.data;
        console.log(response.data);
      } else {
        $scope.matchedproducts = ""
      }

    })
  };

})

app.controller('controller.ecommerce.orderSuccessfull', function($scope, $rootScope, $state, $http, $timeout, $uibModal, $users, Flash, $window) {
  console.log('bloggggggggggggggggggggggggggggggggggg', location.href);

  $scope.isStoreGlobal = settings_isStoreGlobal;
  console.log($scope.isStoreGlobal, 'jjjfgfdhgshfghsks');

  $scope.currency = settings_currencySymbol;

  var prts = location.href.split('orderid=')
  $scope.orderID = prts[prts.length - 1]



  $http({
    method: 'GET',
    url: '/api/ecommerce/order/' + $scope.orderID + '/'
  }).
  then(function(response) {
    $scope.order = response.data;
    console.log($scope.order.orderQtyMap);
    $scope.orderq = $scope.order.orderQtyMap



    for (var i = 0; i < $scope.orderq.length; i++) {
      if ($scope.orderq[i].prodSku == $scope.orderq[i].product.product.serialNo) {
        $scope.orderq[i].image = $scope.orderq[i].product.product.displayPicture
      } else {
        for (var j = 0; j < $scope.orderq[i].prodVar.length; j++) {
          if ($scope.orderq[i].prodSku == $scope.orderq[i].prodVar[j].sku) {
            $scope.orderq[i].image = $scope.orderq[i].prodVar[j].prodImage
          }
        }
      }

    }
  })
  // $http({method : 'GET' , url : '/api/ecommerce/orderQtyMap/'+ $scope.orderqty +'/'}).
  // then(function(response) {
  //   $scope.orderq = response.data;
  //   console.log($scope.orderq ,'llll');
  // })





})

app.controller('controller.ecommerce.orderFailure', function($scope, $rootScope, $state, $http, $timeout, $uibModal, $users, Flash, $window) {
  // console.log('bloggggggggggggggggggggggggggggggggggg', BRAND_TITLE);


  // var prts  = location.href.split('orderid=')
  // $scope.orderID = prts[prts.length -1]

  // $scope.pay = function() {
  //   $scope.dataToSend.modeOfPayment = $scope.data.modeOfPayment
  //   $scope.dataToSend.modeOfShopping = 'online'
  //   $scope.dataToSend.paidAmount = 0
  //   $scope.dataToSend.approved = false
  //   $scope.data.stage = 'processing'
  //   if ($scope.shippingCharges > 0) {
  //     $scope.dataToSend.shippingCharges = $scope.shippingCharges
  //   }
  //
  //   $http({
  //     method: 'POST',
  //     url: '  /api/ecommerce/createOrder/',
  //     data: $scope.dataToSend
  //   }).
  //   then(function(response) {
  //     window.location = '/makeOnlinePayment/?orderid=' + response.data.odnumber;
  //   })
  // }

  $scope.orderID = 261
  $scope.orderqty = 513
  $scope.payMoney = function() {
    window.location = '/makeOnlinePayment/?orderid=' + $scope.orderID;
  }

})

app.controller('controller.ecommerce.blog', function($scope, $rootScope, $state, $http, $timeout, $uibModal, $users, Flash, $window) {
  // console.log('bloggggggggggggggggggggggggggggggggggg', BRAND_TITLE);
  $window.scrollTo(0, 0)
  document.title = BRAND_TITLE + ' |  Blog'
  document.querySelector('meta[name="description"]').setAttribute("content", BRAND_TITLE + ' Online Shopping Blogs')

  $scope.showNext = false
  $scope.showPrev = false
  $scope.start = 0
  $scope.rangeNo = 3
  $scope.end = $scope.start + $scope.rangeNo
  $scope.bData = function(start, end) {
    if (start > 0) {
      $scope.showPrev = true
    } else {
      $scope.showPrev = false
    }
    if (end >= $scope.blogFullLength) {
      $scope.showNext = false
    } else {
      $scope.showNext = true
    }
    $scope.blogData = $scope.blogFullData.slice(start, end)
  }
  $scope.change = function(a) {
    if (a == 'nxt') {
      $scope.start = $scope.end
      $scope.end = $scope.start + $scope.rangeNo
      $scope.bData($scope.start, $scope.end)
    } else if (a == 'prev') {
      $scope.end = $scope.start
      $scope.start = $scope.end - $scope.rangeNo
      $scope.bData($scope.start, $scope.end)
    }
    window.scrollTo(0, 0);
  }
  $http({
    method: 'GET',
    url: '/api/ecommerce/genericImage/'
  }).
  then(function(response) {
    if (response.data.length > 0) {
      $scope.genericImage = response.data[0]
    } else {
      $scope.genericImage = {}
    }
  })
  $http({
    method: 'GET',
    url: '/api/PIM/blog/?homeBlog'
  }).
  then(function(response) {
    $scope.blogFullData = response.data
    $scope.blogFullLength = response.data.length
    $scope.bData($scope.start, $scope.end)
  })

})


app.controller('ecommerce.search.typeheadResult', function($scope, $rootScope, $state, $http, $timeout, $uibModal, $users, Flash, $window) {
  $scope.genericSearchImage = $rootScope.genericImage
  $scope.me = $users.get('mySelf');
  // if($scope.me!=null){
  $scope.$watch('match', function(newValue, oldValue) {
    // console.log($scope.match);
    $scope.match.model.added = 0
    if ($scope.me) {
      if ($rootScope.inCart != undefined) {
        for (var i = 0; i < $rootScope.inCart.length; i++) {
          if ($scope.match.model.serialNo) {
            if ($scope.match.model.serialNo == $rootScope.inCart[i].prodSku) {
              $scope.match.model.added = $rootScope.inCart[i].qty
              break;
            }
          }
        }
      }
    }
    if (!$scope.me) {
      if ($rootScope.addToCart != undefined) {
        for (var i = 0; i < $rootScope.addToCart.length; i++) {
          if ($scope.match.model.serialNo) {
            if ($scope.match.model.serialNo == $rootScope.addToCart[i].prodSku) {
              $scope.match.model.added = $rootScope.addToCart[i].qty
              break;
            }
          }
        }
      }
    }
  })

  $scope.searchImage = false


  // $http.get('/api/ERP/appSettings/?app=25&name__iexact=searchImage').
  // then(function(response) {
  //   if (response.data[0] != null) {
  //     if (response.data[0].flag) {
  //       $scope.searchImage = true
  //     }
  //   }
  // });
  $scope.searchImage = settings_searchImage
  $scope.isTopMenu = settings_topIcon

  $scope.addToCart = function(model) {



    // for (var i = 0; i < $rootScope.inCart.length; i++) {
    //   if ($rootScope.inCart[i].product.pk == model.pk) {
    //     if ($rootScope.inCart[i].prodSku!=model.serialNo) {
    //       Flash.create('warning' , 'You cant buy product and combo together')
    //       return
    //     }
    //   }
    // }



    // console.log('coming here', model);
    var dataToSend = {
      product: model.pk,
      qty: model.minTrashold,
      typ: 'cart',
      user: $users.get('mySelf').pk,
      prodSku: model.serialNo,
    }
    // console.log(dataToSend);
    $http({
      method: 'POST',
      url: '/api/ecommerce/cart/',
      data: dataToSend
    }).
    then(function(response) {
      $scope.match.model.added = model.minTrashold;

      var prod_variants = response.data.product.product_variants
      for (var i = 0; i < prod_variants.length; i++) {
        if (prod_variants[i].sku == response.data.prodSku) {
          response.data.prod_var = prod_variants[i]
        }
      }

      $rootScope.inCart.push(response.data);
    });
  }

  $scope.incrementCart = function(modal) {
    // console.log(modal, 'aaaaaaaaaaaaaaaaaaaaaaa');
    // $scope.match.model.added++
    if ($scope.match.model.added < modal.orderTrashold) {
      $scope.match.model.added++
    } else {
      // Flash.create('warning','You cannot order more than '+String($scope.list.added_cart))
      return

    }
    for (var i = 0; i < $rootScope.inCart.length; i++) {
      if ($rootScope.inCart[i].product.pk == modal.pk) {
        if ($rootScope.inCart[i].typ == 'cart') {
          $rootScope.inCart[i].qty = $rootScope.inCart[i].qty + 1;
          $http({
            method: 'PATCH',
            url: '/api/ecommerce/cart/' + $rootScope.inCart[i].pk + '/',
            data: {
              qty: $rootScope.inCart[i].qty
            }
          }).
          then(function(response) {})
        }
      }
    }
  }
  $scope.decrementCart = function(modal) {
    $scope.match.model.added--
    for (var i = 0; i < $rootScope.inCart.length; i++) {
      if ($rootScope.inCart[i].product.pk == modal.pk) {
        if ($rootScope.inCart[i].typ == 'cart') {
          if ($scope.match.model.added == 0 || $scope.match.model.added < modal.minTrashold) {
            $rootScope.inCart[i].qty = $rootScope.inCart[i].qty - 1;
            $http({
              method: 'DELETE',
              url: '/api/ecommerce/cart/' + $rootScope.inCart[i].pk + '/',
            }).
            then(function(response) {
              Flash.create('success', 'Removed From Cart');
              $scope.match.model.added = 0
            })
            $rootScope.inCart.splice(i, 1)
          } else if ($scope.match.model.added != 0) {
            $rootScope.inCart[i].qty = $rootScope.inCart[i].qty - 1;
            $http({
              method: 'PATCH',
              url: '/api/ecommerce/cart/' + $rootScope.inCart[i].pk + '/',
              data: {
                qty: $rootScope.inCart[i].qty
              }
            }).
            then(function(response) {})

          }
        }
      }
    }
  }

  function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    // console.log(decodedCookie, 'hhhhhhhhhhhhhhhhhhhhhh');
    var ca = decodedCookie.split(';');
    // console.log(ca);
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  function setCookie(cname, cvalue, exdays) {
    // console.log('set cookie');
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }

  $scope.addToCartCookie = function(model) {
    $http({
      method: 'GET',
      url: '/api/ecommerce/listing/' + model.pk + '/'
    }).
    then(function(response) {
      // console.log(model.serialNo);
      // console.log(response.data.product.howMuch);
      if (response.data.product.howMuch == null) {
        return
      }
      for (var i = 0; i < response.data.product_variants.length; i++) {
        if (response.data.product_variants[i].sku == model.serialNo) {
          // console.log('hereeeee');
          $scope.item = {
            'productName': response.data.product.name,
            'qty': response.data.product_variants[i].startingThreshold,
            'prodSku': response.data.product_variants[i].sku,
            'prod_howMuch': response.data.product_variants[i].unitPerpack,
            'price': response.data.product_variants[i].discount,
            'unit': response.data.product_variants[i].unit,
            'prodPk': response.data.pk
          }
          break;
        } else {
          $scope.item = {
            'productName': response.data.product.name,
            'qty': response.data.product.startingTrashold,
            'prodSku': response.data.product.serialNo,
            'prod_howMuch': response.data.product.howMuch,
            'price': response.data.product.discount,
            'unit': response.data.product.unit,
            'prodPk': response.data.pk
          }
        }
      }

      if (response.data.product_variants.length == 0) {
        $scope.item = {
          'productName': response.data.product.name,
          'qty': response.data.product.startingTrashold,
          'prodSku': response.data.product.serialNo,
          'prod_howMuch': response.data.product.howMuch,
          'price': response.data.product.discount,
          'unit': response.data.product.unit,
          'prodPk': response.data.pk
        }
      }

      // $scope.item = {'productName':response.data.product.name,'qty':1 , 'prodSku': $scope.match.model.serialNo , 'prod_howMuch':$scope.match.model.howMuch , 'price':$scope.selectedProdVar.amnt ,'unit':$scope.match.model.unit , 'prodPk': $scope.list.pk}
      //
      // $scope.item = {
      //   'product': response.data,
      //   'qty': 1
      // }
      detail = getCookie("addToCart");
      if (detail != "") {
        // console.log('already there');
        $rootScope.addToCart = JSON.parse(detail)
        document.cookie = encodeURIComponent("addToCart") + "=deleted; expires=" + new Date(0).toUTCString()
      }
      // console.log($scope.item);
      $rootScope.addToCart.push($scope.item)
      console.log($scope.item);
      $scope.match.model.added = $scope.item.qty;
      setCookie("addToCart", JSON.stringify($rootScope.addToCart), 365);
      // console.log($rootScope.addToCart);
    })
  }
  $scope.incrementCookie = function(details) {
    // $scope.match.model.added++
    if ($scope.match.model.added < details.orderTrashold) {
      $scope.match.model.added++
    } else {
      Flash.create('warning', 'You cannot order more than ' + String($scope.list.added_cart))
      return

    }
    for (var i = 0; i < $rootScope.addToCart.length; i++) {
      // console.log(details.pk, 'aaaaaaaaaaaaa');
      if ($rootScope.addToCart[i].prodSku == details.serialNo) {
        $rootScope.addToCart[i].qty = $rootScope.addToCart[i].qty + 1
        setCookie("addToCart", JSON.stringify($rootScope.addToCart), 365);
      }
    }
  }

  $scope.decrementCookie = function(details) {
    $scope.match.model.added--
    console.log(details, 'pppppppppppppp');
    for (var i = 0; i < $rootScope.addToCart.length; i++) {
      if ($rootScope.addToCart[i].prodSku == details.serialNo) {
        // $rootScope.addToCart[i].qty = $rootScope.addToCart[i].qty-1
        // setCookie("addToCart", JSON.stringify($rootScope.addToCart) , 365);
        if ($scope.match.model.added == 0 || $scope.match.model.added < details.minTrashold) {
          setCookie("addToCart", "", -1, '/');
          $rootScope.addToCart.splice(i, 1);
          setCookie("addToCart", JSON.stringify($rootScope.addToCart), 365);
          $scope.match.model.added = 0
          return
        } else {
          $rootScope.addToCart[i].qty = $rootScope.addToCart[i].qty - 1
          setCookie("addToCart", JSON.stringify($rootScope.addToCart), 365);
          return
        }
      }
    }
  }
})

app.controller('ecommerce.body', function($scope, $rootScope, $state, $http, $timeout, $uibModal, $users, Flash, $window) {


  // console.log($rootScope.addToCart, 'aaaaaaaaaaaaaaaaaaaagggggggggggggggggggggggg');

  $scope.var1 = "hello";

  // $scope.cart = $rootScope.inCart;
  $scope.data = {
    total: 0
  };

  $scope.$watch('inCart', function(newValue, oldValue) {
    $scope.data.total = 0;
    var price = 0;
    for (var i = 0; i < $rootScope.inCart.length; i++) {
      if ($rootScope.inCart[i].prodSku == $rootScope.inCart[i].product.product.serialNo) {
        price = $rootScope.inCart[i].product.product.discount
      } else {
        price = $rootScope.inCart[i].prodVarPrice
      }
      $scope.data.total += price * $rootScope.inCart[i].qty
      // console.log($scope.data.total);
    }
  }, true)

  $scope.checkout = function() {
    $state.go('checkout', {
      pk: 'cart'
    });
    $timeout(function() {
      window.scrollTo(0, 0);
    }, 1000)
  }






  $scope.changeQty = function(value, data) {
    // for (var i = 0; i < $rootScope.inCart.length; i++) {
    // if ($rootScope.inCart[i].product.pk == value) {
    if ($rootScope.inCart[value].typ == 'cart') {
      if (data == 'increase') {

        if ($rootScope.inCart[value].prod_var) {
          if ($rootScope.inCart[value].qty < $rootScope.inCart[value].prod_var.orderThreshold) {
            $rootScope.inCart[value].qty = $rootScope.inCart[value].qty + 1;
          } else {
            Flash.create('warning', 'You cannot order more than ' + String($rootScope.inCart[value].qty))
            return
          }
        } else {
          if ($rootScope.inCart[value].qty < $rootScope.inCart[value].product.product.orderTrashold) {
            $rootScope.inCart[value].qty = $rootScope.inCart[value].qty + 1;
          } else {
            Flash.create('warning', 'You cannot order more than ' + String($rootScope.inCart[value].qty))
            return
          }
        }
      }
      if (data == 'decrease') {
        $rootScope.inCart[value].qty = $rootScope.inCart[value].qty - 1;
      }
      if ($rootScope.inCart[value].qty > 0) {
        $http({
          method: 'PATCH',
          url: '/api/ecommerce/cart/' + $rootScope.inCart[value].pk + '/',
          data: {
            qty: $rootScope.inCart[value].qty
          }
        }).
        then(function(response) {

        })
      } else if ($rootScope.inCart[value].qty == 0) {
        $http({
          method: 'DELETE',
          url: '/api/ecommerce/cart/' + $rootScope.inCart[value].pk + '/',
        }).
        then(function(response) {
          Flash.create('success', 'Removed From Cart');

        })
        $rootScope.inCart.splice(value, 1)
        return
      }

    }
    // }

    // }
  }

  function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }


  $scope.updateCookieDetail = function(indx, value) {
    if (value == "increase") {
      $rootScope.addToCart[indx].qty++
      setCookie("addToCart", JSON.stringify($rootScope.addToCart), 365);
      return
    }
    if (value == "decrease") {
      $rootScope.addToCart[indx].qty--
      if ($rootScope.addToCart[indx].qty == 0) {
        setCookie("addToCart", "", -1, '/');
        $rootScope.addToCart.splice(indx, 1);
        setCookie("addToCart", JSON.stringify($rootScope.addToCart), 365);
        return
      } else {
        setCookie("addToCart", JSON.stringify($rootScope.addToCart), 365);
        return
      }

    }

  }



  $scope.scrollme = function() {
    var scrollem = document.getElementById('continersss');
    scrollem.scrollTop -= 150;
  }

  $scope.scrollmedec = function() {
    var scrollem = document.getElementById('continersss');
    scrollem.scrollTop += 150;
  }

  // $http({
  //   method: 'GET',
  //   url: '/api/ecommerce/listingLite/'
  // }).
  // then(function(response) {
  //   for (var i = 0; i < response.data.length; i++) {
  //     for (var j = 0; j < $rootScope.addToCart.length; j++) {
  //       console.log(response.data[i] , 'hhhhhhhhhhhhhh');
  //       if (response.data[i].pk == $rootScope.addToCart[j].product.pk) {
  //         $rootScope.addToCart[j].in_stock = response.data[i].in_stock
  //
  //       }
  //     }
  //   }
  //
  // })








  $scope.$watch('addToCart', function(newValue, oldValue) {
    $scope.data.totalVal = 0;
    if ($rootScope.addToCart != undefined) {
      for (var i = 0; i < $rootScope.addToCart.length; i++) {
        $scope.data.totalVal += $rootScope.addToCart[i].price * $rootScope.addToCart[i].qty
      }
    }
  }, true)


  $scope.mainPage = function() {
    window.location = '/login';
  }
  $rootScope.genericImage = {}
  $http({
    method: 'GET',
    url: '/api/ecommerce/genericImage/'
  }).
  then(function(response) {
    if (response.data.length > 0) {
      $rootScope.genericImage = response.data[0]
    }
  })
});


app.controller('controller.ecommerce.PagesDetails', function($scope, $rootScope, $state, $http, $timeout, $uibModal, $users, Flash, $window) {

  // $scope.data = $scope.$parent.data; // contains the pickUpTime , location and dropInTime
  // $window.scrollTo(0, 0)
  // window.scroll({
  //   top: 0,
  //   left: 0,
  //   behavior: 'smooth'
  // });

  // alert(window.scrollY);
  // console.log(window.top,'toppppp');
  document.title = BRAND_TITLE + ' |  ' + $state.params.title.split('-').join(' ')
  document.querySelector('meta[name="description"]').setAttribute("content", BRAND_TITLE + ' Online Shopping')

  $scope.title = $state.params.title

  if ($scope.title == undefined || $scope.title == '') {
    $state.go('ecommerce', {})
  } else if ($scope.title == 'faq' || $scope.title == 'contact-us') {
    $state.go('account.support', {})
  } else {
    $http({
      method: 'GET',
      url: '/api/ecommerce/pages/?pageurl__icontains=' + $scope.title
    }).
    then(function(response) {
      if (response.data.length > 0) {
        $scope.pageData = response.data[0];
        $scope.typ = 'page'
        // var scrollTop     = $(window).scrollTop()
        //
        // console.log(scrollTop,'toppp');
        // setTimeout(function () {
        //   var elem =  $('#topelement');
        //   elementOffset = $('#topelement').offset().top,
        //    distance  = (elementOffset - scrollTop);
        //    console.log(distance,'distance');
        //    elem.scrollTop(-331)
        //    Offset = $('#topelement').offset().top,
        //
        //    console.log(Offset,'offset');
        // }, 5000);

      } else {
        $http({
          method: 'GET',
          url: '/api/PIM/blog/?shortUrl__icontains=' + $scope.title + '&homeBlog'
        }).
        then(function(response) {
          if (response.data.length > 0) {
            $scope.blogData = response.data[0]
            $scope.typ = 'blog'
          } else {
            $scope.typ = 'nothing'
            $state.go('ecommerce', {})
          }
        }, function(err) {
          $scope.typ = 'nothing'
          $state.go('ecommerce', {})
        })
      }
    })
  }


});

app.controller('controller.ecommerce.details', function($scope, $rootScope, $state, $http, $timeout, $uibModal, $users, Flash, $window, ngMeta, $filter, Flash, $location) {









  $scope.imagecall = function(image) {
    $scope.imgData = image
  }

  $scope.customisedData = {
    'image': emptyFile,
    'data': ''
  }
  $scope.customdeliverytime = false;
  $scope.uploadcustomimg = function() {
    var fd = new FormData()
    if ($scope.customisedData.image != null && $scope.customisedData.image != emptyFile) {
      fd.append('image', $scope.customisedData.image);

    }
    if ($scope.customisedData.data.length > 0) {
      fd.append('data', $scope.customisedData.data);
    }

    var method = 'POST'
    var url = '/api/ecommerce/customization/'
    if ($scope.customisedData.pk) {
      method = 'PATCH'
      url = url + $scope.customisedData.pk + '/'
    }

    $http({
      method: method,
      url: url,
      data: fd,
      transformRequest: angular.identity,
      headers: {
        'Content-Type': undefined
      }
    }).
    then(function(response) {
      console.log(response.data);
      $scope.customdeliverytime = true;
      $scope.customisedData = response.data
      if ($scope.cartPk && $scope.details.added_cart > 0) {
        $http({
          method: 'PATCH',
          url: '/api/ecommerce/cart/' + $scope.details.pk + '/',
          data: {
            customization: $scope.customisedData.pk
          },
        })
      }
    })

  }

  $scope.deletecustomimg = function() {
    var url = '/api/ecommerce/customization/' + $scope.customisedData.pk + '/'

    $http({
      method: 'DELETE',
      url: url,
      transformRequest: angular.identity,
      headers: {
        'Content-Type': undefined
      }
    }).
    then(function(response) {
      $scope.customdeliverytime = false;
      $scope.customisedData = {
        'image': emptyFile,
        'data': ''
      }

    })
  }
  // var promise = $http.get('/api/ecommerce/listingLite/' + $state.params.id + '/');
  // promise.then(
  //   function(payload) {
  //     $scope.discountedpriceprod = payload.data.product.discount;
  //     $scope.bulkChartpriceprod = payload.data.bulkChart;
  //     for (var i = 0; i < $scope.bulkChartpriceprod.length; i++) {
  //       var unitprice = Math.round($scope.discountedpriceprod-(($scope.discountedpriceprod/100)*$scope.bulkChartpriceprod[i].discount))
  //       $scope.bulkChartpriceprod[i]['unitprice']=unitprice;
  //     }
  //
  //   });



  $scope.curoselvertical_properties = {
    lazyLoad: true,
    items: 4,
    loop: true,
    autoplay: true,
    autoplayTimeout: 5000,
    dots: false,
    responsive: {
      0: {
        items: 1
      },
      600: {
        items: 1
      },
      1000: {
        items: 4
      }
    },
    navContainer: '.trendsNav ',
    navText: ["<i class='fa fa-chevron-left'></i>", "<i class='fa fa-chevron-right'></i>"],

  };





  $scope.call = function() {
    var fd = new FormData()
    fd.append('secretKey', 1234);
    fd.append('username', 'vikas');
    fd.append('email', 'vikas.m@cioc.in');
    fd.append('password', 123);
    $http({
      method: 'POST',
      url: '/socialMobileLogin',
      data: fd,
      transformRequest: angular.identity,
      headers: {
        'Content-Type': undefined
      }
    }).
    then(function(response) {
      location.reload();
    })
  }

  $scope.me = $users.get('mySelf');
  $scope.showRatings = false
  $scope.priceDisplay = false
  $scope.priceDisplay = settings_isPrice;
  $scope.showPrice = false
  if (!$scope.me && !$scope.priceDisplay) {
    $scope.showPrice = false
  } else {
    $scope.showPrice = true
  }

  $scope.currency = settings_currencySymbol;
  document.title = $state.params.name + ' Online At Best Price Only On ' + BRAND_TITLE
  // $http.get('/api/ERP/appSettings/?app=25&name__iexact=rating').
  // then(function(response) {
  //   console.log('ratingggggggggggggggggggg', response.data);
  //   if (response.data[0] != null) {
  //     if (response.data[0].flag) {
  //       $scope.showRatings = true
  //     }
  //   }
  // })
  $scope.showRatings = settings_rating
  $scope.isCod = false
  $scope.isCod = settings_isCOD

  $scope.showDescription = false
  // $http.get('/api/ERP/appSettings/?app=25&name__iexact=description').
  // then(function(response) {
  //   console.log('ratingggggggggggggggggggg', response.data);
  //   if (response.data[0] != null) {
  //     if (response.data[0].flag) {
  //       $scope.showDescription = true
  //     }
  //   }
  //   console.log($scope.showDescription);
  // })
  $scope.showDescription = settings_description
  $scope.next = ''
  $scope.data = $scope.$parent.data; // contains the pickUpTime , location and dropInTime'
  $scope.breadcrumbList = [];
  $scope.details = {};
  $window.scrollTo(0, 0)
  $scope.offset = 0
  $scope.reviews = []
  $scope.showOptions = true
  $scope.prodVariant = ''
  $scope.getRatings = function(offset) {
    $http({
      method: 'GET',
      url: '/api/ecommerce/rating/?productDetail=' + $scope.details.pk + '&limit=4&offset=' + offset
    }).
    then(function(response) {
      $scope.reviews = response.data.results
      $scope.next = response.data.next
    });
  }
  $http({
    method: 'GET',
    url: '/api/ecommerce/listingLite/' + $state.params.id + '/'
  }).
  then(function(response) {
    $scope.details = response.data
    $scope.discountedpriceprod = $scope.details.product.discount;
    $scope.bulkChartpriceprod = $scope.details.bulkChart;
    $scope.verticalcarousel = [];
    console.log($scope.details.files, 'ppppppppppppppppppppppppppppppp');
    if ($scope.details.files.length > 0) {
      for (var i = 0; i < $scope.details.files.length; i++) {
        $scope.verticalcarousel.push($scope.details.files[i].attachment);
      }
    } else {
      $scope.verticalcarousel.push($scope.details.product.displayPicture);
    }
    if ($scope.details.product_variants.length > 0) {
      for (var i = 0; i < $scope.details.product_variants.length; i++) {
        $scope.verticalcarousel.push($scope.details.product_variants[i].prodImage);
      }
    }

    if ($scope.details.product_variants.length > 0) {
      $scope.prodVariant = $scope.details.product_variants
    }
    $scope.imgData = $scope.details.product.displayPicture
    console.log($scope.details, 'ppppppppppppppppppppppp');
    if ($scope.details.files.length > 0) {
      $scope.imgData = $scope.details.files[0].attachment
    }

    // for (var i = 0; i < $scope.details.product_variants.length; i++) {
    //   console.log($state.params.sku,'#######################################');
    //   if ($scope.details.product_variants[i].sku == $state.params.sku) {
    //     console.log($scope.details.product_variants[i] , '###################################');
    //     $scope.prodVariant = $scope.details.product_variants[i]
    //   }
    // }

    // if (!$scope.me) {
    //   if ($rootScope.addToCart != undefined) {
    //     for (var i = 0; i < $rootScope.addToCart.length; i++) {
    //       if ($rootScope.addToCart[i].prodSku == $scope.details.prodSku) {
    //         $scope.details.added_cart = $rootScope.addToCart[i].qty
    //       }
    //     }
    //   }
    // }
    if ($rootScope.multiStore) {
      for (var i = 0; i < $scope.details.product.storeQty.length; i++) {
        if ($scope.details.product.storeQty[i].store.pincode == $rootScope.pin) {
          if ($scope.details.product.storeQty[i].quantity <= 0 && INVENTORY_ENABLED == 'True') {
            $scope.showOptions = false;
          } else {
            $scope.showOptions = true;
          }
        }
      }
    } else {

      if (INVENTORY_ENABLED != 'True') {
        $scope.details.product.inStock = 1000;
      }

      // if ($scope.details.product.inStock <= 0) {
      //   $scope.showOptions = false
      // }
    }
    console.log($scope.details, "^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^6");

    document.querySelector('meta[name="description"]').setAttribute("content", response.data.product.description)
    $scope.details.specifications = JSON.parse($scope.details.specifications)
    var parent = response.data.parentType
    while (parent) {
      $scope.breadcrumbList.push(parent.name)
      parent = parent.parent
    }
    $scope.getRatings($scope.offset)
    if ($rootScope.multiStore) {
      lurl = '/api/ecommerce/listingLite/?parentValue=' + $scope.details.parentType.pk + '&detailValue=' + $scope.details.pk + '&pin=' + $rootScope.pin + '&multipleStore'
    } else {
      lurl = '/api/ecommerce/listingLite/?parentValue=' + $scope.details.parentType.pk + '&detailValue=' + $scope.details.pk
    }
    $http({
      method: 'GET',
      url: lurl
    }).
    then(function(response) {
      $scope.suggest = response.data;
    });
  });


  $scope.calcunitprice = function() {
    console.log($scope.selectedProdVar.toWatch, "jjjjjjjjjjjjjjjjjjj");

    for (var i = 0; i < $scope.bulkChartpriceprod.length; i++) {
      var unitprice = Math.round($scope.selectedProdVar.toWatch.discount - (($scope.selectedProdVar.toWatch.discount / 100) * $scope.bulkChartpriceprod[i].discount))
      $scope.bulkChartpriceprod[i]['unitprice'] = unitprice;
    }
  }


  $timeout(function() {
    $scope.breadcrumbList = $scope.breadcrumbList.slice().reverse();
  }, 1000);


  $scope.ratings = {
    meta: [5, 4, 3, 2, 1],
    counts: [15, 10, 1, 1, 1],
    averageRating: 4.5
  };
  $scope.form = {
    rating: '',
    reviewText: '',
    reviewHeading: '',
    reviewEditor: false,
    ratable: true
  }

  $scope.pictureInView = 0;

  $scope.changePicture = function(pic) {
    $scope.pictureInView = pic;
  }



  $scope.addToCart = function(inputPk) {
    console.log(inputPk, 'pppppppppppppppppp');
    // $http({
    //   method: 'GET',
    //   url: '/api/ecommerce/cart/?user=' + $scope.me.pk
    // }).
    // then(function(response) {
    //   for (var i = 0; i < response.data.length; i++) {
    //     if (response.data[i].product.pk == dataToSend.product) {
    //       if (response.data[i].typ == 'cart') {
    //         Flash.create('warning', 'This Product is already in cart');
    //         return
    //       } else if (response.data[i].typ == 'favourite') {
    //         console.log("kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk");
    //         $http({
    //           method: 'PATCH',
    //           url: '/api/ecommerce/cart/' + response.data[i].pk + '/',
    //           data: {
    //             qty: 1,
    //             typ: 'cart'
    //           }
    //         }).
    //         then(function(response) {
    //           Flash.create('success', 'Product added to cart');
    //           $rootScope.inCart.push(response.data);
    //         })
    //         response.data[i].typ = 'cart'
    //         return
    //       }
    //     }
    //   }


    dataToSend = {
      product: inputPk,
      user: getPK($scope.me.url),
      qty: $scope.selectedObj.minThreshold,
      typ: 'cart',
      // customization:$scope.customisedData
    }

    if ($scope.selectedObj.prodDesc) {
      dataToSend.desc = $scope.selectedObj.prodDesc
    }


    if ($scope.customisedData != null) {
      dataToSend.customization = $scope.customisedData.pk
    }
    if ($scope.prodVariant.length > 0) {
      dataToSend.prodSku = $scope.selectedObj.sku
    } else {
      dataToSend.prodSku = $scope.details.product.serialNo
    }



    $http({
      method: 'POST',
      url: '/api/ecommerce/cart/',
      data: dataToSend
    }).
    then(function(response) {
      Flash.create('success', 'Product added in cart');
      console.log(response.data.customization, 'lllllllllllllll');
      if (response.data.customization != null) {
        $scope.customisedData = response.data.customization
      } else {
        $scope.customisedData = {
          'image': emptyFile,
          'data': ''
        }
      }
      $scope.cartPk = response.data.pk
      $scope.details.added_cart = $scope.selectedObj.minThreshold
      var prod_variants = response.data.product.product_variants
      for (var i = 0; i < prod_variants.length; i++) {
        if (prod_variants[i].sku == response.data.prodSku) {
          response.data.prod_var = prod_variants[i]
        }
      }

      $rootScope.inCart.push(response.data);
    })

  }

  $scope.increment = function(inputPk) {

    for (var i = 0; i < $rootScope.inCart.length; i++) {
      if ($rootScope.inCart[i].prodSku == $scope.selectedObj.sku) {
        if ($rootScope.inCart[i].typ == 'cart') {
          // if ($rootScope.inCart[i].prodSku!=$scope.selectedObj.sku) {
          //   Flash.create('warning' , 'You cant buy product and combo together')
          //   return
          // }
          if ($rootScope.inCart[i].qty < $scope.selectedObj.orderThreshold) {
            $rootScope.inCart[i].qty = $rootScope.inCart[i].qty + 1;

          } else {
            Flash.create('warning', 'You cannot order more than ' + String($rootScope.inCart[i].qty))
            return

          }

          // $rootScope.inCart[i].qty = $rootScope.inCart[i].qty + 1;
          $http({
            method: 'PATCH',
            url: '/api/ecommerce/cart/' + $rootScope.inCart[i].pk + '/',
            data: {
              qty: $rootScope.inCart[i].qty
            }
          }).
          then(function(response) {})


        }
      }
    }
    $scope.details.added_cart++

  }

  $scope.out_stock = true
  $scope.curoselvarpic_properties = {
    lazyLoad: false,
    items: 3,
    loop: true,
    autoplay: false,
    autoplayTimeout: 5000,
    dots: false,
    responsive: {
      479: {
        items: 3
      },
      600: {
        items: 1
      },
      1000: {
        items: 1,
      }
    },
  };
  $scope.decrement = function(inputPk) {
    $scope.details.added_cart--
    for (var i = 0; i < $rootScope.inCart.length; i++) {
      if ($rootScope.inCart[i].prodSku == $scope.selectedObj.sku) {
        if ($rootScope.inCart[i].typ == 'cart') {
          if ($scope.details.added_cart == 0 || $scope.details.added_cart < $scope.selectedObj.minThreshold) {
            $rootScope.inCart[i].qty = $rootScope.inCart[i].qty - 1;
            $http({
              method: 'DELETE',
              url: '/api/ecommerce/cart/' + $rootScope.inCart[i].pk + '/',
            }).
            then(function(response) {
              $scope.customisedData = {
                'image': emptyFile,
                'data': ''
              }
              Flash.create('success', 'Removed From Cart');

            })
            $rootScope.inCart.splice(i, 1)
            $scope.details.added_cart = 0
            $scope.details.added_saved = 0
          } else if ($scope.details.added_cart != 0) {
            $rootScope.inCart[i].qty = $rootScope.inCart[i].qty - 1;
            $http({
              method: 'PATCH',
              url: '/api/ecommerce/cart/' + $rootScope.inCart[i].pk + '/',
              data: {
                qty: $rootScope.inCart[i].qty
              }
            }).
            then(function(response) {})

          }
        }
      }
    }
  }


  $scope.buy = function(input) {
    $state.go('checkout', {
      pk: input.pk
    })
  }



  $scope.sendReview = function() {

    // if (mode == 'rating') {
    if ($scope.form.rating == '') {
      Flash.create('danger', 'Please provide rating')
    }
    // } else {
    if ($scope.form.reviewText == '') {
      Flash.create('danger', 'No review heading to post')
      return;
    }
    if ($scope.form.reviewHeading == '') {
      Flash.create('danger', 'No review to post')
      return;
    }
    //post request
    var toSend = {
      rating: $scope.form.rating,
      textVal: $scope.form.reviewText,
      headingVal: $scope.form.reviewHeading,
      // user:$scope.me.pk,
      productDetail: $scope.details.pk
    }
    $http({
      method: 'POST',
      url: '/api/ecommerce/rating/',
      data: toSend
    }).
    then(function(response) {
      if ($scope.reviews.length < 4) {
        $scope.reviews.push(response.data)
      } else {
        $scope.offset += 4
        $scope.getRatings($scope.offset)
      }
      Flash.create('success', 'Your review is added')
      $scope.form.rating = 0
      $scope.form.reviewText = ''
      $scope.form.reviewHeading = ''

    })

  }

  $scope.nextReviews = function() {
    $scope.offset = $scope.offset + 4
    $scope.getRatings($scope.offset)

  }
  $scope.prevReviews = function() {
    $scope.offset = $scope.offset - 4
    $scope.getRatings($scope.offset)

  }


  // $scope.getSuggestion = function() {
  //
  // }




  function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }


  function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }


  $scope.incrementCookie = function(details) {


    if ($scope.details.added_cart < $scope.selectedObj.orderThreshold) {
      $scope.details.added_cart++
    } else {
      Flash.create('warning', 'You cannot order more than ' + String($scope.details.added_cart))
      return

    }
    for (var i = 0; i < $rootScope.addToCart.length; i++) {
      if ($rootScope.addToCart[i].prodSku == $scope.selectedObj.sku) {
        $rootScope.addToCart[i].qty = $rootScope.addToCart[i].qty + 1
        setCookie("addToCart", JSON.stringify($rootScope.addToCart), 365);
      }
    }
  }

  $scope.decrementCookie = function(details) {
    $scope.details.added_cart--
    for (var i = 0; i < $rootScope.addToCart.length; i++) {
      if ($rootScope.addToCart[i].prodSku == $scope.selectedObj.sku) {
        // $rootScope.addToCart[i].qty = $rootScope.addToCart[i].qty-1
        // setCookie("addToCart", JSON.stringify($rootScope.addToCart) , 365);
        if ($scope.details.added_cart == 0 || $scope.details.added_cart < $scope.selectedObj.minThreshold) {
          setCookie("addToCart", "", -1, '/');
          $rootScope.addToCart.splice(i, 1);
          setCookie("addToCart", JSON.stringify($rootScope.addToCart), 365);
          $scope.details.added_cart = 0
          return
        } else {
          $rootScope.addToCart[i].qty = $rootScope.addToCart[i].qty - 1
          setCookie("addToCart", JSON.stringify($rootScope.addToCart), 365);
          return
        }
      }
    }
  }


  $scope.recentlyViewed = {}
  if ($scope.me != null) {
    if ($rootScope.multiStore) {
      rurl = '/api/ecommerce/activities/?user=' + $scope.me.pk + '&typ=productView&limit=2' + '&pin=' + $rootScope.pin + '&multipleStore'
    } else {
      rurl = '/api/ecommerce/activities/?user=' + $scope.me.pk + '&typ=productView&limit=2'
    }
    $http({
      method: 'GET',
      url: rurl
    }).
    then(function(response) {
      if (response.data.results.length > 0) {
        if (response.data.results[0].product.pk == $scope.details.pk) {
          if (response.data.results.length > 1) {
            $scope.recentlyViewed = response.data.results[1]


          }
        } else {
          $scope.recentlyViewed = response.data.results[0]


        }
      }

    })
  } else {
    detail = getCookie("unknownUserRecentViewed");
    if (detail != "") {
      $scope.recentlyViewed = JSON.parse(detail)
      $http({
        method: 'GET',
        url: '/api/ecommerce/listing/' + $scope.recentlyViewed.product + '/'
      }).
      then(function(response) {
        $scope.recentlyViewed.product = response.data


      })
    }
  }
  setTimeout(function() {}, 1000);



  $scope.createCookieDetail = function(product) {
    if ($rootScope.addToCart != undefined) {
      for (var i = 0; i < $rootScope.addToCart.length; i++) {
        if ($rootScope.addToCart[i].prodSku == $scope.selectedObj.sku) {
          Flash.create("warning", "Product Already in Cart")
          return
        }
      }
    }

    $scope.details.added_cart = $scope.selectedObj.minThreshold
    $scope.item = {
      'productName': $scope.details.product.name,
      'qty': $scope.selectedObj.minThreshold,
      'prodSku': $scope.selectedObj.sku,
      'prod_howMuch': $scope.selectedObj.qty,
      'price': $scope.selectedObj.amnt,
      'unit': $scope.selectedObj.unit,
      'prodPk': $scope.details.pk
    }

    if ($scope.selectedColor) {
      $scope.item.desc = $scope.selectedColor
    } else {
      $scope.item.desc = ""
    }

    // $scope.item = {
    //   'product': product,
    //   'qty': 1
    // }
    detail = getCookie("addToCart");
    $rootScope.addToCart = []
    if (detail != "") {
      $rootScope.addToCart = JSON.parse(detail)
      document.cookie = encodeURIComponent("addToCart") + "=deleted; expires=" + new Date(0).toUTCString()
    }
    $rootScope.addToCart.push($scope.item)
    setCookie("addToCart", JSON.stringify($rootScope.addToCart), 365);
  }

  if ($scope.currency == 'fa-usd') {
    $scope.currencyVal = '$'
  } else if ($scope.currency == 'fa-inr') {

    $scope.currencyVal = '₹'
  } else {
    $scope.currencyVal = ''
  }



  $scope.getProdVar = function() {
    $scope.selectedProdVar = {}
    $scope.prod_var = $scope.details.product_variants;
    $scope.prodVarList = []
    // $scope.details.product.unit = $filter('getUnit')($scope.details.product.unit);
    if (!$scope.showPrice) {
      var str = $filter('convertUnit')($scope.details.product.howMuch, $scope.details.product.unit)
    } else {
      var str = $filter('convertUnit')($scope.details.product.howMuch, $scope.details.product.unit) + ' -  ' + $scope.currencyVal + ' ' + $scope.details.product.discount
    }
    $scope.prodVarList = [{
      str: str,
      qty: $scope.details.product.howMuch,
      amnt: $scope.details.product.price,
      discount: $scope.details.product.discount,
      orderThreshold: $scope.details.product.orderTrashold,
      minThreshold: $scope.details.product.startingTrashold,
      unit: $scope.details.product.unit,
      sku: $scope.details.product.serialNo,
      specialOffer: $scope.details.product.specialOffer,
      inStock: $scope.details.product.stock
    }];

    if ($scope.prod_var) {
      for (var i = 0; i < $scope.prod_var.length; i++) {
        if (!$scope.showPrice) {
          str = $filter('convertUnit')($scope.prod_var[i].unitPerpack, $scope.prod_var[i].unit)
        } else {
          str = $filter('convertUnit')($scope.prod_var[i].unitPerpack, $scope.prod_var[i].unit) + ' -  ' + $scope.currencyVal + ' ' + $scope.prod_var[i].discount
        }
        $scope.prodVarList.push({
          pk: $scope.prod_var[i].id,
          str: str,
          qty: $scope.prod_var[i].unitPerpack,
          prodImage: $scope.prod_var[i].prodImage,
          amnt: $scope.prod_var[i].price,
          minThreshold: $scope.prod_var[i].startingThreshold,
          orderThreshold: $scope.prod_var[i].orderThreshold,
          discount: $scope.prod_var[i].discount,
          unit: $scope.prod_var[i].unit,
          sku: $scope.prod_var[i].sku,
          specialOffer: $scope.prod_var[i].specialOffer,
          inStock: $scope.prod_var[i].stock
          // disc : $scope.prod_var[i].discountedPrice,

        })
      }
    }

    for (var i = 0; i < $scope.prodVarList.length; i++) {
      if ($scope.prodVarList[i].sku == $state.params.sku) {
        $scope.selectedProdVar.toWatch = $scope.prodVarList[i];
      } else {
        $scope.selectedProdVar.toWatch = $scope.prodVarList[0];
      }
    }

    $scope.calcunitprice();

    $scope.$watch('selectedProdVar.toWatch', function(newValue, oldValue) {


      $scope.selectedObj = newValue;

      if ($scope.selectedObj.prodImage != undefined) {
        $scope.imgData = $scope.selectedObj.prodImage
      } else {
        $scope.imgData = $scope.details.product.displayPicture
        if ($scope.details.files.length > 0) {
          $scope.imgData = $scope.details.files[0].attachment
        }
      }



      if ($scope.selectedObj.qty != null) {
        $scope.extendedName = $filter('convertUnit')($scope.selectedObj.qty, $scope.selectedObj.unit);
      }
      $scope.customisedData = {}
      if (newValue.sku != undefined) {
        if ($scope.me) {
          for (var i = 0; i < $rootScope.inCart.length; i++) {
            if (newValue.sku == $rootScope.inCart[i].prodSku) {
              $scope.details.pk = $rootScope.inCart[i].pk
              $scope.details.added_cart = $rootScope.inCart[i].qty
              $scope.customisedData = $rootScope.inCart[i].customization
              if ($scope.customisedData != null) {
                $scope.customisedData = $scope.customisedData
              } else {
                $scope.customisedData = {
                  'image': emptyFile,
                  'data': ''
                }
              }
              break;
            } else {
              $scope.details.added_cart = 0
            }
          }
        } else {
          for (var i = 0; i < $rootScope.addToCart.length; i++) {
            if (newValue.sku == $rootScope.addToCart[i].prodSku) {
              $scope.details.added_cart = $rootScope.addToCart[i].qty
              break;
            } else {
              $scope.details.added_cart = 0
            }
          }
        }

        if (INVENTORY_ENABLED == 'False') {
          $scope.selectedObj.inStock = 1000;
          return;
        } else {
          $scope.selectedObj.inStock = newValue.inStock;
        }

        if ($scope.details.product.serialNo == newValue.sku) {



          // $scope.list.price = $scope.list.product.discountedPrice
          // for (var i = 0; i < $scope.details.variantsInStoreQty.length; i++) {
          //   if ($scope.details.variantsInStoreQty[i].productVariant == null && $scope.details.variantsInStoreQty[i].store == $scope.storePK) {
          //     $scope.selectedObj.inStock = $scope.details.variantsInStoreQty[i].quantity;
          //     break;
          //   } else {
          //     $scope.selectedObj.inStock = 0
          //   }
          // }
        } else {
          // $scope.list.product.price = newValue.amnt

          // for (var i = 0; i < $scope.details.variantsInStoreQty.length; i++) {
          //   console.log($scope.details.variantsInStoreQty[i].productVariant, $scope.selectedObj);
          //   if ($scope.details.variantsInStoreQty[i].productVariant == $scope.selectedObj.pk && $scope.details.variantsInStoreQty[i].store == $scope.storePK) {
          //     $scope.selectedObj.inStock = $scope.details.variantsInStoreQty[i].quantity
          //     break;
          //   } else {
          //     $scope.selectedObj.inStock = 0;
          //   }
          // }

          $scope.details.price = newValue.amnt
        }
      }
    }, true);

  }
  $scope.selectedObj;


  $scope.getProdVarSize = function() {


    $scope.selectedProdVar = {
      toWatch: []
    }

    $scope.selectedColor = {
      toWatch: ''
    }


    $scope.prod_var = $scope.details.product_variants;
    $scope.prodVarList = []
    $scope.prodVarListColors = []

    if ($scope.prod_var) {
      for (var i = 0; i < $scope.prod_var.length; i++) {
        str = $scope.prod_var[i].unitPerpack
        toPush = {
          pk: $scope.prod_var[i].id,
          str: str,
          size: $scope.prod_var[i].unitPerpack,
          prodImage: $scope.prod_var[i].prodImage,
          minThreshold: $scope.prod_var[i].startingThreshold,
          orderThreshold: $scope.prod_var[i].orderThreshold,
          discount: $scope.prod_var[i].discount,
          amnt: $scope.prod_var[i].price,
          unit: $scope.prod_var[i].unit,
          sku: $scope.prod_var[i].sku,
          specialOffer: $scope.prod_var[i].specialOffer,
          inStock: $scope.prod_var[i].stock
          // disc : $scope.prod_var[i].discountedPrice,
          // disc: (($scope.prod_var.price-(($scope.prod_var.price*$scope.prod_var.discount)/100)).toFixed(2))
        }

        index = $scope.prodVarList.findIndex(x => x.str == str);
        if (index >= 0) {} else {
          $scope.prodVarList.push(toPush)
        }
      }
      $scope.selectedProdVar.toWatch = $scope.prodVarList[0]
    }


    $scope.$watch('selectedProdVar.toWatch', function(newValue, oldValue) {
      $scope.prodVarListColors = [];
      if (newValue != undefined) {
        for (var i = 0; i < $scope.prod_var.length; i++) {
          if ($scope.prod_var[i].sku.split('&')[0] == $scope.selectedProdVar.toWatch.sku.split('&')[0]) {
            $scope.prodVarListColors.push($scope.prod_var[i])
          }
        }
        if ($scope.prodVarListColors.length >= 0) {
          $scope.selectedColor.toWatch = $scope.prodVarListColors[0];
        }
      }
    });


    $scope.$watch('selectedColor.toWatch', function(newValue, oldValue) {
      if (newValue != undefined) {

        $scope.selectedObj = {
          pk: newValue.id,
          size: newValue.unitPerpack,
          amnt: newValue.price,
          unit: newValue.unit,
          sku: newValue.sku,
          disc: newValue.disc
        }

        if (newValue.prodDesc != '' && newValue.prodDesc != null) {
          $scope.selectedObj.prodDesc = newValue.prodDesc
        }



        if ($scope.me) {
          for (var i = 0; i < $rootScope.inCart.length; i++) {
            if ($scope.selectedObj.sku == $rootScope.inCart[i].prodSku) {
              $scope.details.added_cart = $rootScope.inCart[i].qty
              $scope.customisedData = $rootScope.inCart[i].customization
              break;
            } else {
              $scope.details.added_cart = 0
            }
          }
        } else {
          for (var i = 0; i < $rootScope.addToCart.length; i++) {
            if ($scope.selectedObj.sku == $rootScope.addToCart[i].prodSku) {
              $scope.details.added_cart = $rootScope.addToCart[i].qty
              break;
            } else {
              $scope.details.added_cart = 0
            }
          }
        }

        if (INVENTORY_ENABLED == 'False') {
          $scope.selectedObj.inStock = 1000;
          return
        } else {
          $scope.selectedObj.inStock = newValue.inStock;
          // for (var i = 0; i < $scope.details.variantsInStoreQty.length; i++) {
          //   if ($scope.details.variantsInStoreQty[i].productVariant == $scope.selectedObj.pk && $scope.details.variantsInStoreQty[i].store == $scope.storePK) {
          //     $scope.selectedObj.inStock = $scope.details.variantsInStoreQty[i].quantity
          //     break;
          //   } else {
          //     $scope.selectedObj.inStock = 0;
          //   }
          // }
        }

      }

    });

  }

  $scope.dataFetched = false;


  $timeout(function() {
    $scope.dataFetched = true;
    // if ($scope.details.product.unit == 'Size and Color' || $scope.details.product.unit == 'Size') {
    if ($scope.details.product.unit == 'Size and Color') {
      $scope.getProdVarSize()
    } else {
      $scope.getProdVar()
    }
  }, 3000);
});


app.controller('controller.ecommerce.categories_mobile', function($scope, $rootScope, $state, $http, $timeout, $uibModal, $users, Flash, $window) {
  console.log("%%%%%%%%%%%%%%%%%%%5");
  $http({
    method: 'GET',
    url: '/api/ecommerce/categorySortList/',
  }).
  then(function(response) {
    // console.log(response.data);
    $scope.categories = response.data;
    $scope.categories.forEach(function(item) {
      item.showsubcat = false
    })
  })
  $scope.cat_open = function(a, inx) {
    $scope.categories[inx].showsubcat = !$scope.categories[inx].showsubcat
  }

});

app.controller('controller.ecommerce.categories', function($scope, $rootScope, $state, $http, $timeout, $uibModal, $users, Flash, $window) {
  // $scope.displaytab = false


  document.getElementById('popular').style.display = "block";
  document.getElementById('defaultOpen').className = 'active';

  $scope.categoryTyp = function(evt, cityName) {

    document.getElementById('defaultOpen').className = ''
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
  }

  $scope.showFilter = false
  // $http.get('/api/ERP/appSettings/?app=25&name__iexact=filter').
  // then(function(response) {
  //   console.log('ratingggggggggggggggggggg', response.data);
  //   if (response.data[0] != null) {
  //     if (response.data[0].flag) {
  //       $scope.showFilter = true
  //     }
  //   }
  // })
  $scope.showFilter = settings_filter
  $scope.data = $scope.$parent.data; // contains the pickUpTime , location and dropInTime
  $window.scrollTo(0, 0)
  $scope.minValue;
  $scope.maxValue
  document.title = $state.params.name.split('_').join(' ') + ' | Buy ' + $state.params.name.split('_').join(' ') + ' At Best Price In India | ' + BRAND_TITLE
  document.querySelector('meta[name="description"]').setAttribute("content", BRAND_TITLE + ' Online Shopping')


  $scope.slider = {
    minValue: 200,
    maxValue: 600,
    options: {
      floor: 0,
      ceil: 1000,
      step: 10,
      noSwitching: true,
      translate: function(value) {
        return '₹' + value;
      }
    }
  };

  $scope.slider1 = {
    minValue: 200,
    maxValue: 600,
    options: {
      floor: 0,
      ceil: 1000,
      step: 10,
      noSwitching: true,
      translate: function(value) {
        return '₹' + value;
      }
    }
  };


  $scope.breadcrumbList = [];
  $scope.category = {}
  $scope.fields;

  $http({
    method: 'GET',
    url: '/api/ecommerce/genericProduct/?alias__iexact=' + $state.params.name.split(' ').join('')
  }).
  then(function(response) {
    $scope.category = response.data[0];
    $scope.fields = $scope.category.fields;
    $scope.category.fields = [];
    var parent = response.data[0].parent
    while (parent) {
      $scope.breadcrumbList.push(parent.name)
      parent = parent.parent
    }
    if ($rootScope.multiStore) {
      gurl = '/api/ecommerce/genericProduct/?genericValue=' + response.data[0].pk + '&pin=' + $rootScope.pin + '&multipleStore'
    } else {
      // gurl = '/api/ecommerce/genericProduct/?genericValue=' + response.data[0].pk
      gurl = '/api/ecommerce/genericProduct/?parent=' + response.data[0].pk
    }
    $http({
      method: 'GET',
      url: gurl,
    }).
    then(function(response) {
      // console.log(response.data);
      $scope.categories = response.data;
    })


  });

  $scope.choices = {};
  $scope.listingSearch = []
  $scope.noProducts = false
  $scope.start = 0
  $scope.end = 0
  $scope.listingCatProductsData1 = []
  $scope.loadMore = function() {
    $scope.end += 12
    console.log($scope.listingSearch.length, $scope.listingSearch.length, 'llloooooooooooooooooooooooooooooollll');
    if ($scope.listingSearch.length <= 12) {
      console.log("1");
      $scope.listingCatProductsData1 = $scope.listingSearch
      $scope.loadBtn = false
    } else if ($scope.listingCatProductsData1.length == $scope.listingSearch.length) {
      console.log("2");
      $scope.loadBtn = false
    } else {
      $scope.listingCatProductsData1 = $scope.listingSearch.slice($scope.start, $scope.end);
      if ($scope.listingCatProductsData1.length == $scope.listingSearch.length) {
        console.log("3");
        $scope.loadBtn = false
      } else {
        console.log("4");
        $scope.loadBtn = true
      }
    }
  }
  $timeout(function() {

    $scope.category.fields = $scope.fields;
    for (var i = 0; i < $scope.category.fields.length; i++) {
      if ($scope.category.fields[i].data) {
        $scope.category.fields[i].data = JSON.parse($scope.category.fields[i].data)
      }
      if ($scope.category.fields[i].fieldType == 'choice') {
        for (var j = 0; j < $scope.category.fields[i].data.length; j++) {
          // console.log($scope.category.fields[i].data[j]);
          $scope.category.fields[i].data[j] = {
            name: $scope.category.fields[i].data[j],
            selected: false
          }
          // $scope.category.fields[i].choices.push()
        }
      }
      $scope.category.fields[i].val = '';
    }

    if ($rootScope.multiStore) {
      lurl = '/api/ecommerce/listing/?parent=' + $scope.category.pk + '&recursive=1' + '&pin=' + $rootScope.pin + '&multipleStore'
      $http({
        method: 'GET',
        url: lurl
      }).
      then(function(response) {
        $scope.listingSearch = response.data;

        if ($rootScope.addToCart.length > 0) {
          for (var i = 0; i < $rootScope.addToCart.length; i++) {
            for (var j = 0; j < $scope.listingSearch.length; j++) {
              if ($scope.listingSearch[j].pk == $rootScope.addToCart[i].product.pk) {
                $scope.listingSearch[j].added_cart = $rootScope.addToCart[i].qty
              }
            }
          }
        }
      })
    } else {
      $scope.count = 0
      if ($scope.categories.length > 0) {
        for (var i = 0; i < $scope.categories.length; i++) {
          lurl = '/api/ecommerce/listing/?parentType=' + $scope.categories[i].pk
          $http({
            method: 'GET',
            url: lurl
          }).
          then(function(response) {
            $scope.count += 1
            for (var i = 0; i < response.data.length; i++) {
              $scope.listingSearch.push(response.data[i]);
            }
            if ($rootScope.addToCart.length > 0) {
              for (var i = 0; i < $rootScope.addToCart.length; i++) {
                for (var j = 0; j < $scope.listingSearch.length; j++) {
                  if ($rootScope.addToCart.product != undefined) {
                    if ($scope.listingSearch[j].pk == $rootScope.addToCart[i].product.pk) {
                      $scope.listingSearch[j].added_cart = $rootScope.addToCart[i].qty

                    }
                  }
                }
              }
            }
            console.log($scope.count - 1, $scope.categories.length, 'lloooohhh');
            if ($scope.count == $scope.categories.length) {
              $scope.loadMore()

              // console.log(i,$scope.listingSearch.length,'llllllllllllllllllllllllhhhhhhhhhhh');
              // if ($scope.listingSearch.length==0) {
              //   $scope.noProducts = true
              //   return
              // }
              // else{
              //   console.log('thereeeeeeeeeeeeeeeeeeeeeeeee');
              //   $scope.loadMore()
              //   return
              // }
            }
          })
        }
      } else {
        lurl = '/api/ecommerce/listing/?parent=' + $scope.category.pk + '&recursive=1'
        $http({
          method: 'GET',
          url: lurl
        }).
        then(function(response) {
          $scope.listingSearch = response.data;

          if ($rootScope.addToCart.length > 0) {
            for (var i = 0; i < $rootScope.addToCart.length; i++) {
              for (var j = 0; j < $scope.listingSearch.length; j++) {
                if ($scope.listingSearch[j].pk == $rootScope.addToCart[i].product.pk) {
                  $scope.listingSearch[j].added_cart = $rootScope.addToCart[i].qty
                }
              }
            }
          }
          if ($scope.listingSearch.length == 0) {
            $scope.noProducts = true
            return
          } else {
            $scope.loadMore()
            return
          }
        })
      }
    }

    // $scope.listingSearch.splice(0,14)

    $scope.breadcrumbList = $scope.breadcrumbList.slice().reverse();
  }, 3000);






  $scope.filter = function() {

    params = {
      minPrice: $scope.slider.minValue,
      maxPrice: $scope.slider.maxValue,
      fields: {},
      sort: $scope.data.sort
    }

    for (var i = 0; i < $scope.category.fields.length; i++) {
      if ($scope.category.fields[i].fieldType == 'choice') {
        var arr = []
        for (var j = 0; j < $scope.category.fields[i].data.length; j++) {
          if ($scope.category.fields[i].data[j].selected) {
            arr.push($scope.category.fields[i].data[j].name)
          }
        }
        if (arr.length > 0) {
          var a = $scope.category.fields[i].name
          // params.fields.push({a : arr})
          params.fields[a] = arr
        }
      } else {
        if ($scope.category.fields[i].val) {
          var a = $scope.category.fields[i].name
          // params.fields.push({a : $scope.category.fields[i].val})
          params.fields[a] = $scope.category.fields[i].val
        }
      }
    }


    if ($rootScope.multiStore) {
      lurl = '/api/ecommerce/listing/?parent=' + $scope.category.pk + '&recursive=1' + '&pin=' + $rootScope.pin + '&multipleStore'
    } else {
      lurl = '/api/ecommerce/listing/?parent=' + $scope.category.pk + '&recursive=1'
    }
    $http({
      method: 'GET',
      url: lurl,
      params: params
    }).
    then(function(response) {
      $scope.listingSearch = response.data;

      if ($rootScope.addToCart.length > 0) {
        for (var i = 0; i < $rootScope.addToCart.length; i++) {
          for (var j = 0; j < $scope.listingSearch.length; j++) {
            if ($scope.listingSearch[j].pk == $rootScope.addToCart[i].product.pk) {
              $scope.listingSearch[j].added_cart = $rootScope.addToCart[i].qty
            }
          }
        }
      }
    })
  }

});



app.controller('controller.ecommerce.account.default', function($scope, $rootScope, $state, $http, $timeout, $uibModal, $users, Flash) {
  // for the dashboard of the account tab
  // alert('hello')
  $http({
    methof: 'GET',
    url: '/api/ecommerce/userProfileSetting/?user=' + $scope.me.pk
  }).then(function(response) {


    $scope.detailsForm = {
      firstName: response.data.firstName,
      lastName: response.data.lastName,
      email: response.data.email,
      mobile: response.data.mobile,
      oldPassword: '',
      newPassword: ''
    }

    if (settings_isStoreGlobal == false) {
      $scope.isGst = true
      $scope.detailsForm.gst = response.data.gst
      $scope.detailsForm.company = response.data.company
    } else {
      $scope.isGst = false
    }

  })
  $scope.editMode = false

  $scope.edit = function() {
    $scope.editMode = true
    setTimeout(function() {
      document.getElementById('firstName').focus()
    }, 500);
  }

  $scope.save = function() {

    $scope.detailsForm.user = $scope.me.pk

    if ($scope.detailsForm.oldPassword.length == 0 && $scope.detailsForm.newPassword.length > 0) {
      Flash.create('warning', 'Enter old password')
      return
    }

    if ($scope.detailsForm.newPassword.length == 0 && $scope.detailsForm.oldPassword.length > 0) {
      Flash.create('warning', 'Enter new password')
      return
    }

    if ($scope.detailsForm.oldPassword.length == 0 || $scope.detailsForm.newPassword.length == 0) {
      delete $scope.detailsForm.oldPassword
      delete $scope.detailsForm.newPassword
    }

    $http({
      method: 'POST',
      url: '/api/ecommerce/userProfileSetting/',
      data: $scope.detailsForm
    }).then(function(response) {
      $scope.detailsForm = {
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        email: response.data.email,
        mobile: response.data.mobile,
        oldPassword: '',
        newPassword: ''
      }

      if ($scope.isGst) {
        $scope.detailsForm.gst = response.data.gst
        $scope.detailsForm.company = response.data.company
      }

      if (response.data.passwordChanged) {
        alert("password has been changed, login again")
        window.location.href = "/";
      }


      $scope.editMode = false
      Flash.create('success', 'Saved Successfully')
    }, function(error) {
      Flash.create('danger', 'Permission Denied')
    })
    // $http({
    //   method:'PATCH',
    //   url:''
    //   data:{}
    // }).then(function (response) {
    //   console.log(response);
    // })
  }






});



app.controller('controller.ecommerce.account.cart', function($scope, $rootScope, $state, $http, $timeout, $uibModal, $users, Flash, $rootScope, $filter) {


  $scope.data = {
    tableData: [],
  };
  views = [{
    name: 'list',
    icon: 'fa-th-large',
    template: '/static/ngTemplates/genericTable/genericSearchList.html',
    itemTemplate: '/static/ngTemplates/app.ecommerce.account.cart.item.html',
  }, ];


  $scope.config = {
    views: views,
    url: '/api/ecommerce/cart/',
    // searchField: 'product__product__name',
    getParams: [{
      key: 'user',
      value: $scope.me.pk
    }, {
      key: 'typ',
      value: 'cart'
    }],
    deletable: true,
    itemsNumPerView: [8, 16, 32],
  }


  document.title = BRAND_TITLE + ' | Shopping Cart'
  document.querySelector('meta[name="description"]').setAttribute("content", BRAND_TITLE + ' Online Shopping')

  // $timeout(function () {
  //   for (var i = 0; i < $scope.data.tableData.length; i++) {
  //     var prod_variants = $scope.data.tableData[i].product.product_variants
  //     for (var j = 0; j < prod_variants.length; j++) {
  //       if (prod_variants[j].sku == $scope.data.tableData[i].prodSku) {
  //         $scope.data.tableData[i].prod_var = prod_variants[j]
  //         console.log($scope.data.tableData[i].prod_var);
  //       }
  //     }
  //   }
  // }, 1000);

  $scope.tableAction = function(target, action, mode) {
    for (var i = 0; i < $scope.data.tableData.length; i++) {
      if ($scope.data.tableData[i].pk == parseInt(target)) {
        if (action == 'deleteItem') {
          $http({
            method: 'DELETE',
            url: '/api/ecommerce/cart/' + $scope.data.tableData[i].pk + '/'
          }).
          then(function(response) {
            Flash.create('success', 'Item removed from cart');
          })
          $scope.data.tableData.splice(i, 1)
          $rootScope.inCart.splice(i, 1)
          // $scope.calcTotal();
        } else if (action == 'addQty') {
          $scope.data.tableData[i].qty = $scope.data.tableData[i].qty + 1;
          $http({
            method: 'PATCH',
            url: '/api/ecommerce/cart/' + $scope.data.tableData[i].pk + '/',
            data: {
              qty: $scope.data.tableData[i].qty
            }
          }).
          then(function(response) {})
          // $scope.calcTotal();
        } else if (action == 'substractQty') {
          $scope.data.tableData[i].qty = $scope.data.tableData[i].qty - 1;
          $http({
            method: 'PATCH',
            url: '/api/ecommerce/cart/' + $scope.data.tableData[i].pk + '/',
            data: {
              qty: $scope.data.tableData[i].qty
            }
          }).
          then(function(response) {})
          // $scope.calcTotal();
        } else if (action == 'favourite') {
          $http({
            method: 'PATCH',
            url: '/api/ecommerce/cart/' + $scope.data.tableData[i].pk + '/',
            data: {
              typ: 'favourite'
            }
          }).
          then(function(response) {
            $rootScope.inFavourite.push(response.data)
          })
          $scope.data.tableData[i].typ = 'favourite';
          $scope.data.tableData.splice(i, 1)
          $rootScope.inCart.splice(i, 1)

        } else if (action == 'unfavourite') {
          $http({
            method: 'PATCH',
            url: '/api/ecommerce/cart/' + $scope.data.tableData[i].pk + '/',
            data: {
              typ: 'cart'
            }
          }).
          then(function(response) {})
          $scope.data.tableData[i].typ = 'cart';
        }
      }
    }
  }






  $scope.currency = settings_currencySymbol
  $scope.calcTotal = function() {
    $scope.total = 0;
    var price = 0;
    for (var i = 0; i < $scope.data.tableData.length; i++) {
      if ($scope.data.tableData[i].prodSku != $scope.data.tableData[i].product.product.serialNo) {
        price = $scope.data.tableData[i].prodVarPrice
      } else {
        price = $scope.data.tableData[i].product.product.discount
      }
      $scope.total = $scope.total + (price * $scope.data.tableData[i].qty)
    }
    return $scope.total
  }



  $scope.checkout = function() {
    $state.go('checkout', {
      pk: 'cart'
    })
  }

});

app.controller('ecommerce.account.cart.item', function($scope, $rootScope, $state, $http, $timeout, $uibModal, $users, Flash) {
  // for the dashboard of the account tab


  $scope.currency = settings_currencySymbol;
});

app.controller('controller.ecommerce.account.saved', function($scope, $rootScope, $state, $http, $timeout, $uibModal, $users, Flash, $filter) {


  $scope.data = {
    tableData: [],
  };
  views = [{
    name: 'list',
    icon: 'fa-th-large',
    template: '/static/ngTemplates/genericTable/genericSearchList.html',
    itemTemplate: '/static/ngTemplates/app.ecommerce.account.saved.item.html',
  }, ];


  $scope.config = {
    views: views,
    url: '/api/ecommerce/cart/',
    searchField: 'Name',
    getParams: [{
      key: 'user',
      value: $scope.me.pk
    }, {
      key: 'typ',
      value: 'favourite'
    }],
    deletable: true,
    itemsNumPerView: [8, 16, 32],
  }

  document.title = BRAND_TITLE + ' | Saved Products'
  document.querySelector('meta[name="description"]').setAttribute("content", BRAND_TITLE + ' Online Shopping')
  $scope.tableAction = function(target, action, mode) {
    for (var i = 0; i < $scope.data.tableData.length; i++) {
      if ($scope.data.tableData[i].pk == parseInt(target)) {
        if (action == 'unfavourite') {
          $http({
            method: 'PATCH',
            url: '/api/ecommerce/cart/' + $scope.data.tableData[i].pk + '/',
            data: {
              typ: 'cart',
              qty: 1
            }
          }).
          then(function(response) {
            $rootScope.inCart.push(response.data)
          })
          $scope.data.tableData.splice(i, 1)
          $rootScope.inFavourite.splice(i, 1)
        } else if (action == 'deleteItem') {
          $http({
            method: 'DELETE',
            url: '/api/ecommerce/cart/' + $scope.data.tableData[i].pk + '/'
          }).
          then(function(response) {
            Flash.create('success', 'Item removed from favourite');
          })
          $scope.data.tableData.splice(i, 1)
          $rootScope.inFavourite.splice(i, 1)
          // $rootScope.inCart.splice(i, 1)
          // $scope.calcTotal();
        }
      }
    }

  }



});

app.controller('controller.ecommerce.account.saved.item', function($scope, $rootScope, $http, $state) {
  $scope.currency = settings_currencySymbol;

})



app.controller('controller.ecommerce.account.orders.item', function($scope, $rootScope, $http, $state, $uibModal) {
  $scope.showDetails = function(val) {
    $scope.trackItem = val
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.ecommerce.orders.trackModal.html',
      size: 'lg',
      backdrop: true,
      resolve: {
        items: function() {
          return $scope.trackItem;
        }
      },
      controller: function($scope, items, $state, $http, $timeout, $uibModal, $users, Flash, $uibModalInstance) {


        $scope.trackItems = items



      }

    })
  }

  $scope.isStoreGlobal = settings_isStoreGlobal;

  $scope.currency = settings_currencySymbol;

})

app.controller('controller.ecommerce.account.orders', function($scope, $rootScope, $state, $http, $timeout, $uibModal, $users, Flash) {
  $scope.showlimit = 0;
  $scope.showInfo = false;
  $scope.showmoreoders = function() {
    $scope.showlimit = $scope.showlimit + 4;
    $http({
      method: 'GET',
      url: '/api/ecommerce/order/?user=' + $scope.me.pk + '&limit=' + $scope.showlimit
    }).
    then(function(response) {
      console.log(response.data, "$$$$$$$$$$$$$$$$$$$$$$$$");
      $scope.data = response.data.results
    })
  }
  $scope.showmoreoders();

  views = [{
    name: 'list',
    icon: 'fa-th-large',
    template: '/static/ngTemplates/genericTable/genericSearchList.html',
    itemTemplate: '/static/ngTemplates/app.ecommerce.account.orders.item.html',
  }, ];


  $scope.config = {
    views: views,
    url: '/api/ecommerce/order/',
    searchField: 'id',
    getParams: [{
      key: 'user',
      value: $scope.me.pk
    }],
    deletable: true,
    itemsNumPerView: [4, 16, 32],
  }



  $timeout(function() {
    for (var i = 0; i < $scope.data.length; i++) {
      $scope.data[i].showInfo = false;
      $scope.data[i].hideCancelBtn = false
      $scope.data[i].hideReturnBtn = false
      $scope.data[i].cancelCount = 0;
      $scope.data[i].returnCount = 0;

      for (var j = 0; j < $scope.data[i].orderQtyMap.length; j++) {
        $scope.data[i].orderQtyMap[j].selected = false;
        if ($scope.data[i].orderQtyMap[j].status == 'cancelled') {
          $scope.data[i].cancelCount++
        }
        if ($scope.data[i].orderQtyMap[j].status == 'returned') {
          $scope.data[i].returnCount++;
        }
      }
      if ($scope.data[i].cancelCount == $scope.data[i].orderQtyMap.length) {
        $scope.data[i].hideCancelBtn = true
      }
      if ($scope.data[i].returnCount == $scope.data[i].orderQtyMap.length) {
        $scope.data[i].hideReturnBtn = true
      }


    }

  }, 2000);


  document.title = BRAND_TITLE + ' | My Orders'
  document.querySelector('meta[name="description"]').setAttribute("content", BRAND_TITLE + ' Online Shopping')

  $scope.tableAction1 = function(target, action) {
    for (var i = 0; i < $scope.data.length; i++) {
      if ($scope.data[i].pk == parseInt(target)) {

        if (action == 'toggleInfo') {
          $scope.data[i].showInfo = !$scope.data[i].showInfo;
        } else if (action == 'cancel') {

          $scope.itemsToBeDeleted = [];


          for (var j = 0; j < $scope.data[i].orderQtyMap.length; j++) {
            if ($scope.data[i].orderQtyMap[j].selected == true) {
              if ($scope.data[i].orderQtyMap[j].status == 'created' || $scope.data[i].orderQtyMap[j].status == 'packed') {
                $scope.itemsToBeDeleted.push($scope.data[i].orderQtyMap[j])
              } else {
                // $scope.data[i].orderQtyMap[j].selected = false;
                Flash.create('warning', 'selected items cant be cancelled')
                return
              }
            }
          }



          if ($scope.itemsToBeDeleted.length > 0) {
            $scope.indexofthis = i
            $uibModal.open({
              templateUrl: '/static/ngTemplates/app.ecommerce.orders.cancelModalWindow.html',
              size: 'md',
              backdrop: true,
              resolve: {
                items: function() {
                  return $scope.itemsToBeDeleted;
                }
              },
              controller: function($scope, items, $state, $http, $timeout, $uibModal, $users, Flash, $uibModalInstance) {
                $scope.state = 'cancel';
                $scope.items = items;
                $scope.amtToBeRefunded = 0;
                $scope.currency = settings_currencySymbol

                for (var i = 0; i < $scope.items.length; i++) {
                  $scope.amtToBeRefunded = $scope.amtToBeRefunded + $scope.items[i].paidAmount
                }

                $scope.cancel = function() {
                  for (var i = 0; i < $scope.items.length; i++) {
                    var pk = $scope.items[i].pk
                    $http({
                      method: 'PATCH',
                      url: '/api/ecommerce/orderQtyMap/' + pk + '/',
                      data: {
                        status: 'cancelled'
                      }
                    }).
                    then(function(response) {
                      var toSend = {
                        value: response.data.pk
                      };
                      $http({
                        method: 'POST',
                        url: '/api/ecommerce/sendStatus/',
                        data: toSend
                      }).
                      then(function(response) {})
                      $rootScope.$broadcast('forceRefetch', {});
                      Flash.create('success', 'selected items cancelled')
                      $uibModalInstance.dismiss();
                    })
                  }
                }

              },
            }).result.then(function() {

            }, function(res) {

              $timeout(function() {
                $scope.data[$scope.indexofthis].cancelCount = 0
                $scope.data[$scope.indexofthis].returnCount = 0
                for (var j = 0; j < $scope.data[$scope.indexofthis].orderQtyMap.length; j++) {
                  $scope.data[$scope.indexofthis].orderQtyMap[j].selected = false;
                  if ($scope.data[$scope.indexofthis].orderQtyMap[j].status == 'cancelled') {
                    $scope.data[$scope.indexofthis].cancelCount++
                  }
                  if ($scope.data[$scope.indexofthis].orderQtyMap[j].status == 'returned') {
                    $scope.data[$scope.indexofthis].returnCount++;
                  }
                }

                if ($scope.data[$scope.indexofthis].cancelCount == $scope.data[$scope.indexofthis].orderQtyMap.length) {
                  $scope.data[$scope.indexofthis].hideCancelBtn = true
                }
                if ($scope.data[$scope.indexofthis].returnCount == $scope.data[$scope.indexofthis].orderQtyMap.length) {
                  $scope.data[$scope.indexofthis].hideReturnBtn = true
                }
              }, 2000);

            });
          } else {
            Flash.create('warning', 'Please select items to cancel')
          }


        } else if (action == 'return') {

          $scope.itemsToBeReturned = [];

          for (var j = 0; j < $scope.data[i].orderQtyMap.length; j++) {
            if ($scope.data[i].orderQtyMap[j].selected == true) {
              if ($scope.data[i].orderQtyMap[j].status == 'delivered') {
                $scope.itemsToBeReturned.push($scope.data[i].orderQtyMap[j])
              } else {
                // $scope.data[i].orderQtyMap[j].selected = false;
                Flash.create('warning', 'selected items cant be returned')
                return
              }
            }
          }

          if ($scope.itemsToBeReturned.length > 0) {
            $uibModal.open({
              templateUrl: '/static/ngTemplates/app.ecommerce.orders.cancelModalWindow.html',
              size: 'md',
              backdrop: true,
              resolve: {
                items: function() {
                  return $scope.itemsToBeReturned;
                }
              },
              controller: function($scope, items, $state, $http, $timeout, $uibModal, $users, Flash, $uibModalInstance) {
                $scope.state = 'return';
                $scope.items = items;
                $scope.amtToBeRefunded = 0;
                $scope.currency = settings_currencySymbol

                for (var i = 0; i < $scope.items.length; i++) {
                  $scope.amtToBeRefunded = $scope.amtToBeRefunded + $scope.items[i].paidAmount
                }

                $scope.return = function() {
                  for (var i = 0; i < $scope.items.length; i++) {
                    var pk = $scope.items[i].pk
                    $http({
                      method: 'PATCH',
                      url: '/api/ecommerce/orderQtyMap/' + pk + '/',
                      data: {
                        status: 'returned'
                      }
                    }).
                    then(function(response) {
                      var toSend = {
                        value: response.data.pk
                      };
                      $http({
                        method: 'POST',
                        url: '/api/ecommerce/sendStatus/',
                        data: toSend
                      }).
                      then(function(response) {})
                      $rootScope.$broadcast('forceRefetch', {});
                      Flash.create('success', 'selected items returned')
                      $uibModalInstance.dismiss();
                    })
                  }

                }

              },
            }).result.then(function() {

            }, function() {

              $timeout(function() {
                $scope.data[$scope.indexofthis].cancelCount = 0
                $scope.data[$scope.indexofthis].returnCount = 0
                for (var j = 0; j < $scope.data[$scope.indexofthis].orderQtyMap.length; j++) {
                  $scope.data[$scope.indexofthis].orderQtyMap[j].selected = false;
                  if ($scope.data[$scope.indexofthis].orderQtyMap[j].status == 'cancelled') {
                    $scope.data[$scope.indexofthis].cancelCount++
                  }
                  if ($scope.data[$scope.indexofthis].orderQtyMap[j].status == 'returned') {
                    $scope.data[$scope.indexofthis].returnCount++;
                  }
                }
                if ($scope.data[$scope.indexofthis].cancelCount == $scope.data[$scope.indexofthis].orderQtyMap.length) {
                  $scope.data[$scope.indexofthis].hideCancelBtn = true
                }
                if ($scope.data[$scope.indexofthis].returnCount == $scope.data[$scope.indexofthis].orderQtyMap.length) {
                  $scope.data[$scope.indexofthis].hideReturnBtn = true
                }
              }, 2000);

            });
          } else {
            Flash.create('warning', 'Please select item to return')
          }


        }

      }
    }
  }

});

app.controller('controller.ecommerce.account.settings', function($scope, $rootScope, $state, $http, $timeout, $uibModal, $users, Flash) {
  $scope.me = $users.get('mySelf');
  document.title = BRAND_TITLE + ' | My Settings'
  document.querySelector('meta[name="description"]').setAttribute("content", BRAND_TITLE + ' Online Shopping')

  if (settings_isStoreGlobal) {
    $scope.isStoreGlobal = true
  } else {
    $scope.isStoreGlobal = false
  }

  $scope.refresh = function() {
    $scope.form = {
      title: '',
      landMark: '',
      street: '',
      city: '',
      state: '',
      pincode: null,
      country: 'India',
      primary: false,
      mobileNo: '',
      billingLandMark: '',
      billingStreet: '',
      billingState: '',
      billingPincode: null,
      billingCountry: 'India',
      sameAsShipping: false,
    }
    if (settings_isStoreGlobal) {
      $scope.form.country = ''
    }
  }


  $scope.$watch('form.billingPincode', function(newValue, oldValue) {
    if (newValue != null) {

      $http({
        method: 'GET',
        url: '/api/ecommerce/genericPincode/?pincode__iexact=' + newValue
      }).
      then(function(response) {
        if (response.data.length > 0) {
          $scope.form.billingCity = response.data[0].city
          $scope.form.billingState = response.data[0].state
          $scope.form.billingCountry = 'India'
        } else {
          $scope.form.billingCity = ''
          $scope.form.billingState = ''
        }
      })

    }
  })

  $scope.refresh()
  $scope.update = function(idx) {
    $scope.form = $scope.savedAddress[idx]
    console.log($scope.form, 'lllllllllpppppppppppp');
    if ($scope.savedAddress[idx].pk == $scope.pa) {
      $scope.form.primary = true
    } else {
      $scope.form.primary = false
    }
    // $scope.savedAddress.splice(idx, 1)
  }

  $scope.delete = function(idx) {
    $http({
      method: 'DELETE',
      url: '/api/ecommerce/address/' + $scope.savedAddress[idx].pk + '/'
    }).
    then(function(response) {
      $scope.savedAddress.splice(idx, 1)
      Flash.create('success', "Address Deleted");
    })
  }

  if (settings_isStoreGlobal) {
    $scope.countrySearch = function(query) {
      return $http.get('/api/ecommerce/searchCountry/?query=' + query).
      then(function(response) {
        $scope.countrList = response.data
        return response.data;
      })
    }

    $scope.stateSearch = function(query) {
      if ($scope.selectedCountryObj != undefined) {
        if ($scope.selectedCountryObj.id != undefined) {
          return $http.get('/api/ecommerce/searchCountry/?query=' + query + '&country=' + $scope.selectedCountryObj.id).
          then(function(response) {
            $scope.stateList = response.data
            return response.data;
          })
        }
      }
    }

    $scope.citySearch = function(query) {
      if ($scope.selectedStateObj != undefined) {
        if ($scope.selectedStateObj.id != undefined) {
          return $http.get('/api/ecommerce/searchCountry/?query=' + query + '&state=' + $scope.selectedStateObj.id).
          then(function(response) {
            return response.data;
          })
        }
      }
    }



    $scope.showAddressForm = {
      state: false,
      city: false
    }

    $scope.showBillingAddressForm = {
      state: false,
      city: false
    }

    $scope.$watch('form.country', function(newValue, oldValue) {
      if (newValue != null && newValue != undefined) {

        if (newValue == '') {
          $scope.form.state = ''
        }

        if ($scope.countrList) {
          for (var i = 0; i < $scope.countrList.length; i++) {
            if ($scope.countrList[i].name == newValue) {
              $scope.selectedCountryObj = $scope.countrList[i]
              break;
            } else {
              $scope.selectedCountryObj = ''
            }
          }
        }
        // if (typeof $scope.selectedCountryObj == 'object') {
        //   $scope.showAddressForm.state = true
        // } else {
        //   $scope.showAddressForm.state = false
        // }
        // if ($scope.selectedCountryObj.length) {
        //   $scope.showAddressForm.state = true
        // }else {
        //   $scope.showAddressForm.state = false
        // }
      }
    });

    $scope.$watch('form.billingPincode', function(newValue, oldValue) {
      if (newValue != null) {
        if (newValue.length == 6) {
          $http({
            method: 'GET',
            url: '/api/ecommerce/genericPincode/?pincode__iexact=' + newValue
          }).
          then(function(response) {
            if (response.data.length > 0) {
              $scope.form.billingCity = response.data[0].city
              $scope.form.billingState = response.data[0].state
            } else {}
          })
        }
      }
    })

    $scope.$watch('form.state', function(newValue, oldValue) {
      if (newValue != null && newValue != undefined) {

        if (newValue == '') {
          $scope.form.city = ''
        }

        if ($scope.stateList) {
          for (var i = 0; i < $scope.stateList.length; i++) {
            if ($scope.stateList[i].name == newValue) {
              $scope.selectedStateObj = $scope.stateList[i]
              break;
            } else {
              $scope.selectedStateObj = ''
            }
          }
        }
        // if (typeof $scope.selectedStateObj == 'object') {
        //   $scope.showAddressForm.city = true
        // } else {
        //   $scope.showAddressForm.city = false
        // }
      }
    });
  } else {
    $scope.showAddressForm = {
      state: true,
      city: true
    }

    $scope.showBillingAddressForm = {
      state: true,
      city: true
    }
    $scope.showMessage = false
    $scope.$watch('form.pincode', function(newValue, oldValue) {
      if (newValue != null) {
        if (newValue.length == 6) {
          $http({
            method: 'GET',
            url: '/api/ecommerce/genericPincode/?pincode__iexact=' + newValue
          }).
          then(function(response) {
            if (response.data.length > 0) {
              $scope.showMessage = false
              $scope.form.city = response.data[0].city
              $scope.form.state = response.data[0].state
            } else {
              if (settings_isServiceArea) {
                $scope.showMessage = true
              }
            }
            if (settings_isServiceArea) {
              $http({
                method: 'GET',
                url: '/api/ecommerce/addPincode/?pincodes__iexact=' + newValue
              }).
              then(function(response) {
                if (response.data.length == 0) {
                  $scope.showMessage = true
                }
              })
            } else {
              $scope.showMessage = false
            }

          })
        } else if (newValue.length < 6) {
          $scope.showMessage = false
          // $scope.form.city = ''
          // $scope.form.state = ''
        }
      }
    })
  }








  $scope.fetchaddress = function() {
    $http({
      method: 'GET',
      url: '/api/ecommerce/address/?user=' + $scope.me.pk
    }).
    then(function(response) {
      $scope.savedAddress = response.data
      $scope.pa = 0
      for (var i = 0; i < $scope.savedAddress.length; i++) {
        if ($scope.me.profile.primaryAddress == $scope.savedAddress[i].pk) {
          $scope.pa = $scope.savedAddress[i].pk
        }
      }
    })
  }
  $scope.fetchaddress()


  $scope.saveAddress = function() {

    if ($scope.form.title.length == 0 || $scope.form.country.length == 0 || $scope.form.city.length == 0 || $scope.form.state.length == 0 || $scope.form.pincode.length == 0 || $scope.form.mobileNo.length == 0) {
      Flash.create('warning', 'Fill the required Data')
      return
    }

    dataToSend = {
      city: $scope.form.city,
      country: $scope.form.country,
      landMark: $scope.form.landMark,
      mobileNo: $scope.form.mobileNo,
      pincode: $scope.form.pincode,
      primary: $scope.form.primary,
      state: $scope.form.state,
      street: $scope.form.street,
      title: $scope.form.title,
      sameAsShipping: $scope.form.sameAsShipping
    }

    if (!$scope.isStoreGlobal) {
      if ($scope.form.sameAsShipping == false) {
        dataToSend.billingCity = $scope.form.billingCity
        dataToSend.billingCountry = $scope.form.billingCountry
        dataToSend.billingLandMark = $scope.form.billingLandMark
        dataToSend.billingPincode = $scope.form.billingPincode
        dataToSend.billingState = $scope.form.billingState
        dataToSend.billingStreet = $scope.form.billingStreet
      } else {
        dataToSend.billingCity = ''
        dataToSend.billingCountry = ''
        dataToSend.billingLandMark = ''
        dataToSend.billingPincode = 0
        dataToSend.billingState = ''
        dataToSend.billingStreet = ''
      }
    }


    // if ($scope.form.pincode == null) {
    //   delete dataToSend.pincode
    // }
    var method = 'POST'
    var url = '/api/ecommerce/address/'
    if ($scope.form.pk != undefined) {
      method = 'PATCH'
      url = url + $scope.form.pk + '/'
    }
    $http({
      method: method,
      url: url,
      data: dataToSend
    }).
    then(function(response) {
      Flash.create('success', 'Added');
      $scope.refresh()
      $scope.fetchaddress()
    }, function(response) {
      Flash.create('danger', response.status + ' : ' + response.statusText);
    })
  }
});

app.controller('controller.ecommerce.account.support', function($scope, $rootScope, $state, $http, $timeout, $uibModal, $users, Flash) {

  document.title = BRAND_TITLE + ' | HelpCenter -  FAQ About Contextual Advertising , Online Advertising , Online Ads'
  document.querySelector('meta[name="description"]').setAttribute("content", BRAND_TITLE + ' Online Shopping')

  $http({
    method: 'GET',
    url: '/api/ecommerce/frequentlyQuestions/'
  }).
  then(function(response) {
    $scope.fAQ = response.data
  })

  $scope.message = {
    invoiceNo: '',
    subject: '',
    body: ''
  };
  $scope.sendMessage = function() {
    if ($scope.me == undefined || $scope.me == '' || $scope.message.invoiceNo == '' || $scope.message.body == '') {
      Flash.create("warning", "Please add all details")
    } else {
      dataToSend = {
        email: $scope.message.email,
        mobile: $scope.me.profile.mobile,
        invoiceNo: $scope.message.invoiceNo,
        subject: $scope.message.subject,
        message: $scope.message.body
      }
    }
    $http({
      method: 'POST',
      url: '/api/ecommerce/supportFeed/',
      data: dataToSend
    }).
    then(function(response) {
      $scope.message = {
        invoiceNo: '',
        subject: '',
        body: ''
      };
      Flash.create('success', response.status + ' : ' + response.statusText);
    }, function(response) {
      Flash.create('danger', response.status + ' : ' + response.statusText);
    })
  }


});



app.controller('controller.ecommerce.account', function($scope, $rootScope, $state, $http, $timeout, $uibModal, $users, Flash) {

});


app.controller('controller.ecommerce.checkout', function($scope, $rootScope, $state, $http, $timeout, $uibModal, $users, Flash, $filter) {

  $rootScope.limitValue = settings_orderLimit

  $scope.currency = settings_currencySymbol;
  $scope.isCod = false
  $scope.isCod = settings_isCOD;
  $scope.emptyCart = false
  $scope.isPromocode = settings_promoCode
  $scope.isTopMenu = settings_topIcon

  $scope.isHeart = settings_isHeart

  $scope.me = $users.get('mySelf');
  $scope.data = {
    quantity: 1,
    shipping: 'express',
    stage: '',
    promoCode: '',
    modeOfPayment: 'Card',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India',
      mobileNo: $scope.me.profile.mobile,
      landMark: ''
    },
    billingAddress: {
      street: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India',
      mobileNo: $scope.me.profile.mobile,
      billingLandMark: ''
    }
  };
  if (settings_isStoreGlobal) {
    $scope.data.address.country = ''
    $scope.data.billingAddress.country = ''
  }


  var url = new URL(window.location.href)
  var action = url.searchParams.get("action")
  if (action == 'retry') {
    $scope.data.stage = 'payment';
  } else if (action == 'success') {
    $http({
      method: 'GET',
      url: '/api/ecommerce/order/' + url.searchParams.get('orderid') + '/'
    }).
    then(function(response) {
      $scope.data.stage = 'confirmation';
      $scope.order = {
        odnumber: response.data.pk,
        dt: new Date(),
        paymentMode: 'Online'
      }
    })
  } else {
    $scope.data.stage = 'review'
  }

  $scope.deleteFromCart = function(i, value) {
    $http({
      method: 'DELETE',
      url: '/api/ecommerce/cart/' + value + '/',
      data: {
        typ: 'favourite',
        qty: null
      }
    }).
    then(function(response) {
      Flash.create("success", 'Product Removed')
      $scope.cartItems.splice(i, 1)
      $rootScope.inCart.splice(i, 1)
      $scope.calcTotal()
      if ($rootScope.inCart.length == 0) {
        $scope.emptyCart = true
      }
    })
  }

  function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }


  $scope.getAddr = getCookie('address')

  $scope.cartProducts = [];
  $scope.itemProduct = [];

  document.title = BRAND_TITLE + ' | Review Order > Select Shipping Address > Place Order'
  document.querySelector('meta[name="description"]').setAttribute("content", BRAND_TITLE + ' Online Shopping')

  if (settings_isStoreGlobal) {
    $scope.isStoreGlobal = true
  } else {
    $scope.isStoreGlobal = false
  }

  $scope.fetchaddress = function() {
    $http({
      method: 'GET',
      url: '/api/ecommerce/address/?user=' + $scope.me.pk
    }).
    then(function(response) {
      $scope.savedAddress = response.data
      $scope.pa = 0
      for (var i = 0; i < $scope.savedAddress.length; i++) {
        if ($scope.me.profile.primaryAddress == $scope.savedAddress[i].pk) {
          $scope.pa = $scope.savedAddress[i].pk
          $scope.data.address = $scope.savedAddress[i]
          if ($scope.getAddr != undefined) {
            if ($scope.getAddr == $scope.savedAddress[i].pk) {
              // $scope.saved = true
              $scope.idx = i
            }
          }
          if ($scope.data.address.mobileNo == null || $scope.data.address.mobileNo.length == 0) {
            $scope.data.address.mobileNo = $scope.me.profile.mobile
          }
        }
      }
    })
  }

  $scope.fetchaddress()
  $scope.saved = false

  $scope.ChangeAdd = function(idx, value) {
    if (value == "use") {
      $scope.addressview = false
      $scope.idx = null
      $scope.show(idx)

    } else if (value == "edit") {
      $scope.idx = null
      $scope.idxVal = idx
      $scope.addressview = true
    }
    $scope.data.address = $scope.savedAddress[idx]
    $scope.dataToSend.sameAsShipping = $scope.data.address.sameAsShipping
    $scope.data.billingAddress = {
      street: $scope.data.address.billingStreet,
      landMark: $scope.data.address.billingLandMark,
      city: $scope.data.address.billingCity,
      state: $scope.data.address.billingState,
      country: $scope.data.address.billingCountry,
      pincode: $scope.data.address.billingPincode,
    }

    if ($scope.data.address.mobileNo == null || $scope.data.address.mobileNo.length == 0) {
      $scope.data.address.mobileNo = $scope.me.profile.mobile
    }
  }


  $scope.countrySearch = function(query) {
    return $http.get('/api/ecommerce/searchCountry/?query=' + query).
    then(function(response) {
      $scope.countrList = response.data
      return response.data;
    })
  }

  $scope.stateSearch = function(query) {
    if ($scope.selectedCountryObj != undefined) {

      if ($scope.selectedCountryObj.id) {
        return $http.get('/api/ecommerce/searchCountry/?query=' + query + '&country=' + $scope.selectedCountryObj.id).
        then(function(response) {
          $scope.stateList = response.data
          return response.data;
        })
      }
    }
  }

  $scope.citySearch = function(query) {
    if ($scope.selectedStateObj != undefined) {
      if ($scope.selectedStateObj.id) {
        return $http.get('/api/ecommerce/searchCountry/?query=' + query + '&state=' + $scope.selectedStateObj.id).
        then(function(response) {
          return response.data;
        })
      }
    }
  }

  if (settings_isStoreGlobal) {
    $scope.showAddressForm = {
      state: false,
      city: false
    }

    $scope.showBillingAddressForm = {
      state: false,
      city: false
    }

    $scope.$watch('data.address.country', function(newValue, oldValue) {
      if (newValue != null && newValue != undefined) {

        if (newValue == '') {
          $scope.data.address.state = ''
        }

        if ($scope.countrList) {
          for (var i = 0; i < $scope.countrList.length; i++) {
            if ($scope.countrList[i].name == newValue) {
              $scope.selectedCountryObj = $scope.countrList[i]
              break;
            } else {
              $scope.selectedCountryObj = ''
            }
          }
        }
        if (typeof $scope.selectedCountryObj == 'object') {
          $scope.showAddressForm.state = true
        } else {
          $scope.showAddressForm.state = false
        }
      }
    });

    $scope.$watch('data.address.state', function(newValue, oldValue) {
      if (newValue != null && newValue != undefined) {

        if (newValue == '') {
          $scope.data.address.city = ''
        }

        if ($scope.stateList) {
          for (var i = 0; i < $scope.stateList.length; i++) {
            if ($scope.stateList[i].name == newValue) {
              $scope.selectedStateObj = $scope.stateList[i]
              break;
            } else {
              $scope.selectedStateObj = ''
            }
          }
        }
        if (typeof $scope.selectedStateObj == 'object') {
          $scope.showAddressForm.city = true
        } else {
          $scope.showAddressForm.city = false
        }
      }
    });


    $scope.$watch('data.billingAddress.country', function(newValue, oldValue) {
      if (newValue != null && newValue != undefined) {

        if (newValue == '') {
          $scope.data.billingAddress.state = ''
        }

        if (typeof newValue == 'object') {
          $scope.showBillingAddressForm.state = true
        } else {
          $scope.showBillingAddressForm.state = false
        }
      }
    });

    $scope.$watch('data.billingAddress.state', function(newValue, oldValue) {
      if (newValue != null && newValue != undefined) {

        if (newValue == '') {
          $scope.data.billingAddress.city = ''
        }

        if (typeof newValue == 'object') {
          $scope.showBillingAddressForm.city = true
        } else {
          $scope.showBillingAddressForm.city = false
        }
      }
    });
  } else {
    $scope.showAddressForm = {
      state: true,
      city: true
    }

    $scope.showBillingAddressForm = {
      state: true,
      city: true
    }

    $scope.showMessage = false

    $scope.$watch('data.address.pincode', function(newValue, oldValue) {
      if (newValue != null) {
        if (newValue.length == 6) {
          $http({
            method: 'GET',
            url: '/api/ecommerce/genericPincode/?pincode__iexact=' + newValue
          }).
          then(function(response) {
            if (response.data.length > 0) {
              $scope.showMessage = false
              $scope.data.address.city = response.data[0].city
              $scope.data.address.state = response.data[0].state
            } else {
              if (settings_isServiceArea) {
                $scope.showMessage = true
              }
            }
            if (settings_isServiceArea) {
              $http({
                method: 'GET',
                url: '/api/ecommerce/addPincode/?pincodes__iexact=' + newValue
              }).
              then(function(response) {
                if (response.data.length == 0) {
                  $scope.showMessage = true
                }
              })
            } else {
              $scope.showMessage = false
            }
          })
        } else if (newValue.length < 6) {
          $scope.showMessage = false
        }
      }
    })

    $scope.$watch('data.billingAddress.pincode', function(newValue, oldValue) {
      if (newValue != null) {
        if (newValue.length == 6) {
          $http({
            method: 'GET',
            url: '/api/ecommerce/genericPincode/?pincode__iexact=' + newValue
          }).
          then(function(response) {
            if (response.data.length > 0) {
              $scope.data.billingAddress.city = response.data[0].city
              $scope.data.billingAddress.state = response.data[0].state
              $scope.data.billingAddress.country = 'India'
            }
          })
        } else if (newValue.length < 6) {
          $scope.data.billingAddress.city = ''
          $scope.data.billingAddress.state = ''
        }
      }
    })
  }

  $scope.change = function() {
    $scope.saved = false
    $scope.data.address = {
      street: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India',
      mobileNo: $scope.me.profile.mobile,
      landMark: ''
    }
    $scope.data.billingAddress = {
      street: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India',
      landMark: ''
    }
    if (settings_isStoreGlobal) {
      $scope.data.address.country = ''
    }
  }
  $scope.cancel = function() {
    $scope.newAdr = false
    $scope.addressview = false
  }

  $scope.resetAdd = function() {
    $scope.newAdr = true
    $scope.idx = null
    $scope.addressview = false
    $scope.data.address = {
      street: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India',
      mobileNo: $scope.me.profile.mobile,
      landMark: ''
    }
    $scope.data.billingAddress = {
      street: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India',
      mobileNo: $scope.me.profile.mobile,
      landMark: ''
    }
    if (settings_isStoreGlobal) {
      $scope.data.address.country = ''
    }
  }

  $scope.show = function(idx) {
    $scope.addressview = false
    $scope.idx = idx
    $scope.newAdr = false
  }

  $scope.saveAdd = function() {
    if ($scope.data.address.pincode.length == 0 || $scope.data.address.city.length == 0 || $scope.data.address.state.length == 0 || $scope.data.address.country.length == 0 || $scope.data.address.mobileNo == null || $scope.data.address.mobileNo.length == 0) {
      Flash.create('danger', 'Please Fill Address Details');
      return;
    }

    if ($scope.dataToSend.sameAsShipping == false) {
      $scope.data.address.billingCity = $scope.data.billingAddress.city
      $scope.data.address.billingState = $scope.data.billingAddress.state
      $scope.data.address.billingLandMark = $scope.data.billingAddress.landMark
      $scope.data.address.billingCountry = $scope.data.billingAddress.country
      $scope.data.address.billingPincode = $scope.data.billingAddress.pincode
      $scope.data.address.billingStreet = $scope.data.billingAddress.street
    } else {
      $scope.data.address.billingCity = ''
      $scope.data.address.billingState = ''
      $scope.data.address.billingLandMark = ''
      $scope.data.address.billingCountry = ''
      $scope.data.address.billingPincode = 0
      $scope.data.address.billingStreet = ''
    }
    $scope.data.address.sameAsShipping = $scope.dataToSend.sameAsShipping

    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.ecommerce.checkout.addressmodel.html',
      size: 'md',
      backdrop: true,
      resolve: {
        add: function() {
          return $scope.data.address;
        }
      },
      controller: function($scope, $state, $http, $timeout, $uibModal, $users, Flash, $uibModalInstance, add) {
        $scope.adrForm = add;
        if ($scope.adrForm.title == undefined) {
          $scope.adrForm.title = ''
        }
        $scope.adrForm.primary = false
        $scope.saveAdrForm = function() {
          if ($scope.adrForm.title.length == 0) {
            Flash.create('danger', 'Please Mention Some Title');
            return;
          }
          if ($scope.adrForm.pincode.length == 0) {
            delete $scope.adrForm.pincode
          }
          var method = 'POST'
          var url = '/api/ecommerce/address/'
          if ($scope.adrForm.pk) {
            method = 'PATCH'
            url += $scope.adrForm.pk + '/'
          }
          $http({
            method: method,
            url: url,
            data: $scope.adrForm
          }).
          then(function(response) {
            Flash.create('success', 'Added');
            $scope.adrForm = response.data
            $uibModalInstance.dismiss($scope.adrForm);
          }, function(response) {
            Flash.create('danger', response.status + ' : ' + response.statusText);
          })

        }
      },
    }).result.then(function() {

    }, function(f) {
      if (typeof(f) != 'string') {
        if ($scope.data.address.pk) {

        } else {
          $scope.data.address.pk = f.pk
          $scope.savedAddress.push($scope.data.address)
        }

      }

    });
  }









  $scope.discussiondata = {
    discussionExpectedDate: '',
    discussionComment: '',
  }

  $scope.submitDiscussion = function() {
    console.log("aaaaaaaaaa");
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.ecommerce.checkout.submitDiscussionmodal.html',
      size: 'md',
      backdrop: true,
      resolve: {

      },
      controller: function($scope, $uibModalInstance) {
        $scope.data = {
          date: '',
          comment: '',
        }

        $scope.mindate = new Date();
        $scope.ok = function() {
          $uibModalInstance.dismiss($scope.data);
        };

        $scope.popup = {
          opened: false
        };

        $scope.open = function() {
          $scope.popup.opened = true;
        };

        $scope.cancel = function() {
          $uibModalInstance.close();
        };
      },
    }).result.then(function() {}, function(data) {
      var dateconcat = data.date.getDate();
      var monthconcat = data.date.getMonth() + 1;
      var yearconcat = data.date.getFullYear();
      data.date = yearconcat + '-' + monthconcat + '-' + dateconcat
      $scope.discussiondata.discussionExpectedDate = data.date;
      $scope.discussiondata.discussionComment = data.comment
      console.log($scope.discussiondata);
    });
  }









  $scope.uploadcustomatcart = function(indx) {
    var cartCust = $scope.cartItems[indx].customization
    var fd = new FormData()
    if (cartCust.image != null && cartCust.image != emptyFile) {
      fd.append('image', cartCust.image);

    }
    if (cartCust.data.length > 0) {
      fd.append('data', cartCust.data);
    }

    var method = 'POST'
    var url = '/api/ecommerce/customization/'
    if (cartCust.pk) {
      method = 'PATCH'
      url = url + cartCust.pk + '/'
    }

    $http({
      method: method,
      url: url,
      data: fd,
      transformRequest: angular.identity,
      headers: {
        'Content-Type': undefined
      }
    }).
    then(function(response) {
      $scope.cartItems[indx].customization = response.data
      var dataVal = {
        customization: $scope.cartItems[indx].customization.pk,
      }
      $http({
        method: 'PATCH',
        url: '/api/ecommerce/cart/' + $scope.cartItems[indx].pk + '/',
        data: dataVal,
      })
    })
  }

  $scope.deletecustomatcart = function(indx) {
    var cartCust = $scope.cartItems[indx].customization
    var url = '/api/ecommerce/customization/' + cartCust.pk + '/'
    $http({
      method: 'DELETE',
      url: url,
      transformRequest: angular.identity,
      headers: {
        'Content-Type': undefined
      }
    }).
    then(function(response) {
      $scope.cartItems[indx].customization = {
        'image': emptyFile,
        'data': ''
      }

    })
  }

  function findNum(arrData, num) {
    var arr = []
    arrData.forEach(function(item) {
      arr.push(item.qty)
    })
    var dataa = arr
    dataa.push(num)
    var data = dataa.sort(function(a, b) {
      return a - b;
    })
    var index = data.lastIndexOf(num)
    if (index === 0) {
      return null;
    } else if (index === data.length - 1) {
      return arrData[arr[arr.length - 1]].discount;
    } else {
      var min = index - 1
      return arrData[min].discount;
    }
  }

  $scope.calcTotal = function() {
    $scope.total = 0;
    $scope.totalAfterDiscount = 0;
    var price = 0;
    var discount = 0;
    if ($state.params.pk == 'cart') {
      for (var i = 0; i < $scope.cartItems.length; i++) {
        if ($scope.cartItems[i].customization == null) {
          $scope.cartItems[i].customization = {
            'image': emptyFile,
            'data': ''
          }
        }
        if ($scope.cartItems[i].product.bulkChart.length > 0) {

          var x = findNum($scope.cartItems[i].product.bulkChart, $scope.cartItems[i].qty);

          var arrSku = [$scope.cartItems[i].product.product.serialNo]
          $scope.cartItems[i].product.product_variants.forEach(function(item) {
            arrSku.push(item.sku)
          })
          if (arrSku.indexOf($scope.cartItems[i].prodSku) === 0) {
            if (x != null) {
              $scope.cartItems[i].unitPrice = Math.round($scope.cartItems[i].product.product.discountedPrice - (($scope.cartItems[i].product.product.discountedPrice / 100) * x));
            }
            if (x == null) {
              $scope.cartItems[i].unitPrice = $scope.cartItems[i].product.product.discountedPrice;
            }

          } else {
            if (x != null) {
              $scope.cartItems[i].unitPriceVarient = Math.round($scope.cartItems[i].product.product.discountedPrice - (($scope.cartItems[i].product.product.discountedPrice / 100) * x));
            }
            if (x == null) {
              $scope.cartItems[i].unitPriceVarient = $scope.cartItems[i].cost;
            }
          }


          console.log($scope.cartItems[i].product.product.discount, "kkkkkkkkkkkkkkkkk");
          console.log($scope.unitPrice, 'aaaaaaaa');
          $scope.total = $scope.total + (price * $scope.cartItems[i].qty)
          $scope.totalAfterDiscount = $scope.totalAfterDiscount + (discount * $scope.cartItems[i].qty)
        } else {
          if ($scope.cartItems[i].prodSku == $scope.cartItems[i].product.product.serialNo) {
            price = $scope.cartItems[i].product.product.price
            discount = $scope.cartItems[i].product.product.discount
          } else {
            price = $scope.cartItems[i].prodVarPrice
            discount = $scope.cartItems[i].prod_var.discount
          }

          $scope.total = $scope.total + (price * $scope.cartItems[i].qty)
          $scope.totalAfterDiscount = $scope.totalAfterDiscount + (discount * $scope.cartItems[i].qty)
        }
      }
    } else {
      $scope.total = $scope.item.product.price * $scope.item.qty
      $scope.totalAfterDiscount = $scope.item.product.discount * $scope.item.qty
    }
  }


  $scope.stock = []

  if ($state.params.pk == 'cart') {
    $http({
      method: 'GET',
      url: '  /api/ecommerce/cart/?user=' + $scope.me.pk + '&typ=cart'
    }).
    then(function(response) {
      $scope.cartItems = response.data;
      for (var i = 0; i < $scope.cartItems.length; i++) {
        var prod_variants = $scope.cartItems[i].product.product_variants
        if ($scope.cartItems[i].prodVarPrice == null) {} else {
          for (var j = 0; j < prod_variants.length; j++) {
            $scope.product_var = undefined
            if (prod_variants[j].sku == $scope.cartItems[i].prodSku) {
              $scope.cartItems[i].prod_var = prod_variants[j]
            }
          }
        }
        if ($rootScope.pin != undefined) {
          $scope.store = $rootScope.pin.pk
        }

        if (response.data[i].prod_var !== undefined) {
          $scope.product_var = $scope.cartItems[i].prod_var.id
        }

        if (INVENTORY_ENABLED == 'False') {
          $scope.cartItems[i].stock = 1000;
          $scope.showReview = true;
        } else {
          $http({
            method: 'GET',
            url: '/api/ecommerce/getinStock/?product_id=' + $scope.cartItems[i].product.product.pk + '&product_var=' + $scope.product_var + '&store=' + $scope.store,
          }).
          then(function(response) {
            $scope.stock.push(response.data)
          })
        }
      }

      $scope.calcTotal();
    })
  } else {
    $http({
      method: 'GET',
      url: '/api/ecommerce/listing/' + $state.params.pk + '/'
    }).
    then(function(response) {
      $scope.item = response.data;
      $scope.item.qty = 1;
      $scope.calcTotal();
    })
  }

  $scope.getinStock = function() {
    for (var i = 0; i < $scope.cartItems.length; i++) {
      if ($rootScope.pin.pk == undefined) {
        $scope.code = "undefined"
      } else {
        $scope.code = $rootScope.pin.pk
      }
      if ($rootScope.inCart[i].prod_var == undefined) {
        $scope.prod_var = 'undefined'
      } else {
        $scope.prod_var = $scope.cartItems[i].prod_var.id
      }
      if (INVENTORY_ENABLED == 'False') {
        $scope.cartItems[i].stock = 1000;
      } else {
        $scope.cartItems[i].stock = $scope.cartItems[i].stock;
      }
    }
  }

  if (INVENTORY_ENABLED == 'True') {
    $timeout(function() {
      $scope.showReview = true;
      $scope.getinStock()
    }, 4000);
  }
  $scope.showReview = false;

  $scope.changeQty = function() {
    $scope.calcTotal();
  }
  $scope.promoDiscount = 0
  $scope.applyPromo = function() {
    if ($scope.msg == '') {
      return
    }
    $http({
      method: 'GET',
      url: '  /api/ecommerce/promoCheck/?name=' + $scope.data.promoCode
    }).
    then(function(response) {
      $scope.msg = response.data.msg
      if (response.data.msg == 'Success') {
        $scope.promoDiscount = response.data.val;
        $scope.totalAfterPromo = $scope.totalAfterDiscount - ($scope.promoDiscount / 100) * $scope.totalAfterDiscount
      } else {
        $scope.data.promoCode = ''
      }
    })
  }


  $scope.errorInshipping = false


  if (settings_isStoreGlobal == false) {
    $http({
      methof: 'GET',
      url: '/api/ecommerce/userProfileSetting/?user=' + $scope.me.pk
    }).then(function(response) {
      if (response.data.gst.length > 0) {
        $scope.isGstVal = true
      } else {
        $scope.isGstVal = false
      }
    })
  } else {
    $scope.isGstVal = true
  }

  $scope.dataToSend = {
    sameAsShipping: false
  }

  $scope.$watch('dataToSend.sameAsShipping', function(newValue, oldValue) {


    if (newValue == false) {
      $scope.showFields = true;

    } else {
      $scope.showFields = false;
      $scope.dataToSend.billingAddress = ''
    }
  })
  $scope.totalLimit = false
  $scope.next = function() {

    if ($rootScope.limitValue) {
      if ($scope.totalAfterPromo > $rootScope.limitValue || $scope.totalAfterDiscount > $rootScope.limitValue) {
        $scope.totalLimit = true
      } else {
        $scope.totalLimit = false
      }
    }
    window.scrollTo(0, 0);
    if ($scope.data.stage == 'review') {
      $scope.dataToSend.promoCode = $scope.data.promoCode;
      $scope.dataToSend.promoCodeDiscount = $scope.promoDiscount;
      if ($scope.cartItems != undefined) {
        for (var i = 0; i < $scope.cartItems.length; i++) {
          for (var j = 0; j < $scope.cartProducts.length; j++) {
            if ($scope.cartProducts[j].prodSku == $scope.cartItems[i].prodSku) {

              $scope.cartProducts.splice(j, 1)
            }
          }
          if ($scope.cartItems[i].stock < 0 || !$scope.cartItems[i].stock) {
            Flash.create('danger', 'Please Select Valid Products')
            return
          } else if ($scope.cartItems[i].qty <= 0 || $scope.cartItems[i].qty == undefined) {
            Flash.create('danger', 'Please Select Valid quantity')
            return
          } else {

            var weight = $scope.cartItems[i].product.product.grossWeight
            if (weight == undefined || weight == null) {
              weight = 0
            }
            // if ($scope.cartItems[i].customization != undefined && $scope.cartItems[i].customization != null) {
            //   var customization = $scope.cartItems[i].customization
            // }
            $scope.cartProducts.push({
              pk: $scope.cartItems[i].product.pk,
              qty: $scope.cartItems[i].qty,
              prodSku: $scope.cartItems[i].prodSku,
              desc: $scope.cartItems[i].desc,
              grossWeight: weight,
              customization: $scope.cartItems[i].customization.pk
            })
          }
        }

        $scope.dataToSend.products = $scope.cartProducts
      } else {
        for (var i = 0; i < $scope.itemProduct.length; i++) {
          if ($scope.itemProduct[i].pk == $scope.item.pk) {
            $scope.itemProduct.splice(i, 1)
          }
        }
        $scope.itemProduct.push({
          pk: $scope.item.pk,
          qty: $scope.item.qty,
          prodSku: $scope.item.product.serialNo,
          customization: $scope.item.product.customization.pk
        })
        $scope.dataToSend.products = $scope.itemProduct
      }
      if ($scope.dataToSend.products.length > 0) {
        if ($scope.dataToSend.products[0].pk == undefined) {
          Flash.create('danger', 'Please Select Valid Product')
          return
        }
      } else {
        Flash.create('danger', 'Please Select The Product')
        return
      }
      $scope.data.stage = 'shippingDetails';

    } else if ($scope.data.stage == 'shippingDetails') {
      $scope.errorInshipping = false
      $scope.openShippingErrorModal = function() {
        $uibModal.open({
          templateUrl: '/static/ngTemplates/app.ecommerce.shippingError.html',
          size: 'md',
          backdrop: false,
          controller: 'controller.ecommerce.shippingError.modal',
        }).result.then(function() {

        }, function() {

        });
      }

      // $scope.sendShippingErrorStatus = function() {
      //   var dataToSend = {
      //     username: $scope.me.username,
      //     firstName: $scope.me.first_name,
      //     lastName: $scope.me.last_name,
      //     email: $scope.me.email,
      //     address: $scope.dataToSend.address,
      //     billingAddress: $scope.dataToSend.billingAddress,
      //     phone: $scope.dataToSend.mobile
      //   }
      //   $http({
      //     method: 'POST',
      //     url: '/api/ecommerce/sendShippingErrorStatus/',
      //     data: dataToSend
      //   }).then(function(response) {
      //   })
      // }

      if (!$scope.isStoreGlobal) {
        if ($scope.data.address.landMark == '') {
          Flash.create('warning', 'Please Fill All Details')
          return
        }
      }

      if ($scope.data.address.mobileNo == '' || $scope.data.address.mobileNo == null || $scope.data.address.city == '' || $scope.data.address.pincode == '' || $scope.data.address.country == '' || $scope.data.address.state == '' || $scope.data.address.street == '') {
        Flash.create('warning', 'Please Fill All Details')
        return
      } else {
        $scope.dataToSend.mobile = $scope.me.profile.mobile
        $scope.dataToSend.address = $scope.data.address
        if ($scope.data.billingAddress.state == '' && $scope.dataToSend.sameAsShipping == false) {
          Flash.create('warning', 'Please Add Billing Address')
          return
        } else if ($scope.dataToSend.sameAsShipping == true) {
          $scope.dataToSend.billingAddress = $scope.data.address
        } else {
          $scope.dataToSend.billingAddress = $scope.data.billingAddress
        }
      }


      if ($scope.dataToSend.address.pk == undefined) {

        var addressToPost = $scope.dataToSend.address
        addressToPost.title = $scope.dataToSend.address.street
        addressToPost.primary = false

        $http({
          method: 'POST',
          url: '/api/ecommerce/address/',
          data: addressToPost
        }).
        then(function(response) {
          $scope.dataToSend.address = response.data
          $scope.savedAddress.push($scope.dataToSend.address)
          $scope.resetAdd()
        }, function(response) {
          Flash.create('danger', response.status + ' : ' + response.statusText);
        })


      }

      $scope.data.stage = 'payment';
      $scope.getShippingCharges = false
      $scope.totalWeight = 0;
      for (var i = 0; i < $scope.cartProducts.length; i++) {
        $scope.totalWeight += parseFloat($scope.cartProducts[i].grossWeight) * $scope.cartProducts[i].qty
      }
      $scope.totalWeight = 2.204 * $scope.totalWeight

      if (settings_isShipmentPrice) {
        $http({
          method: 'GET',
          url: '/api/ecommerce/searchCountry/?getCountryCode=' + $scope.data.address.country
        }).then(function(response) {
          if (response.data) {
            $scope.country = response.data[0]
          } else {
            $scope.country = 'US'
          }
          $http({
            method: 'GET',
            url: '/api/ecommerce/shipmentCharge/?country=' + $scope.country + '&pincode=' + $scope.data.address.pincode + '&weight=' + $scope.totalWeight
          }).then(function(response) {
            $scope.shippingCharges = response.data
            $scope.getShippingCharges = true
          }).catch(function(err) {
            $scope.shippingCharges = 0
            $scope.errorInshipping = true

            $scope.openShippingErrorModal()
            $scope.sendShippingErrorStatus()

            $scope.getShippingCharges = true
          })
        })
      } else {
        $scope.getShippingCharges = true
        $scope.shippingCharges = 0
      }

    }
  }
  $scope.idx = 0
  $scope.prev = function() {
    if ($scope.data.stage == 'shippingDetails') {
      $scope.data.stage = 'review';
    } else if ($scope.data.stage == 'payment') {
      $scope.data.stage = 'shippingDetails';
    }
  }

  $scope.username = $scope.me.username


  $scope.pay = function() {
    $scope.dataToSend.modeOfPayment = $scope.data.modeOfPayment
    $scope.dataToSend.modeOfShopping = 'online'
    $scope.dataToSend.paidAmount = 0
    $scope.dataToSend.approved = false
    $scope.data.stage = 'processing'
    if ($scope.shippingCharges > 0) {
      $scope.dataToSend.shippingCharges = $scope.shippingCharges
    }


    $http({
      method: 'POST',
      url: '  /api/ecommerce/createOrder/',
      data: $scope.dataToSend
    }).
    then(function(response) {
      window.location = '/makeOnlinePayment/?orderid=' + response.data.odnumber;
    })
  }

  $scope.order = function() {
    $scope.dataToSend.modeOfPayment = $scope.data.modeOfPayment
    $scope.dataToSend.modeOfShopping = 'online'
    if ($scope.dataToSend.modeOfPayment == 'COD') {
      $scope.dataToSend.paidAmount = 0
    } else {
      $scope.dataToSend.paidAmount = 0
    }

    if ($scope.shippingCharges > 0) {
      $scope.dataToSend.shippingCharges = $scope.shippingCharges
    }

    $scope.data.stage = 'processing';
    if ($rootScope.multiStore) {
      $scope.dataToSend.storepk = $rootScope.storepk
    }
    console.log($scope.discussiondata, 'ghggggggggggggggg');
    if ($scope.discussiondata.discussionExpectedDate != '') {
      $scope.dataToSend.discussionExpectedDate = $scope.discussiondata.discussionExpectedDate
    }
    if ($scope.discussiondata.discussionComment != '' || $scope.discussiondata.discussionComment.length > 0) {
      $scope.dataToSend.discussionComment = $scope.discussiondata.discussionComment
    }

    $http({
      method: 'POST',
      url: '  /api/ecommerce/createOrder/',
      data: $scope.dataToSend
    }).
    then(function(response) {
      console.log(response.data);
      $scope.order = response.data
      // $scope.orderSuccessfull($scope.order.pk)
      window.location = '/orderSuccessful/?orderid=' + $scope.order.odnumber;
      $scope.data.stage = 'confirmation';
      $rootScope.inCart = [];
      $rootScope.inFavourite = [];
      $scope.item = [];

    })
    // .catch(function(err) {
    //     window.location = '/orderFailure';
    // })

  }


  $scope.addWishList = function(i, value) {
    $http({
      method: 'PATCH',
      url: '/api/ecommerce/cart/' + value + '/',
      data: {
        typ: 'favourite',
        qty: null
      }
    }).
    then(function(response) {
      $scope.cartItems.splice(i, 1)
      $rootScope.inCart.splice(i, 1)
      $scope.calcTotal()
    })

  }

  $scope.$watch('data.address', function(newValue, oldValue) {
    $scope.address = newValue.pk
    setCookie("address", JSON.stringify($scope.address), 365);
  })
})


app.controller('controller.ecommerce.shippingError.modal', function($scope, $rootScope, $state, $http, $timeout, $uibModal, $users, $interval, Flash, $uibModalInstance) {

  $http.get('/api/ERP/appSettings/?app=25&name__iexact=email').
  then(function(response) {
    $scope.supportEmail = response.data[0].value
  })

  $http.get('/api/ERP/appSettings/?app=25&name__iexact=phone').
  then(function(response) {
    $scope.supportPhone = response.data[0].value
  })

  $scope.clickedOkay = function() {
    $uibModalInstance.dismiss();
  }
})


app.controller('ecommerce.main', function($scope, $rootScope, $state, $http, $timeout, $uibModal, $users, $interval, Flash, $sce) {
  console.log($users.get('mySelf'));
  $scope.showCat = false;
  $rootScope.device;

  function smDevice(x) {
    if (x.matches) {
      $rootScope.device = 'small'
    }
  }

  function lgDevice(x) {
    if (x.matches) {
      $rootScope.device = 'large'
    }
  }

  var sm = window.matchMedia("(max-width:767px)")
  smDevice(sm)
  sm.addListener(smDevice)

  var lg = window.matchMedia("(min-width:767px)")
  lgDevice(lg)
  lg.addListener(lgDevice)


  $scope.$watch('slide.active', function(newValue, oldValue) {
    if (newValue == undefined) {
      return;
    }

    $(".owl-carousel").trigger("to.owl.carousel", [newValue, 1])

  })

  var owlAPi;

  $scope.properties = {
    lazyLoad: true,
    items: 1,
    loop: true,
    autoplay: true,
    autoplayTimeout: 5000,
    dots: false,
    responsive: {
      0: {
        items: 1
      },
      600: {
        items: 1
      },
      1000: {
        items: 1
      }
    },
  };

  $scope.curosel1mobile_properties = {
    lazyLoad: false,
    items: 1,
    loop: true,
    autoplay: true,
    autoplayTimeout: 10000,
    dots: false,
    responsive: {
      0: {
        items: 1
      },
      479: {
        items: 1
      },
      600: {
        items: 1
      },
      1000: {
        items: 1,
      }
    },
  };

  $scope.curosel1_properties = {
    lazyLoad: true,
    items: 1,
    loop: true,
    autoplay: false,
    autoplayTimeout: 5000,
    dots: false,
    smartSpeed: 1000,
    responsive: {
      0: {
        items: 1
      },
      600: {
        items: 1
      },
      1000: {
        items: 1
      }
    },
    navContainer: '#dealsNav ',
    navText: ["<i class='fa fa-chevron-left'></i>", "<i class='fa fa-chevron-right'></i>"],
  };
  $scope.curosel2_properties = {
    lazyLoad: false,
    items: 4,
    loop: true,
    autoplay: false,
    autoplayTimeout: 5000,
    dots: false,
    responsive: {
      0: {
        items: 1
      },
      479: {
        items: 1
      },
      600: {
        items: 1
      },
      1000: {
        items: 5,
      }
    },
    navContainer: '#trendsNav ',
    navText: ["<i class='fa fa-chevron-left'></i>", "<i class='fa fa-chevron-right'></i>"],
    onInitialized: counter,
    onTranslated: counter,
  };

  function counter(event) {
    var element = event.target;
    var items = event.item.count;
    var item = event.item.index + 1;

    if (item > items) {
      item = item - items
    }
    $scope.counterItems = items

  }
  $scope.brandImages = {
    lazyLoad: true,
    items: 8,
    loop: true,
    autoplay: true,
    autoplayTimeout: 5000,
    dots: false,
    responsive: {
      // breakpoint from 0 up
      0: {
        items: 2,
      },
      // breakpoint from 480 up
      480: {
        items: 2,
      },
      // breakpoint from 768 up
      768: {
        items: 8,
      }
    },
    navContainer: '.navCustom ',
    navText: ["<i class='fa fa-chevron-left'></i>", "<i class='fa fa-chevron-right'></i>"],
  };
  $scope.curosel3_properties = {
    lazyLoad: true,
    items: 1,
    loop: true,
    autoplay: true,
    autoplayTimeout: 5000,
    dots: false,
    responsive: {
      0: {
        items: 1
      },
      600: {
        items: 1
      },
      1000: {
        items: 1
      }
    },
  };
  $scope.recentlyView = {
    lazyLoad: true,
    items: 6,
    loop: true,
    autoplay: true,
    autoplayTimeout: 5000,
    dots: false,
    nav: true,
    navContainer: '#customNav',
    navText: ["<i class='fa fa-chevron-left'></i>", "<i class='fa fa-chevron-right'></i>"],
    responsive: {
      0: {
        items: 1
      },
      600: {
        items: 3
      },
      1000: {
        items: 8
      }
    },


  };




  $scope.curosel4_properties = {
    lazyLoad: true,
    items: 3,
    loop: true,
    autoplay: true,
    autoplayTimeout: 5000,
    dots: false,
    responsive: {
      0: {
        items: 1
      },
      600: {
        items: 1
      },
      1000: {
        items: 4
      }
    },
    navContainer: '.trendsNav ',
    navText: ["<i class='fa fa-chevron-left'></i>", "<i class='fa fa-chevron-right'></i>"],
  };



  $scope.reviewsView = {
    lazyLoad: true,
    items: 3,
    loop: true,
    autoplay: true,
    autoplayTimeout: 5000,
    dots: true,
    responsiveClass: true,

    responsive: {
      // breakpoint from 0 up
      0: {
        items: 1,
      },
      // breakpoint from 480 up
      480: {
        items: 2,
      },
      // breakpoint from 768 up
      768: {
        items: 3,
      }
    }
  };

  $scope.brandsImg = [
    $sce.trustAsResourceUrl('https://colorlib.com/preview/theme/onetech/images/brands_3.jpg'),
    $sce.trustAsResourceUrl('https://colorlib.com/preview/theme/onetech/images/brands_4.jpg'),
    $sce.trustAsResourceUrl('https://colorlib.com/preview/theme/onetech/images/brands_5.jpg'),
    $sce.trustAsResourceUrl('https://colorlib.com/preview/theme/onetech/images/brands_6.jpg'),
    $sce.trustAsResourceUrl('https://colorlib.com/preview/theme/onetech/images/brands_7.jpg'),
    $sce.trustAsResourceUrl('https://colorlib.com/preview/theme/onetech/images/brands_8.jpg'),
    $sce.trustAsResourceUrl('https://colorlib.com/preview/theme/onetech/images/brands_1.jpg'),
    $sce.trustAsResourceUrl('https://colorlib.com/preview/theme/onetech/images/brands_2.jpg')
  ]


  $scope.MODE = MODE;
  $rootScope.ICON_LOGO = ICON_LOGO
  $rootScope.BRAND_TITLE = BRAND_TITLE
  $scope.me = $users.get('mySelf')
  $rootScope.companyPhone = ''
  $rootScope.companyEmail = ''
  $rootScope.currency = ''
  $scope.showCartImage = false;
  $http.get('/api/ERP/appSettings/?app=25&name__iexact=phone').
  then(function(response) {
    $rootScope.companyPhone = response.data[0].value
  })
  $http.get('/api/ERP/appSettings/?app=25&name__iexact=email').
  then(function(response) {
    $rootScope.companyEmail = response.data[0].value
  })

  $scope.currency = settings_currencySymbol;
  $scope.showCartImage = false

  $scope.showCartImage = settings_isCartImage
  $scope.isCartView = false
  $scope.isCartView = settings_isCart
  $scope.maxCategories = false

  $scope.maxCategories = settings_maxCategories

  $rootScope.addToCart = []
  $scope.addTCart = getCookie('addToCart')
  if ($scope.addTCart != '') {
    $rootScope.addToCart = JSON.parse($scope.addTCart)
  }

  $scope.mainPage = function() {
    window.location = '/login';
  }


  function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }


  $rootScope.multiStore = false
  $rootScope.pin = 0
  $scope.openPinPopup = function() {
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.ecommerce.pincodeEnquiry.form.html',
      size: 'md',
      backdrop: false,
      controller: 'controller.ecommerce.pincodeEnquiry.modal',
    }).result.then(function() {

    }, function() {

    });
  }
  $http.get('/api/ERP/appSettings/?app=25&name__iexact=multipleStore').
  then(function(response) {
    if (response.data[0] != null) {
      if (response.data[0].flag) {
        $rootScope.multiStore = true
        var pincode = getCookie('userPincode')
        $rootScope.pin = pincode
        if (pincode == "") {
          $scope.openPinPopup()
        } else {
          $http.get('/api/POS/store/?pincode=' + pincode).
          then(function(response) {
            if (response.data.length > 0) {
              $rootScope.pin = response.data[0].pincode
              $rootScope.storepk = response.data[0].pk
              $rootScope.$broadcast('filterForStore', {
                pin: response.data[0].pincode
              });
              $rootScope.$broadcast('filterForCategoryStore', {
                pin: response.data[0].pincode
              });
            }
          })
        }
      }
    }
  })
  $scope.onBtnEnter = false
  $scope.onDropdownEnter = false
  $scope.onChildEnter = false
  $scope.SortByCategory = false
  $scope.topLevelMenu = false
  $scope.isTopMenu = settings_topIcon
  var data = []

  $http({
    method: 'GET',
    url: '/api/ecommerce/explore.html'
  }).then(function(response) {
    $scope.selectedOne = function(data) {
      $scope.childData = data
    }
    $scope.selectedDropdown = function(data) {
      $scope.childData = data
      $scope.onChildEnter = true

    }
    $scope.headerSmall = function() {
      $scope.onDropdownEnter = !$scope.onDropdownEnter
      $scope.onChildEnter = false
      $scope.menuDropdown = false
    }

    $scope.onDropdownEnterProfile = false
    $scope.headerSmallProfile = function() {
      $scope.onDropdownEnterProfile = !$scope.onDropdownEnterProfile
    }

    // $scope.$watch(function() { return angular.element('#idDropdown').is(':visible') }, function(newValue) {
    //   console.log(newValue,'lllllll');
    //   if (newValue == false) {
    //       $scope.onDropdownEnter = false
    //    }
    // });
    $scope.selectedChild = function(indx) {

      $scope.indx = indx

    }
    $scope.selectedClose = function() {
      $scope.indx = -1
    }

  });

  $http({
    method: 'GET',
    url: '/api/ecommerce/expand.html'
  }).then(function(response) {
    $scope.childData = data

  });


  $scope.resetAll = function() {
    $scope.childData = {}
  }



  $scope.bannerImage = false

  $scope.bannerImage = settings_bannerImage
  if ($scope.bannerImage) {
    $scope.paddingTop = '5vh';
  } else {
    $scope.paddingTop = '0px;';
  }

  $scope.me = $users.get('mySelf')
  $rootScope.inCart = [];
  $rootScope.inFavourite = [];
  $scope.data = {
    location: null
  }
  $scope.params = {
    location: null
  }

  $scope.loginPage = function() {
    window.location = '/login';
  }
  $scope.logoutPage = function() {
    window.location = '/logout';
  }

  $scope.goToAdmin = function() {
    window.location = '/ERP/';
  }

  $scope.registerPage = function() {
    window.location = '/register';
  }

  $scope.SortByCategory = settings_SortByCategory

  $scope.topLevelMenu = settings_topLevelMenu
  $scope.isTopMenu = settings_topIcon

  $http.get('/api/ecommerce/pages/?topLevelMenu=1').
  then(function(response) {
    $scope.toplevelPages = response.data;
  })

  $scope.bottomMenuPagesCopy = []


  $scope.isFeedback = settings_isFeedback;
  $scope.isContactUs = settings_isContactUs;
  $scope.isFaq = settings_isFaq;



  $http.get('/api/ecommerce/pages/?bottomMenu=1').
  then(function(response) {
    $scope.bottomMenuPages = response.data;

    for (var i = 0; i < $scope.bottomMenuPages.length; i++) {
      if ($scope.bottomMenuPages[i].bottomMenu) {
        $scope.bottomMenuPagesCopy.push($scope.bottomMenuPages[i])
      }
    }

    $scope.copyArr = [...$scope.bottomMenuPagesCopy];

    $scope.bottomMenuPages1 = $scope.copyArr.slice(0, $scope.copyArr.length / 2)
    $scope.bottomMenuPages2 = $scope.copyArr.slice($scope.copyArr.length / 2, $scope.copyArr.length)
    console.log($scope.bottomMenuPages2, 'pppppppppppp');
  })

  $http.get('/api/ecommerce/categorySortList/').
  then(function(response) {
    $scope.categoriesList = response.data
  })

  $scope.topIcon = false

  $scope.topIcon = settings_topIcon

  $scope.iconImage = false
  $scope.iconImage = settings_iconImage
  $rootScope.genericImage = {}
  $http({
    method: 'GET',
    url: '/api/ecommerce/genericImage/'
  }).
  then(function(response) {
    if (response.data.length > 0) {
      $rootScope.genericImage = response.data[0]
    }
  })


  $scope.genericProductSearch = function(query) {
    if ($rootScope.multiStore) {
      surl = '/api/ecommerce/searchProduct/?search=' + query + '&pin=' + $rootScope.pin + '&multipleStore&limit=6'
    } else {
      surl = '/api/ecommerce/searchProduct/?search=' + query + '&limit=6'
    }
    return $http.get(surl).
    then(function(response) {
      return response.data;
    })
  };

  $scope.searchProduct = {
    product: ''
  };

  $scope.bannerText = false

  $scope.bannerText = settings_bannerText

  $scope.topStaticBanner = false

  $scope.topStaticBanner = settings_topStaticBanner


  $scope.search = function() {
    console.log("herrrrrrrrrrrrrrr");
    if (typeof $scope.searchProduct.product == 'object') {
      if ($scope.searchProduct.product.typ == 'list') {
        $state.go('details', {
          id: $scope.searchProduct.product.pk,
          name: $scope.searchProduct.product.name.split(' ').join('-')
        })
      } else {
        $state.go('categories', {
          name: $scope.searchProduct.product.name
        })
      }
      $scope.searchProduct.product = '';
    }
  }

  $scope.$watch('searchProduct.product', function(newValue, oldValue) {
    if (newValue != null && typeof newValue == 'object') {
      if (newValue.typ == 'list') {
        $state.go('details', {
          id: newValue.pk,
          name: newValue.name.split(' ').join('-'),
          sku: newValue.serialNo
        })
      } else {
        $state.go('categories', {
          name: newValue.name
        })
      }
      $scope.searchProduct.product = '';
    }
  }, true);

  $scope.slide = {
    banners: [],
    active: 0
  };
  $scope.slideMobile = {
    banners: [],
    active: 0
  };

  $http({
    method: 'GET',
    url: '/api/ecommerce/offerBanner/?level=1'
  }).
  then(function(response) {

    $scope.slide.banners = response.data;
    if ($scope.slide.banners.length > 5) {
      $scope.slide.banners = $scope.slide.banners.slice(0, 5)
    }
    // $scope.slide.active = 0
    // if ($scope.slide.banners.length > 1) {
    //   $scope.slide.lastbanner = $scope.slide.banners.length - 1
    // } else {
    //   $scope.slide.lastbanner = 0
    // }
    //
    // $scope.slideMobile.banners = response.data;
    // if ($scope.slideMobile.banners.length > 3) {
    //   $scope.slideMobile.banners = response.data.slice(0, 3);
    // }
    // $scope.slideMobile.active = 0
    // if ($scope.slideMobile.banners.length > 1) {
    //   $scope.slideMobile.lastbanner = $scope.slideMobile.banners.length - 1
    // } else {
    //   $scope.slideMobile.lastbanner = 0
    // }
  })
  $scope.changeSlide = function(index) {
    $scope.slide.active = index;
  }

  $scope.change = function(value) {
    console.log("hereeeeeeeee");
    if (value == "next") {
      if ($scope.slide.active == undefined) {
        $scope.slide.active = 0
      }
      if ($scope.slide.active == $scope.slide.lastbanner) {
        $scope.slide.active = 0;
      } else {
        $scope.slide.active += 1;
      }
    } else if (value == "previous") {
      if ($scope.slide.active == undefined) {
        $scope.slide.active = 0;
      } else {
        $scope.slide.active -= 1;
      }

      if ($scope.slide.active < 0) {
        $scope.slide.active = $scope.slide.lastbanner
      }
    }
  }


  $scope.changeSlideMobile = function(index) {
    $scope.slideMobile.active = index;
  }

  $interval(function() {
    if ($scope.slideMobile.active == undefined) {
      $scope.slideMobile.active = 0
    }
    if ($scope.slideMobile.active == $scope.slideMobile.lastbanner) {
      $scope.slideMobile.active = 0;
    } else {
      $scope.slideMobile.active += 1;
    }
  }, 3000);

  $scope.feedback = {
    email: '',
    mobile: null,
    message: ''
  };

  $scope.feedbackstatus = function() {

    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.ecommerce.feedBack.html',
      size: 'md',
      backdrop: false,
      controller: 'controller.ecommerce.feedBack.modal',
    }).result.then(function() {

    }, function() {

    });
  }

  $scope.faq = function() {

    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.ecommerce.FAQ.html',
      size: 'md',
      backdrop: false,
      controller: 'controller.ecommerce.FAQ.modal',
    }).result.then(function() {

    }, function() {

    });
  }


  $scope.contactUs = function() {
    $scope.me = $users.get('mySelf')
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.ecommerce.contact.html',
      size: 'md',
      backdrop: false,
      controller: 'controller.ecommerce.contact.modal',
    }).result.then(function() {

    }, function() {

    });
  }


  // $scope.productsSample = [
  //   {
  //     name:'A7 Plus',
  //     category:'Accessories',
  //     price:'300',
  //     aprice:'250',
  //     dp:''
  //   },
  //   {
  //     name:'A7 Plus',
  //     category:'Accessories',
  //     price:'300',
  //     aprice:'250',
  //     dp:''
  //   },
  //   {
  //     name:'A7 Plus',
  //     category:'Accessories',
  //     price:'300',
  //     aprice:'250',
  //     dp:''
  //   },
  //   {
  //     name:'A7 Plus',
  //     category:'Accessories',
  //     price:'300',
  //     aprice:'250',
  //     dp:''
  //   }
  // ]

  $scope.dealProducts = []
  $http({
    method: 'GET',
    url: '/api/ecommerce/listingLite/?weekly=true'
  }).
  then(function(response) {
    $scope.dealProducts = response.data;
  })

  $scope.trendProducts = []
  $http({
    method: 'GET',
    url: '/api/ecommerce/listingLite/?trends=true'
  }).
  then(function(response) {
    $scope.trendProducts = response.data;
  })

  $rootScope.inCart = []
  $scope.settings = {};
  $http({
    method: 'GET',
    url: '/api/ERP/appSettings/?app=25'
  }).
  then(function(response) {
    for (var i = 0; i < response.data.length; i++) {
      $scope.settings[response.data[i].name] = response.data[i].value;
    }
  })

  $scope.data.pickUpTime = null;
  $scope.data.dropInTime = null;
  $scope.prodData = []
  $scope.stock = []
  if ($scope.me != null) {
    $http({
      method: 'GET',
      url: '/api/ecommerce/cart/?user=' + $scope.me.pk
    }).
    then(function(response) {


      for (var i = 0; i < response.data.length; i++) {
        if (response.data[i].typ == 'cart') {

          $scope.product_var = undefined

          var prod_variants = response.data[i].product.product_variants

          for (var j = 0; j < prod_variants.length; j++) {
            if (prod_variants[j].sku == response.data[i].prodSku) {
              response.data[i].prod_var = prod_variants[j]
            }
          }
          if ($rootScope.pin != undefined) {
            $scope.store = $rootScope.pin.pk
          }
          if (response.data[i].prod_var != undefined) {
            $scope.product_var = response.data[i].prod_var.id
          }

          $rootScope.inCart.push(response.data[i])
        }
        if (response.data[i].typ == 'favourite') {
          $rootScope.inFavourite.push(response.data[i])
        }
      }

    })

  }





  if ($scope.me != null) {
    $http({
      method: 'GET',
      url: '/api/ecommerce/order/?user=' + $scope.me.pk
    }).
    then(function(response) {
      $rootScope.inInvoice = response.data
    })
  }


  if ($scope.me) {
    if ($rootScope.addToCart.length > 0) {
      if ($rootScope.inCart.length > 0) {
        for (var i = 0; i < $rootScope.addToCart.length; i++) {
          for (var j = 0; j < $rootScope.inCart.length; j++) {
            if ($rootScope.addToCart[i].prodSku == $rootScope.inCart[j].prodSku) {
              if ($rootScope.inCart[j].typ == 'cart') {
                $http({
                  method: 'PATCH',
                  url: '/api/ecommerce/cart/' + $rootScope.inCart[j].pk + '/',
                  data: {
                    qty: $rootScope.addToCart[i].qty
                  }
                }).
                then(function(response) {})
                $rootScope.inCart[i].qty = $rootScope.addToCart[i].qty

              }

            }
          }

          for (var j = 0; j < $rootScope.inFavourite.length; j++) {
            if ($rootScope.addToCart[i].prodSku == $rootScope.inFavourite[j].prodSku) {
              if ($rootScope.inFavourite[j].typ == 'favourite') {
                $http({
                  method: 'PATCH',
                  url: '/api/ecommerce/cart/' + $rootScope.inFavourite[j].pk + '/',
                  data: {
                    typ: 'cart',
                    qty: $rootScope.addToCart[i].qty
                  }
                }).
                then(function(response) {
                  $rootScope.inCart.push(response.data)
                  $rootScope.inFavourite.splice(i, 1)
                })

              }
            }
          }
          $http({
            method: 'POST',
            url: '/api/ecommerce/cart/',
            data: {
              typ: 'cart',
              qty: $rootScope.addToCart[i].qty,
              product: $rootScope.addToCart[i].prodPk,
              user: getPK($scope.me.url),
              prodSku: $rootScope.addToCart[i].prodSku,
              desc: $rootScope.addToCart[i].desc
            }
          }).
          then(function(response) {
            if (response.data.length > 0) {
              for (var i = 0; i < response.data.length; i++) {
                $rootScope.inCart.push(response.data[0])
              }
            }

          })
        }
      } else {
        for (var i = 0; i < $rootScope.addToCart.length; i++) {
          $http({
            method: 'POST',
            url: '/api/ecommerce/cart/',
            data: {
              typ: 'cart',
              qty: $rootScope.addToCart[i].qty,
              product: $rootScope.addToCart[i].prodPk,
              user: getPK($scope.me.url),
              prodSku: $rootScope.addToCart[i].prodSku
            }
          }).
          then(function(response) {
            if (response.data.length > 0) {
              for (var i = 0; i < response.data.length; i++) {
                $rootScope.inCart.push(response.data[0])
              }
            }

          })
        }

      }

      function setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
      }


      detail = getCookie("addToCart");
      if (detail != "") {
        setCookie("addToCart", "", -1);
        // document.cookie = encodeURIComponent("addToCart") + "=deleted; expires=" + new Date(0).toUTCString()
      }
      window.location = '/checkout/cart';
      $scope.cart = $rootScope.inCart;
      $rootScope.addToCart = []
    }



  }


  $scope.headerUrl = '/static/ngTemplates/app.ecommerce.header.html';
  $scope.footerUrl = '/static/ngTemplates/app.ecommerce.footer.html';


  $scope.$watch('data.location', function(newValue, oldValue) {
    if (newValue != null && typeof newValue == 'object') {
      $http({
        method: 'GET',
        url: '/api/ecommerce/locationDetails/?id=' + newValue.place_id
      }).
      then(function(response) {
        $scope.params.location = response.data.result;

      })
    }
  }, true);

  $scope.getLocationSuggeations = function(query) {
    return $http.get('/api/ecommerce/suggestLocations/?query=' + query).
    then(function(response) {
      return response.data.predictions;
    })
  }

  $scope.refreshResults = function() {
    $state.go('ecommerce', {}, {
      reload: true
    })

  }
  $scope.scrollposition = 0

  // document.getElementById('hidemeindetailpage').style.display = "none";
  // var jank= $rootScope.$state
  // console.log(  $rootScope.$state,"@@@@@@@@@@@@@@@@@@@@@@@");
  console.log($rootScope.mycustomstate, "^^^^^^^^^^^^^^^^^^^^^");
  $scope.showcat = function() {
    if ($scope.scrollposition < 165) {

      if (document.getElementById("catpositionfetch").style.display == "block") {
        document.getElementById("catpositionfetch").style.display = "none";
      } else {
        document.getElementById("catpositionfetch").style.display = "block";
      }
    } else {
      document.getElementById("catpositionfetch").style.display = "block";
    }
  }





});
app.controller('controller.ecommerce.pincodeEnquiry.modal', function($scope, $rootScope, $state, $http, $users, $interval, $uibModal, $uibModalInstance, Flash) {
  $scope.close = function() {
    $uibModalInstance.close();
  }
  $scope.form = {
    pincode: ''
  }

  function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {

        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }

  function createCookieDetail(pincode) {
    detail = getCookie("userPincode");
    if (detail != "") {
      document.cookie = encodeURIComponent("userPincode") + "=deleted; expires=" + new Date(0).toUTCString()
    }
    setCookie("userPincode", pincode, 365);
  }

  $scope.checkPincode = function() {
    if ($scope.form.pincode.toString().length != 6) {
      Flash.create('danger', "Please enter a correct Pincode");
      return
    }


    $scope.showSpinner = false

    $http.get('/api/POS/store/?pincode=' + $scope.form.pincode).
    then(function(response) {
      $scope.stores = response.data
      if (response.data.length > 0) {
        $rootScope.pin = response.data[0].pincode
        createCookieDetail(response.data[0].pincode)
        $scope.showSpinner = true
        $rootScope.$broadcast('filterForStore', {
          pin: response.data[0].pincode
        });
        $rootScope.$broadcast('filterForCategoryStore', {
          pin: response.data[0].pincode
        });
        setTimeout(function() {
          $scope.showSpinner = false
          $uibModalInstance.close();
        }, 2000);
      } else {
        $scope.form.pincode = ''
      }
    })
  }
});

app.controller('controller.ecommerce.FAQ.modal', function($scope, $rootScope, $state, $http, $timeout, $uibModal, $users, Flash, $uibModalInstance, $sce) {
  $scope.me = $users.get('mySelf')

  $scope.close = function() {
    $uibModalInstance.close();
  }


  $http({
    method: 'GET',
    url: '/api/ecommerce/frequentlyQuestions/'
  }).
  then(function(response) {
    $scope.fAQ = response.data
    for (var i = 0; i < $scope.fAQ.length; i++) {
      $scope.fAQ[i].ans = $sce.trustAsHtml($scope.fAQ[i].ans)
    }
  })
  $scope.ind = -1
  $scope.collapsed = function(indx) {
    $scope.ind = indx
  }

  $scope.message = {
    email: '',
    mobile: '',
    invoiceNo: '',
    subject: '',
    body: ''
  };
  $scope.sendMessage = function() {
    if ($scope.me == null || $scope.me == undefined) {
      if ($scope.message.invoiceNo == '' || $scope.message.body == '' || $scope.message.mobile == '' || $scope.message.email == '') {
        Flash.create("warning", "Please Add Email and Mobile")
      } else {
        var dataToSend = {
          email: $scope.message.email,
          mobile: $scope.message.mobile,
          invoiceNo: $scope.message.invoiceNo,
          subject: $scope.message.subject,
          message: $scope.message.body
        }
      }
    } else {
      if ($scope.message.invoiceNo == '' || $scope.message.body == '' || $scope.message.email == '') {
        Flash.create("warning", "Please Add Email and Mobile")
      } else {
        var dataToSend = {
          email: $scope.message.email,
          mobile: $scope.me.profile.mobile,
          invoiceNo: $scope.message.invoiceNo,
          subject: $scope.message.subject,
          message: $scope.message.body
        }
      }

    }

    $http({
      method: 'POST',
      url: '/api/ecommerce/supportFeed/',
      data: dataToSend
    }).
    then(function(response) {
      $scope.message = {
        email: '',
        mobile: '',
        invoiceNo: '',
        subject: '',
        body: ''
      };
      Flash.create('success', response.status + ' : ' + response.statusText);
    }, function(response) {
      Flash.create('danger', response.status + ' : ' + response.statusText);
    })
  }


});
app.controller('controller.ecommerce.feedBack.modal', function($scope, $rootScope, $state, $http, $users, $interval, $uibModal, $uibModalInstance, Flash) {
  $scope.me = $users.get('mySelf')
  $scope.close = function() {
    $uibModalInstance.close();
  }

  $scope.feedback = {
    email: '',
    subject: '',
    mobile: null,
    message: ''
  };
  $scope.sendFeedback = function() {
    if ($scope.me == null || $scope.me == undefined) {
      if ($scope.feedback.email == '' || $scope.feedback.mobile == 5 || $scope.feedback.message == '') {
        Flash.create("warning", "Please Add Email and Mobile")
      } else {
        var toSend = {
          email: $scope.feedback.email,
          mobile: $scope.feedback.mobile,
          subject: $scope.feedback.subject,
          message: $scope.feedback.message,
        }
      }
    } else {
      if ($scope.feedback.email == '' || $scope.feedback.message == '') {
        Flash.create("warning", "Please Add Email and Mobile")
      } else {
        var toSend = {
          email: $scope.feedback.email,
          mobile: $scope.me.profile.mobile,
          subject: $scope.feedback.subject,
          message: $scope.feedback.message,
        }
      }

    }
    $http({
      method: 'POST',
      url: '/api/ecommerce/supportFeed/',
      data: toSend
    }).
    then(function(response) {
      Flash.create('success', 'Thank you!');
      $scope.feedback = {
        email: '',
        subject: '',
        mobile: null,
        message: ''
      };
    }, function(response) {
      Flash.create('danger', response.status + ' : ' + response.statusText);
    });
  }
});

app.controller('controller.ecommerce.contact.modal', function($scope, $rootScope, $state, $http, $users, $interval, $uibModal, $uibModalInstance, Flash) {

  $scope.close = function() {
    $uibModalInstance.close();
  }


  $scope.sendFeedback = function() {

    if ($scope.feedback.email == '') {
      Flash.create('danger', 'Please provide details')
    } else {
      var toSend = {
        email: $scope.feedback.email,
        mobile: $scope.feedback.mobile,
        message: $scope.feedback.message,
      }
    }

    $http({
      method: 'POST',
      url: '/api/ecommerce/supportFeed/',
      data: toSend
    }).
    then(function(response) {
      Flash.create('success', 'Thank you!');
      $scope.feedback = {
        email: '',
        mobile: null,
        message: ''
      };
    }, function(response) {
      Flash.create('danger', response.status + ' : ' + response.statusText);
    });
  }
});

app.controller('controller.ecommerce.list', function($scope, $rootScope, $state, $http, Flash, $users, $interval, $filter, $timeout) {
  if ($users.get('mySelf') != null) {
    $http({
      method: 'GET',
      url: '/api/POS/store/?owner=' + $users.get('mySelf').pk + '/',
    }).
    then(function(response) {

      for (var i = 0; i < response.data.length; i++) {
        if (response.data[i].owner != null && response.data[i].owner.pk == $users.get('mySelf').pk) {
          $scope.form = response.data[i]

          console.log($scope.form, 'main index');

        }
        if ($users.get('mySelf').is_staff == true) {
          // window.location.href="/setupStore/"
        }

      }

    })

  }
  console.log($users.get('mySelf').pk, $scope.form, ';kajsfhjksdjfgds');

  var curday;
  var secTime;
  var ticker;

  function getSeconds() {
    var nowDate = new Date();
    var dy = 6; //Sunday through Saturday, 0 to 6
    var countertime = new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate(), 00, 0, 0); //20 out of 24 hours = 8pm

    var curtime = nowDate.getTime(); //current time
    var atime = countertime.getTime(); //countdown time
    var diff = parseInt((atime - curtime) / 1000);
    if (diff > 0) {
      curday = dy - nowDate.getDay()
    } else {
      curday = dy - nowDate.getDay() - 1
    } //after countdown time
    if (curday < 0) {
      curday += 7;
    } //already after countdown time, switch to next week
    if (diff <= 0) {
      diff += (86400 * 7)
    }
    startTimer(diff);
  }

  function tick() {
    var secs = secTime;
    if (secs > 0) {
      secTime--;
    } else {
      clearInterval(ticker);
      getSeconds(); //start over
    }

    var days = Math.floor(secs / 86400);
    secs %= 86400;
    var hours = Math.floor(secs / 3600);
    secs %= 3600;
    var mins = Math.floor(secs / 60);
    secs %= 60;

    //update the time display
    $scope.days = curday;
    $scope.hours = ((hours < 10) ? "0" : "") + hours;
    $scope.mins = ((mins < 10) ? "0" : "") + mins;
    $scope.secs = ((secs < 10) ? "0" : "") + secs;
  }

  function startTimer(secs) {
    secTime = parseInt(secs);
    // ticker = setInterval(tick(),1000);
    tick(); //initial count display
  }




  $interval(getSeconds, 1000);
  $(document).ready(function() {
    getSeconds();
  });




  $scope.subs_email = "";
  $scope.is_subscribed = false;
  $scope.sendsubscription = function() {
    dataToSend = {
      email: $scope.subs_email,
    }
    $http({
      method: 'POST',
      url: '/api/ecommerce/subscribe/',
      data: dataToSend
    }).
    then(function(response) {
      $scope.is_subscribed = true;
    })

  }

  console.log('lilililililili');
  $rootScope.preloader = true

  document.title = 'Buy Products Online At Best Price In India | ' + BRAND_TITLE
  document.querySelector('meta[name="description"]').setAttribute("content", BRAND_TITLE + ' Online Shopping')

  $scope.me = $users.get('mySelf');

  $scope.secondBanner = false

  $scope.listProdLimit = 24;
  $scope.listProdOffset = 0;

  $scope.categoryScroll = false

  $scope.categoryScroll = settings_categoryScroll
  $scope.isCategory = settings_isCategory

  $scope.secondBanner = settings_secondBanner

  $scope.inCart = $rootScope.inCart;



  $timeout(function() {
    if ($rootScope.multiStore) {
      $rootScope.$broadcast('filterForStore', {
        pin: $rootScope.pin
      });
      $rootScope.$broadcast('filterForCategoryStore', {
        pin: $rootScope.pin
      });
    } else {
      $http({
        method: 'GET',
        url: '/api/ecommerce/listingLite/?popularCount=true&limit=' + $scope.listProdLimit
      }).
      then(function(response) {
        $scope.listingProductsData1 = response.data.results.slice(0, 12);
        $scope.listingProductsData2 = response.data.results.slice(12, 24);

      })

      $http({
        method: 'GET',
        url: '/api/ecommerce/listingLite/?popular=true'
      }).
      then(function(response) {
        $scope.popularProducts = response.data;
      })

      $http({
        method: 'GET',
        url: '/api/ecommerce/fetchallproducts/'
      }).
      then(function(response) {
        $scope.allProducts = response.data;
        $scope.firstView = $scope.allProducts[0]
        $scope.secondView = $scope.allProducts[1]
        $scope.thirdView = $scope.allProducts[2]
        $scope.tabData = $scope.firstView.cat[0].name
        $scope.secondtabData = $scope.secondView.cat[0].name
        $scope.thirdtabData = $scope.thirdView.cat[0].name



      })

      $http({
        method: 'GET',
        url: '/api/ecommerce/genericProduct/?parent=None'
      }).
      then(function(response) {
        $scope.genericProducts = response.data;
        $timeout(function() {
          $rootScope.preloader = false
        }, 100);

      })
    }

  }, 1000);

  $scope.categoryProperties = {
    lazyLoad: true,
    items: 5,
    loop: true,
    autoplay: true,
    autoplayTimeout: 3000,
    dots: false,
    responsive: {
      0: {
        items: 1
      },
      600: {
        items: 1
      },
      1000: {
        items: 1
      }
    },
  };

  $scope.popularProperties = {
    lazyLoad: true,
    items: 4,
    loop: false,
    autoplay: false,
    autoplayTimeout: 5000,
    dots: false,
    margin: 10,
    navSpeed: 300,
    navText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"],
    nav: true,
    responsive: {
      0: {
        items: 1
      },
      600: {
        items: 1
      },
      1000: {
        items: 1
      }
    },
  };


  $scope.popularmobileProperties = {
    lazyLoad: true,
    loop: false,
    autoplay: false,
    autoplayTimeout: 5000,
    dots: true,
    margin: 10,
    navSpeed: 300,
    navText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"],
    nav: true,
    responsive: {
      0: {
        items: 1
      },
      600: {
        items: 1
      },
      1000: {
        items: 1
      }
    },
  };

  $scope.showMore = function() {
    $scope.listProdLimit = 12
    $scope.listProdOffset = $scope.listProdOffset + 24;
    if ($rootScope.multiStore) {
      $rootScope.$broadcast('filterForStore', {
        pin: $rootScope.pin
      });
      $rootScope.$broadcast('filterForCategoryStore', {
        pin: $rootScope.pin
      });
    } else {
      $http({
        method: 'GET',
        url: '/api/ecommerce/listingLite/?limit=' + $scope.listProdLimit + '&offset=' + $scope.listProdOffset
      }).
      then(function(response) {
        $scope.listingProductsData2 = $scope.listingProductsData2.concat(response.data.results)
      });
    }
  }

  $scope.recentlyViewed = [];

  if ($scope.me != null) {
    if ($rootScope.multiStore) {
      rurl = '/api/ecommerce/activities/?user=' + $scope.me.pk + '&typ=productView&limit=8' + '&pin=' + $rootScope.pin + '&multipleStore'
    } else {
      rurl = '/api/ecommerce/activities/?user=' + $scope.me.pk + '&typ=productView&limit=8'
    }
    $http({
      method: 'GET',
      url: rurl
    }).
    then(function(response) {
      console.log(response.data.results, 'lllllllllllllll');
      for (var i = 0; i < response.data.results.length; i++) {
        $scope.recentlyViewed.push(response.data.results[i].product)
      }

    })
  }

  $scope.openDetails = function(id, name, sku) {
    $state.go('details', {
      id: id,
      name: name,
      sku: sku
    })
  }

  $http({
    method: 'GET',
    url: '/api/ecommerce/suggestedItem/'
  }).
  then(function(response) {
    $scope.suggestedProducts = response.data.results

  })


  $scope.subSlide = {
    banners: [],
    active: 0
  };
  $scope.subSlideMobile = {
    banners: [],
    active: 0
  };

  $http({
    method: 'GET',
    url: '/api/ecommerce/offerBanner/?level=2'
  }).
  then(function(response) {
    $scope.subSlide.banners = response.data;
    if ($scope.subSlide.banners.length > 5) {
      $scope.subSlide.banners = $scope.slide.banners.slice(0, 5)
    }
    // if ($scope.subSlide.banners.length > 1) {
    //   $scope.subSlide.lastbanner = $scope.subSlide.banners.length - 1
    //   $scope.subSlide.img = $scope.subSlide.banners[0].image
    //   $scope.subSlide.title = $scope.subSlide.banners[0].title
    // } else {
    //   $scope.subSlide.lastbanner = 0
    // }



    // $scope.subSlideMobile.banners = response.data;
    // if ($scope.subSlideMobile.banners.length > 3) {
    //   $scope.subSlideMobile.banners = response.data.slice(0, 3);
    // }
    // if ($scope.subSlideMobile.banners.length > 1) {
    //   $scope.subSlideMobile.lastbanner = $scope.subSlideMobile.banners.length - 1
    //   $scope.subSlideMobile.img = $scope.subSlideMobile.banners[0].imagePortrait
    //   $scope.subSlideMobile.title = $scope.subSlideMobile.banners[0].title
    //
    // } else {
    //   $scope.subSlideMobile.lastbanner = 0
    // }

  })

  // $interval(function() {
  //   if ($scope.subSlide.active == undefined) {
  //     $scope.subSlide.active = 0
  //   }
  //   if ($scope.subSlide.active == $scope.subSlide.lastbanner) {
  //     $scope.subSlide.active = 0;
  //   } else {
  //     $scope.subSlide.active += 1;
  //   }
  //   if ($scope.subSlideMobile.banners[$scope.subSlideMobile.active] != undefined) {
  //     $scope.subSlide.img = $scope.subSlide.banners[$scope.subSlide.active].image
  //     $scope.subSlide.title = $scope.subSlide.banners[$scope.subSlide.active].title
  //   }
  // }, 3000);

  $scope.showFirstTab = function(indx) {
    $scope.tabData = indx
  }
  $scope.showSecondTab = function(indx) {
    $scope.secondtabData = indx
  }
  $scope.showThirdTab = function(indx) {
    $scope.thirdtabData = indx
  }

  $scope.addToCart = function(inputPk) {
    dataToSend = {
      product: inputPk,
      user: getPK($scope.me.url),
      qty: 1,
      typ: 'cart',
    }


    for (var i = 0; i < $rootScope.inCart.length; i++) {
      if ($rootScope.inCart[i].product.pk == dataToSend.product) {
        if ($rootScope.inCart[i].typ == 'cart') {
          Flash.create('warning', 'This Product is already in cart');
          return
        } else {
          $http({
            method: 'PATCH',
            url: '/api/ecommerce/cart/' + $rootScope.inCart[i].pk + '/',
            data: {
              typ: 'cart'
            }
          }).
          then(function(response) {
            Flash.create('success', 'Product added to cart');
          })
          $rootScope.inCart[i].typ = 'cart'
          return
        }

      }
    }
    $http({
      method: 'POST',
      url: '/api/ecommerce/cart/',
      data: dataToSend
    }).
    then(function(response) {
      Flash.create('success', 'Product added in cart');
      $rootScope.inCart.push(response.data);
    })
  }

  $scope.$on('filterForStore', function(event, input) {
    $http({
      method: 'GET',
      url: '/api/ecommerce/listingLite/?pin=' + input.pin + '&multipleStore&limit=24'
    }).
    then(function(response) {
      $scope.listingProductsData1 = response.data.results.slice(0, 12);
      $scope.listingProductsData2 = response.data.results.slice(12, 24);

      if ($rootScope.addToCart.length > 0) {
        for (var i = 0; i < $rootScope.addToCart.length; i++) {
          for (var j = 0; j < $scope.listingProductsData1.length; j++) {
            if ($scope.listingProductsData1[j].pk == $rootScope.addToCart[i].product.pk) {
              $scope.listingProductsData1[j].added_cart = $rootScope.addToCart[i].qty
            }
          }
          for (var j = 0; j < $scope.listingProductsData2.length; j++) {
            if ($scope.listingProductsData2[j].pk == $rootScope.addToCart[i].product.pk) {
              $scope.listingProductsData2[j].added_cart = $rootScope.addToCart[i].qty
            }
          }
        }
      }

    })
  });

  $scope.$on('filterForCategoryStore', function(event, input) {
    $http({
      method: 'GET',
      url: '/api/ecommerce/genericProduct/?pin=' + input.pin + '&multipleStore'
    }).
    then(function(response) {
      $scope.genericProducts = response.data;


      $interval(function() {
        if ($scope.maxCategories == true && $scope.genericProducts.length > 5) {
          $scope.tmpCategory = $scope.genericProducts.slice(0, 1)
          $scope.genericProducts.splice(0, 1)
          $scope.genericProducts.push($scope.tmpCategory[0])
        }
      }, 3000)

    })
  });

});

app.controller("controller.ecommerce.setupstore", function($scope, $http, Flash, $uibModal, $rootScope, $state, $users) {
  console.log($users.get('mySelf').pk, ';asjfkasjdfk');
  $http({
    method: 'GET',
    url: '/api/POS/store/?owner=' + $users.get('mySelf').pk + '/',
  }).
  then(function(response) {

    for (var i = 0; i < response.data.length; i++) {
      if (response.data[i].owner != null && response.data[i].owner.pk == $users.get('mySelf').pk) {
        $scope.form = response.data[i]
        if ($scope.form) {
          document.getElementById('savebtn').innerHTML = 'Save'

        } else {
          document.getElementById('savebtn').innerHTML = 'Submit'
        }
        console.log($scope.form, 'aksdflajsld');

      }

    }

  })

  $scope.msg = ''
  $scope.resetForm = function() {
    $scope.form = {
      name: '',
      mobile: '',
      email: '',
      address: '',
      pincode: '',
      gstin: '',
      cin: '',
      gstincert: emptyFile,
      personelid: emptyFile,
      // owner:'',
    }

  }
  $scope.genericUserSearch = function(query) {
    return $http.get('/api/HR/users/?username__contains=' + query).
    then(function(response) {
      $scope.newpk = response.data
      return response.data;
    })
  };

  if ($scope.tab != undefined) {
    $scope.mode = 'edit';
    console.log('aaaaaaaaaaaa', $scope.tab.data);
    $scope.form = $scope.tab.data;
  } else {
    $scope.mode = 'new';
    $scope.resetForm()
  }

  $scope.save = function() {
    var me = $users.get('mySelf').pk;
    console.log(me, 'sjdfshdfjkshfkjashfsaj');
    var f = $scope.form;

    if (f.name == null || f.name.length == 0) {
      $scope.msg = 'Please Add Store Name'
      return
    }
    if (f.mobile == null || f.mobile.length == 0) {
      $scope.msg = 'Please Add Mobile Number'
      return
    }
    if (f.email == null || f.email.length == 0) {
      $scope.msg = 'Please Add Email'
      return
    }
    if (f.address == null || f.address.length == 0) {
      $scope.msg = 'Please Add Address'
      return
    }
    if (f.pincode == null || f.pincode.length == 0) {
      $scope.msg = 'Please Add Pincode'
      return
    }
    if (f.gstin == null || f.gstin.length == 0) {
      $scope.msg = 'Please Add GSTIN'
      return
    }
    if (f.cin == null || f.cin.length == 0) {
      $scope.msg = 'Please Add CIN'
      return
    }
    if (f.gstincert == emptyFile || f.gstincert == '' || f.gstincert == null) {
      $scope.msg = 'Please Add GSTIN Certificate'
      return
    }
    if (f.personelid == emptyFile || f.personelid == '' || f.personelid == null) {
      $scope.msg = 'Please Add Personel Id'
      return
    }
    // if (f.owner == null || f.owner.length==0) {
    //   Flash.create('warning','Please Add Owner')
    //   return
    // }
    console.log(f);
    var fd = new FormData();
    fd.append('name', f.name);
    fd.append('mobile', f.mobile);
    fd.append('email', f.email);
    fd.append('address', f.address);
    fd.append('pincode', f.pincode);
    fd.append('gstin', f.gstin);
    fd.append('cin', f.cin);
    if (f.gstincert != emptyFile && typeof f.gstincert != 'string') {
      fd.append('gstincert', f.gstincert);
    }
    if (f.personelid != emptyFile && typeof f.personelid != 'string') {
      fd.append('personelid', f.personelid);
    }
    fd.append('owner', me);

    var url = '/api/POS/store/';
    if (f.pk) {
      var method = 'PATCH';
      url += f.pk + '/'
    } else {
      var method = 'POST';

    }


    $http({
      method: method,
      url: url,
      data: fd,
      headers: {
        'Content-Type': undefined
      }
    }).
    then(function(response) {
      Flash.create('success', 'Saved')
      window.location.href = "/ERP/#/businessManagement/manageUsers"
      // $scope.form = response.data
      if ($scope.mode == 'new') {
        $scope.resetForm()
      }
    }, function(err) {
      Flash.create('danger', 'Some Internal Error')
    })
  }

})
