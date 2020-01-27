app.controller("businessManagement.ecommerce.support", function($scope, $state, $users, $stateParams, $http, Flash, $uibModal, $rootScope) {
  // var views = [{name : 'table' , icon : 'fa-bars' , template : '/static/ngTemplates/genericTable/tableDefault.html'},
  // ];
  //
  // var options = {
  //   main : {icon : 'fa-pencil', text: 'edit'} ,
  //   };
  //
  // $scope.config = {
  //   views : views,
  //   url : '/api/ecommerce/feedback/',
  //   // fields : ['pk','title' , 'description' , 'priceModel' , 'approved' , 'category' , 'parentType'],
  //   searchField: 'mobile',
  //   // options : options,
  //   // deletable : true,
  //   itemsNumPerView : [12,24,48],
  // }
  //
  //
  // $scope.tableAction = function(target , action , mode){
  //   console.log(target , action , mode);
  //   console.log($scope.data.tableData);
  //   if (action=='edit') {
  //     for (var i = 0; i < $scope.data.tableData.length; i++) {
  //       if ($scope.data.tableData[i].pk == parseInt(target)){
  //         $scope.addTab({title : 'Edit Listing : ' + $scope.data.tableData[i].title , cancel : true , app : 'editListing' , data : {pk : target} , active : true})
  //       }
  //     }
  //   }
  // }

  $scope.data = {
    tableCreatedData: []
  }

  var views = [{
    name: 'list',
    icon: 'fa-th-large',
    template: '/static/ngTemplates/genericTable/genericSearchList.html',
    itemTemplate: '/static/ngTemplates/app.ecommerce.vendor.support.request.item.html',
  }, ];


  $scope.requestconfig = {
    views: views,
    url: '/api/ecommerce/supportFeed/',
    searchField: 'status',
    deletable: true,
    itemsNumPerView: [12, 24, 48],
    getParams : [{key : 'status__in' , value : 'created,ongoing'}],
  }

  $scope.tableCreatedAction = function(target, action, mode) {
    for (var i = 0; i < $scope.data.tableCreatedData.length; i++) {
      if ($scope.data.tableCreatedData[i].pk == parseInt(target)) {
        if (action == 'info') {
          var title = 'Support Details : ';
          var appType = 'requestInfo';
        }
        else if (action == 'delete') {
          $http({
            method: 'DELETE',
            url: '/api/ecommerce/supportFeed/' + $scope.data.tableCreatedData[i].pk + '/'
          }).
          then(function(response) {
            Flash.create('success', 'Deleted Successfully!');
          })
          $scope.data.tableCreatedData.splice(i, 1)
          return;
        }
        $scope.addTab({
          title: title + $scope.data.tableCreatedData[i].pk,
          cancel: true,
          app: appType,
          data: {
            pk: target,
            index: i,
            request: $scope.data.tableCreatedData[i]
          },
          active: true
        })
      }
    }

  }




  $scope.data = {
    tableResolvedData: []
  }

  var views = [{
    name: 'list',
    icon: 'fa-th-large',
    template: '/static/ngTemplates/genericTable/genericSearchList.html',
    itemTemplate: '/static/ngTemplates/app.ecommerce.vendor.support.resolved.item.html',
  }, ];


  $scope.resolvedConfig = {
    views: views,
    url: '/api/ecommerce/supportFeed/',
    searchField: 'status',
    deletable: true,
    itemsNumPerView: [12, 24, 48],
    getParams : [{key : 'status__in' , value : 'junk,resolved'}],
  }


  $scope.tableResolvedAction = function(target, action, mode) {
    for (var i = 0; i < $scope.data.tableResolvedData.length; i++) {
      if ($scope.data.tableResolvedData[i].pk == parseInt(target)) {
        if (action == 'info') {
          var title = 'Support Details : ';
          var appType = 'resolvedInfo';
        }
        else if (action == 'delete') {
          $http({
            method: 'DELETE',
            url: '/api/ecommerce/supportFeed/' + $scope.data.tableResolvedData[i].pk + '/'
          }).
          then(function(response) {
            Flash.create('success', 'Deleted Successfully!');
          })
          $scope.data.tableResolvedData.splice(i, 1)
          return;
        }
        $scope.addTab({
          title: title + $scope.data.tableResolvedData[i].pk,
          cancel: true,
          app: appType,
          data: {
            pk: target,
            index: i,
            request: $scope.data.tableResolvedData[i]
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





});

app.controller("businessManagement.ecommerce.support.request.explore", function($scope, $state, $users, $stateParams, $http, Flash, $uibModal, $rootScope) {

  $scope.data = $scope.tab.data;

$scope.sendResponse=function(){
  var sendData = {
    response:$scope.data.request.response,
    // user : $scope.data.request.user.pk,
    datapk : $scope.data.request.pk
  }
  console.log(sendData,'aaaaaaaaaaa');
  $http({
    method: 'POST',
    url: '/api/ecommerce/sendFeedBack/',
    data: sendData
  }).
  then(function(response) {
    console.log(response.data);
    Flash.create('success', 'Email Sent Successfully! ');
  })

}

$scope.$watch('data.request.status', function(newValue, oldValue) {
$scope.status= newValue
// var sendData = {
//   status: $scope.status,
// }

$http({
  method: 'PATCH',
  url: '/api/ecommerce/supportFeed/' + $scope.data.request.pk + '/',
  data: {status: $scope.status}
}).
then(function(response) {
  console.log(response.data);
})

});
});

app.controller("businessManagement.ecommerce.support.resolved.explore", function($scope, $state, $users, $stateParams, $http, Flash, $uibModal, $rootScope) {

  $scope.data = $scope.tab.data;
  console.log(  $scope.data,'aaaaaaaaaaaaaaaaaa');


});
