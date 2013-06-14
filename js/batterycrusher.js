( function( window, undefined ) {

	"use strict";

	var document = window.document;

	function BatteryCrusherJS() {

		// get the battery API stuff
		var battery = navigator.battery || navigator.webkitBattery || navigator.mozBattery;
		var statusElement = null, fire = null;
		var videoHeight = 200, videoWidth = 200;

		// shim layer with setTimeout fallback - from Paul Irish
		window.requestAnimFrame = (function(){
			return  window.requestAnimationFrame       ||
				window.webkitRequestAnimationFrame ||
				window.mozRequestAnimationFrame    ||
				window.oRequestAnimationFrame      ||
				window.msRequestAnimationFrame     ||
				function( callback ){
					window.setTimeout(callback, 1000 / 60);
				};
		})();


		function _killBattery() {
			if( battery === undefined ) {
				return;
			}

			_cacheElements();
			_bindEvents();
			_updateBatteryProgress();

			if( ! _charging() ) {
				fire.style.display = 'block';
			}

			// start the chaos!!!
			_turnOnLocation();
			_turnOnWebCam();
			_startPolling();
		}

		function _turnOnWebCam() {
			if( navigator.mozGetUserMedia ) {
				navigator.mozGetUserMedia( { video : true }, _startVideo, function() {
					console.log( 'error' );
				} );
			}
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
			if( ! _charging() ) {
				fire.style.display = 'none';
			}
			else {
				fire.style.display = 'block';
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
			if( battery.charging === false && navigator.geolocation ) {
				navigator.geolocation.getCurrentPosition( function() {
					setTimeout( _turnOnLocation, 200 );
				} );
			}
		}

		function _startPolling() {
			//
		}

		function _charging() {
			// The computer is plugged in and it is charging
			if ( battery.charging === true ) {
				return true;

			// The computer is plugged in, but it is fully charged. battery.charging reports as false in this case
			} else if ( battery.charging === false && battery.dischargingTime === Number.POSITIVE_INFINITY ) {
				return true;

			// All other results indicated no charging
			} else {
				return false;
			}
		}

		return {
			killBattery : _killBattery
		};
	}

	window.batterycrusherjs = new BatteryCrusherJS();

} )( window );