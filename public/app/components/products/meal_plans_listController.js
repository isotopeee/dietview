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

            $scope.filter_type_options = [
                {
                    value: 'breakfast',
                    title: 'breakfast'
                },
                {
                    value: 'lunch',
                    title: 'lunch'
                },
                {
                    value: 'dinner',
                    title: 'dinner'
                },
                {
                    value: 'snack',
                    title: 'snack'
                }
            ];

            $scope.filter_status_config = {
                create: false,
                valueField: 'value',
                labelField: 'title',
                placeholder: 'Status...'
            };

            $scope.filterData = {
                status: ["breakfast","lunch","dinner", "snack"]
            };

            $scope.filter_pageSize = ['5', '10', '15'];

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
