app.config(['$routeProvider', function($routeProvider) {

  $routeProvider.when('/profile', { 
    templateUrl: '/static/da/ang/html/profile.html', 
    controller: 'ProfileController', 
    controllerAs: 'ctrl',
    routeName: 'profile',
  });

}]);

// URL for GET and POST requests for a company profile
app.value( 'COMPANY_PROFILE_URL', '/company-profile/' );



// =============================================================================
//   Controllers
// =============================================================================
app.controller('ProfileController', [ 'DataService', function( DataService ) {
	var self = this;

  // self.regData -- the main controller data object
    DataService.getData()
        .then( function(response) {  
            self.regData = response.data;
            return 1;
        })
        .catch( function() {
            self.regData = {};
            if ( window.console ) { 
                console.log('ProfileController: Error when GETting data');
            }
        });

    self.paymentMethods = DataService.getPaymentMethods();
    self.subscriptionPlans = DataService.getSubscriptionPlans();

  // Tab selection initialization
    self.currentTab = 'Basics';

  // Variables to remember validation status for the closed ngSwitch tabs
    self.visited1 = false;
    self.visited2 = false;
    self.visited3 = false;
    self.validity = { 'Basics': true, 'Hours': true};
    self.setValidity = function( tab, isValid ){
        if (tab === 'Basics')
            self.validity[ 'Basics' ] = isValid;
        if (tab === 'Hours')
            self.validity[ 'Hours' ] = isValid;
    };


  // User profile data saving
    self.savingResult = [ '', '' ];   // 'success' or 'error'
    self.saveCompanyProfile = function() { 
        self.savingResult[0] = ''; 
        self.savingResult[1] = '';

        if (self.validity[ 'Basics' ] === false) {
            self.savingResult[0] = 'invalidBasics';
            return;
        }
        if (self.validity[ 'Hours' ] === false) {
            self.savingResult[0] = 'invalidHours';
            return;
        }

        DataService.saveCompanyProfileData( self.savingResult ); 
    };


  //===============================================
  //     Add / Delete time spans
  //===============================================
	self.addTimeSpan = function( dayName, tsFrom, tsUntil ) {
        // Find the active day of the week
		for ( var i=0, len1=self.regData.openingHours.length; i<len1; i++ )
			if ( dayName === self.regData.openingHours[ i ].dayName ) break;

        // Find the active time span
        var selectedDay = self.regData.openingHours[ i ];
		for ( var j=0, len2=selectedDay.hours.length; j<len2; j++ )
			if ( tsFrom === selectedDay.hours[ j ].from  &&  tsUntil === selectedDay.hours[ j ].until ) break;

        // Add a new time span after the active one  OR  the first one into an empty array of time spans  
		if ( j < len2  ||  len2 === 0 ) {
			var buf = {from: '', until: '', id: 0, db_id: DataService.AVAILABLE_DB_ID};
			selectedDay.hours.splice( j+1, 0, buf );
            DataService.AVAILABLE_DB_ID--;
		}
	};

	self.deleteTimeSpan = function( dayName, tsFrom, tsUntil ) {
        // Find the active day of the week
		for ( var i=0, len1=self.regData.openingHours.length; i<len1; i++ )
			if ( dayName === self.regData.openingHours[ i ].dayName ) break;

        // Find the active time span
        var selectedDay = self.regData.openingHours[ i ];
		for ( var j=0, len2=selectedDay.hours.length; j<len2; j++ )
			if ( tsFrom === selectedDay.hours[ j ].from  &&  tsUntil === selectedDay.hours[ j ].until ) break;

        // Delete the active time span
		if ( j < len2 )
			selectedDay.hours.splice( j, 1 );
	};

}]);


