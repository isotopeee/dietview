angular
    .module('altairApp')
    .controller('resetPasswordCtrl', [
        '$scope',
        '$state',
        '$stateParams',
        'User',
        function ($scope,$state,$stateParams,User) {

          $scope.recaptcha = {};

          var info = {
            accessToken: $stateParams.access_token,
            userId: $stateParams.user_id
          };

          console.log(info);

          // reset password
          var reset_password = function () {
              if (!$scope.recaptcha.reset) {
                alert('check recaptcha');
              } else {
                User.changePassword({}, info,
                function (data, headers) {
                  $state.go('login');
                  console.log(data);
                  console.log(headers);
                },
                function (response) {
                  console.log(err);
                });
              }
          };
        }
    ]);
