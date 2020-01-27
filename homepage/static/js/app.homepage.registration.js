
app.controller('registration' , function($scope , $state , $http , $timeout , $interval){
  console.log("registration loded");
  $scope.mode = 'main';
  $scope.autoActiveReg = autoActiveReg
  $scope.showActiveMsg = false
  $scope.isStoreGlobal = isStoreGlobal

  $scope.getCountryList = function () {
     $http({method : 'GET' , url : '/api/ecommerce/country/'}).
      then(function(response) {
        $scope.countryList = response.data
        $scope.selected = $scope.countryList[0]

        console.log($scope.countryList);
      })
  }

  if (isStoreGlobal=='False') {
    $scope.isStoreGlobal = false
    $scope.countryList = []
  }else {
    $scope.isStoreGlobal = true
    $scope.getCountryList()
  }


  $scope.validity = {firstName : null , lastName : null, email : null ,mobile : null,password : null , rePassword: null };

  $scope.form = {firstName :null ,lastName : null , email : null ,mobile : null , password : null, rePassword : null , emailOTP : null , mobileOTP: null , token: null , reg : null , agree : false, phoneCode:''};
  $scope.validityChecked = false;
  $scope.validityChecked2 = false;
  $scope.verifyingOTP = false
  $scope.usernameExist = false;

  $scope.getOTP = function() {

    console.log(selected_dial_code);

    function replaceAll(str , search) {
      if (search =='+') {
        str = str.replace(/\+/g, '');
      }
      if (search =='-') {
        str = str.replace(/\-/g, '');
      }
      if (search =='(') {
        str = str.replace(/\(/g, '');
      }
      if (search ==')') {
        str = str.replace(/\)/g, '');
      }
      if (search ==' ') {
        str = str.replace(/ /g, '');
      }
      return str
    }

    if ($scope.isStoreGlobal) {
      $scope.phNumberStr = $('#phNumber').val()
      $scope.phNumberStr = replaceAll($scope.phNumberStr, ' ')
      $scope.phNumberStr = replaceAll($scope.phNumberStr, '-')
      $scope.phNumberStr = replaceAll($scope.phNumberStr, '+')
      $scope.phNumberStr = replaceAll($scope.phNumberStr, '(')
      $scope.phNumberStr = replaceAll($scope.phNumberStr, ')')

      for (var i = 0; i < selected_dial_code.length; i++) {
        if (selected_dial_code.charAt(i) == $scope.phNumberStr.charAt(i)) {
          $scope.appendDialCode = false;
        }  else {
          $scope.appendDialCode = true;
          break;
        }
      }
    }

    $scope.validityChecked = true;
    console.log($scope.form);

    if (!$scope.form.agree || $scope.form.firstName == undefined || $scope.form.firstName == null || $scope.form.firstName.length ==0 || $scope.form.lastName == undefined || $scope.form.lastName == null || $scope.form.lastName.length ==0 || $scope.form.email == undefined || $scope.form.email == null || $scope.form.email.length ==0 || $scope.form.password == undefined || $scope.form.password == null || $scope.form.password.length <3 || $scope.form.email.indexOf('@') == -1) {
      console.log("form not valid , returning");
      return;
    }

    if (isStoreGlobal != 'True' && ($scope.form.GST == undefined || $scope.form.GST.length==0 || $scope.form.pincode== undefined || $scope.form.pincode.length==0 ||$scope.form.statecode == undefined || $scope.form.statecode== 'Please select your State code' ||  $scope.form.designation == undefined || $scope.form.designation == 'Please select your role')) {
      console.log("form not valid , returning2222");
      return;
    }

    if ($scope.isStoreGlobal) {
      if ($scope.appendDialCode) {
          var mobileNumber = selected_dial_code + $scope.phNumberStr
      }else {
          var mobileNumber = $scope.phNumberStr
      }

      if ($scope.phNumberStr == undefined || $scope.phNumberStr.length==0 || $scope.phNumberStr ==null) {
        return;
      }
    }else {
      var mobileNumber = $scope.form.mobile
      if ($scope.form.mobile == undefined || $scope.form.mobile.length==0 || $scope.form.mobile ==null) {
        return;
      }
    }



    var toSend= {
      mobile : mobileNumber,
      email : $scope.form.email,
    }
    console.log(toSend);
    // if ($scope.isStoreGlobal) {
    //   toSend.mobileWithCode = $scope.form.mobile
    // }
    console.log(toSend);
    $scope.mode = 'sendingOTP';
    $http({method : 'POST' , url : '/api/homepage/registration/' , data : toSend}).
    then(function(response) {
      // dataTOsend = {
      //     details : JSON.stringify($scope.extraDetails)
      // }
      // $http({
      //   method: 'PATCH',
      //   url: '/api/HR/profile/?user=' + response.data.pk + '/',
      //   data: dataTOsend,
      // }).
      // then(function(response) {
      //   console.log(response.data);
      // })
      if (($scope.form.password != null && $scope.form.password.length <3) || $scope.form.password == null ) {
        return;
      }


      $scope.form.token = response.data.token;
      $scope.form.reg = response.data.pk;
      $scope.mode = 'verify';
      $scope.usernameExist = false
    }).catch(function (err) {
      // $scope.mode = 'sendingOTP';
      $scope.mode = 'main';
      if (err.data.PARAMS == 'Username already taken') {
        $scope.usernameExist = true
      }
      console.log();
    })


  }

  $scope.setSelected = function (c) {
    $scope.selected = c
  }

  $scope.verify = function() {
    $scope.verifyingOTP = true
    if ($scope.validityChecked2) {
      $scope.validityChecked2 = false
    }
    console.log($scope.form,'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
    $http({method : 'PATCH' , url : '/api/homepage/registration/' + $scope.form.reg + '/', data : $scope.form }).
    then(function(response) {
      $scope.verifyingOTP = false;
      $scope.validityChecked2 = false;
      if ($scope.autoActiveReg=='True') {
        $scope.showActiveMsg = false
        window.location.href = "/";

      }else{
        $scope.showActiveMsg = true

      }
    }, function(err) {
      console.log(err);
      $scope.verifyingOTP = false;
      if (err.status == 400) {
        $scope.validityChecked2 = true;
      }
    })
  }

  $scope.sendOtp = function(requestType) {
    console.log(requestType,'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
    var dataToSend={
      otpType : requestType,
      id : $scope.form.reg
    }
    $http({method : 'POST' , url : '/api/homepage/resendOtp/' , data : dataToSend }).
    then(function(response) {
    }, function(err) {
      console.log(err);
      if (err.status == 400) {
        // $scope.validityChecked2 = true;
      }
    })

  }

  $scope.loading = true;
  $scope.$watch('form' , function(newValue , oldValue) {

    if ($scope.loading) {
      $scope.loading = false;
      return;
    }
    // console.log(newValue);
    if (newValue.firstName != null && newValue.firstName.length > 0) {
      $scope.validity.firstName = true;
      $scope.form.firstName = toTitleCase(newValue.firstName);
    }
    if (newValue.firstName == undefined) {
      $scope.validity.firstName = false;
    }

    if (newValue.lastName != null && newValue.lastName.length > 0) {
      $scope.validity.lastName = true;
      $scope.form.lastName = toTitleCase(newValue.lastName);
    }
    if (newValue.lastName == undefined) {
      $scope.validity.lastName = false;
    }

    if ($scope.usernameExist) {
      if (newValue.email.length != oldValue.email.length) {
        $scope.usernameExist = false
      }
    }

  }, true)

  $scope.continue = function () {
    window.location.href = "/";
  }

});
