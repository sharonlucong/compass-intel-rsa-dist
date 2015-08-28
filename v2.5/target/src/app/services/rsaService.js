(function() {
  define(['./baseService'], function() {
    'use strict';
    var RsaService;
    window.Namespace = {
      "podid": "id",
      "rackid": "id",
      "drawerid": "id",
      "thermalzoneid": "id",
      "powerzoneid": "id",
      "moduleid": "id",
      "processorid": "id",
      "memoryid": "id",
      "numOfFansPresent": "number_of_fans_present",
      "maxFanNumbers": "max_fans_supported",
      "presentTemperature": "present_temperature",
      "outletTemperature": "outlet_temperature",
      "volumetricAirflow": "volumetric_airflow",
      "numOfPsusPresent": "number_of_psus_present",
      "maxNumPsus": "number_of_psus_supported",
      "component_name": "component_name",
      "storageid": "id"
    };
    RsaService = (function() {
      function RsaService(dataService, $q, rsaFactory) {
        this.dataService = dataService;
        this.$q = $q;
        this.rsaFactory = rsaFactory;
      }

      RsaService.prototype.getRSAManagers = function($scope) {
        var $q, deferred;
        $scope.pods = [];
        $q = this.$q;
        deferred = $q.defer();
        this.dataService.getRSAManagers().success(function(data) {
          var key, num, val, value;
          for (num in data) {
            value = data[num];
            for (key in value) {
              val = value[key];
              if (key === Namespace.podid) {
                $scope.pods.push({
                  "title": "POD " + val,
                  "id": val
                });
              }
            }
          }
          return deferred.resolve();
        });
        return deferred.promise;
      };

      RsaService.prototype.getPodRacks = function($scope, podid) {
        var $q, deferred;
        $q = this.$q;
        deferred = $q.defer();
        $scope.racks = [];
        this.dataService.getPodRacks(podid).success(function(data) {
          var key, num, val, value;
          for (num in data) {
            value = data[num];
            for (key in value) {
              val = value[key];
              if (key === Namespace.rackid) {
                $scope.racks.push({
                  "title": "Rack " + val,
                  "id": val
                });
              }
            }
          }
          return deferred.resolve();
        });
        return deferred.promise;
      };

      RsaService.prototype.getAllChartsData = function($scope, rackid) {
        var cpuPromise, deferred, memoryPromise, promises, storagePromise;
        promises = [];
        deferred = this.$q.defer();
        cpuPromise = this.dataService.getCpuUsage(rackid);
        memoryPromise = this.dataService.getMemoryUsage(rackid);
        storagePromise = this.dataService.getStorageUsage(rackid);
        promises.push(cpuPromise);
        promises.push(storagePromise);
        promises.push(memoryPromise);
        this.$q.all(promises).then(function(result) {
          $scope.cpuUsage = [];
          $scope.storageUsage = [];
          $scope.memoryUsage = [];
          $scope.cpuUsage.push({
            "key": "one",
            "y": result[0].data.allocated
          });
          $scope.cpuUsage.push({
            "key": "two",
            "y": result[0].data.total - result[0].data.allocated
          });
          $scope.storageUsage.push({
            "key": "one",
            "y": result[1].data.allocated
          });
          $scope.storageUsage.push({
            "key": "two",
            "y": result[1].data.total - result[1].data.allocated
          });
          $scope.memoryUsage.push({
            "key": "one",
            "y": result[2].data.allocated
          });
          $scope.memoryUsage.push({
            "key": "two",
            "y": result[2].data.total - result[2].data.allocated
          });
          return deferred.resolve();
        });
        return deferred.promise;
      };

      RsaService.prototype.getCpuUsage = function($scope, rackid) {
        $scope.cpuUsage = [];
        return this.dataService.getCpuUsage(rackid).success(function(data) {
          $scope.cpuUsage.push({
            "key": "one",
            "y": data.allocated
          });
          return $scope.cpuUsage.push({
            "key": "two",
            "y": data.total - data.allocated
          });
        });
      };

      RsaService.prototype.getMemoryUsage = function($scope, rackid) {
        $scope.memoryUsage = [];
        return this.dataService.getMemoryUsage(rackid).success(function(data) {
          $scope.memoryUsage.push({
            "key": "one",
            "y": data.allocated
          });
          return $scope.memoryUsage.push({
            "key": "two",
            "y": data.total - data.allocated
          });
        });
      };

      RsaService.prototype.getStorageUsage = function($scope, rackid) {
        $scope.storageUsage = [];
        return this.dataService.getStorageUsage(rackid).success(function(data) {
          $scope.storageUsage.push({
            "key": "one",
            "y": data.allocated
          });
          return $scope.storageUsage.push({
            "key": "two",
            "y": data.total - data.allocated
          });
        });
      };

      RsaService.prototype.getRackDrawers = function($scope, rackid) {
        $scope.drawers = [];
        return this.dataService.getRackDrawers(rackid).success(function(data) {
          var key, num, val, value, _results;
          _results = [];
          for (num in data) {
            value = data[num];
            _results.push((function() {
              var _results1;
              _results1 = [];
              for (key in value) {
                val = value[key];
                if (key === Namespace.drawerid) {
                  _results1.push($scope.drawers.push({
                    "title": "Drawer " + val,
                    "id": val
                  }));
                } else {
                  _results1.push(void 0);
                }
              }
              return _results1;
            })());
          }
          return _results;
        });
      };

      RsaService.prototype.getRackThermalZones = function($scope, rackid) {
        $scope.thermalZones = [];
        return this.dataService.getRackThermalZones(rackid).success(function(data) {
          var key, num, thermalDetail, val, value, _results;
          _results = [];
          for (num in data) {
            value = data[num];
            thermalDetail = {};
            for (key in value) {
              val = value[key];
              if (key === Namespace.thermalzoneid) {
                thermalDetail["id"] = val;
              }
              if (key === Namespace.numOfFansPresent) {
                thermalDetail["presentFanNum"] = val;
              }
              if (key === Namespace.maxFanNumbers) {
                thermalDetail["maxFanNum"] = val;
              }
            }
            _results.push($scope.thermalZones.push(thermalDetail));
          }
          return _results;
        });
      };

      RsaService.prototype.getRackPowerZones = function($scope, rackid) {
        $scope.powerZones = [];
        return this.dataService.getRackPowerZones(rackid).success(function(data) {
          var key, num, powerDetail, val, value, _results;
          _results = [];
          for (num in data) {
            value = data[num];
            powerDetail = {};
            for (key in value) {
              val = value[key];
              if (key === Namespace.powerzoneid) {
                powerDetail["id"] = val;
              }
              if (key === Namespace.numOfPsusPresent) {
                powerDetail["presentPsNum"] = val;
              }
              if (key === Namespace.maxNumPsus) {
                powerDetail["maxPsNum"] = val;
              }
            }
            _results.push($scope.powerZones.push(powerDetail));
          }
          return _results;
        });
      };

      RsaService.prototype.getRackPowerZonesSupplyUnits = function($scope, rackid, zoneid) {
        var deferred;
        $scope.powerData = {};
        $scope.powerData["name"] = "Power Zone " + zoneid;
        $scope.powerData["children"] = [];
        deferred = this.$q.defer();
        this.dataService.getRackPowerZonesSupplyUnits(rackid, zoneid).success(function(data) {
          var idx, num, obj, objkey, objval, unitkey, unitsdetail, unitval, value;
          for (num in data) {
            value = data[num];
            unitsdetail = {};
            unitsdetail["details"] = {};
            unitsdetail["size"] = 200;
            for (unitkey in value) {
              unitval = value[unitkey];
              if (!unitsdetail["name"]) {
                unitsdetail["name"] = value[Namespace.component_name];
              }
              if (typeof unitval !== "string") {
                if (Array.isArray(unitval)) {
                  for (idx in unitval) {
                    obj = unitval[idx];
                    for (objkey in obj) {
                      objval = obj[objkey];
                      unitsdetail["details"][objkey] = objval;
                    }
                  }
                } else {
                  for (objkey in unitval) {
                    objval = unitval[objkey];
                    unitsdetail["details"][objkey] = objval;
                  }
                }
              } else {
                unitsdetail["details"][unitkey] = unitval;
              }
            }
            $scope.powerData["children"].push(unitsdetail);
          }
          return deferred.resolve();
        });
        return deferred.promise;
      };

      RsaService.prototype.getRackThermalZonesFans = function($scope, rackid, zoneid) {
        var $q, deferred;
        $scope.thermalData = {};
        $scope.thermalData["name"] = "Thermal Zone " + zoneid;
        $scope.thermalData["children"] = [];
        $q = this.$q;
        deferred = $q.defer();
        this.dataService.getRackThermalZonesFans(rackid, zoneid).success(function(data) {
          var idx, num, obj, objkey, objval, thermalkey, thermals, thermalval, value;
          for (num in data) {
            value = data[num];
            thermals = {};
            thermals["details"] = {};
            thermals["size"] = 200;
            for (thermalkey in value) {
              thermalval = value[thermalkey];
              if (!thermals["name"]) {
                thermals["name"] = value[Namespace.component_name];
              }
              if (typeof thermalval !== "string") {
                if (Array.isArray(thermalval)) {
                  for (idx in thermalval) {
                    obj = thermalval[idx];
                    for (objkey in obj) {
                      objval = obj[objkey];
                      thermals["details"][objkey] = objval;
                    }
                  }
                } else {
                  for (objkey in thermalval) {
                    objval = thermalval[objkey];
                    thermals["details"][objkey] = objval;
                  }
                }
              } else {
                thermals["details"][thermalkey] = thermalval;
              }
            }
            $scope.thermalData["children"].push(thermals);
          }
          return deferred.resolve();
        });
        return deferred.promise;
      };

      RsaService.prototype.getRackDrawerDetails = function($scope, drawerid) {
        var $q, dataService, deferred;
        dataService = this.dataService;
        $scope.drawerData = {};
        $q = this.$q;
        deferred = $q.defer();
        dataService.getRackDrawerModules(drawerid).success(function(data) {
          var index, key, memoryPromise, moduledetail, num, processorPromise, promises, storagePromise, val, value;
          promises = [];
          $scope.drawerData["name"] = "drawer " + drawerid;
          $scope.drawerData["children"] = [];
          if (data.length === 0) {
            $scope.drawerData["children"].push({});
            $scope.drawerData["size"] = 200;
            return deferred.resolve();
          } else {
            for (num in data) {
              value = data[num];
              for (key in value) {
                val = value[key];
                if (key === Namespace.moduleid) {
                  moduledetail = {};
                  moduledetail["name"] = "Module " + val;
                  moduledetail["children"] = [];
                  $scope.drawerData["children"].push(moduledetail);
                  processorPromise = dataService.getRackDrawerModuleProcessors(drawerid, val);
                  memoryPromise = dataService.getRackDrawerModuleMemories(drawerid, val);
                  storagePromise = dataService.getModuleStorage(val);
                  promises.push(processorPromise);
                  promises.push(memoryPromise);
                  promises.push(storagePromise);
                }
              }
            }
            index = 0;
            return $q.all(promises).then(function(result) {
              var memoriesdetail, processorsdetail, storagesdetail;
              memoriesdetail = {};
              processorsdetail = {};
              storagesdetail = {};
              angular.forEach(result, function(response) {
                angular.forEach(response.data, function(responsedata) {
                  var kmval, memorydetail, mkey, mval, processordetail, processorkey, processorval, storagedetail, storagekey, storageval, str, vmval;
                  if (responsedata[Namespace.component_name] === "Memory Module") {
                    if (!memoriesdetail["name"]) {
                      memoriesdetail["name"] = "Memories";
                      memoriesdetail["children"] = [];
                    }
                    memorydetail = {};
                    memorydetail["name"] = "memory " + responsedata[Namespace.memoryid];
                    memorydetail["details"] = {};
                    memorydetail["size"] = 200;
                    for (mkey in responsedata) {
                      mval = responsedata[mkey];
                      if (typeof mval !== "object") {
                        memorydetail["details"][mkey] = mval;
                      } else {
                        str = "{";
                        for (kmval in mval) {
                          vmval = mval[kmval];
                          str += "\n" + kmval + ": " + vmval + "\n";
                        }
                        str += "}";
                        memorydetail["details"][mkey] = str;
                      }
                    }
                    return memoriesdetail["children"].push(memorydetail);
                  } else if (responsedata[Namespace.component_name] === "Processor") {
                    if (!processorsdetail["name"]) {
                      processorsdetail["name"] = "Processors";
                      processorsdetail["children"] = [];
                    }
                    processordetail = {};
                    processordetail["name"] = "processor " + responsedata[Namespace.processorid];
                    processordetail["details"] = {};
                    processordetail["size"] = 200;
                    for (processorkey in responsedata) {
                      processorval = responsedata[processorkey];
                      if (typeof processorval !== "object") {
                        processordetail["details"][processorkey] = processorval;
                      }
                    }
                    return processorsdetail["children"].push(processordetail);
                  } else {
                    if (!storagesdetail["name"]) {
                      storagesdetail["name"] = "Storage";
                      storagesdetail["children"] = [];
                    }
                    storagedetail = {};
                    storagedetail["name"] = "device " + responsedata[Namespace.storageid];
                    storagedetail["details"] = {};
                    storagedetail["size"] = 200;
                    for (storagekey in responsedata) {
                      storageval = responsedata[storagekey];
                      storagedetail["details"][storagekey] = storageval;
                    }
                    return storagesdetail["children"].push(storagedetail);
                  }
                });
                if (Object.keys(memoriesdetail).length !== 0 && Object.keys(processorsdetail).length !== 0) {
                  $scope.drawerData["children"][index]["children"].push(processorsdetail);
                  $scope.drawerData["children"][index]["children"].push(memoriesdetail);
                  memoriesdetail = {};
                  processorsdetail = {};
                  storagesdetail = {};
                  return index++;
                }
              });
              return deferred.resolve();
            });
          }
        });
        return deferred.promise;
      };

      return RsaService;

    })();
    return angular.module('compass.services').service('rsaService', [
      'dataService', '$q', 'rsaFactory', function(dataService, $q, rsaFactory) {
        return new RsaService(dataService, $q, rsaFactory);
      }
    ]);
  });

}).call(this);
