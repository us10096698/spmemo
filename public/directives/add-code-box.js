'use strict';

angular.module('spmemo').
  directive('addCodeBox', function($compile, $document) {

    return function(scope, element, attrs) {
      element.bind('click', function() {
        var template = '<div class="form-group"><textarea class="code-box form-control" rows="10" ng-model="vm.code['+ scope.vm.idx  +']" placeholder="Code"></textarea></div>'
        scope.vm.idx++;
        $document.find('#space-for-codes')
          .append($compile(template)(scope));
      });
    }

  });
