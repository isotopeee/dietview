(function() {
  'use strict';

  angular
    .module('dietviewApp')
    .controller('meals_listCtrl', [
      '$scope',
      'modals',
      'meals_data',
      'ingredients_data',
      'Meal',
      'Upload',
      'API',
      function($scope, modals, meals_data, ingredients_data, Meal, Upload, API) {
        $('.dropify').dropify();
        // selectize options
        $scope.meal = {
          mealItems: [],
          mealPlans: [],
          feedbacks: [],
          calories: 0,
          rating: 0,
        };
        $scope.options = {
          ingredients: ingredients_data,
          type: [
            'breakfast',
            'lunch',
            'dinner',
            'snack'
          ],
          status: [
            'available',
            'not available'
          ]
        };
        //selectize config
        $scope.config = {
          ingredients: {
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
                  '<span class="title">' + escape(ingredients_data.name) + '</span>' +
                  ' - ' +
                  '<span>' + escape(ingredients_data.description) + '</span>' +
                  '</div>';
              },
              item: function(ingredients_data, escape) {
                return '<div class="item">' + escape(ingredients_data.name) +
                  ' - ' + escape(ingredients_data.description) + '</div>';
              }
            },
            onItemAdd: function(value, $item) {
              if ($scope.ingredients.indexOf(value) === -1) {
                for (var i = 0; i < ingredients_data.length; i++) {
                  if (ingredients_data[i].id === value) {
                    value = ingredients_data[i];
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

        // meals data
        $scope.meals_data = meals_data;
        $scope.pageSize = 10;
        $scope.filter_type_options = [{
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
        $scope.filter_type_config = {
          create: false,
          valueField: 'value',
          labelField: 'title',
          placeholder: 'Type  ...'
        };
        $scope.filterData = {
          status: ["breakfast", "lunch", "dinner", "snack"]
        };
        $scope.filter_pageSize = ['5', '10', '15'];

        $scope.changeSelectedItem = function($event, meal) {
          change_selected_item(meal);
        };
        $scope.clearForm = function($event) {
          clear_form();
        };
        $scope.refresh = function($event) {
          modals.confirm('Any unsaved changes will be discarded. Do you want to continue?', function() {
            get_ingredients();
            modals.alert('Meals list has been updated');
          });
        };
        $scope.update = function($event) {
          update();
        };
        $scope.create = function($event) {
          create();
        };
        $scope.remove = function($event, meal) {
          $scope.changeSelectedItem($event, meal);
          remove(meal);
        };

        ////////////////////////////////////////////////////////////////////

        function clear_form() {
          $scope.meal = {
            mealItems: [],
            mealPlans: [],
            feedbacks: [],
            calories: 0,
            rating: 0,
          };
          $scope.image = undefined;
          $scope.ingredients = [];
        }

        function change_selected_item(meal) {
          clear_form();
          $scope.meal = meal;
          for (var i = 0; i < $scope.meal.mealItems.length; i++) {
            $scope.ingredients.push($scope.meal.mealItems[i].id);
          }
          console.log($scope.meal);
        }

        function get_ingredients() {
          Meal.find({}).$promise.then(function(data) {
            $scope.meals_data = data;
          });
        }

        function update() {
          if ($scope.image) {
            modals.confirm('Do you want to overwrite the exisiting image?', function() {
              Upload.upload({
                url: API.URL_BASE + 'api/Meals/upload',
                data: {
                  file: $scope.image
                }
              }).then(function(response) {
                $scope.meal.image = API.URL_BASE + response.data.path;
                $scope.meal.$save().then(function(data) {
                  modals.alert('Changes made has been saved');
                });
              });
            });
          } else {
            $scope.meal.$save().then(function(data) {
              modals.alert('Changes made has been saved');
            });
          }

        }

        function create() {
          Upload.upload({
            url: API.URL_BASE + 'api/Meals/upload',
            data: {
              file: $scope.image
            }
          }).then(function(response) {
            Meal.create({
              mealItems: $scope.meal.mealItems,
              mealPlans: $scope.meal.mealPlans,
              feedbacks: $scope.meal.feedbacks,
              code: $scope.meal.code,
              name: $scope.meal.name,
              description: $scope.meal.description,
              calories: $scope.meal.calories,
              type: $scope.meal.type,
              remarks: $scope.meal.remarks,
              image: API.URL_BASE + response.data.path,
              rating: $scope.meal.rating,
              status: $scope.meal.status
            }).$promise.then(function(data) {
              modals.alert('New Meal Added');
              $scope.meals_data.push(data);
              clear_form();
            });
          }, null, function(event) {
            console.log(event);
          });
        }

        function remove(meal) {
          modals.confirm('Are you sure you want to delete the meal', function() {
            Meal.deleteById({
              id: $scope.meal.id
            }).$promise.then(function(data) {
              modals.alert('Meal has been deleted');
              // TODO: Remove deleted meal from $scope.meals_data
            });
          });
        }
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
