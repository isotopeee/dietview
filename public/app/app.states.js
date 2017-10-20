(function() {
  'use strict';

  angular
    .module('dietviewApp')
    .config([
      '$stateProvider',
      '$urlRouterProvider',
      function($stateProvider, $urlRouterProvider) {
        // Use $urlRouterProvider to configure any redirects (when) and invalid urls (otherwise).
        $urlRouterProvider
          .when('/login', '/')
          .when('', '/')
          .otherwise('/error/404');

        $stateProvider
          // -- ERROR PAGES --
          .state("error", {
            url: "/error",
            templateUrl: 'app/views/error.html',
            resolve: {
              deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load([
                  'lazy_uikit'
                ]);
              }]
            }
          })
          .state("error.404", {
            url: "/404",
            templateUrl: 'app/components/pages/error_404View.html',
            data: {
              pageTitle: '404'
            }
          })
          .state("error.unauthorized", {
            url: "/unauthorized",
            templateUrl: 'app/components/pages/error_unauthorizedView.html',
            data: {
              pageTitle: 'Unauthorized'
            }
          })
          .state("error.500", {
            url: "/500",
            templateUrl: 'app/components/pages/error_500View.html'
          })
          // -- LOGIN PAGE --
          .state("login", {
            url: "/",
            templateUrl: 'app/components/pages/loginView.html',
            controller: 'loginCtrl',
            resolve: {
              deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load([
                  'lazy_uikit',
                  'lazy_iCheck',
                  'lazy_parsleyjs',
                  'app/components/pages/loginController.js'
                ]);
              }]
            },
            data: {
              pageTitle: 'Login'
            }
          })
          // -- ACCOUNT-VERIFIED PAGE --
          .state("accountVerified", {
            url: "/account-verified",
            templateUrl: 'app/components/pages/accountVerifiedView.html',
            resolve: {
              deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load([
                  'lazy_uikit',
                ]);
              }]
            },
            data: {
              pageTitle: 'Account verified'
            }
          })
          // -- RESET-PASSWORD PAGE --
          .state("resetPassword", {
            url: "/reset-password?access_token&user_id",
            templateUrl: 'app/components/pages/resetPasswordView.html',
            controller: 'resetPasswordCtrl',
            resolve: {
              deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load([
                  'lazy_uikit',
                  'lazy_iCheck',
                  'lazy_parsleyjs',
                  'app/components/pages/resetPasswordController.js'
                ]);
              }]
            },
            data: {
              pageTitle:'Reset password'
            }
          })
          // -- RESTRICTED --
          .state("restricted", {
            abstract: true,
            url: "",
            templateUrl: 'app/views/restricted.html',
            resolve: {
              deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load([
                  'lazy_uikit',
                  'lazy_selectizeJS',
                  'lazy_switchery',
                  'lazy_prismJS',
                  'lazy_autosize',
                  'lazy_iCheck',
                  'lazy_themes'
                ]);
              }],
              currentAuth: function($q, User){
                // check if user is authenticated
                return User.getCurrent()
                    .$promise
                    .then(data => data)
                    .catch(err => $q.reject("AUTH_REQUIRED"));
              }
            }
          })
          // -- DASHBOARD --
          .state("restricted.dashboard", {
            url: "/dashboard",
            templateUrl: 'app/components/dashboard/dashboardView.html',
            controller: 'dashboardCtrl',
            resolve: {
              deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load([
                  // ocLazyLoad config (app/app.js)
                  'lazy_countUp',
                  'lazy_charts_peity',
                  'lazy_charts_easypiechart',
                  'lazy_charts_metricsgraphics',
                  'lazy_charts_chartist',
                  'lazy_weathericons',
                  'lazy_clndr',
                  'lazy_google_maps',
                  'app/components/dashboard/dashboardController.js'
                ], {
                  serie: true
                });
              }],
              subscriptions_data: function(Subscription) {
                return Subscription.find({}).$promise
                  .then(function(data) {
                    return data;
                  });
              },
              users_data: function(User) {
                return User.find({}).$promise
                  .then(function(data) {
                    return data;
                  });
              }
            },
            data: {
              pageTitle: 'Dashboard'
            },
            ncyBreadcrumb: {
              label: 'Home'
            }
          })
          // == ADMIN --
          .state("restricted.admin", {
            url: "/admin",
            template: '<div ui-view autoscroll="false" ng-class="{ \'uk-height-1-1\': page_full_height }" />',
            abstract: true,
            resolve: {
              currentAuth: function($q, User){
                // check if user is authenticated and logged in as admin
                return User.getCurrent()
                    .$promise
                    .then(user => {
                      if (user.account.role !== 'admin') {
                        return $q.reject("UNAUTHORIZED");
                      }
                    });
              },
              user_data: function(User) {
                var user = User.getCachedCurrent();
                if (user !== null) {
                  return user;
                } else {
                  return User.getCurrent().$promise.then(function(data) {
                    return data;
                  });
                }
              }
            }
          })
          // MANAGEMENT CONSOLE
          .state("restricted.admin.console", {
            url: "/console",
            templateUrl: 'app/components/admin/consoleView.html',
            controller: 'consoleCtrl',
            resolve: {
              deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load([
                  'app/components/admin/consoleController.js'
                ], {
                  serie: true
                });
              }],
              user_list: function(User) {
                return User.find({}).$promise.then(function(data) {
                  return data;
                });
              }
            },
            data: {
              pageTitle: 'Management Console'
            }
          })
          // -- AUDIT LOGS --
          .state("restricted.admin.audit_logs", {
            url: "/audit_logs",
            templateUrl: 'app/components/admin/audit_logsView.html',
            controller: 'audit_logsCtrl',
            resolve: {
              audit_logs_data: function(AuditLog) {
                const filter = {
                  include: 'user',
                  order: 'eventDate DESC'
                };
                return AuditLog.find({filter: filter}).$promise
                  .then(function(data) {
                    console.log(data);
                    return data;
                  });
              },
              deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load([
                  'lazy_pagination',
                  'app/components/admin/audit_logsController.js'
                ], {
                  serie: true
                });
              }]
            },
            data: {
              pageTitle: 'Audit Logs'
            }
          })
          // -- PRODUCTS --
          .state("restricted.products", {
            url: "/products",
            template: '<div ui-view autoscroll="false"/>',
            abstract: true
          })
          // -- MEAL ITEMS --
          .state("restricted.products.meal_items", {
            url: "/meal_items",
            templateUrl: 'app/components/products/meal_items_listView.html',
            controller: 'meal_items_listCtrl',
            resolve: {
              ingredients_data: function(MealItem) {
                var filter = {
                  order: 'name asc'
                };
                return MealItem.find({filter: filter}).$promise
                  .then(function(data) {
                    return data;
                  });
              },
              deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load([
                  'lazy_pagination',
                  'app/components/products/meal_items_listController.js'
                ], {
                  serie: true
                });
              }]
            },
            data: {
              pageTitle: 'Meal Items'
            }
          })
          // -- MEALS --
          .state("restricted.products.meals", {
            url: "/meals",
            templateUrl: 'app/components/products/meals_listView.html',
            controller: 'meals_listCtrl',
            resolve: {
              meals_data: function(Meal) {
                var filter = {
                  include: 'mealItems',
                  order: 'name asc'
                };
                return Meal.find({filter: filter}).$promise
                  .then(function(data) {
                    return data;
                  });
              },
              ingredients_data: function(MealItem) {
                return MealItem.find({}).$promise
                  .then(function(data) {
                    return data;
                  });
              },
              deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load([
                  'lazy_dropify',
                  'lazy_pagination',
                  'app/components/products/meals_listController.js'
                ], {
                  serie: true
                });
              }]
            },
            data: {
              pageTitle: 'Meals'
            }
          })
          // -- MEAL PLANS --
          .state("restricted.products.meal_plans", {
            url: "/meal_plans",
            templateUrl: 'app/components/products/meal_plans_listView.html',
            controller: 'meal_plans_listCtrl',
            resolve: {
              meals_data: function(Meal) {
                return Meal.find({}).$promise
                  .then(function(data) {
                    return data;
                  });
              },
              meal_plans_data: function(MealPlan) {
                var filter = {
                  order: 'name asc'
                };
                return MealPlan.find({filter: filter}).$promise
                  .then(function(data) {
                    return data;
                  });
              },
              deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load([
                  'lazy_pagination',
                  'app/components/products/meal_plans_listController.js'
                ], {
                  serie: true
                });
              }]
            },
            data: {
              pageTitle: 'Meal Plans'
            }
          })
          // -- ADD MEAL PLANS --
          .state("restricted.products.meal_plans_add", {
            url: "/meal_plans/add",
            templateUrl: 'app/components/products/meal_plans_addView.html',
            controller: 'meal_plans_addCtrl',
            resolve: {
              meals_data: function(Meal) {
                return Meal.find({}).$promise
                  .then(function(data) {
                    return data;
                  });
              },
              deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load([
                  'lazy_pagination',
                  'lazy_dropify',
                  'app/components/products/meal_plans_addController.js'
                ], {
                  serie: true
                });
              }]
            },
            data: {
              pageTitle: 'New Meal Plan'
            }
          })
          // -- EDIT MEAL PLANS --
          .state("restricted.products.meal_plans_edit", {
            url: "/meal_plans/edit?id",
            templateUrl: 'app/components/products/meal_plans_editView.html',
            controller: 'meal_plans_editCtrl',
            resolve: {
              meal_plan_data: function ($stateParams, MealPlan) {
                return MealPlan.findById({id: $stateParams.id}).$promise
                  .then(function (data) {
                    return data;
                  });
              },
              meals_data: function(Meal) {
                return Meal.find({}).$promise
                  .then(function(data) {
                    return data;
                  });
              },
              meal_plan_meals_data: function ($stateParams, TM_MealMealPlan) {
                var mealPlanMeals = [];
                var mealPlanMeal = null;
                var lastItem = null;
                var filter = {
                  where: {
                    mealPlanId: $stateParams.id
                  },
                  include: {
                    relation: 'meal',
                    scope: {
                      fields: ['type']
                    }
                  },
                  order: 'day ASC'
                };

                return TM_MealMealPlan.find({filter:filter}).$promise.then(function (data) {
                  lastItem = data[data.length-1];

                  for (var i = 0; i < lastItem.day; i++) {
                    mealPlanMeal = {
                      breakfast: null,
                      lunch: null,
                      dinner: null,
                      snack: null
                    };
                    mealPlanMeals.push(mealPlanMeal);
                  }
                  // TODO: Sort meal plan meals data
                  data.forEach(function (mealPlanMeal) {
                    mealPlanMeals[mealPlanMeal.day - 1][mealPlanMeal.meal.type] = mealPlanMeal.mealId;
                  });
                  return mealPlanMeals;
                });
              },
              deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load([
                  'lazy_pagination',
                  'lazy_dropify',
                  'app/components/products/meal_plans_editController.js'
                ], {
                  serie: true
                });
              }]
            },
            data: {
              pageTitle: 'Edit Meal Plan'
            }
          })
          // -- DETAILS MEAL PLANS --
          .state("restricted.products.meal_plans_details", {
            url: "/meal_plans/details?id",
            templateUrl: 'app/components/products/meal_plans_detailsView.html',
            controller: 'meal_plans_detailsCtrl',
            resolve: {
              meal_plan_data: function ($stateParams, MealPlan) {
                return MealPlan.findById({id: $stateParams.id}).$promise
                  .then(function (data) {
                    return data;
                  });
              },
              meals_data: function(Meal) {
                return Meal.find({}).$promise
                  .then(function(data) {
                    return data;
                  });
              },
              meal_plan_meals_data: function ($stateParams, TM_MealMealPlan) {
                var mealPlanMeals = [];
                var mealPlanMeal = null;
                var lastItem = null;
                var filter = {
                  where: {
                    mealPlanId: $stateParams.id
                  },
                  include: {
                    relation: 'meal',
                    scope: {
                      fields: ['type']
                    }
                  },
                  order: 'day ASC'
                };

                return TM_MealMealPlan.find({filter:filter}).$promise.then(function (data) {
                  lastItem = data[data.length-1];

                  for (var i = 0; i < lastItem.day; i++) {
                    mealPlanMeal = {
                      breakfast: null,
                      lunch: null,
                      dinner: null,
                      snack: null
                    };
                    mealPlanMeals.push(mealPlanMeal);
                  }
                  // TODO: Sort meal plan meals data
                  data.forEach(function (mealPlanMeal) {
                    mealPlanMeals[mealPlanMeal.day - 1][mealPlanMeal.meal.type] = mealPlanMeal.mealId;
                  });
                  return mealPlanMeals;
                });
              },
              deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load([
                  'lazy_pagination',
                  'lazy_dropify',
                  'app/components/products/meal_plans_detailsController.js'
                ], {
                  serie: true
                });
              }]
            },
            data: {
              pageTitle: 'Meal Plan Details'
            }
          })
          // -- SUBSCRIPTIONS --
          .state("restricted.subscriptions", {
            url: "/subscriptions",
            template: '<div ui-view autoscroll="false"/>',
            abstract: true
          })
          // -- List --
          .state("restricted.subscriptions.list", {
            url: "/list",
            templateUrl: 'app/components/subscriptions/subscriptions_listView.html',
            controller: 'subscriptions_listCtrl',
            resolve: {
              subscriptions_data: function(Subscription) {
                var filter = {
                  include: ['user', 'mealPlan'],
                  order: 'subscriptionDate desc'
                }
                return Subscription.find({filter: filter}).$promise
                  .then(function(data) {
                    return data;
                  });
              },
              deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load([
                  'lazy_pagination',
                  'app/components/subscriptions/subscriptions_listController.js'
                ], {
                  serie: true
                });
              }]
            },
            data: {
              pageTitle: 'Meal Items'
            }
          })
          // == NUTRITIONIST --
          .state("restricted.nutritionist", {
            url: "/nutritionist",
            template: '<div ui-view autoscroll="false" ng-class="{ \'uk-height-1-1\': page_full_height }" />',
            abstract: true
          })
          // CUSTOMERS VITALS
          .state("restricted.nutritionist.customers_vitals", {
            url: "/customers_vitals",
            templateUrl: 'app/components/nutritionist/customers_vitalsView.html',
            controller: 'customers_vitalsCtrl',
            resolve: {
              deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load([
                  'app/components/nutritionist/customers_vitalsController.js'
                ], {
                  serie: true
                });
              }],
              user_list: function(User) {
                return User.find({}).$promise.then(function(data) {
                  return data;
                });
              }
            },
            data: {
              pageTitle: 'Customers Vitals'
            }
          })
          // == REPORTS --
          .state("restricted.reports", {
            url: "/reports",
            template: '<div ui-view autoscroll="false" ng-class="{ \'uk-height-1-1\': page_full_height }"/>',
            abstract: true,
            ncyBreadcrumb: {
              label: 'Reports'
            }
          })
          .state("restricted.reports.production", {
            url: "/production",
            templateUrl: 'app/components/reports/productionView.html',
            controller: 'productionCtrl',
            resolve: {
              production_data: function(Subscription, TM_MealMealPlan) {
                var filter = {
                  where: {
                    status: 'active'
                  },
                  include: ['user', 'mealPlan'],
                  order: 'mealPlanId ASC'
                };
                return Subscription.find({filter: filter}).$promise
                  .then(function(data) {
                    return data;
                  });
              },
              deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load([
                  'app/components/reports/productionController.js'
                ], {
                  serie: true
                });
              }]
            },
            data: {
              pageTitle: 'Production Assistance'
            }
          })
          .state("restricted.reports.deliveries", {
            url: "/deliveries",
            templateUrl: 'app/components/reports/deliveriesView.html',
            controller: 'deliveriesCtrl',
            resolve: {
              deliveries_data: function(Subscription) {
                var filter = {
                  where: {
                    status: 'active'
                  },
                  include: ['user', 'mealPlan'],
                  order: 'mealPlanId ASC'
                };
                return Subscription.find({filter:filter}).$promise
                  .then(function(data) {
                    return data;
                  });
              },
              deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load([
                  'app/components/reports/deliveriesController.js'
                ], {
                  serie: true
                });
              }]
            },
            data: {
              pageTitle: 'Delivery List'
            }
          })
          .state("restricted.reports.receipts", {
            url: "/receipts",
            templateUrl: 'app/components/reports/receiptsView.html',
            controller: 'receiptsCtrl',
            resolve: {
              receipts_data: function(Subscription, TM_MealMealPlan) {
                var filter = {
                  where: {
                    status: 'active'
                  },
                  include: ['user', 'mealPlan'],
                  order: 'mealPlanId ASC'
                };
                return Subscription.find({filter:filter}).$promise
                  .then(function(subscriptions) {
                    return subscriptions;
                  });
              },
              deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load([
                  'app/components/reports/receiptsController.js'
                ], {
                  serie: true
                });
              }]
            },
            data: {
              pageTitle: 'Receipts'
            }
          })
          .state("restricted.reports.rawIngredients", {
            url: "/rawIngredients",
            templateUrl: 'app/components/reports/rawIngredientsView.html',
            controller: 'rawIngredientsCtrl',
            resolve: {
              rawIngredients_data: function(Subscription, TM_MealMealPlan) {
                const filter = {
                  where: {
                    status: 'active'
                  },
                  include: ['user', {mealPlan: {meals: 'mealItems'}}],
                  order: 'mealPlanId ASC'
                };
                return Subscription.find({filter:filter}).$promise
                  .then(function(subscriptions) {
                    return subscriptions;
                  });
              },
              deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load([
                  'app/components/reports/rawIngredientsController.js'
                ], {
                  serie: true
                });
              }]
            },
            data: {
              pageTitle: 'Raw Ingredients'
            }
          })

          // -- PAGES --
          .state("restricted.pages", {
            url: "/pages",
            template: '<div ui-view autoscroll="false" ng-class="{ \'uk-height-1-1\': page_full_height }" />',
            abstract: true
          })

          .state("restricted.pages.scrum_board", {
            url: "/scrum_board",
            templateUrl: 'app/components/pages/scrum_boardView.html',
            controller: 'scrum_boardCtrl',
            resolve: {
              deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load([
                  'lazy_dragula',
                  'app/components/pages/scrum_boardController.js'
                ], {
                  serie: true
                });
              }],
              tasks_list: function(Task) {
                return Task.find({}).$promise
                  .then(function(data) {
                    return data;
                  });
              }
            },
            data: {
              pageTitle: 'Scrum Board'
            }
          })

          .state("restricted.pages.user_profile", {
            url: "/user_profile",
            templateUrl: 'app/components/pages/user_profileView.html',
            controller: 'user_profileCtrl',
            resolve: {
              deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load([
                  'app/components/pages/user_profileController.js'
                ]);
              }],
              user_data: function(User) {
                return User.getCurrent().$promise
                  .then(function(data) {
                    return data;
                  });
              }
            },
            data: {
              pageTitle: 'User profile'
            }
          })
          .state("restricted.pages.user_edit", {
            url: "/user_edit",
            templateUrl: 'app/components/pages/user_editView.html',
            controller: 'user_editCtrl',
            resolve: {
              deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load([
                  'lazy_parsleyjs',
                  'assets/js/custom/uikit_fileinput.min.js',
                  'app/components/pages/user_editController.js'
                ], {
                  serie: true
                });
              }],
              user_data: function(User) {
                var user = User.getCachedCurrent();
                if (user !== null) {
                  return user;
                } else {
                  return User.getCurrent().$promise.then(function(data) {
                    return data;
                  });
                }
              }
            },
            data: {
              pageTitle: 'User edit'
            }
          });
      }
    ]);
}());
