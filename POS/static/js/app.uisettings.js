app.config(function($stateProvider) {

  $stateProvider
    .state('businessManagement.uisettings', {
      url: "/uisettings",
      views: {
        "": {
          templateUrl: '/static/ngTemplates/app.home.uisettings.html',
          controller: 'controller.home.uisettings',
        }
      }
    })
});

app.controller("controller.home.uisettings", function($scope, $state, $users, $stateParams, $http, Flash) {
  $scope.usergroup = []

  $scope.form = {
    company: '',
    name: '',
    address: '',
    pincode: '',
    mobile: '',
    email: '',
    gstin: '',
    cin: '',
    gstincert: emptyFile,
    personelid: emptyFile,
    logo: emptyFile,
    copyrightHolder: '',
    fbLink: '',
    twitterLink: '',
    linkedinLink: '',
    playstoreLink: '',
    appstoreLink: '',
    pinterestLink: '',
    pos: false,
    cod: false,
    rating: false,
    filter: false,
    categoryBrowser: false,
    searchfieldplaceholder: '',
    codLimit: '',
    bankaccountNumber: '',
    ifsc: '',
    bankName: '',
    bankType: '',
    moderators: '',
    moderatorslist: [],
    themeColor: '',
    payPal:false,
    paytm:false,
    payU:false,
    ccAvenue:false,
    googlePay:false,
    cartImage : emptyFile,
    paymentImage :emptyFile,
    paymentPotraitImage : emptyFile,
    searchBackgroundImg : emptyFile,
    blogBackgroundImg :emptyFile,
  }

  $http({
    method: 'GET',
    url: '/api/POS/store/' + STORE_PK + '/'
  }).then(function(response) {
    $scope.form = response.data
    $scope.form.moderatorslist = response.data.moderators;
    $scope.form.moderators = '';
  });

  $scope.$watch('form.pincode', function(newvalue, oldvalue) {
    if (newvalue.length == 6) {
      $http.get('/api/ecommerce/genericPincode/?pincode__contains=' + newvalue).
      then(function(response) {
        $scope.form.state = response.data[0].state
        $scope.form.city = response.data[0].city
        $scope.form.country = response.data[0].country
      })
    }

  }, true);

  $scope.genericUserSearch = function(query) {
    return $http.get('/api/HR/userSearch/?first_name__contains=' + query).
    then(function(response) {
      return response.data;
    })
  };
  $scope.bankList = [
    'Allahabad Bank',
    'Andhra Bank',
    'Bank of Baroda',
    'Bank of India',
    'Bank of Maharashtra',
    'Canara Bank',
    'Central Bank of India',
    'Corporation Bank',
    'Dena Bank',
    'Indian Bank',
    'Indian Overseas Bank',
    'Oriental Bank of Commerce',
    'Punjab National Bank',
    'Punjab & Sind Bank',
    'Syndicate Bank',
    'UCO Bank',
    'Union Bank of India',
    'United Bank of India',
    'Vijaya Bank',
    'IDBI Bank Ltd',
    'Bharatiya Mahila Bank',
    'State Bank of India',
    'State Bank of Bikaner',
    'State Bank of Hyderabad',
    'State Bank of Mysore',
    'State Bank of Patiala',
    'State Bank of Travancore',
  ]


  $scope.addmoderators = function() {
    if (typeof $scope.form.moderators == 'object') {
      $scope.form.moderatorslist.push($scope.form.moderators)
      $scope.form.moderators = "";
    }
  }
  $scope.deletemoderators = function(indx) {
    $scope.form.moderatorslist.splice(indx, 1)
  }


  $scope.save = function() {
    var f = $scope.form;
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (f.company == null || f.company.length == 0) {
      Flash.create('warning', 'Please Add Company Name')
      return
    }
    if (f.name == null || f.name.length == 0) {
      Flash.create('warning', 'Please Add Store Name')
      return
    }
    if (f.mobile == null || f.mobile.length == 0) {
      Flash.create('warning', 'Please Add Mobile Number')
      return
    }
    if(f.email.match(mailformat)) {
    var email = true;
    }
    else{
    var email = false;
    }

    if (f.email == null || f.email.length == 0 || !email || f.email == undefined) {
      Flash.create('warning', 'Please Add Email')
      return
    }
    if (f.address == null || f.address.length == 0) {
      Flash.create('warning', 'Please Add Address')
      return
    }

    if (f.pincode == null || f.pincode.toString().length != 6) {
      Flash.create('warning', 'Please Add Pincode')
      return
    }
    if (f.gstin == null || f.gstin.length == 0) {
      Flash.create('warning', 'Please Add GSTIN')
      return
    }
    if (f.cin == null || f.cin.length == 0) {
      Flash.create('warning', 'Please Add CIN')
      return
    }
    if (f.gstincert == emptyFile) {
      Flash.create('warning', 'Please Add GSTIN Certificate')
      return
    }
    if (f.personelid == emptyFile) {
      Flash.create('warning', 'Please Add Personel Id')
      return
    }

    var fd = new FormData();
    fd.append('company', f.company);
    fd.append('name', f.name);
    fd.append('mobile', f.mobile);
    fd.append('email', f.email);
    fd.append('address', f.address);
    fd.append('pincode', f.pincode);
    fd.append('gstin', f.gstin);
    fd.append('cin', f.cin);
    fd.append('state', f.state);
    fd.append('city', f.city);
    fd.append('country', f.country);
    fd.append('pos', f.pos);
    fd.append('cod', f.cod);
    fd.append('rating', f.rating);
    fd.append('filter', f.filter);
    fd.append('categoryBrowser', f.categoryBrowser);
    fd.append('payPal', f.payPal);
    fd.append('paytm', f.paytm);
    fd.append('payU', f.payU);
    fd.append('ccAvenue', f.ccAvenue);
    fd.append('googlePay', f.googlePay);

    if (f.moderatorslist.length > 0) {
      $scope.usergroup = []
      for (var i = 0; i < f.moderatorslist.length; i++) {
        $scope.usergroup.push(f.moderatorslist[i].pk)
        console.log($scope.usergroup, "$scope.usergroup");
      }
      fd.append('moderators', $scope.usergroup);
    }


    if (f.copyrightHolder != null && f.copyrightHolder.length > 0) {
      fd.append('copyrightHolder', f.copyrightHolder);
    }
    if (f.fbLink != null && f.fbLink.length > 0) {
      fd.append('fbLink', f.fbLink);
    }
    if (f.twitterLink != null && f.twitterLink.length > 0) {
      fd.append('twitterLink', f.twitterLink);
    }
    if (f.linkedinLink != null && f.linkedinLink.length > 0) {
      fd.append('linkedinLink', f.linkedinLink);
    }
    if (f.playstoreLink != null && f.playstoreLink.length > 0) {
      fd.append('playstoreLink', f.playstoreLink);
    }
    if (f.appstoreLink != null && f.appstoreLink.length > 0) {
      fd.append('appstoreLink', f.appstoreLink);
    }
    if (f.pinterestLink != null && f.pinterestLink.length > 0) {
      fd.append('pinterestLink', f.pinterestLink);
    }
    if (f.searchfieldplaceholder != null && f.searchfieldplaceholder.length > 0) {
      fd.append('searchfieldplaceholder', f.searchfieldplaceholder);
    }
    if (f.themeColor != null && f.themeColor.length > 0) {
      fd.append('themeColor', f.themeColor);
    }
    if (f.codLimit != null) {
      fd.append('codLimit', f.codLimit);
    }
    if (f.bankaccountNumber != null && f.bankaccountNumber.length > 0) {
      fd.append('bankaccountNumber', f.bankaccountNumber);
    }
    if (f.ifsc != null && f.ifsc.length > 0) {
      fd.append('ifsc', f.ifsc);
    }
    if (f.bankName != null && f.bankName.length > 0) {
      fd.append('bankName', f.bankName);
    }
    if (f.bankType != null && f.bankType.length > 0) {
      fd.append('bankType', f.bankType);
    }
    if (typeof f.gstincert != 'string' && f.gstincert != null && f.gstincert != emptyFile) {
      fd.append('gstincert', f.gstincert);
    }
    if (typeof f.personelid != 'string' && f.personelid != null && f.personelid != emptyFile) {
      fd.append('personelid', f.personelid);
    }
    if (typeof f.logo != 'string' && f.logo != null && f.logo != emptyFile) {
      fd.append('logo', f.logo);
    }
    if (typeof f.cartImage != 'string' && f.cartImage != null && f.cartImage != emptyFile) {
      fd.append('cartImage', f.cartImage);
    }
    if (typeof f.paymentImage != 'string' && f.paymentImage != null && f.paymentImage != emptyFile) {
      fd.append('paymentImage', f.paymentImage);
    }
    if (typeof f.paymentPotraitImage != 'string' && f.paymentPotraitImage != null && f.paymentPotraitImage != emptyFile) {
      fd.append('paymentPotraitImage', f.paymentPotraitImage);
    }
    if (typeof f.searchBackgroundImg != 'string' && f.searchBackgroundImg != null && f.searchBackgroundImg != emptyFile) {
      fd.append('searchBackgroundImg', f.searchBackgroundImg);
    }
    if (typeof f.blogBackgroundImg != 'string' && f.blogBackgroundImg != null && f.blogBackgroundImg != emptyFile) {
      fd.append('blogBackgroundImg', f.blogBackgroundImg);
    }
    $http({
      method: 'PATCH',
      url: '/api/POS/store/'+f.pk+'/',
      data: fd,
      headers: {
        'Content-Type': undefined
      }
    }).
    then(function(response) {
      Flash.create('success', 'Saved')

    }, function(err) {
      Flash.create('danger', 'Some Internal Error')
    })
  }
})
