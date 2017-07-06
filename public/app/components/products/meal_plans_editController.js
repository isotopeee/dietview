(function() {
  'use strict';

  angular
    .module('dietviewApp')
    .controller('meal_plans_editCtrl', [
      '$rootScope',
      '$scope',
      '$stateParams',
      'modals',
      'meal_plan_data',
      'meals_data',
      'meal_plan_meals_data',
      'MealPlan',
      'Upload',
      'API',
      'toastr',
      function($rootScope, $scope, $stateParams, modals, meal_plan_data, meals_data, meal_plan_meals_data, MealPlan, Upload, API, toastr) {
        $rootScope.page_full_height = true;
        $rootScope.headerDoubleHeightActive = true;
        $scope.config = {
          meals: {
            plugins: {
              'tooltip': ''
            },
            valueField: 'id',
            labelField: 'name',
            searchField: 'name',
            create: false,
            maxItems: 1,
            placeholder: 'Select Meal..'
          }
        };
        $scope.options = {
          meals: meals_data,
          breakfast: _filterMeal(meals_data, 'breakfast'),
          lunch: _filterMeal(meals_data, 'lunch'),
          dinner: _filterMeal(meals_data, 'dinner'),
          snack: _filterMeal(meals_data, 'snack'),
          status: [
            'available',
            'not available'
          ],
          type: [
            'weight loss',
            'normal',
            'weight gain'
          ]
        };
        $scope.meal_plan = meal_plan_data;
        $scope.meals = [];
        $scope.duration = meal_plan_meals_data.length;

        $scope.onDurationChange = onDurationChange;
        $scope.setBreakfast = setBreakfast;
        $scope.setLunch = setLunch;
        $scope.setDinner = setDinner;
        $scope.setSnack = setSnack;
        $scope.update = update;

        $scope.$on('$destroy', function() {
          $rootScope.page_full_height = false;
          $rootScope.headerDoubleHeightActive = false;
        });

        activate();

        ////////////////////////////////////////////////////////////////////////

        function activate() {
          $('.dropify').dropify();
          // TODO: Populate model data
          onDurationChange(meal_plan_meals_data.length);
          $scope.meals = meal_plan_meals_data;
        }

        function clear_form () {
          $scope.meals = [];
          $scope.meal_plan = {
            rating: 0,
            availCount: 0
          };
        }

        function onDurationChange(duration) {
          $scope.meals = [];
          var dailyMeal = null;
          var i  = 0;

          for (i = 0; i < duration; i++) {
            dailyMeal = {
              breakfast: null,
              lunch: null,
              dinner: null,
              snack: null,
              totalCalories: 0
            };
            $scope.meals.push(dailyMeal);
          }

          $scope.meal_plan.meals = [];

          for (i = 0; i < duration; i++) {
            dailyMeal = {
              breakfast: null,
              lunch: null,
              dinner: null,
              snack: null,
              totalCalories: 0
            };
            $scope.meal_plan.meals.push(dailyMeal);
          }
        }

        function update ($event) {
          var mealPlanMeals = $scope.meal_plan.meals;
          if ($scope.image) {
            modals.confirm('Do you want to overwrite the exisiting image?', function() {
              Upload.upload({
                url: API.URL_BASE + 'api/MealPlans/upload',
                data: {
                  file: $scope.image
                }
              }).then(function(response) {
                $scope.meal_plan.duration = $scope.duration;
                $scope.meal_plan.image = API.URL_BASE + response.data.path;
                $scope.meal_plan.$upsert().then(function(data) {
                  UIkit.modal('#modal_edit').hide();
                  $scope.meal_plan.meals = mealPlanMeals;
                  toastr.warning(data.name + " has beed updated.", "Meal Plan Updated");
                });
              });
            });
          } else {
            $scope.meal_plan.duration = $scope.duration;
            $scope.meal_plan.$upsert().then(function(data) {
              UIkit.modal('#modal_edit').hide();
              $scope.meal_plan.meals = mealPlanMeals;
              toastr.warning(data.name + " has beed updated.", "Meal Plan Updated");
            });
          }
        }

        function setBreakfast($index, mealId) {
          var breakfast = _getMeal(mealId);
          if (breakfast) {
            $scope.meal_plan.meals[$index].breakfast = {
              id: breakfast.id,
              calories: breakfast.calories
            };
          } else {
            $scope.meal_plan.meals[$index].breakfast = null;
          }
          _calculateTotalCalories($index);
          _calculateAverageCalories();
        }

        function setLunch($index, mealId) {
          var lunch = _getMeal(mealId);
          if (lunch) {
            $scope.meal_plan.meals[$index].lunch = {
              id: lunch.id,
              calories: lunch.calories
            };
          } else {
            $scope.meal_plan.meals[$index].lunch = null;
          }
          _calculateTotalCalories($index);
          _calculateAverageCalories();
        }

        function setDinner($index, mealId) {
          var dinner = _getMeal(mealId);
          if (dinner) {
            $scope.meal_plan.meals[$index].dinner = {
              id: dinner.id,
              calories: dinner.calories
            };
          } else {
            $scope.meal_plan.meals[$index].dinner = null;
          }
          _calculateTotalCalories($index);
          _calculateAverageCalories();
        }
        function setSnack($index, mealId) {
          var snack = _getMeal(mealId);
          if (snack) {
            $scope.meal_plan.meals[$index].snack = {
              id: snack.id,
              calories: snack.calories
            };
          } else {
            $scope.meal_plan.meals[$index].snack = null;
          }
          _calculateTotalCalories($index);
          _calculateAverageCalories();
        }

        function _calculateAverageCalories() {
          var totalCalories = 0;

          $scope.meal_plan.meals.forEach(function (dailyMealPlan) {
            totalCalories += dailyMealPlan.totalCalories;
          });

          $scope.meal_plan.averageCalories = totalCalories / $scope.meal_plan.meals.length;
        }

        function _calculateTotalCalories($index) {
          var totalCalories = 0;
          var dailyMealPlan = $scope.meal_plan.meals[$index];

          if (dailyMealPlan.breakfast) {
            totalCalories += dailyMealPlan.breakfast.calories;
          }
          if (dailyMealPlan.lunch) {

            totalCalories += dailyMealPlan.lunch.calories;
          }
          if (dailyMealPlan.dinner) {
            totalCalories += dailyMealPlan.dinner.calories;
          }
          if (dailyMealPlan.snack) {
            totalCalories += dailyMealPlan.snack.calories;
          }

          $scope.meal_plan.meals[$index].totalCalories = totalCalories;
        }

        function _filterMeal (meals_data, filter) {
          var out = [];
          meals_data.forEach(function (meal) {
            if (meal.type === filter) {
              out.push(meal);
            }
          });
          return out;
        }

        function _getMeal (id) {
          var meal = null;
          for (var i = 0; i < meals_data.length; i++) {
            if (id === meals_data[i].id) {
              meal = meals_data[i];
              break;
            }
          }
          return meal;
        }
      }
    ]);
}());
