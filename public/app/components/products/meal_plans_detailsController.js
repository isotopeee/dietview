(function() {
  'use strict';

  angular
    .module('dietviewApp')
    .controller('meal_plans_detailsCtrl', [
      '$rootScope',
      '$scope',
      '$stateParams',
      'modals',
      'meals_data',
      'MealPlan',
      'Upload',
      'API',
      function($rootScope, $scope, $stateParams, modals, meals_data, MealPlan, Upload, API) {
        $scope.meal_plan = {};
        $scope.duration = 0;
        $scope.meals = [];
        console.log($scope.image);

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

        console.log($scope.meals);

        $rootScope.page_full_height = true;
        $rootScope.headerDoubleHeightActive = true;

        $scope.$on('$destroy', function() {
          $rootScope.page_full_height = false;
          $rootScope.headerDoubleHeightActive = false;
        });

        $('.dropify').dropify();

        var getMeal = function(id) {
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
        };

        var filterMeal = function(meals_data, filter) {
          var out = [];
          for (var i = 0; i < meals_data.length; i++) {
            if (meals_data[i].type === filter) {
              out.push(meals_data[i]);
            }
          }
          return out;
        };

        var breakfast = filterMeal(meals_data, 'breakfast');
        var lunch = filterMeal(meals_data, 'lunch');
        var dinner = filterMeal(meals_data, 'dinner');
        var snack = filterMeal(meals_data, 'snack');

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

        var clear_form = function() {
          $scope.meals = [];
          $scope.meal_plan = {
            feedbacks: [],
            meals: [],
            rating: 0,
            availCount: 0
          };
          $scope.image = undefined;
        };

        var update = function() {
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
                  modals.alert('Changes made has been saved');
                });
              });
            });
          } else {
            $scope.meal_plan.$save().then(function(data) {
              modals.alert('Changes made has been saved');
            });
          }

        };

        var create = function() {
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
              modals.alert('Meal Plan Added');
              clear_form();
            });
          }, null, function(event) {
            console.log(event);
          });
        };

        $scope.onDurationChange = function(duration) {
          $scope.meals = [];
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
          for (var j = 0; j < duration; i++) {
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
        };

        $scope.setBreakfast = function($index, mealId) {
          var breakfast = getMeal(mealId);
          $scope.meal_plan.meals[$index].breakfast = breakfast;
          console.log($scope.meal_plan);
        };

        $scope.setLunch = function($index, mealId) {
          var lunch = getMeal(mealId);
          $scope.meal_plan.meals[$index].lunch = lunch;
          console.log($scope.meal_plan);
        };

        $scope.setDinner = function($index, mealId) {
          var dinner = getMeal(mealId);
          $scope.meal_plan.meals[$index].dinner = dinner;
          console.log($scope.meal_plan);
        };

        $scope.setSnack = function($index, mealId) {
          var snack = getMeal(mealId);
          $scope.meal_plan.meals[$index].snack = snack;
          console.log($scope.meal_plan);
        };

        $scope.update = function($event) {
          update();
        };

        $scope.create = function($event) {
          create();
        };

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
      }
    ]);
}());
