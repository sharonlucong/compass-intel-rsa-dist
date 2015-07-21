(function() {
  define(['./baseDirective'], function() {
    'use strict';
    return angular.module('compass.directives').directive('d3Treemap', function() {
      return {
        restrict: 'E',
        scope: {
          data: '='
        },
        link: function(scope, element, attrs) {
          var svg;
          svg = d3.select(element[0]).append("svg").attr("width", "100%");
          scope.$watch('data', function(newVals, oldVals) {
            return scope.render(newVals);
          }, true);
          return scope.render = function(data) {
            var color, g, h, kx, ky, partition, vis, w, x, y;
            svg.selectAll("*").remove();
            w = 600;
            h = 600;
            x = d3.scale.linear().range([0, w]);
            y = d3.scale.linear().range([0, h]);
            color = d3.scale.category20c();
            vis = svg.attr("height", h);
            partition = d3.layout.partition().value(function(d) {
              return d.size;
            });
            g = vis.selectAll("g").data(partition.nodes(data)).enter().append("g").attr("transform", function(d) {
              return "translate(" + x(d.y) + "," + y(d.x) + ")";
            });
            kx = w / data.dx;
            ky = h / 1;
            return g.append("rect").attr("width", data.dy * kx).attr("height", function(d) {
              return d.dx * ky;
            }).style("fill", function(d) {
              var _ref;
              return color(((_ref = d.children) != null ? _ref : {
                d: d.parent
              }).name);
            }).attr("class", function(d) {
              var _ref;
              return (_ref = d.children) != null ? _ref : {
                "parent": "child"
              };
            });
          };
        }
      };
    });
  });

}).call(this);
