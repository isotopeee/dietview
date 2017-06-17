(function() {
  'use strict';
  angular
    .module('dietviewApp')
    .controller('subscriptions_listCtrl', [
      '$scope',
      '$state',
      'modals',
      'subscriptions_data',
      'Subscription',
      function($scope, $state, modals, subscriptions_data, Subscription) {
        $scope.subscriptions_data = subscriptions_data;
        $scope.pageSize = 10;
        $scope.filter_status_options = [{
            value: 'pending',
            title: 'pending'
          },
          {
            value: 'active',
            title: 'active'
          },
          {
            value: 'inactive',
            title: 'inactive'
          }
        ];
        $scope.filter_status_config = {
          create: false,
          valueField: 'value',
          labelField: 'title',
          placeholder: 'Status...'
        };
        $scope.filterData = {
          status: ["pending", "active", "inactive"]
        };
        $scope.filter_pageSize = ['5', '10', '15'];

        $scope.approve = approve;

        ////////////////////////////////////////////////////////////////////////

        function approve($event, subscription) {
          modals.confirm('Approve subscription?', function() {
            subscription.status = 'active';
            subscription.isActive = true;
            subscription.$save().then(function(data) {
              modals.alert('Subscription is now active!');
            })
          });
        }
      }
    ]);
}());
Array.prototype.contains = function(obj) {
  var i = this.length;
  while (i--) {
    if (this[i] === obj) {
      return true;
    }
  }
  return false;
};
