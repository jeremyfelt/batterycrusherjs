( function( window, undefined ) {

	function BatteryCrusherJS() {

		// get the battery API stuff
		var battery = navigator.battery || navigator.webkitBattery || navigator.mozBattery;
		var statusElement = null, fire = null;

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
			//
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
			} else if ( battery.charging === false && battery.chargingTime === Number.POSITIVE_INFINITY ) {
				return true;

			// All other results indicated no charging
			} else {
				return false;
			}
		}

		function _notCharging() {

		}

		return {
			killBattery : _killBattery
		};
	}

	window.batterycrusherjs = new BatteryCrusherJS();

} )( window );