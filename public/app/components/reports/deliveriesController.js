(function() {
  'use strict';

  angular
    .module('dietviewApp')
    .controller('deliveriesCtrl', [
      '$scope',
      '$window',
      'deliveries_data',
      'reports',
      function($scope, $window, deliveries_data, reports) {
        $scope.deliveries_list = [];
        var today = new Date();
        var tod = today.getDate();
        $scope.date = {today: today.toLocaleDateString()};

        $scope.exportToPDF = exportToPDF;

        activate();

        ////////////////////////////////////////////////////////////////////////

        function activate() {
          _filterDeliveryList();
        }

        function _filterDeliveryList() {
          console.log(deliveries_data);
          for (var i = 0; i < deliveries_data.length; i++) {
            var startDate = new Date(deliveries_data[i].startDate);
            var endDate = new Date(deliveries_data[i].endDate);
            var start = startDate.getDate();
            if (startDate < today && today < endDate) {
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
            date: $scope.date.today
          };
          reports.exportToPDF(shortid, data).then(function (reportFileUrl) {
              $window.open(reportFileUrl, '_self', '');
          });
        }
      }
    ]);
}());
