angular
    .module('altairApp')
    .controller('user_editCtrl', [
        '$scope',
        '$state',
        'modals',
        'user_data',
        function ($scope,$state,modals,user_data) {

            console.log(user_data);
            $scope.user_data = user_data;

            // update User
            var update = function () {
              user_data.$prototype$updateAttributes(
                {
                  username: $scope.user_data.username,
                  email: $scope.user_data.email,
                  account: {
                    profile: {
                      firstname: $scope.user_data.account.profile.firstname,
                      lastname: $scope.user_data.account.profile.lastname,
                      phone: $scope.user_data.account.profile.phone
                    }
                  }
                },
                function (data, headers) {
                  modals.alert('Changes has been saved.');
                }, function (response) {
                  console.error(response);
                });
            };

            // change password
            var changePassword = function () {
              modals.confirm('Are you sure you want to change password?', function () {
                if ($scope.user_data.password === $scope.confirm) {
                  user_data.$prototype$updateAttributes({password: $scope.password},
                  function (data, headers) {
                    $scope.password = '';
                    $scope.confirm = '';
                    modals.alert('Password has been changed.');
                  }, function (response) {
                    console.error(response);
                  });
                } else {
                  modals.alert('Passwords does not match');
                }
              });
            };

            $scope.update = function ($event) {
              update();
            };

            $scope.discard = function ($event) {
              $event.preventDefault();
              modals.confirm('Discard Changes and Go Back?', function () {
                $state.go('restricted.pages.user_profile');
              });

            };
            $scope.changePassword = function ($event) {
              changePassword();
            };
        }
    ])
;
