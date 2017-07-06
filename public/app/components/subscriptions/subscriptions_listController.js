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
        $scope.viewPayment = viewPayment;

        ////////////////////////////////////////////////////////////////////////

        function approve($event, subscription) {
          modals.confirm('Approve subscription?', function() {
            var today = new Date();
            subscription.startDate = _addDays(today, 1);
            subscription.endDate = _addDays(subscription.startDate, subscription.mealPlan.duration -1);
            subscription.status = 'active';
            subscription.isActive = true;
            subscription.$save().then(function(data) {
              modals.alert('Subscription is now active!');
              $state.reload();
            });
          });
        }

        function viewPayment($event, subscription) {
          $scope.subscription = subscription;
        }

        function _addDays(date, days) {
          var result = new Date(date);
          result.setDate(result.getDate() + days);
          return result;
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
