define(['./baseFactory'], () -> 
   'use strict'
   class RsaFactory
        constructor: () -> 
            # @username = ""
            # @password = ""
            @isShow = false
            @podID = 1

        getStatus: ->
            return @isAuthenticated

        setStatus: (state)->
            @isShow = state

        setPodId: (id)->
          @podID = id

        getPodId: ->
          return @podID

   angular.module('compass.factories').factory('rsaFactory',[ () -> new RsaFactory()])
)