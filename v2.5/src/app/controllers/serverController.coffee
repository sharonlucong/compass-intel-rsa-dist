define(['./baseController'], ()-> 
  'use strict';

  angular.module('compass.controllers')
    .controller 'serverCtrl', [ '$scope', 'dataService', '$filter', 'machinesHostsData', 'wizardService', 'rsaExistingMachinesData',
      ($scope, dataService, $filter, machinesHostsData, wizardService, existingRsaMachines) ->
        $scope.hideunselected = ''
        $scope.search = {}
        $scope.allservers = machinesHostsData
        wizardService.getServerColumns().success (data) ->
            $scope.server_columns = data.machines_hosts

        wizardService.getRSABaseURL().success (data) ->
            $scope.rsaBaseURLs = data

        for machine in existingRsaMachines
            machine.memorySize = 0
            for memory in machine.machine_memories
                machine.memorySize += memory.memory_module_capacity
        $scope.allRSAMachines = existingRsaMachines

        wizardService.displayDataInTable($scope, $scope.allservers)
        
        wizardService.watchingTriggeredStep($scope)

        wizardService.getDetailDisplayName($scope)

        # $scope.hideUnselected = ->
        #     if $scope.hideunselected then $scope.search.selected = true else delete $scope.search.selected

        # $scope.ifPreSelect = (server) ->
        #     server.disable = false
        #     if server.clusters 
        #         server.disabled = true if server.clusters.length > 0
        #         for svCluster in server.clusters
        #             if svCluster.id == $scope.cluster.id
        #                 server.selected = true
        #                 server.disabled = false
        $scope.rsaSelectAllBaseUrl = (flag) ->
            if flag
                url.check = true for url in $scope.rsaBaseURLs
            else
                url.check = false for url in $scope.rsaBaseURLs

        $scope.rsaDiscoverServers = ->
            count = 0
            for rsaBaseUrl in $scope.rsaBaseURLs
                if rsaBaseUrl.check
                    count++
                    do (rsaBaseUrl) ->
                        wizardService.triggerFindRsaMachine(rsaBaseUrl.id).success ()->
                            wizardService.getAllRsaMachinesPeriodically($scope, rsaBaseUrl)
                                
            alert("You have to select one URL to find servers") if count is 0

        $scope.addRsaUrl = ()->
            wizardService.addRsaManager($scope.rsaUrl).success (data)->
                $scope.rsaBaseURLs.push(data)

        wizardService.watchAndAddNewServers($scope)
    ]
)