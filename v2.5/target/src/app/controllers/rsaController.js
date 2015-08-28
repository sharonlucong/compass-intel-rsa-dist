(function() {
  define(['./baseController'], function() {
    'use strict';
    return angular.module('compass.controllers').controller('rsaCtrl', [
      '$scope', 'rsaService', '$timeout', 'rsaFactory', '$rootScope', function($scope, rsaService, $timeout, rsaFactory, $rootScope) {
        $scope.selectPod = function(podid) {
          $scope.showRacks = false;
          $scope.type = "";
          $scope.noRacks = false;
          $scope.show = false;
          $scope.showPieChart = false;
          $scope.podID = podid;
          rsaFactory.setPodId(podid);
          $scope.podpromisecompleted = false;
          rsaService.getPodRacks($scope, podid).then(function() {
            $scope.podpromisecompleted = true;
            if (!$scope.racks[0]) {
              return $scope.noRacks = true;
            } else {
              $scope.rackid = $scope.racks[0].id;
              $scope.noRacks = false;
              $rootScope.$broadcast('setActiveTab', $scope.rackid);
              rsaService.getRackDrawers($scope, $scope.racks[0].id);
              rsaService.getRackThermalZones($scope, $scope.racks[0].id);
              rsaService.getRackPowerZones($scope, $scope.racks[0].id);
              return rsaService.getAllChartsData($scope, $scope.racks[0].id).then(function() {
                return $scope.showPieChart = true;
              });
            }
          });
          return $timeout(function() {
            if (!$scope.racks[0]) {
              $scope.showRacks = false;
              return $scope.noRacks = true;
            } else {
              $scope.showRacks = true;
              return $scope.noRacks = false;
            }
          }, 3000);
        };
        return rsaService.getRSAManagers($scope).then(function() {
          $scope.selectPod(1);
          return $scope.rackid = 1;
        });
      }
    ]).controller('rackCtrl', [
      '$scope', 'rsaService', 'rsaFactory', '$timeout', function($scope, rsaService, rsaFactory, $timeout) {
        var tabClasses;
        tabClasses = [];
        $scope.pieStorageData = [
          {
            key: "One",
            y: 3
          }, {
            key: "Two",
            y: 7
          }
        ];
        $scope.pieCPUData = [
          {
            key: "One",
            y: 4
          }, {
            key: "Two",
            y: 6
          }
        ];
        $scope.pieMemoryData = [
          {
            key: "One",
            y: 5
          }, {
            key: "Two",
            y: 5
          }
        ];
        $scope.getTabClass = function(tabNum) {
          return tabClasses[tabNum];
        };
        $scope.getTabPaneClass = function(tabNum) {
          return "tab-pane " + tabClasses[tabNum];
        };
        tabClasses[1] = "active";
        $scope.getTabClass(1);
        $scope.getTabPaneClass(1);
        $scope.showRackDetails = true;
        $scope.$on('setActiveTab', function(event, arg) {
          return $scope.setActiveTab(arg);
        });
        $scope.setActiveTab = function(tabNum) {
          $scope.type = "";
          $scope.showRackDetails = false;
          $scope.show = false;
          $scope.showPieChart = false;
          $scope.rackid = tabNum;
          rsaService.getRackDrawers($scope, tabNum);
          rsaService.getRackThermalZones($scope, tabNum);
          rsaService.getRackPowerZones($scope, tabNum);
          rsaService.getAllChartsData($scope, tabNum).then(function() {
            return $scope.showPieChart = true;
          });
          tabClasses = [];
          tabClasses[tabNum] = "active";
          return $timeout(function() {
            return $scope.showRackDetails = true;
          }, 3000);
        };
        $scope.width = 500;
        $scope.height = 500;
        $scope.pieColor = ['#6898ce', '#73b9e6'];
        $scope.xFunction = function() {
          return function(d) {
            return d.key;
          };
        };
        $scope.yFunction = function() {
          return function(d) {
            return d.y;
          };
        };
        $scope.descriptionFunction = function() {
          return function(d) {
            return d.key;
          };
        };
        $scope.colors = function() {
          return $scope.pieColor;
        };
        $scope.show = false;
        return $scope.showChart = function(showType, id) {
          $scope.isFinishLoading = false;
          $scope.type = showType;
          $scope.show = !$scope.show;
          if ($scope.show === false) {
            $scope.$apply();
          }
          if (showType === "drawer") {
            return $scope.drawerid = id;
          } else if (showType === "thermal") {
            return $scope.thermalid = id;
          } else if (showType === "power") {
            return $scope.powerid = id;
          }
        };
      }
    ]).controller('chartCtrl', [
      '$scope', 'rsaService', '$timeout', 'rsaFactory', '$window', function($scope, rsaService, $timeout, rsaFactory, $window) {
        $scope.render = function(data) {
          var click, clickChild, color, dataset, g, h, kx, ky, partition, svg, vis, w, x, y;
          d3.selectAll('.chart').selectAll("*").remove();
          svg = d3.selectAll('.chart').append("svg").attr("width", '650px').style("margin-left", '130px');
          w = 650;
          h = 600;
          x = d3.scale.linear().range([0, w]);
          y = d3.scale.linear().range([0, h]);
          color = d3.scale.ordinal().range(["#0D3A6E", "#045A8D", "#0570B0", "#3690C0", "#74A9CF", "#4586B6", "#68A9D4"]);
          vis = svg.attr("height", h);
          partition = d3.layout.partition().value(function(d) {
            return d.size;
          });
          kx = w / data.dx;
          ky = h / 1;
          dataset = [];
          clickChild = false;
          click = function(d) {
            var dur, l, t;
            if (!d.children) {
              return;
            }
            if (!d.parent && !clickChild) {
              $scope.$parent.showChart();
            }
            clickChild = true;
            if (!d.parent) {
              clickChild = false;
            }
            if (d.y) {
              kx = (w - 40) / (1 - d.y);
            } else {
              kx = w / (1 - d.y);
            }
            ky = h / d.dx;
            if (d.y) {
              l = 40;
            } else {
              l = 0;
            }
            x.domain([d.y, 1]).range([l, w]);
            y.domain([d.x, d.x + d.dx]);
            if (d3.event.altKey) {
              dur = 7500;
            } else {
              dur = 750;
            }
            t = g.transition().duration(dur).attr("transform", function(d) {
              return "translate(" + x(d.y) + "," + y(d.x) + ")";
            });
            t.select("rect").attr("width", d.dy * kx).attr("height", function(d) {
              return d.dx * ky;
            });
            t.selectAll("image").style("opacity", function(d) {
              if (d.dx * ky > 37) {
                return 1;
              } else {
                return 0;
              }
            });
            t.selectAll("text").attr("dy", function(d) {
              if (d.dx * ky > 50) {
                if (d.name === "Processors") {
                  return "1em";
                } else if (d.name === "Memories") {
                  return "2%";
                } else {
                  return ".35em";
                }
              } else {
                return ".35em";
              }
            }).style("opacity", function(d) {
              if (d.dx * ky > 30) {
                return 1;
              } else {
                return 0;
              }
            });
            d3.selectAll('.helper').remove();
            g.append('foreignObject').attr('x', 10).attr('y', function(d) {
              var _ref;
              if ((_ref = d.name) === "Processors" || _ref === "Memories") {
                return 80;
              } else {
                return 20;
              }
            }).attr('width', function(d) {
              var _ref;
              if ((_ref = d.name) === "Processors" || _ref === "Memories") {
                return 200;
              } else {
                return 180;
              }
            }).attr('height', function(d) {
              var _ref;
              if ((_ref = d.name) === "Processors" || _ref === "Memories") {
                if (d.dx * ky > 30) {
                  return 300;
                }
              }
              if (!d.children) {
                if (d.dx * ky > 30) {
                  return 100;
                }
              }
            }).attr('class', 'helper').append("xhtml:div").style("opacity", function(d) {
              if (!d.children) {
                if (d.dx * ky > 50) {
                  return 1;
                } else {
                  return 0;
                }
              } else {
                if (d.dx * ky > 130) {
                  return 1;
                } else {
                  return 0;
                }
              }
            }).html(function(d, i) {
              var commonkey, commonval, str, _ref, _ref1;
              str = "";
              if (!d.children) {
                if (d.details) {
                  if (d.details.component_uuid) {
                    str = "<div style='color:white;font-size:12px'><span>" + "uuid: </span><p>" + d.details.component_uuid + "</p></div>";
                  }
                }
              }
              if ((_ref = d.name) === "Processors" || _ref === "Memories") {
                if (d.children[0]) {
                  _ref1 = d.children[0].details;
                  for (commonkey in _ref1) {
                    commonval = _ref1[commonkey];
                    if (commonkey === "processor_model" || commonkey === "processor_family" || commonkey === "processor_architecture" || commonkey === "processor_manufacture" || commonkey === "processor_cores" || commonkey === "processor_frequency" || commonkey === "memory_module_type" || commonkey === "memory_module_capacity") {
                      str += "<div style='color:white; font-size:12px;'>" + commonkey + ": " + commonval + "</div>";
                    }
                  }
                }
              }
              return str;
            }).on("mouseover", function(d) {
              var key, xPos, yPos;
              if (!d.parent) {
                d3.select(this).style("fill", "#048D7E");
              }
              if (!d.children) {
                xPos = 0;
                yPos = 0;
                dataset = [];
                dataset.push("name: " + d.name);
                for (key in d.details) {
                  if (d.details.hasOwnProperty(key)) {
                    dataset.push(key + ": " + d.details[key]);
                  }
                }
                d3.select('#tooltip').style("top", 200 + "px").select("#tooltip ul").selectAll("li").data(dataset).enter().append("li").text(function(dt) {
                  return dt;
                });
                return d3.select("#tooltip").classed("hidden", false);
              }
            });
            return d3.event.stopPropagation();
          };
          g = vis.selectAll("g").data(partition.nodes(data)).enter().append("g").attr("transform", function(d) {
            return "translate(" + x(d.y) + "," + y(d.x) + ")";
          }).on("click", click);
          kx = w / data.dx;
          ky = h / 1;
          g.append("rect").attr("width", data.dy * kx).attr("height", function(d) {
            return d.dx * ky;
          }).attr("rx", 5).attr("ry", 5).style("fill", function(d, i) {
            if (d.children) {
              return color(d.name);
            } else {
              return d.parent.name;
            }
          }).attr("class", function(d) {
            if (d.children) {
              return "parent";
            } else {
              return "child";
            }
          }).on("mouseover", function(d) {
            var key, xPos, yPos;
            if (!d.parent) {
              d3.select(this).style("fill", "#048D7E");
            }
            if (!d.children) {
              xPos = 0;
              yPos = 0;
              dataset = [];
              dataset.push("name: " + d.name);
              for (key in d.details) {
                if (d.details.hasOwnProperty(key)) {
                  dataset.push(key + ": " + d.details[key]);
                }
              }
              d3.select('#tooltip').style("top", 200 + "px").select("#tooltip ul").selectAll("li").data(dataset).enter().append("li").text(function(dt) {
                return dt;
              });
              return d3.select("#tooltip").classed("hidden", false);
            }
          }).on("mouseout", function(d) {
            if (!d.parent) {
              d3.select(this).style("fill", "#0D3A6E");
            }
            d3.selectAll("#tooltip li").remove();
            return d3.select("#tooltip").classed("hidden", true);
          });
          g.append("image").attr("xlink:href", function(d) {
            if (!d.name) {
              return "";
            } else if (d.name === "Processors") {
              return "assets/img/processor_icon.png";
            } else if (d.name === "Memories") {
              return "assets/img/memory_icon.png";
            } else if (d.name.match(/Disc-([0-9]|[1-9][0-9])/)) {
              return "assets/img/storage_icon.png";
            } else if (d.name.match(/Thermal\sZone\s([0-9]|[1-9][0-9])/)) {
              return "assets/img/thermal_icon.png";
            } else if (d.name.match(/Power\sZone\s([0-9]|[1-9][0-9])/)) {
              return "assets/img/power_icon.png";
            } else if (d.name === "Storage") {
              return "assets/img/storage_icon.png";
            } else if (!d.child) {
              if (d.name.match(/fan\s([0-9]|[1-9][0-9])/)) {
                return "assets/img/fan_icon.png";
              } else if (d.name.match(/psu\s([0-9]|[1-9][0-9])/)) {
                return "assets/img/powerunit_icon.png";
              } else {
                return "";
              }
            } else {
              return "";
            }
          }).attr("transform", function(d) {
            if (!d.name) {
              return "translate(0,0)";
            }
            if (d.name.match(/Power\sZone\s([0-9]|[1-9][0-9])/) || d.name.match(/Thermal\sZone\s([0-9]|[1-9][0-9])/)) {
              return "translate(8," + d.dx * ky / 2.2 + ")";
            } else {
              return "translate(8," + d.dx * ky / 3 + ")";
            }
          }).attr("width", function(d) {
            if (d.name === "Memories" || "Processors" || "Storage") {
              return 30;
            } else {
              return 40;
            }
          }).attr("height", function(d) {
            if (d.name === "Memories" || "Processors" || "Storage") {
              return 30;
            } else {
              return 40;
            }
          }).style("opacity", function(d) {
            if (d.dx * ky > 37) {
              return 1;
            } else {
              return 0;
            }
          });
          return g.append("text").attr("transform", function(d) {
            return "translate(60," + d.dx * ky / 2 + ")";
          }).attr("dy", ".35em").attr("fill", "white").style("opacity", function(d) {
            if (d.dx * ky > 12) {
              return 1;
            } else {
              return 0;
            }
          }).text(function(d) {
            if (!d.parent) {
              return d.name + " " + "\u21D0";
            } else {
              return d.name;
            }
          });
        };
        if ($scope.$parent.type === "drawer") {
          return rsaService.getRackDrawerDetails($scope, $scope.$parent.drawerid).then(function() {
            $scope.$parent.isFinishLoading = true;
            return $scope.render($scope.drawerData);
          });
        } else if ($scope.$parent.type === "power") {
          return rsaService.getRackPowerZonesSupplyUnits($scope, $scope.$parent.rackid, $scope.$parent.powerid).then(function() {
            return $scope.render($scope.powerData);
          });
        } else if ($scope.$parent.type === "thermal") {
          return rsaService.getRackThermalZonesFans($scope, $scope.$parent.rackid, $scope.$parent.thermalid).then(function() {
            return $scope.render($scope.thermalData);
          });
        }
      }
    ]);
  });

}).call(this);
