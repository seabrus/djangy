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


app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', { 
    templateUrl: '/static/da/ang/html/home.html', 
    controller: 'HomeController', 
  });

  $routeProvider.when('/details/:id', { 
    templateUrl: '/static/da/ang/html/details.html', 
    controller: 'DetailsController', 
  });

  $routeProvider.otherwise({ redirectTo: '/' });
}]);



app.controller('HomeController', [ 'CompanyListService', function( CompanyListService ) {
	var self = this;

	self.CompaniesData = CompanyListService.getData();
}]);

app.controller('DetailsController', [ '$routeParams', 'CompanyDetailsService', function( $routeParams, CompanyDetailsService ) {
	var self = this;

	self.CompanyDetailsData = CompanyDetailsService.getData( $routeParams.id );
}]);



app.factory('CompanyListService', [ '$http', function( $http ) {

	var CompanyListData = [ 
        {
            id: 1,
            companyName: 'ABC',
            foundedAt: '1970',
            email: 'abc@abc.com',
            logoUrl: '/media/da/logo1.png',
            paymentMethod: 'PayPal',
    	}, 

        {
            id: 5,
            companyName: 'Nokia',
            foundedAt: '1982',
            email: 'ccc@nokia.com',
            logoUrl: '/media/da/logo2.jpg',
            paymentMethod:  'Credit card',
    	}, 

        {
            id: 12,
            companyName: 'Colombo',
            foundedAt: '2010',
            email: '12@colombo.cc',
            logoUrl: '/media/da/logo3.png',
            paymentMethod: 'Bank transfer',
    	}, 

    ];

    return  { 
        getData: function() { return CompanyListData; }, 
    };

}]);


app.factory('CompanyDetailsService', [ '$http', function( $http ) {

	var CompanyDetailsData = {
        id: 22,
        companyName: 'ABC',
        foundedAt: '1970',
        email: 'abc@abc.com',
        logoUrl: '/media/da/logo1.png',
        paymentMethod: 'PayPal',
        subscriptionPlan: 'Business plan',

        openingHours: [
          { dayName: 'Monday', hours: [ {from: '9:00', until: '12:30'}, {from: '14:00', until: '18:30'}, {from: '19:00', until: '23:30'} ] },
          { dayName: 'Tuesday', hours: [ ] },
          { dayName: 'Wednesday', hours: [ ] },
          { dayName: 'Thursday', hours: [  {from: '9:00', until: '12:30'}, {from: '14:00', until: '18:30'}, {from: '19:00', until: '23:30'}  ] },
          { dayName: 'Friday', hours: [ ] },
          { dayName: 'Saturday', hours: [ ] },
          { dayName: 'Sunday', hours: [ ] },
        ],
	};

    return  { 
        getData: function( id ) { return CompanyDetailsData; }, 
    };

}]);

