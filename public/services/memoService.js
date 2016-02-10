'use strict';

angular.module('spmemo')
  .factory('memoService', memoService);

memoService.$inject = ['$filter', 'marked', 'storageService'];

function memoService($filter, marked, storageService) {
  var memoService = {};

  var memo = { index: -1, contents: {} };
  var sessionStorage = storageService.all();

  memoService.getAll = getAll;
  memoService.getJsonUrl = getJsonUrl;
  memoService.getByIndex = getByIndex;
  memoService.set = set;
  memoService.remove = remove;
  memoService.update = update;
  memoService.sort = sort;
  memoService.open = open;
  memoService.getMemosAsJsonString = getMemosAsJsonString;

  return memoService;

  function getByIndex(index) {
    var item = {};

    if(typeof index != 'undefined') {

      angular.extend(item, sessionStorage.spmemo[index]);
      item.code = item.code.concat();

    } else {

      if (memo.contents == {}) {
        item = {title: '', doc: '', code: []};
      } else {
        item = memo.contents;
        memo.contents = {};
      }

    }

    return item;
  }

  function set(data, index) {
    memo.contents = data;
    if (typeof index != 'undefined') memo.index = index;
  }

  function getAll() {
    var memos = [];
    var obj = sessionStorage.spmemo;

    obj.forEach( function(item, index, object) {
      memos[index] = {title: item.title, doc: marked(item.doc), code: item.code};
    });

    return memos;
  }

  function open(obj) {
    sessionStorage.spmemo = obj;
    return getAll();
  }

  function getJsonUrl() {
    var blob = new Blob([this.getMemosAsJsonString()], {'type': 'application/json'});
    window.URL = window.URL || window.webkitURL;

    return window.URL.createObjectURL(blob);
  }

  function remove(memoIdx, codeIdx) {
    var obj = sessionStorage.spmemo;
    var memo = obj[memoIdx];
    var code = memo['code'];

    if(code.length == 1){
      obj.splice(memoIdx, 1);
    } else {
      code.splice(codeIdx, 1);
    }

    sessionStorage.spmemo = obj;
    return obj.concat();
  }

  function update(item, memos) {
    var obj = sessionStorage.spmemo;
    var index = memo.index;
    var markedItem = {
      title: item.title,
      doc: marked(item.doc),
      code: item.code
    };

    if (index != (-1)) {
      obj[index] = item;
      memos[index] = markedItem;
      memo.index = (-1);

    } else {
      obj.push(item);
      memos.push(markedItem);
    }
    sessionStorage.spmemo = obj;
  }

  function sort(beforeIdx, afterIdx) {
    var obj = sessionStorage.spmemo;
    var itemToMove = obj[beforeIdx];

    obj.splice(beforeIdx, 1);
    obj.splice(afterIdx, 0, itemToMove);

    sessionStorage.spmemo = obj;
  }

  function getMemosAsJsonString() {
    return angular.toJson(sessionStorage.spmemo);
  }
}
