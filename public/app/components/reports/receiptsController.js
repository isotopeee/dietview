angular
    .module('altairApp')
    .controller('receiptsCtrl', [
        '$scope',
        'production_data' ,
        function ($scope, production_data) {

          $scope.delivery_list = [];

          console.log(production_data);

          var today = new Date();
          var tod = today.getDate();
          $scope.date = {
            today: today
          }

          //filter production
          for(var i = 0 ; i < production_data.length ; i++) {
            if (production_data[i].status === 'active') {
              var startDate = new Date(production_data[i].startDate);
              var endDate = new Date(production_data[i].endDate);
              var start = startDate.getDate();
              var indexx = tod - start;
              if(startDate < today && today < endDate)
              {
                var delivery = {
                  name: production_data[i].customer.account.profile.firstname + ' ' + production_data[i].customer.account.profile.lastname ,
                  city : production_data[i].customer.account.profile.address.city ,
                  line: production_data[i].customer.account.profile.address.line ,
                  breakfast : production_data[i].mealPlan.meals[indexx].breakfast,
                  lunch : production_data[i].mealPlan.meals[indexx].lunch,
                  dinner : production_data[i].mealPlan.meals[indexx].dinner,
                  snack : production_data[i].mealPlan.meals[indexx].snack
                }
                $scope.delivery_list.push(delivery);
              }
              console.log($scope.delivery_list);
            }

          }

            $scope.exportAction = function(){
              $scope.$broadcast('export-pdf', {});

            }

        }
    ]);
