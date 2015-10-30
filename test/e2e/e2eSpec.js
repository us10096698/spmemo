'use strict';
var server = require('../../server');

fdescribe('Toppage of the site', function() {

  beforeAll(function() {
    server.start();
  });

  afterAll(function() {
    server.close();
  });

  beforeEach(function() {
    browser.get('/');
  });

  it('should have two textboxs, a button, and a contents table', function() {
    var titleBox = element(by.id('titlebox'));
    var docBox = element(by.id('docbox'));
    var codeBox = element(by.id('codebox'));
    var addButton = element(by.id('addmemo'));
    var contentsTbl = element(by.id('contentsTbl'));

    expect(titleBox.isPresent()).toBeTruthy();
    expect(docBox.isPresent()).toBeTruthy();
    expect(codeBox.isPresent()).toBeTruthy();
    expect(addButton.isPresent()).toBeTruthy();
    expect(addButton.getText()).toEqual('Add');
    expect(contentsTbl.isPresent()).toBeTruthy();
    expect(element.all(by.css('tr.item')).count()).toBe(0);
  });

  describe('Add button', function() {
    it('should save a memo item with given info', function() {
      var addButton = element(by.id('addmemo'));
      var titleBox = element(by.id('titlebox'));
      var docBox = element(by.id('docbox'));
      var codeBox = element(by.id('codebox'));

      titleBox.sendKeys('title1');
      docBox.sendKeys('this is a document');
      codeBox.sendKeys('var i = 0;');
      addButton.click();

      expect(element.all(by.css('tr.item')).count()).toBe(1);

      var memo1 = element(by.css("tr[id='title1']"));

      expect(memo1.element(by.css('.title')).getText()).toEqual('title1');
      expect(memo1.element(by.css('.doc')).getText()).toEqual('this is a document');
      expect(memo1.element(by.css('.code')).getText()).toEqual('var i = 0;');

    });
  });
});
