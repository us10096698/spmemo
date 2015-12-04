'use strict';

angular.module('spmemo')
  .factory('memoService', memoService);

function memoService() {
  var memoService = {};
  var memo = {};
  var idx = -1;

  memoService.setMemo = setMemo;
  memoService.getMemo = getMemo;
  memoService.getIndex = getIndex;
  memoService.setIndex = setIndex;

  return memoService;

  function setMemo(data, index) {
    memo = data;
    if(typeof index != 'undefined') idx = index;  
  }

  function getIndex() {
    return idx;
  }

  function setIndex(index) {
    idx = index;
  }

  function getMemo() {

    var item;

    if (memo == {}) {
      item = {title: '', doc: '', code: ''};
    } else {
      item = memo;
      memo = {};
    }

    return item;
  }
}
