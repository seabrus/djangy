app.config(['$routeProvider', function($routeProvider) {

  $routeProvider.when('/profile', { 
    templateUrl: '/static/da/ang/html/profile.html', 
    controller: 'ProfileController', 
    controllerAs: 'ctrl',
    routeName: 'profile',
  });

}]);


// =============================================================================
//   Controllers
// =============================================================================
app.controller('ProfileController', [ 'DataService', function( DataService ) {
	var self = this;

  // Application data initialization
	// self.regData
    DataService.getData()
        .then( function(response) {  
            self.regData = response.data;
            return 1;
        })
        .catch( function() {
            self.regData = [];
            if ( window.console ) { 
                console.log('ProfileController: Error when GETting data');
            }
        });

    self.paymentMethods = DataService.getPaymentMethods();
    self.subscriptionPlans = DataService.getSubscriptionPlans();

  // Tab selection initialization
    self.currentTab = "Basics";

  // User profile data saving
    self.savingResult = [ '' ];   // 'success' or 'error'
    self.saveUserProfile = function( result ) { DataService.saveUserProfileData( result ); };


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
			var buf = {from: '', until: ''};
			selectedDay.hours.splice( j+1, 0, buf );
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
app.factory('DataService', [ '$http', function( $http ) {

	var regData = {};
    var paymentMethods = [ 'Bank transfer', 'PayPal', 'Credit card' ];
    var subscriptionPlans = [ 
        { name: 'Basic plan', style: 'panel-default', description: 'A plan just to test the service' }, 
        { name: 'Business plan', style: 'panel-success', description: 'This plan is selected by most companies' }, 
        { name: 'Advanced plan', style: 'panel-info', description: 'A plan for corporate networks' } 
    ];

	var dbData = {};
/* {
        id: 1,
        companyName: '',
        foundedAt: '',
        email: '',
        logoUrl:  '/media/da/logo2.jpg',
        paymentMethod: 'PayPal',
        subscriptionPlan: 'Business plan',
        hours: [
          { dayName: 'Monday', from: '9:00', until: '12:30', db_id: 11 },
        ],
	};
*/

    // Conform DB and client-side data structures and properties names
    function prepareData(data) {
        regData = {
            id: 0,
            companyName: '',
            foundedAt: '',
            email: '',
            paymentMethod: '',
            subscriptionPlan: '',
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
        if ( data['is_new'] == true ) {
            return regData;
        }

        // Existing company profile
        // Initial data (python-style named data) => dbData (javascript-style named data)
        var dbProps  = [ "id", "company_name", "founded_at", "email", "payment_method", "subscription_plan", "logo_url", ];
        var angProps = [ "id", "companyName", "foundedAt", "email", "paymentMethod", "subscriptionPlan", "logoUrl", ];
        var dbHoursPr  = [ "id", "day_name", "from_time", "until_time", "db_id", ];
        var angHoursPr = [ "id", 'dayName', 'from', 'until', 'db_id', ];

        dbData = {};

        for (var n=0, len1=dbProps.length; n<len1; n++ ) {
            dbData[ angProps[n] ] = data[ dbProps[n] ]; 
        }

        dbData['hours'] = [];
        for (var m=0, len2=data['hours'].length; m<len2; m++ ) {
            var hourItem = {};

            for (var p=0, len3=dbHoursPr.length; p<len3; p++ ) {
                hourItem[ angHoursPr[p] ] = data['hours'][ m ][ dbHoursPr[p] ]; 
            }
            dbData['hours'].push( hourItem );
        }

        data = {};

        // dbData (javascript-style named data) => regData (convenient for displaying in the view)
        var commonParams = [ 'id', 'companyName', 'foundedAt', 'email', 'paymentMethod', 'subscriptionPlan', 'logoUrl' ];
        for (var k=0, len=commonParams.length; k < len; k++) {
            regData[ commonParams[k] ] = dbData[ commonParams[k] ];
        }

        var days = [ 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday' ];
        for (var k=0; k < 7; k++) {
            regData.openingHours[ k ].hours = []; regData.openingHours
            for (var j=0, len=dbData.hours.length; j < len; j++) {
                 if ( dbData.hours[ j ].dayName === days[k] ) {
                    var times ={};
                    times.from = dbData.hours[ j ].from;
                    times.until = dbData.hours[ j ].until;
                    times.db_id = dbData.hours[ j ].db_id;

                    regData.openingHours[ k ].hours.push( times );
                }
            }
        }

        return regData;
    }   // end of "function prepareData(data) ..."



    return  { 
        getData0: function() { 
            return regData;
        },

        getData: function() { 
            url = '/company-profile/';
            return $http({
                method: 'GET',
                url: url,
                responseType: 'json',
                transformResponse: prepareData, 
            });
        },

        getPaymentMethods: function() { return paymentMethods; }, 
        getSubscriptionPlans: function() { return subscriptionPlans; },

        saveUserProfileData: function( result ) { 
            $http.post( '/profile', regData )
                .success( function() { result[0] = 'success'; } )
                .error( function() { result[0] = 'error'; } );
        },

    };

}]);



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


/*
	        $.ajax({
	            url: '/upload-records-archive',
	            type: 'POST',
	            processData: false,
	            data: file,
	            contentType: 'application/octet-stream',
	            //contentType: 'application/x-gzip',     // this works too
	            //contentType: 'multipart/form-data',   // this works too
	            headers: {
	                'X-File-Size': file.size,
	                'X-File-Name': Meteor.userId(),
	                'X-File-Checksum': result,
	                'Cache-Control': 'no-cache',
	            },
	            dataType: 'text',
	            success: Meteor.bindEnvironment( function() {   // data, textStatus, xhr
	                                alert( 'Records archive is uploaded successfully!' );
	                            }),
	            error:       Meteor.bindEnvironment( function( xhr, textStatus, errorThrown ) {
	                                alert( xhr.responseText );   // xhr.status
	                            }),
	        });
        });
    },
*/

