angular
    .module('altairApp')
    .controller('user_profileCtrl', [
        '$scope',
        'user_data',
        function ($scope,user_data) {
          $scope.user_data = user_data;
        }
    ])
;
