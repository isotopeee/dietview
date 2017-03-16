angular
    .module('altairApp')
    .controller('receiptsCtrl', [
        '$scope',
        function ($scope) {

            $scope.table = {
                'row4': true
            };

            $scope.table2 = {
                'row1': true
            }
        }
    ]);
