// app.controller('businessManagement.ecommerce.orders.item' , function($scope , $http , $aside , $state, Flash , $users , $filter , $permissions , $sce){
//   $scope.bookingTime = function() {
//     return Math.ceil((new Date($scope.data.end)- new Date($scope.data.start))/3600000);
//   }
//   $scope.getBookingAmount = function(){
//     h = $scope.bookingTime()
//     if (h<0){
//       return 0
//     }else {
//       return $scope.data.rate * $scope.data.quantity*h
//     }
//   }
//   $scope.$watch('data.offer' , function(newValue , oldValue){
//     if (typeof $scope.data.offer != 'number') {
//       return;
//     }
//     $http({method : 'GET' , url : '/api/ecommerce/offering/' + $scope.data.offer + '/'}).
//     then(function (response) {
//       $scope.data.offer = response.data;
//       $http({method : 'GET' , url : '/api/ecommerce/listing/' + response.data.item + '/' }).
//       then(function (response) {
//         $scope.data.item = response.data;
//       })
//     })
//   });
//   $scope.getStatusClass = function(input) {
//     if (input == 'inProgress') {
//       return 'fa-spin fa-spinner';
//     }else if (input == 'complete') {
//       return 'fa-check';
//     }else if (input == 'canceledByVendor') {
//       return 'fa-ban';
//     }else if (input == 'new') {
//       return 'fa-file'
//     }
//   }
//
// });
//
// app.controller('businessManagement.ecommerce.orders' , function($scope , $http , $aside , $state, Flash , $users , $filter , $permissions , $sce){
//
//   $scope.data = {tableData : []}
//
//   views = [{name : 'list' , icon : 'fa-bars' ,
//     template : '/static/ngTemplates/genericTable/genericSearchList.html' ,
//     itemTemplate : '/static/ngTemplates/app.ecommerce.vendor.orders.item.html',
//   },];
//   var getParams = [{key : 'mode' , value : 'provider'}]
//
//   var options = {main : {icon : 'fa-print', text: 'print invoice'} ,
//     others : [
//       {icon : 'fa-check' , text : 'markComplete' },
//       {icon : '' , text : 'cancel' },
//       // {icon : '' , text : 'sendMessage' },
//       // {icon : '' , text : 'printAgreement' },
//     ]
//   };
//
//   $scope.config = {
//     views : views,
//     getParams : getParams,
//     url : '/api/ecommerce/order/',
//     options : options,
//     searchField : 'id',
//     fields : ['user' , 'created' , 'rate' , 'status' , 'paymentType' , 'paid' , 'quantity' , 'start' , 'end']
//   }
//
//   $scope.tabs = [];
//   $scope.searchTabActive = true;
//
//   $scope.closeTab = function(index){
//     $scope.tabs.splice(index , 1)
//   }
//
//   $scope.addTab = function( input ){
//     $scope.searchTabActive = false;
//     alreadyOpen = false;
//     for (var i = 0; i < $scope.tabs.length; i++) {
//       if ($scope.tabs[i].data.pk == input.data.pk && $scope.tabs[i].app == input.app) {
//         $scope.tabs[i].active = true;
//         alreadyOpen = true;
//       }else{
//         $scope.tabs[i].active = false;
//       }
//     }
//     if (!alreadyOpen) {
//       $scope.tabs.push(input)
//     }
//   }
//
//   $scope.tableAction = function(target , action , mode){
//     for (var i = 0; i < $scope.data.tableData.length; i++) {
//       if ($scope.data.tableData[i].id == parseInt(target)){
//         index = i;
//         break;
//       }
//     }
//     // index is the index of the object in the table in the view and target is either the id or Pk of the object
//     if (action == 'printInvoice') {
//       $http.get('/api/ecommerce/printInvoice/?id=' + target ,'', {responseType:'arraybuffer'}).
//       success((function(target){
//         return function(response){
//           var file = new Blob([response], { type: 'application/pdf' });
//           var fileURL = URL.createObjectURL(file);
//           content = $sce.trustAsResourceUrl(fileURL);
//           $scope.addTab({title : 'Print Invocie for order ID : '+ target , cancel : true , app : 'print invoice' , data : {pk : target , content : content} , active : true})
//           }
//         })(target)
//       )
//     } else {
//       if (action == 'complete') {
//         status = 'complete';
//       } else if (action == 'reject') {
//         status = 'canceledByVendor';
//       } else if (action == 'progress') {
//         status = 'inProgress';
//       }
//       $http({method : 'PATCH' , url : '/api/ecommerce/order/'+target+'/?mode=provider', data : {status : status}}).
//       then((function(target){
//         console.log(target);
//         console.log($scope.data.tableData);
//         return function (response) {
//           for (var i = 0; i < $scope.data.tableData.length; i++) {
//             if ($scope.data.tableData[i].id == target) {
//               $scope.data.tableData[i].status = response.data.status;
//             }
//           }
//         }
//       })(target));
//     }
//   }
//
//
//
//
// });









