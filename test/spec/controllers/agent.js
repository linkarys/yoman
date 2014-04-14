'use strict';

describe('Controller: AgentCtrl', function () {

  // load the controller's module
  beforeEach(module('d3App'));

  var AgentCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AgentCtrl = $controller('AgentCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
