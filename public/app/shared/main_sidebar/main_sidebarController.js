angular
    .module('altairApp')
    .controller('main_sidebarCtrl', [
        '$timeout',
        '$scope',
        '$rootScope',
        function ($timeout,$scope,$rootScope) {

            $scope.$on('onLastRepeat', function (scope, element, attrs) {
                $timeout(function() {
                    if(!$rootScope.miniSidebarActive) {
                        // activate current section
                        $('#sidebar_main').find('.current_section > a').trigger('click');
                    } else {
                        // add tooltips to mini sidebar
                        var tooltip_elem = $('#sidebar_main').find('.menu_tooltip');
                        tooltip_elem.each(function() {
                            var $this = $(this);

                            $this.attr('title',$this.find('.menu_title').text());
                            UIkit.tooltip($this, {
                                pos: 'right'
                            });
                        });
                    }
                })
            });

            // menu entries
            $scope.sections = [
                {
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
                    submenu: [
                        {
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
                    submenu: [
                        {
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

            ]

        }
    ])
;
