(function() {
  'use strict';
  angular
    .module('dietviewApp')
    .controller('productionCtrl', [
      '$scope',
      'production_data',
      function($scope, production_data) {
        $scope.production_list = [];
        var today = new Date();
        var tod = today.getDate();
        $scope.date = { today: today.toLocaleDateString() }

        $scope.exportToPDF = exportToPDF;

        ////////////////////////////////////////////////////////////////////////

        function activate() {
          _filterProductionList();
        }

        function exportToPDF() {
          // TODO: Export production list to pdf
          // NOTE: Refer to https://stackoverflow.com/questions/21628378/angularjs-display-blob-pdf-in-an-angular-app
        }

        function _filterProductionList() {
          for (var i = 0; i < production_data.length; i++) {
            var startDate = new Date(production_data[i].startDate);
            var endDate = new Date(production_data[i].endDate);
            var start = startDate.getDate();
            var indexx = tod - start;
            if (startDate < today && today < endDate) {
              var production = {
                breakfast: production_data[i].mealPlan.meals[index].breakfast,
                lunch: production_data[i].mealPlan.meals[index].lunch,
                dinner: production_data[i].mealPlan.meals[index].dinner,
                snack: production_data[i].mealPlan.meals[index].snack
              };
              $scope.production_list.push(production);
            }
            console.log($scope.production_list);
          }
        }
      }
    ]);
}());
