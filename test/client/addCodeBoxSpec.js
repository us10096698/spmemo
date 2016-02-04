'use strict';

describe('addCodeBox', function () {
  var template, scope, element, document;

  beforeEach(module('spmemo'));

  beforeEach(inject(function ($rootScope, $compile, $document) {
    template = angular.element('<div><button id="add-code" add-code-box class="btn btn-default">Add code box</button></div>');
    scope = $rootScope.$new();
    document = $document;
    document.find('body').append('<div id="space-for-codes"></div>')

    scope.vm = {idx: 1};
    element = $compile(template)(scope);

  }));

  it('should add a new code box in the space-for-codes element', function () {
    var button = element.find('button');
    button.triggerHandler('click');
    scope.$digest();
    button.triggerHandler('click');
    scope.$digest();

    expect(scope.vm.idx).toBe(3);
    expect(document.find('textarea').length).toBe(2);

  });
});
