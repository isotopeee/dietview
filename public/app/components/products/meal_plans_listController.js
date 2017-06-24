(function() {
  'use strict';

  angular
    .module('dietviewApp')
    .controller('meal_plans_listCtrl', [
      '$scope',
      'modals',
      'meals_data',
      'meal_plans_data',
      'MealPlan',
      'Upload',
      'API',
      'toastr',
      function($scope, modals, meals_data, meal_plans_data, MealPlan, Upload, API, toastr) {
        $scope.pageSize = 10;
        $scope.meal_plans_data = meal_plans_data;
        $scope.filter_type_options = [{
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
          status: ["breakfast", "lunch", "dinner", "snack"]
        };
        $scope.filter_pageSize = ['5', '10', '15'];

        var remove = function(meal_plan) {
          modals.confirm('Are you sure you want to delete the meal plan', function() {
            MealPlan.deleteById({
              id: meal_plan.id
            }).$promise.then(function(data) {
              UIkit.modal('#modal_delete').hide();
              var index = $scope.meal_plans_data.findIndex(mp => mp.id === meal_plan.id);
              $scope.meal_plans_data.splice(index, 1);
              toastr.error(meal_plan.name + " has been removed from Meal Plans list.", "Meal Plan Removed");
            });
          });
        };

        $scope.remove = function($event, meal_plan) {
          remove(meal_plan);
        };

      }
    ]);
}());
Array.prototype.contains = function(obj) {
  var i = this.length;
  while (i--) {
    if (this[i] === obj) {
      return true;
    }
  }
  return false;
};
