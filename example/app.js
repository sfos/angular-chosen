'use strict';

angular.module('app', ['angular-chosen']);

angular.module('app')
  .controller('AngularCtrl', function($scope, $timeout, ChosenService) {
    ChosenService.setPlaceholderTextSingle('- Select from the list below -');

    // Base
    $scope.options = {
      selectedStaticOption: undefined,
      selectedOptionFromHash: undefined,
      selectedDisabledOption: undefined,
      selectedMultipleOptions: undefined,
      selectedGroupOption: undefined,
      selectedDatesetOption: undefined,
      selectedPreselectedOption: undefined,
      selectedSearchWithPlaceholder: undefined
    };

    // Hash
    $scope.optionsAsHash = ['grooo', 'wowowowow', 'lakakalakakl', 'yadayada', 'insight', 'delve', 'synergy'];

    // Disabling
    var optionsForEmptyCollection = ['look', 'i', 'have', 'data'];
    $scope.optionsForEmptyCollection = optionsForEmptyCollection;

    $scope.isEmptyCollection = false;
    $scope.toggleEmpty = function() {
      $scope.isEmptyCollection = !$scope.isEmptyCollection;

      if ($scope.isEmptyCollection) {
        $scope.options.selectedDisabledOption = undefined;
        $scope.optionsForEmptyCollection = [];
      }
      else {
        $scope.optionsForEmptyCollection = optionsForEmptyCollection;
      }
    };

    // External changing
    $scope.optionsForExternalChange = {
      cat: 'Cat',
      dog: 'Dog',
      hamster: 'Hamster'
    };
    $scope.options.selectedMultipleOptions = ['cat'];

    // Grouped options
    $scope.groupedOptions = [{
      text: 'Cat',
      group: 'Animal'
    }, {
      text: 'Dog',
      group: 'Animal'
    }, {
      text: 'Hamster',
      group: 'Animal'
    }, {
      text: 'Parrot',
      group: 'Bird'
    }];

    $scope.dataSets = [
      [{
        text: 'Cat',
        group: 'Animal'
      }, {
        text: 'Dog',
        group: 'Animal'
      }, {
        text: 'Hamster',
        group: 'Animal'
      }, {
        text: 'Parrot',
        group: 'Bird'
      }],
      [{
        text: 'Frustration',
        group: 'Mood'
      }, {
        text: 'Anger',
        group: 'Mood'
      }, {
        text: 'Danger',
        group: 'State'
      }, {
        text: 'Evil',
        group: 'State'
      }]
    ];

    $scope.activeDataSet = [];

    $scope.setActiveDataset = function(index) {
      $scope.activeDataSet = angular.copy($scope.dataSets[index]);
    };

    $timeout(function() {
      // Grouped options
      $scope.timedOptions = [{
        text: 'Cat',
        group: 'Animal'
      }, {
        text: 'Dog',
        group: 'Animal'
      }, {
        text: 'Hamster',
        group: 'Animal'
      }, {
        text: 'Parrot',
        group: 'Bird'
      }];
    }, 5000);

    $timeout(function() {
      $scope.options.selectedPreselectedOption = $scope.timedOptions[2];
    }, 7000);
  });