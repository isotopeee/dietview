(function() {
  'use strict';

  angular
    .module('dietviewApp')
    .controller('main_sidebarCtrl', [
      '$timeout',
      '$scope',
      '$rootScope',
      'User',
      function($timeout, $scope, $rootScope, User) {
        // menu entries
        $scope.sections = [{
            id: 0,
            title: 'Scrum Board',
            icon: '&#xE85C;',
            link: 'restricted.pages.scrum_board'
          },
          {
            id: 1,
            title: 'Customer Vitals',
            icon: '&#xEB43;',
            link: 'restricted.nutritionist.customers_vitals'
          },
          {
            id: 2,
            title: 'Products',
            icon: '&#xE561;',
            submenu: [{
                title: 'Ingredients',
                link: 'restricted.products.meal_items'
              },
              {
                title: 'Meals',
                link: 'restricted.products.meals'
              },
              {
                title: 'Meal Plans',
                link: 'restricted.products.meal_plans'
              }
            ]
          },
          {
            id: 3,
            title: 'Reports',
            icon: '&#xE85D;',
            submenu: [{
                title: 'Production',
                link: 'restricted.reports.production'
              },
              {
                title: 'Delivery List',
                link: 'restricted.reports.deliveries'
              },
              {
                title: 'Receipts',
                link: 'restricted.reports.receipts'
              },
              {
                title: 'Raw Ingredients',
                link: 'restricted.reports.rawIngredients'
              }
            ]
          },
          {
            id: 4,
            title: 'Subscription',
            icon: '&#xE064;',
            link: 'restricted.subscriptions.list'
          },
          {
            id: 5,
            title: 'User Profile',
            icon: '&#xE87C;',
            link: 'restricted.pages.user_profile'
          },
        ];

        $scope.$on('onLastRepeat', function(scope, element, attrs) {
          $timeout(function() {
            if (!$rootScope.miniSidebarActive) {
              // activate current section
              $('#sidebar_main').find('.current_section > a').trigger('click');
            } else {
              // add tooltips to mini sidebar
              var tooltip_elem = $('#sidebar_main').find('.menu_tooltip');
              tooltip_elem.each(function() {
                var $this = $(this);

                $this.attr('title', $this.find('.menu_title').text());
                UIkit.tooltip($this, {
                  pos: 'right'
                });
              });
            }
          });
        });

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate() {
          User.getCurrent()
              .$promise
              .then(user => {
                if (user.account.role === 'admin') {
                  $scope.sections.push({
                    id: 6,
                    title: 'Admin Console',
                    icon: '&#xE8D3;',
                    link: 'restricted.admin.console'
                  },
                  {
                    id: 7,
                    title: 'Audit Logs',
                    icon: 'announcement',
                    link: 'restricted.admin.audit_logs'
                  });
                }
              });
        }
      }
    ]);
}());
