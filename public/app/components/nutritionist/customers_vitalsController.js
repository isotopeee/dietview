angular
    .module('altairApp')
    .controller('customers_vitalsCtrl', [
        '$scope',
        'user_list',
        'modals',
        'User',
        function($scope, user_list, modals, User) {

            $scope.user_list = user_list;

            function getCustomers() {
                for (var i = 0; i < $scope.user_list.length; i++) {
                    if ($scope.user_list[i].account.role !== 'customer') {
                        $scope.user_list.splice(i, 1);
                    }
                }
            };

            $scope.user_list_roles = ['customer'];
            getCustomers();

            $scope.$on('onLastRepeat', function(scope, element, attrs) {
                $scope.$apply(function() {
                    UIkit.grid($('#user_list'), {
                        controls: '#user_list_filter',
                        gutter: 20
                    });
                });
            });

            var clear_form = function () {
                $scope.user = {};
            };

            var create = function () {
                modals.confirm('Create new user?', function () {
                    User.create({}, {
                        username: $scope.user.username,
                        email: $scope.user.email,
                        password: 'dietview',
                        account: {
                            profile: {
                                firstname: $scope.user.account.profile.firstname,
                                lastname: $scope.user.account.profile.lastname
                            },
                            role: $scope.user.account.role
                        },
                        created: new Date(),
                        lastUpdated: new Date(),
                        realm: $scope.user.realm,
                        status: 'active'
                    }).$promise.then(function (data) {
                        $scope.user_list_roles = eliminateDuplicates(user_list);
                        $scope.user_list.push(data);
                        clear_form();
                        modals.alert('An email has been sent for account verification');
                    });
                });
            };

            var details = function (user) {
                $scope.user = user;
            };

            $scope.create = function ($event) {
                create();
            };

            $scope.details = function ($event, user) {
                details(user);
            };
        }
    ]);
