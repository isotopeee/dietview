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
      function($scope, $state, modals, ingredients_data, MealItem) {
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
          modals.confirm('Any unsaved changes will be discarded. Do you want to continue?', function() {
            get_ingredients();
            modals.alert('Ingredients list has been updated');
          });
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
            modals.alert('Changes made has been saved');
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
            modals.alert('New ingredient added');
            $scope.ingredients_data.push(data);
            clear_form();
          });
        }

        function remove(ingredient) {
          modals.confirm('Are you sure you want to delete the ingredient', function() {
            MealItem.deleteById({
              id: $scope.ingredient.id
            }).$promise.then(function(data) {
              modals.alert('Ingredient has been deleted');
              // TODO: Remove the deleted ingredient from $scope.ingredients_data
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
