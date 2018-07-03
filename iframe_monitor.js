// Content Script File.

// log injection confirmation.
console.log("cs:js_injected, state: running.");

// if iframe activeElement send background script message.
var monitor = setInterval(function() {
	var actel = document.activeElement;
    if(actel && actel.tagName === 'IFRAME'){
    	chrome.runtime.sendMessage({state: "active"});
	    console.log("cs:iframe_activeElement_detected, sent_message: active_to_bs.");
    }
    console.log(actel);
}, 1000); // setInterval to run ever second.

// stop the interval if receive message from background script.
chrome.runtime.onMessage.addListener( function(mon) {
	if (mon.state === "stop") {
		clearInterval(monitor);
		console.log("cs:cleared_interval, exiting program.");
	}
});
