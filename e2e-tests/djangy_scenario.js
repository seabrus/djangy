describe('Djangy', function() {

    it('test 1: should show 4 companies on the first page', function() {
        // Open the list of companies page
        browser.get('/');

        // Check that login links are shown
        expect( element( by.id('google_login_menu_item')).isDisplayed()).toBe(true);
        expect( element( by.linkText('Log In')).isDisplayed()).toBe(true);

        // Check if there are 4 rows in the repeater
        var rows = element.all( by.repeater('company in ctrl.CompaniesData') );
        expect( rows.count() ).toEqual(4);

        // Check the first row details
        var firstRow = element( by.repeater('company in ctrl.CompaniesData').row(0).column('company.foundedAt') );
        expect(firstRow.getText()).toMatch(/1678/);
        firstRow = element( by.repeater('company in ctrl.CompaniesData').row(0).column('company.companyName') );
        expect(firstRow.getText()).toMatch(/ABC --- Brand 007a/);
    });


    it('test 2: should allow logging in', function() {
        browser.ignoreSynchronization = true;   // Protractor tests pages with Angular present. To avoid this:
            // http://stackoverflow.com/questions/31752301/protractor-error-angular-could-not-be-found-on-the-page

        // Navigate to the login page
        browser.get('/accounts/login/?next=/');

        var username = element( by.name('login') );
        var password = element( by.name('password') );

        // Type in the username and password
        username.sendKeys('sean22');
        password.sendKeys( '' );

        // Click on the login button
        element(by.css('.primaryAction.btn')).click();

        // Ensure that the user was redirected
        expect( browser.getCurrentUrl() ).toEqual('http://localhost:8000/#/');

        //browser.debugger();
    
        // Check that login link is hidden and logout link is show
        expect( element( by.partialLinkText('Log Out')).isDisplayed()).toBe(true);

        browser.ignoreSynchronization = false;
  });

/*
    // No protractor used - this works too
    it('test 2: should allow logging in', function() {
        var webdriver = require('/usr/lib/node_modules/protractor/node_modules/selenium-webdriver');
        browser.ignoreSynchronization = true;
            // http://stackoverflow.com/questions/31752301/protractor-error-angular-could-not-be-found-on-the-page

        // Navigate to the login page
        browser.get('/accounts/login/?next=/');

        var username = browser.driver.findElement( webdriver.By.name('login') );
        var password = browser.driver.findElement( webdriver.By.name('password') );

        // Type in the username and password
        username.sendKeys('sean22');
        password.sendKeys( '' );
        password.submit();

        // Ensure that the user was redirected
        expect( browser.driver.getCurrentUrl() ).toEqual('http://localhost:8000/#/');
    
        // Check that login link is hidden and logout link is show
        expect( browser.driver.findElement( webdriver.By.partialLinkText('Log Out')).isDisplayed()).toBe(true);

        browser.ignoreSynchronization = false;
  });
*/


});

