app.config(function($stateProvider) {

  $stateProvider
    .state('businessManagement.chat', {
      url: "/chat",
      views: {
        "": {
          templateUrl: '/static/ngTemplates/app.chat.default.html',
          controller: 'businessManagement.chat.default',
        },
      }
    })
});


app.controller("businessManagement.chat.default", function($scope, $http, Flash, $rootScope, $filter, $uibModal) {

  $scope.data = {
    people: [{
        pk: 101,
        name: "hurin",
        message: "Sure 8:pm",
        date: " 02 feb",
        notification_count: "5",
        from: 1,
        to: 2,
        profileImg: "https://engineering.unl.edu/images/staff/Kayla_Person-small.jpg"
      },
      {
        pk: 102,
        name: "hurin",
        message: "main project",
        date: " 02 feb",
        notification_count: "6",
        from: 1,
        to: 2,
        profileImg: "https://www.westernunion.com/content/dam/wu/rmt/233107497_WU.com_LP_US_Hero_Bill_Pay_640x500_1.jpg"
      },
      {
        pk: 103,
        name: "Victor",
        message: "New Project for u",
        date: " 02 feb",
        notification_count: "3",
        from: 1,
        to: 2,
        profileImg: "http://absorbmarketing.com/wp-content/uploads/2015/01/Picture-of-person.png"
      },
      {
        pk: 104,
        name: "Gaiti",
        message: "Yay! its done",
        date: " 02 feb",
        notification_count: "2",
        from: 1,
        to: 2,
        profileImg: "https://img.etimg.com/thumb/msid-72360263,width-643,imgsize-436664,resizemode-4/joaquin-phoenix-recently-appeared-in-petas-we-are-all-animals-billboards-in-times-square-and-on-sunset-billboard-as-he-promoted-legislation-to-ban-travelling-wild-animal-circuses-.jpg"
      },
      {
        pk: 105,
        name: "Chaiti",
        message: "Let's go",
        date: " 02 feb",
        notification_count: "4",
        from: 1,
        to: 2,
        profileImg: "https://qodebrisbane.com/wp-content/uploads/2019/07/This-is-not-a-person-2-1.jpeg"
      },
      {
        pk: 106,
        name: "Johhny",
        message: "meeting around 6",
        date: " 02 feb",
        notification_count: "8",
        from: 1,
        to: 2,
        profileImg: "https://c.wallhere.com/photos/e5/ea/gary_lucy_man_actor_dark_haired_cardigan_person-780009.jpg!d"
      },
      {
        pk: 107,
        name: "Johhny2",
        message: "meeting around 6",
        date: " 02 feb",
        notification_count: "9",
        from: 1,
        to: 2,
        profileImg: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80"
      },
      {
        pk: 107,
        name: "Johhny2",
        message: "meeting around 6",
        date: " 02 feb",
        notification_count: "9",
        from: 1,
        to: 2,
        profileImg: "https://content.fortune.com/wp-content/uploads/2018/07/gettyimages-961697338.jpg"
      },
      {
        pk: 107,
        name: "Johhny2",
        message: "meeting around 6",
        date: " 02 feb",
        notification_count: "9",
        from: 1,
        to: 2,
        profileImg: "https://engineering.unl.edu/images/staff/Kayla_Person-small.jpg"
      },
      {
        pk: 107,
        name: "Johhny2",
        message: "meeting around 6",
        date: " 02 feb",
        notification_count: "9",
        from: 1,
        to: 2,
        profileImg: "https://engineering.unl.edu/images/staff/Kayla_Person-small.jpg"
      },
      {
        pk: 107,
        name: "Johhny2",
        message: "meeting around 6",
        date: " 02 feb",
        notification_count: "9",
        from: 1,
        to: 2,
        profileImg: "https://engineering.unl.edu/images/staff/Kayla_Person-small.jpg"
      },
      {
        pk: 107,
        name: "Johhny2",
        message: "meeting around 6",
        date: " 02 feb",
        notification_count: "9",
        from: 1,
        to: 2,
        profileImg: "https://engineering.unl.edu/images/staff/Kayla_Person-small.jpg"
      },
      {
        pk: 107,
        name: "Johhny2",
        message: "meeting around 6",
        date: " 02 feb",
        notification_count: "9",
        from: 1,
        to: 2,
        profileImg: "https://engineering.unl.edu/images/staff/Kayla_Person-small.jpg"
      },
      {
        pk: 107,
        name: "Johhny2",
        message: "meeting around 6",
        date: " 02 feb",
        notification_count: "9",
        from: 1,
        to: 2,
        profileImg: "https://engineering.unl.edu/images/staff/Kayla_Person-small.jpg"
      },
      
    ]
  }

  $scope.viewby = 9;
  $scope.totalItems = $scope.data.people.length;
  $scope.currentPage = 1;
  $scope.itemsPerPage = $scope.viewby;
  $scope.maxSize = 5; //Number of pager buttons to show

  $scope.setPage = function (pageNo) {
    $scope.currentPage = pageNo;
  };

  $scope.pageChanged = function() {
    console.log('Page changed to: ' + $scope.currentPage);
  };

$scope.setItemsPerPage = function(num) {
  $scope.itemsPerPage = num;
  $scope.currentPage = 1; //reset to first page
}





})
