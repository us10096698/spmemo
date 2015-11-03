'use strict';
var server = require('../../server');

describe('Toppage of the site', function() {

  var addLink, importLink, exportLink;
  var contentsTbl;
  var titleBox, docBox, codeBox, addButton;

  beforeAll(function() {
    server.start();
  });

  afterAll(function() {
    server.close();
  });

  beforeEach(function() {
    browser.get('/');

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


  describe('"Add a memo" modal dialogue', function() {

    beforeEach(function() {
      addLink.click();

      titleBox = element(by.id('titlebox'));
      docBox = element(by.id('docbox'));
      codeBox = element(by.id('codebox'));
      addButton = element(by.id('addmemo'));
    });

    it('should show when Add link is clicked', function() {
      expect(titleBox.isPresent()).toBeTruthy();
      expect(docBox.isPresent()).toBeTruthy();
      expect(codeBox.isPresent()).toBeTruthy();
      expect(addButton.isPresent()).toBeTruthy();
      expect(addButton.getText()).toEqual('Save changes');
    });

    it('should add a memo with given info', function() {

      browser.sleep(1000);

      titleBox.clear().sendKeys('title1');
      docBox.clear().sendKeys('this is a document');
      codeBox.clear().sendKeys('var i = 0;');
      addButton.click();

      expect(element.all(by.css('tr.item')).count()).toBe(1);

      var memo1 = element(by.css('tr#title1'));

      expect(memo1.element(by.css('.title')).getText()).toEqual('title1');
      expect(memo1.element(by.css('.description')).getText()).toEqual('this is a document');
      // expect(memo1.element(by.css('.code.pre.code')).getText()).toEqual('var i = 0;');
    });
  });
});
