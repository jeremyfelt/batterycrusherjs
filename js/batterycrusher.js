( function( window, undefined ) {

	"use strict";

	var document = window.document;

	function BatteryCrusherJS() {

		// get the battery API stuff
		var battery = navigator.battery || navigator.webkitBattery || navigator.mozBattery;
		var statusElement = null, fire = null;
		var videoHeight = 200, videoWidth = 200;
		var crushing = false;
		var locationTimer = false;

		function _killBattery() {
			if( battery === undefined ) {
				return;
			}

			_cacheElements();
			_bindEvents();
			_updateBatteryProgress();

			if( _charging() === false ) {
				fire.style.display = 'block';
				crushing = true;
				_startApp();
			}
		}

		function _startApp() {
			crushing = true;
			_turnOnLocation();
			_turnOnWebCam();
		}

		function _stopApp() {
			crushing = false;
			_turnOffLocation();
			_turnOffWebCam();
		}

		function _turnOnWebCam() {
			if( _charging() === false && navigator.mozGetUserMedia ) {
				navigator.mozGetUserMedia( { video : true }, _startVideo, function() {} );
			}
		}

		function _turnOffWebCam() {
			$( 'video' ).remove();
		}

		function _createNewVideo( column, row, videoSrc ) {
			var x = column * videoWidth;
			var y = row * videoHeight;

			var video = document.createElement( 'video' );
			$( video ).css( {
				position : 'absolute',
				top: y,
				left : x,
				height : videoHeight,
				width : videoWidth,
				backgroundColor : '#000',
			} ).appendTo( document.body );

			video.src = videoSrc;
			video.play();
		}

		function _startVideo( stream ) {
			// tile the page with cameras
			var $window = $( window );
			var windowHeight = $window.height(), windowWidth = $window.width();
			var videoSrc = window.URL.createObjectURL( stream );

			var columnCount = Math.ceil( windowWidth / videoWidth );
			var rowCount = Math.ceil( windowHeight / videoHeight );
			var totalVideos = columnCount * rowCount;
			var currentColumnCount = 0;
			var currentRowCount = 0;

			for( var i = 0; i < totalVideos; i++ ) {
				if( currentColumnCount === columnCount ) {
					currentColumnCount = 0;
					currentRowCount++;
				}
				_createNewVideo( currentColumnCount, currentRowCount, videoSrc );
				currentColumnCount++;
			}
		}

		function _updateBatteryProgress() {
			statusElement.innerHTML = battery.level * 100 + "%";
		}

		function _bindEvents() {
			battery.addEventListener( 'chargingchange', _onBatteryStateChange );
			battery.addEventListener( 'levelchange', _updateBatteryProgress );
		}

		function _onBatteryStateChange() {
			if( _charging() ) {
				fire.style.display = 'none';
				_stopApp();
			}
			else {
				fire.style.display = 'block';
				_startApp();
			}
		}

		function _cacheElements() {
			statusElement = document.getElementById( 'battery-level' );
			fire = document.getElementById( 'fire' );
		}

		/**
		 * Keep requesting the location settings indefinitely
		 *
		 * @private
		 */
		function _turnOnLocation() {
			if( _charging() === false && navigator.geolocation ) {
				navigator.geolocation.getCurrentPosition( function() {
					locationTimer = setTimeout( _turnOnLocation, 200 );
				} );
			}
		}

		function _turnOffLocation() {
			if( locationTimer !== false ) {
				clearTimeout( locationTimer );
				locationTimer = false;
			}
		}

		function _charging() {
			return battery.charging;
		}

		return {
			killBattery : _killBattery
		};
	}

	window.batterycrusherjs = new BatteryCrusherJS();

} )( window );