angular
    .module('altairApp')
    .controller('deliveriesCtrl', [
        '$scope',
        'deliveries_data',
        function ($scope, deliveries_data) {

          $scope.deliveries_list = [];

          var today = new Date();
          var tod = today.getDate();
          $scope.date = {
            today: today
          };

          console.log(deliveries_data);

          //filter production
          for(var i = 0 ; i < deliveries_data.length ; i++) {
            if (deliveries_data[i].status === 'active') {
              var startDate = new Date(deliveries_data[i].startDate);
              var endDate = new Date(deliveries_data[i].endDate);
              var start = startDate.getDate();
              if(startDate < today && today < endDate)
              {
                var address = {
                  name: deliveries_data[i].customer.account.profile.firstname + ' ' + deliveries_data[i].customer.account.profile.lastname ,
                  city : deliveries_data[i].customer.account.profile.address.city ,
                  line: deliveries_data[i].customer.account.profile.address.line
                }
                $scope.deliveries_list.push(address);
              }
              console.log($scope.deliveries_list);
            }

          }

            $scope.exportAction = function(){
              $scope.$broadcast('export-pdf', {});

            }
        }
    ]);
