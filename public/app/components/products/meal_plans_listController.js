angular
    .module('altairApp')
    .controller('meal_plans_listCtrl', [
        '$scope',
        'modals',
        'meals_data',
        'meal_plans_data',
        'MealPlan',
        'Upload',
        'API',
        function ($scope, modals, meals_data, meal_plans_data, MealPlan, Upload, API) {


            // meal plans data
            $scope.meal_plans_data = meal_plans_data;

            $scope.pageSize = 10;
            $scope.set = [];


            $scope.filter_status_options = [
                {
                    value: '',
                    title: 'All'
                },
                {
                    value: 'in_stock',
                    title: 'In stock'
                },
                {
                    value: 'out_of_stock',
                    title: 'Out of stock'
                },
                {
                    value: 'ships_3_5_days',
                    title: 'Ships in 3-5 days'
                }
            ];

            $scope.filter_status_config = {
                create: false,
                valueField: 'value',
                labelField: 'title',
                placeholder: 'Status...'
            };

            $scope.filterData = {
                status: ["in_stock","out_of_stock","ships_3_5_days"]
            };

            $scope.filter_pageSize = ['5', '10', '15'];
            $scope.filter_status_options = [{
                    value: 'available',
                    title: 'available'
                },
                {
                    value: 'not available',
                    title: 'not available'
                }
            ];

            $scope.filter_status_config = {
                create: false,
                valueField: 'value',
                labelField: 'title',
                placeholder: 'Status...'
            };

            $scope.filterData = {
                status: ["available", "not available"]
            };

            $scope.tempDuration =[];
            $scope.onDurationChange = function(duration){
              $scope.tempDuration = [];
              for(var i=0 ; i <= duration-1 ; i++)
              {
                $scope.tempDuration.push(i);
              }
            };
        }


    ])
;
Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
};
