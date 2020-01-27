app.config(function($stateProvider){

  $stateProvider
  .state('businessManagement', {
    url: "/businessManagement",
    views: {
       "": {
          templateUrl: '/static/ngTemplates/businessManagement.html',
       },
       "menu@businessManagement": {
          templateUrl: '/static/ngTemplates/businessManagement.menu.html',
          controller : 'businessManagement.menu'
        },
        "@businessManagement": {
          templateUrl: '/static/ngTemplates/businessManagement.dash.html',
          controller : 'businessManagement'
        }
    }
  })

  .state('businessManagement.manageUsers', {
    url: "/manageUsers",
    templateUrl: '/static/ngTemplates/app.HR.manage.users.html',
    controller: 'admin.manageUsers'
  })
  .state('businessManagement.blog', {
    url: "/blog/:id?action",
    templateUrl: '/static/ngTemplates/app.home.blog.html',
    controller: 'controller.home.blog'
  })

  // .state('admin.files', {
  //   url: "/files/:id?action",
  //   templateUrl: '/static/ngTemplates/app.ERP.files.html',
  //   controller: 'controller.ERP.files'
  // })


  // .state('businessManagement.files', {
  //   url: "/files/:id?action",
  //   templateUrl: '/static/ngTemplates/app.home.files.html',
  //   controller: 'controller.home.files'
  // })


  .state('businessManagement.settings', {
    url: "/settings",
    views: {
       "": {
          templateUrl: '/static/ngTemplates/app.ERP.settings.html',
       },
       "menu@businessManagement.settings": {
          templateUrl: '/static/ngTemplates/app.ERP.settings.menu.html',
          controller : 'admin.settings.menu'
        },
        "@businessManagement.settings": {
          templateUrl: '/static/ngTemplates/app.ERP.settings.default.html',
          controller : function($scope,$state){
            $state.go('businessManagement.settings.configure',{app:'ecommerce',canConfigure:25})
          }
        }
    }
  })

  .state('businessManagement.settings.modulesAndApplications', {
    url: "/modulesAndApplications",
    templateUrl: '/static/ngTemplates/app.ERP.settings.modulesAndApps.html',
    controller: 'admin.settings.modulesAndApps'
  })
  // .state('businessManagement.settings.configure', {
  //   url: "/configure?app&canConfigure",
  //   templateUrl: '/static/ngTemplates/app.ERP.settings.configure.html',
  //   controller: 'admin.settings.configure'
  // })

});

app.controller('businessManagement' , function($scope , $users , Flash){
  // main businessManagement tab default page controller
});

app.controller('businessManagement.menu' , function($scope , $users , Flash , $permissions){
  // main businessManagement tab default page controller

  $scope.apps = [];

  $scope.buildMenu = function(apps){
    for (var i = 0; i < apps.length; i++) {
      a = apps[i];
      parts = a.name.split('.');
      if (a.module != 3 || a.name.indexOf('app') == -1 || parts.length != 2) {
        continue;
      }
      a.state = a.name.replace('app' , 'businessManagement')
      a.dispName = parts[parts.length -1];
      $scope.apps.push(a);
    }
  }

  as = $permissions.apps();
  if(typeof as.success == 'undefined'){
    $scope.buildMenu(as);
  } else {
    as.success(function(response){
      $scope.buildMenu(response);
    });
  };
});
