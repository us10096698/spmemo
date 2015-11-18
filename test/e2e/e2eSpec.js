'use strict';
var server = require('../../server');

describe('Toppage of the site', function() {

  var addLink, importLink, exportLink;
  var contentsTbl;
  var titleBox, docBox, codeBox, addButton, closeButton;

  beforeAll(function() {
    server.start();
  });

  afterAll(function() {
    server.close();
  });

  beforeEach(function() {
    browser.get('/');
    browser.executeScript('for (var i in window.sessionStorage) {window.sessionStorage.removeItem(i);}');

    contentsTbl = element(by.id('contentsTbl'));
    addLink = element(by.id('addLink'));
    importLink = element(by.id('importLink'));
    exportLink = element(by.id('exportLink'));
  });

  it('should have contents table', function() {
    expect(contentsTbl.isPresent()).toBeTruthy();
    expect(element.all(by.css('tr.item')).count()).toBe(0);
  });

  it('should display header contents', function() {
    expect(addLink.isPresent()).toBeTruthy();
    expect(importLink.isPresent()).toBeTruthy();
    expect(importLink.getText()).toEqual('Import');
    expect(exportLink.isPresent()).toBeTruthy();
    expect(exportLink.getText()).toEqual('Export');
  });

  describe('#Add', function() {

    beforeEach(function() {
      disableAnimation();
      openModal();
    });

    it('should show a modal dialog', function() {
      expect(titleBox.isDisplayed()).toBe(true);
      expect(docBox.isDisplayed()).toBe(true);
      expect(codeBox.isDisplayed()).toBe(true);
      expect(addButton.isDisplayed()).toBe(true);
      expect(addButton.getText()).toEqual('Save changes');
      expect(addButton.getAttribute('disabled')).toBeTruthy();
      expect(closeButton.getText()).toEqual('Close');
    });

    it('should close a modal dialog when close button is clicked', function() {
      closeButton.click();
      expect(titleBox.isPresent()).toBe(false);
    });

    it('should show a modal dialog and add a memo with given info', function() {
      addItem('title1');

      expect(element.all(by.css('tr.item')).count()).toBe(1);
      var memo1 = element(by.css('tr#title1'));
      expect(memo1.element(by.css('.title')).getText()).toEqual('title1');
      expect(memo1.element(by.css('.description')).getText()).toEqual('this is a document');
    });

    it('should add second memo without page reload', function() {
      addItem('title1');

      openModal();
      addItem('title2');

      expect(element.all(by.css('tr.item')).count()).toBe(2);
    });

    it('should restore memos after page refresh', function() {
      addItem('title2');
      browser.get('/');
      browser.sleep(1000);

      expect(element.all(by.css('tr.item')).count()).toBe(1);

      var memo2 = element(by.css('tr#title2'));
      expect(memo2.element(by.css('.title')).getText()).toEqual('title2');
      expect(memo2.element(by.css('.description')).getText()).toEqual('this is a document');
    });

    it('should display an error message when the title is empty', function() {
      var errors = $$('.error-msg');
      expect(errors.count()).toEqual(1);
      expect(errors.get(0).getText()).toEqual('Title must not be empty.');
    });

    it('should add a memo without doc and code', function() {
      titleBox.clear().sendKeys('title');
      addButton.click();

      var memo = $('tr#title');
      expect($$('tr.item').count()).toBe(1);
      expect(memo.$('.title').getText()).toEqual('title');
    })
  });

  describe('#delete', function() {
    var deleteBtn, memo;

    beforeEach(function() {
      disableAnimation();

      openModal();
      addItem('title2');

      memo = element(by.css('tr#title2 td.code'));
      deleteBtn = memo.element(by.css('.remove'));
    });

    it('should display a delete link to each item', function() {
      expect(deleteBtn.isDisplayed()).toBe(false);
      browser.actions().mouseMove(memo).perform();
      expect(deleteBtn.isDisplayed()).toBe(true);
    });

    it('should remove a item', function() {
      browser.actions().mouseMove(memo).perform();
      deleteBtn.click();
      var memos = element.all(by.css('tr'));
      expect(memos.count()).toBe(0);
    });
  });

  describe('#edit', function() {
    var editBtn, memo;

    beforeEach(function() {
      disableAnimation();

      openModal();
      addItem('title');

      memo = element(by.css('tr#title td.code'));
      editBtn = memo.element(by.css('.edit'));
    });

    it('should display a edit link to each item', function() {
      expect(editBtn.isDisplayed()).toBe(false);
      browser.actions().mouseMove(memo).perform();
      expect(editBtn.isDisplayed()).toBe(true);
    });

    it('should open a modal dialog with the information of the memo', function() {
      browser.actions().mouseMove(memo).perform();
      editBtn.click();
      expect(titleBox.isDisplayed()).toBe(true);
      expect(titleBox.getAttribute('value')).toEqual('title');
      expect(docBox.getAttribute('value')).toEqual('this is a document');
      expect(codeBox.getAttribute('value')).toEqual('var i = 0;');
    });

    it('should edit the memo', function() {
      browser.actions().mouseMove(memo).perform();
      editBtn.click();
      titleBox.clear().sendKeys('edited');
      addButton.click();
      // expect(element.all(by.css('tr.item')).count()).toBe(1);
      var memo2 = element(by.css('tr#edited'));
      expect(memo2.element(by.css('.title')).getText()).toEqual('edited');
    });
  });

  describe('#export', function() {
    it('should export current memos as a json string', function() {
      disableAnimation();
      openModal();
      addItem('title');

      browser.ignoreSynchronization = true;

      exportLink.click();

      var expected = JSON.parse('{"title": {"title": "title", "doc": "this is a document", "code": "var i = 0;"}}');
      var content = element(by.css('pre'));
      content.getText().then(function(text) {
        var output = JSON.parse(text);
        expect(output).toEqual(expected);
      });

      browser.ignoreSynchronization = false;

    });
  });

  // We cannot set value to the input['type'='file']. So how do I write an e2e testcase for this situation?
  // describe('#import', function() {
    // var path = require('path');

    // it('should import a memo file to the site', function() {
      // var fileToUpload = '../test.json';
      // var absolutePath = path.resolve(__dirname, fileToUpload);
      // var scriptStr = '$("#lefile").val("' + absolutePath + '")';
 
      // browser.executeScript(scriptStr);
 
      // expect($$('tr.item').count()).toBe(1);
 
      // var memo = $('tr#title1');
      // expect(memo.$('.title').getText()).toEqual('title1');
      // expect(memo.$('.description').getText()).toEqual('this is a document');
    // });
  // });

  function disableAnimation() {
    element(by.css('body')).allowAnimations(false);
    browser.executeScript("document.body.className += ' notransition';");
  }

  function openModal() {
    addLink.click();
    titleBox = element(by.id('titlebox'));
    docBox = element(by.id('docbox'));
    codeBox = element(by.id('codebox'));
    addButton = element(by.id('addmemo'));
    closeButton = element(by.id('close-modal'));
  }

  function addItem(item) {
    titleBox.clear().sendKeys(item);
    docBox.clear().sendKeys('this is a document');
    codeBox.clear().sendKeys('var i = 0;');
    addButton.click();
  }

});
