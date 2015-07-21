(function() {
  define(['./baseService'], function() {
    'use strict';
    var DS;
    DS = (function() {
      function DS($http, settings) {
        this.$http = $http;
        this.settings = settings;
      }

      DS.prototype.login = function(user) {
        return this.$http.post(this.settings.apiUrlBase + '/users/login', angular.toJson(user));
      };

      DS.prototype.logout = function() {
        return this.$http.post(this.settings.apiUrlBase + '/users/logout', null);
      };

      DS.prototype.getClusters = function() {
        return this.$http.get(this.settings.apiUrlBase + '/clusters');
      };

      DS.prototype.getClusterProgress = function(id) {
        return this.$http.get(this.settings.apiUrlBase + '/clusters/' + id + '/state');
      };

      DS.prototype.getClusterById = function(id) {
        return this.$http.get(this.settings.apiUrlBase + '/clusters/' + id);
      };

      DS.prototype.getAllMachineHosts = function(os) {
        if (os) {
          return $http.get(this.settings.apiUrlBase + '/switches-machines-hosts?os_id=' + os);
        } else {
          return this.$http.get(this.settings.apiUrlBase + '/switches-machines-hosts');
        }
      };

      DS.prototype.getWizardSteps = function() {
        return this.$http.get(this.settings.metadataUrlBase + '/wizard_steps.json');
      };

      DS.prototype.getClusterConfig = function(id) {
        return this.$http.get(this.settings.apiUrlBase + '/clusters/' + id + '/config');
      };

      DS.prototype.getAdapters = function() {
        return this.$http.get(this.settings.apiUrlBase + '/adapters');
      };

      DS.prototype.getWizardPreConfig = function() {
        return this.$http.get(this.settings.metadataUrlBase + '/config.json');
      };

      DS.prototype.getServerColumns = function() {
        return this.$http.get(this.settings.metadataUrlBase + '/machine_host_columns.json');
      };

      DS.prototype.getSwitches = function() {
        return this.$http.get(this.settings.apiUrlBase + '/switches');
      };

      DS.prototype.postSwitches = function(sw) {
        return this.$http.post(this.settings.apiUrlBase + '/switches', angular.toJson(sw));
      };

      DS.prototype.getTimezones = function() {
        return this.$http.get(this.settings.metadataUrlBase + '/timezone.json');
      };

      DS.prototype.getSubnetConfig = function() {
        return this.$http.get(this.settings.apiUrlBase + '/subnets');
      };

      DS.prototype.getClusterHosts = function(clusterId) {
        return this.$http.get(this.settings.apiUrlBase + '/clusters/' + clusterId + '/hosts');
      };

      DS.prototype.postClusterActions = function(id, actions) {
        return this.$http.post(this.settings.apiUrlBase + '/clusters/' + id + '/action', angular.toJson(actions));
      };

      DS.prototype.updateClusterConfig = function(id, config) {
        return this.$http.put(this.settings.apiUrlBase + '/clusters/' + id + '/config', angular.toJson(config));
      };

      DS.prototype.putHost = function(id, config) {
        return this.$http.put(this.settings.apiUrlBase + '/hosts/' + id, angular.toJson(config));
      };

      DS.prototype.postHostNetwork = function(id, network) {
        return this.$http.post(this.settings.apiUrlBase + '/hosts/' + id + '/networks', angular.toJson(network));
      };

      DS.prototype.putHostNetwork = function(id, networkId, network) {
        return this.$http.put(this.settings.apiUrlBase + '/hosts/' + id + '/networks/' + networkId, angular.toJson(network));
      };

      DS.prototype.updateClusterHost = function(clusterId, hostId, data) {
        return this.$http.put(this.settings.apiUrlBase + '/clusters/' + clusterId + '/hosts/' + hostId, angular.toJson(data));
      };

      DS.prototype.createCluster = function(cluster) {
        return this.$http.post(this.settings.apiUrlBase + '/clusters', angular.toJson(cluster));
      };

      DS.prototype.deleteSubnet = function(id) {
        return this.$http["delete"](this.settings.apiUrlBase + '/subnets/' + id);
      };

      DS.prototype.postSubnetConfig = function(subnet_config) {
        return this.$http.post(this.settings.apiUrlBase + '/subnets', angular.toJson(subnet_config));
      };

      DS.prototype.putSubnetConfig = function(id, subnet_config) {
        return this.$http.put(this.settings.apiUrlBase + '/subnets/' + id, angular.toJson(subnet_config));
      };

      DS.prototype.getSwitchById = function(id) {
        return this.$http.get(this.settings.apiUrlBase + '/switches/' + id);
      };

      DS.prototype.getSwitchMachines = function(id) {
        return this.$http.get(this.settings.apiUrlBase + '/switches/' + id + '/machines');
      };

      DS.prototype.postSwitchAction = function(id, action) {
        return this.$http.post(this.settings.apiUrlBase + '/switches/' + id + '/action', angular.toJson(action));
      };

      DS.prototype.getClusterConfig = function(id) {
        return this.$http.get(this.settings.apiUrlBase + '/clusters/' + id + '/config');
      };

      DS.prototype.getClusterHostProgress = function(clusterId, hostId) {
        return this.$http.get(this.settings.apiUrlBase + '/clusters/' + clusterId + '/hosts/' + hostId + '/state');
      };

      DS.prototype.putSwitches = function(id, sw) {
        return this.$http.put(this.settings.apiUrlBase + '/switches/' + id, angular.toJson(sw));
      };

      DS.prototype.getUserSetting = function() {
        return this.$http.get(this.settings.apiUrlBase + '/users');
      };

      DS.prototype.getUserLog = function() {
        return this.$http.get(this.settings.apiUrlBase + '/users/logs');
      };

      DS.prototype.getHealthReports = function(id) {
        return this.$http.get(this.settings.apiUrlBase + '/clusters/' + id + '/healthreports');
      };

      DS.prototype.getIndividualReports = function(id, name) {
        return this.$http.get(this.settings.apiUrlBase + '/clusters/' + id + '/healthreports/' + name);
      };

      DS.prototype.postHealthCheck = function(id, checkHealth) {
        return this.$http.post(this.settings.apiUrlBase + '/clusters/' + id + '/action', angular.toJson(checkHealth));
      };

      DS.prototype.startHealthCheck = function(id, request) {
        return this.$http.post(this.settings.apiUrlBase + '/clusters/' + id + '/action', angular.toJson(request));
      };

      DS.prototype.getOsGlobalConfigMetaData = function(id) {
        return this.$http.get(this.settings.apiUrlBase + '/oses/' + id + '/ui_metadata');
      };

      DS.prototype.getPackageConfigUiElements = function(id) {
        return this.$http.get(this.settings.apiUrlBase + '/flavors/' + id + '/ui_metadata');
      };

      DS.prototype.uploadSwitches = function(data) {
        return this.$http.post(this.settings.apiUrlBase + '/switchesbatch', angular.toJson(data));
      };

      DS.prototype.uploadMachines = function(data) {
        return this.$http.post(this.settings.apiUrlBase + '/switches/machines', angular.toJson(data));
      };

      DS.prototype.postSigleMachine = function(switch_id, request) {
        return this.$http.post(this.settings.apiUrlBase + '/switches/' + switch_id + '/machines', angular.toJson(request));
      };

      DS.prototype.getRSABaseURL = function() {
        return this.$http.get(this.settings.apiUrlBase + '/rsa-managers');
      };

      DS.prototype.getAllRsaMachines = function(id) {
        return this.$http.get(this.settings.apiUrlBase + '/rsa-managers/' + id + '/machines/details');
      };

      DS.prototype.getDetailDisplayName = function() {
        return this.$http.get(this.settings.metadataUrlBase + '/rsa_machine_detail_map.json');
      };

      DS.prototype.getExistingRsaMachines = function() {
        return this.$http.get(this.settings.apiUrlBase + '/rsa-machines?show_details');
      };

      DS.prototype.triggerFindRsaMachine = function(id) {
        return this.$http.post(this.settings.apiUrlBase + '/rsa-managers/' + id);
      };

      DS.prototype.getFindRsaMachineStatus = function(id) {
        return this.$http.get(this.settings.apiUrlBase + '/rsa-managers/' + id);
      };

      DS.prototype.addRsaManager = function(request) {
        return this.$http.post(this.settings.apiUrlBase + '/rsa-managers', angular.toJson(request));
      };

      DS.prototype.getRSAManagers = function() {
        return this.$http.get(this.settings.apiUrlBase + '/rsa-managers');
      };

      DS.prototype.getPodRacks = function(pod_id) {
        return this.$http.get(this.settings.apiUrlBase + '/rsa-managers/' + pod_id + '/racks');
      };

      DS.prototype.getOneRack = function(rack_id) {
        return this.$http.get(this.settings.apiUrlBase + '/rsa-racks/' + rack_id);
      };

      DS.prototype.getRackDrawers = function(rack_id) {
        return this.$http.get(this.settings.apiUrlBase + '/rsa-racks/' + rack_id + '/drawers');
      };

      DS.prototype.getRackThermalZones = function(rack_id) {
        return this.$http.get(this.settings.apiUrlBase + '/rsa-racks/' + rack_id + '/thermal-zones');
      };

      DS.prototype.getRackPowerZones = function(rack_id) {
        return this.$http.get(this.settings.apiUrlBase + '/rsa-racks/' + rack_id + '/power-zones');
      };

      DS.prototype.getRackDrawerModules = function(drawer_id) {
        return this.$http.get(this.settings.apiUrlBase + '/rsa-drawers/' + drawer_id + '/modules');
      };

      DS.prototype.getModuleStorage = function(module_id) {
        return this.$http.get(this.settings.apiUrlBase + '/rsa-modules/' + module_id + '/storage-devices');
      };

      DS.prototype.getRackDrawerModuleProcessors = function(drawer_id, module_id) {
        return this.$http.get(this.settings.apiUrlBase + '/rsa-modules/' + module_id + '/processors');
      };

      DS.prototype.getRackDrawerModuleMemories = function(drawer_id, module_id) {
        return this.$http.get(this.settings.apiUrlBase + '/rsa-modules/' + module_id + '/memories');
      };

      DS.prototype.getRackPowerZonesSupplyUnits = function(rack_id, zone_id) {
        return this.$http.get(this.settings.apiUrlBase + '/rsa-racks/' + rack_id + '/power-zones/' + zone_id + '/supply-units');
      };

      DS.prototype.getRackThermalZonesFans = function(rack_id, zone_id) {
        return this.$http.get(this.settings.apiUrlBase + '/rsa-racks/' + rack_id + '/thermal-zones/' + zone_id + '/fans');
      };

      DS.prototype.getCpuUsage = function(rack_id) {
        return this.$http.get(this.settings.apiUrlBase + '/rsa-racks/' + rack_id + '/cpu-usage');
      };

      DS.prototype.getMemoryUsage = function(rack_id) {
        return this.$http.get(this.settings.apiUrlBase + '/rsa-racks/' + rack_id + '/memory-usage');
      };

      DS.prototype.getStorageUsage = function(rack_id) {
        return this.$http.get(this.settings.apiUrlBase + '/rsa-racks/' + rack_id + '/storage-usage');
      };

      return DS;

    })();
    return angular.module('compass.services').service('dataService', [
      '$http', 'settings', function($http, settings) {
        return new DS($http, settings);
      }
    ]);
  });

}).call(this);
