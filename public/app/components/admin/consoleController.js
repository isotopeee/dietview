(function() {
  'use strict';

  angular
    .module('dietviewApp')
    .controller('consoleCtrl', [
      '$scope',
      'user_list',
      'modals',
      'User',
      function($scope, user_list, modals, User) {
        $scope.user_list = user_list;
        console.log(user_list);
        $scope.options = {
          role: [
            'chef',
            'admin',
            'nutritionist',
            'secretary'
          ]
        };
        $scope.user_list_roles = eliminateDuplicates(user_list);
        $scope.create = function($event) {
          create();
        };

        $scope.$on('onLastRepeat', function(scope, element, attrs) {
          $scope.$apply(function() {
            UIkit.grid($('#user_list'), {
              controls: '#user_list_filter',
              gutter: 20
            });
          });
        });

        ////////////////////////////////////////////////////////////////////

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
        }

        function clear_form() {
          $scope.user = {};
        }

        function create() {
          modals.confirm('Create new user?', function() {
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
              realm: 'dietview',
              status: 'active'
            }).$promise.then(function(data) {
              $scope.user_list_roles = eliminateDuplicates(user_list);
              $scope.user_list.push(data);
              clear_form();
              $('#modal_add').hide();
              modals.alert('An email has been sent for account verification');
            });
          });
        }
      }
    ]);
}());
