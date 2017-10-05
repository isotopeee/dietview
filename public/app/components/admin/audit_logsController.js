(function() {
  'use strict';

  angular
    .module('dietviewApp')
    .controller('audit_logsCtrl', [
      '$scope',
      '$state',
      'modals',
      'audit_logs_data',
      'AuditLog',
      'toastr',
      function($scope, $state, modals, audit_logs_data, AuditLog, toastr) {
        $scope.audit_logs_data = audit_logs_data;
        $scope.pageSize = 10;
        $scope.filter_type_options = [{
            value: 'create',
            title: 'Create'
          },
          {
            value: 'update',
            title: 'Update'
          },
          {
            value: 'soft_delete',
            title: 'Soft Delete'
          }
        ];
        $scope.filter_type_config = {
          create: false,
          valueField: 'value',
          labelField: 'title',
          placeholder: 'Event Type...'
        };
        $scope.filterData = {
          type: ["create", "update", "soft_delete"]
        };
        $scope.filter_pageSize = ['5', '10', '15'];

        $scope.refresh = function($event) {
          refresh();
        };

        ////////////////////////////////////////////////////////////////////

        function clear_form() {
          $scope.ingredient = {};
        }

        function get_auditLogs() {
          const filter = {
            include: 'user',
            order: 'eventDate DESC'
          };
          AuditLog.find({filter: filter}).$promise.then(function(data) {
            $scope.audit_logs_data = data;
            toastr.info("Audit Logs list has been updated.", 'Audit Logs List Updated');
          });
        }

        function refresh() {
          modals.confirm('Any unsaved changes will be discarded. Do you want to continue?', function() {
            get_auditLogs();
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
