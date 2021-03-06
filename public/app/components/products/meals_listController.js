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
      'toastr',
      function($scope, modals, meals_data, ingredients_data, Meal, Upload, API, toastr) {
        // selectize options
        $scope.meal = {
          mealItems: [],
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
                  value = ingredients_data[i];
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
          refresh();
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

        activate();

        ////////////////////////////////////////////////////////////////////////

        function activate() {
          $('.dropify').dropify();
          console.log(meals_data);
        }

        function clear_form() {
          $scope.meal = {
            mealItems: [],
            calories: 0,
            rating: 0,
          };
          $scope.image = undefined;
          $scope.ingredients = [];
        }

        function change_selected_item(meal) {
          clear_form();
          $scope.meal = meal;
          _populateIngredients();
          console.log($scope.meal);
        }

        function get_meals() {
          var filter = {
            include: 'mealItems'
          };
          Meal.find({filter:filter}).$promise.then(function(data) {
            $scope.meals_data = data;
          });
        }

        function update() {
          var mealItems = $scope.meal.mealItems;
          if ($scope.image) {
            modals.confirm('Do you want to overwrite the exisiting image?', function() {
              Upload.upload({
                url: API.URL_BASE + 'api/Meals/upload',
                data: {
                  file: $scope.image
                }
              }).then(function(response) {
                $scope.meal.image = API.URL_BASE + response.data.path;
                $scope.meal.$upsert().then(function(data) {
                  _bindMealItems(mealItems);
                  _populateIngredients();
                  UIkit.modal('#modal_edit').hide();
                  toastr.warning($scope.meal.name + " has been updated.", "Meal Updated");
                });
              });
            });
          } else {
            $scope.meal.$upsert().then(function(data) {
              _bindMealItems(mealItems);
              _populateIngredients();
              UIkit.modal('#modal_edit').hide();
              toastr.warning($scope.meal.name + " has been updated.", "Meal Updated");
            });
          }
        }

        function create() {
          console.log($scope.meal);
          Upload.upload({
            url: API.URL_BASE + 'api/Meals/upload',
            data: {
              file: $scope.image
            }
          }).then(function(response) {
            Meal.create({
              name: $scope.meal.name,
              description: $scope.meal.description,
              calories: $scope.meal.calories,
              type: $scope.meal.type,
              remarks: $scope.meal.remarks,
              image: API.URL_BASE + response.data.path,
              rating: $scope.meal.rating,
              status: $scope.meal.status,
              mealItems: $scope.meal.mealItems
            }).$promise.then(function(data) {
              UIkit.modal('#modal_add').hide();
              toastr.success(data.name + " has been added to meals list.", "Meal Added");
              data.mealItems = $scope.meal.mealItems;
              $scope.meals_data.push(data);
              console.log(data);
              console.log($scope.meal);
            }).catch(function(err) {
              toastr.error('Meal already exist', 'Meal Exist');
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
              UIkit.modal('#modal_delete').hide();
              toastr.error(meal.name + " has been removed from meals list.", "Meal Removed");
              var index = $scope.meals_data.findIndex(m => m.id === meal.id);
              $scope.meals_data.splice(index, 1);
            });
          });
        }

        function refresh() {
          modals.confirm('Any unsaved changes will be discarded. Do you want to continue?', function() {
            get_meals();
            toastr.info("Meal list has been updated.", "Meal List Updated");
          });
        }

        function _bindMealItems(mealItems) {
          $scope.meal.mealItems = mealItems;
        }

        function _populateIngredients() {
          for (var i = 0; i < $scope.meal.mealItems.length; i++) {
            $scope.ingredients.push($scope.meal.mealItems[i].id);
          }
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
