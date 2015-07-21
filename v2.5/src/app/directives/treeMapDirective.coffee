define(['./baseDirective'], -> 
  'use strict';

  angular.module('compass.directives')
    .directive 'd3Treemap', () ->
      	return {
            restrict: 'E'
            scope: {
              data:'='
            }
            link: (scope, element, attrs) ->
                svg = d3.select(element[0])
                        .append("svg")
                        .attr("width", "100%")

                scope.$watch('data', (newVals, oldVals) ->
                        return scope.render(newVals)
                    , true);

                scope.render = (data) ->
                        svg.selectAll("*").remove()

                        w = 600
                        h = 600
                        x = d3.scale.linear().range([0, w])
                        y = d3.scale.linear().range([0, h])
                        color = d3.scale.category20c()

                        vis = svg.attr("height", h)
                        partition = d3.layout.partition()
                            .value((d)->
                                    # console.log(d)
                                    return d.size
                            )

                        g = vis.selectAll("g")
                            .data(partition.nodes(data))
                            .enter().append("g")
                            .attr("transform", (d)->
                                return "translate(" + x(d.y) + "," + y(d.x) + ")"
                            )
                        
                        kx = w / data.dx
                        ky = h / 1

                        g.append("rect")
                            .attr("width", data.dy * kx)
                            .attr("height", (d)->
                                return d.dx * ky
                            )
                            .style("fill", (d)->
                                return color((d.children ? d : d.parent).name)
                            )
                            .attr("class", (d)->
                                return d.children ? "parent" : "child";
                            )
        }
)