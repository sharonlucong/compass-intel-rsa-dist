(function() {
  define(['./baseFactory'], function() {
    'use strict';
    var RsaFactory;
    RsaFactory = (function() {
      function RsaFactory() {
        this.isShow = false;
        this.podID = 1;
      }

      RsaFactory.prototype.getStatus = function() {
        return this.isAuthenticated;
      };

      RsaFactory.prototype.setStatus = function(state) {
        return this.isShow = state;
      };

      RsaFactory.prototype.setPodId = function(id) {
        return this.podID = id;
      };

      RsaFactory.prototype.getPodId = function() {
        return this.podID;
      };

      return RsaFactory;

    })();
    return angular.module('compass.factories').factory('rsaFactory', [
      function() {
        return new RsaFactory();
      }
    ]);
  });

}).call(this);
