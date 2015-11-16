'use strict';

angular.module('spmemo')
  .factory('memoService', memoService);

function memoService() {
  var memoService = {};
  var memo = {};
  memoService.setMemo = setMemo;
  memoService.getMemo = getMemo;

  return memoService;

  function setMemo(data) {
    memo = data;
  }

  function getMemo() {

    var item;

    if (memo === {}) {
      item = {title: '', doc: '', code: ''};
    } else {
      item = memo;
      memo = {};
    }

    return item;
  }
}
