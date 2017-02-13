angular
    .module('altairApp')
    .controller('user_editCtrl', [
        '$rootScope',
        '$scope',
        'user_data',
        'groups_data',
        function ($rootScope,$scope,user_data,groups_data) {

            $scope.user_data = user_data[0];
            $scope.user_data_contacts = user_data[0].contact;

        }
    ])
;
