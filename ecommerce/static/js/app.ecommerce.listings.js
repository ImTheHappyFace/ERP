app.controller('businessManagement.ecommerce.listings.item', function($scope, $http, $aside, $state, Flash, $users, $filter, $permissions, $sce) {
  // $http({method : 'GET' , url : '/api/ecommerce/insight/?mode=operations&listing='+ $scope.data.pk }).
  // then(function(response) {
  //   $scope.insight = response.data;
  // })
});

app.directive('ecommerceListingEditor', function() {
  return {
    templateUrl: '/static/ngTemplates/app.ecommerce.vendor.form.listing.html',
    restrict: 'A',
    replace: true,
    scope: {
      configObj: '@',
    },
    controller: 'ecommerce.form.listing',
  };
});

app.controller('ecommerce.form.listing', function($scope, $state, $stateParams, $http, Flash, $filter,$uibModal) {


  $scope.data = {
    mode: 'select',
    form: {}
  };
  $scope.config = JSON.parse($scope.configObj);

  if (angular.isDefined($scope.config.pk)) {
    $scope.id = $scope.config.pk;
    $scope.editorMode = 'edit';
    console.log('editinggggggggg');
  } else {
    console.log('newwwwwwwwwwww');
    $scope.editorMode = 'new';
    $scope.data.genericProduct = $scope.config.parent;
    for (var i = 0; i < $scope.data.genericProduct.fields.length; i++) {
      if ($scope.data.genericProduct.fields[i].fieldType == 'choice') {
        $scope.data.genericProduct.fields[i].data = JSON.parse($scope.data.genericProduct.fields[i].data)
      }
    }
  }

  // $scope.choiceSearch = function(query , field) {
  //   return $http.get('/api/ecommerce/choiceOption/?name__contains=' + query + '&parent=' + field.parentLabel).
  //   then(function(response){
  //     return response.data;
  //   })
  // }

  $scope.removeMedia = function(index) {
    $http({
      method: 'DELETE',
      url: '/api/ecommerce/media/' + $scope.data.form.files[index].pk + '/'
    }).
    then(function(response) {
      $scope.data.form.files.splice(index, 1);
    })
  }

  $scope.productSearch = function(val) {
    console.log('ssssssssssss', val);
    return $http.get('/api/POS/product/?search=' + val + '&limit=10').
    then(function(response) {
      return response.data.results;
    })
  }

  $scope.genericProductSearch = function(query) {
    return $http.get('/api/ecommerce/genericProduct/?name__contains=' + query).
    then(function(response) {
      return response.data;
    })
  };


  $scope.buildForm = function() {
    $scope.data.mode = 'create'
    console.log('caaaaaaaa', $scope.data);
    console.log($scope.data.genericProduct.fields);
    fields = $scope.data.genericProduct.fields;
    for (var i = 0; i < fields.length; i++) {
      if (fields[i].fieldType == 'boolean') {
        if (fields[i].default == 'true') {
          $scope.data.genericProduct.fields[i].value = true;
        } else {
          $scope.data.genericProduct.fields[i].value = false;
        }
      } else if (fields[i].fieldType == 'float') {
        $scope.data.genericProduct.fields[i].value = parseFloat(fields[i].default);
      } else if (fields[i].fieldType == 'date') {
        $scope.data.genericProduct.fields[i].value = new Date();
      } else if (fields[i].fieldType == 'char') {
        $scope.data.genericProduct.fields[i].value = fields[i].default;
      } else if (fields[i].fieldType == 'choice') {
        $scope.data.genericProduct.fields[i].value = fields[i].default;
      }
      // else if (fields[i].fieldType == 'choice') {
      //   $http({method : 'GET' , url : '/api/ecommerce/choiceLabel/?name=' + fields[i].unit}).
      //   then((function(i){
      //     return function(response){
      //       $scope.data.genericProduct.fields[i].parentLabel = response.data[0].pk;
      //     }
      //   })(i))
      // }
    }
  }

  $scope.offerTagSearch = function(val) {
    return $http.get('/api/ecommerce/offerTag/?name__icontains=' + val ).
    then(function(response) {
      return response.data;
    })
  }




  $scope.resetForm = function() {
    $scope.data.form = {
      mediaType: '',
      files: [],
      file: emptyFile,
      url: '',
      source: '',
      product: '',
      productIndex : '',
      tags:'',
      offertags:[]
    }
  }

  $scope.addTags = function(){
    $scope.data.form.offertags.push($scope.data.form.tags)
    $scope.data.form.tags = ''
  }

  $scope.resetForm()

  $scope.submitListing = function() {
    if ($scope.editorMode == 'edit') {
      post = {
        method: 'PATCH',
        url: '/api/ecommerce/listing/' + $scope.id + '/'
      };
    } else {
      post = {
        method: 'POST',
        url: '/api/ecommerce/listing/'
      };
    }
    form = $scope.data.form;
    console.log(form);
    dataToSend = {}
    for (var i = 0; i < $scope.data.genericProduct.fields.length; i++) {
      f = $scope.data.genericProduct.fields[i];
      dataToSend[f.name] = f.default;
    }

    files = [];
    form.files = $filter('orderBy')(form.files, 'imageIndex');
    for (var i = 0; i < form.files.length; i++) {;
      $http({
        method: 'PATCH',
        url: '/api/ecommerce/media/' + form.files[i].pk + '/',
        data: {
          imageIndex: form.files[i].imageIndex
        }
      }).
      then(function(response) {
        console.log(response.data);
        Flash.create('success', 'Updated');
      })
      files.push(form.files[i].pk);
    }
    if (files.length != 0) {
      dataToSend.files = files;
    }
    // files = [];
    // console.log( form.files,'aaaaaaaaaaa');
    // $scope.files = form.files
    // $scope.files = $filter('orderBy')(form.files, 'imageIndex');


    // for (var i = 0; i < form.files.length; i++) {
    //   for (var j = 0; j < $scope.files.length; j++) {
    //     console.log(i,$scope.files[j].imageIndex);
    //     if(i==$scope.files[j].imageIndex)
    //         var temp = form.files[i].attachment
    //         var y = $scope.files[j].attachment
    //         form.files[i].attachment = y
    //         $scope.files[j].attachment =temp
    //
    //   }
    //
    //   console.log(form.files,'bbbbbbbbbbbbb');
    //
    // }
    //
    // $scope.files = $filter('orderBy')(form.files, 'imageIndex');
    // console.log($scope.files);
    // console.log(form.files);
    //
    // for (var i = 0; i < form.files.length; i++) {
    //   console.log(form.files[i].attachment,'kkkkkkkkkkkkkkkkkk');
    //   form.files[i].attachment = $scope.files[i].attachment
    //   console.log(form.files[i].attachment,'jjjjjjjjjjjjjjjjjjjjjjjjj');
    // }

    // if (files.length != 0) {
    //   dataToSend.files = files;
    // }

    // for (key in form) {
    //   if (key != 'files' && key !='file') {
    //     if (key == 'product') {
    //       dataToSend[key] = form[key].pk;
    //       continue;
    //     }else if (key == 'source') {
    //       dataToSend[key] = form[key]
    //     }
    //     dataToSend[key] = form[key];
    //   }
    // }
    dataToSend.product = form['product'].pk;
    dataToSend.source = form['source'];
    if(form['productIndex']){
      dataToSend.productIndex = form['productIndex']
    }

    console.log('hhhhhhhhhhh', dataToSend);
    specs = [];
    for (var i = 0; i < $scope.data.genericProduct.fields.length; i++) {
      f = $scope.data.genericProduct.fields[i];
      console.log('fffffffffff', f.value);
      if (f.value == undefined | f.value == '') {
        Flash.create('warning', 'please fill ' + f.name);
        return
      }
      toPush = {};
      toPush['name'] = f.name;
      toPush['value'] = f.value;
      toPush['fieldType'] = f.fieldType;
      toPush['unit'] = f.unit;
      toPush['helpText'] = f.helpText;
      toPush['data'] = f.data;
      console.log(toPush);
      specs.push(toPush);
    }
    var tagdData = []

    for (var i = 0; i < $scope.data.form.offertags.length; i++) {
      tagdData.push($scope.data.form.offertags[i].pk)
    }
    if (tagdData.length>0) {
      dataToSend.offertags = tagdData
    }


    dataToSend.specifications = JSON.stringify(specs)
    console.log('sssssssssssssssssssss', specs);
    dataToSend.parentType = $scope.data.genericProduct.pk;
    console.log(dataToSend);
    $http({
      method: post.method,
      url: post.url,
      data: dataToSend
    }).
    then(function(response) {
      console.log('ressssssssssss', response.data);
      if ($scope.editorMode == 'new') {
        console.log('11111');
        $scope.buildForm();
        console.log('2222222');
        $scope.resetForm();
        console.log('3333333');
        // $scope.data.form.files = [];
        // $scope.data.form.file = emptyFile;
        // $scope.resetForm();
        // for (var i = 0; i < $scope.data.genericProduct.fields.length; i++) {
        //   $scope.data.genericProduct.fields[i].default = '';
        // }
      }
      Flash.create('success', response.status + ' : ' + response.statusText);
    }, function(err) {
      Flash.create('danger', err.status + ' : ' + err.statusText);
    })


  }

  $scope.switchMediaMode = function(mode) {
    $scope.data.form.mediaType = mode;
  }

  $scope.postMedia = function() {
    console.log($scope.data.form.file);
    var fd = new FormData();
    fd.append('mediaType', $scope.data.form.mediaType);
    fd.append('link', $scope.data.form.url);

    if (['doc', 'image', 'video'].indexOf($scope.data.form.mediaType) != -1 && $scope.data.form.file != emptyFile) {
      fd.append('attachment', $scope.data.form.file);
    } else if ($scope.data.form.url == '') {
      Flash.create('danger', 'No file to attach');
      return;
    }

    url = '/api/ecommerce/media/';

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
      $scope.data.form.files.push(response.data);
      $scope.data.form.file = emptyFile;
      Flash.create('success', response.status + ' : ' + response.statusText);
    }, function(response) {
      Flash.create('danger', response.status + ' : ' + response.statusText);
    });

  }

  if ($scope.editorMode == 'edit') {
    $http({
      method: 'GET',
      url: '/api/ecommerce/listing/' + $scope.id + '/'
    }).
    then(function(response) {
      console.log(response.data,'dataaaaaaaa');
      for (key in response.data) {
        $scope.data.form[key] = response.data[key];
      }
      if(response.data.specifications){

        $scope.data.specifications = JSON.parse(response.data.specifications)
      }
      else{
        $scope.data.specifications = ''
      }
      $http({
        method: 'GET',
        url: '/api/ecommerce/genericProduct/' + response.data.parentType + '/'
      }).
      then(function(response) {
        gp = response.data;
        specs = $scope.data.specifications;
        console.log(gp);

        for (var i = 0; i < gp.fields.length; i++) {
          if (gp.fields[i].fieldType == 'choice' && typeof gp.fields[i].data == 'string') {
            gp.fields[i].data = JSON.parse(gp.fields[i].data)
          }
        }


        for (var i = 0; i < gp.fields.length; i++) {
          for (var j = 0; j < specs.length; j++) {
            if (gp.fields[i].name == specs[j].name) {
              if (specs[j].fieldType == 'choice' && typeof specs[j].data == 'string') {
                specs[j].data = JSON.parse(specs[j].data)
              }
              gp.fields[i].value = specs[j].value;
              gp.fields[i].data = specs[j].data;
            }
          }
        }

        $scope.data.genericProduct = gp;

      })
    })
  } else {
    $scope.buildForm()
  }

    $scope.openProductmodal = function() {
      $uibModal.open({
        templateUrl: '/static/ngTemplates/app.POS.product.form.html',
        size: 'xxl',
        backdrop: true,
        resolve: {
          product: function() {
              return {};
          },
          newProduct: function() {
              return $scope.data.form.product;
          },
        },
        controller: 'controller.POS.productForm.modal',
      }).result.then(function() {
      }, function(data) {
        $scope.data.form.product = data
      });
    }


  $scope.tinymceOptions = {
    selector: 'textarea',
    content_css: '/static/css/bootstrap.min.css',
    inline: false,
    plugins: 'advlist autolink link image lists charmap preview imagetools paste table insertdatetime code searchreplace ',
    skin: 'lightgray',
    theme: 'modern',
    height: 640,
    toolbar: 'saveBtn publishBtn cancelBtn headerMode bodyMode | undo redo | bullist numlist | alignleft aligncenter alignright alignjustify | outdent  indent blockquote | bold italic underline | image link',
  };

  $scope.$on('removeFiles', function(event, data) {
    console.log('broooooooooooooo', $scope.data, $scope.data.form.files.length);
    for (var i = 0; i < $scope.data.form.files.length; i++) {
      console.log(i);
      $http({
        method: 'DELETE',
        url: '/api/ecommerce/media/' + $scope.data.form.files[i].pk + '/'
      }).
      then(function(response) {
        console.log('deleted');
      })
    }
  })

});

