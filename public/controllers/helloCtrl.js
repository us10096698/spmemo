angular.module('myapp')
    .controller('HelloController', HelloController);

HelloController.$inject = ['$http'];

function HelloController($http){
    'use strict';
    
    var vm = this;
    vm.tagline = 'EMPTY';
  
    vm.setTagline = function(message) {
        vm.tagline = message;
    };
      
    vm.process = function(message) {
        var config = {'params': {'message': message}};
        $http.get('/api/hello', config)
           .then(function callback(res){
               vm.setTagline(res.data);
           });
    };
}
