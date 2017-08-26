(function() {
  'use strict';

  angular
    .module('dietviewApp')
    .controller('resetPasswordCtrl', [
      '$scope',
      '$state',
      '$stateParams',
      'User',
      function($scope, $state, $stateParams, User) {

        $scope.recaptcha = {};
        var info = {
          accessToken: $stateParams.access_token,
          userId: $stateParams.user_id
        };
        $scope.resetPassword = reset_password;

        activate();

        //////////////////////////////////////////////////////////////////////

        function activate() {
          $('#resetPasswordForm')
            .parsley()
            .on('form:validated', () => {$scope.$apply})
            .on('field:validated', parsleyField => {
              if($(parsleyField.$element).hasClass('md-input')) {
                $scope.$apply();
              }
            })
        }

        // reset password
        function reset_password($event) {
          if (!$scope.recaptcha.reset) {
            alert('check recaptcha');
          } else {
            info.password = $scope.password;
            info.confirmation = $scope.confirmation;
            User.changePassword({}, info,
              function(data, headers) {
                $state.go('login');
                console.log(data);
                console.log(headers);
              },
              function(response) {
                console.log(err);
              });
          }
        }
      }
    ]);
}());
