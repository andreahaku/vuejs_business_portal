/** 
 * BKM SCORFM 2004 RTE: HTTP COMMUNICATION FUNCTIONS
 * 
 * 
 * filename: bkm.scorm.2004.communication.js
 * author: Roberto Guidi
 * copy: Bookmark s.r.l. (www.bkm.it)
 * version: 0.0.2
 * modified: 10.03.09
 *
 */

var xmlhttpRequestObj = null;
var keepAliveStarted = false;
var keepAliveStopped = false;
var keepAliveIntervalMs = null;
var keepAliveIntervalId = null;
var _nativeErrString = "";

function keepAliveStart() {
    AppendToLog("keepAliveStart", "typeof keepAliveStopped = " + typeof keepAliveStopped);
    if (keepAliveStopped) return; //stop before start
    if (typeof _keepAliveURL != "undefined" && typeof _keepAliveInterval != "undefined") {
        //AppendToLog ("keepAliveInit","");
        AppendToLog("", "_keepAliveURL = " + _keepAliveURL);
        AppendToLog("", "_keepAliveInterval = " + _keepAliveInterval);
        if (!isNaN(_keepAliveInterval)) {
            if (Number(_keepAliveInterval) > 0) keepAliveIntervalMs = Number(_keepAliveInterval);
        }
        if (keepAliveIntervalMs != null && _keepAliveURL != "") {
            AppendToLog("", "setInterval");
            keepAliveIntervalId = window.setInterval("keepAlive()", keepAliveIntervalMs);
            keepAliveStarted = true;
        }
    }
}

function keepAlive() {
    AppendToLog("keepAlive", "");
    AppendToLog("", "opening connetion, url = " + _keepAliveURL);
    var strReturn = "";
    var strPostData;
    // init request obj
    xmlhttpRequestInit();
    if (xmlhttpRequestObj == null) return;
    try {
        // Creo il documento XML da inviare al server
        var reqxml = parent.RD3_DesktopManager.MessagePump.CreateXMLDoc("rd3");
        var rootlist = reqxml.getElementsByTagName("rd3");
        var root = rootlist[0];
        root.setAttribute("num", parent.RD3_DesktopManager.MessagePump.RequestNumber);
        parent.RD3_DesktopManager.MessagePump.RequestNumber++;

        strPostData = "session=" + _lmsLearnSessionId + "&command=" + "keepalive"

        var cmd_node;
        cmd_node = reqxml.createElement('cmd');
        cmd_node.setAttribute("oid", "undefinded");
        cmd_node.setAttribute("obn", "SCORM_request&" + strPostData);
        root.appendChild(cmd_node);

        AppendToLog("", "sending XML Data: = " + reqxml);

        xmlhttpRequestObj.open("POST", _lmsURL, false);
        xmlhttpRequestObj.setRequestHeader("Content-Type", "text/xml");
        xmlhttpRequestObj.send(reqxml);

    } catch (e) {
        AppendToLog("", "error = " + e.toString());
    }
}

function keepAliveStop() {
    AppendToLog("keepAliveStop", "keepAliveIntervalId = " + keepAliveIntervalId);
    if (keepAliveStarted && !keepAliveStopped) {
        AppendToLog("keepAliveStop", "stopped");
        window.clearInterval(keepAliveIntervalId);
    } else {
        AppendToLog("keepAliveStop", "not started or alredy stopped");
    }
    keepAliveStopped = true;
}

function xmlhttpRequestInit() {
    if (xmlhttpRequestObj != null) return;
    if (is_ie6) {
        //follow http://msdn.microsoft.com/en-us/library/ms535874(VS.85).aspx# solution not work
        //var xmlhttpRequestObj = new ActiveXObject("MSXML2.XMLHTTP.3.0");
        SetXmlhttpActivXRequestObj(); //defined in bkm.scorm.2004.launcher.html
        if (xmlhttpRequestObj == null) setCurrentErrorCode("GENERAL_INIT_FAILURE", _nativeErrString);
    } else if (is_ie6up || is_nav6up) {
        try {
            AppendToLog("", "creating XMLHttpRequest object");
            xmlhttpRequestObj = new XMLHttpRequest();
        } catch (e) {
            setCurrentErrorCode("GENERAL_INIT_FAILURE", e.toString());
            xmlhttpRequestObj = null;
        }
    } else {
        alert("Il browser utilizzato non � supportato");
    }
}

function SetNativeErrString(iErrString) {
    _nativeErrString = iErrString;
}

function sendCommand(CMD) {
    //MODIFIED
    try {
        parent.RD3_SendCommand(CMD);
    } catch (err) {
        console.log("Error In RD3_SendCommand");
    }
    //
}

function readTextFile(file) {
    var response;
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4) {
            if (rawFile.status === 200 || rawFile.status == 0) {
                response = rawFile.responseText;
            }
        }
    };

    rawFile.send(null);
    return response;
}

var wich = null;
var manifest = null;

