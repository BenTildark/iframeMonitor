// Background Scripts Js.

// create a 'closure' to hold a value we can increment on each browserAction event.
// closures are functions that refer to independent (free) variables,
// in short, variables from the parent function of the closure remain bound from the parent's scope.
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures
var icon_clicks = (function(c) { return function() { c += 1; return c; }}(0)); // first return 1.

// browser icon clicks event handler.
chrome.browserAction.onClicked.addListener( function() {	
	if (icon_clicks() % 2 === 1) { // is odd.
		chrome.tabs.executeScript(null, {file: "iframe_monitor.js"});
		console.log("executing_content_script.");
		chrome.browserAction.setBadgeBackgroundColor({ color: [0,100,0,0] }); // green
		chrome.browserAction.setBadgeText({text: "1"});
	} else {
		// send messages to content script.
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		    chrome.tabs.sendMessage(tabs[0].id, {state: "stop"});
		    console.log("bs:sent_message: stop to:cs.");  
		});
		chrome.browserAction.setBadgeBackgroundColor({ color: [255,0,0,255] }); // red
	 	chrome.browserAction.setBadgeText({text: "0"});
	}
});

// activeElement iframe event handler.
chrome.runtime.onMessage.addListener( function(iframe) {
  	if (iframe.state === "active") {
  		console.log("bs:recieved_message: active from:cs running get_&_close_windows.");
	  	// populate all windows & run callback.
		function getWindows() {
			chrome.windows.getAll({populate : true}, closeWindows);
		}
		// close all windows except our currentWindow.
		function closeWindows(win) {
			var windows = [];
			for (var i_window = 0; i_window < win.length; i_window++) {
				windows.push(win[i_window].id);
			}
			if (windows.length > 1) {
				windows.shift();
				for (var id_i = 0; id_i < windows.length; id_i++) {
					chrome.windows.remove(windows[id_i]);
				}
			}	
		}
		getWindows()
	}
});
