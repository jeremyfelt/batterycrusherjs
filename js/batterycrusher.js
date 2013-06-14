( function( window, undefined ) {

	function BatteryCrusherJS() {

		// get the battery API stuff
		var battery = navigator.battery || navigator.webkitBattery || navigator.mozBattery;

		function _killBattery() {
			if( battery === undefined ) {
				return;
			}

			_turnOnLocation();
			_startPolling();
		}

		function _turnOnLocation() {
			//
		}

		function _startPolling() {
			//
		}

		return {
			killBattery : _killBattery
		};
	}

	window.batterycrusherjs = new BatteryCrusherJS();

} )( window );