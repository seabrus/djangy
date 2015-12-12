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

  $routeProvider.otherwise({ redirectTo: '/' });
}]);



app.controller('HomeController', [ 'CompanyListService', function( CompanyListService ) {
	var self = this;

	//self.regData = CompanyListService.getData();
}]);


app.factory('CompanyListService', [ '$http', function( $http ) {

	var CompanyListData = [ 
        {
            companyName: '',
            foundedAt: '',
            email: '',
            logoUrl: '/media/da/dj.png',
            paymentMethod: 'PayPal',
            subscriptionPlan: 'Business plan',
    	}, 
    ];

    return  { 
        getData: function() { return regData; }, 
    };

}]);

