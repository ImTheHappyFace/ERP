app.controller('admin.manageUsers.mailAccount', function($scope, $http, Flash) {

  $scope.generateMailPasskey = function() {
    console.log($scope);
    console.log($scope.data);
    $http({
      method: 'PATCH',
      url: '/api/mail/account/' + $scope.data.mailAccount.pk + '/?user=' + $scope.data.mailAccount.user
    }).
    then(function(response) {
      $scope.data.mailAccount = response.data;
    });
  }

  $scope.addActive = function() {
    $scope.data.is_active = true

    var dataToSend = {
      is_active: $scope.data.is_active,
      username: $scope.data.username,
      last_name: $scope.data.last_name,
      first_name: $scope.data.first_name,
      is_staff: $scope.data.is_staff,
    }

    $http({
      method: 'PATCH',
      url: '/api/HR/usersAdminMode/' + $scope.data.pk + '/',
      data: dataToSend
    }).
    then(function(response) {
      var toSend = {
        email: response.data.email,
        name: response.data.first_name
      };
      $http({
        method: 'POST',
        url: '/api/HR/sendActivatedStatus/',
        data: toSend
      }).
      then(function(response) {
        Flash.create('success', 'User Activated Successfully');
        console.log(response.data);
      })
    });


  }
});

app.controller('sudo.manageUsers.explore', function($scope, $http, $aside, $state, Flash, $users, $filter, $timeout) {

  $scope.data = $scope.tab.data;
  $scope.isStoreGlobal = false;
  $http.get('/api/ERP/appSettings/?app=25&name__iexact=isStoreGlobal').
  then(function(response) {
    if (response.data[0] != null) {
      $scope.isStoreGlobal = response.data[0].flag
    }
  })


  $scope.details = {
    Address: '',
    Company: '',
    GST: '',
    agree: '',
    designation: '',
    email: '',
    emailOTP: '',
    firstName: '',
    lastName: '',
    mobile: '',
    mobileOTP: '',
    password: '',
    pincode: '',
    rePassword: '',
    reg: '',
    statecode: '',
    token: ''
  }

  $scope.addresses = [];
  $http({
    method: 'GET',
    url: '/api/ecommerce/address/?user=' + $scope.data.pk
  }).then(function(response) {
    $scope.addresses = response.data
  })

  // $scope.details = ''
  $scope.updateProfile = false
  if ($scope.data.profile) {
    if ($scope.data.profile.details) {
      $scope.detailsUser = $scope.data.profile.details
      valid = $scope.detailsUser.replace(/u'/g, "'")
      valid = valid.replace(/'/g, '"')
      valid = valid.replace(/True/g, 'true')
      valid = valid.replace(/None/g, '""')
      $scope.details = JSON.parse(valid)
    }

  }
  $scope.updateData = function() {
    $scope.updateProfile = true
  }

  $scope.updateDetails = function() {
    // console.log($scope.details);
    $http({
      method: 'PATCH',
      url: '/api/HR/profile/' + $scope.data.profile.pk + '/',
      data: {
        details: $scope.details,
      }
    }).
    then(function(response) {
      Flash.create('success', 'Saved!')
      $scope.updateProfile = false
    })
  }



  // $scope.designation = ''
  // $scope.role = ''
  // $scope.company = ''
  // $scope.pincode = ''
  // $scope.statecode = ''
  // $scope.gst = ''
  //
  //
  // $scope.designationTemp = $scope.details.split("u'designation': u'")[1]
  // if ($scope.designationTemp !=undefined) {
  //   $scope.designation = $scope.designationTemp.split("'")[0]
  // }
  //
  // $scope.roleTemp = $scope.details.split("u'role': u'")[1]
  // if ($scope.roleTemp !=undefined) {
  //   $scope.role = $scope.roleTemp.split("'")[0]
  // }
  //
  // $scope.companyTemp = $scope.details.split("u'Company': u'")[1]
  // if ($scope.companyTemp !=undefined) {
  //   $scope.company = $scope.companyTemp.split("'")[0]
  // }
  //
  // $scope.pincodeTemp = $scope.details.split("u'pincode': u'")[1]
  // if ($scope.pincodeTemp !=undefined) {
  //     $scope.pincode = $scope.pincodeTemp.split("'")[0]
  // }
  //
  // $scope.statecodeTemp = $scope.details.split("u'statecode': u'")[1]
  // if ($scope.statecodeTemp !=undefined) {
  //   $scope.statecode = $scope.statecodeTemp.split("'")[0]
  // }
  //
  // $scope.gstTemp = $scope.details.split("u'GST': u'")[1]
  // if ($scope.gstTemp !=undefined) {
  //   $scope.gst = $scope.gstTemp.split("'")[0]
  // }

});


app.controller('sudo.manageUsers.editPayroll', function($scope, $http, Flash) {

  $scope.user = $scope.tab.data;

  $http({
    method: 'GET',
    url: '/api/HR/payroll/' + $scope.tab.data.payroll.pk + '/'
  }).
  then(function(response) {
    $scope.form = response.data;
  })

  $scope.save = function() {
    // make  request
    var f = $scope.form;
    dataToSend = {
      user: f.pk,
      hra: f.hra,
      special: f.special,
      lta: f.lta,
      basic: f.basic,
      adHoc: f.adHoc,
      policyNumber: f.policyNumber,
      provider: f.provider,
      amount: f.amount,
      noticePeriodRecovery: f.noticePeriodRecovery,
      al: f.al,
      ml: f.ml,
      adHocLeaves: f.adHocLeaves,
      joiningDate: f.joiningDate.toJSON().split('T')[0],
      off: f.off,
      accountNumber: f.accountNumber,
      ifscCode: f.ifscCode,
      bankName: f.bankName,
      deboarded: f.deboarded,
      lastWorkingDate: f.lastWorkingDate.toJSON().split('T')[0],

    }

    $http({
      method: 'PATCH',
      url: '/api/HR/payroll/' + f.pk + '/',
      data: dataToSend
    }).
    then(function(response) {

      // $scope.data.pk=response.data.pk

      Flash.create('success', response.status + ' : ' + response.statusText);
      // }, function(response){
      //    Flash.create('danger', response.status + ' : ' + response.statusText);
    }, function(err) {

    })



  }




});


app.controller('sudo.admin.editProfile', function($scope, $http, $aside, $state, Flash, $users, $filter, $timeout) {


  $scope.data = $scope.tab.data;


  $scope.save = function() {
    var prof = $scope.data;

    if (prof.mobile == null || prof.mobile == undefined || prof.mobile.length == 0) {
      Flash.create('danger', "Plaese add the Mobile Number");
      return;
    }

    if (prof.email == null || prof.email == undefined || prof.email.length == 0) {
      Flash.create('danger', "Plaese add the Email id");
      return;
    }

    var dataToSend = {
      prefix: prof.prefix,
      // dateOfBirth: prof.dateOfBirth.toJSON().split('T')[0],

      gender: prof.gender,
      permanentAddressStreet: prof.permanentAddressStreet,
      permanentAddressCity: prof.permanentAddressCity,
      permanentAddressPin: prof.permanentAddressPin,
      permanentAddressState: prof.permanentAddressState,
      permanentAddressCountry: prof.permanentAddressCountry,
      sameAsShipping: prof.sameAsShipping,
      localAddressStreet: prof.localAddressStreet,
      localAddressCity: prof.localAddressCity,
      localAddressPin: prof.localAddressPin,
      localAddressState: prof.localAddressState,
      localAddressCountry: prof.localAddressCountry,
      email: prof.email,
      mobile: prof.mobile,
    }

    $http({
      method: 'PATCH',
      url: '/api/HR/profileAdminMode/' + prof.pk + '/',
      data: dataToSend
    }).
    then(function(response) {
      Flash.create('success', "Saved");
    })
  }





});


app.controller('admin.manageUsers', function($scope, $http, $aside, $state, Flash, $users, $filter, $timeout, $uibModal) {






  $scope.data = {
    tableData: [],
    tableDatastore: [],
  };

  viewsstore = [{
    name: 'list',
    icon: 'fa-th-large',
    template: '/static/ngTemplates/genericTable/genericSearchList.html',
    itemTemplate: '/static/ngTemplates/app.HR.manage.store.items.html',
  }, ];



  $scope.configstore = {
    views: viewsstore,
    url: '/api/POS/store/',
    searchField: 'name',
    itemsNumPerView: [12, 24, 48],
  }
  $scope.tableActionstore = function(target, action, mode) {
    console.log(target, action, mode);

    for (var i = 0; i < $scope.data.tableDatastore.length; i++) {
      console.log($scope.data.tableDatastore[i], 'ffffffffffffffffffff');
      if ($scope.data.tableDatastore[i].pk == parseInt(target)) {
        if (action == 'storeEditor') {
          var title = 'Edit : ';
          var appType = 'storeEditor';
        } else if (action == 'storeInfo') {
          var title = 'Details : ';
          var appType = 'storeInfo';
        }

        $scope.addTab({
          title: title + $scope.data.tableDatastore[i].pk + ' ',
          cancel: true,
          app: appType,
          data: $scope.data.tableDatastore[i],
          active: true
        })
      }
    }
  }

  $scope.tabs = [];
  $scope.searchTabActive = true;

  $scope.closeTab = function(index) {
    $scope.tabs.splice(index, 1)
  }

  $scope.addTab = function(input) {
    console.log(JSON.stringify(input));
    $scope.searchTabActive = false;
    alreadyOpen = false;
    for (var i = 0; i < $scope.tabs.length; i++) {
      if ($scope.tabs[i].data.pk == input.data.pk && $scope.tabs[i].app == input.app) {
        $scope.tabs[i].active = true;
        alreadyOpen = true;
      } else {
        $scope.tabs[i].active = false;
      }
    }
    if (!alreadyOpen) {
      $scope.tabs.push(input)
    }
  }









  // var views = [{name : 'table' , icon : 'fa-bars' , template : '/static/ngTemplates/genericTable/tableDefault.html'},
  //     {name : 'thumbnail' , icon : 'fa-th-large' , template : '/static/ngTemplates/empSearch/tableThumbnail.html'},
  //     {name : 'icon' , icon : 'fa-th' , template : '/static/ngTemplates/empSearch/tableIcon.html'},
  //     {name : 'graph' , icon : 'fa-pie-chart' , template : '/static/ngTemplates/empSearch/tableGraph.html'}
  //   ];
  //
  // var options = {main : {icon : 'fa-envelope-o', text: 'im'} ,
  //   others : [{icon : '' , text : 'social' },
  //     {icon : '' , text : 'editProfile' },
  //     {icon : '' , text : 'editDesignation' },
  //     {icon : '' , text : 'editPermissions' },
  //     {icon : '' , text : 'editMaster' },
  //     {icon : '' , text : 'editPayroll' },
  //   ]
  //   };
  // var fields = ['username' , 'email' , 'first_name' , 'last_name' , 'profile'];
  //
  // var multiselectOptions = [{icon : 'fa fa-book' , text : 'Learning' },
  //   {icon : 'fa fa-bar-chart-o' , text : 'Performance' },
  //   {icon : 'fa fa-envelope-o' , text : 'message' },
  // ];
  //
  // $scope.config = {
  //   url : '/api/HR/users/' ,
  //   views : views ,
  //   options : options,
  //   multiselectOptions : multiselectOptions,
  //   searchField : 'username',
  //   fields : fields,
  // };
  //
  // $scope.tabs = [];
  // $scope.searchTabActive = true;
  // $scope.data = {tableData : []};
  //
  // $scope.closeTab = function(index){
  //   $scope.tabs.splice(index , 1)
  // }
  //
  // $scope.addTab = function( input ){
  //   $scope.searchTabActive = false;
  //   alreadyOpen = false;
  //   for (var i = 0; i < $scope.tabs.length; i++) {
  //
  //     if ($scope.tabs[i].app == input.app) {
  //       if ((typeof $scope.tabs[i].data.url != 'undefined' && $scope.tabs[i].data.url == input.data.url )|| (typeof $scope.tabs[i].data.pk != 'undefined' && $scope.tabs[i].data.pk == input.data.pk)) {
  //         $scope.tabs[i].active = true;
  //         alreadyOpen = true;
  //       }
  //     }else{
  //       $scope.tabs[i].active = false;
  //     }
  //   }
  //   if (!alreadyOpen) {
  //     $scope.tabs.push(input)
  //   }
  // }
  //




  // var views = [{name : 'table' , icon : 'fa-bars' , template : '/static/ngTemplates/genericTable/tableDefault.html'},
  //     {name : 'thumbnail' , icon : 'fa-th-large' , template : '/static/ngTemplates/empSearch/tableThumbnail.html'},
  //     {name : 'icon' , icon : 'fa-th' , template : '/static/ngTemplates/empSearch/tableIcon.html'},
  //     {name : 'graph' , icon : 'fa-pie-chart' , template : '/static/ngTemplates/empSearch/tableGraph.html'}
  //   ];

  // $scope.data = {
  //   tableData: [],
  // }

  var views = [{
      name: 'table',
      icon: 'fa-bars',
      template: '/static/ngTemplates/genericTable/genericSearchList.html',
      itemTemplate: '/static/ngTemplates/app.HR.manage.users.items.html'
    },
    // {name : 'thumbnail' , icon : 'fa-th-large' , template : '/static/ngTemplates/empSearch/tableThumbnail.html'},
    // {name : 'icon' , icon : 'fa-th' , template : '/static/ngTemplates/empSearch/tableIcon.html'},
    // {name : 'graph' , icon : 'fa-pie-chart' , template : '/static/ngTemplates/empSearch/tableGraph.html'}
  ];

  var options = {
    main: {
      icon: 'fa-envelope-o',
      text: 'im'
    },
    others: [{
        icon: '',
        text: 'social'
      },
      {
        icon: '',
        text: 'editProfile'
      },
      // {
      //   icon: '',
      //   text: 'editDesignation'
      // },
      {
        icon: '',
        text: 'editPermissions'
      },
      {
        icon: '',
        text: 'editMaster'
      },
      // {
      //   icon: '',
      //   text: 'editPayroll'
      // },
      {
        icon: '',
        text: 'viewProfile'
      },
    ]
  };

  var multiselectOptions = [
    // {
    //   icon: 'fa fa-book',
    //   text: 'Learning'
    // },
    // {
    //   icon: 'fa fa-bar-chart-o',
    //   text: 'Performance'
    // },
    // {
    //   icon: 'fa fa-envelope-o',
    //   text: 'message'
    // },
    {
      icon: 'fa fa-plus',
      text: 'bulkUpload'
    },
  ];

  $scope.config = {
    url: '/api/HR/users/',
    views: views,
    options: options,
    itemsNumPerView: [12, 24, 48],
    multiselectOptions: multiselectOptions,
    searchField: 'username',
  };


  $scope.tabs = [];
  $scope.searchTabActive = true;

  $scope.closeTab = function(index) {
    $scope.tabs.splice(index, 1)
  }

  $scope.addTab = function(input) {
    $scope.searchTabActive = false;
    alreadyOpen = false;
    for (var i = 0; i < $scope.tabs.length; i++) {

      if ($scope.tabs[i].app == input.app) {
        if ((typeof $scope.tabs[i].data.url != 'undefined' && $scope.tabs[i].data.url == input.data.url) || (typeof $scope.tabs[i].data.pk != 'undefined' && $scope.tabs[i].data.pk == input.data.pk)) {
          $scope.tabs[i].active = true;
          alreadyOpen = true;
        }
      } else {
        $scope.tabs[i].active = false;
      }
    }
    if (!alreadyOpen) {
      $scope.tabs.push(input)
    }
  }



  // create new user
  $scope.newUser = {
    username: '',
    firstName: '',
    lastName: '',
    password: ''
  };
  $scope.createUser = function() {
    dataToSend = {
      username: $scope.newUser.username,
      first_name: $scope.newUser.firstName,
      last_name: $scope.newUser.lastName,
      password: $scope.newUser.password
    };
    $http({
      method: 'POST',
      url: '/api/HR/usersAdminMode/',
      data: dataToSend
    }).
    then(function(response) {
      Flash.create('success', response.status + ' : ' + response.statusText);
      $scope.newUser = {
        username: '',
        firstName: '',
        lastName: '',
        password: ''
      };
    }, function(response) {
      Flash.create('danger', response.status + ' : ' + response.statusText);
    });
  }



  $scope.tableAction = function(target, action, mode) {
    // target is the url of the object

    if (typeof mode == 'undefined') {
      if (action == 'im') {
        $scope.$parent.$parent.addIMWindow(target);
      } else if (action == 'editProfile') {
        for (var i = 0; i < $scope.data.tableData.length; i++) {
          if ($scope.data.tableData[i].pk == target) {
            u = $users.get(target)
            $http.get('/api/HR/profileAdminMode/' + $scope.data.tableData[i].profile.pk + '/').
            success((function(target) {
              return function(response) {
                u = $users.get(target)
                console.log("will add tab profile : ");
                console.log(response);
                $scope.addTab({
                  title: 'Edit Profile for ' + u.first_name + ' ' + u.last_name,
                  cancel: true,
                  app: 'editProfile',
                  data: response,
                  active: true
                })

                console.log($scope.tabs);
              }
            })(target));
          }
        }

      } else if (action == 'social') {
        $state.go('home.social', {
          id: target
        })
      } else if (action == 'editMaster') {
        console.log(target);
        $http({
          method: 'GET',
          url: '/api/HR/usersAdminMode/' + target + '/'
        }).
        then(function(response) {
          $http({
            method: 'GET',
            url: '/api/mail/account/?user=' + target
          }).
          then((function(userData) {
            return function(response) {
              userData.mailAccount = response.data[0];
              $scope.addTab({
                title: 'Edit master data  for ' + userData.first_name + ' ' + userData.last_name,
                cancel: true,
                app: 'editMaster',
                data: userData,
                active: true
              })
            }
          })(response.data))
        })
      } else if (action == 'editPermissions') {
        u = $users.get(target)
        $http.get('/api/ERP/application/?user=' + u.username).
        success((function(target) {
          return function(data) {
            u = $users.get(target)
            permissionsFormData = {
              appsToAdd: data,
              url: target,
            }
            $scope.addTab({
              title: 'Edit permissions for ' + u.first_name + ' ' + u.last_name,
              cancel: true,
              app: 'editPermissions',
              data: permissionsFormData,
              active: true
            })
          }
        })(target));
      } else if (action == 'viewProfile') {
        for (var i = 0; i < $scope.data.tableData.length; i++) {
          if ($scope.data.tableData[i].pk == target) {
            console.log($scope.data.tableData[i]);

            $scope.addTab({
              title: 'Profile for ' + $scope.data.tableData[i].first_name + ' ' + $scope.data.tableData[i].last_name,
              cancel: true,
              app: 'viewProfile',
              data: $scope.data.tableData[i],
              active: true
            })


            // u = $users.get(target)
            // $http.get('/api/HR/profileAdminMode/' + $scope.data.tableData[i].profile.pk + '/').
            // success((function(target) {
            //   return function(response) {
            //     response.userPK = target;
            //     u = $users.get(target)
            //     console.log("will add tab profile : ");
            //     console.log(response);
            //     $scope.addTab({
            //       title: 'Profile for ' + u.first_name + ' ' + u.last_name,
            //       cancel: true,
            //       app: 'viewProfile',
            //       data: response,
            //       active: true
            //     })
            //
            //     console.log($scope.tabs);
            //   }
            // })(target));
          }
        }
      } else if (action == 'editDesignation') {
        for (var i = 0; i < $scope.data.tableData.length; i++) {
          if ($scope.data.tableData[i].pk == target) {
            u = $users.get(target)
            $http.get('/api/HR/designation/' + $scope.data.tableData[i].designation + '/').
            success((function(target) {
              return function(response) {
                response.userPK = target;
                // console.log(target);
                u = $users.get(target)
                console.log("will add tab profile : ");
                console.log(response);
                $scope.addTab({
                  title: 'Edit Designation for ' + u.first_name + ' ' + u.last_name,
                  cancel: true,
                  app: 'editDesignation',
                  data: response,
                  active: true
                })

                console.log($scope.tabs);
              }
            })(target));
          }
        }
      } else if (action == 'editPayroll') {
        for (var i = 0; i < $scope.data.tableData.length; i++) {
          if ($scope.data.tableData[i].pk == target) {
            u = $users.get(target)
            $http.get('/api/HR/payroll/' + $scope.data.tableData[i].payroll.pk + '/').
            success((function(target) {
              return function(response) {
                u = $users.get(target)
                console.log("will add tab payroll : ");
                console.log(response);
                $scope.addTab({
                  title: 'Edit payroll for ' + u.first_name + ' ' + u.last_name,
                  cancel: true,
                  app: 'editPayroll',
                  data: response,
                  active: true
                })

                console.log($scope.tabs);

              }
            })(target));
          }
        }
      }
      // for the single select actions
    } else {
      if (mode == 'multi') {
        console.log(target);
        console.log(action);

        console.log("aaaaaaaaaaaaa");
        $uibModal.open({
          templateUrl: '/static/ngTemplates/app.user.upload.html',
          size: 'md',
          backdrop: true,
          resolve: {},
          controller: 'controller.user.upload',
        }).result.then(function() {}, function() {

        });
      }

    }
  }

  //
  // $scope.tableAction = function(target , action , mode){
  //   // target is the url of the object
  //   if (typeof mode == 'undefined') {
  //     if (action == 'im') {
  //       $scope.$parent.$parent.addIMWindow(target);
  //     } else if (action == 'editProfile') {
  //
  //       $http({method :'options' , url : '/api/HR/profileAdminMode'}).
  //       then(function(response){
  //         $scope.profileFormStructure = response.data.actions.POST;
  //         console.log(target);
  //         console.log($scope.data);
  //         for (var i = 0; i < $scope.data.tableData.length; i++) {
  //           if ($scope.data.tableData[i].pk == target){
  //             url = '/api/HR/profileAdminMode/' + $scope.data.tableData[i].profile.pk + '/';
  //           }
  //         }
  //         $http({method :'GET' , url : url}).
  //         then((function(target) {
  //           return function(response){
  //             $scope.profile = response.data;
  //             for(key in $scope.profileFormStructure){
  //               if ($scope.profileFormStructure[key].type.indexOf('upload') !=-1) {
  //                 $scope.profile[key] = emptyFile;
  //               }
  //             }
  //             console.log(target);
  //             u = $users.get(target)
  //             $scope.addTab({title : 'Edit profile of ' + u.first_name + ' ' + u.last_name  , cancel : true , app : 'editProfile' , data : $scope.profile , active : true})
  //           }
  //         })(target));
  //       });
  //
  //     } else if (action == 'social') {
  //       $state.go('home.social' , {id : target})
  //     } else if (action == 'editMaster') {
  //       console.log(target);
  //       $http({method : 'GET' , url : '/api/HR/usersAdminMode/' + target + '/'}).
  //       then(function(response){
  //         $http({method : 'GET' , url : '/api/mail/account/?user=' + target }).
  //         then((function(userData){
  //           return function(response) {
  //             userData.mailAccount = response.data[0];
  //             $scope.addTab({title : 'Edit master data  for ' + userData.first_name + ' ' + userData.last_name , cancel : true , app : 'editMaster' , data : userData , active : true})
  //           }
  //         })(response.data))
  //       })
  //     } else if (action == 'editPermissions') {
  //       u = $users.get(target)
  //       $http.get('/api/ERP/application/?user='+ u.username ).
  //       success((function(target){
  //         return function(data){
  //           u = $users.get(target)
  //           permissionsFormData = {
  //             appsToAdd : data,
  //             url : target,
  //           }
  //           $scope.addTab({title : 'Edit permissions for ' + u.first_name + ' ' + u.last_name  , cancel : true , app : 'editPermissions' , data : permissionsFormData , active : true})
  //         }
  //       })(target));
  //     } else if (action == 'editPayroll') {
  //       u = $users.get(target)
  //       $http.get('/api/HR/payroll/?user='+ u.username ).
  //       success((function(target){
  //         return function(data){
  //           u = $users.get(target)
  //
  //           $scope.addTab({title : 'Edit permissions for ' + u.first_name + ' ' + u.last_name  , cancel : true , app : 'editPayroll' , data : data , active : true})
  //         }
  //       })(target));
  //     }
  //     // for the single select actions
  //   } else {
  //     if (mode == 'multi') {
  //       console.log(target);
  //       console.log(action);
  //     }
  //   }
  // }

  $scope.updateUserPermissions = function(index) {
    var userData = $scope.tabs[index].data;
    if (userData.appsToAdd.length == 0) {
      Flash.create('warning', 'No new permission to add')
      return;
    }
    var apps = [];
    for (var i = 0; i < userData.appsToAdd.length; i++) {
      apps.push(userData.appsToAdd[i].pk)
    }
    var dataToSend = {
      user: getPK(userData.url),
      apps: apps,
    }
    $http({
      method: 'POST',
      url: '/api/ERP/permission/',
      data: dataToSend
    }).
    then(function(response) {
      Flash.create('success', response.status + ' : ' + response.statusText);
    }, function(response) {
      Flash.create('danger', response.status + ' : ' + response.statusText);
    })

  }

  $scope.getPermissionSuggestions = function(query) {
    return $http.get('/api/ERP/application/?name__contains=' + query)
  }

  $scope.updateProfile = function(index) {
    userData = $scope.tabs[index].data;
    var fd = new FormData();
    for (key in userData) {
      if (key != 'url' && userData[key] != null) {
        if ($scope.profileFormStructure[key].type.indexOf('integer') != -1) {
          if (userData[key] != null) {
            fd.append(key, parseInt(userData[key]));
          }
        } else if ($scope.profileFormStructure[key].type.indexOf('date') != -1) {
          if (userData[key] != null) {
            fd.append(key, $filter('date')(userData[key], "yyyy-MM-dd"));
          }
        } else if ($scope.profileFormStructure[key].type.indexOf('url') != -1 && (userData[key] == null || userData[key] == '')) {
          // fd.append( key , 'http://localhost');
        } else {
          fd.append(key, userData[key]);
        }
      }
    }
    $http({
      method: 'PATCH',
      url: '/api/HR/profileAdminMode/' + userData.pk + '/',
      data: fd,
      transformRequest: angular.identity,
      headers: {
        'Content-Type': undefined
      }
    }).
    then(function(response) {
      Flash.create('success', response.status + ' : ' + response.statusText);
    }, function(response) {
      Flash.create('danger', response.status + ' : ' + response.statusText);
    });
  };

  $scope.updateUserMasterDetails = function(index) {
    var userData = $scope.tabs[index].data;
    dataToSend = {
      username: userData.username,
      last_name: userData.last_name,
      first_name: userData.first_name,
      is_staff: userData.is_staff,
      is_active: userData.is_active,
    }
    if (userData.password != '') {
      dataToSend.password = userData.password
    }
    $http({
      method: 'PATCH',
      url: userData.url.replace('users', 'usersAdminMode'),
      data: dataToSend
    }).
    then(function(response) {
      console.log(response.data, 'gggggfffffffff');
      Flash.create('success', response.status + ' : ' + response.statusText);
    }, function(response) {
      Flash.create('danger', response.status + ' : ' + response.statusText);
    });
  }




  $scope.editDesignation = function(index) {
    // var userData = $scope.tabs[index].data;
    // dataToSend = {
    //
    //
    // }
    // if (userData.password != '') {
    //   dataToSend.password = userData.password
    // }
    // $http({method : 'PATCH' , url : userData.url.replace('users' , 'usersAdminMode') , data : dataToSend }).
    // then(function(response){
    //    Flash.create('success', response.status + ' : ' + response.statusText);
    // }, function(response){
    //    Flash.create('danger', response.status + ' : ' + response.statusText);
    // });
  }

  $scope.Reporting = function(query) {
    // console.log('************',query);
    console.log("@@@@@@@@@@@@@@");
    return $http.get('/api/HR/users/?username__contains=' + query).
    then(function(response) {
      console.log('@', response.data)
      return response.data;
    })
  };








  $scope.save = function() {
    console.log('entered');
    var f = $scope.form;
    var toSend = {
      'reportingTo': f.reportingTo.pk,
      'primaryApprover': f.primaryApprover.pk,
      'secondaryApprover': f.secondaryApprover.pk,
    }
    console.log('222222222', toSend);

    $scope.me = $users.get('mySelf');
    $http({
      method: 'POST',
      url: '/api/HR/designation/',
      data: toSend,
    }).
    then(function(response) {
      $scope.form.pk = response.data.pk;
      Flash.create('success', 'Saved')
      // $scope.fetchData();
      //  $scope.$broadcast('forceRefetch',)
      //    $scope.$broadcast('forcerefresh', response.data);
      //  $route.reload();
    })
  }
  //
  // var name=$scope.tabs[index].data;
  // console.log('@@@@@@@@@@@@@@@@',name);







  // $scope.editPayroll = function(index){
  //   var userData = $scope.tabs[index].data;
  //   dataToSend = {
  //     user : userData.pk,
  //     // last_name : userData.last_name,
  //     // first_name : userData.first_name,
  //     // is_staff : userData.is_staff,
  //     // is_active : userData.is_active,
  //     hra : userData.hra,
  //     special : userData.special,
  //     lta : userData.lta,
  //     basic : userData.basic,
  //     adHoc : userData.adHoc,
  //     policyNumber : userData.policyNumber,
  //     provider : userData.provider,
  //     amount : userData.amount,
  //     noticePeriodRecovery : userData.noticePeriodRecovery,
  //     al : userData.al,
  //     ml : userData.ml,
  //     adHocLeaves : userData.adHocLeaves,
  //     joiningDate : userData.joiningDate.toJSON().split('T')[0],
  //     off : userData.off,
  //     accountNumber : userData.accountNumber,
  //     ifscCode : userData.ifscCode,
  //     bankDetais : userData.bankName,
  //
  //
  //   }
  //   // if (userData.password != '') {
  //   //   dataToSend.password = userData.password
  //   // }
  //   $http({method : 'POST' , url :'/api/HR/payroll/'  , data : dataToSend }).
  //   then(function(response){
  //     console.log('before',$scope.data);
  //     $scope.data.pk=response.data.pk
  //     console.log('0000',$scope.data);
  //      Flash.create('success', response.status + ' : ' + response.statusText);
  //   }, function(response){
  //      Flash.create('danger', response.status + ' : ' + response.statusText);
  //   });
  // }


});

app.controller('controller.user.upload', function($scope, $http, $aside, $state, Flash, $users, $filter, $timeout, $uibModal) {

  $scope.bulkForm = {
    xlFile: emptyFile,
    success: false,
    usrCount: 0
  }
  $scope.upload = function() {
    if ($scope.bulkForm.xlFile == emptyFile) {
      Flash.create('warning', 'No file selected')
      return
    }
    $scope.locationData = window.location
    console.log($scope.bulkForm.xlFile);
    var fd = new FormData()
    fd.append('xl', $scope.bulkForm.xlFile);
    fd.append('locationData', $scope.locationData);
    console.log('*************', fd);
    $http({
      method: 'POST',
      url: '/api/HR/bulkUserCreation/',
      data: fd,
      transformRequest: angular.identity,
      headers: {
        'Content-Type': undefined
      }
    }).
    then(function(response) {
      Flash.create('success', 'Created');
      // $scope.bulkForm.usrCount = response.data.count;
      // $scope.bulkForm.success = true;
    })

  }

});



app.controller("sudo.managestores.store.form", function($scope, $http, Flash, $uibModal, $rootScope, $state) {
  $scope.$watch('form.pincode', function(newvalue, oldvalue) {
    console.log(newvalue, "k");
    if (newvalue.length == 6) {
      $http.get('/api/ecommerce/genericPincode/?pincode__contains=' + newvalue).
      then(function(response) {
        console.log(response.data[0], "kkkkkkkkkkk");
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

  $scope.usergroup = []

  $scope.resetForm = function() {
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
      owner: '',
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

  }
  $scope.addmoderators = function() {
    if (typeof $scope.form.moderators == 'object') {
      $scope.form.moderatorslist.push($scope.form.moderators)
      $scope.form.moderators = "";
    }
  }
  $scope.deletemoderators = function(indx) {
    $scope.form.moderatorslist.splice(indx, 1)
  }


  if ($scope.tab != undefined) {
    $scope.resetForm()
    $scope.mode = 'edit';
    console.log('aaaaaaaaaaaa', $scope.tab.data);
    $scope.form = $scope.tab.data;
    $scope.form.moderatorslist = $scope.form.moderators
    $scope.form.moderators = ''
  } else {
    $scope.mode = 'new';
    $scope.resetForm()
  }


  $scope.save = function() {
    console.log('entered');
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
    if (f.owner == null || f.owner.length == 0) {
      Flash.create('warning', 'Please Add Owner')
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
    fd.append('owner', f.owner.pk);

    var url = '/api/POS/store/';
    if ($scope.mode == 'new') {
      var method = 'POST';
    } else {
      var method = 'PATCH';
      url += f.pk + '/'
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
      if ($scope.mode == 'new') {
        $scope.resetForm()
      }
    }, function(err) {
      Flash.create('danger', 'Some Internal Error')
    })
  }

})
