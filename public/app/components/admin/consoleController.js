angular
    .module('altairApp')
    .controller('consoleCtrl', [
        '$scope',
        'user_list',
        'modals',
        'User',
        function($scope, user_list, modals, User) {

            $scope.user_list = user_list;

            $scope.options = {
                role: [
                    'chef',
                    'admin',
                    'nutritionist',
                    'secretary'
                ]
            };

            // get all companies from array and remove duplicate arrays
            function eliminateDuplicates(arr) {
                var out = [];

                for (var i = 0; i < arr.length; i++) {
                    var role = arr[i].account.role;
                    if (!out.includes(role)) {
                        out.push(role);
                    }
                }
                return out;
            };

            $scope.user_list_roles = eliminateDuplicates(user_list);

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

            $scope.create = function ($event) {
                create();
            };
        }
    ]);
