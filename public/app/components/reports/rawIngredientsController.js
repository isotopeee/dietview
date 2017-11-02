(function() {
  'use strict';

  angular
      .module('dietviewApp')
      .controller('rawIngredientsCtrl', [
          '$scope',
          '$window',
          'rawIngredients_data' ,
          'reports',
          'Subscription',
          'User',
          function ($scope, $window, rawIngredients_data, reports, Subscription, User) {
            $scope.production_list = [];
            let currentUser = null;
            var today = new Date();
            var tod = today.getDate();
            $scope.productionDate = today;
            $scope.rawIngredients = [];
            $scope.date = { 
              today: today.toLocaleDateString() 
            };
            $scope.onProcess = false;

            $scope.exportToPDF = exportToPDF;
            $scope.generateRawIngredientsList = generateRawIngredientsList;

            activate();

            ///////////////////////////////////////////////////////

            function activate() {
              _filterRawIngredientsList(today);
              $scope.rawIngredients = _normalizeRawIngredientsRequirements(_aggregateIngredientsRequirements($scope.production_list));
              User.getCurrent().$promise.then(({account: {profile: {firstname, lastname}}}) => {
                currentUser = `${firstname} ${lastname}`;
              });
            }

            function exportToPDF() {
              // TODO: Export production list to pdf
              // NOTE: Refer to https://stackoverflow.com/questions/21628378/angularjs-display-blob-pdf-in-an-angular-app
              var shortid = 'r1az9X5jW';
              var data = {
                rawIngredients: $scope.rawIngredients,
                date: $scope.productionDate.toLocaleDateString(),
                preparedBy: currentUser
              };
              console.log(data);
              reports.exportToPDF(shortid, data).then(function (reportFileUrl) {
                  $window.open(reportFileUrl, '_self', '');
              });
            }

            function generateRawIngredientsList() {
              showProgressbar();
    
              const filter = {
                where: {
                  status: 'active'
                },
                include: ['user', {mealPlan: {meals: 'mealItems'}}],
                order: 'mealPlanId ASC'
              };
    
              Subscription.find({filter:filter}).$promise
              .then(function(data) {
                rawIngredients_data = data;
                _filterRawIngredientsList($scope.productionDate);
                $scope.rawIngredients = _normalizeRawIngredientsRequirements(_aggregateIngredientsRequirements($scope.production_list));
                hideProgressbar();
              });
            }
    
            function showProgressbar(){
              $scope.onProcess = true;
            }
    
            function hideProgressbar(){
              $scope.onProcess = false;
            }
    
            function toggleProgressbar(){
              $scope.onProcess = !$scope.onProcess;
            }

            function _filterRawIngredientsList(productionDate) {
              $scope.production_list = [];
              for(var i = 0 ; i < rawIngredients_data.length ; i++) {
                  var startDate = new Date(rawIngredients_data[i].startDate);
                  var endDate = new Date(rawIngredients_data[i].endDate);
                  var start = startDate.getDate();
                  var indexx = tod - start;
                  if(startDate < productionDate && productionDate < endDate)
                  {
                    $scope.production_list.push(rawIngredients_data[i]);
                  }
              }
            }

            function _toDecimal(numerator, denominator) {
              return parseFloat(numerator / denominator);
            }

            function _parseUnit(unit) {
              unit.trim();
              return {
                unit: unit.slice(unit.indexOf(' ') + 1 , unit.length),
                value: unit.includes('/') ? _toDecimal(unit[0], unit[2]) : parseFloat(unit)
              }
            }

            function _getMealRequirements({name, mealItems}) {
              const requirements = mealItems.map(mi => ({
                ingredientName: mi.name,
                requirement: _parseUnit(mi.description)
              }));
              return requirements;
            }

            function _getMealPlanRequirements({name, meals}) {
              const requirements = meals.reduce((prev, current) => {
                return [...prev, ..._getMealRequirements(current)];
              }, []);

              return requirements;
            }

            function _aggregateIngredientsRequirements(subscriptions) {
              const rawIngredients = subscriptions.reduce((prev, current) => {
                return [...prev, ..._getMealPlanRequirements(current.mealPlan)];
              }, []);

              return rawIngredients;
            }

            function _normalizeRawIngredientsRequirements(rawIngredients) {
              const normalizedRawIngredients = rawIngredients.reduce((prev, current) => {
                const existingIngredientIndex = prev.findIndex(ingredient => ingredient.ingredientName === current.ingredientName);
                if (existingIngredientIndex !== -1) {
                  const existingIngredient = prev[existingIngredientIndex];
                  existingIngredient.requirement.value += current.requirement.value;
                  return prev;
                } else {
                  return [...prev, current];
                }
              }, []).sort((a, b) => {
                const nameA = a.ingredientName.toUpperCase();
                const nameB = b.ingredientName.toUpperCase();
                if (nameA < nameB) {
                  return -1
                }
                else if (nameA > nameB) {
                  return 1
                } else {
                  return 0
                }
              });

              return normalizedRawIngredients;
            }
          }
      ]);
}());
