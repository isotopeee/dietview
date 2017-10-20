(function() {
  'use strict';

  angular
    .module('dietviewApp')
    .controller('loginCtrl', [
      '$scope',
      '$state',
      '$rootScope',
      'utils',
      'modals',
      'User',
      'vcRecaptchaService',
      function($scope, $state, $rootScope, utils, modals, User, vcRecaptchaService) {
        $scope.registerFormActive = false;
        $scope.rememberMe = false;
        $scope.recaptcha = {};
        $scope.onProcess = false;
        $scope.invalid = false;

        var $login_card = $('#login_card'),
          $login_form = $('#login_form'),
          $login_help = $('#login_help'),
          $register_form = $('#register_form'),
          $login_password_reset = $('#login_password_reset');

        $scope.loginHelp = function($event) {
          $event.preventDefault();
          utils.card_show_hide($login_card, undefined, login_help_show, undefined);
        };

        $scope.backToLogin = function($event) {
          $event.preventDefault();
          $scope.registerFormActive = false;
          utils.card_show_hide($login_card, undefined, login_form_show, undefined);
        };

        $scope.registerForm = function($event) {
          $event.preventDefault();
          $scope.registerFormActive = true;
          utils.card_show_hide($login_card, undefined, register_form_show, undefined);
        };

        $scope.passwordReset = function($event) {
          $event.preventDefault();
          utils.card_show_hide($login_card, undefined, password_reset_show, undefined);
        };

        $scope.authenticate = function($event) {
          authenticate();
        };

        $scope.requestResetPassword = function($event) {
          request_reset_password();
        };

        activate();

        //////////////////////////////////////////////////////////////////////////

        function activate() {
          // validate form on login
          $('#loginForm')
            .parsley()
            .on('form:validated',function() {
                $scope.$apply();
            })
            .on('field:validated',function(parsleyField) {
                if($(parsleyField.$element).hasClass('md-input')) {
                    $scope.$apply();
                }
            });
        }

        // show login form (hide other forms)
        function login_form_show() {
          $login_form
            .show()
            .siblings()
            .hide();
        }

        // show register form (hide other forms)
        function register_form_show() {
          $register_form
            .show()
            .siblings()
            .hide();
        }

        // show login help (hide other forms)
        function login_help_show() {
          $login_help
            .show()
            .siblings()
            .hide();
        }

        // show password reset form (hide other forms)
        function password_reset_show() {
          $login_password_reset
            .show()
            .siblings()
            .hide();
        }

        // authenticate User
        function authenticate() {
          if (!$scope.recaptcha.login) {
            modals.alert('Check recaptcha');
          } else {
            showProgressbar();

            var credentials = $scope.credentials,
              rememberMe = $scope.rememberMe;

            // add realm to credentials
            credentials.realm = 'dietview';

            User.login({
                rememberMe: $scope.rememberMe
              }, credentials,
              function(data, headers) {
                console.log(data);
                console.log(headers);
                $state.go("restricted.dashboard");
              },
              function(response) {
                hideProgressbar();
                $scope.invalid = true;
                console.log(response);
              });
          }
        }

        //request reset password
        function request_reset_password() {
          if (!$scope.recaptcha.reset) {
            modals.alert('Check recaptcha');
          } else {
            User.resetPassword({}, $scope.reset,
              function(data, headers) {
                console.log(headers);
                console.log(data);
              },
              function(response) {
                console.log(response);
              });
          }
        }

        function showProgressbar(){
          $scope.onProcess = true;
        }

        function hideProgressbar(){
          $scope.onProcess = false;
        }

        function toggleProgressbar(){
          $scope.onProcess = !$scope.onProcess;
        }
      }
    ]);
}());
