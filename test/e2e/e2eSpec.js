'use strict';

describe('Site', function() {

  var addLink, importLink, exportLink;
  var titleBox, docBox, codeBox, addButton, closeButton, addCodeBox;

  beforeEach(function() {
    browser.get('/');
    browser.executeScript('window.sessionStorage.removeItem("ngStorage-spmemo");');
    browser.executeScript('window.sessionStorage.removeItem("ngStorage-spmemo_metadata");');
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
      expect(addButton.isDisplayed()).toBe(true);
      expect(addCodeBox.isDisplayed()).toBe(true);
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

    it('should add the second code box', function() {
      addCodeBox.click();
      addCodeBox.click();
      expect($$('.code-box').count()).toBe(2);
    })

    it('should add a memo with multiple codes', function() {
      titleBox.clear().sendKeys('memo2');
      docBox.clear().sendKeys('this is a document');

      addCodeBox.click();
      codeBox = $$('.code-box').get(0);
      codeBox.clear().sendKeys('var i = 0;');

      addCodeBox.click();

      var newBox = $$('.code-box').get(1);
      newBox.clear().sendKeys('// second');

      addButton.click();

      expect($$('tr#item0 .code tr').count()).toBe(2);
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
    var firstDeleteBtn, secondDeleteBtn, code;

    beforeEach(function() {
      openModal();
      addItemWith2Codes('title2');

      code = $$('tr#item0 td.code tr');
      firstDeleteBtn = code.get(0).$('.remove');
      secondDeleteBtn = code.get(0).$('.remove');
    });

    it('should display a delete link to each item', function() {
      expect(firstDeleteBtn.isDisplayed()).toBe(false);
      browser.actions().mouseMove(code.get(0)).perform();
      expect(firstDeleteBtn.isDisplayed()).toBe(true);
      browser.actions().mouseMove(code.get(1)).perform();
      expect(secondDeleteBtn.isDisplayed()).toBe(true);
    });

    it('should remove an code', function() {
      browser.actions().mouseMove(code.get(0)).perform();
      firstDeleteBtn.click();
      var memo = $('tr#item0');
      expect(memo.isPresent()).toBe(true);
      expect(memo.$$('td.code tr').count()).toBe(1);
    });

    it('should remove a memo when there is only one code', function() {
      browser.actions().mouseMove(code.get(0)).perform();
      firstDeleteBtn.click();
      firstDeleteBtn.click();
      var memo = $('tr#item0');
      expect(memo.isPresent()).toBe(false);
    });
  });

  describe('#edit', function() {
    var editBtn, title;

    beforeEach(function() {
      openModal();
      addItemWith2Codes('title');

      title = $('tr#item0 td.doc');
      editBtn = title.$('.edit');
    });

    it('should display an edit link to each item', function() {
      expect(editBtn.isDisplayed()).toBe(false);
      browser.actions().mouseMove(title).perform();
      expect(editBtn.isDisplayed()).toBe(true);
    });

    it('should open a modal dialog with the information of the memo', function() {
      browser.actions().mouseMove(title).perform();
      editBtn.click();
      var secondCodeBox = $$('.code-box').get(1);

      expect($$('.code-box').count()).toBe(2);
      expect(titleBox.isDisplayed()).toBe(true);
      expect(titleBox.getAttribute('value')).toBe('title');
      expect(docBox.getAttribute('value')).toBe('this is a document');
      expect(codeBox.getAttribute('value')).toBe('var i = 0;');
      expect(secondCodeBox.getAttribute('value')).toBe('var j = 0;');
    });

    it('should edit the memo', function() {
      browser.actions().mouseMove(title).perform();
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

      browser.actions().mouseMove(title).perform();
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

      var expected = JSON.parse('[{"title": "title", "doc": "this is a document", "code": ["var i = 0;"]}]');
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

  describe('#Github', function() {
    var githubLink = $('#github');
    var user = $('#user-name');
    var repo = $('#repo-name');
    var saveButton = $('#save');
    var cancelButton = $('#cancel');
    var errors = $$('.error-msg')

    it('should show a header-link and modal dialog', function() {
      $('i.fa-github').click();
      expect(githubLink.getText()).toBe('Open Repo');
      githubLink.click();

      expect(user.isPresent()).toBe(true);
      expect(user.getAttribute('placeholder')).toBe('User name');
      expect(repo.isPresent()).toBe(true);
      expect(repo.getAttribute('placeholder')).toBe('Repository name');
      expect(saveButton.isPresent()).toBe(true);
      expect(saveButton.getText()).toBe('Save changes');
      expect(saveButton.getAttribute('disabled')).toBe('true');
      expect(cancelButton.isPresent()).toBe(true);
      expect(cancelButton.getText()).toBe('Close');

      expect(errors.count()).toBe(2);
      expect(errors.get(0).getText()).toBe('User name must not be empty.');
      expect(errors.get(1).getText()).toBe('Repository name must not be empty.');
    });

    it('should show the filelist of the linked Github Project', function(){
      connectToTestRepo();
      var files = $$('.file');

      expect(files.count()).toBe(3);
      expect(files.get(0).getText()).toBe('file1.json');
      expect(files.get(1).getText()).toBe('file2.json');
      expect(files.get(2).getText()).toBe('file3.json');
    });

    it('should display a memo on the public Github repository', function() {
      connectToTestRepo();
      var files = $$('.file');
      files.get(0).click();

      expect($$('tr.item').count()).toBe(1);
      var memo1 = $('tr#item0');
      expect(memo1.$('.title').getText()).toBe('test1');
      expect(memo1.$('.description').getText()).toBe('doc');
    });

    function connectToTestRepo() {
      $('i.fa-github').click();
      githubLink.click();
      user.clear().sendKeys('us10096698');
      expect(saveButton.getAttribute('disabled')).toBe('true');
      repo.clear().sendKeys('spmemo-test');
      saveButton.click();
    }
  });

  function disableAnimation() {
    element(by.css('body')).allowAnimations(false);
    browser.executeScript("document.body.className += ' notransition';");
  }

  function openModal() {
    addLink.click();
    titleBox = $('#titlebox');
    docBox = $('#docbox');
    codeBox = $$('.code-box').get(0);
    addButton = $('#addmemo');
    closeButton = $('#close-modal');
    addCodeBox = $('#add-code');
  }

  function addItem(item) {
    titleBox.clear().sendKeys(item);
    docBox.clear().sendKeys('this is a document');

    addCodeBox.click();
    codeBox = $$('.code-box').get(0);
    codeBox.clear().sendKeys('var i = 0;');

    addButton.click();
  }

  function addItemWith2Codes(item) {
    titleBox.clear().sendKeys(item);
    docBox.clear().sendKeys('this is a document');

    addCodeBox.click();
    codeBox = $$('.code-box').get(0);
    codeBox.clear().sendKeys('var i = 0;');

    addCodeBox.click();
    var newCodeBox = $$('.code-box').get(1);
    newCodeBox.clear().sendKeys('var j = 0;');

    addButton.click();
  }
});
