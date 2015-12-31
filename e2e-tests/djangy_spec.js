/*   === Useful commands ===

expect(browser.getTitle()).toEqual('Super Calculator');

element(by.binding('latest')).getText()   ---   this finds {{latest}}


*/


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

/*
    // Page without Angular on it   ---   "browser.ignoreSynchronization = true;" makes the trick
    // Oficially this is NOT recommended. See Test 2 after this commented block
    it('test 2: should allow logging in', function() {
        browser.ignoreSynchronization = true;   // Protractor tests pages with Angular present. To avoid this:
            // http://stackoverflow.com/questions/31752301/protractor-error-angular-could-not-be-found-on-the-page

        // Navigate to the login page
        browser.get('/accounts/login/?next=/');

        var username = element( by.name('login') );
        var password = element( by.name('password') );

        // Type in the username and password
        username.sendKeys('');
        password.sendKeys( '' );
        // Click on the login button
        element(by.css('.primaryAction.btn')).click();

        // Ensure that the user was redirected
        expect( browser.getCurrentUrl() ).toEqual('http://localhost:8000/#/');

        // Check that login link is hidden and logout link is show
        expect( element( by.partialLinkText('Log Out')).isDisplayed()).toBe(true);

        browser.ignoreSynchronization = false;
    });
*/

/*
    // Page without Angular on it   ---   No protractor used
    // See https://github.com/angular/protractor/blob/master/spec/withLoginConf.js
    it('test 2 -- Page without Angular: should allow logging in', function() {
        //var webdriver = require('/usr/lib/node_modules/protractor/node_modules/selenium-webdriver');

        // Navigate to the login page
        browser.driver.get('http://localhost:8000/accounts/login/?next=/');   // >>> NOTE: Absolute path!

        var username = browser.driver.findElement( by.name('login') );
        var password = browser.driver.findElement( by.name('password') );
          // var username = browser.driver.findElement( webdriver.By['name']('login') );
          // var password = browser.driver.findElement( webdriver.By['name']('password') );

        // Type in the username and password
        username.sendKeys('sean22');
        password.sendKeys( 'sean22' );
        password.submit();

        // Login takes some time, so wait until it's done.
        // For the test app's login, we know it's done when it redirects to '/'
        browser.driver.wait(function() {
            return browser.driver.getCurrentUrl().then(function(url) {
              return /\/\#\//.test(url);
            });
        }, 10000);

        // Ensure that the user was redirected
        expect( browser.driver.getCurrentUrl() ).toEqual('http://localhost:8000/#/');
    
        // Check that login link is hidden and logout link is show
        expect( browser.driver.findElement( by.partialLinkText('Log Out')).isDisplayed()).toBe(true);
    });
*/

    it('test 3: should visit Profile page', function() {
        // Navigate to the login page
        browser.driver.get('http://localhost:8000/accounts/login/?next=/');   // Absolute path

        var username = browser.driver.findElement( by.name('login') );
        var password = browser.driver.findElement( by.name('password') );
        username.sendKeys('sean22');
        password.sendKeys( 'sean22' );
        password.submit();

        browser.driver.wait(function() {
            return browser.driver.getCurrentUrl().then(function(url) {
              return /\/\#\//.test(url);
            });
        }, 10000);


        var profileMenu = element( by.partialLinkText('Profile'));
        expect( profileMenu.isDisplayed()).toBe(true);

        profileMenu.click();

        // "Profile" page
        var header = element.all( by.tagName('h2') ).get(0);
        expect( header.getText()).toEqual('Your Company Profile');
    });


});

