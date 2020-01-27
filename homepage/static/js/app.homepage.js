var app = angular.module('app' , ['ui.router' , 'ui.bootstrap' ]);


app.config(function($stateProvider ,  $urlRouterProvider , $httpProvider , $provide ){

  // $urlRouterProvider.otherwise('/home');
  $httpProvider.defaults.xsrfCookieName = 'csrftoken';
  $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
  $httpProvider.defaults.withCredentials = true;

});

app.provider('ngIntlTelInput', function () {
    var me = this;
    var props = {};
    var setFn = function (obj) {
      if (typeof obj === 'object') {
        for (var key in obj) {
          props[key] = obj[key];
        }
      }
    };
    me.set = setFn;

    me.$get = ['$log', function ($log) {
      return Object.create(me, {
        init: {
          value: function (elm) {
            if (!window.intlTelInputUtils) {
              $log.warn('intlTelInputUtils is not defined. Formatting and validation will not work.');
            }
            elm.intlTelInput(props);
          }
        },
      });
    }];
  });

app.directive('ngIntlTelInput', ['ngIntlTelInput', '$log', function (ngIntlTelInput, $log) {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function (scope, elm, attr, ctrl) {
      // Warning for bad directive usage.
      if (attr.type !== 'text' || elm[0].tagName !== 'INPUT') {
        $log.warn('ng-intl-tel-input can only be applied to a *text* input');
        return;
      }
      // Override default country.
      if (attr.defaultCountry) {
        ngIntlTelInput.set({defaultCountry: attr.defaultCountry});
      }
      // Initialize.
      ngIntlTelInput.init(elm);
      // Validation.
      ctrl.$validators.ngIntlTelInput = function (value) {
        return elm.intlTelInput("isValidNumber");
      };
      // Set model value to valid, formatted version.
      ctrl.$parsers.push(function (value) {
        return elm.intlTelInput('getNumber').replace(/[^\d]/, '');
      });
      // Set input value to model value and trigger evaluation.
      ctrl.$formatters.push(function (value) {
        if (value) {
          value = value.charAt(0) === '+' || '+' + value;
          elm.intlTelInput('setNumber', value);
        }
        return value;
      });
    }
  };
}]);


app.directive('typedEffect', typedEffect);

typedEffect.$inject = ['$interval', '$timeout'];

function typedEffect($interval, $timeout) {
    var directive = {
        restrict: 'A',
        scope: {
            text: '<',
            callback: '&'
        },
        link: link
    };

    return directive;

    function link(scope, element, attrs) {
        var i = 0, interval,
            text = scope.text || '',
            delay = parseInt(attrs.delay) || 0,
            speed = parseInt(attrs.speed) || 100,
            cursor = attrs.cursor || '|',
            blink = attrs.blink ? attrs.blink === 'true' : true;

        cursor = angular.element('<span>' + cursor + '</span>');

        $timeout(typeText, delay);

        function typeText() {
            typeChar();
            interval = $interval(typeChar, speed);

            function typeChar() {
                if (i <= text.length) {
                    element.html(text.substring(0, i)).append(cursor);
                    i++;
                } else {
                    $interval.cancel(interval);

                    if (blink) {
                        cursor.addClass('blink');
                    } else {
                        cursor.remove();
                    }

                    if (attrs.callback) {
                        scope.callback();
                    }
                }
            }
        }
    }
}


app.controller('homepage.chat' , function($scope , $state , $http , $timeout , $interval){
  $scope.name = "Pradeep";

  $scope.minimized = true;

  $scope.started = false;

  $scope.data = {minimized : true , started : false , msgText : '',name: '',email: ''}


  $scope.messages=[{msg:"hii" , sentByMe : false }]
  $scope.msgText='';
  $scope.send = function(){
    $scope.messages.push({msg : $scope.data.msgText , sentByMe : true})
    $scope.data.msgText = '';
  }
  var validUsers= [
    {'name':'Pradeep','email':'abc@gmail.com'},
  ];
  $scope.authentication = function (){
    if ($scope.data.name.length == 0   || $scope.data.email.length ==0 ) {
      return;
    }
    $scope.data.started=true;
    $scope.data.minimized=false;
    }
    
});

app.controller('homepage.career' , function($scope , $state , $http , $timeout , $interval){

  $scope.elements = [
    {role: 'FrontEnd Developer',functionalarea:'Web Application Development',experience:'0-1 years',roledetails:'view details',notes:'The truth is that our finest moments are most likely to occur when we are feeling deeply uncomfortable, unhappy, or unfulfilled. For it is only in such moments, propelled by our discomfort, that we are likely to step out of our ruts and start searching for different ways or truer answers.'},
    {role: 'Backend Developer',functionalarea:'Web Application Development',experience:'0-1 years',roledetails:'view details',notes:'The truth is that our finest moments are most likely to occur when we are feeling deeply uncomfortable, unhappy, or unfulfilled. For it is only in such moments, propelled by our discomfort, that we are likely to step out of our ruts and start searching for different ways or truer answers.'},
    {role: 'Android Developer',functionalarea:'Web Application Development',experience:'0-1 years',roledetails:'view details',notes:'The truth is that our finest moments are most likely to occur when we are feeling deeply uncomfortable, unhappy, or unfulfilled. For it is only in such moments, propelled by our discomfort, that we are likely to step out of our ruts and start searching for different ways or truer answers.'},
    {role: 'Software Developer Intern',functionalarea:'Web Application Development',experience:'0-1 years',roledetails:'view details',notes:'The truth is that our finest moments are most likely to occur when we are feeling deeply uncomfortable, unhappy, or unfulfilled. For it is only in such moments, propelled by our discomfort, that we are likely to step out of our ruts and start searching for different ways or truer answers.'}
  ];

});
