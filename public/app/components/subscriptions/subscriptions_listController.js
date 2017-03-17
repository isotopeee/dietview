angular
    .module('altairApp')
    .controller('subscriptions_listCtrl', [
        '$scope',
        '$state',
        'modals',
        'subscriptions_data',
        'Subscription',
        function ($scope,$state,modals,subscriptions_data,Subscription) {

            // ingredients data
            $scope.subscriptions_data = subscriptions_data;

            $scope.pageSize = 10;

            $scope.filter_status_options = [
                {
                    value: 'pending',
                    title: 'pending'
                },
                {
                    value: 'active',
                    title: 'active'
                },
                {
                    value: 'inactive',
                    title: 'inactive'
                }
            ];

            $scope.filter_status_config = {
                create: false,
                valueField: 'value',
                labelField: 'title',
                placeholder: 'Status...'
            };

            $scope.filterData = {
                status: ["pending","active", "inactive"]
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

            var change_selected_item = function (index) {
                $scope.ingredient = $scope.subscriptions_data[index];
            };

            var clear_form = function () {
                $scope.ingredient = {};
            };

            var get_ingredients = function () {
                MealItem.find({}).$promise.then(function (data) {
                    $scope.subscriptions_data = data;
                });
            };

            var update = function () {
                $scope.ingredient.$save().then(function (data) {
                    modals.alert('Changes made has been saved');
                });
            };

            var create = function () {
                MealItem.create({
                    name: $scope.ingredient.name,
                    calories: $scope.ingredient.calories,
                    type: $scope.ingredient.type,
                    status: $scope.ingredient.status,
                    remarks: $scope.ingredient.remarks,
                    description: $scope.ingredient.description
                }).$promise.then(function (data) {
                  modals.alert('New ingredient added');
                  $scope.subscriptions_data.push(data);
                  clear_form();
                });
            };

            var remove = function (index) {
                modals.confirm('Are you sure you want to delete the ingredient', function () {
                    MealItem.deleteById({
                        id: $scope.ingredient.id
                    }).$promise.then(function (data) {
                        modals.alert('Ingredient has been deleted');
                        $scope.subscriptions_data.splice(index, 1);
                    });
                });
            };

            $scope.changeSelectedItem = function ($event,$index) {
                change_selected_item($index);
            };

            $scope.clearForm = function ($event) {
                clear_form();
            };

            $scope.approve = function ($event, $index) {
              modals.confirm('Approve subscription?', function () {
                $scope.subscriptions_data[$index].status = 'active';
                $scope.subscriptions_data[$index].isActive = true;
                $scope.subscriptions_data[$index].$save().then(function (data) {
                  modals.alert('Subscription is now active!');
                })
              });
            }

            $scope.refresh = function ($event) {
                modals.confirm('Any unsaved changes will be discarded. Do you want to continue?', function () {
                    get_ingredients();
                    modals.alert('Ingredients list has been updated');
                });
            };

            $scope.update = function ($event) {
                update();
            };

            $scope.create = function ($event) {
                create();
            };

            $scope.remove = function ($event, $index) {
                $scope.changeSelectedItem($event,$index);
                remove($index);
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
