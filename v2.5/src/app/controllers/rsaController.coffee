define(['./baseController'], ()-> 
    'use strict';

    angular.module('compass.controllers')
        .controller 'rsaCtrl', ['$scope', 'rsaService','$timeout', 'rsaFactory', '$rootScope'
            ($scope, rsaService, $timeout, rsaFactory, $rootScope) ->

                $scope.selectPod = (podid) ->
                    $scope.showRacks = false
                    $scope.type = ""
                    $scope.noRacks = false
                    $scope.show = false
                    $scope.showPieChart = false
                    $scope.podID = podid
                    rsaFactory.setPodId(podid)
                    $scope.podpromisecompleted = false
                    rsaService.getPodRacks($scope, podid).then(->
                        $scope.podpromisecompleted = true
                        if !$scope.racks[0]
                            $scope.noRacks = true
                          
                        else
                            $scope.rackid = $scope.racks[0].id
                            $scope.noRacks = false
                            $rootScope.$broadcast('setActiveTab', $scope.rackid)
                            rsaService.getRackDrawers($scope, $scope.racks[0].id)
                            rsaService.getRackThermalZones($scope, $scope.racks[0].id)
                            rsaService.getRackPowerZones($scope, $scope.racks[0].id)
                            rsaService.getAllChartsData($scope, $scope.racks[0].id).then(->
                                  $scope.showPieChart = true
                                  ))
                    
                    $timeout(()->
                        if !$scope.racks[0]
                            $scope.showRacks = false
                            $scope.noRacks = true
                        else
                            $scope.showRacks = true
                            $scope.noRacks = false
                    , 3000)
                    # console.log("outside", $scope.cpuUsage)

                #initialization
                rsaService.getRSAManagers($scope).then(->
                    #console.log($scope.pods)
                    $scope.selectPod(1)
                    $scope.rackid  = 1
                )
    ]
    .controller 'rackCtrl', ['$scope', 'rsaService','rsaFactory', '$timeout'
            ($scope, rsaService, rsaFactory, $timeout) ->                 
                tabClasses = []

                $scope.pieStorageData = [
                    {key: "One",y: 3}, 
                    {key: "Two",y: 7}
                ]

                $scope.pieCPUData = [
                    {key: "One",y: 4}, 
                    {key: "Two",y: 6}
                ]

                $scope.pieMemoryData = [
                    {key: "One",y: 5}, 
                    {key: "Two",y: 5}
                ]

                $scope.getTabClass =  (tabNum) ->
                    # console.log("getTabClass-tabNum", tabNum)
                    return tabClasses[tabNum]
  
                $scope.getTabPaneClass =  (tabNum) ->
                    # console.log("getTabPaneClass-tabNum", tabNum)
                    return "tab-pane " + tabClasses[tabNum]

                #initialization
                tabClasses[1] = "active"
                $scope.getTabClass(1)
                $scope.getTabPaneClass(1)
                $scope.showRackDetails = true

                $scope.$on('setActiveTab', (event, arg)->
                        $scope.setActiveTab(arg)
                    )
                $scope.setActiveTab =  (tabNum) ->
                    $scope.type = ""
                    $scope.showRackDetails = false
                    $scope.show = false
                    $scope.showPieChart = false
                    $scope.rackid  = tabNum
                    rsaService.getRackDrawers($scope, tabNum)
                    rsaService.getRackThermalZones($scope, tabNum)
                    rsaService.getRackPowerZones($scope, tabNum)
                    rsaService.getAllChartsData($scope, tabNum).then(->
                              #console.log("ininside", $scope.cpuUsage)
                              $scope.showPieChart = true
                              )
                    #rsaService.getCpuUsage($scope, tabNum)
                    #rsaService.getMemoryUsage($scope, tabNum)
                    #rsaService.getStorageUsage($scope, tabNum)           
                    tabClasses = []
                    tabClasses[tabNum] = "active"
                    $timeout(()->
                        $scope.showRackDetails = true
                    , 3000)

                $scope.width = 500
                $scope.height = 500

                $scope.pieColor = ['#6898ce', '#73b9e6']

                $scope.xFunction = ()-> 
                    return (d)->
                        return d.key

                $scope.yFunction = ()-> 
                    return (d)->
                        return d.y

                $scope.descriptionFunction = ()-> 
                    return (d)->
                        return d.key
                $scope.colors = () ->
                    return $scope.pieColor
                
                $scope.show = false

                $scope.showChart = (showType, id)->
                    $scope.isFinishLoading = false
                    $scope.type = showType
                    $scope.show = !$scope.show
                    if $scope.show is false
                        $scope.$apply()
                    if showType is "drawer"
                        $scope.drawerid = id
                    else if showType is "thermal"
                        $scope.thermalid = id
                    else if showType is "power"
                        $scope.powerid = id
    ]
    .controller 'chartCtrl', ['$scope','rsaService', '$timeout', 'rsaFactory', '$window'
        ($scope, rsaService, $timeout, rsaFactory, $window) ->
                $scope.render = (data) ->
                        #console.log("inside render()", data)
                        d3.selectAll('.chart').selectAll("*").remove()                    
                        svg = d3.selectAll('.chart')
                                .append("svg")
                                .attr("width", '650px')
                                .style("margin-left", '130px')
                        
                        # svg.selectAll("*").remove()

                        # w = $window.innerWidth * 0.5
                        # h = $window.innerHeight * 0.85
                        w = 650;
                        h = 600;
                        x = d3.scale.linear().range([0, w])
                        y = d3.scale.linear().range([0, h])
                        # color = d3.scale.category20c()
                        color = d3.scale.ordinal().range(["#0D3A6E", "#045A8D", "#0570B0","#3690C0", "#74A9CF","#4586B6","#68A9D4"])

                        vis = svg.attr("height", h)
                        partition = d3.layout.partition()
                            .value((d)->
                                    return d.size
                            )
                        kx = w / data.dx
                        ky = h / 1
                        dataset = []
                        clickChild = false
                        click = (d) ->
                            if !d.children
                                return
                            if !d.parent and !clickChild        
                                    $scope.$parent.showChart()
                            
                            clickChild = true
                            if !d.parent
                                clickChild = false

                            #if !d.children
                            #    return

                            if d.y then kx = (w-40) / (1-d.y) else kx = w/(1-d.y)
                            ky = h / d.dx
                            
                            if d.y then l=40 else l=0
                            
                            x.domain([d.y, 1]).range([l, w])
                            y.domain([d.x, d.x + d.dx])

                            if d3.event.altKey then dur = 7500 else dur = 750
                            t = g.transition()
                                 .duration(dur)
                                 .attr("transform", (d)->
                                    return "translate(" + x(d.y) + "," + y(d.x) + ")"
                                    )

                            t.select("rect")
                              .attr("width", d.dy * kx)
                              .attr("height", (d)->
                                    return d.dx * ky
                                    )
                            t.selectAll("image")
                             .style("opacity", (d)->
                                       if d.dx*ky >37
                                           return 1
                                       else
                                           return 0
                                   )
                            t.selectAll("text")
                             .attr("dy", (d)->
                                  console.log(d.dx*ky)
                                  if d.dx*ky > 50
                                      if d.name is "Processors"
                                         return "1em"
                                      else if d.name is "Memories"
                                         return "2%"
                                      else 
                                         return ".35em"
                                  else
                                         return ".35em"
                             )
                             .style("opacity", (d)->
                                       #console.log(d)
                                       if d.dx*ky > 30
                                           return 1
                                       else 
                                           return 0
                                   )
                            d3.selectAll('.helper').remove()
                           
                            g.append('foreignObject')
                             .attr('x', 10)
                             .attr('y', (d)->
                                   if d.name in ["Processors","Memories"]
                                       return 80
                                    else
                                       return 20
                             )
                             .attr('width', (d)->
                                     if d.name in ["Processors","Memories"]
                                       return 200
                                     else
                                       return 180
                             )
                             .attr('height', (d)->
                                 if d.name in ["Processors","Memories"]
                                     if d.dx*ky > 30
                                        return 300
                                 if !d.children
                                     if d.dx * ky > 30
                                        return 100
                             )
                             .attr('class','helper')
                             .append("xhtml:div")
                             .style("opacity", (d)->
                                #console.log("d.dx",d.dx, "ky", ky)
                                if !d.children
                                    if d.dx * ky > 50
                                        return 1
                                    else 
                                        return 0
                                else
                                    if d.dx*ky > 130
                                        return 1
                                    else
                                        return 0
                             )
                             .html((d,i)->
                               str = ""
                               if !d.children
                                   if d.details
                                       if d.details.component_uuid
                                           str = "<div style='color:white;font-size:12px'><span>"+"uuid: </span><p>" + d.details.component_uuid+"</p></div>"
                               if d.name in ["Processors", "Memories"]
                                   if d.children[0]
                                       for commonkey, commonval of d.children[0].details
                                           if commonkey in ["processor_model", "processor_family", "processor_architecture", "processor_manufacture", "processor_cores",                                           "processor_frequency", "memory_module_type", "memory_module_capacity"]
                                              str += "<div style='color:white; font-size:12px;'>"+ commonkey+ ": "+ commonval+"</div>"
                               return str
                             )
                             .on("mouseover", (d)->
                                if !d.parent
                                    d3.select(this)
                                      .style("fill", "#048D7E")
                                if !d.children
                                    xPos = 0
                                    yPos = 0
                                    dataset = []
                                    dataset.push("name: " + d.name)
                                    for key of d.details
                                        if d.details.hasOwnProperty(key)
                                            dataset.push(key + ": " + d.details[key])
                                    d3.select('#tooltip')
                                      .style("top", 200 + "px")
                                      .select("#tooltip ul")
                                      .selectAll("li")
                                      .data(dataset)
                                      .enter()
                                      .append("li")
                                      .text((dt)->
                                        return dt
                                    )

                                    d3.select("#tooltip").classed("hidden", false)
                             )
                     
                            d3.event.stopPropagation()                            

                        g = vis.selectAll("g")
                            .data(partition.nodes(data))
                            .enter().append("g")
                            .attr("transform", (d)->
                                return "translate(" + x(d.y) + "," + y(d.x) + ")"
                            )
                            .on("click", click)
                        
                        kx = w / data.dx
                        ky = h / 1
                        
                        g.append("rect")
                            .attr("width", data.dy * kx)
                            .attr("height", (d)->
                                return d.dx * ky
                            )
                            .attr("rx", 5)
                            .attr("ry", 5)
                            .style("fill", (d,i)->
                                if d.children
                                    return color(d.name)
                                else
                                    return d.parent.name
                            )
                            .attr("class", (d)->
                                if d.children
                                    return "parent"
                                else
                                    return "child"
                                # return d.children ? "parent" : "child";
                            )
                            .on("mouseover", (d)->
                                if !d.parent
                                    d3.select(this)
                                      .style("fill", "#048D7E")
                                if !d.children
                                    xPos = 0
                                    yPos = 0
                                    dataset = []
                                    dataset.push("name: " + d.name)
                                    for key of d.details
                                        if d.details.hasOwnProperty(key)
                                            dataset.push(key + ": " + d.details[key])
                                    d3.select('#tooltip')
                                      .style("top", 200 + "px")
                                      .select("#tooltip ul")
                                      .selectAll("li")
                                      .data(dataset)
                                      .enter()
                                      .append("li")
                                      .text((dt)->
                                        return dt
                                    )

                                    d3.select("#tooltip").classed("hidden", false)
                            )
                            .on("mouseout", (d)->
                                if !d.parent
                                    d3.select(this)
                                    .style("fill", "#0D3A6E")
                                d3.selectAll("#tooltip li").remove()
                                d3.select("#tooltip").classed("hidden", true)
                            )
                        g.append("image")
                         .attr("xlink:href", (d)->
                            if !d.name
                                return ""
                            else if d.name is "Processors"
                                return "assets/img/processor_icon.png"
                            else if d.name is "Memories"
                                return "assets/img/memory_icon.png"
                            else if d.name.match(/Disc-([0-9]|[1-9][0-9])/)
                                return "assets/img/storage_icon.png"
                            else if d.name.match(/Thermal\sZone\s([0-9]|[1-9][0-9])/)
                                return "assets/img/thermal_icon.png"
                            else if d.name.match(/Power\sZone\s([0-9]|[1-9][0-9])/)
                                return "assets/img/power_icon.png" 
                            else if d.name is "Storage"
                                return "assets/img/storage_icon.png"
                            else if !d.child
                                #console.log("d",d)
                                if d.name.match(/fan\s([0-9]|[1-9][0-9])/)
                                    #console.log("infan", d.name)
                                    return "assets/img/fan_icon.png"
                                else if d.name.match(/psu\s([0-9]|[1-9][0-9])/)
                                    return "assets/img/powerunit_icon.png"
                                else
                                    #console.log("fan", d.name) 
                                    return ""
                            else
                                return ""
                            )
                         .attr("transform", (d)->
                            if !d.name
                                return "translate(0,0)"
                            if d.name.match(/Power\sZone\s([0-9]|[1-9][0-9])/) or d.name.match(/Thermal\sZone\s([0-9]|[1-9][0-9])/)
                                return "translate(8," + d.dx * ky / 2.2 + ")"
                            else
                                return "translate(8," + d.dx * ky / 3 + ")"
                         )
                         .attr("width", (d)->
                                if d.name is "Memories" or "Processors" or "Storage"
                                    return 30
                                else
                                    return 40
                            )
                         .attr("height", (d)->
                                if d.name is "Memories" or "Processors" or "Storage"
                                    return 30
                                else
                                    return 40
                            )                        
                         .style("opacity", (d)->
                                #console.log(d.dx*ky)
                                if d.dx * ky > 37
                                    return 1
                                else
                                    return 0
                            ) 
                        g.append("text")
                         .attr("transform", (d)->
                            return "translate(60," + d.dx * ky / 2 + ")"
                         )
                         .attr("dy", ".35em")
                         .attr("fill", "white")
                         .style("opacity", (d)->
                            #console.log("d.dx",d.dx, "ky", ky)
                            if d.dx * ky > 12
                                return 1
                            else 
                                return 0
                         )
                         .text((d)->
                            if !d.parent
                                return  d.name + " " + "\u21D0"
                            else
                                return d.name
                         )
                         
                if $scope.$parent.type is "drawer"
                    rsaService.getRackDrawerDetails($scope, $scope.$parent.drawerid).then(->
                        $scope.$parent.isFinishLoading = true
                        return $scope.render($scope.drawerData))
                else if $scope.$parent.type is "power"
                    rsaService.getRackPowerZonesSupplyUnits($scope, $scope.$parent.rackid, $scope.$parent.powerid).then(->
                        return $scope.render($scope.powerData))
                else if $scope.$parent.type is "thermal"
                    rsaService.getRackThermalZonesFans($scope, $scope.$parent.rackid, $scope.$parent.thermalid).then(->
                        return $scope.render($scope.thermalData))
    ]
)   
