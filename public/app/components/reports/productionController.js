(function() {
  'use strict';
  angular
    .module('dietviewApp')
    .controller('productionCtrl', [
      '$scope',
      '$window',
      'production_data',
      'reports',
      function($scope, $window, production_data, reports) {
        $scope.production_list = [];
        var today = new Date();
        var tod = today.getDate();
        $scope.date = { today: today.toLocaleDateString() };

        $scope.exportToPDF = exportToPDF;

        activate();

        ////////////////////////////////////////////////////////////////////////

        function activate() {
          _filterProductionList();
        }

        function exportToPDF() {
          // TODO: Export production list to pdf
          // NOTE: Refer to https://stackoverflow.com/questions/21628378/angularjs-display-blob-pdf-in-an-angular-app
          var shortid = 'SJmGtagEZ';
          var data = {
            subscriptions: $scope.production_list,
            date: $scope.date.today
          };

          reports.exportToPDF(shortid, data).then(function (reportFileUrl) {
              $window.open(reportFileUrl, '_self', '');
          });
        }

        function _filterProductionList() {
          for (var i = 0; i < production_data.length; i++) {
            var startDate = new Date(production_data[i].startDate);
            var endDate = new Date(production_data[i].endDate);
            var start = startDate.getDate();
            if (startDate < today && today < endDate) {
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
