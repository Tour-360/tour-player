// /**
//  * @author mrdoob / http://mrdoob.com
//  * @author Mugen87 / https://github.com/Mugen87
//  *
//  * Based on @tojiro's vr-samples-utils.js
//  */

// var WEBVR = {

// 	createButton: function ( renderer, options ) {

// 		if ( options && options.frameOfReferenceType ) {

// 			renderer.vr.setFrameOfReferenceType( options.frameOfReferenceType );

// 		}

// 		function showEnterVR( device ) {

// 			button.style.display = '';
// 			// button.textContent = 'ENTER VR';

// 			button.onclick = function () {

// 				device.isPresenting ? device.exitPresent() : device.requestPresent( [ { source: renderer.domElement } ] );
// 				Tour.renderer.vr.enabled = device.isPresenting;
// 			};

// 			renderer.vr.setDevice( device );

// 		}

// 		function showEnterXR( device ) {

// 			var currentSession = null;

// 			function onSessionStarted( session ) {

// 				session.addEventListener( 'end', onSessionEnded );

// 				renderer.vr.setSession( session );
// 				// button.textContent = 'EXIT VR';

// 				currentSession = session;

// 			}

// 			function onSessionEnded( event ) {

// 				currentSession.removeEventListener( 'end', onSessionEnded );

// 				renderer.vr.setSession( null );
// 				// button.textContent = 'ENTER VR';

// 				currentSession = null;

// 			}

// 			//

// 			button.style.display = '';
// 			// button.textContent = 'ENTER VR';

// 			button.onmouseenter = function () { button.style.opacity = '1.0'; };
// 			button.onmouseleave = function () { button.style.opacity = '0.5'; };

// 			button.onclick = function () {

// 				if ( currentSession === null ) {

// 					device.requestSession( { immersive: true, exclusive: true /* DEPRECATED */ } ).then( onSessionStarted );

// 				} else {

// 					currentSession.end();

// 				}

// 			};

// 			renderer.vr.setDevice( device );

// 		}

// 		function showVRNotFound() {

// 			button.style.display = '';
// 			UI.notification.show('VR NOT FOUND');

// 			button.onclick = null;

// 			renderer.vr.setDevice( null );

// 		}

// 		function stylizeElement( element ) {

// 			// element.style.position = 'absolute';

// 		}

// 		if ( 'xr' in navigator ) {

// 			var button = document.createElement( 'div' );
// 			button.className = 'marker vr';
// 			button.style.display = 'none';

// 			stylizeElement( button );

// 			navigator.xr.requestDevice().then( function ( device ) {

// 				device.supportsSession( { immersive: true, exclusive: true /* DEPRECATED */ } )
// 					.then( function () { showEnterXR( device ); } )
// 					.catch( showVRNotFound );

// 			} ).catch( showVRNotFound );

// 			return button;

// 		} else if ( 'getVRDisplays' in navigator ) {

// 			var button = document.createElement( 'div' );
// 			button.className = 'marker vr'
// 			button.style.display = 'none';

// 			stylizeElement( button );

// 			window.addEventListener( 'vrdisplayconnect', function ( event ) {

// 				showEnterVR( event.display );

// 			}, false );

// 			window.addEventListener( 'vrdisplaydisconnect', function ( event ) {

// 				showVRNotFound();

// 			}, false );

// 			window.addEventListener( 'vrdisplaypresentchange', function ( event ) {

// 				// button.textContent = event.display.isPresenting ? 'EXIT VR' : 'ENTER VR';

// 			}, false );

// 			window.addEventListener( 'vrdisplayactivate', function ( event ) {

// 				event.display.requestPresent( [ { source: renderer.domElement } ] );

// 			}, false );

// 			navigator.getVRDisplays()
// 				.then( function ( displays ) {

// 					if ( displays.length > 0 ) {

// 						showEnterVR( displays[ 0 ] );

// 					} else {

// 						showVRNotFound();

// 					}

// 				} ).catch( showVRNotFound );

// 			return button;

// 		} else {

// 			// UI.notification.show('WEBVR NOT SUPPORTED');

// 		}

// 	}


// };