function fillJson(strRequestType, manPath, requestData) {
    // se non ho già salvato l'xml o se devo caricarne un diverso

    if (wich != manPath) {
        wich = manPath;

        manifest = readTextFile('../SCORM-modules/' + manPath);
        if (manifest == null) {
            manPath = manPath.split("/");
            manPath.splice(1, 1);
            var place = manPath[0];
            for (var i = 1; i < manPath.length; i++) {
                place += "/";
                place += manPath[i];
            }
            manPath = place;
            manifest = readTextFile('../SCORM-modules/' + manPath);
        }
    }

    var version = manifest.split('<schemaversion>')[1].split('</schemaversion>')[0];

    var man = Base64.encode(manifest);
    var log = Base64.encode(getLog());
    var json;
    var interactions = null;
    var scoremax = null;
    var scoremin = null;
    var scoreraw = null;
    var loc = null;
    var succ = null;
    var susp = null;

    interactions = requestData['cmi.interactions'];
    scoremax = requestData['cmi.score.max'];
    scoremin = requestData['cmi.score.min'];
    scoreraw = requestData['cmi.score.raw'];
    loc = requestData['cmi.location'];
    succ = requestData['cmi.success_status'];
    comp = requestData['cmi.completion_status'];
    susp = requestData['cmi.suspend_data'];
    console.log(requestData)

    if (strRequestType === 'initialize') {

        json = {
            IdTracking: localStorage.getItem("IdTracking"),
            Command: strRequestType,
            IdPartecipazione: localStorage.getItem("IdPartecipazione"),
            XMLimsmanifest: man,
            cmiSuccessStatus: null,
            cmiLocation: null,
            cmiCoreLessonLocation: null,
            cmiSuspendData: null,
            cmiCompletionStatus: null,
            cmiScoreRaw: null,
            cmiScoreMin: null,
            cmiScoreMax: null,
            cmiInteractions: null,
            log: null
        };
    } else if (strRequestType === 'getsuspenddata' ||
        strRequestType === 'getcompletionstatus' ||
        strRequestType === 'getlocation' ||
        strRequestType === 'getsuccessstatus') {

        json = {
            IdTracking: localStorage.getItem("IdTracking"),
            Command: strRequestType,
            IdPartecipazione: localStorage.getItem("IdPartecipazione"),
            XMLimsmanifest: null,
            cmiSuccessStatus: null,
            cmiLocation: null,
            cmiCoreLessonLocation: null,
            cmiSuspendData: null,
            cmiCompletionStatus: null,
            cmiScoreRaw: null,
            cmiScoreMin: null,
            cmiScoreMax: null,
            cmiInteractions: null,
            log: null
        };
    } else {
        // null ! undefined
        if (loc == null) {
            loc = null;
        }
        console.log(comp)
        json = {
            IdTracking: localStorage.getItem("IdTracking"),
            Command: strRequestType,
            IdPartecipazione: localStorage.getItem("IdPartecipazione"),
            XMLimsmanifest: man,
            cmiSuccessStatus: filterUnknown(succ),
            cmiLocation: loc,
            cmiCoreLessonLocation: filterU(getCacheValue("cmi.core.lesson_location")),
            cmiSuspendData: filterU(susp),
            cmiCompletionStatus: filterUnknown(comp),
            cmiScoreRaw: filterU(scoreraw),
            cmiScoreMin: filterU(scoremin),
            cmiScoreMax: filterU(scoremax),
            cmiInteractions: filterU(interactions),
            log: null
        };
    }

    return json;
}

function filterU(field) {
    if (field === undefined) {
        return null;
    }
    return field;
}

function filterUnknown(field) {
    if (field === undefined) {
        return "unknown";
    }
    return field;
}

