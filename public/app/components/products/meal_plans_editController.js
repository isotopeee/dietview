(function() {
  'use strict';

  angular
    .module('dietviewApp')
    .controller('meal_plans_editCtrl', [
      '$rootScope',
      '$scope',
      '$stateParams',
      'modals',
      'meals_data',
      'MealPlan',
      'Upload',
      'API',
      'toastr',
      function($rootScope, $scope, $stateParams, modals, meals_data, MealPlan, Upload, API, toastr) {
        $scope.meal_plan = {};
        $scope.duration = 0;
        $scope.meals = [];
        $scope.totalCal = [];
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
          breakfast: breakfast,
          lunch: lunch,
          dinner: dinner,
          snack: snack,
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
        var counter = 0;
        var calArray = [];
        var breakfast = filterMeal(meals_data, 'breakfast');
        var lunch = filterMeal(meals_data, 'lunch');
        var dinner = filterMeal(meals_data, 'dinner');
        var snack = filterMeal(meals_data, 'snack');

        $scope.onDurationChange = onDurationChange;

        $scope.setBreakfast = function($index, mealId) {
          var breakfast = getMeal(mealId);
          $scope.meal_plan.meals[$index].breakfast = breakfast;
          calArray[$index].splice(0, 1, getMealCalories(mealId));
          getITotal($index);
          console.log($scope.meal_plan);
        };

        $scope.setLunch = function($index, mealId) {
          var lunch = getMeal(mealId);
          $scope.meal_plan.meals[$index].lunch = lunch;
          calArray[$index].splice(1, 1, getMealCalories(mealId));
          getITotal($index);
          console.log($scope.meal_plan);
        };

        $scope.setDinner = function($index, mealId) {
          var dinner = getMeal(mealId);
          $scope.meal_plan.meals[$index].dinner = dinner;
          calArray[$index].splice(2, 1, getMealCalories(mealId));
          getITotal($index);
          console.log($scope.meal_plan);
        };

        $scope.setSnack = function($index, mealId) {
          var snack = getMeal(mealId);
          $scope.meal_plan.meals[$index].snack = snack;
          calArray[$index].splice(3, 1, getMealCalories(mealId));
          getITotal($index);
          console.log($scope.meal_plan);
        };

        $scope.update = function($event) {
          update();
        };

        $scope.create = function($event) {
          create();
        };

        $scope.$on('$destroy', function() {
          $rootScope.page_full_height = false;
          $rootScope.headerDoubleHeightActive = false;
        });

        ////////////////////////////////////////////////////////////////////////

        function activate() {
          // populate models data
          MealPlan.findById({
            id: $stateParams.id
          }).$promise.then(function(data) {
            $scope.meal_plan = data;
            $scope.duration = $scope.meal_plan.meals.length;
            for (var i = 0; i < data.meals.length; i++) {
              var dailyMeals = {
                breakfast: data.meals[i].breakfast.id,
                lunch: data.meals[i].lunch.id,
                dinner: data.meals[i].dinner.id
              };
              if (data.meals[i].snack.hasOwnProperty('id')) {
                dailyMeals.snack = data.meals[i].snack.id;
              }
              $scope.meals.push(dailyMeals);
            }
          });

          MealPlan.findById({
            id: $stateParams.id
          }).$promise.then(function(data) {
            console.log(data.meals.length);
            var iMax = data.meals.length;
            var jMax = 5;
            for (i = 0; i < iMax; i++) {
              calArray[i] = [];
              for (j = 0; j < jMax; j++) {
                calArray[i][j] = 0;
              }
            }
            for (var i = 0; i < data.meals.length; i++) {
              calArray[i][0] = data.meals[i].breakfast.calories;
              calArray[i][1] = data.meals[i].lunch.calories;
              calArray[i][2] = data.meals[i].dinner.calories;
              if (data.meals[i].snack.hasOwnProperty('id')) {
                calArray[i][3] = data.meals[i].snack.calories;
              }
              calArray[i][4] = calArray[i][0] + calArray[i][1] + calArray[i][2] + calArray[i][3];
              $scope.totalCal[i] = calArray[i][4];
            }
          });
          console.log(calArray);

          $('.dropify').dropify();
        }

        function getMeal (id) {
          var meal = {};
          for (var i = 0; i < meals_data.length; i++) {
            if (id === meals_data[i].id) {
              meal = {
                id: meals_data[i].id,
                name: meals_data[i].name,
                code: meals_data[i].code,
                description: meals_data[i].description,
                calories: meals_data[i].calories,
                image: meals_data[i].image,
                remarks: meals_data[i].remarks
              };
            }
          }
          return meal;
        }

        function filterMeal (meals_data, filter) {
          var out = [];
          for (var i = 0; i < meals_data.length; i++) {
            if (meals_data[i].type === filter) {
              out.push(meals_data[i]);
            }
          }
          return out;
        }

        function clear_form () {
          $scope.meals = [];
          $scope.meal_plan = {
            feedbacks: [],
            meals: [],
            rating: 0,
            availCount: 0
          };
          $scope.image = undefined;
        }

        function update () {
          if ($scope.image) {
            modals.confirm('Do you want to overwrite the exisiting image?', function() {
              Upload.upload({
                url: API.URL_BASE + 'api/MealPlans/upload',
                data: {
                  file: $scope.image
                }
              }).then(function(response) {
                $scope.meal_plan.image = API.URL_BASE + response.data.path;
                $scope.meal_plan.$save().then(function(data) {
                  UIkit.modal('#modal_edit').hide();
                  toastr.warning(meal_plan.name + " has beed updated.", "Meal Plan Updated");
                });
              });
            });
          } else {
            $scope.meal_plan.$save().then(function(data) {
              UIkit.modal('#modal_edit').hide();
              toastr.warning(meal_plan.name + " has beed updated.", "Meal Plan Updated");
            });
          }

        }

        function create () {
          Upload.upload({
            url: API.URL_BASE + 'api/MealPlans/upload',
            data: {
              file: $scope.image
            }
          }).then(function(response) {
            MealPlan.create({
              meals: $scope.meal_plan.meals,
              feedbacks: $scope.meal_plan.feedbacks,
              code: $scope.meal_plan.code,
              name: $scope.meal_plan.name,
              description: $scope.meal_plan.description,
              averageCalories: $scope.meal_plan.averageCalories,
              type: $scope.meal_plan.type,
              remarks: $scope.meal_plan.remarks,
              image: API.URL_BASE + response.data.path,
              rating: $scope.meal_plan.rating,
              status: $scope.meal_plan.status,
              price: $scope.meal_plan.price
            }).$promise.then(function(data) {
              UIkit.modal('#modal_edit').hide();
              toastr.success(data.name + " has been added to Meal Plans list.", "Meal Plan Added");
              clear_form();
            });
          }, null, function(event) {
            console.log(event);
          });
        }

        function onDurationChange(duration) {
          var iMax = duration;
          var jMax = 5;
          for (i = 0; i < iMax; i++) {
            calArray[i] = [];
            for (j = 0; j < jMax; j++) {
              calArray[i][j] = 0;
            }
          }

          for (var i = 0; i < duration; i++) {
            var dailyMeals = {
              breakfast: {

              },
              lunch: {

              },
              dinner: {

              },
              snack: {

              }
            };
            $scope.meals.push(dailyMeals);
          }
          $scope.meal_plan.meals = [];
          for (j = 0; j < duration; j++) {
            var dailyMeal = {
              breakfast: {

              },
              lunch: {

              },
              dinner: {

              },
              snack: {

              }
            };
            $scope.meal_plan.meals.push(dailyMeal);
          }
        }

        function getMealCalories (id) {
          var calories = 0;
          for (var i = 0; i < meals_data.length; i++) {
            if (id === meals_data[i].id) {
              calories = meals_data[i].calories;
            }
          }
          return calories;
        }

        function getITotal ($index) {
          calArray[$index][4] = 0;
          var totalCal = 0;
          for (var i = 0; i < 4; i++) {
            calArray[$index][4] += calArray[$index][i];
          }
          $scope.totalCal[$index] = calArray[$index][4];
          console.log(calArray[$index][4]);
          for (var j = 0; j < calArray.length; j++) {
            totalCal += calArray[j][4];
          }
          $scope.meal_plan.averageCalories = totalCal / calArray.length;
          console.log($scope.meal_plan.averageCalories);
        }
      }
    ]);
}());
