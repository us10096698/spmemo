'use strict';

angular.module('spmemo')
  .factory('memoService', memoService);

memoService.$inject = ['$filter', 'marked'];

function memoService($filter, marked) {
  var memoService = {};
  var memo = { index: -1, contents: {} };

  memoService.getAll = getAll;
  memoService.getJsonUrl = getJsonUrl;
  memoService.get = get;
  memoService.set = set;
  memoService.remove = remove;
  memoService.update = update;
  memoService.sort = sort;

  return memoService;

  function get(index) {
    var item;

    if(typeof index != 'undefined') {
      var obj = getFromSession();
      item = obj[index];

    } else {

      if (memo.contents == {}) {
        item = {title: '', doc: '', code: ''};
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
    var obj = getFromSession();

    obj.forEach( function(item, index, object) {
      memos[index] = {title: item.title, doc: marked(item.doc), code: item.code};
    });

    return memos;
  }

  function getJsonUrl() {
    var blob = new Blob([sessionStorage.getItem('spmemo')], {'type': 'application/json'});
    window.URL = window.URL || window.webkitURL;

    return window.URL.createObjectURL(blob);
  }

  function remove(index) {
    var obj = getFromSession();
    obj.splice(index, 1);
    storeToSession(obj);
  }

  function update(item, memos) {
    var obj = getFromSession();
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

    storeToSession(obj);
  }

  function sort(beforeIdx, afterIdx) {
    var obj = getFromSession();
    var itemToMove = obj[beforeIdx];

    obj.splice(beforeIdx, 1);
    obj.splice(afterIdx, 0, itemToMove);

    storeToSession(obj);
  }

  function getFromSession() {
    return angular.fromJson(sessionStorage.getItem('spmemo')) || [];
  }

  function storeToSession(obj) {
    var json = $filter('json')(obj);
    sessionStorage.setItem('spmemo', json);
  }

}
