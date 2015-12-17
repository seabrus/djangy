var app = angular.module('djangy', ['ngRoute', 'ngResource', 'ngCookies', 'ngSanitize']);


app.config( ['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
}]);

/*    ===   Valuable snippets for general setting up of Angular  ===

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
    controllerAs: 'ctrl',
    routeName: 'home',
  });

  $routeProvider.when('/details/:id', { 
    templateUrl: '/static/da/ang/html/details.html', 
    controller: 'DetailsController', 
    controllerAs: 'ctrl',
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

    // Class for the current menu item 
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
    // "self.CompaniesData" is the main data object for this view

    CompanyListService.getListData()
        .then( function(response) {  
            self.CompaniesData = response.data;
            return 1;
        })
        .catch( function() {
            self.CompaniesData = [];
            if ( window.console ) { 
                console.log('HomeController: Error when getting data');
            }
        });
}]);

app.controller('DetailsController', [ '$routeParams', 'CompanyListService', function( $routeParams, CompanyListService ) {
	var self = this;

	self.CompanyDetailsData = CompanyListService.getItemData( $routeParams.id );
}]);


// =============================================================================
//   Services
// =============================================================================
app.factory('CompanyListService', [ '$http', function( $http ) {

	var CompanyListData = [];
/*        {
            id: 1,
            companyName: 'ABC',
            foundedAt: '1970',
            email: 'abc@abc.com',
            logoUrl: '/media/da/logo1.png',
            paymentMethod: 'PayPal',
            subscriptionPlan: 'Business plan',
            hours: [
              { dayName: 'Tuesday', from: '9:00', until: '12:30', db_id: 21 },
            ],
    	},
*/
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


    // Conform DB and client-side data structures and properties names
    function prepareData(data) {
        CompanyListData = [];

        var dbProps  = [ "id", "company_name", "founded_at", "email", "payment_method", "subscription_plan", "logo_url", ];
        var angProps = [ "id", "companyName", "foundedAt", "email", "paymentMethod", "subscriptionPlan", "logoUrl", ];
        var dbHoursPr  = [ "id", "day_name", "from_time", "until_time", "db_id", ];
        var angHoursPr = [ "id", 'dayName', 'from', 'until', 'db_id', ];

        for (var k=0, len=data.length; k<len; k++ ) {
            var item = {};

            for (var n=0, len1=dbProps.length; n<len1; n++ ) {
                item[ angProps[n] ] = data[ k ][ dbProps[n] ]; 
            }

            item['hours'] = [];
            for (var m=0, len2=data[ k ]['hours'].length; m<len2; m++ ) {
                var hourItem = {};

                for (var p=0, len3=dbHoursPr.length; p<len3; p++ ) {
                    hourItem[ angHoursPr[p] ] = data[ k ]['hours'][ m ][ dbHoursPr[p] ]; 
                }
                item['hours'].push( hourItem );
            }

            CompanyListData.push( item );
        }

        data = [];

        return CompanyListData; 
    }   // end of "function prepareData(data) ..."


   // Prepare data structures for an individual company
    function prepareDetailData( id ) {
        if ( !id )  return {};

        for ( var i=0, len=CompanyListData.length; i<len; i++ ) {
            if (id === CompanyListData[i].id + '' )
                break;
        }
        if ( i === len )  return {};

        var dbData = CompanyListData[i];

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
    }


    return  { 
        getListData: function() { 
            url = '/companies/';
            return $http({
                method: 'GET',
                url: url,
                responseType: 'json',
                transformResponse: prepareData, 
            });
        },

        getItemData: prepareDetailData,
     };

}]);

