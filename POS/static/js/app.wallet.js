app.config(function($stateProvider) {

  $stateProvider
    .state('businessManagement.wallet', {
      url: "/wallet",
      views: {
        "": {
          templateUrl: '/static/ngTemplates/genericAppBase.html',

        },
        "menu@businessManagement.wallet": {
          templateUrl: '/static/ngTemplates/genericMenu.html',
          controller: 'controller.generic.menu',
        },
        "@businessManagement.wallet": {
          templateUrl: '/static/ngTemplates/app.wallet.default.html',
          controller: 'businessManagement.wallet.default',
        }
      }
    })
    .state('businessManagement.wallet.target', {
      url: "/target",
      templateUrl: '/static/ngTemplates/app.wallet.target.html',
      controller: 'businessManagement.wallet.target'
    })
    .state('businessManagement.wallet.gifts', {
      url: "/gifts",
      templateUrl: '/static/ngTemplates/app.wallet.gifts.html',
      controller: 'businessManagement.wallet.gifts'
    })
    .state('businessManagement.wallet.walletTransition', {
      url: "/walletTransition",
      templateUrl: '/static/ngTemplates/app.wallet.wallettransition.html',
      controller: 'businessManagement.wallet.wallettransition'
    })

});


app.controller("businessManagement.wallet.default", function($scope, $state, $users, $stateParams, $http, Flash, $uibModal, $rootScope, $aside) {


})
app.controller("businessManagement.wallet.target", function($scope, $state, $users, $stateParams, $http, Flash, $uibModal, $rootScope, $aside) {

  $scope.data = {
    tableData: [],
  };

  var views = [{
    name: 'list',
    icon: 'fa-th-large',
    template: '/static/ngTemplates/genericTable/genericSearchList.html',
    itemTemplate: '/static/ngTemplates/app.POS.target.item.html',
  }, ];


  $scope.config = {
    views: views,
    url: '/api/POS/target/',
    filterSearch: true,
    searchField: 'pk',
    itemsNumPerView: [6, 12, 24],
  }



  $scope.tableAction = function(target, action, mode) {
   console.log(target, action, mode);
   console.log($scope.data.tableData);


   for (var i = 0; i < $scope.data.tableData.length; i++) {
     if ($scope.data.tableData[i].pk == parseInt(target)) {
       if (action == 'edit') {
         var title = 'Edit : ';
         var appType = 'TargetEditor';
       } else  if(action == 'delete'){
         $scope.delete = function() {
              $http({
                method: 'DELETE',
                url: '/api/POS/target/' + $scope.data.tableData[i].pk + '/',
              }).
              then(function(response) {
                Flash.create('success', 'Deleted Successfully')
                $scope.data.tableData.splice(i, 1)
              })
            }
            $scope.delete()
            return
       }
       $scope.addTab({
         title: title + $scope.data.tableData[i].pk,
         cancel: true,
         app: appType,
         data: {
           pk: target,
           index: i
         },
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

})
app.controller("businessManagement.wallet.target.form", function($scope, $state, $users, $stateParams, $http, Flash, $uibModal, $rootScope, $aside) {

  $scope.reset = function(){
    $scope.target = {
      targetAmount:0,
      achievedCoin:0,
      status:false,
      validity:null,
      product:undefined,
    }
  }
  $scope.reset()
  $scope.productData = []
  if($scope.tab!=undefined){
    $scope.mode = 'edit'
    $scope.target = $scope.data.tableData[$scope.tab.data.index]
    $scope.productData =   $scope.target.product
    $scope.target.product = undefined

  }else{
    $scope.mode = 'create'
  }

  $scope.productSearch = function(query) {
    if (query.length > 0) {
      var url = '/api/POS/productsv/?name__icontains=' + query + '&limit=10'
      return $http.get(url).
      then(function(response) {
        return response.data.results;
      })
    }
  }

  $scope.addProducts = function(){
    if ($scope.target.product==undefined||$scope.target.product.pk==undefined) {
      Flash.create('danger', 'Please Select A Valid Product')
      return;
    }
    for (var i = 0; i < $scope.productData.length; i++) {
      if ($scope.productData[i].pk == $scope.target.product.pk) {
        Flash.create('danger', 'Product already exist')
        return;
      }
    }
    $scope.productData.push($scope.target.product);
    $scope.target.product = undefined;
  }

  $scope.removeProduct = function(index) {
    $scope.productData.splice(index, 1);
 }

 $scope.save = function(){
      if($scope.target.targetAmount == 'undefined'){
        Flash.create('warning', 'Enter Target Amount');
        return
      }
      if($scope.target.validity == null){
        Flash.create('warning', 'Select Validity Date');
        return
      }
      var pkList = $scope.productData.map(function(item){
        return item.pk
      })
      var data = {
        targetAmount:$scope.target.targetAmount ,
        achievedCoin:$scope.target.achievedCoin ,
        status:$scope.target.status,
        product:pkList,
        validity:JSON.stringify($scope.target.validity).split('T')[0].split('"')[1],
      }
      if($scope.mode == 'edit'){
        var method = 'PATCH'
        var url = '/api/POS/target/'+$scope.target.pk+'/'
      }else{
        var method = 'POST'
        var url = '/api/POS/target/'
      }
     $http({
       method: method,
       url: url,
       data: data,
     }).
     then(function(response) {
       if($scope.mode == 'edit'){
         $scope.target = response.data
         $scope.productData = $scope.target.product
         $scope.target.product = undefined
       }else{
         $scope.reset()
         $scope.productData = []
       }
       Flash.create('success', response.status + ' : ' + response.statusText);
     }, function(response) {
       Flash.create('danger', response.status + ' : ' + response.statusText);
     });
 }

})

app.controller("businessManagement.wallet.gifts", function($scope, $state, $users, $stateParams, $http, Flash, $uibModal, $rootScope, $aside) {
      $scope.data = {
        tableData: [],
      };

      var views = [{
        name: 'list',
        icon: 'fa-th-large',
        template: '/static/ngTemplates/genericTable/genericSearchList.html',
        itemTemplate: '/static/ngTemplates/app.POS.gift.item.html',
      }, ];


      $scope.config = {
        views: views,
        url: '/api/POS/gift/',
        filterSearch: true,
        searchField: 'pk',
        itemsNumPerView: [6, 12, 24],
      }



      $scope.tableAction = function(target, action, mode) {
       console.log(target, action, mode);
       console.log($scope.data.tableData);


       for (var i = 0; i < $scope.data.tableData.length; i++) {
         if ($scope.data.tableData[i].pk == parseInt(target)) {
           if (action == 'edit') {
             var title = 'Edit : ';
             var appType = 'GiftEditor';
           } else  if(action == 'delete'){
             $scope.delete = function() {
                  $http({
                    method: 'DELETE',
                    url: '/api/POS/gift/' + $scope.data.tableData[i].pk + '/',
                  }).
                  then(function(response) {
                    Flash.create('success', 'Deleted Successfully')
                    $scope.data.tableData.splice(i, 1)
                  })
                }
                $scope.delete()
                return
           }
           $scope.addTab({
             title: title + $scope.data.tableData[i].name,
             cancel: true,
             app: appType,
             data: {
               pk: target,
               index: i
             },
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

})
app.controller("businessManagement.wallet.gift.form", function($scope, $state, $users, $stateParams, $http, Flash, $uibModal, $rootScope, $aside) {
  $scope.reset = function(){
    $scope.gift = {
      name:'',
      image:emptyFile,
      coins:0,
      available:false,
    }
  }
  $scope.reset()
  $scope.imageShow = null
  if($scope.tab!=undefined){
    $scope.mode = 'edit'
    $scope.gift = $scope.data.tableData[$scope.tab.data.index]
    $scope.imageShow = $scope.gift.image

  }else{
    $scope.mode = 'create'
  }

  $scope.save = function(){

    var fd = new FormData();
    fd.append('name', $scope.gift.name);
    fd.append('coins', $scope.gift.coins);
    fd.append('available', $scope.gift.available);

    if($scope.mode == 'edit'){
      var url = '/api/POS/gift/'+$scope.gift.pk+'/';
      var method = 'PATCH';
      console.log($scope.gift.image,'fffffffff');
      if (typeof $scope.gift.image === 'object' ) {
        fd.append('image', $scope.gift.image);
      }else{
        fd.append('image', emptyFile);
      }
    }else{
      var url = '/api/POS/gift/';
      var method = 'POST';
      fd.append('image', $scope.gift.image);
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
      if($scope.mode == 'edit'){
        $scope.gift = response.data
        $scope.imageShow = $scope.gift.image
      }else{
        $scope.reset()
      }
      Flash.create('success', response.status + ' : ' + response.statusText);
    }, function(response) {
      Flash.create('danger', response.status + ' : ' + response.statusText);
    });
  }

})


app.controller("businessManagement.wallet.wallettransition", function($scope, $state, $users, $stateParams, $http, Flash, $uibModal, $rootScope, $aside) {
      $scope.data = {
        tableData: [],
      };

      var views = [{
        name: 'list',
        icon: 'fa-th-large',
        template: '/static/ngTemplates/genericTable/genericSearchList.html',
        itemTemplate: '/static/ngTemplates/app.POS.wallettransition.item.html',
      }, ];


      $scope.config = {
        views: views,
        url: '/api/POS/wallettransition/',
        filterSearch: true,
        searchField: 'pk',
        itemsNumPerView: [6, 12, 24],
      }



      $scope.tableAction = function(target, action, mode) {
       console.log(target, action, mode);
       console.log($scope.data.tableData);


       for (var i = 0; i < $scope.data.tableData.length; i++) {
         if ($scope.data.tableData[i].pk == parseInt(target)) {
           if (action == 'edit') {
             var title = 'Edit : ';
             var appType = 'TargetEditor';
           } else  if(action == 'delete'){
             $scope.delete = function() {
                  $http({
                    method: 'DELETE',
                    url: '/api/POS/target/' + $scope.data.tableData[i].pk + '/',
                  }).
                  then(function(response) {
                    Flash.create('success', 'Deleted Successfully')
                    $scope.data.tableData.splice(i, 1)
                  })
                }
                $scope.delete()
                return
           }
           $scope.addTab({
             title: title + $scope.data.tableData[i].pk,
             cancel: true,
             app: appType,
             data: {
               pk: target,
               index: i
             },
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

})