app.controller('businessManagement.ecommerce.orders.explore', function($scope, $http, $aside, $state, Flash, $users, $filter, $permissions, $sce, $uibModal) {

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
  $scope.connected = true
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

  console.log('KKKKKKKKKKKKKKKK', $scope.tab.data.order);
  $scope.order = $scope.tab.data.order
  $scope.expanded = false;
  // $scope.sts = 'aaa'
  $scope.currency = ''
  // $scope.currency = settings_currencySymbol;
  console.log(ORDERS_STATUS_LIST);
  $scope.orderStatusList = ORDERS_STATUS_LIST
  $scope.lastStatus = $scope.orderStatusList.slice(-1)[0]
  $scope.succIdx = -1
  for (var i = 0; i < $scope.tab.data.order.orderQtyMap.length; i++) {
    if ($scope.tab.data.order.orderQtyMap[i].status != 'cancelled') {
      $scope.succIdx = i
    }
  }

  for (var i = 0; i < $scope.tab.data.order.orderQtyMap.length; i++) {
    $scope.tab.data.order.orderQtyMap[i].selected = false;
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
      }
    }
  })

  $scope.orderItemCancel = function(idx) {
    console.log(idx, $scope.order.orderQtyMap[idx]);
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
        // var toSend = {value : response.data.pk};
        // $http({method : 'POST' , url : '/api/ecommerce/sendStatus/' , data : toSend}).
        // then(function(response) {
        // })

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

  // $scope.selectAll = {
  //   toWatch:false
  // }
  // $scope.$watch('selectAll.toWatch',function (newValue, oldValue) {
  //   if (newValue !=undefined && newValue!=null) {
  //     if (newValue) {
  //       for (var i = 0; i < $scope.tab.data.order.orderQtyMap.length; i++) {
  //         $scope.tab.data.order.orderQtyMap[i].selected = true;
  //       }
  //     }else {
  //       for (var i = 0; i < $scope.tab.data.order.orderQtyMap.length; i++) {
  //         $scope.tab.data.order.orderQtyMap[i].selected = false;
  //       }
  //     }
  //   }
  // })

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
    for (var i = 0; i < $scope.order.orderQtyMap.length; i++) {
      $scope.changeStatus(i, status)
    }
  }
  $scope.resetManifest = function() {
    console.log('resettinggggggggggggg');
    for (var i = 0; i < $scope.order.orderQtyMap.length; i++) {
      $http({
        method: 'PATCH',
        url: '  /api/ecommerce/orderQtyMap/' + $scope.order.orderQtyMap[i].pk + '/',
        data: {
          courierName: null,
          courierAWBNo: null,
          notes: null,
        }
      }).then((function(i) {
        return function(response) {
          $scope.order.orderQtyMap[i].courierName = response.data.courierName
          $scope.order.orderQtyMap[i].courierAWBNo = response.data.courierAWBNo
          if (i == $scope.order.orderQtyMap.length - 1) {
            Flash.create('success', 'Reset Successfully');
          }
        }
      })(i))
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

        // for (var i = 0; i < $scope.order.orderQtyMap.length; i++) {
        //   if ($scope.order.orderQtyMap[i].selected) {
        //     $scope.order.orderQtyMap[i].courierName = response.data.courierName
        //     $scope.order.orderQtyMap[i].courierAWBNo = response.data.courierAWBNo
        //   }
        // }
        // $scope.selectAll.toWatch = false

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


    // $uibModal.open({
    //   templateUrl: '/static/ngTemplates/app.ecommerce.vendor.orders.manifestForm.html',
    //   size: 'lg',
    //   backdrop: true,
    //   resolve: {
    //     items: function() {
    //       return $scope.items;
    //     },
    //     order: function() {
    //       return $scope.order;
    //     }
    //   },
    //   controller: function($scope, items ,order, $uibModalInstance) {
    //     $scope.items = items;
    //     $scope.courierForm = {courierName:'',courierAWBNo:'',notes:''}
    //
    //     $http({
    //       method:'GET',
    //       url:'/api/ecommerce/createShipment/?country=US&city='+order.city+'&pincode='+order.pincode+'&state='+order.state +'/'
    //     }).then(function (response) {
    //       console.log(response.data);
    //       $scope.courierForm.courierName = response.data.courierName
    //       $scope.courierForm.courierAWBNo = response.data.trackingID
    //     })
    //
    //
    //
    //     $scope.saveManifest = function(){
    //       for (var i = 0; i < $scope.items.length; i++) {
    //           if ($scope.courierForm.courierName.length==0||$scope.courierForm.courierAWBNo.length==0) {
    //             Flash.create('warning','All Fields Are Required')
    //             return
    //           }
    //           $http({
    //             method: 'PATCH',
    //             url: '  /api/ecommerce/orderQtyMap/' + $scope.items[i].pk + '/',
    //             data: {
    //               courierName: $scope.courierForm.courierName,
    //               courierAWBNo: $scope.courierForm.courierAWBNo,
    //               notes: $scope.courierForm.notes,
    //             }
    //           }).
    //           then(function(response) {
    //             console.log(response.data,$scope.item);
    //             Flash.create('success', 'Saved');
    //             $uibModalInstance.dismiss(response.data);
    //           })
    //       }
    //     }
    //   },
    // }).result.then(function() {
    //
    // }, function(res) {
    //   if (res !='Backdrop Clicked') {
    //     console.log(res);
    //     $scope.tab.data.order.orderQtyMap
    //     for (var i = 0; i < $scope.order.orderQtyMap.length; i++) {
    //       console.log($scope.order.orderQtyMap[i]);
    //       if ($scope.order.orderQtyMap[i].selected) {
    //         $scope.order.orderQtyMap[i].courierName = res.courierName
    //         $scope.order.orderQtyMap[i].courierAWBNo = res.courierAWBNo
    //       }
    //     }
    //     $scope.selectAll.toWatch = false
    //   }
    // });
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
        $scope.isStoreGlobal = false;
        $http.get('/api/ERP/appSettings/?app=25&name__iexact=isStoreGlobal').
        then(function(response) {
          if (response.data[0] != null) {
            $scope.isStoreGlobal = response.data[0].value
          }
        })
        // alert($scope.isStoreGlobal)
        console.log($scope.newForm);
        $scope.saveNewOrder = function() {
          console.log($scope.newForm);
          var np = $scope.newForm
          if (typeof np.product != 'object') {
            Flash.create('warning', 'Please Select Suggested Product')
            return
          }
          var totalAmnt;
          if (!$scope.isStoreGlobal) {
            totalAmnt = np.product.product.price + np.product.product_taxAmount
          } else {
            totalAmnt = np.product.product.price
          }

          $http({
            method: 'POST',
            url: '  /api/ecommerce/orderQtyMap/',
            data: {
              product: np.product.pk,
              qty: np.qty,
              totalAmount: totalAmnt,
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
console.log($scope.order,"%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%5555");

  $scope.isStoreGlobal = false;
  $http.get('/api/ERP/appSettings/?app=25&name__iexact=isStoreGlobal').
  then(function(response) {
    if (response.data[0] != null) {
      $scope.isStoreGlobal = response.data[0].flag
    }
  })

  $scope.details = {
    Address:'',
    Company:'',
    GST:'',
    agree:'',
    designation:'',
    email:'',
    emailOTP:'',
    firstName:'',
    lastName:'',
    mobile:'',
    mobileOTP:'',
    password:'',
    pincode:'',
    rePassword:'',
    reg:'',
    statecode:'',
    token:''
  }
  $scope.updateProfile=false
  $scope.updateData = function(){
    $scope.updateProfile=true
    $http({
      method: 'GET',
      url: '/api/HR/userSearch/'+$scope.order.user+'/',
    }).
    then(function(response) {
      $scope.profileData = response.data.profile
      $scope.detailsUser = response.data.profile.details
      if($scope.detailsUser){
        valid = $scope.detailsUser.replace(/u'/g, "'")
        valid =  valid.replace(/'/g,'"')
        valid =  valid.replace(/True/g,'true')
        valid =  valid.replace(/None/g,'""')
        $scope.details = JSON.parse(valid)
      }
    })
    }

  $scope.updateDetails=function(){
    console.log($scope.details);
    $http({
      method: 'PATCH',
      url: '/api/HR/profile/'+$scope.profileData.pk+'/',
      data : {
        details:$scope.details,
      }
    }).
    then(function(response) {
      Flash.create('success','Saved!')
      $scope.updateProfile=false
    })
  }

});

app.controller('businessManagement.ecommerce.orders', function($scope, $http, $aside, $state, Flash, $users, $filter, $permissions, $sce) {

  $scope.data = {
    tableData: []
  }

  var views = [{
    name: 'list',
    icon: 'fa-th-large',
    template: '/static/ngTemplates/genericTable/genericSearchList.html',
    itemTemplate: '/static/ngTemplates/app.ecommerce.vendor.orders.item.html',
  }, ];


  $scope.config = {
    views: views,
    url: '/api/ecommerce/order/',
    searchField: 'id',
    deletable: true,
    itemsNumPerView: [12, 24, 48],
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




});

app.controller('businessManagement.ecommerce.orders.item', function($scope, $http, $aside, $state, Flash, $users, $filter) {
  $scope.currency = ""
  $http.get('/api/ERP/appSettings/?app=25&name__iexact=currencySymbol').
  then(function(response) {
    if (response.data[0] != null) {
      $scope.currency = response.data[0].value
    }
  })

})
