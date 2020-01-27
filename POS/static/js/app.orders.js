app.config(function($stateProvider) {

  $stateProvider
    .state('businessManagement.orders', {
      url: "/orders",
      views: {
        "": {
          templateUrl: '/static/ngTemplates/app.deliveryCenter.default.html',
          controller: 'businessManagement.deliveryCenter.default',
        },
        // "menu@businessManagement.deliveryCenter": {
        //   templateUrl: '/static/ngTemplates/genericMenu.html',
        //   controller: 'controller.generic.menu',
        // },
        // "@businessManagement.deliveryCenter": {
        //   templateUrl: '/static/ngTemplates/app.deliveryCenter.default.html',
        //   controller: 'businessManagement.deliveryCenter.default',
        // }
      }
    })
});

app.controller("businessManagement.deliveryCenter.default", function($scope, $http, Flash, $rootScope, $filter,$uibModal) {
  // $scope.statusDate = 'one' ;
  // $scope.alterTableNew = function(){
  //   $scope.statusDate = 'one'
  //   console.log("Table1");
  // }
  //
  // $scope.alterTableInProgress = function(){
  //   $scope.statusDate = 'two'
  //   console.log("Table2");
  // }
  //
  // $scope.alterTableCompleted = function(){
  //   $scope.statusDate = 'three'
  //   console.log("Table3");
  // }


  var today = new Date();
  // var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  var firstDay = new Date(new Date().setDate(today.getDate()-30))


  $scope.filterData = {
    type:'created',
    from:firstDay,
    to:today,
    days:30,
  }


  // LOGIC WIDGET BAR ------------------------------------------------------------------------



  $scope.data = {
    tableData_new: [
                {orders:{pk:"#SO-00005"},chkbxVal:false, user:{first_name:"Prateek", last_name:"Antunes"} , Status: "Completed" , total:" 2674,56 $" , created_on:"May 10 , 2019" , last_updated:"today" },
                {orders:{pk:"#SO-00006" },chkbxVal:false, user:{first_name:"Shakti", last_name:"Antunes"} , Status: "Fullfilled" , total:" 2674,56 $" , created_on:"May 10 , 2019" , last_updated:"today" },
                {orders:{pk:"#SO-00007"},chkbxVal:false, user:{first_name:"XYZ", last_name:"Antunes"} , Status: "Partially Completed" , total:" 2674,56 $" , created_on:"May 10 , 2019" , last_updated:"today" },
                {orders:{pk:"#SO-00008"},chkbxVal:false, user:{first_name:"ABC", last_name:"Antunes"} , Status: "Fullfilled" , total:" 2674,56 $" , created_on:"May 10 , 2019" , last_updated:"today" },
                {orders:{pk:"#SO-00005" },chkbxVal:false, user:{first_name:"Prateek", last_name:"Antunes"} , Status: "NA" , total:" 2674,56 $" , created_on:"May 10 , 2019" , last_updated:"today" },
                {orders:{pk:"#SO-00005" },chkbxVal:false, user:{first_name:"Shakti", last_name:"Antunes"} , Status: "Fullfilled" , total:" 2674,56 $" , created_on:"May 10 , 2019" , last_updated:"today" },
                {orders:{pk:"#SO-00005" },chkbxVal:false, user:{first_name:"XYZ", last_name:"Antunes"} , Status: "Done" , total:" 2674,56 $" , created_on:"May 10 , 2019" , last_updated:"today" },
                {orders:{pk:"#SO-00005" },chkbxVal:false, user:{first_name:"ABC", last_name:"Antunes"} , Status: "NA" , total:" 2674,56 $" , created_on:"May 10 , 2019" , last_updated:"today" },
                {orders:{pk:"#SO-00005" },chkbxVal:false, user:{first_name:"Shakti", last_name:"Antunes"} , Status: "Fullfilled" , total:" 2674,56 $" , created_on:"May 10 , 2019" , last_updated:"today" },
                {orders:{pk:"#SO-00005" },chkbxVal:false, user:{first_name:"XYZ", last_name:"Antunes"} , Status: "Done" , total:" 2674,56 $" , created_on:"May 10 , 2019" , last_updated:"today" },
                {orders:{pk:"#SO-00005" },chkbxVal:false, user:{first_name:"ABC", last_name:"Antunes"} , Status: "NA" , total:" 2674,56 $" , created_on:"May 10 , 2019" , last_updated:"today" },
                {orders:{pk:"#SO-00005" },chkbxVal:false, user:{first_name:"Prateek", last_name:"Antunes"} , Status: "NA" , total:" 2674,56 $" , created_on:"May 10 , 2019" , last_updated:"today" },
                {orders:{pk:"#SO-00005" },chkbxVal:false, user:{first_name:"Shakti", last_name:"Antunes"} , Status: "Fullfilled" , total:" 2674,56 $" , created_on:"May 10 , 2019" , last_updated:"today" },
                {orders:{pk:"#SO-00005" },chkbxVal:false, user:{first_name:"XYZ", last_name:"Antunes"} , Status: "Done" , total:" 2674,56 $" , created_on:"May 10 , 2019" , last_updated:"today" },
              ],
  tableData_InProgress: [
              {orders:{pk:"#SO-00005" },chkbxVal:false, user:{first_name:"Prateek", last_name:"Antunes"} , Status: "NA" , total:" 2674,56 $" , created_on:"May 10 , 2019" , last_updated:"today" },
              {orders:{pk:"#SO-00005" },chkbxVal:false, user:{first_name:"Shakti", last_name:"Antunes"} , Status: "Fullfilled" , total:" 2674,56 $" , created_on:"May 10 , 2019" , last_updated:"today" },
              {orders:{pk:"#SO-00005" },chkbxVal:false, user:{first_name:"XYZ", last_name:"Antunes"} , Status: "Done" , total:" 2674,56 $" , created_on:"May 10 , 2019" , last_updated:"today" },
              {orders:{pk:"#SO-00005" },chkbxVal:false, user:{first_name:"ABC", last_name:"Antunes"} , Status: "NA" , total:" 2674,56 $" , created_on:"May 10 , 2019" , last_updated:"today" },
              {orders:{pk:"#SO-00005" },chkbxVal:false, user:{first_name:"Shakti", last_name:"Antunes"} , Status: "Fullfilled" , total:" 2674,56 $" , created_on:"May 10 , 2019" , last_updated:"today" },
              {orders:{pk:"#SO-00005" },chkbxVal:false, user:{first_name:"XYZ", last_name:"Antunes"} , Status: "Done" , total:" 2674,56 $" , created_on:"May 10 , 2019" , last_updated:"today" },
              {orders:{pk:"#SO-00005" },chkbxVal:false, user:{first_name:"ABC", last_name:"Antunes"} , Status: "NA" , total:" 2674,56 $" , created_on:"May 10 , 2019" , last_updated:"today" },
            ],
  tableData_Completed: [
              {pk:"#SO-00005" , user:{first_name:"Ronaldo", last_name:"Antunes"} , Status: "Fullfilled" , total:" 2674,56 $" , created_on:"May 10 , 2019" , last_updated:"today" },
              {pk:"#SO-00005" , user:{first_name:"Dybala", last_name:"Antunes"} , Status: "Done" , total:" 2674,56 $" , created_on:"May 10 , 2019" , last_updated:"yesterday" },
              {pk:"#SO-00005" , user:{first_name:"Costa", last_name:"Antunes"} , Status: "Fullfilled" , total:" 2674,56 $" , created_on:"May 10 , 2019" , last_updated:"15-jan-20" },
              {pk:"#SO-00005" , user:{first_name:"Curry", last_name:"Antunes"} , Status: "Fullfilled" , total:" 2674,56 $" , created_on:"May 10 , 2019" , last_updated:"14-jan-20" },
              {pk:"#SO-00005" , user:{first_name:"Curry", last_name:"Antunes"} , Status: "Fullfilled" , total:" 2674,56 $" , created_on:"May 10 , 2019" , last_updated:"14-jan-20" },
            ],
  }

  $scope.$watch( "data.tableData_new" , function(n,o){
       var trues = $filter("filter")( n , {chkbxVal:true} );
       $scope.flag = trues.length;
   }, true );

   $scope.$watch( "data.tableData_InProgress" , function(n,o){
        var trues2 = $filter("filter")( n , {chkbxVal:true} );
        $scope.flag2 = trues2.length;
    }, true );


   $scope.closeWidget = function(){
     $scope.flag = 0;
   }




  var views = [{
    name: 'list',
    icon: 'fa-th-large',
    template: '/static/ngTemplates/genericTable/genericSearchList.html',
    itemTemplate: '/static/ngTemplates/app.ecommerce.vendor.orders.item.html',
  }, ];

     $scope.changeConfig = function(){
      return $scope.config = {
         views: views,
         url: '/api/ecommerce/order/',
         searchField: 'id',
         deletable: true,
         itemsNumPerView: [12, 24, 48],
         getParams: [
         {
           key: 'filter',
           value: 'multiple'
         }, {
           key: 'type',
           value: $scope.filterData.type
         },
        {
           key: 'from',
           value: JSON.stringify($scope.filterData.from).split('T')[0].split('"')[1]
         },
        {
           key: 'to',
           value: JSON.stringify($scope.filterData.to).split('T')[0].split('"')[1]
         },
       ],
       }
     }
    $scope.config = {
      views: views,
      url: '/api/ecommerce/order/',
      searchField: 'id',
      deletable: true,
      itemsNumPerView: [12, 24, 48],
      getParams: [
      {
        key: 'filter',
        value: 'multiple'
      }, {
        key: 'type',
        value: $scope.filterData.type
      },
     {
        key: 'from',
        value: JSON.stringify($scope.filterData.from).split('T')[0].split('"')[1]
      },
     {
        key: 'to',
        value: JSON.stringify($scope.filterData.to).split('T')[0].split('"')[1]
      },
    ],
    }



  $scope.tableAction = function(target, action, mode) {
    console.log(target, action, mode);
    console.log($scope.data.tableData);

    for (var i = 0; i < $scope.data.tableData.length; i++) {
      if ($scope.data.tableData[i].pk == parseInt(target)) {
        if (action == 'info') {
          var title = 'Order Details : ';
          var appType = 'orderInfo';
        }

        $scope.addTab({
          title: title + $scope.data.tableData[i].pk,
          cancel: true,
          app: appType,
          data: {
            pk: target,
            index: i,
            order: $scope.data.tableData[i]
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
  $scope.setType = function(type){
    $scope.filterData.type = type
    $scope.changeConfig()
    $rootScope.$broadcast('changeConfig', $scope.config);
  }

  $scope.$watch('filterData.days', function(value) {
      var day = new Date(new Date().setDate(today.getDate()-value))
      $scope.filterData.from = day
      $scope.changeConfig()
      $rootScope.$broadcast('changeConfig', $scope.config);
 });






  $scope.filter = function(){
    var from = JSON.stringify($scope.filterData.from).split('T')[0].split('"')[1]
    var to = JSON.stringify($scope.filterData.to).split('T')[0].split('"')[1]
    $http.get('/api/ecommerce/order/?filter=multiple&from='+from+'&to='+to+'&type='+$scope.filterData.type).
    then(function(response) {
      $scope.data = response.data
    })
  }

  // $scope.filter()

  // $scope.pgrowActionClicked = function(target, action) {
  //   console.log(target, action);
  //   $scope.exploreOrder(target, 'created');
  // }
  //
  // $scope.exploreOrder = function(idx, typ) {
  //   if (typ == 'created') {
  //     var toRet = $scope.data[idx];
  //     var viewTyp = 'edit'
  //   } else {
  //     var toRet = $scope.data[idx];
  //     var viewTyp = 'view'
  //   }
  //   console.log(toRet);
  //   $uibModal.open({
  //     templateUrl: '/static/ngTemplates/app.deliveryCenter.online.orders.explore.html',
  //     size: 'xxl',
  //     backdrop: true,
  //     resolve: {
  //       orderDt: function() {
  //         return toRet
  //       },
  //       viewTyp: function() {
  //         return viewTyp
  //       }
  //     },
  //     controller: 'businessManagement.deliveryCenter.orders.online.explore',
  //   }).result.then(function() {
  //
  //   }, function() {
  //
  //   });
  // }
})

app.controller("app.deliveryCenter.orders.online", function($scope, $state, $users, $stateParams, $http, Flash, $uibModal, $rootScope, $aside, $filter) {
  console.log(ORDERS_STATUS_LIST);
  console.log('In online orderss Controller');
  $scope.currency = ""
  $http.get('/api/ERP/appSettings/?name__iexact=currencySymbol').
  then(function(response) {
    if (response.data[0] != null) {
      $scope.currency = response.data[0].value
    }
  })

  $scope.limit = 6
  $scope.invData = []
  $scope.showMore = true
  $scope.fetchInvData = function() {
    console.log($scope.limit);
    $http.get('/api/ecommerce/order/?deliveryCenter_filter=created&offset=0&limit=' + $scope.limit).
    then(function(response) {
      // console.log('**********************', response.data.results);
      $scope.invData = response.data.results
      if (response.data.next) {
        // console.log('nextttttt',response.data.next);
        $scope.showMore = true
      } else {
        // console.log('empty',response.data.next);
        $scope.showMore = false
      }
    })
  }
  $scope.fetchInvData()

  $scope.rowActionClicked = function(target, action) {
    console.log(target, action);
    $scope.exploreOrder(target, 'created');
  }

  $scope.pginvData = []
  $scope.pgfetchInvData = function() {
    $http.get('/api/ecommerce/order/?deliveryCenter_filter=packed').
    then(function(response) {
      console.log('**********************', response.data);
      $scope.pginvData = response.data
    })
  }
  $scope.pgfetchInvData()

  setInterval(function() {
    // $scope.fetchInvData()
    $scope.pgfetchInvData()
  }, 30000);

  $scope.pgrowActionClicked = function(target, action) {
    console.log(target, action);
    $scope.exploreOrder(target, 'process');
  }

  $scope.exploreOrder = function(idx, typ) {
    if (typ == 'created') {
      var toRet = $scope.invData[idx];
      var viewTyp = 'edit'
    } else {
      var toRet = $scope.pginvData[idx];
      var viewTyp = 'view'
    }
    console.log(toRet);
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.deliveryCenter.online.orders.explore.html',
      size: 'xxl',
      backdrop: true,
      resolve: {
        orderDt: function() {
          return toRet
        },
        viewTyp: function() {
          return viewTyp
        }
      },
      controller: 'businessManagement.deliveryCenter.orders.online.explore',
    }).result.then(function() {

    }, function() {
      $scope.fetchInvData()
    });
  }




})

app.controller("app.deliveryCenter.orders.offline", function($scope, $state, $users, $stateParams, $http, Flash, $uibModal, $rootScope, $aside, $filter) {
  console.log('In offline orderss Controller');
  $scope.hover = false;

  $scope.limit = 6
  $scope.invData = []
  $scope.showMore = false
  $scope.fetchInvData = function() {
    console.log($scope.limit);
    $http.get('/api/POS/invoice/?status__icontains=Created&offset=0&limit=' + $scope.limit).
    then(function(response) {
      // console.log('**********************', response.data.results);
      $scope.invData = response.data.results
      if (response.data.next) {
        // console.log('nextttttt',response.data.next);
        $scope.showMore = true
      } else {
        // console.log('empty',response.data.next);
        $scope.showMore = false
      }
    })
  }
  $scope.fetchInvData()
  $scope.rowActionClicked = function(target) {
    console.log(target);
    $scope.openInvoiceForm(target, 'created');
    // if (action == 'edit') {
    //   $scope.openInvoiceForm(target, 'created');
    // } else {
    //   $scope.openInvoiceinfoForm(target, 'created');
    // }
  }

  $scope.pginvData = []
  $scope.pgfetchInvData = function() {
    $http.get('/api/POS/invoice/?status__icontains=In Progress').
    then(function(response) {
      console.log('**********************', response.data);
      $scope.pginvData = response.data
    })
  }
  $scope.pgfetchInvData()

  setInterval(function() {
    // $scope.fetchInvData()
    $scope.pgfetchInvData()
  }, 30000);

  $scope.pgrowActionClicked = function(target) {
    console.log(target);
    $scope.openInvoiceForm(target, 'process');
    // if (action == 'edit') {
    //   $scope.openInvoiceForm(target, 'process');
    // } else {
    //   $scope.openInvoiceinfoForm(target, 'process');
    // }
  }

  $scope.openInvoiceForm = function(idx, typ) {
    if (typ == 'created') {
      var toRet = $scope.invData[idx];
      var viewTyp = 'edit'
    } else {
      var toRet = $scope.pginvData[idx];
      var viewTyp = 'view'
    }
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.deliveryCenter.offline.orders.explore.html',
      size: 'xl',
      backdrop: true,
      resolve: {
        invoice: function() {
          return toRet
        },
        viewTyp: function() {
          return viewTyp
        }
      },
      controller: 'businessManagement.deliveryCenter.orders.offline.invoice.form',
    }).result.then(function() {

    }, function() {
      $scope.fetchInvData()
    });
  }

})

app.controller("businessManagement.deliveryCenter.orders.offline.invoice.form", function($scope, invoice, viewTyp, $http, Flash, $rootScope, $filter) {

  $scope.form = invoice;
  $scope.viewTyp = viewTyp

  $scope.form.receivedDate = new Date($scope.form.receivedDate);
  $scope.form.duedate = new Date($scope.form.duedate);
  $scope.form.invoicedate = new Date($scope.form.invoicedate);

  if (typeof $scope.form.products == 'string') {
    $scope.form.products = JSON.parse($scope.form.products)
  }

  $scope.wampData = []
  $scope.productsPks = []

  $scope.form.cMobileRequired = false
  $http.get('/api/ERP/appSettings/?app=25&name__iexact=customerAddress').
  then(function(response) {
    console.log('ratingggggggggggggggggggg', response.data);
    if (response.data[0] != null) {
      if (response.data[0].flag) {
        $scope.form.cMobileRequired = true
      }
    }
  })
  if ($scope.form.customer) {
    $scope.form.cMobileNumber = $scope.form.customer.mobile
  }

  $scope.posShowAll = true
  $scope.posPrinter = false
  $http.get('/api/ERP/appSettings/?app=25&name__iexact=posScanner').
  then(function(response) {
    if (response.data.length > 0) {
      if (response.data[0].flag) {
        $scope.posShowAll = false
      }
    }
  })
  $http.get('/api/ERP/appSettings/?app=25&name__iexact=posPrinting').
  then(function(response) {
    if (response.data.length > 0) {
      if (response.data[0].flag) {
        $scope.posPrinter = true
      }
    }
  })

  $scope.today = new Date();
  $scope.firstDay = new Date($scope.today.getFullYear(), $scope.today.getMonth(), 2);
  $scope.monday = getMonday(new Date());


  $scope.productSearch = function(query) {
    if (query.length > 0) {

      console.log("called1");
      var url = '/api/POS/storeQty/?product__name__icontains=' + query + '&limit=10'
      // var url = '/api/POS/product/?search=' + query + '&limit=10'
      if ($rootScope.multiStore) {
        console.log($rootScope.storepk);
        if ($rootScope.storepk > 0) {
          url = url + '&store=' + $rootScope.storepk
        } else {
          Flash.create('warning', 'Please Select Store First')
          return
        }
      } else {
        url = url + '&master=true'
      }
      return $http.get(url).
      then(function(response) {
        // console.log(response.data.results);
        // return response.data.results;
        var res;
        for (var i = 0; i < response.data.results.length; i++) {
          res = response.data.results[i]
          console.log(res);
          if (res.productVariant) {
            // console.log(res.productVariant);
            res.name = res.product.name + ' ' + $filter('convertUnit')(res.productVariant.unitPerpack * res.product.howMuch, res.product.unit)
          } else {
            res.name = res.product.name + ' ' + $filter('convertUnit')(res.product.howMuch, res.product.unit)
          }
        }

        return response.data.results;
      })
    }

  }
  $scope.posSubtotal = 0

  $scope.subTotal = function() {
    var subTotal = 0;
    var item;
    for (var i = 0; i < $scope.form.products.length; i++) {
      if ($scope.form.products[i].data != "" && $scope.form.products[i].data.product != undefined) {
        item = $scope.form.products[i]
        var taxRate = item.data.product.productMeta != null && item.data.product.productMeta != undefined ? item.data.product.productMeta.taxRate : 0;
        if (item.data.productVariant != null) {
          subTotal += item.quantity * (item.data.productVariant.price + (taxRate * item.data.productVariant.price / 100))
        } else {
          subTotal += item.quantity * (item.data.product.price + (taxRate * item.data.product.price / 100))
        }
      }
    }
    $scope.posSubtotal = Math.round(subTotal)
    return $scope.posSubtotal.toFixed(2);
  }
  $scope.subTotalTax = function() {
    var subTotalTax = 0;
    var item;
    for (var i = 0; i < $scope.form.products.length; i++) {
      item = $scope.form.products[i]
      if ($scope.form.products[i].data != "" && $scope.form.products[i].data.product != undefined) {
        var taxRate = item.data.product.productMeta != null && item.data.product.productMeta != undefined ? item.data.product.productMeta.taxRate : 0;

        if (item.data.productVariant != null) {
          subTotalTax += item.quantity * (taxRate * item.data.productVariant.price / 100)
        } else {
          subTotalTax += item.quantity * (taxRate * item.data.product.price / 100)
        }
      }
    }
    return subTotalTax.toFixed(2);
  }

  $scope.customerNameSearch = function(query) {
    return $http.get('/api/POS/customer/?name__contains=' + query).
    then(function(response) {
      return response.data;
    })
  };
  $scope.$watch('form.customer', function(newValue, oldValue) {
    console.log(newValue);
    if (typeof newValue == "string" && newValue.length > 0) {
      $scope.showCreateCustomerBtn = true;
      $scope.customerExist = false;
      $scope.showCustomerForm = false;
    } else if (typeof newValue == "object") {
      $scope.customerExist = true;
    } else {
      $scope.showCreateCustomerBtn = false;
      $scope.showCustomerForm = false;
    }

    if (newValue == '') {
      $scope.showCreateCustomerBtn = false;
      $scope.showCustomerForm = false;
      $scope.customerExist = false;
    }

  });


  $scope.sai = 'kiran'
  $rootScope.multiStore = false
  $rootScope.storepk = 0

  function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    console.log(decodedCookie);
    var ca = decodedCookie.split(';');
    console.log(ca);
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
    console.log('set cookie');
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }

  function createCookieDevice(deviceNo) {
    console.log('create cookieeeeeeeee', deviceNo);
    detail = getCookie("connectedDevice");
    if (detail != "") {
      console.log('already there');
      document.cookie = encodeURIComponent("connectedDevice") + "=deleted; expires=" + new Date(0).toUTCString()
    }
    setCookie("connectedDevice", deviceNo, 365);
  }

  function createCookieStore(store) {
    console.log('create cookieeeeeeeee', store);
    detail = getCookie("selectedStore");
    if (detail != "") {
      console.log('already there');
      document.cookie = encodeURIComponent("selectedStore") + "=deleted; expires=" + new Date(0).toUTCString()
    }
    setCookie("selectedStore", store, 365);
  }

  $scope.storeForm = {
    'name': ''
  }
  $http.get('/api/ERP/appSettings/?app=25&name__iexact=multipleStore').
  then(function(response) {
    console.log('ratingggggggggggggggggggg', response.data);
    if (response.data[0] != null) {
      if (response.data[0].flag) {
        $rootScope.multiStore = true
        selectedStore = getCookie("selectedStore");
        console.log('strrrrrrrrrrrrrrr', selectedStore);
        if (selectedStore != "") {
          $scope.storeForm.name = JSON.parse(selectedStore)
          $rootScope.storepk = $scope.storeForm.name.pk
          // $scope.connectDevice()
        }
      }
    }
  })

  $scope.$watch('storeForm.name', function(newValue, oldValue) {
    if (typeof newValue == 'object') {
      $rootScope.storepk = newValue.pk
      createCookieStore(JSON.stringify(newValue))
    }
  })

  $scope.storeSearch = function(query) {
    return $http.get('/api/POS/store/?name__icontains=' + query).
    then(function(response) {
      return response.data;
    })
  }

  $scope.openInvoiceCustomerForm = function() {
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.POS.Invoice.newCustomer.form.html',
      size: 'lg',
      backdrop: true,
      resolve: {
        mobile: function() {
          return $scope.form.cMobileNumber
        }
      },
      controller: function($scope, $uibModalInstance, mobile) {
        $scope.cstForm = {
          mobile: mobile,
          name: '',
          pincode: '',
          city: '',
          state: '',
          country: 'India',
          street: ''
        }
        $scope.$watch('cstForm.pincode', function(newValue, oldValue) {
          if (newValue != null) {
            if (newValue.length == 6) {
              $http({
                method: 'GET',
                url: '/api/ecommerce/genericPincode/?pincode__iexact=' + newValue
              }).
              then(function(response) {
                if (response.data.length > 0) {
                  $scope.cstForm.city = response.data[0].city
                  $scope.cstForm.state = response.data[0].state
                }
              })
            }
          }
        })
        $scope.saveCust = function() {
          if ($scope.cstForm.name.length == 0) {
            Flash.create('warning', 'Please Enter Customer Name')
            return
          }
          var f = $scope.cstForm
          var toSend = {
            name: f.name,
            mobile: f.mobile,
            pincode: f.pincode,
            country: f.country,
            state: f.state,
            city: f.city,
            street: f.street
          }

          $http({
            method: 'POST',
            url: '/api/POS/customer/',
            data: toSend
          }).
          then(function(response) {
            Flash.create('success', 'Saved');
            $uibModalInstance.dismiss(response.data)

          })
        }

      },
    }).result.then(function() {

    }, function(a) {
      console.log(a);
      if (typeof a == 'object') {
        $scope.form.customer = a
      }


    });
  }

  $scope.customerSeacrh = function() {
    $scope.form.customer = ''
    if ($scope.form.cMobileNumber.length < 10) {
      Flash.create('warning', 'Please Enter Proper Miobile Number')
      return
    }
    $http({
      method: 'GET',
      url: '/api/POS/customer/?mobile__icontains=' + $scope.form.cMobileNumber
    }).
    then(function(response) {
      console.log('resssssssss', response.data);
      if (response.data.length > 0) {
        $scope.form.customer = response.data[0]
      } else {
        $scope.form.customer = ''
        $scope.openInvoiceCustomerForm()
      }
    })
  }


  $scope.connectData = {
    deviceID: '123'
  }
  $scope.connected = false
  // console.log(wampSession,'wamp sessionnnnnnn');
  $scope.connectDevice = function() {
    console.log('connect Deviceeeeeeeeeeeeee');
    if ($scope.connectData.deviceID.length == 0) {
      Flash.create('danger', 'Please Enter Device Id')
      return
    }
    console.log($scope.connectData.deviceID);
    createCookieDevice($scope.connectData.deviceID)

    wampSession.subscribe('service.POS.device.' + $scope.connectData.deviceID, $scope.processScannerNotification).then(
      function(sub) {
        console.log('sssssssssssssss', sub);
        $scope.subId = sub
        console.log("subscribed to 'POS'");
        $scope.connected = true
      },
      function(err) {
        console.log("failed to subscribed: " + err);
      }
    );

  }

  connectedDevice = getCookie("connectedDevice");
  console.log('devvvvvvvvvvvvvvvvvvvvv', connectedDevice);
  if (connectedDevice != "") {
    $scope.connectData.deviceID = connectedDevice
    // $scope.connectDevice()
  }

  setTimeout(function() {
    if ($scope.posPrinter) {
      $scope.connectDevice()
    }
  }, 500);


  $scope.disconnectDevice = function() {
    console.log($scope.subId);
    wampSession.unsubscribe($scope.subId).then(
      function() {
        console.log("unSubscribed to 'POS'");
        $scope.connectData = {
          deviceID: '123'
        }
        $scope.connected = false
      },
      function() {
        console.log("failed to subscribed: " + err);
      }
    );
  }

  $scope.processScannerNotification = function(args) {
    console.log('cameeeeeeeeeeeeeee');
    console.log(args);
    $scope.a = args[0].parent
    console.log($scope.a);

    var url = '/api/POS/storeQty/?product__serialNo=' + $scope.a
    // var url = '/api/POS/product/?search=' + query + '&limit=10'
    if ($rootScope.multiStore) {
      console.log($rootScope.storepk);
      if ($rootScope.storepk > 0) {
        url = url + '&store=' + $rootScope.storepk
      } else {
        Flash.create('warning', 'Please Select Store First')
        return
      }
    } else {
      url = url + '&master=true'
    }
    return $http.get(url).
    then(function(response) {

      var res;
      for (var i = 0; i < response.data.length; i++) {
        res = response.data[i]
        console.log(res);
        if (res.productVariant) {
          // console.log(res.productVariant);
          res.name = res.product.name + ' ' + $filter('convertUnit')(res.productVariant.unitPerpack * res.product.howMuch, res.product.unit)
        } else {
          res.name = res.product.name + ' ' + $filter('convertUnit')(res.product.howMuch, res.product.unit)
        }
      }

      if (response.data.length > 0) {
        if ($scope.wampData.indexOf($scope.a) >= 0) {
          var idx = $scope.wampData.indexOf($scope.a)
        } else {
          $scope.wampData.push($scope.a)
          var idx = -1
        }
        console.log($scope.wampData);
        if ($scope.wampData.length == 1) {
          if (idx >= 0) {
            $scope.form.products[idx].quantity += 1
          } else {
            $scope.form.products = [{
              data: response.data[0],
              quantity: 1
            }]
          }
        } else {
          if (idx >= 0) {
            $scope.form.products[idx].quantity += 1
          } else {
            $scope.form.products.push({
              data: response.data[0],
              quantity: 1
            })
          }
        }
      }

    })

  }

  $scope.addRow = function() {
    if ($scope.form.products.length > 0 && typeof $scope.form.products[$scope.form.products.length - 1].data == "string") {
      Flash.create('danger', 'Please Fill The Current Row')
      return;
    }
    $scope.form.products.push({
      data: "",
      quantity: 1
    });
    console.log($scope.form.products);

  }

  $scope.delete = function(index) {
    $scope.form.products.splice(index, 1);
    $scope.wampData.splice(index, 1)
    $scope.productsPks.splice(index, 1)
    $scope.onDelete = true
  };

  $scope.onDelete = false
  $scope.productsPks = []
  $scope.$watch('form.products', function(newValue, oldValue) {
    if ($scope.onDelete) {
      $scope.onDelete = false
      return
    }
    if (oldValue.length != newValue.length || typeof oldValue[oldValue.length - 1].data == 'string') {
      if (newValue.length == 1) {
        if (typeof newValue[0].data == 'object') {
          $scope.productsPks.push(newValue[0].data.pk)
        }
      }
      if (newValue.length > 1) {
        if (typeof newValue[newValue.length - 1].data == 'object') {
          if ($scope.productsPks.indexOf(newValue[newValue.length - 1].data.pk) >= 0) {
            Flash.create('warning', 'This Product Has Already Added')
            $scope.form.products[newValue.length - 1].data = ''
          } else {
            $scope.productsPks.push(newValue[newValue.length - 1].data.pk)
          }
        }
      }
    }
    console.log('pkssssssssssssssss', $scope.productsPks);

  }, true)

  $scope.orderConfirm = function() {
    console.log($scope.posShowAll, !$scope.posShowAll);
    if ($scope.posPrinter && !$scope.connected) {
      Flash.create('danger', 'Please Connect The Device With Id')
      return
    }
    if ($scope.form.status == 'Created') {
      var status = 'In Progress'
    } else if ($scope.form.status == 'In Progress') {
      var status = 'Completed'
    } else {
      var status = false
    }
    if (status) {
      console.log('patching statusssssss to ', status);
      $http({
        method: 'PATCH',
        url: '/api/POS/invoice/' + $scope.form.pk + '/',
        data: {
          status: status
        }
      }).
      then(function(response) {
        console.log('sssssssssssss', response.data);
        $scope.form.pk = response.data.pk;
        Flash.create('success', 'Updated');
      })
    }

    if ($scope.posPrinter) {
      console.log('print invoice in printer');
      var url = '/api/POS/posInvoicePrinter/?orderId=' + $scope.form.pk
      if ($scope.connected) {
        url += '&deviceId=' + $scope.connectData.deviceID
      }
      $http({
        method: 'GET',
        url: url
      }).then(function(response) {
        console.log(response.data);
      })
    } else {
      window.open('/api/POS/invoicePrint/?invoice=' + $scope.form.pk, '_blank');
    }
  }

  $scope.saveInvoice = function(a) {
    var f = $scope.form;
    if (a == undefined) {
      console.log('allllll');
      if (f.serialNumber.length == 0) {
        Flash.create('warning', 'serialNumber can not be left blank');
        return;
      }
      if (f.customer == null || f.customer.pk == undefined) {
        Flash.create('warning', 'Please select a customer');
        return;
      }
      if ($scope.form.products.length == 0 || $scope.form.products.length == 1 && typeof $scope.form.products[0].data == 'string') {
        Flash.create('danger', 'There is no product to generate invoice for')
        return;
      }
      if (typeof $scope.form.products[$scope.form.products.length - 1].data == "string") {
        Flash.create('danger', 'Please Delete Unwanted Empty Row')
        return;
      }
      var toSend = {
        serialNumber: f.serialNumber,
        invoicedate: f.invoicedate.toJSON().split('T')[0],
        reference: f.reference,
        duedate: f.duedate.toJSON().split('T')[0],
        returnquater: f.returnquater,
        modeOfPayment: f.modeOfPayment,
        products: JSON.stringify(f.products),
        customer: f.customer.pk,
        grandTotal: $scope.subTotal(),
        totalTax: $scope.subTotalTax(),
        amountRecieved: f.amountRecieved,
        paymentRefNum: f.paymentRefNum,
        receivedDate: f.receivedDate.toJSON().split('T')[0],
      }
    } else {
      console.log('samlllllllll');
      if ($scope.form.cMobileRequired && typeof $scope.form.customer != 'object') {
        Flash.create('danger', 'Please Add The Customer Address')
        return;
      }
      if ($rootScope.multiStore) {
        if (typeof $scope.storeForm.name == 'string') {
          Flash.create('danger', 'Please Select The Store')
          return;
        }
      }
      if ($scope.form.products.length == 0 || $scope.form.products.length == 1 && typeof $scope.form.products[0].data == 'string') {
        Flash.create('danger', 'There is no product to generate invoice for')
        return;
      }
      if (typeof $scope.form.products[$scope.form.products.length - 1].data == "string") {
        Flash.create('danger', 'Please Delete Unwanted Empty Row')
        return;
      }
      var toSend = {
        products: JSON.stringify(f.products),
        grandTotal: $scope.subTotal(),
        totalTax: $scope.subTotalTax(),
      }
      if (f.customer != null && typeof f.customer.pk != undefined) {
        toSend.customer = f.customer.pk
      }
    }
    console.log(toSend);
    if ($rootScope.multiStore) {
      toSend.storepk = $rootScope.storepk
    }
    $http({
      method: 'PATCH',
      url: '/api/POS/invoice/' + $scope.form.pk + '/',
      data: toSend
    }).
    then(function(response) {
      console.log('sssssssssssss', response.data);
      Flash.create('success', 'Saved');
    })
  }

})


