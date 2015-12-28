// ==========================================================
//     MainController
// ==========================================================
describe('MainController', function() {

    // Instantiate a new version of my module before each test
    beforeEach( module('djangy') );

    var ctrl = null;
    var loc = null;

    // Before each unit test, instantiate a new instance of the controller
    beforeEach( inject( function($controller, $location) {
        //ctrl = $controller('MainController', {$location: $location});
        ctrl = $controller('MainController');
        loc = $location;
    }));

    it('test 1: should have method getClass() available on load', function() {
        expect(ctrl.getClass).toBeTruthy();
    });

    it('test 2: should get an empty string from getClass() when the path is not /profile', function() {
        loc.path('#/');
        var testPath = '/profile';
        var result = ctrl.getClass( testPath );
        expect(result).toEqual( '' );
    });

    it('test 3: should get a string "active" from getClass() for the path /profile', function() {
        loc.path('#/profile');
        var testPath = '/profile';
        var result = ctrl.getClass( testPath );
        expect(result).toEqual( 'active' );
    });

});



// ==========================================================
//     HomeController   ---   Integration-Level Unit Test
// ==========================================================
describe('HomeController', function() {
    beforeEach( module('djangy') );

    var testDBData = [{
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
    }];
    var testClientData = [{
        id: 1,
        companyName: 'ABC',
        foundedAt: '1970',
        email: 'abc@abc.com',
        logoUrl: '/media/da/logo1.png',
        paymentMethod: 'PayPal',
        subscriptionPlan: 'Business plan',
        hours: [
          { id: 21, dayName: 'Tuesday', from: '9:00', until: '12:30', db_id: 21 },
        ],
    }];

    var ctrl, mockBackend, mockBackendExpect;


    beforeEach( inject( function($controller, $httpBackend) {
        mockBackend = $httpBackend;
        mockBackendExpect = mockBackend.expectGET( '/companies/' );   //.respond( testDBData );

        ctrl = $controller('HomeController');
        // At this point, a server request will have been made
    }));

    it('test 1: should load list of data from server', function() {
        // Initially, before the server responds, the list is undefined
        expect(ctrl.CompaniesData).toBeFalsy( undefined );

        // Simulate a server response
        mockBackendExpect.respond( testDBData );
        mockBackend.flush();

        expect(ctrl.CompaniesData).toEqual( testClientData );
    });

    it('test 2: should load an empty list when error', function() {
        // Initially, before the server responds, the list is undefined
        expect(ctrl.CompaniesData).toBeFalsy( undefined );

        // Simulate a server response
        mockBackendExpect.respond( 404, {'error': 'error'} );
        mockBackend.flush();

        expect(ctrl.CompaniesData).toEqual( [] );
    });

    afterEach(function() {
        // Ensure that all expects set on the $httpBackend were actually called
        mockBackend.verifyNoOutstandingExpectation();
        // Ensure that all requests to the server have actually responded (using flush())
        mockBackend.verifyNoOutstandingRequest();
    });

});


/*    var ctrl, mockService;

    beforeEach( module( function($provide) {
        mockService = {
          getListData: function() {
            return [{id: 1, label: 'Mock'}];
          }
        };
        $provide.value('CompanyListService', mockService);
    }));

    beforeEach( inject( function($controller) {
        ctrl = $controller('HomeController');
    }));

    it(' 1: should load mocked out list of data', function() {
        expect(ctrl.CompaniesData).toEqual([{id: 1, label: 'Mock'}]);
    });
*/


/*    var ctrl, listData;

    beforeEach( inject( function($controller, CompanyListService) {
        spyOn(CompanyListService, 'getListData')
            .and.returnValue( [ {id: 1, label: 'Mock'} ] );
        listData = CompanyListService;
        ctrl = $controller('HomeController');
    }));

    it(' 1: should load mocked out list of data', function() {
        expect(listData.getListData).toHaveBeenCalled();
        expect(listData.getListData.calls.count()).toEqual(1);
        expect(ctrl.CompaniesData).toEqual( [{id: 1, label: 'Mock'}] );
    });
*/

