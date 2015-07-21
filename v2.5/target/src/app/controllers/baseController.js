(function() {
  define(['angular', 'uiRouter', 'angularTable', 'uiBootstrap', 'angularDragDrop', 'ngSpinner', 'ngBsDaterangepicker', 'angularAnimate', 'nvd3ChartDirectives'], function(ng) {
    'use strict';
    return ng.module('compass.controllers', ['ui.router', 'ngTable', 'ui.bootstrap', 'ngDragDrop', 'angularSpinner', 'ngBootstrap', 'ngAnimate', 'nvd3ChartDirectives']);
  });

}).call(this);
