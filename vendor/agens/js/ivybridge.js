IVYBRIDGE = (function () {
	var bridge;
	var storageName;
	var tested = false;
	var bridgeOK = false;
	var localStorageOK = false;
	var bridgeTestTimeout;
	var onReady;
	var onFail;
	function init(_bridge,_storageName,_onReady,_onFail) {
		console.log("IVYBRIDGE initializing...");
		bridge = _bridge;
		storageName = _storageName;
		onReady = _onReady;
		onFail = _onFail;
		bridgeTest();
	}
	function bridgeTest() {
		console.log("bridgeTest()...");
		bridgeTestTimeout = setTimeout(endBridgeTest,2000);
		callBridge("storagePut", "bridgeTest", "1", "IVYBRIDGE.bridgeTestOK","test1","test2","test3");
	}
	function bridgeTestOK(event, params) {
		console.log("bridgeTestOK");
		bridgeOK = true;
		endBridgeTest();
	}
	function endBridgeTest() {
		clearTimeout(bridgeTestTimeout);
		tested = true;
		if (bridgeOK) {
			console.log("IVYBRIDGE initialized! - BRIDGE OK");
			onReady();
		} else {
			if(typeof(Storage)!=="undefined") {
				  console.log("IVYBRIDGE initialized! - NO BRIDGE, USING WEB STORAGE");
				  localStorageOK = true;
				  onReady();
			} else {
				  console.log("IVYBRIDGE failed! - NO BRIDGE, NO WEB STORAGE");
				  onFail();
			 }
		}
		
	}
	

	function callBridge(action, key, value, doneFunctionName, doneFunctionEvent, failFunctionName, failFunctionEvent) {
		value = value || "''";
		doneFunctionName = doneFunctionName || "";
	    doneFunctionEvent = doneFunctionEvent || "";
	    failFunctionName = failFunctionName || "";
	    failFunctionEvent = failFunctionEvent || "";
	    var src = "event://['"+action+"', {'storage':'"+storageName+"', 'key':'"+key+"', 'value': "+value+", 'doneEvent':{'function':'"+doneFunctionName+"','event':'"+doneFunctionEvent+"'}, 'failEvent':{'function':'"+failFunctionName+"','event':'"+failFunctionEvent+"'}}]";
	    console.log("callBridge: "+src);
	    bridge.src = src;
	}
	function Put(key, value, doneFunctionName, doneFunctionEvent, failFunctionName, failFunctionEvent) {
	    doneFunctionName = doneFunctionName || "";
	    doneFunctionEvent = doneFunctionEvent || "";
	    failFunctionName = failFunctionName || "";
	    failFunctionEvent = failFunctionEvent || "";
	    if (bridgeOK) {
	    	if (typeof value === 'string') {
    			value = "'"+value+"'";
			}
	    	callBridge("storagePut", key, value, doneFunctionName, doneFunctionEvent, failFunctionName, failFunctionEvent);
		} else if (localStorageOK) {
			localStorage.setItem(key,value.toString());
			// eval(doneFunctionName+"();");
			window[doneFunctionName](doneFunctionEvent, {});
		} 
	}

	function Get(key, doneFunctionName, doneFunctionEvent, failFunctionName, failFunctionEvent) {
		if (bridgeOK) {
		callBridge("storageGet", key, "", doneFunctionName, doneFunctionEvent, failFunctionName, failFunctionEvent);
		} else if (localStorageOK) {
			if (localStorage.getItem(key)===null) {
				// eval(failFunctionName+"('"+failFunctionEvent+"', {error: {code: 'TBD', description: 'Key does not exist'}});");
				window[failFunctionName](failFunctionEvent, {error: {code: 'TBD', description: 'Key does not exist'}});
			} else {
				// eval(doneFunctionName+"('"+doneFunctionEvent+"', {value: '"+String(localStorage.getItem(key))+"'});");
				window[doneFunctionName](doneFunctionEvent, {value: localStorage.getItem(key)});
			}
		}
	}
	

	function Del(key, doneFunctionName, doneFunctionEvent, failFunctionName, failFunctionEvent) {
		if (bridgeOK) {
			callBridge("storageDel", key, "", doneFunctionName, doneFunctionEvent, failFunctionName, failFunctionEvent);
		} else if (localStorageOK) {
			localStorage.removeItem(key);
		}
	}
	return {
        init:init,
        Put: Put,
        Get: Get,
        Del: Del,
        bridgeTestOK: bridgeTestOK
    };
})();



var bridge;
//window.onload=function(){
    bridge = document.createElement('iframe');
    bridge.style.width = 1+"px";
    bridge.style.height = 1+"px";
    bridge.style.display = "none";
    bridge.style.visibility = "hidden";
    document.body.appendChild(bridge);
    IVYBRIDGE.init(bridge,"ivySudokuTestStorage", bridgeReady, bridgeFailed);
//}
function bridgeReady() {
	console.log("bridgeReady");
	console.log("lastTimeString test...");
	IVYBRIDGE.Get("lastTimeString","lastTimeStringDone","","lastTimeStringFailed","");
}

function lastTimeStringDone(event, params) {
	console.log("Last accessed time is: "+params.value);
	console.log(params);
	saveTimestring();
}
function lastTimeStringFailed(event, params) {
	console.log("lastTimeStringFailed - "+event);
	console.log(params);
	console.log("error.code: "+params.error.code+" error.description: "+params.error.description);
	saveTimestring();
}
function saveTimestring() {
	var d = new Date();
	var timestring = d.getHours()+":"+d.getMinutes()+":"+d.getSeconds()+"."+d.getMilliseconds();
	console.log("Current time is: "+timestring);
	IVYBRIDGE.Put("lastTimeString",timestring,"ok","putLastTimeString","notOk","didNotPutLastTimeString");

}
function ok(event, params) {
	console.log("ok - "+event);
	console.log(params);
}
function notOk(event, params) {
	console.log("notOk - "+event);
	console.log(params);
}
function bridgeFailed() {
	console.log("bridgeFailed");
}