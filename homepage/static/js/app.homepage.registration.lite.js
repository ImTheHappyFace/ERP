app.controller('registrationLite', function($scope, $state, $http, $timeout, $interval) {
  console.log("kkkkkkkkkkkkkkk", );
  $scope.mode = 'main';
  $scope.autoActiveReg = autoActiveReg
  console.log(autoActiveReg);
  $scope.showActiveMsg = false
  $scope.signUp = true
  console.log(mobile, 'mobileeeeeeeeeeeeeeeeeeeeeeeeee');

  $scope.form = {
    mobile: null,
    mobileOTP: null,
    token: null,
    reg: null,
    agree: false,
    is_staff:false
    // firstName: ''
  };

  $scope.validityChecked = false;
  $scope.validityChecked2 = false;
  $scope.details = false
  // $scope.msg = ''
  $scope.getOTP = function() {

    console.log($scope.form);

    // if (!$scope.form.agree || $scope.form.mobile == null || $scope.form.mobile == undefined || $scope.form.mobile.length == 0) {
    //   $scope.validityChecked = true;
    //   return;
    // }

    var toSend = {
      mobile: $scope.form.mobile,
      email: $scope.form.email,
      is_staff: $scope.form.is_staff
      // firstName: $scope.form.firstName,
    }
    $scope.mode = 'sendingOTP';
    $http({
      method: 'POST',
      url: '/api/homepage/registration/',
      data: toSend
    }).
    then(function(response) {
      console.log(response.data);
      // $scope.msg = "please wait......."
      $scope.signUp = false
      $scope.form.token = response.data.token;
      $scope.form.reg = response.data.pk;
      $scope.mode = 'verify';
      $scope.usernameExist = false
    }).catch(function(err) {
      $scope.mode = 'main';
      if (err.data.PARAMS == 'Username already taken') {
        $scope.usernameExist = true
      }
    })
    // var step  = document.getElementById('step1')
    // document.getElementById('step1').style.display = 'none'



  }
  $scope.getvendorOTP = function() {
    $scope.form.is_staff =true
    // console.log($users.get('mySelf'));
    // if (!$scope.form.agree || $scope.form.mobile == null || $scope.form.mobile == undefined || $scope.form.mobile.length == 0) {
    //   $scope.validityChecked = true;
    //   return;
    // }

    var toSend = {
      mobile: $scope.form.mobile,
      email: $scope.form.email,
      is_staff:$scope.form.is_staff
      // firstName: $scope.form.firstName,
    }
    $scope.mode = 'sendingOTP';
    $http({
      method: 'POST',
      url: '/api/homepage/registration/',
      data: toSend
    }).
    then(function(response) {
      $scope.signUp = false
      $scope.form.token = response.data.token;
      $scope.form.reg = response.data.pk;
      $scope.mode = 'verify';
      $scope.usernameExist = false
    }).catch(function(err) {
      $scope.mode = 'main';
      if (err.data.PARAMS == 'Username already taken') {
        $scope.usernameExist = true
      }
    })
    // var step  = document.getElementById('step1')
    // document.getElementById('step1').style.display = 'none'



  }
  $scope.verify = function() {
    console.log($scope.form);
    $http({
      method: 'PATCH',
      url: '/api/homepage/registration/' + $scope.form.reg + '/',
      data: $scope.form
    }).
    then(function(response) {
      console.log(response);
       // window.location.assign("/ERP/")
      window.location.href = "/setupStore/";
      $scope.details = true
    }, function(err) {
      console.log(err);
      if (err.status == 400) {
        $scope.validityChecked2 = true;
      }
    })


  }
  if (mobile.length > 0) {
    console.log(mobile);
    $scope.form.mobile = mobile
    $scope.form.agree = true
    $scope.getOTP()
  }
  $scope.skip = function() {
    // if ($scope.autoActiveReg=='True') {
    //   $scope.showActiveMsg = false
    //   window.location.href = "/";
    // }else{
    //   $scope.showActiveMsg = true
    // }
    window.location.href = "/";
  }
  $scope.saveData = function() {
    console.log($scope.form.reg);
    $scope.form.details = 'details'
    $http({
      method: 'POST',
      url: '/api/homepage/updateInfo/',
      data: $scope.form
    }).
    then(function(response) {
      console.log(response);
      // if ($scope.autoActiveReg=='True') {
      //   $scope.showActiveMsg = false
      //   window.location.href = "/";
      // }else{
      //   $scope.showActiveMsg = true
      // }
      window.location.href = "/";
    }, function(err) {
      console.log(err);
      if (err.status == 400) {}
    })
  }
  $scope.continue = function() {
    window.location.href = "/";
  }
});
