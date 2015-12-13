var app = angular.module('djangy', ['ngRoute', 'ngResource', 'ngCookies', 'ngSanitize']);

app.config( ['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
}]);

/*
http://django-angular.readthedocs.org/en/latest/integration.html
var my_app = angular.module('MyApp').config(function($httpProvider) {
    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
});

https://github.com/Tivix/angular-django-registration-auth/blob/master/app/scripts/services/djangoAuth.js
$http({
                url: url,
                withCredentials: this.use_session,
                method: method.toUpperCase(),
                headers: {'X-CSRFToken': $cookies['csrftoken']},     <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                params: params,
                data: data
            })

http://blog.kevinastone.com/getting-started-with-django-rest-framework-and-angularjs.html
<script>   
// Add the CSRF Token
var app = angular.module('example.app.editor');
app.config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.headers.common['X-CSRFToken'] = '{{ csrf_token|escapejs }}';
}]);
</script>

http://blog.brunoscopelliti.com/deal-with-users-authentication-in-an-angularjs-web-app/
.directive('checkUser', ['$rootScope', '$location', 'userSrv', 
  function ($r, $location, userSrv) {
    return {
      link: function (scope, elem, attrs, ctrl) {
        $r.$on('$routeChangeStart', function(e, curr, prev){
          if (!prev.access.isFree && !userSrv.isLogged) {
            // reload the login route
          }
          // IMPORTANT:
          // It's not difficult to fool the previous control, so it's really IMPORTANT to repeat server side
          // the same control before sending back reserved data.
          
        });
      }
    }
  }]);
*/


app.config(['$routeProvider', '$locationProvider', function( $routeProvider, $locationProvider ) {
  $routeProvider.when('/', { 
    templateUrl: '/static/da/ang/html/home.html', 
    controller: 'HomeController', 
    routeName: 'home',
  });

  $routeProvider.when('/details/:id', { 
    templateUrl: '/static/da/ang/html/details.html', 
    controller: 'DetailsController', 
    routeName: 'details',
  });

  $routeProvider.otherwise({ redirectTo: '/' });

  // $locationProvider.html5Mode(true); 
}]);



// =============================================================================
//   Controllers
// =============================================================================

app.controller('MainController', [ '$location', function( $location ) {
	var self = this;

    self.getClass = function( path ) {
        if ($location.path().indexOf(path) !== -1) {
            return 'active';
        } else {
            return '';
        }
    };
}]);

app.controller('HomeController', [ 'CompanyListService', function( CompanyListService ) {
	var self = this;

	self.CompaniesData = CompanyListService.getListData();
}]);

app.controller('DetailsController', [ '$routeParams', 'CompanyListService', function( $routeParams, CompanyListService ) {
	var self = this;

	self.CompanyDetailsData = CompanyListService.getItemData( $routeParams.id );
}]);


// =============================================================================
//   Services
// =============================================================================
app.factory('CompanyListService', [ '$http', function( $http ) {

	var dbListData = [         // Retain it as at least an empty [{}] 
        {
            id: 1,
            companyName: 'ABC',
            foundedAt: '1970',
            email: 'abc@abc.com',
            logoUrl: '/media/da/logo1.png',
            paymentMethod: 'PayPal',
            subscriptionPlan: 'Business plan',
            hours: [
              { dayName: 'Tuesday', from: '9:00', until: '12:30', db_id: 21 },
              { dayName: 'Thursday', from: '14:00', until: '18:00', db_id: 45 },
              { dayName: 'Friday', from: '14:00', until: '16:30', db_id: 55 },
              { dayName: 'Wednesday', from: '', until: '', db_id: 30 },
              { dayName: 'Sunday', from: '12:00', until: '13:30', db_id: 79 },
              { dayName: 'Sunday', from: '19:00', until: '23:30', db_id: 77 },
            ],
    	},

        {
            id: 5,
            companyName: 'Nokia',
            foundedAt: '1982',
            email: 'ccc@nokia.com',
            logoUrl: '/media/da/logo2.jpg',
            paymentMethod:  'Credit card',
            subscriptionPlan: 'Business plan',
            hours: [
              { dayName: 'Friday', from: '14:00', until: '16:30', db_id: 55 },
              { dayName: 'Saturday', from: '15', until: '20', db_id: 62 },
              { dayName: 'Sunday', from: '12:00', until: '13:30', db_id: 79 },
              { dayName: 'Sunday', from: '19:00', until: '23:30', db_id: 77 },
            ],
    	},

        {
            id: 12,
            companyName: 'Colombo',
            foundedAt: '2010',
            email: '12@colombo.cc',
            logoUrl: '/media/da/logo3.png',
            paymentMethod: 'Bank transfer',
            subscriptionPlan: 'Business plan',
            hours: [
              { dayName: 'Monday', from: '9:00', until: '12:30', db_id: 11 },
              { dayName: 'Tuesday', from: '9:00', until: '12:30', db_id: 21 },
              { dayName: 'Thursday', from: '14:00', until: '18:00', db_id: 45 },
              { dayName: 'Monday', from: '14:00', until: '16:30', db_id: 12 },
              { dayName: 'Friday', from: '14:00', until: '16:30', db_id: 55 },
              { dayName: 'Monday', from: '19:00', until: '23:30', db_id: 15 },
              { dayName: 'Tuesday', from: '19:00', until: '23:30', db_id: 22 },
              { dayName: 'Wednesday', from: '', until: '', db_id: 30 },
            ],
    	},

    ];

	var CompanyDetailsData = {
        id: 0,
        companyName: '',
        foundedAt: '',
        email: '',
        logoUrl: '',
        paymentMethod: '',
        subscriptionPlan: '',
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


    return  { 
        getListData: function() { 
            return dbListData; 
        },

        getItemData: function( id ) { 
            if ( !id )  return {};

            for ( var i=0, len=dbListData.length; i<len; i++ ) {
                if (id === dbListData[i].id + '' )
                    break;
            }
            if ( i === len )  return {};

            var dbData = dbListData[i];

            var commonParams = [ 'id', 'companyName', 'foundedAt', 'email', 'logoUrl', 'paymentMethod', 'subscriptionPlan' ];
            for (var k=0, len=commonParams.length; k < len; k++) {
                CompanyDetailsData[ commonParams[k] ] = dbData[ commonParams[k] ];
            }

            var days = [ 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday' ];
            for (var k=0; k < 7; k++) {
                CompanyDetailsData.openingHours[ k ].hours = [];
                for (var j=0, len=dbData.hours.length; j < len; j++) {
                    if ( dbData.hours[ j ].dayName === days[k] ) {
                        var times ={};
                        times.from = dbData.hours[ j ].from;
                        times.until = dbData.hours[ j ].until;
                        times.db_id = dbData.hours[ j ].db_id;
                        CompanyDetailsData.openingHours[ k ].hours.push( times );
                    }
                }
            }

            return CompanyDetailsData; 
        }, 
 
    };

}]);