function xmlhttpRequest(strRequestType, requestData) {

    var strReturn = "";
    var manPath = localStorage.getItem("ManifestPath");

    var json = fillJson(strRequestType, manPath, requestData);

    var url = localStorage.getItem('path') + '/Webapi';
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", url, false);

    xmlhttp.setRequestHeader("X-HTTP-Method-Override", "SCORMRequest");
    xmlhttp.setRequestHeader("token", localStorage.getItem("al_token"));
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.setRequestHeader("Access-Control-Allow-Origin", '*://*/*');


    xmlhttp.send(JSON.stringify(json));

    if (xmlhttp.status === 200) {

        strReturn = xmlhttp.responseText;
        strReturn = JSON.parse(xmlhttp.responseText);

        if (strReturn.Response.Messaggio != null && strReturn.Response.Messaggio != "") {
            console.log(strReturn.Response.Messaggio);
            var as = location.href.split("/");
            if (localStorage.getItem("leaving") != null && localStorage.getItem("leaving") != as[as.length - 2]) {

            } else {
                try {
                    var event = new CustomEvent("notYet", {
                        'detail': {
                            custom_mess: strReturn.Response.Messaggio
                        }
                    });
                    document.dispatchEvent(event);
                } catch (err) {
                    var event = document.createEvent("CustomEvent");
                    event.initCustomEvent("notYet", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);

                    document.dispatchEvent(event);
                }
            }
        } else if (strRequestType == "commit") {
            //var event = new CustomEvent("commit");
            //document.dispatchEvent(event);

        }
        localStorage.removeItem("leaving");
        strReturn = strReturn.Response.Result;


        return unescape(strReturn);
    } else {
        return unescape(false);
    }

    /*
    var strReturn = "";
    var strPostData;
    // init request obj
    xmlhttpRequestInit();
    if(xmlhttpRequestObj == null)return;
    try{
        // Creo il documento XML da inviare al server
        var reqxml = parent.RD3_DesktopManager.MessagePump.CreateXMLDoc("rd3"); 
        var rootlist = reqxml.getElementsByTagName("rd3");
        var root = rootlist[0];
                                    
        root.setAttribute("num",  parent.RD3_DesktopManager.MessagePump.RequestNumber);
        parent.RD3_DesktopManager.MessagePump.RequestNumber++;
        
        strPostData =   "session=" + _lmsLearnSessionId + "&command=" + strRequestType  
        if(typeof requestData == "object"){
            for(iProp in requestData){
                strPostData = strPostData + "&"+iProp+"=" + requestData[iProp];
            }
        }else{
             strPostData = strPostData + "&data=" + requestData;
        }

        var cmd_node;
        cmd_node=reqxml.createElement('cmd');
        cmd_node.setAttribute("oid", "undefinded");
        cmd_node.setAttribute("obn", "SCORM_request&" + strPostData.replace(/%/g,'perc'));
        root.appendChild(cmd_node);
        
        console.log(reqxml);
        xmlhttpRequestObj.open("POST", _lmsURL, false);
        xmlhttpRequestObj.setRequestHeader("Content-Type", "text/xml");
        xmlhttpRequestObj.send(reqxml); 
            
        strReturn = xmlhttpRequestObj.responseText;
        AppendToLog ("","response = " + strReturn);
    }catch (e){
        setCurrentErrorCode("COMM_REQUEST_EXEPTION",e.toString());
    }
    if((typeof strReturn == "undefined" || strReturn == null || strReturn == "undefined") && _currentErrorCode == NO_ERROR)setCurrentErrorCode("COMM_REQUEST_EXEPTION");  */

    return unescape(strReturn);
}

function URLEncode(str) {
    str = new String(str);
    str = escape(str);
    str = str.replace(/\+/g, '%2B');
    str = str.replace(/%20/g, '+');
    str = str.replace(/\*/g, '%2A');
    str = str.replace(/\//g, '%2F');
    str = str.replace(/@/g, '%40');
    return str;
}

var Base64 = (function() {
    "use strict";

    var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

    var _utf8_encode = function(string) {
        var utftext = "",
            c, n;
        string = string.replace(/\r\n/g, "\n");
        for (n = 0; n < string.length; n++) {
            c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
        }
        return utftext;
    };

    var _utf8_decode = function(utftext) {
        var string = "",
            i = 0,
            c = 0,
            c1 = 0,
            c2 = 0;
        while (i < utftext.length) {
            c = utftext.charCodeAt(i);
            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            } else if ((c > 191) && (c < 224)) {
                c1 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c1 & 63));
                i += 2;
            } else {
                c1 = utftext.charCodeAt(i + 1);
                c2 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c1 & 63) << 6) | (c2 & 63));
                i += 3;
            }
        }
        return string;
    };

    var _hexEncode = function(input) {
        var output = '',
            i;
        for (i = 0; i < input.length; i++) {
            output += input.charCodeAt(i).toString(16);
        }
        return output;
    };

    var _hexDecode = function(input) {
        var output = '',
            i;
        if (input.length % 2 > 0) {
            input = '0' + input;
        }
        for (i = 0; i < input.length; i = i + 2) {
            output += String.fromCharCode(parseInt(input.charAt(i) + input.charAt(i + 1), 16));
        }
        return output;
    };

    var encode = function(input) {
        var output = "",
            chr1, chr2, chr3, enc1, enc2, enc3, enc4, i = 0;
        input = _utf8_encode(input);
        while (i < input.length) {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output += _keyStr.charAt(enc1);
            output += _keyStr.charAt(enc2);
            output += _keyStr.charAt(enc3);
            output += _keyStr.charAt(enc4);
        }
        return output;
    };

    var decode = function(input) {
        var output = "",
            chr1, chr2, chr3, enc1, enc2, enc3, enc4, i = 0;
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (i < input.length) {
            enc1 = _keyStr.indexOf(input.charAt(i++));
            enc2 = _keyStr.indexOf(input.charAt(i++));
            enc3 = _keyStr.indexOf(input.charAt(i++));
            enc4 = _keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output += String.fromCharCode(chr1);

            if (enc3 !== 64) {
                output += String.fromCharCode(chr2);
            }
            if (enc4 !== 64) {
                output += String.fromCharCode(chr3);
            }
        }
        return _utf8_decode(output);
    };

    var decodeToHex = function(input) {
        return _hexEncode(decode(input));
    };

    var encodeFromHex = function(input) {
        return encode(_hexDecode(input));
    };

    return {
        'encode': encode,
        'decode': decode,
        'decodeToHex': decodeToHex,
        'encodeFromHex': encodeFromHex
    };
}());