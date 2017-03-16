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

            $scope.pageSize = 10;

            // meal plans data
            $scope.meal_plans_data = meal_plans_data;

            $scope.filter_type_options = [
                {
                    value: 'weight loss',
                    title: 'weight loss'
                },
                {
                    value: 'normal',
                    title: 'normal'
                },
                {
                    value: 'weight gain',
                    title: 'weight gain'
                }
            ];

            $scope.filter_type_config = {
                create: false,
                valueField: 'value',
                labelField: 'title',
                placeholder: 'Type...'
            };

            $scope.filterData = {
                status: ["breakfast","lunch","dinner", "snack"]
            };

            $scope.filter_pageSize = ['5', '10', '15'];

            var remove = function(index, id) {
                console.log(id);
                modals.confirm('Are you sure you want to delete the meal plan', function() {
                    MealPlan.deleteById({
                        id: id
                    }).$promise.then(function(data) {
                        modals.alert('Meal Plan has been deleted');
                        $scope.meal_plans_data.splice(index, 1);
                    });
                });
            };

            $scope.remove = function($event, $index, meal_plan) {
                remove($index, meal_plan.id);
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
