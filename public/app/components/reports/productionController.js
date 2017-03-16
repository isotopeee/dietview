angular
    .module('altairApp')
    .controller('productionCtrl', [
        '$scope',
        function ($scope) {

            $scope.exportAction = function(){
              $scope.$broadcast('export-pdf', {});

            }

        }
    ]);
