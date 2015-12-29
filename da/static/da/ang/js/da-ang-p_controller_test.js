// ==========================================================
//     ProfileController   ---  Basic properties
// ==========================================================
describe('ProfileController', function() {
    beforeEach( module('djangy') );

    var ctrl, dService;

    // Before each unit test, instantiate a new instance of the controller
    beforeEach( inject( function($controller, DataService) {
        dService = DataService;
        ctrl = $controller('ProfileController');
    }));


    it('test 1: should have property currentTab available on load', function() {
        expect(ctrl.currentTab).toEqual('Basics');
    });

    it('test 2: should have property paymentMethods available on load', function() {
        expect(ctrl.paymentMethods.length).toEqual(3);
    });

    it('test 3: should have property currentTab available on load', function() {
        expect(ctrl.subscriptionPlans.length).toEqual(3);
    });

    it('test 4: should have property "validity" available on load', function() {
        expect(ctrl.validity).toEqual( { 'Basics': true, 'Hours': true} );
    });

    it('test 5: should have method setValidity()', function() {
        ctrl.setValidity('Basics', false);
        ctrl.setValidity('Hours', false);
        ctrl.setValidity('Plans', true);
        expect(ctrl.validity).toEqual( { 'Basics': false, 'Hours': false} );
    });

    it('test 6: method saveCompanyProfile() can return "invalidBasics" ', function() {
        ctrl.setValidity('Basics', false);
        ctrl.saveCompanyProfile();
        expect(ctrl.savingResult[0]).toEqual( 'invalidBasics' );
    });

    it('test 7: method saveCompanyProfile() can return "invalidHours" ', function() {
        ctrl.setValidity('Hours', false);
        ctrl.saveCompanyProfile();
        expect(ctrl.savingResult[0]).toEqual( 'invalidHours' );
    });

});


// ==========================================================
//     ProfileController   ---  GET request
// ==========================================================
describe('ProfileController', function() {
    beforeEach( module('djangy') );

    var testDBDataNewCompany = { "is_new": true };
    var testClientDataNewCompany = {
        id: 0,
        companyName: '',
        foundedAt: '',
        email: '',
        paymentMethod: 'PayPal',
        subscriptionPlan: 'Business plan',
        logoUrl: '',
        newLogoFile: undefined,
        previewUrl: '/media/da/logo-dummy.png',
        openingHours: [
            { dayName: 'Monday', hours: [] },
            { dayName: 'Tuesday', hours: [] },
            { dayName: 'Wednesday', hours: [] },
            { dayName: 'Thursday', hours: [] },
            { dayName: 'Friday', hours: [] },
            { dayName: 'Saturday', hours: [] },
            { dayName: 'Sunday', hours: [] },
        ],
    };

    var testDBData = {
        "id": 1,
        "company_name": "ABC",
        "founded_at": "1970",
        "email": "abc@abc.com",
        "logo_url": "/media/da/logo1.png",
        "payment_method": "PayPal",
        "subscription_plan": "Business plan",
        "hours": [
          { "id": 21, "day_name": "Tuesday", "from_time": "9:00", "until_time": "12:30", "db_id": 21 },
        ],
    };
    var testClientData = {
        id: 1,
        companyName: 'ABC',
        foundedAt: '1970',
        email: 'abc@abc.com',
        logoUrl: '/media/da/logo1.png',
        paymentMethod: 'PayPal',
        subscriptionPlan: 'Business plan',
        newLogoFile: undefined,
        previewUrl: '/media/da/logo-dummy.png',
        openingHours: [
            { dayName: 'Monday', hours: [] },
            { dayName: 'Tuesday', hours: [{ id: 21, from: '9:00', until: '12:30', db_id: 21 }] },
            { dayName: 'Wednesday', hours: [] },
            { dayName: 'Thursday', hours: [] },
            { dayName: 'Friday', hours: [] },
            { dayName: 'Saturday', hours: [] },
            { dayName: 'Sunday', hours: [] },
        ],
    };

    var ctrl;
    var mockBackend, mockBackendExpectGET, mockBackendExpectPOST;


    beforeEach( inject( function($controller, $httpBackend) {
        mockBackend = $httpBackend;
        mockBackendExpectGET = mockBackend.expectGET( '/company-profile/' );
        //mockBackendExpectPOST = mockBackend.expectPOST( '/company-profile/' );
        ctrl = $controller('ProfileController');
    }));


    it('GET test 1: should set initial profile data for a new profile', function() {
        // Initially, before the server responds, the data is undefined
        expect(ctrl.regData).toBeFalsy( undefined );

        // Simulate a server response
        mockBackendExpectGET.respond( testDBDataNewCompany );
        mockBackend.flush();

        expect(ctrl.regData).toEqual( testClientDataNewCompany );
    });

    it('GET test 2: should load profile data from server', function() {
        // Initially, before the server responds, the data is undefined
        expect(ctrl.regData).toBeFalsy( undefined );

        // Simulate a server response
        mockBackendExpectGET.respond( testDBData );
        mockBackend.flush();

        expect(ctrl.regData).toEqual( testClientData );
    });

    it('GET test 3: should load an empty list when GET error', function() {
        // Initially, before the server responds, the data is undefined
        expect(ctrl.regData).toBeFalsy( undefined );

        mockBackendExpectGET.respond( 404, {error: 'error'} );
        mockBackend.flush();

        expect(ctrl.regData).toEqual( {} );
    });


    afterEach(function() {
        // Ensure that all expects set on the $httpBackend were actually called
        mockBackend.verifyNoOutstandingExpectation();
        // Ensure that all requests to the server have actually responded (using flush())
        mockBackend.verifyNoOutstandingRequest();
    });


});


