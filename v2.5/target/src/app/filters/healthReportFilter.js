(function() {
  define(['./baseFilter'], function() {
    'use strict';
    return angular.module('compass.filters').filter('FilterByCategory', function() {
      return function(items, categoryName) {
        var filtered, i, item, _i, _len;
        filtered = [];
        for (_i = 0, _len = items.length; _i < _len; _i++) {
          i = items[_i];
          item = i;
          if (item.category === categoryName) {
            filtered.push(item);
          }
        }
        return filtered;
      };
    }).filter('nl2br', [
      '$sce', function($sce) {
        return function(text) {
          return text = text ? $sce.trustAsHtml(text.replace(/\n/g, '<br/>')) : '';
        };
      }
    ]).filter('unique', function() {
      return function(collection, keyname) {
        var item, key, keys, output, _i, _len;
        output = [];
        keys = [];
        for (_i = 0, _len = collection.length; _i < _len; _i++) {
          item = collection[_i];
          key = item[keyname];
          if (keys.indexOf(key) === -1) {
            keys.push(key);
            output.push(item);
          }
        }
        return output;
      };
    });
  });

}).call(this);
