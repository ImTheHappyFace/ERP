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
        then(function(response) {
        })
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
        then(function(response) {
        })
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



app.controller('ecommerce.mainstore', function($scope, $rootScope, $state, $http, $timeout, $uibModal, $users, $interval, Flash,$sce) {
  $scope.me = $users.get('mySelf');
  $http({method : 'GET' , url : '/api/POS/store/'+  STORE +'/'}).
  then(function(response) {
    $scope.store = response.data
    $http({method : 'GET' , url : '/api/POS/productlitesv/?store'+ $scope.store.pk +'/'}).
    then(function(res) {
      $scope.products = res.data
    })
  })






})
