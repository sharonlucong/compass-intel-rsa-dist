define(['angular'
        'uiRouter'
        'angularTable'
        'uiBootstrap'
        'angularDragDrop'
        'ngSpinner'
        'ngBsDaterangepicker'
        'angularAnimate'
        'nvd3ChartDirectives'
], (ng)-> 
    'use strict';

    ng.module('compass.controllers', ['ui.router','ngTable','ui.bootstrap','ngDragDrop', 'angularSpinner', 'ngBootstrap','ngAnimate','nvd3ChartDirectives']);
);