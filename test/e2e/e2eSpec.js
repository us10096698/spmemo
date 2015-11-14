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
      element(by.css('body')).allowAnimations(false);
      browser.executeScript("document.body.className += ' notransition';");

      addLink.click();

      titleBox = element(by.id('titlebox'));
      docBox = element(by.id('docbox'));
      codeBox = element(by.id('codebox'));
      addButton = element(by.id('addmemo'));
      closeButton = element(by.id('close-modal'));
    });

    it('should show a modal dialog', function() {
      expect(titleBox.isDisplayed()).toBe(true);
      expect(docBox.isDisplayed()).toBe(true);
      expect(codeBox.isDisplayed()).toBe(true);
      expect(addButton.isDisplayed()).toBe(true);
      expect(addButton.getText()).toEqual('Save changes');
      expect(closeButton.getText()).toEqual('Close');
    });

    it('should close a modal dialog when close button is clicked', function() {
      closeButton.click();
      expect(titleBox.isPresent()).toBe(false);
    });

    it('should show a modal dialog and add a memo with given info', function() {
      expect(addButton.getAttribute('disabled')).toBeTruthy();

      titleBox.clear().sendKeys('title1');
      docBox.clear().sendKeys('this is a document');
      codeBox.clear().sendKeys('var i = 0;');

      expect(addButton.getAttribute('disabled')).toBeFalsy();

      addButton.click();

      expect(element.all(by.css('tr.item')).count()).toBe(1);

      var memo1 = element(by.css('tr#title1'));

      expect(memo1.element(by.css('.title')).getText()).toEqual('title1');
      expect(memo1.element(by.css('.description')).getText()).toEqual('this is a document');
    });

    it('should add second memo without page reload', function() {
      titleBox.clear().sendKeys('title1');
      docBox.clear().sendKeys('this is a document');
      codeBox.clear().sendKeys('var i = 0;');
      addButton.click();

      addLink.click();

      titleBox.clear().sendKeys('title2');
      docBox.clear().sendKeys('this is a document2');
      codeBox.clear().sendKeys('var i = 1;');
      addButton.click();

      expect(element.all(by.css('tr.item')).count()).toBe(2);
    });

    it('should restore memos after page refresh', function() {
      titleBox.clear().sendKeys('title2');
      docBox.clear().sendKeys('this is a document');
      codeBox.clear().sendKeys('var i = 0;');
      addButton.click();

      browser.get('/');
      browser.sleep(1000);

      expect(element.all(by.css('tr.item')).count()).toBe(1);

      var memo2 = element(by.css('tr#title2'));

      expect(memo2.element(by.css('.title')).getText()).toEqual('title2');
      expect(memo2.element(by.css('.description')).getText()).toEqual('this is a document');
    });

    it('should display error message when the forms are empty', function() {
      var errors = element.all(by.css('.error-msg'));
      expect(errors.get(0).getText()).toEqual('Title must not be empty.');
      expect(errors.get(1).getText()).toEqual('Doc must not be empty.');
      expect(errors.get(2).getText()).toEqual('Code must not be empty.');
    });
  });
});
