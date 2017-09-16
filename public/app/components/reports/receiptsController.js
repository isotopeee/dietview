(function() {
  'use strict';

  angular
      .module('dietviewApp')
      .controller('receiptsCtrl', [
          '$scope',
          '$window',
          'receipts_data' ,
          'reports',
          'Subscription',
          function ($scope, $window, receipts_data, reports, Subscription) {
            $scope.receipts_list = [];
            var today = new Date();
            var tod = today.getDate();
            $scope.receiptsDate = today;
            $scope.date = { 
              today: today.toLocaleDateString() 
            };
            $scope.onProcess = false;

            $scope.exportToPDF = exportToPDF;
            $scope.generateReceiptsList = generateReceiptsList;

            activate();

            ///////////////////////////////////////////////////////

            function activate() {
              _filterReceiptsList(today);
            }

            function exportToPDF() {
              // TODO: Export production list to pdf
              // NOTE: Refer to https://stackoverflow.com/questions/21628378/angularjs-display-blob-pdf-in-an-angular-app
              var shortid = 'rJO970ENb';
              var data = {
                subscriptions: $scope.receipts_list,
                date: $scope.receiptsDate.toLocaleDateString()
              };
              console.log(data);
              reports.exportToPDF(shortid, data).then(function (reportFileUrl) {
                  $window.open(reportFileUrl, '_self', '');
              });
            }

            function generateReceiptsList() {
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
                receipts_data = data;
                _filterReceiptsList($scope.receiptsDate);
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

            function _filterReceiptsList(receiptsDate) {
              $scope.receipts_list = [];
              for(var i = 0 ; i < receipts_data.length ; i++) {
                  var startDate = new Date(receipts_data[i].startDate);
                  var endDate = new Date(receipts_data[i].endDate);
                  var start = startDate.getDate();
                  var indexx = tod - start;
                  if(startDate < receiptsDate && receiptsDate < endDate)
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
              }
            }
          }
      ]);
}());
