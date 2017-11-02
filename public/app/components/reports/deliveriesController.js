(function() {
  'use strict';

  angular
    .module('dietviewApp')
    .controller('deliveriesCtrl', [
      '$scope',
      '$window',
      'deliveries_data',
      'reports',
      'Subscription',
      'User',
      function($scope, $window, deliveries_data, reports, Subscription, User) {
        $scope.deliveries_list = [];
        let currentUser = null;
        var today = new Date();
        var tod = today.getDate();
        $scope.deliveryDate = today;
        $scope.date = { 
          today: today.toLocaleDateString()
        };
        $scope.onProcess = false;

        $scope.exportToPDF = exportToPDF;
        $scope.generateDeliveryList = generateDeliveryList;

        activate();

        ////////////////////////////////////////////////////////////////////////

        function activate() {
          _filterDeliveryList(today);
          User.getCurrent().$promise.then(({account: {profile: {firstname, lastname}}}) => {
            currentUser = `${firstname} ${lastname}`;
          });
        }

        function _filterDeliveryList(deliveryDate) {
          $scope.deliveries_list = [];
          for (var i = 0; i < deliveries_data.length; i++) {
            var startDate = new Date(deliveries_data[i].startDate);
            var endDate = new Date(deliveries_data[i].endDate);
            var start = startDate.getDate();
            if (startDate < deliveryDate && deliveryDate < endDate) {
              var address = {
                name: deliveries_data[i].user.account.profile.firstname + ' ' + deliveries_data[i].user.account.profile.lastname,
                city: deliveries_data[i].user.account.profile.address.city,
                line: deliveries_data[i].user.account.profile.address.line
              };
              $scope.deliveries_list.push(address);
            }
          }
        }

        function exportToPDF() {
          // TODO: Export production list to pdf
          // NOTE: Refer to https://stackoverflow.com/questions/21628378/angularjs-display-blob-pdf-in-an-angular-app
          var shortid = 'rJMKTaNEW';
          var data = {
            subscriptions: $scope.deliveries_list,
            date: $scope.deliveryDate.toLocaleDateString(),
            preparedBy: currentUser
          };
          reports.exportToPDF(shortid, data).then(function (reportFileUrl) {
              $window.open(reportFileUrl, '_self', '');
          });
        }

        function generateDeliveryList() {
          showProgressbar();

          const filter = {
            where: {
              status: 'active'
            },
            include: ['user', 'mealPlan'],
            order: 'mealPlanId ASC'
          };

          Subscription.find({filter:filter}).$promise
          .then(function(data) {
            deliveries_data = data;
            _filterDeliveryList($scope.deliveryDate);
            hideProgressbar();
          });
        }

        function showProgressbar(){
          $scope.onProcess = true;
        }

        function hideProgressbar(){
          $scope.onProcess = false;
        }

        function toggleProgressbar(){
          $scope.onProcess = !$scope.onProcess;
        }
      }
    ]);
}());
