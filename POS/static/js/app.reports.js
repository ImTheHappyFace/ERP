app.config(function($stateProvider) {

  $stateProvider
    .state('businessManagement.reports', {
      url: "/reports",
      views: {
        "": {
          templateUrl: '/static/ngTemplates/app.reports.default.html',
          controller: 'businessManagement.reports.default',
        }
      }
    })
});

app.controller("businessManagement.reports.default", function($scope, $http, Flash, $rootScope, $filter) {
  $scope.currency = ''
  $http.get('/api/ERP/appSettings/?app=25&name__iexact=currencySymbol').
  then(function(response) {
    if (response.data[0] != null) {
      $scope.currency = response.data[0].value
    }
  })
  $scope.activatedTab = 'sales'
  $scope.salesNoDataMsg = true
  $scope.deliveryNoDataMsg = true
  $scope.salesForm = {fdt:new Date(),sdt:new Date()}
  $scope.deliveryForm = {fdt:new Date()}
  $scope.deliveryData = {}
  $scope.salesData = {}

  $scope.fetchSalesData = function(){
    console.log($scope.salesForm);
    $scope.salesTotalAmount = 0
    $scope.salesTotalGst = 0
    if ($scope.salesForm.sdt-$scope.salesForm.fdt>=0) {
      $http.get('/api/ecommerce/reportsData/?typ=sales&fdt=' + $scope.salesForm.fdt.toJSON().split('T')[0] + '&sdt=' + $scope.salesForm.sdt.toJSON().split('T')[0]).
      then(function(response) {
        console.log(response.data);
        $scope.salesData = response.data
        for (var i = 0; i < response.data.length; i++) {
          $scope.salesTotalAmount += response.data[i].receivedAmount
          $scope.salesTotalGst += response.data[i].gstCollected
        }
        if (response.data.length>0) {
          $scope.salesNoDataMsg = false
        }else {
          $scope.salesNoDataMsg = true
        }
      })
    }else {
      Flash.create('warning','Invalid Date Selections')
      return
    }

  }
  $scope.fetchSalesData()
  $scope.fetchDeliveryData = function(){
    console.log($scope.deliveryForm);
    $scope.deliveryTotalAmount = 0
    $http.get('/api/ecommerce/reportsData/?typ=delivery&fdt=' + $scope.deliveryForm.fdt.toJSON().split('T')[0]).
    then(function(response) {
      console.log(response.data);
      // response.data = {'sai':{total:25,cod:5,card:25,deliveredCount:7,ongoingCount:2},'kiran':{total:50,cod:25,card:25,deliveredCount:2,ongoingCount:5},'Pothuri':{total:85,cod:20,card:25,deliveredCount:5,ongoingCount:3}}
      $scope.deliveryData = response.data
      objKeys = Object.keys(response.data)
      if (objKeys.length>0) {
        $scope.deliveryNoDataMsg = false
        for (var i = 0; i < objKeys.length; i++) {
          $scope.deliveryTotalAmount += response.data[objKeys[i]].total
        }
      }else {
        $scope.deliveryNoDataMsg = true
      }
    })
  }
  $scope.fetchDeliveryData()




  // $scope.userSearch = function(query) {
  //   return $http.get('/api/HR/userSearch/?username__contains=' + query + '&limit=10').
  //   then(function(response) {
  //     return response.data.results;
  //   })
  // };
  // $scope.userOrders = function(){
  //   if ($scope.form.name.pk) {
  //     return $http.get('/api/ecommerce/orderQtyMap/?orderBy=' + $scope.form.name.pk).
  //     then(function(response) {
  //       $scope.deliveredData = response.data;
  //       if (response.data.length==0) {
  //         $scope.noDataMsg = true
  //       }else {
  //         $scope.noDataMsg = false
  //       }
  //     })
  //   }else {
  //     Flash.create('warning', 'Please Select Proper User');
  //     return
  //   }
  // }

})
