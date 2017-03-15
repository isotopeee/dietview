angular
    .module('altairApp')
    .controller('meal_plans_addCtrl', [
        '$rootScope',
        '$scope',
        'modals',
        'meals_data',
        'MealPlan',
        'Upload',
        'API',
        function($rootScope, $scope, modals, meals_data, MealPlan, Upload, API) {

            $rootScope.page_full_height = true;
            $rootScope.headerDoubleHeightActive = true;

            $scope.$on('$destroy', function() {
                $rootScope.page_full_height = false;
                $rootScope.headerDoubleHeightActive = false;
            });

            $('.dropify').dropify();

            $scope.options = {
                meals: meals_data,
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

            $scope.meal_plan = {
                feedbacks: [],
                meals: [],
                rating: 0,
                availCount: 0
            };
            $scope.meals = [];

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


            var clear_form = function () {
                $scope.meals = [];
                $scope.meal_plan = {
                    feedbacks: [],
                    meals: [],
                    rating: 0,
                    availCount: 0
                };
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
                    $scope.meal_plan.meals.push(dailyMeals);
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

            $scope.create = function ($event) {
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