app.controller('businessManagement.deliveryCenter.orders.online.explore', function($scope, $http, $aside, $state, Flash, $users, $filter, $permissions, $sce, $uibModal, orderDt, $uibModalInstance, viewTyp) {
  $scope.orderData = orderDt
  $scope.viewTyp = viewTyp
  console.log(orderDt, viewTyp);
  console.log(ORDERS_STATUS_LIST);
  $scope.orderStatusList = ORDERS_STATUS_LIST
  $scope.lastStatus = $scope.orderStatusList.slice(-1)[0]
  $scope.succIdx = -1
  for (var i = 0; i < $scope.orderData.orderQtyMap.length; i++) {
    console.log($scope.orderData.orderQtyMap[i].status);
    if ($scope.orderData.orderQtyMap[i].status != 'cancelled') {
      $scope.succIdx = i
    }
  }
  console.log('successss indxxxxxxx', $scope.succIdx);

  function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    console.log(decodedCookie);
    var ca = decodedCookie.split(';');
    console.log(ca);
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
    console.log('set cookie');
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }

  function createCookieDevice(deviceNo) {
    console.log('create cookieeeeeeeee', deviceNo);
    detail = getCookie("orderInvoicePrinterId");
    if (detail != "") {
      console.log('already there');
      document.cookie = encodeURIComponent("orderInvoicePrinterId") + "=deleted; expires=" + new Date(0).toUTCString()
    }
    setCookie("orderInvoicePrinterId", deviceNo, 365);
  }

  $scope.connectData = {
    deviceID: '123'
  }
  orderInvoicePrinterId = getCookie("orderInvoicePrinterId");
  console.log('devvvvvvvvvvvvvvvvvvvvv', orderInvoicePrinterId);
  if (orderInvoicePrinterId != "") {
    $scope.connectData.deviceID = orderInvoicePrinterId
  }
  $scope.connected = false
  $scope.connectDevice = function() {
    console.log('connect Deviceeeeeeeeeeeeee');
    if ($scope.connectData.deviceID.length == 0) {
      Flash.create('danger', 'Please Enter Device Id')
      return
    }
    console.log($scope.connectData.deviceID);
    createCookieDevice($scope.connectData.deviceID)
    $scope.connected = true

  }

  $scope.disconnectDevice = function() {
    $scope.connected = false
  }


  console.log('KKKKKKKKKKKKKKKK', $scope.orderData);
  $scope.order = $scope.orderData
  $scope.expanded = false;
  // $scope.sts = 'aaa'
  $scope.currency = ''
  // $scope.currency = settings_currencySymbol;

  for (var i = 0; i < $scope.orderData.orderQtyMap.length; i++) {
    $scope.orderData.orderQtyMap[i].selected = false;
  }

  $http.get('/api/ERP/appSettings/?app=25&name__iexact=currencySymbol').
  then(function(response) {
    if (response.data[0] != null) {
      $scope.currency = response.data[0].value
    }
  })
  $scope.checkConditions = {
    splitOrder: false,
    thirdParty: false,
    changeStatus: false,
    posPrinting: false,
    showGst: true
  }
  $http.get('/api/ERP/appSettings/?app=25&name__iexact=isStoreGlobal').
  then(function(response) {
    console.log('ratingggggggggggggggggggg', response.data);
    if (response.data[0] != null) {
      if (response.data[0].flag) {
        $scope.checkConditions.showGst = false
      }
    }
  })
  $http.get('/api/ERP/appSettings/?app=25&name__iexact=splitOrderManagement').
  then(function(response) {
    console.log('ratingggggggggggggggggggg', response.data);
    if (response.data[0] != null) {
      if (response.data[0].flag) {
        $scope.checkConditions.splitOrder = true
      }
    }
  })
  $http.get('/api/ERP/appSettings/?app=25&name__iexact=thirdPartyCourier').
  then(function(response) {
    console.log('ratingggggggggggggggggggg', response.data);
    if (response.data[0] != null) {
      if (response.data[0].flag) {
        $scope.checkConditions.thirdParty = true
      }
    }
  })
  $http.get('/api/ERP/appSettings/?app=25&name__iexact=changeOrderStatusManually').
  then(function(response) {
    console.log('ratingggggggggggggggggggg', response.data);
    if (response.data[0] != null) {
      if (response.data[0].flag) {
        $scope.checkConditions.changeStatus = true
      }
    }
  })
  $http.get('/api/ERP/appSettings/?app=25&name__iexact=posPrinting').
  then(function(response) {
    console.log('ratingggggggggggggggggggg', response.data);
    if (response.data[0] != null) {
      if (response.data[0].flag) {
        $scope.checkConditions.posPrinting = true
        $scope.connectDevice()
      }
    }
  })



  $scope.orderItemCancel = function(idx) {
    console.log(idx, $scope.order.orderQtyMap[idx]);
    if (idx == $scope.succIdx) {
      $scope.succIdx = -1
      for (var i = 0; i < $scope.orderData.orderQtyMap.length; i++) {
        if (idx != i && $scope.orderData.orderQtyMap[i].status != 'cancelled') {
          $scope.succIdx = i
        }
      }
    }
    $http({
      method: 'PATCH',
      url: '  /api/ecommerce/orderQtyMap/' + $scope.order.orderQtyMap[idx].pk + '/',
      data: {
        status: 'cancelled'
      }
    }).
    then((function(idx) {
      return function(response) {
        console.log(response.data);
        $scope.order.orderQtyMap[idx].status = response.data.status
        $scope.order.orderQtyMap[idx].refundAmount = response.data.refundAmount
        $scope.order.orderQtyMap[idx].refundStatus = response.data.refundStatus
        var toSend = {
          value: response.data.pk
        };
        $http({
          method: 'POST',
          url: '/api/ecommerce/sendStatus/',
          data: toSend
        }).
        then(function(response) {})
        Flash.create('success', 'Item Has Been Cancelled');
        $scope.saveLog(idx, 'This Item Has Been Cancelled')
      }
    })(idx))
  }
  $scope.orderApproved = function(pk, typ) {
    console.log(pk, typ);
    if (typ) {
      var tosend = {
        approved: true,
        status: 'ordered'
      }
      $scope.msg = 'Order Has Been Approved'
    } else {
      var tosend = {
        approved: false,
        status: 'failed'
      }
      $scope.msg = 'Order Has Been Rejected'
    }
    $http({
      method: 'PATCH',
      url: '/api/ecommerce/order/' + pk + '/',
      data: tosend
    }).
    then(function(response) {
      console.log(response.data);
      Flash.create('success', 'Saved');
      $scope.order.approved = response.data.approved
      for (var i = 0; i < $scope.order.orderQtyMap.length; i++) {
        $scope.saveLog(i, $scope.msg)
      }
    })
  }
  $scope.openManifestFile = function() {
    window.open('/home/cioc/Desktop/libreERP-main/media_root/ecommerce/manifest/example_shipment_label794650.pdf', '_blank');
  }
  $scope.openManifest = function(idx) {
    if (!$scope.checkConditions.thirdParty) {
      console.log('self Manifestttttttttt');
      var td = new Date()
      m = td.getMonth() + 1
      var awbNo = td.getDate().toString() + m.toString() + td.getFullYear().toString().substr(-2) + $scope.order.pk
      console.log(awbNo);
      $http({
        method: 'PATCH',
        url: '  /api/ecommerce/orderQtyMap/' + $scope.order.orderQtyMap[idx].pk + '/',
        data: {
          courierName: 'Self',
          courierAWBNo: awbNo,
          notes: 'Self',
        }
      }).
      then(function(response) {
        console.log(response.data);
        Flash.create('success', 'Saved');
        $scope.order.orderQtyMap[idx] = response.data
      })
    } else {
      $uibModal.open({
        templateUrl: '/static/ngTemplates/app.ecommerce.vendor.orders.manifestForm.html',
        size: 'lg',
        backdrop: true,
        resolve: {
          item: function() {
            return $scope.order.orderQtyMap[idx];
          }
        },
        controller: function($scope, item, $uibModalInstance) {
          $scope.item = item;
          console.log($scope.item);
          $scope.courierForm = {
            courierName: '',
            courierAWBNo: '',
            notes: ''
          }
          if ($scope.item.courierName != null && $scope.item.courierName.length > 0) {
            $scope.courierForm.courierName = $scope.item.courierName
            $scope.courierForm.courierAWBNo = $scope.item.courierAWBNo
            $scope.courierForm.notes = $scope.item.notes
          }
          $scope.saveManifest = function() {
            if ($scope.courierForm.courierName.length == 0 || $scope.courierForm.courierAWBNo.length == 0 || $scope.courierForm.notes.length == 0) {
              Flash.create('warning', 'All Fields Are Required')
              return
            }
            $http({
              method: 'PATCH',
              url: '  /api/ecommerce/orderQtyMap/' + $scope.item.pk + '/',
              data: {
                courierName: $scope.courierForm.courierName,
                courierAWBNo: $scope.courierForm.courierAWBNo,
                notes: $scope.courierForm.notes,
              }
            }).
            then(function(response) {
              console.log(response.data, $scope.item);
              Flash.create('success', 'Saved');
              $uibModalInstance.dismiss(response.data);
            })
          }
        },
      }).result.then(function() {

      }, function(res) {
        console.log('87987987+9797987987979879', res, typeof(res));
        console.log('ssssssssssssss', $scope.order.orderQtyMap[idx]);
        if (typeof(res) != 'string') {
          console.log('saveddddddddddddd');
          if ($scope.order.orderQtyMap[idx].courierName != null && $scope.order.orderQtyMap[idx].courierName.length > 0) {
            $scope.saveLog(idx, 'Manifest Has Been Updated')
          } else {
            $scope.saveLog(idx, 'Manifest Has Been Created')
          }
          $scope.order.orderQtyMap[idx] = res
        }
      });
    }
  }
  $scope.saveLog = function(idx, msg) {
    console.log(idx, $scope.order.orderQtyMap[idx], msg);
    var tosend = {
      logTxt: msg,
      qMapPk: $scope.order.orderQtyMap[idx].pk
    }
    $http({
      method: 'POST',
      url: '/api/ecommerce/trackingLog/',
      data: tosend
    }).
    then((function(idx) {
      return function(response) {
        console.log(response.data);
        $scope.order.orderQtyMap[idx].logText = ''
        $scope.order.orderQtyMap[idx].trackingLog.push(response.data)
      }
    })(idx))
  }
  $scope.changeStatus = function(idx, sts) {
    console.log(idx, sts);
    $http({
      method: 'PATCH',
      url: '  /api/ecommerce/orderQtyMap/' + $scope.order.orderQtyMap[idx].pk + '/',
      data: {
        status: sts
      }
    }).
    then((function(idx, sts) {
      return function(response) {
        console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
        Flash.create('success', 'Status Changed To ' + sts);
        $scope.order.orderQtyMap[idx].status = response.data.status
        // $scope.saveLog(idx, 'This Item Has ' + sts)
        if (sts == 'reachedNearestHub') {
          sts = 'reached To Nearest Hub'
        } else if (sts == 'outForDelivery') {
          sts = 'out For Delivery'
        } else if (sts == 'returnToOrigin') {
          sts = 'return To Origin'
        }
        $scope.saveLog(idx, 'This Item Has Been ' + sts)

        console.log(response.data.status, 'aaaaahhhhh');
        if (response.data.status == 'delivered') {
          console.log("delivered");
          var toSend = {
            value: response.data.pk
          };
          $http({
            method: 'POST',
            url: '/api/ecommerce/sendDeliveredStatus/',
            data: toSend
          }).
          then(function(response) {
            console.log(response.data);
          })
        } else {
          console.log("notdelivered");
          var toSend = {
            value: response.data.pk
          };
          $http({
            method: 'POST',
            url: '/api/ecommerce/sendStatus/',
            data: toSend
          }).
          then(function(response) {})
        }
      }
    })(idx, sts))
  }

  $scope.downloadManifestPrinter = function() {
    if ($scope.checkConditions.posPrinting && !$scope.connected) {
      Flash.create('danger', 'Please Connect The Device With Id')
      return
    }
    console.log('print manifest in printer');
    var url = '/api/ecommerce/downloadManifest/?allData=' + $scope.order.pk
    if ($scope.connected) {
      url += '&printerDeviceId=' + $scope.connectData.deviceID
    }
    $http({
      method: 'GET',
      url: url
    }).then(function(response) {
      console.log(response.data);
    })
  }

  $scope.changeStatusForAll = function(status) {
    console.log(status);
    for (var i = 0; i < $scope.order.orderQtyMap.length; i++) {
      $scope.changeStatus(i, status)
    }
  }
  $scope.openWeightPopup = function(pdList) {

    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.ecommerce.vendor.orders.courierWeight.html',
      size: 'md',
      backdrop: true,
      controller: function($scope, $uibModalInstance) {
        console.log(pdList, 'products Dataaaaaaaaaaaaa');
        totalWeight = 0
        for (var i = 0; i < pdList.length; i++) {
          if (pdList[i].product.product.grossWeight != null && pdList[i].product.product.grossWeight.length > 0) {
            a = parseFloat(pdList[i].product.product.grossWeight)
            pwt = a * pdList[i].qty
            totalWeight += pwt
          }
        }
        $scope.orderForm = {
          weight: totalWeight
        }
        $scope.saveWeight = function() {
          console.log($scope.orderForm.weight);
          if ($scope.orderForm.weight.length == 0) {
            Flash.create('warning', 'Please Mention Order Weight')
            return
          } else {
            $uibModalInstance.dismiss({
              weight: $scope.orderForm.weight
            });
          }
        }
      },
    }).result.then(function() {

    }, function(res) {
      console.log(res);
      if (typeof res == 'object' && res.weight) {
        console.log(res);
        $scope.generateManifestForAll(res.weight)
      }
    });
  }
  $scope.generateManifestForAll = function(orderWeight) {
    console.log($scope.order);
    if (!$scope.checkConditions.thirdParty) {
      console.log('self courierrrrrrrrr');
      var td = new Date()
      m = td.getMonth() + 1
      var awbNo = td.getDate().toString() + m.toString() + td.getFullYear().toString().substr(-2) + $scope.order.pk
      console.log(awbNo);
      for (var i = 0; i < $scope.order.orderQtyMap.length; i++) {
        // if ($scope.order.orderQtyMap[i].selected) {
        $http({
          method: 'PATCH',
          url: '  /api/ecommerce/orderQtyMap/' + $scope.order.orderQtyMap[i].pk + '/',
          data: {
            courierName: 'Self',
            courierAWBNo: awbNo,
            notes: 'Self',
          }
        }).then((function(i) {
          return function(response) {
            $scope.order.orderQtyMap[i].courierName = response.data.courierName
            $scope.order.orderQtyMap[i].courierAWBNo = response.data.courierAWBNo
            console.log(response.data);
            if (i == $scope.order.orderQtyMap.length - 1) {
              Flash.create('success', 'Saved');
            }
          }
        })(i))
        // }
      }
    } else {

      $scope.courierForm = {
        courierName: '',
        courierAWBNo: '',
        notes: ''
      }
      console.log('order Weighttttttttttttt', orderWeight);
      $http({
        method: 'GET',
        url: '/api/ecommerce/createShipment/?country=' + $scope.order.countryCode + '&orderPk=' + $scope.order.pk + '&totalWeight=' + orderWeight
      }).then(function(response) {
        console.log(response.data);
        $scope.courierForm.courierName = response.data.courierName
        $scope.courierForm.courierAWBNo = response.data.trackingID

        for (var i = 0; i < $scope.order.orderQtyMap.length; i++) {
          // if ($scope.order.orderQtyMap[i].selected) {
          if ($scope.courierForm.courierName.length == 0 || $scope.courierForm.courierAWBNo.length == 0) {
            Flash.create('warning', 'All Fields Are Required')
            return
          }
          $http({
            method: 'PATCH',
            url: '  /api/ecommerce/orderQtyMap/' + $scope.order.orderQtyMap[i].pk + '/',
            data: {
              courierName: $scope.courierForm.courierName,
              courierAWBNo: $scope.courierForm.courierAWBNo,
              notes: 'AUTO GENERATED',
            }
          }).then((function(i) {
            return function(response) {
              $scope.order.orderQtyMap[i].courierName = response.data.courierName
              $scope.order.orderQtyMap[i].courierAWBNo = response.data.courierAWBNo
              console.log(response.data);
              if (i == $scope.order.orderQtyMap.length - 1) {
                Flash.create('success', 'Saved');
              }
            }
          })(i))
          // }
        }

      })
    }

    // $http({
    //   method: 'PATCH',
    //   url: '/api/ecommerce/order/' + $scope.order.pk + '/',
    //   data: {
    //     updateInvId: 'Yes',
    //   }
    // }).
    // then(function(response) {
    //   console.log(response.data);
    // })


  }
  $scope.addNewProduct = function(pk) {
    console.log('order pkkkkkkkk', pk);
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.ecommerce.vendor.orders.addNewProduct.html',
      size: 'lg',
      backdrop: true,
      resolve: {
        orderPk: function() {
          return pk;
        }
      },
      controller: function($scope, orderPk, $uibModalInstance) {
        $scope.newForm = {
          product: '',
          qty: 1
        }
        $scope.productSearch = function(val) {
          return $http.get('/api/ecommerce/listing/?product__name__icontains=' + val + '&limit=10').
          then(function(response) {
            return response.data.results;
          })
        }
        $scope.saveNewOrder = function() {
          console.log($scope.newForm);
          var np = $scope.newForm
          if (typeof np.product != 'object') {
            Flash.create('warning', 'Please Select Suggested Product')
            return
          }
          $http({
            method: 'POST',
            url: '  /api/ecommerce/orderQtyMap/',
            data: {
              product: np.product.pk,
              qty: np.qty,
              totalAmount: np.product.product.price,
              prodSku: np.product.product.serialNo,
              discountAmount: 0,
            }
          }).
          then(function(response) {
            console.log(response.data);
            $http({
              method: 'PATCH',
              url: '  /api/ecommerce/order/' + orderPk + '/',
              data: {
                orderQtyMap: response.data.pk,
                addingNewQty: 'Yes',
              }
            }).
            then(function(response) {
              console.log(response.data);
              Flash.create('success', 'Saved');
              $uibModalInstance.dismiss(response.data);
            })
          })

        }
      },
    }).result.then(function() {

    }, function(res) {
      console.log('87987987+9797987987979879', res, typeof(res));
      console.log('ssssssssssssss', $scope.order);
      if (res.pk) {
        console.log('saveddddddddddddd');
        $scope.order = res
      }
    });
  }

});
