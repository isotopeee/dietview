(function() {
  'use strict';
  angular
    .module('dietviewApp')
    .controller('productionCtrl', [
      '$scope',
      '$window',
      'production_data',
      'reports',
      'Subscription',
      'User',
      function($scope, $window, production_data, reports, Subscription, User) {
        $scope.production_list = [];
        let currentUser = null;
        var today = new Date();
        var tod = today.getDate();
        $scope.productionDate = today;
        $scope.date = { 
          today: today.toLocaleDateString(),
        };
        $scope.onProcess = false;
        

        $scope.exportToPDF = exportToPDF;
        $scope.generateProductionList = generateProductionList;

        activate();

        ////////////////////////////////////////////////////////////////////////

        function activate() {
          _filterProductionList(today);
          User.getCurrent().$promise.then(({account: {profile: {firstname, lastname}}}) => {
            currentUser = `${firstname} ${lastname}`;
          });
          
        }

        function exportToPDF() {
          // TODO: Export production list to pdf
          // NOTE: Refer to https://stackoverflow.com/questions/21628378/angularjs-display-blob-pdf-in-an-angular-app
          var shortid = 'SJmGtagEZ';
          var data = {
            subscriptions: $scope.production_list,
            date: $scope.productionDate.toLocaleDateString(),
            preparedBy: currentUser
          };

          reports.exportToPDF(shortid, data).then(function (reportFileUrl) {
              $window.open(reportFileUrl, '_self', '');
          });
        }

        function generateProductionList() {
          showProgressbar();
          const filter = {
            where: {
              status: 'active'
            },
            include: ['user', 'mealPlan'],
            order: 'mealPlanId ASC'
          };

          Subscription.find({filter: filter})
            .$promise
            .then(data => {
              production_data = data;
              _filterProductionList($scope.productionDate);
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

        function _filterProductionList(productionDate) {
          $scope.production_list = [];
          for (var i = 0; i < production_data.length; i++) {
            var startDate = new Date(production_data[i].startDate);
            var endDate = new Date(production_data[i].endDate);
            var start = startDate.getDate();
            if (startDate < productionDate && productionDate < endDate) {
              // IDEA: Format Date
              production_data[i].startDate = startDate.toLocaleDateString();
              production_data[i].endDate = endDate.toLocaleDateString();
              $scope.production_list.push(production_data[i]);
            }
          }
        }
      }
    ]);
}());
