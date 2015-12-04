'use strict';
var server = require('../../server');

describe('Site', function() {

  var addLink, importLink, exportLink;
  var titleBox, docBox, codeBox, addButton, closeButton;

  beforeAll(function() {
    server.start();
  });

  afterAll(function() {
    server.close();
  });

  beforeEach(function() {
    browser.get('/');
    browser.executeScript('window.sessionStorage.removeItem("spmemo");');
    browser.get('/');
    disableAnimation();

    addLink = $('#addLink');
    importLink = $('#importLink');
    exportLink = $('#exportLink');
  });

  describe('#Appearance', function() {
    var contentsTbl;
    
    beforeEach(function() {
      contentsTbl = $('#contentsTbl');
    });

    it('should have contents table', function() {
      expect(contentsTbl.isPresent()).toBe(true);
      expect($$('tr.item').count()).toBe(0);
    });
  
    it('should display header contents', function() {
      expect(addLink.isPresent()).toBe(true);
      expect(importLink.isPresent()).toBe(true);
      expect(importLink.getText()).toBe('Import');
      expect(exportLink.isPresent()).toBe(true);
      expect(exportLink.getText()).toBe('Export');
    });
  });

  describe('#Add', function() {

    beforeEach(function() {
      openModal();
    });

    it('should show a modal dialog', function() {
      expect(titleBox.isDisplayed()).toBe(true);
      expect(docBox.isDisplayed()).toBe(true);
      expect(codeBox.isDisplayed()).toBe(true);
      expect(addButton.isDisplayed()).toBe(true);
      expect(addButton.getText()).toBe('Save changes');
      expect(addButton.getAttribute('disabled')).toBe('true');
      expect(closeButton.getText()).toBe('Close');
    });

    it('should close a modal dialog when the close button is clicked', function() {
      closeButton.click();
      expect(titleBox.isPresent()).toBe(false);
    });

    it('should show a modal dialog and add a memo with given info', function() {
      addItem('title1');

      expect($$('tr.item').count()).toBe(1);

      var memo1 = $('tr#item0');
      expect(memo1.$('.title').getText()).toBe('title1');
      expect(memo1.$('.description').getText()).toBe('this is a document');
    });

    it('should add second memo without page reload', function() {
      addItem('title1');
      openModal();
      addItem('title2');

      expect($$('tr.item').count()).toBe(2);
    });

    it('should restore memos after page refresh', function() {
      addItem('title2');
      browser.get('/');

      expect($$('tr.item').count()).toBe(1);

      var memo2 = $('tr#item0');
      expect(memo2.$('.title').getText()).toBe('title2');
      expect(memo2.$('.description').getText()).toBe('this is a document');
    });

    it('should display an error message when the title is empty', function() {
      var errors = $$('.error-msg');
      expect(errors.count()).toBe(1);
      expect(errors.get(0).getText()).toBe('Title must not be empty.');
    });

    it('should add a memo without doc and code', function() {
      titleBox.clear().sendKeys('title');
      addButton.click();

      var memo = $('tr#item0');
      expect($$('tr.item').count()).toBe(1);
      expect(memo.$('.title').getText()).toBe('title');
    })
  });

  describe('#delete', function() {
    var deleteBtn, code;

    beforeEach(function() {
      openModal();
      addItem('title2');

      code = $('tr#item0 td.code');
      deleteBtn = code.$('.remove');
    });

    it('should display a delete link to each item', function() {
      expect(deleteBtn.isDisplayed()).toBe(false);
      browser.actions().mouseMove(code).perform();
      expect(deleteBtn.isDisplayed()).toBe(true);
    });

    it('should remove an item', function() {
      browser.actions().mouseMove(code).perform();
      deleteBtn.click();
      var memos = $$('tr');
      expect(memos.count()).toBe(0);
    });
  });

  describe('#edit', function() {
    var editBtn, code;

    beforeEach(function() {

      openModal();
      addItem('title');

      code = $('tr#item0 td.code');
      editBtn = code.$('.edit');
    });

    it('should display an edit link to each item', function() {
      expect(editBtn.isDisplayed()).toBe(false);
      browser.actions().mouseMove(code).perform();
      expect(editBtn.isDisplayed()).toBe(true);
    });

    it('should open a modal dialog with the information of the memo', function() {
      browser.actions().mouseMove(code).perform();
      editBtn.click();
      expect(titleBox.isDisplayed()).toBe(true);
      expect(titleBox.getAttribute('value')).toBe('title');
      expect(docBox.getAttribute('value')).toBe('this is a document');
      expect(codeBox.getAttribute('value')).toBe('var i = 0;');
    });

    it('should edit the memo', function() {
      browser.actions().mouseMove(code).perform();
      editBtn.click();
      titleBox.clear().sendKeys('edited');
      addButton.click();
      expect($$('tr.item').count()).toBe(1);
      var memo = $('tr#item0');
      expect(memo.$('.title').getText()).toBe('edited');
    });

    it('should add a memo right after edit another memo', function() {
      openModal();
      addItem('item2');

      browser.actions().mouseMove(code).perform();
      editBtn.click();
      titleBox.clear().sendKeys('edited');
      addButton.click();

      openModal();
      addItem('item3');

      expect($$('tr.item').count()).toBe(3);
    });
  });

  describe('#export', function() {
    it('should export current memos as a json string', function() {
      openModal();
      addItem('title');

      browser.ignoreSynchronization = true;

      exportLink.click();

      var expected = JSON.parse('[{"title": "title", "doc": "this is a document", "code": "var i = 0;"}]');
      var content = $('pre');
      content.getText().then(function(text) {
        var output = JSON.parse(text);
        expect(output).toEqual(expected);
      });

      browser.ignoreSynchronization = false;

    });
  });

  describe('#copy', function() {
    it('should show a toast when succeed', function() {
      openModal();
      addItem('title');

      var memo = $('tr#item0 td.code');
      var copyBtn = memo.$('.copy');
      browser.actions().mouseMove(memo).perform();
      copyBtn.click();

      expect($('.toast-success').isPresent()).toBe(true);
    });
  });

  describe('#sort', function() {
    it('should change order of the memos', function() {
      openModal();
      addItem('title');

      openModal();
      addItem('title2');

      var memo = $('tr#item0');
      var memo2 = $('tr#item1');

      browser.actions().
        mouseMove(memo).
        mouseDown().
        mouseMove(memo2).
        mouseUp().
        perform();

      var index0 = $('tr#item0');
      expect(index0.$('.title').getText()).toBe('title2');
    });

  });

  function disableAnimation() {
    element(by.css('body')).allowAnimations(false);
    browser.executeScript("document.body.className += ' notransition';");
  }

  function openModal() {
    addLink.click();
    titleBox = $('#titlebox');
    docBox = $('#docbox');
    codeBox = $('#codebox');
    addButton = $('#addmemo');
    closeButton = $('#close-modal');
  }

  function addItem(item) {
    titleBox.clear().sendKeys(item);
    docBox.clear().sendKeys('this is a document');
    codeBox.clear().sendKeys('var i = 0;');
    addButton.click();
  }
});
