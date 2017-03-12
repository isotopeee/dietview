angular
    .module('altairApp')
    .controller('meal_plans_addCtrl', [
        '$scope',
        'modals',
        'meals_data',
        'meal_plans_data',
        'MealPlan',
        'Upload',
        'API',
        function ($scope, modals, meals_data, meal_plans_data, MealPlan, Upload, API) {

          //$('.dropify').dropify();
          $scope.meal_plans_data = meal_plans_data;
          $scope.options = {
              meals: meals_data,
              status: [
                  'available',
                  'not available'
              ]
          }

          $scope.tempDuration =[];
          $scope.onDurationChange = function(duration){
            $scope.tempDuration = [];
            for(var i=0 ; i <= duration-1 ; i++)
            {
              $scope.tempDuration.push(i);
            }
          };

          $scope.config = {
              meals: {
                  plugins: {
                      'remove_button': {
                          label: ''
                      }
                  },
                  maxItems: null,
                  valueField: 'id',
                  labelField: 'name',
                  searchField: 'name',
                  create: false,
                  render: {
                      option: function(ingredients_data, escape) {
                          return '<div class="option">' +
                              '<span class="title">' + escape(meals_data.name) + '</span>' +
                              '</div>';
                      },
                      item: function(meals_data, escape) {
                          return '<div class="item">' + escape(meals_data.name) + '</div>';
                      }
                  },
                  onItemAdd: function(value, $item) {
                      if ($scope.ingredients.indexOf(value) === -1) {
                          for (var i = 0; i < meals_data.length; i++) {
                              if (meals_data[i].id === value) {
                                  value = meals_data[i];
                                  $scope.meal.mealItems.push(value);
                                  $scope.meal.calories += value.calories;
                              }
                          }
                      }
                  },
                  onItemRemove: function(value) {
                      for (var i = 0; i < $scope.meal.mealItems.length; i++) {
                          if ($scope.meal.mealItems[i].id === value) {
                              value = $scope.meal.mealItems[i];
                              var deleted = $scope.meal.mealItems.splice(i, 1);
                              $scope.meal.calories -= deleted[0].calories;
                          }
                      }
                  }
              }
          };








        }

      ])
  ;
