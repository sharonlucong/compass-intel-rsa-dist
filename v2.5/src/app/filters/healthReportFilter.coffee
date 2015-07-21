define(['./baseFilter'], ->
  'use strict';

  angular.module('compass.filters')
    .filter 'FilterByCategory', ->
        return (items, categoryName) ->
            filtered = []
            for i in items
                item = i
                if item.category == categoryName
                    filtered.push(item)
            return filtered
    .filter 'nl2br', ['$sce', ($sce)->
            return (text)->
                return text = if text then $sce.trustAsHtml(text.replace(/\n/g, '<br/>')) else ''
    ]
    .filter 'unique', ()->
        return (collection, keyname) ->
            output = []
            keys = []
            for item in collection
                key = item[keyname]
                if keys.indexOf(key) is -1
                    keys.push(key)
                    output.push(item)
            return output
);