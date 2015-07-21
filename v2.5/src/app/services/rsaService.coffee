define(['./baseService'], -> 
    'use strict';
    window.Namespace = {
            "podid":"id",
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
            "component_name":"component_name",
            "storageid": "id"
    }

    class RsaService
    	
        constructor: (@dataService, @$q, @rsaFactory) ->

        getRSAManagers: ($scope) ->
                $scope.pods = []
                $q = @$q
                deferred = $q.defer()
                @dataService.getRSAManagers().success (data) ->
                      #console.log(data)
                      for num, value of data
                               for key, val of value
                                   if key is Namespace.podid
                                        $scope.pods.push({
                                               "title": "POD "+val,
                                               "id": val
                                        })
                      deferred.resolve()
                return deferred.promise
        getPodRacks: ($scope, podid) ->
            $q = @$q
            deferred = $q.defer()
            $scope.racks = [] 
            @dataService.getPodRacks(podid).success (data) ->
                for num, value of data
                    for key, val of value
                        if key is Namespace.rackid
                            $scope.racks.push({
                                "title": "Rack " + val
                                "id": val
                            })
                deferred.resolve()
            
            return deferred.promise
       
        getAllChartsData: ($scope, rackid) ->
                promises = []
                deferred = @$q.defer()
                cpuPromise = @dataService.getCpuUsage(rackid)
                memoryPromise = @dataService.getMemoryUsage(rackid)
                storagePromise = @dataService.getStorageUsage(rackid)
                promises.push(cpuPromise)
                promises.push(storagePromise)
                promises.push(memoryPromise)
               
                @$q.all(promises).then (result) ->
                     #console.log("resolved", result)
                     #console.log("data", result[0].data)
                     #console.log(result[1].data)
                     #console.log(result[2].data)
                     $scope.cpuUsage = []
                     $scope.storageUsage = []
                     $scope.memoryUsage = [] 
                     $scope.cpuUsage.push({
                           "key": "one", 
                           "y": result[0].data.allocated
                           })
                    
                     $scope.cpuUsage.push({
                           "key": "two",
                           "y": result[0].data.total-result[0].data.allocated
                           })
                     $scope.storageUsage.push({
                           "key": "one",
                           "y": result[1].data.allocated
                           })
                     $scope.storageUsage.push({
                           "key": "two",
                           "y": result[1].data.total-result[1].data.allocated
                           })
                     $scope.memoryUsage.push({
                           "key": "one",
                           "y": result[2].data.allocated
                           })
                     $scope.memoryUsage.push({
                           "key": "two",
                           "y": result[2].data.total-result[2].data.allocated
                           })
                     deferred.resolve()
                return deferred.promise

        getCpuUsage: ($scope, rackid) ->
                $scope.cpuUsage = [] 
                @dataService.getCpuUsage(rackid).success (data) ->
                     $scope.cpuUsage.push({
                           "key": "one", 
                           "y": data.allocated
                           })
                    
                     $scope.cpuUsage.push({
                           "key": "two",
                           "y": data.total-data.allocated
                           })

        getMemoryUsage: ($scope, rackid) ->
                $scope.memoryUsage = []
                @dataService.getMemoryUsage(rackid).success (data) ->
                     $scope.memoryUsage.push({
                         "key": "one",
                         "y": data.allocated
                          })
                     $scope.memoryUsage.push({
                         "key": "two",
                         "y": data.total-data.allocated
                          })

        getStorageUsage: ($scope, rackid) ->
                $scope.storageUsage = []
                @dataService.getStorageUsage(rackid).success (data) ->
                     $scope.storageUsage.push({
                         "key": "one",
                         "y": data.allocated
                         })
                     $scope.storageUsage.push({
                         "key": "two",
                         "y": data.total-data.allocated
                         })
        
        getRackDrawers: ($scope, rackid) ->
        	$scope.drawers = []
        	@dataService.getRackDrawers(rackid).success (data) ->
        		for num, value of data
        			for key,val of value
        				if key is Namespace.drawerid
        					$scope.drawers.push({
        						"title": "Drawer " + val
        						"id": val
        						})

        getRackThermalZones: ($scope, rackid) ->
        	$scope.thermalZones = []
        	@dataService.getRackThermalZones(rackid).success (data) ->
        		for num, value of data
        			thermalDetail = {}
        			for key, val of value
        				if key is Namespace.thermalzoneid
        					thermalDetail["id"] = val
        				if key is Namespace.numOfFansPresent
        					thermalDetail["presentFanNum"] = val
        				if key is Namespace.maxFanNumbers
        					thermalDetail["maxFanNum"] = val
        			$scope.thermalZones.push(thermalDetail)

        getRackPowerZones: ($scope, rackid) ->
        	$scope.powerZones = []
        	@dataService.getRackPowerZones(rackid).success (data) ->
        		for num, value of data
        			powerDetail = {}
        			for key, val of value
        				if key is Namespace.powerzoneid
        					powerDetail["id"] = val
        				if key is Namespace.numOfPsusPresent
        					powerDetail["presentPsNum"] = val       
        				if key is Namespace.maxNumPsus
        					powerDetail["maxPsNum"] = val
        			$scope.powerZones.push(powerDetail)
        		# console.log($scope.powerZones)

        getRackPowerZonesSupplyUnits: ($scope, rackid, zoneid) ->
            $scope.powerData = {}
            $scope.powerData["name"] = "Power Zone " + zoneid
            $scope.powerData["children"] = []
            deferred = @$q.defer()
            @dataService.getRackPowerZonesSupplyUnits(rackid, zoneid).success (data) ->
                for num, value of data
                    unitsdetail = {}
                    unitsdetail["details"] = {}
                    unitsdetail["size"] = 200
                    for unitkey, unitval of value
                        if !unitsdetail["name"]
                            unitsdetail["name"] = value[Namespace.component_name]
                        
                        if typeof unitval isnt "string"
                            if Array.isArray(unitval)
                                for idx, obj of unitval
                                    for objkey, objval of obj
                                        unitsdetail["details"][objkey] = objval
                            else
                                for objkey, objval of unitval
                                    unitsdetail["details"][objkey] = objval
                        else
                            unitsdetail["details"][unitkey] = unitval

                        # console.log("pwrdtl", unitval, typeof unitval)
                    $scope.powerData["children"].push(unitsdetail)
                deferred.resolve()

            #console.log("powerdata", $scope.powerData)
            return deferred.promise

        getRackThermalZonesFans: ($scope, rackid, zoneid) ->
            $scope.thermalData = {}
            $scope.thermalData["name"] = "Thermal Zone " + zoneid
            $scope.thermalData["children"] = []
            $q = @$q
            deferred = $q.defer()
            @dataService.getRackThermalZonesFans(rackid, zoneid).success (data) ->
                for num, value of data
                    thermals = {}
                    thermals["details"] = {}
                    thermals["size"] = 200
                    for thermalkey, thermalval of value
                        if !thermals["name"]
                            thermals["name"] = value[Namespace.component_name]
                        if typeof thermalval isnt "string"
                            if Array.isArray(thermalval)
                                for idx, obj of thermalval
                                    for objkey, objval of obj
                                        thermals["details"][objkey] = objval
                            else
                                for objkey, objval of thermalval
                                    thermals["details"][objkey] = objval
                        else
                            thermals["details"][thermalkey] = thermalval
                    $scope.thermalData["children"].push(thermals)
                # console.log("powerunits", data)
                deferred.resolve()
            return deferred.promise

        getRackDrawerDetails: ($scope, drawerid) ->
        	
            dataService = @dataService
            $scope.drawerData = {}
            $q = @$q
            deferred = $q.defer()
            # promises.push(dataService.getRackDrawerModuleProcessors(1, 1))
            dataService.getRackDrawerModules(drawerid).success (data) ->
                #console.log(data)
                promises = []
                $scope.drawerData["name"] = "drawer " + drawerid
                $scope.drawerData["children"] = []
                if data.length is 0
                    #console.log("in")
                    $scope.drawerData["children"].push({})
                    $scope.drawerData["size"] = 200
                    #console.log($scope.drawerData)
                    deferred.resolve()
                    #return
                else
                    #$scope.drawerData["children"]=[]
                    for num, value of data                   
                        for key, val of value
                            if key is Namespace.moduleid
                                moduledetail = {}
                                moduledetail["name"] = "Module " + val
                                moduledetail["children"] = []
                                $scope.drawerData["children"].push(moduledetail)
                                #console.log($scope.drawerData)
                                # dataService.getRackDrawerModuleProcessors(drawerid, val)
                                processorPromise = dataService.getRackDrawerModuleProcessors(drawerid, val)
                                memoryPromise = dataService.getRackDrawerModuleMemories(drawerid, val)
                                storagePromise = dataService.getModuleStorage(val)
                                promises.push(processorPromise)
                                promises.push(memoryPromise)
                                promises.push(storagePromise)
                    
                    index = 0
                    $q.all(promises).then (result)->
                        # console.log("inpromises", result)
                        memoriesdetail = {}
                        processorsdetail = {}
                        storagesdetail = {}
                        
                        angular.forEach(result, (response)->
                            #each request in promises
                            #console.log("response",response) 
                            angular.forEach(response.data, (responsedata)->
                                #object in one request
                                if responsedata[Namespace.component_name] is "Memory Module"
                                    if !memoriesdetail["name"]
                                        memoriesdetail["name"] = "Memories"
                                        memoriesdetail["children"] = []
                                    memorydetail = {}
                                    memorydetail["name"] = "memory " + responsedata[Namespace.memoryid]
                                    memorydetail["details"] = {}
                                    memorydetail["size"] = 200
                                    for mkey, mval of responsedata
                                         if typeof mval isnt "object"
                                            memorydetail["details"][mkey] = mval
                                         else
                                            str = "{"
                                            for kmval, vmval of mval
                                               str+= "\n"+ kmval + ": " + vmval+ "\n"
                                            str+="}"
                                            memorydetail["details"][mkey] = str
                                    memoriesdetail["children"].push(memorydetail)
                    
                                else if responsedata[Namespace.component_name] is "Processor"
                                    if !processorsdetail["name"]
                                        processorsdetail["name"] = "Processors"
                                        processorsdetail["children"] = []
                                    processordetail = {}
                                    processordetail["name"] = "processor " + responsedata[Namespace.processorid]
                                    processordetail["details"] = {}
                                    processordetail["size"] = 200
                                    for processorkey, processorval of responsedata
                                         #do scan = (processorkey, processorval)->
                                                if typeof processorval isnt "object"
                                                    processordetail["details"][processorkey]=processorval
                                                #else
                                                   # for idx, obj of processorval
                                                      # if processorval.hasOwnProperty(idx)
                                                         # scan(idx, obj)
                                         #if typeof processorval isnt "string"
                                         #   if Array.isArray(processorval)
                                         #      for idx, obj of processorval
                                         #         for objkey, objval of obj
                                         #             processordetail["details"][objkey] = objval
                                         #   else
                                         #       for objkey, objval of processorval
                                         #           processordetail["details"][objkey] = objval
                                         #else
                                         #   processordetail["details"][processorkey] = processorval
                                    processorsdetail["children"].push(processordetail)
                                else
                                    # console.log(responsedata)
                                    if !storagesdetail["name"]
                                        storagesdetail["name"] = "Storage"
                                        storagesdetail["children"] = []
                                    storagedetail = {}
                                    storagedetail["name"] = "device " + responsedata[Namespace.storageid]
                                    storagedetail["details"] = {}
                                    storagedetail["size"] = 200
                                    for storagekey, storageval of responsedata
                                        storagedetail["details"][storagekey] = storageval
                                    storagesdetail["children"].push(storagedetail)
                                )
                            if Object.keys(storagesdetail).length isnt 0
                                $scope.drawerData["children"][index]["children"].push(storagesdetail)  
                            if Object.keys(memoriesdetail).length isnt 0 and Object.keys(processorsdetail).length isnt 0
                                $scope.drawerData["children"][index]["children"].push(processorsdetail)
                                $scope.drawerData["children"][index]["children"].push(memoriesdetail)
                                #$scope.drawerData["children"][index]["children"].push(storagesdetail)
                                # console.log($scope.drawerData["children"][index]["children"])
                                memoriesdetail = {}
                                processorsdetail = {}
                                storagesdetail = {}
                                index++                    
                        )
                        #console.log($scope.drawerData)
                        deferred.resolve()
            return deferred.promise

    angular.module('compass.services').service('rsaService',['dataService','$q','rsaFactory', (dataService, $q, rsaFactory) -> new RsaService(dataService, $q, rsaFactory)])
)
