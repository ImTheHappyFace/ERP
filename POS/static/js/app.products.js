app.config(function($stateProvider) {

  $stateProvider
    .state('businessManagement.products', {
      url: "/products",
      views: {
        "": {
          templateUrl: '/static/ngTemplates/app.POS.listingv2.html',
          controller: 'businessManagement.listing',
        },
      }
    })
});

app.controller('businessManagement.listing', function($scope, $state, $stateParams, $http, Flash, $filter,$uibModal,$rootScope,$aside) {


  $scope.storeId = STORE_PK
  $scope.openListingBulkForm = function(idx) {


    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.POS.listing.bulkForm.html',
      size: 'md',
      backdrop: true,
      // resolve: {
      //   product: function() {
      //
      //     console.log($scope.products[idx]);
      //     if (idx == undefined || idx == null) {
      //       return {};
      //     } else {
      //       return $scope.products[idx];
      //     }
      //   }
      // },
      controller: function($scope, ) {

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
          console.log($scope.bulkForm.xlFile);
          var fd = new FormData()
          fd.append('xl', $scope.bulkForm.xlFile);
          console.log('*************', fd);
          $http({
            method: 'POST',
            url: '/api/POS/bulkProductsCreation/',
            data: fd,
            transformRequest: angular.identity,
            headers: {
              'Content-Type': undefined
            }
          }).
          then(function(response) {
            Flash.create('success', 'Created');
            $scope.bulkForm.usrCount = response.data.count;
            $scope.bulkForm.success = true;
          })

        }

      },
    }).result.then(function() {

    }, function() {

    });
  }



  $scope.openListingConfigureForm = function(idx) {
    $aside.open({
      templateUrl: '/static/ngTemplates/app.POS.listingConfigureForm.html',
      placement: 'right',
      size: 'xl',
      backdrop: true,
      resolve: {

      },
      controller: function($scope,$uibModalInstance) {
        $scope.data = {
          listingMetatableData: []
        };


        var views = [{
          name: 'list',
          icon: 'fa-th-large',
          template: '/static/ngTemplates/genericTable/tableDefault.html',
          // itemTemplate: '/static/ngTemplates/app.POS.productMeta.item.html',
        }, ];

        var multiselectOptions = [{
          icon: 'fa fa-plus',
          text: 'bulkUpload'
        }, ];

        $scope.configListingMeta = {
          views: views,
          url: '/api/POS/productMeta/',
          searchField: 'code',
          fields: ['code','typ','taxRate','description', ],
          checkbox: false,
          deletable: false,
          canCreate: true,
          multiselectOptions: multiselectOptions,
          editorTemplate: '/static/ngTemplates/app.POS.listingMeta.form.html',
          itemsNumPerView: [16, 32, 48],
        }

        $scope.tableActionListingMeta = function(target, action, data) {
          if (action == 'bulkUpload') {
            $scope.taxCodesUpload();
          } else if (action == 'submitForm') {
            var method = 'PATCH'
            var url = '/api/POS/productMeta/' + data.pk + '/'
            var send = data
            $http({
              method: method,
              url: url,
              data: send,
            }).
            then(function(response) {
              $scope.$broadcast('forceGenericTableRowRefresh', response.data);
              Flash.create('success', response.status + ' : ' + response.statusText);
            }, function(response) {
              Flash.create('danger', response.status + ' : ' + response.statusText);
            })
          } else {
            var method = 'POST'
            var url = '/api/POS/productMeta/'
            var send = data
            $http({
              method: method,
              url: url,
              data: send,
            }).
            then(function(response) {
              $scope.$broadcast('forceInsetTableData', response.data);
              Flash.create('success', response.status + ' : ' + response.statusText);
            }, function(response) {
              Flash.create('danger', response.status + ' : ' + response.statusText);
            })
          }
        }

        $scope.taxCodesUpload = function(idx) {

          $uibModal.open({
            templateUrl: '/static/ngTemplates/app.POS.listingmeta.bulkForm.html',
            size: 'md',
            backdrop: true,
            // resolve: {
            //   product: function() {
            //
            //     console.log($scope.products[idx]);
            //     if (idx == undefined || idx == null) {
            //       return {};
            //     } else {
            //       return $scope.products[idx];
            //     }
            //   }
            // },
            controller: function($scope,$uibModalInstance ) {
              $scope.bulkForm = {
                success : false
              }
              $scope.upload = function() {
                if ($scope.bulkForm.xlFile == emptyFile) {
                  Flash.create('warning', 'No file selected')
                  return
                }
                console.log($scope.bulkForm.xlFile);
                var fd = new FormData()
                fd.append('xl', $scope.bulkForm.xlFile);

                $http({
                  method: 'POST',
                  url: '/api/POS/bulkProductMetaCreation/',
                  data: fd,
                  transformRequest: angular.identity,
                  headers: {
                    'Content-Type': undefined
                  }
                }).
                then(function(response) {
                  Flash.create('success', 'Created');
                  $scope.bulkForm.usrCount = response.data.count;
                  $scope.bulkForm.success = true;
                })

              }


            },
          }).result.then(function() {

          }, function() {

          });


        }

        $scope.tabs = [];
        $scope.searchTabActive = true;

        $scope.closeTab = function(index) {
          $scope.tabs.splice(index, 1)
        }

        $scope.addTab = function(input) {
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

        $scope.close = function(){
            $uibModalInstance.dismiss()
        }

      },
    }).result.then(function() {

    }, function() {

    });
  }
























    $scope.data = {
      tableData: [],
    };


    var views = [{
      name: 'list',
      icon: 'fa-th-large',
      template: '/static/ngTemplates/genericTable/genericSearchList.html',
      itemTemplate: '/static/ngTemplates/app.POS.listingv2.item.html',
    }, ];



      var listingmultiselectOptions = [{
        icon: 'fa fa-wrench',
        text: 'taxCodes'
      }, {
        icon: 'fa fa-plus',
        text: 'bulkUpload'
      }, ];



    $scope.config = {
      views: views,
      url: '/api/POS/productlitesv/',
      filterSearch: true,
      getParams: [{
        key: 'store',
        value: $scope.storeId
      }],
      searchField: 'name',
      itemsNumPerView: [6, 12, 24],
      multiselectOptions: listingmultiselectOptions,
      // getParams: [{
      //   key: 'product',
      //   value: $scope.product.pk
      // }]
    }



    $scope.tableAction = function(target, action, mode) {
      console.log(target, action, mode);
      console.log($scope.data.tableData);
      console.log($scope.tableData);
      if (action == 'new') {
        $scope.openProductForm();
        return
      }else if (action == 'bulkUpload') {
        $scope.openListingBulkForm();
        return
      } else if (action == 'taxCodes') {
        $scope.openListingConfigureForm();
        return
      } else if (action == 'delete') {
        $http({
          method: 'DELETE',
          url: '/api/POS/productsv/' + target + '/'
        }).
        then(function(response) {
          Flash.create('success', 'Deleted');
          $rootScope.$broadcast('forceRefetch', )
        })
        return
      } else {
        for (var i = 0; i < $scope.data.tableData.length; i++) {
          if ($scope.data.tableData[i].pk == parseInt(target)) {
            if (action == 'info') {
              $scope.openProductInfo(i);
              return
            }
          }
        }
      }

      for (var i = 0; i < $scope.data.tableData.length; i++) {
        if ($scope.data.tableData[i].pk == parseInt(target)) {
          if (action == 'edit') {
            var title = 'Listing Details : ';
            var appType = 'editListing';
            $scope.addTab({
              title: title + $scope.data.tableData[i].pk,
              cancel: true,
              app: appType,
              data: {
                pk: target,
                index: i,
                data: $scope.data.tableData[i]
              },
              active: true
            })
          }
          if (action == 'view') {
            $scope.data.tableData[i].open = !$scope.data.tableData[i].open
          }
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


    $scope.offset = 0
    $scope.fetchProd = function(offset) {

      $http({
        method: 'GET',
        url: '/api/POS/productsv/?limit=2&offset=' + offset
      }).then(function(response) {


      })

    }




    // $scope.toggle = function(pk, indx) {
    //   console.log("aaaaaaaaaaaaaa");
    //   // $scope.prodInventories[indx].open = !$scope.prodInventories[indx].open
    //   for (var i = 0; i < $scope.data.tableData.length; i++) {
    //     if ($scope.data.tableData[i].pk == pk) {
    //       $scope.data.tableData[i].open = !$scope.data.tableData[i].open
    //       // $http({
    //       //   method: 'GET',
    //       //   url: '/api/POS/productVariantlitesv/?parent='+$scope.productData[i].pk+'/'
    //       // }).then(function(response) {
    //       //   $scope.productvariantdata = response.data
    //       //   console.log($scope.productvariantdata ,"///////////////////////////////////");
    //       // })
    //     }
    //   }
    // }
    //
    // $scope.next = function() {
    //   $scope.offset = $scope.offset + 4
    //   $scope.fetchProd($scope.offset)
    //   console.log($scope.prodInventories);
    //   if ($scope.prodInventories.length==0) {
    //     $scope.offset = $scope.offset - 4
    //     $scope.fetchProd($scope.offset)
    //   }
    // }
    //
    // $scope.prev = function() {
    //   if ($scope.offset == 0) {
    //     return
    //   }
    //   $scope.offset = $scope.offset - 4
    //   console.log('calling from prev');
    //   $scope.fetchProdInventory($scope.offset)
    // }
    // $scope.createproductModal = function(data) {
    //   console.log(data,'pppppppppppppppppppppppppppppppppppp');
    //   $uibModal.open({
    //     templateUrl: '/static/ngTemplates/app.POS.listingv2.form.html',
    //     size: 'xxl',
    //     backdrop: true,
    //     resolve: {
    //       productData: function() {
    //         return data;
    //       }
    //     },
    //     controller: 'productController',
    //   }).result.then(function() {}, function() {
    //
    //   });
    // }

    // $scope.topButtonsClick = function(action) {
    //   if (action == 'reorderingReport') {
    //     window.open("/api/POS/reorderingReport/", "_blank")
    //     // $scope.openProductForm();
    //   } else if (action == 'stockReport') {
    //     window.open("/api/POS/stockReport/", "_blank")
    //   } else if (action == 'Reorder') {
    //     $state.go('businessManagement.productsInventory.purchaseOrder')
    //   } else if (action == 'New') {
    //     $scope.createproductModal(data=0)
    //   } else if(action== 'bulkUpload'){
    //       $scope.bulkUploadModal()
    //   } else if (action == 'bulkDeduct'){
    //     $scope.bulkDeductModal()
    //   }
    // }



    $scope.saveProdQty = function(pk, quantity) {
      $http({
        method: 'PATCH',
        url: '/api/POS/productVariantsv/' + pk + '/',
        data: {
          stock: quantity
        }
      }).then(function(response) {
        Flash.create('success', 'Saved')
      })
    }
    $scope.deleteProdvar = function (prodPk , dataPk , idx) {

      $http({
        method: 'DELETE',
        url: '/api/POS/productVariantsv/' + dataPk + '/'
      }).then(function(response) {
        $rootScope.$broadcast('forceRefetch' , {});
        // for (var i = 0; i < $scope.productData.length; i++) {
        //   if ($scope.productData[i].pk == prodPk) {
        //     console.log($scope.productData[i]);
        //     $scope.productData[i].variant.splice(idx , 1);
        //     Flash.create('success', 'Deleted')
        //   }
        // }

      })
    }


})

app.controller('productController.form', function($scope, $state, $stateParams, $http, Flash, $filter,$uibModal) {
  $scope.storeId = STORE_PK
  $scope.toggle = function(pk, indx) {
    console.log("aaaaaaaaaaaaaa");
    // $scope.prodInventories[indx].open = !$scope.prodInventories[indx].open
    for (var i = 0; i < $scope.data.tableData.length; i++) {
      if ($scope.data.tableData[i].pk == pk) {
        $scope.data.tableData[i].open = !$scope.data.tableData[i].open
        // $http({
        //   method: 'GET',
        //   url: '/api/POS/productVariantlitesv/?parent='+$scope.productData[i].pk+'/'
        // }).then(function(response) {
        //   $scope.productvariantdata = response.data
        //   console.log($scope.productvariantdata ,"///////////////////////////////////");
        // })
      }
    }
  }

$scope.getProductVarient = function(){

  $http({
    method: 'GET',
    url: '/api/POS/productVariantsv/?parent=' + $scope.product.pk
  }).
  then(function(response) {
    $scope.productVariantData = response.data
  })

}

$scope.deletevariant = function(indx){
  // $scope.productVariant = $scope.productVariantData[indx];
  $http({
    method: 'DELETE',
    url: '/api/POS/productVariantsv/' +$scope.productVariantData[indx].pk+'/'
  }).
  then(function(response) {
    $scope.productVariantData.splice(indx,1)
    Flash.create('danger', 'Deleted');
})
}
  console.log($scope.tab);
  $scope.mode = 'new'
  $scope.formTyp = true

  $scope.switchMediaMode = function(mode) {
    $scope.productVariant.form.mediaType = mode;
  }
  $scope.reset = function(){
    $scope.product = {
      category:'',
      name:'',
      description:'',
      detailedDescription:'',
      productIndex:0,

    }
    $scope.productVariant = {
      sku:'',
      unitType:'Ton',
      price:0.0,
      value:1,
      sellingPrice:0.0,
      maxQtyOrder:10,
      minQtyOrder:5,
      reOrderThreshold:0,
      barcodeId:'',
      shippingCost:0.0,
      stock:0,
      form : {
        mediaType: '',
        files: [],
        file: emptyFile,
        url: '',
        source: '',
        product: '',
        productIndex : ''
      },
      image : emptyFile,
      images:[],
      specialOffer:'',
      productMeta:'',
      deliveryTime:0,
      customizable:false,
      customisedDeliveryTime:0,
      brand:'',
      gstType:'gst_applicable',
    }
      $scope.mode = 'new'
      $scope.productVariantData = []
      $scope.discountArr = [];
  }
  $scope.resetvariant = function(){
    $scope.productVariant = {
      sku:'',
      unitType:'Ton',
      price:0.0,
      value:1,
      sellingPrice:0.0,
      maxQtyOrder:1,
      minQtyOrder:5,
      reOrderThreshold:0,
      barcodeId:'',
      shippingCost:0.0,
      stock:0,
      image : emptyFile,
      form : {
        mediaType: '',
        files: [],
        file: emptyFile,
        url: '',
        source: '',
        product: '',
        productIndex : ''
      },
      images:[],
      specialOffer:'',
      gstType:'gst_applicable',
    }

  }
$scope.reset();

$scope.editvariant = function(indx){
  $scope.resetvariant()
  $scope.productVariant = $scope.productVariantData[indx];
  $scope.productVariant.form = {
    mediaType: '',
    files: [],
    file: emptyFile,
    url: '',
    source: '',
    product: '',
    productIndex : ''
  }
  $scope.productVariantData.splice(indx,1)
}

if ($scope.tab!=undefined) {
  console.log($scope.tab.data.data,'ppppppppppppppppppppppppppppppppp');
    $scope.reset();
    $scope.product = $scope.tab.data.data
    $scope.mode = 'edit'
    $scope.getProductVarient();
    $scope.formTyp = false
}
else{
  $scope.reset();
}

$scope.saveProduct = function(){
  var url = '/api/POS/productsv/';
  var method = 'POST';

  if ($scope.product.pk) {
    var url = url + $scope.product.pk+'/';
    var method = 'PATCH';
  }
  if (typeof $scope.product.category != 'object') {
    Flash.create('warning', 'Category can not be blank');
    return;
  }
  if ($scope.product.name.length == 0) {
    Flash.create('warning', 'Name can not be blank');
    return;
  }
  var dataToSend = {
    category : $scope.product.category.pk,
    name : $scope.product.name,
    store : $scope.storeId,
  }
  if ($scope.product.description.length > 0) {
    dataToSend.description = $scope.product.description
  }

  if ($scope.product.detailedDescription!=undefined && $scope.product.detailedDescription.length > 0) {
    dataToSend.detailedDescription = $scope.product.detailedDescription
  }

  $http({
    method: method,
    url: url,
    data: dataToSend,
  }).
  then(function(response) {
    $scope.product = response.data
    Flash.create('success', 'saved');
  });

}

$scope.fileNameChanged = function(file) {
// console.log("select file",$scope.data.image,file[0]);
var filedata = file[0]
var typ = filedata['type'].split('/')[0]
var fd = new FormData();
if (filedata != null && filedata != emptyFile) {
  fd.append('attachment', filedata)
  fd.append('typ', typ)
}
$http({
  method: 'POST',
  url: '/api/POS/mediasv/',
  data: fd,
  transformRequest: angular.identity,
  headers: {
    'Content-Type': undefined
  }
}).
then(function(response) {
  $scope.productVariant.images.push(response.data)
})
}


$scope.save = function(){

    if ($scope.productVariant.unitType.length == 0) {
      Flash.create('warning', 'Select UnitType');
      return;
    }
    if ($scope.productVariant.value.length == 0) {
      Flash.create('warning', 'Value can not be blank');
      return;
    }
    console.log($scope.productVariant.sellingPrice,'pppppppp');
    if ($scope.productVariant.sellingPrice.length==0) {
      Flash.create('warning', 'SellingPrice cannot be blank');
      return;
    }
    if ($scope.productVariant.gstType == 'gst_extra') {
      if (typeof $scope.productVariant.productMeta !='object' ) {
        Flash.create('warning', 'Tax Code cannot be blank');
        return;
      }

    }
    var url = '/api/POS/productVariantsv/';
    var method = 'POST';
    if ($scope.productVariant.pk) {
      var url = '/api/POS/productVariantsv/'+$scope.productVariant.pk+'/';
      var method = 'PATCH';
    }


    var dataToSend = {
      unitType : $scope.productVariant.unitType,
      value : $scope.productVariant.value,
      price : $scope.productVariant.price,
      sellingPrice : $scope.productVariant.sellingPrice,
      parent : $scope.product.pk,
      customizable : $scope.productVariant.customizable,
    }

    if (typeof $scope.productVariant.productMeta == 'object' && $scope.productVariant.productMeta != null) {
      dataToSend.productMeta = $scope.productVariant.productMeta.pk
    }

      if ($scope.productVariant.sku != null && $scope.productVariant.sku.length>0  ) {
        dataToSend.sku = $scope.productVariant.sku
      }

    if ($scope.productVariant.maxQtyOrder) {
      dataToSend.maxQtyOrder = $scope.productVariant.maxQtyOrder
    }
    if ($scope.productVariant.minQtyOrder) {
      dataToSend.minQtyOrder = $scope.productVariant.minQtyOrder
    }
    if ($scope.productVariant.deliveryTime) {
      dataToSend.deliveryTime = $scope.productVariant.deliveryTime
    }
    if ($scope.productVariant.customisedDeliveryTime) {
      dataToSend.customisedDeliveryTime = $scope.productVariant.customisedDeliveryTime
    }
    if ($scope.productVariant.reOrderThreshold) {
      dataToSend.reOrderThreshold = $scope.productVariant.reOrderThreshold
    }
    if ($scope.productVariant.shippingCost) {
      dataToSend.shippingCost = $scope.productVariant.shippingCost
    }
    if ($scope.productVariant.stock) {
      dataToSend.stock = $scope.productVariant.stock
    }
    if ($scope.productVariant.brand) {
      dataToSend.brand = $scope.productVariant.brand
    }
    if ($scope.productVariant.specialOffer!=undefined && $scope.productVariant.specialOffer!=null && $scope.productVariant.specialOffer.length>0) {
      dataToSend.specialOffer = $scope.productVariant.specialOffer
    }
    if ($scope.productVariant.barcodeId!=undefined && $scope.productVariant.barcodeId!=null &&$scope.productVariant.barcodeId.length>0) {
      dataToSend.barcodeId = $scope.productVariant.barcodeId
    }
    if ($scope.productVariant.images.length > 0) {
      var imageData = []
      for (var i = 0; i < $scope.productVariant.images.length; i++) {
        imageData.push($scope.productVariant.images[i].pk)
      }
      dataToSend.images = imageData
    }

  $http({
    method: method,
    url: url,
    data: dataToSend,
  }).
  then(function(response) {
    $scope.productVariantData.push(response.data);
    $scope.resetvariant();
    Flash.create('success', 'saved');
  });
}

$scope.postMedia = function() {
  console.log($scope.productVariant.form.file);
  var fd = new FormData();
  fd.append('mediaType', $scope.productVariant.form.mediaType);
  fd.append('link', $scope.productVariant.form.url);

  if (['doc', 'image', 'video'].indexOf($scope.productVariant.form.mediaType) != -1 && $scope.productVariant.form.file != emptyFile) {
    fd.append('attachment', $scope.productVariant.form.file);
  } else if ($scope.productVariant.form.url == '') {
    Flash.create('danger', 'No file to attach');
    return;
  }

  url = '/api/POS/mediasv/';

  $http({
    method: 'POST',
    url: url,
    data: fd,
    transformRequest: angular.identity,
    headers: {
      'Content-Type': undefined
    }
  }).
  then(function(response) {
    $scope.productVariant.images.push(response.data);
    $scope.productVariant.form.file = emptyFile;
    Flash.create('success', response.status + ' : ' + response.statusText);
  }, function(response) {
    Flash.create('danger', response.status + ' : ' + response.statusText);
  });

}

$scope.removeMedia = function(index) {
  $http({
    method: 'DELETE',
    url: '/api/POS/mediasv/' + $scope.productVariant.images[index].pk + '/'
  }).
  then(function(response) {
    $scope.productVariant.images.splice(index, 1);
  })
}

$scope.categorySearch = function(query) {
  return $http.get('/api/POS/categorysv/?store='+ $scope.storeId +'&name__contains=' + query).
  then(function(response) {
    return response.data;
  })
};

$scope.openCategory = function(){
  $uibModal.open({
    templateUrl: '/static/ngTemplates/app.category.form.html',
    size: 'lg',
    backdrop: true,
    resolve: {
      category: function() {
        return $scope.product.category
      },
      storeId: function() {
        return   $scope.storeId
      }
    },
    controller: 'businessManagement.listing.category.form'

  }).result.then(function() {
  }, function(data) {
    $scope.product.category = data
  });
}

$scope.searchTaxCode = function(c) {
  return $http.get('/api/POS/productMeta/?code__contains=' + c).
  then(function(response) {
    return response.data;
  })
}



$scope.discount = {
  'product': '',
  'qty': '',
  'discount': ''
}
if ($scope.mode == 'edit') {
$http({
  method: 'GET',
  url: '/api/POS/discountsv/?product=' + $scope.product.pk
}).
then(function(response) {
  $scope.discountArr = response.data;

})
}

$scope.editDiscount = function(pk, ind) {
  $scope.discount.qty = $scope.discountArr[ind].qty
  $scope.discount.discount = $scope.discountArr[ind].discount
  $scope.editproductpk = pk
  $scope.discountArr.splice(ind, 1);
  $scope.methodedit=true
}

$scope.sendDiscount = function() {
var dataTosend = {
  product: $scope.product.pk,
  qty: $scope.discount.qty,
  discount: $scope.discount.discount,
}
if (!$scope.editproductpk) {
var method = "POST"
var url = '/api/POS/discountsv/'
}
if ($scope.methodedit) {
var method = "PATCH"
var url = '/api/POS/discountsv/'+$scope.editproductpk+'/'
}
$http({
  method: method,
  url: url,
  data: dataTosend
}).
then(function(response) {
  Flash.create('success', 'Added')
  $scope.discountArr.push(response.data)
  $scope.discount.qty="";
  $scope.discount.discount="";
})

}

$scope.deleteDiscount = function(pk, ind) {
$http({
  method: 'DELETE',
  url: '/api/POS/discountsv/' + pk + '/'
}).
then((function(ind) {
  return function(response) {
    $scope.discountArr.splice(ind, 1);
    Flash.create('success', 'Deleted');
  }
})(ind))

}

});


app.controller('businessManagement.listing.category.form', function($scope, $state, $stateParams, $http, Flash, $filter,$uibModal, category, $uibModalInstance,storeId) {

$scope.storeId = storeId

$scope.form = {
  parent: '',
  name: '',
  unit: '',
  fields: [],
  minCost: 0,
  categoryIndex: 0,
  restricted:false,
  visual: emptyFile,
  bannerImage:emptyFile,
  mobileBanner:emptyFile,

}

if (typeof category == 'object') {
  $scope.form = category
}
else{
  $scope.form.name = category
}

$scope.parentSearch = function(query) {
  console.log(query);
  return $http.get('/api/POS/categorysv/?name__contains=' + query).
  then(function(response) {
    return response.data;
  })
}


$scope.save = function(){
  var d = $scope.form
  var fd = new FormData();
  fd.append('name', d.name);
  re = /\$|,|@|#|~|`|\%|\*|\^|\&|\(|\)|\+|\=|\[|\-|\_|\]|\[|\}|\{|\;|\:|\'|\"|\<|\>|\?|\||\\|\!|\$| |\./g;
  var alias = d.name.replace(re, '')
  fd.append('alias', alias);
  fd.append('minCost', d.minCost);
  fd.append('restricted', d.restricted);
  fd.append('store', $scope.storeId);
  console.log(d.categoryIndex,"lllllllllllllllllkkkkkkkkkkkkkkkkkk");
  if (d.categoryIndex!= null && d.categoryIndex != undefined) {
    fd.append('categoryIndex', d.categoryIndex);
  }
  if (d.parent != null && d.parent.pk != undefined) {
    fd.append('parent', d.parent.pk);
  }
  if (d.visual != null && typeof d.visual != 'string') {
    fd.append('visual', d.visual);
  }
  if (d.bannerImage != null && typeof d.bannerImage != 'string') {
    fd.append('bannerImage', d.bannerImage);
  }
  if (d.mobileBanner != null && typeof d.mobileBanner != 'string') {
    fd.append('mobileBanner', d.mobileBanner);
  }

  url = '/api/POS/categorysv/';
  console.log(fd);


if ($scope.form.pk ) {
  url += $scope.form.pk + '/';
  method = 'PATCH';
} else {
  method = 'POST';
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
    $uibModalInstance.dismiss(response.data)
  })

}


})
