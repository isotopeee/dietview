(function() {
  'use strict';

  angular
    .module('dietviewApp')
    .controller('scrum_boardCtrl', [
      '$rootScope',
      '$scope',
      'tasks_list',
      'dragulaService',
      'modals',
      'Task',
      function($rootScope, $scope, tasks_list, dragulaService, modals, Task) {
        $scope.tasks_list = tasks_list;
        $scope.task_groups = [{
            id: 'todo',
            name: 'To Do'
          },
          {
            id: 'inProgress',
            name: 'In progress'
          },
          {
            id: 'done',
            name: 'Done'
          }
        ];
        // new task
        $scope.newTask = {
          name: '',
          assignee: '',
          group: ''
        };
        $scope.newTask_assignee = [
          'Chef',
          'Delivery',
          'Nutritionist',
          'Secretary'
        ];
        $scope.newTask_assignee_config = {
          create: false,
          maxItems: 1,
          valueField: 'id',
          labelField: 'title',
          placeholder: 'Select Assignee...'
        };
        $scope.newTask_group = [{
            name: 'todo',
            title: 'To Do'
          },
          {
            name: 'inProgress',
            title: 'In Progress'
          },
          {
            name: 'done',
            title: 'Done'
          }
        ];
        $scope.newTask_group_config = {
          create: false,
          maxItems: 1,
          valueField: 'name',
          labelField: 'title',
          placeholder: 'Select Group...'
        };

        $scope.addTask = addTask;
        $scope.deleteTask = deleteTask;
        $scope.taskInfo = taskInfo;


        $scope.$on('tasks.drop', function(e, el, target, source) {
          var group = target[0].id;
          var task = getTaskById(el.attr('id'));

          task.group = group;
          task.$save().then(function (data) {
            // TODO: Notify user for updates
          });

        });


        $scope.$on('$destroy', function() {
          $rootScope.page_full_height = false;
        });

        $scope.$on('onLastRepeat', function(scope, element, attrs) {
          // set width for scrum board container
          var $scrumBoard = $('#scrum_board'),
            childWidth = $scrumBoard.children('div').width(),
            childsCount = $scrumBoard.children('div').length;

          $scrumBoard.width(childWidth * childsCount);
        });

        activate();

        ////////////////////////////////////////////////////////////////////////

        function activate() {
          $rootScope.page_full_height = true;
        }

        function clear_form() {
          $scope.newTask = {
            name: '',
            assignee: '',
            group: ''
          };
        }

        function addTask($event) {
          modals.confirm('Add new task?', function () {
            Task.create({
              title: $scope.newTask.title,
              description: $scope.newTask.description,
              assignee: $scope.newTask.assignee,
              group: $scope.newTask.group,
              status: $scope.newTask.status
            }).$promise.then(function (data) {
              $scope.tasks_list.push($scope.newTask);
              modals.alert('New task has been added!');
              clear_form();
            });
          });
        }

        function deleteTask($event) {
          modals.confirm('Are you sure you want to delete the task?', function() {
            Task.deleteById({
              id: $scope.info.id
            }).$promise.then(function (data) {
              for (var i = 0; i < $scope.tasks_list.length; i++) {
                if ($scope.info.id === $scope.tasks_list[i].id) {
                  $scope.tasks_list.splice(i, 1);
                  UIkit.modal('#task_info').hide();
                  break;
                }
              }
              modals.alert('The task has been deleted');
            });
          });
        }

        function taskInfo(task) {
          $scope.info = {
              id: task.id,
              name: task.name,
              title: task.title,
              status: task.status,
              description: task.description,
              assignee: task.assignee
          };
        }

        function getTaskById(id) {
          var task = null;
          for (var i = 0; i < $scope.tasks_list.length; i++) {
            if (id === $scope.tasks_list[i].id) {
              task = $scope.tasks_list[i];
              break;
            }
          }
          return task;
        }
      }
    ]);
}());
