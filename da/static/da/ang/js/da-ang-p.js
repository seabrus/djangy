app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/profile', { 
    templateUrl: '/static/da/ang/html/profile.html', 
    controller: 'ProfileController', 
  });
}]);


app.controller('ProfileController', [ 'DataService', function( DataService ) {
	var self = this;

// Application data
	self.regData = DataService.getData();
    self.paymentMethods = DataService.getPaymentMethods();
    self.subscriptionPlans = DataService.getSubscriptionPlans();

// Tab selection
    self.currentTab = "Basics";

// Upload logo
    self.uploadLogo = DataService.uploadLogo;

// User profile data saving
    self.savingResult = [ '' ];   // 'success' or 'error'
    self.saveUserProfile = function( result ) { DataService.saveUserProfileData( result ); };


// Working hours timetable visibility
	self.showHours = true;
	self.getHoursClass = function() {
        var yes = (self.showHours === false);
        return {
            'show-hours': yes,
            'hide-hours': !yes
        };
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


app.factory('DataService', [ '$http', function( $http ) {

	var regData = {
        id: 1,
        companyName: '',
        foundedAt: '',
        email: '',
        logoUrl: '/media/da/logo1.png',
        paymentMethod: 'PayPal',
        subscriptionPlan: 'Business plan',

        openingHours: [
          { dayName: 'Monday', hours: [ {from: '9:00', until: '12:30'}, {from: '14:00', until: '18:30'}, {from: '19:00', until: '23:30'} ] },
          { dayName: 'Tuesday', hours: [  ] },
          { dayName: 'Wednesday', hours: [ {from: '', until: ''} ] },
          { dayName: 'Thursday', hours: [ {from: '', until: ''} ] },
          { dayName: 'Friday', hours: [ {from: '', until: ''} ] },
          { dayName: 'Saturday', hours: [ {from: '', until: ''} ] },
          { dayName: 'Sunday', hours: [ {from: '', until: ''} ] },
        ],
	};

    var paymentMethods = [ 'Bank transfer', 'PayPal', 'Credit card' ];
    var subscriptionPlans = [ 
        { name: 'Basic plan', style: 'panel-default', description: 'A plan just to test the service' }, 
        { name: 'Business plan', style: 'panel-success', description: 'This plan is selected by most companies' }, 
        { name: 'Advanced plan', style: 'panel-info', description: 'A plan for corporate networks' } 
    ];


    return  { 
        getData: function() { return regData; }, 
        getPaymentMethods: function() { return paymentMethods; }, 
        getSubscriptionPlans: function() { return subscriptionPlans; },

        saveUserProfileData: function( result ) { 
            $http.post( '/profile', regData )
                .success( function() { result[0] = 'success'; } )
                .error( function() { result[0] = 'error'; } );
        },

        uploadLogo: function( e ) { 
            e.preventDefault();

            var files = $( '#file-input' ).get(0).files;
            if ( files.length === 0) {
                alert( 'No file found: Please select a file' );
                return false;
            }

            var file = files[0];
            if ( file.type !== 'image/png'  &&  file.type !== 'image/gif'  &&  file.type !== 'image/jpeg' ) {
                alert( 'The file should be an image. Please select a *.PNG, *.GIF, or *.JPG file' );
                return false;
            }

            e.stopPropagation();
            return ; 
        },

    };

}]);


app.directive('openingHoursDirective', [ function() {
    return {
                templateUrl: '/static/da/ang/html/working-hours.html',
                restrict: 'A'
   };
}]);


/*
// Uploading user's records archive and adding records to DB
    'click .upload-btn': function (e) {
        e.preventDefault();

        var files = $( '#file-input' ).get(0).files;
        if ( files.length === 0) {
            alert( 'No file found: Please select a file' );
            return false;
        }

        var file = files[0];
        if ( file.type !== 'application/gzip'  &&  file.type !== 'application/x-gzip' ) {
            alert( 'The file should be a gzip archive: Please select another file' );
            return false;
        }

        Meteor.call( 'checkFile', function( error, result ) {
            if ( error )  {
                return alert( error.reason );
            }

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
	            //beforeSend: function( xhr, settings ) {
	            //    xhr.setRequestHeader( 'Cache-Control', 'no-cache' );
	            //    xhr.setRequestHeader( 'X-File-Name', file.name );
	            //    xhr.setRequestHeader( 'X-File-Size', file.size );
	            //},
	            dataType: 'text',
	            success: Meteor.bindEnvironment( function() {   // data, textStatus, xhr       // - this works without Meteor.bindEnvironment too. 
	                                alert( 'Records archive is uploaded successfully!' );                   //  But it was not be tested under numerous users 
	                            }),                                                                                                     // connections!
	            error:       Meteor.bindEnvironment( function( xhr, textStatus, errorThrown ) {
	                                alert( xhr.responseText );   // xhr.status
	                            }),
	        });
        });     // end of "Meteor.call( 'checkFile'... "
*/

//var xhr = new XMLHttpRequest();
//xhr.open("POST", '/upload-records-archive' );
//xhr.send( file );
/*      HTTP.call( "POST", '/upload-records-archive',
            {
                data: file,
                headers: {
                    'Content-Type': 'application/x-gzip',
                    'Content-Length': file.size,
                    'X-File-Name': file.name,
                    'X-File-Size': file.size
                },
                //beforeSend: function(xhr){
                    //xhr.setRequestHeader('Content-Type', 'application/x-gzip');
                    //xhr.setRequestHeader('Cache-Control', 'no-cache');
                    //xhr.setRequestHeader('X-File-Name', file.name);
                    //xhr.setRequestHeader('X-File-Size', file.size);
                //},
            },
            function (error, result) {
                if (error) {
                  alert( "HTTP error" );
                }
                if (!error) {
                  alert( "HTTP success" );
                }
        });
*/
//    },

