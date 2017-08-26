(function() {
  'use strict';

  angular
    .module('dietviewApp')
    .controller('main_headerCtrl', [
      '$timeout',
      '$scope',
      '$window',
      '$state',
      'User',
      function($timeout, $scope, $window, $state, User) {
        $scope.user_data = {
          avatar: "assets/img/avatars/avatar_11_tn.png",
        };

        $scope.logout = logout;

        activate();

        ////////////////////////////////////////////////////////////

        function activate() {
          User.getCurrent()
              .$promise
              .then(user => {
                $scope.user_data.username = user.username;
                $scope.user_data.role = user.account.role;
              });
          $('#menu_top').children('[data-uk-dropdown]').on('show.uk.dropdown', function() {
            $timeout(function() {
              $($window).resize();
            }, 280);
          });
  
          // autocomplete
          $('.header_main_search_form').on('click', '#autocomplete_results .item', function(e) {
            e.preventDefault();
            var $this = $(this);
            $state.go($this.attr('href'));
            $('.header_main_search_input').val('');
          });
        }

        // logout user
        function logout($event) {
          User.logout().$promise
            .then(function(data) {
              console.log('User logged out');
              $state.go('login');
            });
        }
      }
    ]);
}());
