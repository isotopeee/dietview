(function() {
  'use strict';

  angular
    .module('dietviewApp')
    .controller('meal_items_listCtrl', [
      '$scope',
      '$state',
      'modals',
      'ingredients_data',
      'MealItem',
      'toastr',
      function($scope, $state, modals, ingredients_data, MealItem, toastr) {
        $scope.ingredients_data = ingredients_data;
        $scope.pageSize = 10;
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
        $scope.filter_pageSize = ['5', '10', '15'];
        $scope.options = {
          type: [
            'dairy',
            'meats',
            'vegetables',
            'fruits',
            'spices',
            'seafood',
            'fish',
            'soup',
            'grains'
          ],
          status: [
            'available',
            'not available'
          ]
        };

        $scope.changeSelectedItem = function($event, ingredient) {
          change_selected_item(ingredient);
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
        $scope.remove = function($event, ingredient) {
          $scope.changeSelectedItem($event, ingredient);
          remove(ingredient);
        };

        ////////////////////////////////////////////////////////////////////

        function change_selected_item(ingredient) {
          $scope.ingredient = ingredient;
        }

        function clear_form() {
          $scope.ingredient = {};
        }

        function get_ingredients() {
          MealItem.find({}).$promise.then(function(data) {
            $scope.ingredients_data = data;
          });
        }

        function update() {
          $scope.ingredient.$save().then(function(data) {
            UIkit.modal('#modal_edit').hide();
            toastr.warning($scope.ingredient.name + ' has been updated.', "Ingredient Updated")
          });
        }

        function create() {
          MealItem.create({
            name: $scope.ingredient.name,
            calories: $scope.ingredient.calories,
            type: $scope.ingredient.type,
            status: $scope.ingredient.status,
            remarks: $scope.ingredient.remarks,
            description: $scope.ingredient.description
          }).$promise.then(function(data) {
            UIkit.modal('#modal_add').hide();
            toastr.success(data.name + ' has been added to ingredients list.', 'Ingredient Added');
            $scope.ingredients_data.push(data);
            clear_form();
          }).catch(function(err) {
            toastr.error('Ingredient already exist', 'Ingredient Exist');
          });
        }

        function remove(ingredient) {
          modals.confirm('Are you sure you want to delete the ingredient', function() {
            MealItem.deleteById({
              id: $scope.ingredient.id
            }).$promise.then(function(data) {
              UIkit.modal('#modal_delete').hide();
              toastr.error(ingredient.name + ' has been removed from ingredients list.', 'Ingredient Removed');
              // TODO: Remove the deleted ingredient from $scope.ingredients_data
              var  index = $scope.ingredients_data.findIndex(ing => ing.id === ingredient.id);
              $scope.ingredients_data.splice(index, 1);
            });
          });
        }

        function refresh() {
          modals.confirm('Any unsaved changes will be discarded. Do you want to continue?', function() {
            get_ingredients();
            toastr.info("Ingredient list has been updated.", 'Ingredient List Updated');
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
