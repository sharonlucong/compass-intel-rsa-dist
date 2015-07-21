(function() {
  define(['./baseController'], function() {
    'use strict';
    return angular.module('compass.controllers').controller('serverCtrl', [
      '$scope', 'dataService', '$filter', 'machinesHostsData', 'wizardService', 'rsaExistingMachinesData', function($scope, dataService, $filter, machinesHostsData, wizardService, existingRsaMachines) {
        var machine, memory, _i, _j, _len, _len1, _ref;
        $scope.hideunselected = '';
        $scope.search = {};
        $scope.allservers = machinesHostsData;
        wizardService.getServerColumns().success(function(data) {
          return $scope.server_columns = data.machines_hosts;
        });
        wizardService.getRSABaseURL().success(function(data) {
          return $scope.rsaBaseURLs = data;
        });
        for (_i = 0, _len = existingRsaMachines.length; _i < _len; _i++) {
          machine = existingRsaMachines[_i];
          machine.memorySize = 0;
          _ref = machine.machine_memories;
          for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
            memory = _ref[_j];
            machine.memorySize += memory.memory_module_capacity;
          }
        }
        $scope.allRSAMachines = existingRsaMachines;
        wizardService.displayDataInTable($scope, $scope.allservers);
        wizardService.watchingTriggeredStep($scope);
        wizardService.getDetailDisplayName($scope);
        $scope.rsaSelectAllBaseUrl = function(flag) {
          var url, _k, _l, _len2, _len3, _ref1, _ref2, _results, _results1;
          if (flag) {
            _ref1 = $scope.rsaBaseURLs;
            _results = [];
            for (_k = 0, _len2 = _ref1.length; _k < _len2; _k++) {
              url = _ref1[_k];
              _results.push(url.check = true);
            }
            return _results;
          } else {
            _ref2 = $scope.rsaBaseURLs;
            _results1 = [];
            for (_l = 0, _len3 = _ref2.length; _l < _len3; _l++) {
              url = _ref2[_l];
              _results1.push(url.check = false);
            }
            return _results1;
          }
        };
        $scope.rsaDiscoverServers = function() {
          var count, rsaBaseUrl, _k, _len2, _ref1;
          count = 0;
          _ref1 = $scope.rsaBaseURLs;
          for (_k = 0, _len2 = _ref1.length; _k < _len2; _k++) {
            rsaBaseUrl = _ref1[_k];
            if (rsaBaseUrl.check) {
              count++;
              (function(rsaBaseUrl) {
                return wizardService.triggerFindRsaMachine(rsaBaseUrl.id).success(function() {
                  return wizardService.getAllRsaMachinesPeriodically($scope, rsaBaseUrl);
                });
              })(rsaBaseUrl);
            }
          }
          if (count === 0) {
            return alert("You have to select one URL to find servers");
          }
        };
        $scope.addRsaUrl = function() {
          return wizardService.addRsaManager($scope.rsaUrl).success(function(data) {
            return $scope.rsaBaseURLs.push(data);
          });
        };
        return wizardService.watchAndAddNewServers($scope);
      }
    ]);
  });

}).call(this);