app.controller('businessManagement.ecommerce.listings', function($scope, $rootScope, $http, $aside, $state, Flash, $users, $filter, $permissions, $filter, $timeout, $uibModal) {

  $scope.getConfig = function(mode, data) {
    toReturn = {};
    toReturn[mode] = data
    return JSON.stringify(toReturn)
  }
  $scope.data = {
    mode: 'select',
    tableData: {}
  };

  var options = {
    main: {
      icon: 'fa-pencil',
      text: 'edit'
    },
  };

  views = [{
      name: 'list',
      icon: 'fa-th-large',
      template: '/static/ngTemplates/genericTable/genericSearchList.html',
      itemTemplate: '/static/ngTemplates/app.ecommerce.vendor.listings.item.html',
    },
    {
      name: 'table',
      icon: 'fa-bars',
      template: '/static/ngTemplates/genericTable/tableDefault.html'
    },
  ];



  var listingmultiselectOptions = [{
    icon: 'fa fa-plus',
    text: 'bulkUpload'
  }];


  $scope.config = {
    views: views,
    url: '/api/ecommerce/listingLite/',
    fields: ['pk', 'approved', 'parentType'],
    searchField: 'product__name',
    options: options,
    deletable: true,
    multiselectOptions: listingmultiselectOptions,
    itemsNumPerView: [6, 12, 24],
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

  $scope.tableAction = function(target, action, mode) {
    console.log(target, action, mode);
    if (action == 'bulkUpload') {
      console.log("aaaaaaaaa");
      $scope.openListingBulkForm();
    } else {
      for (var i = 0; i < $scope.data.tableData.length; i++) {
        if ($scope.data.tableData[i].pk == parseInt(target)) {
          if (action == 'edit') {
            var title = 'Edit Listing : ';
            var appType = 'editListing';
          }
          if (action == 'delete') {
            $http({
              method: 'DELETE',
              url: '/api/ecommerce/listingLite/' + $scope.data.tableData[i].pk + '/'
            }).
            then(function(response) {
              Flash.create('success', 'Item Deleted');
            })
            $scope.data.tableData.splice(i, 1)
            return;
          }
          $scope.addTab({
            title: title + $scope.data.tableData[i].pk,
            cancel: true,
            app: appType,
            data: {
              pk: target
            },
            active: true
          })
        }
      }
    }
  }


  $scope.openListingBulkForm = function(idx) {
    console.log("aaaaaaaaaaaagggggggggggggggg");

    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.ecommerce.lisring.bulkForm.html',
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
            url: '/api/ecommerce/bulklistingCreation/',
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

      },
    }).result.then(function() {

    }, function() {

    });


  }



  $scope.genericProductSearch = function(query) {
    return $http.get('/api/ecommerce/genericProduct/?name__contains=' + query).
    then(function(response) {
      return response.data;
    })
  };

  $scope.goBack = function() {
    $rootScope.$broadcast('removeFiles', {});
    // console.log($scope.data);
    $scope.data.mode = 'select';
    $scope.data.genericProduct = ''
  }

});