// =============================================================================
//   Services
// =============================================================================
app.factory('DataService', [ '$http', 'COMPANY_PROFILE_URL', function( $http, COMPANY_PROFILE_URL ) {

    // dummy index for new hour spans -- "db_id" value
    var AVAILABLE_DB_ID = -1;   

    // Data objects
	var regData = {};
    var paymentMethods = [ 'Bank transfer', 'PayPal', 'Credit card' ];
    var subscriptionPlans = [ 
        { name: 'Basic plan', style: 'panel-default', description: 'A plan just to test the service' }, 
        { name: 'Business plan', style: 'panel-success', description: 'This plan is selected by most companies' }, 
        { name: 'Advanced plan', style: 'panel-info', description: 'A plan for corporate networks' } 
    ];
	//var dbData = {};


// Conform DB and client-side data structures and properties names
    function prepareData(data) {
        regData = {
            id: 0,
            companyName: '',
            foundedAt: '',
            email: '',
            paymentMethod: 'PayPal',
            subscriptionPlan: 'Business plan',
            logoUrl: '',   // the current logo from DB on the server
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

        // New company profile
        if ( data['is_new'] === true ) {
            return regData;
        }

        // Error response (404, etc) -- data doesn't include required fields
        if ( data['hours'] === undefined ) {
            return data;
        }

        // Existing company profile
        var dbProps  = [ "id", "company_name", "founded_at", "email", "payment_method", "subscription_plan", "logo_url", ];
        var angProps = [ "id", "companyName", "foundedAt", "email", "paymentMethod", "subscriptionPlan", "logoUrl", ];

        for (var n=0, len1=dbProps.length; n<len1; n++ ) {
            regData[ angProps[n] ] = data[ dbProps[n] ]; 
        }

        var days = [ 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday' ];
        var dbHoursPr  = [ "id", "from_time", "until_time", "db_id", ];   // "day_name" 
        var angHoursPr = [ "id", 'from', 'until', 'db_id', ];                      // 'dayName' 

        for (var k=0; k < 7; k++) {
            regData.openingHours[ k ].hours = [];
            for (var j=0, len=data['hours'].length; j < len; j++) {
                 if ( data['hours'][ j ]['day_name'] === days[k] ) {
                    var times ={};
                    for ( var i=0, len1=dbHoursPr.length; i < len1; i++ ) {
                        times[ angHoursPr[i] ] = data['hours'][ j ][ dbHoursPr[i] ];
                    }
                    regData.openingHours[ k ].hours.push( times );
                }
            }
        }

        data = {};
        return regData;
    }   // end of "function prepareData(data) ..."


// Preparation data for saving in the DB on the server
    function prepareDataForSaving(data) {

        var dbHoursPr  = [ "id", "from_time", "until_time", "db_id", ];   // "day_name" -- additional property
        var angHoursPr = [ "id", 'from', 'until', 'db_id', ];                      // 'dayName'

        var dbData = {hours: []};

        var days = [ 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday' ];
        for (var k=0; k < 7; k++) {
            for (var j=0, len=regData.openingHours[ k ].hours.length; j < len; j++) {
                var item = {};
                for (var m=0, len1=dbHoursPr.length; m < len1; m++) {
                    item[ dbHoursPr[m] ] = regData.openingHours[ k ].hours[ j ][ angHoursPr[m] ];
                }
                item[ 'day_name' ] = days[ k ];
                dbData.hours.push( item );
            }
        }

        var dbProps  = [ "id", "company_name", "founded_at", "email", "payment_method", "subscription_plan", "logo_url", ];
        var angProps = [ "id", "companyName", "foundedAt", "email", "paymentMethod", "subscriptionPlan", "logoUrl", ];

        for (var k=0, len=dbProps.length; k < len; k++) {
            dbData[ dbProps[k] ] = regData[ angProps[k] ];
        }

        return angular.toJson(dbData);
    }   // end of "function prepareDataForSaving(data) ..."



    return  { 
        AVAILABLE_DB_ID: AVAILABLE_DB_ID,

        getData0: function() {     // it is used for testing
            return regData;
        },

        getPaymentMethods: function() { return paymentMethods; }, 
        getSubscriptionPlans: function() { return subscriptionPlans; },

        getData: function() { 
            return $http({
                method: 'GET',
                url: COMPANY_PROFILE_URL,
                responseType: 'json',
                transformResponse: prepareData, 
            });
        },


        saveCompanyProfileData: function( result ) { 
            var postRequest = null;

            if ( regData.newLogoFile === undefined ) {
                postRequest = $http({
                    method: 'POST',
                    url: COMPANY_PROFILE_URL,
                    headers: { 'Content-Type': 'application/json', },
                    data: {},   // dummy data -- real data are prepared in "transformRequest"
                    transformRequest: prepareDataForSaving, 
                });
            }


            if ( regData.newLogoFile !== undefined ) {
                var fd = new FormData();
                var jsonData = prepareDataForSaving();
                fd.append('json_data', jsonData);
                fd.append('logo_img', regData.newLogoFile);

                postRequest = $http({
                    method: 'POST',
                    url: COMPANY_PROFILE_URL,
                    headers: { 'Content-Type': undefined, },
                    data: fd,
                });
            }


            return postRequest.then( function( response ) {     // No need to JSON.parse here - the response is already parsed
                    result[0] = 'success';
                    regData.logoUrl = response.data.logo_url  ||  '';
                    regData.newLogoFile = undefined;
                    regData.previewUrl = '/media/da/logo-dummy.png';
                })
                .catch( function( err ) {
                    if ( !err )  return;
                    result[0] = 'error';
                    try {
                        var keys = Object.keys(err.data);
                        var str = '';
                        for (var k=0, len=keys.length; k < len; k++) {
                            str += keys[k] + ': ' + err.data[ keys[k] ].join(', ') + '\n';
                        }
                        result[1] = str;
                    }
                    catch(e) {
                        result[1] = 'Error: status = ' + err.status + ', ' + err.statusText;     // err.status == 500, 404 and so on
                    }
                });

        },   // end of "saveCompanyProfileData: ... " method

    };   // end of "return ..." of the service
}]);



// =============================================================================
// =============================================================================
//   Directives
// =============================================================================
app.directive('openingHoursDirective', [ function() {
    return {
                restrict: 'A',
                templateUrl: '/static/da/ang/html/working-hours.html',
   };
}]);


app.directive('previewImage', [ function() {
    return {
                restrict: 'A',
                scope: {
                    url: '=previewUrl',
                },
                transclude: true,
                template: '<div class="text-center"><img ng-src="{{ url }}" alt="Company logo" id="preview-img"></div><div ng-transclude></div>',
                controller: ['$scope', function($scope) {
                    this.scope = $scope;
                    //$scope.url = this.logoUrl;
                    //this.logoUrl = '/media/da/logo-dummy.png';
                }],
                controllerAs: 'ctrl',
   };
}]);

app.directive('checkImage', [ function() {
    return {
                restrict: 'A',
                scope: {
                    imgFile: '=newLogoFile',
                },
                require: '^previewImage',
                link: function($scope, $elem, $attrs, ctrl) {

                    $elem.on('change', function( e ) {
                        e.preventDefault();
                    // Sanity checks
                        var files = $elem.get(0).files;
                        if ( files.length === 0) {
                            alert( 'No file found: Please select a file' );
                            return false;
                        }

                        var file = files[0];
                        if ( file.type !== 'image/png'  &&  file.type !== 'image/gif'  &&  file.type !== 'image/jpeg' ) {
                            resetImage( true, 'The file should be an image. Please select a *.PNG, *.GIF, or *.JPG file' );
                            return false;
                        }
                        if ( file.size > 100000) {
                            resetImage( true, 'The file is too large. Please select a file less than 100Kb in size'  );
                            return false;
                        }

                    // Preview image url
                        var reader = new FileReader();
                        reader.onload = function( e ) {
                            ctrl.scope.$apply( function() {
                                ctrl.scope.url = e.target.result;
                                //ctrl.logoUrl = reader.result;
                            });
                        };
                        reader.readAsDataURL(file);

                    // Save the image file on the client
                       $scope.imgFile = file;

                        e.stopPropagation();
                        return; 
                    });   // end of "$elem.on('change',..."


                    $scope.$on('CANCEL_IMAGE_SELECTION', function() {
                        resetImage( false );                            
                    });


                    function resetImage( needAlert, errorText ) {
                        if ( needAlert ) {
                            alert( errorText );
                        }
                        $elem.val('');   //http://webtips.krajee.com/clear-html-file-input-value-ie-using-javascript/ -but there are some errors
                        $scope.imgFile = undefined;
                        ctrl.scope.url = '/media/da/logo-dummy.png';
                        if ( needAlert ) {
                            ctrl.scope.$apply();
                            //ctrl.logoUrl = '/media/da/logo-dummy.png';
                        }
                    }
                },   // end of "link: ..."
   };
}]);


