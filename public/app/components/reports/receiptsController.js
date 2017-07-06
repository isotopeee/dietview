(function() {
  'use strict';

  angular
      .module('dietviewApp')
      .controller('receiptsCtrl', [
          '$scope',
          '$window',
          'receipts_data' ,
          'reports',
          function ($scope, $window, receipts_data, reports) {
            $scope.receipts_list = [];
            console.log(receipts_data);
            var today = new Date();
            var tod = today.getDate();
            $scope.date = { today: today.toLocaleDateString() };

            $scope.exportToPDF = exportToPDF;

            activate();

            ///////////////////////////////////////////////////////

            function activate() {
              _filterReceiptsList();
            }

            function exportToPDF() {
              // TODO: Export production list to pdf
              // NOTE: Refer to https://stackoverflow.com/questions/21628378/angularjs-display-blob-pdf-in-an-angular-app
              var shortid = 'rJO970ENb';
              var data = {
                subscriptions: $scope.receipts_list,
              };
              console.log(data);
              reports.exportToPDF(shortid, data).then(function (reportFileUrl) {
                  $window.open(reportFileUrl, '_self', '');
              });
            }

            function _filterReceiptsList() {
              //filter production
              for(var i = 0 ; i < receipts_data.length ; i++) {
                  var startDate = new Date(receipts_data[i].startDate);
                  var endDate = new Date(receipts_data[i].endDate);
                  var start = startDate.getDate();
                  var indexx = tod - start;
                  if(startDate < today && today < endDate)
                  {
                    var receipt = {
                      name: receipts_data[i].user.account.profile.firstname + ' ' + receipts_data[i].user.account.profile.lastname ,
                      city : receipts_data[i].user.account.profile.address.city ,
                      line: receipts_data[i].user.account.profile.address.line ,
                      mealPlan: {
                        name: receipts_data[i].mealPlan.name,
                        price: receipts_data[i].mealPlan.price,
                        startDate: receipts_data[i].subscriptionDate,
                        endDate: receipts_data[i].subscriptionDate
                      }
                    };
                    $scope.receipts_list.push(receipt);
                  }
                  console.log($scope.receipts_list);
              }
            }
          }
      ]);
}());
