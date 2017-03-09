angular
    .module('altairApp')
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
            }
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
            }

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
                                '</div>';
                        },
                        item: function(ingredients_data, escape) {
                            return '<div class="item">' + escape(ingredients_data.name) + '</div>';
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


            // products data
            $scope.meals_data = meals_data;

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

            var change_selected_item = function(index) {
                clear_form();
                $scope.meal = $scope.meals_data[index];
                for (var i = 0; i < $scope.meal.mealItems.length; i++) {
                    $scope.ingredients.push($scope.meal.mealItems[i].id);
                }
            };

            var clear_form = function() {
                $scope.meal = {
                    mealItems: [],
                    mealPlans: [],
                    feedbacks: [],
                    calories: 0,
                    rating: 0,
                }
                $scope.image = {};
                $scope.ingredients = [];
            };

            var create = function() {
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
            };

            var remove = function(index) {
                modals.confirm('Are you sure you want to delete the meal', function() {
                    Meal.deleteById({
                        id: $scope.meal.id
                    }).$promise.then(function(data) {
                        modals.alert('Meal has been deleted');
                        $scope.meals_data.splice(index, 1);
                    });
                });
            };

            $scope.changeSelectedItem = function($event, $index) {
                change_selected_item($index);
            };

            $scope.clearForm = function($event) {
                clear_form();
            };

            $scope.create = function($event) {
                create();
            };

            $scope.remove = function($event, $index) {
                $scope.changeSelectedItem($event, $index);
                remove($index);
            };
        }
    ]);
Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
};
