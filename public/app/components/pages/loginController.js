angular
    .module('altairApp')
    .controller('loginCtrl', [
        '$scope',
        '$state',
        '$rootScope',
        'utils',
        'User',
        function ($scope,$state,$rootScope,utils,User) {

            $scope.registerFormActive = false;
            $scope.rememberMe = false;
            $scope.recaptcha = {};

            var $login_card = $('#login_card'),
                $login_form = $('#login_form'),
                $login_help = $('#login_help'),
                $register_form = $('#register_form'),
                $login_password_reset = $('#login_password_reset');

            // show login form (hide other forms)
            var login_form_show = function() {
                $login_form
                    .show()
                    .siblings()
                    .hide();
            };

            // show register form (hide other forms)
            var register_form_show = function() {
                $register_form
                    .show()
                    .siblings()
                    .hide();
            };

            // show login help (hide other forms)
            var login_help_show = function() {
                $login_help
                    .show()
                    .siblings()
                    .hide();
            };

            // show password reset form (hide other forms)
            var password_reset_show = function() {
                $login_password_reset
                    .show()
                    .siblings()
                    .hide();
            };

            // authenticate User
            var authenticate = function () {
              if (!$scope.recaptcha.login) {
                alert('check recaptcha');
              } else {
                var credentials = $scope.credentials,
                  rememberMe = $scope.rememberMe;

                  // add realm to credentials
                  credentials.realm = 'dietview';

                  User.login({ rememberMe: $scope.rememberMe }, credentials,
                  function (data, headers) {
                    console.log(data);
                    console.log(headers);
                    $state.go("restricted.dashboard");
                  },
                  function (response) {
                    console.log(response);
                  });
              }
            }

            //request reset password
            var request_reset_password = function () {
              User.resetPassword({}, $scope.reset,
              function (data, headers) {
                console.log(data);
                console.log(headers);
              },
              function (response) {
                console.log(response);
              });
            }

            $scope.loginHelp = function($event) {
                $event.preventDefault();
                utils.card_show_hide($login_card,undefined,login_help_show,undefined);
            };

            $scope.backToLogin = function($event) {
                $event.preventDefault();
                $scope.registerFormActive = false;
                utils.card_show_hide($login_card,undefined,login_form_show,undefined);
            };

            $scope.registerForm = function($event) {
                $event.preventDefault();
                $scope.registerFormActive = true;
                utils.card_show_hide($login_card,undefined,register_form_show,undefined);
            };

            $scope.passwordReset = function($event) {
                $event.preventDefault();
                utils.card_show_hide($login_card,undefined,password_reset_show,undefined);
            };

            $scope.authenticate = function ($event) {
              authenticate();
            };

            $scope.requestResetPassword = function ($event) {
              request_reset_password();
            };
        }
    ]);
