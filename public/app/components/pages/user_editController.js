(function() {
  'use strict';

  angular
      .module('dietviewApp')
      .controller('user_editCtrl', [
          '$scope',
          '$state',
          'modals',
          'user_data',
          'toastr',
          function ($scope,$state,modals,user_data, toastr) {
              $scope.user_data = user_data;
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

              /////////////////////////////////////////////////////////////////.

              // update User
              function update () {
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
                    toastr.warning("Your profile has been updated.", "Profile Update");
                  }, function (response) {
                    console.error(response);
                  });
              }

              // change password
              function changePassword () {
                modals.confirm('Are you sure you want to change password?', function () {
                  if ($scope.user_data.password === $scope.confirm) {
                    user_data.$prototype$updateAttributes({password: $scope.password},
                    function (data, headers) {
                      $scope.password = '';
                      $scope.confirm = '';
                      toastr.warning("Your password has been changed.", "Password Changed");
                    }, function (response) {
                      console.error(response);
                    });
                  } else {
                    toastr.error("Password does not match. Please try again.", "Password Mismatch");
                  }
                });
              }
          }
      ]);
}());
