/** 
 * BKM SCORM 2004 RTE: LAUNCHER DOCUMENT FUNCTIONS
 * 
 * filename: bkm.scorm.2004.document.js
 * author: Roberto Guidi
 * copy: Bookmark s.r.l. (www.bkm.it)
 * version: 0.0.4
 * modified: 28.06.16 (added unload sco btn)
 *
 */

// PRIVATE VARS
var _logContentObj = null;

//alert("_log = "+_log);
//alert("_scoURL = "+_scoURL);

// WINDOW SIZE AND POSITION
// ensure that win is always visible but is not yet possible know where the taskbar is

//window.moveTo(screen.width-screen.availwidth,screen.height-screen.availheight); 
//window.resizeTo(screen.availWidth+screen.availWidth-screen.width,screen.availHeight+screen.availHeight-screen.height); 
//alert("screen.width = "+typeof screen.width);
//alert("screen.availWidth = "+typeof screen.availWidth);
// FRAMESET ATTRIBUTES



/*



if(document.title != "" && _title != "" && _title != null && typeof _title != "undefined"){
	 document.title = document.title + " - " + _title;
}else if(_title != "" && _title != null  && typeof _title != "undefined"){
	document.title = _title;
} 
// WRITE DOCUMENT CONTENT
if(typeof _log == "undefined")var _log = false;
if(_log){
	document.write(
	'<frameset cols="40%,55%,5%" frameborder="1" resize>' +
		'<frame id="log_content" name="log_content" src="res/bkm.scorm.2004.log.html" scrolling="auto" onload="initLog()">' +
		'<frame id="scorm_content" name="scorm_content" src="'+_scoURL+'" scrolling="auto">' +
		'<frame id="command_content" name="command_content" src="res/bkm.scorm.2004.command.html" scrolling="no">' +
	'</frameset>'
	);	
}else{
	document.write(
	'<frameset frameborder="0" border="0" framespacing="0">' +
		'<frame id="scorm_content" name="scorm_content" src="'+_scoURL+'" scrolling="auto">' +
	'</frameset>'
	);
}
function unloadSco(){
	scoDocument = window.scorm_content.document;
	scoDocument.location = 'bkm.scorm.2004.empty.html';
}
// LOG INITIALIZATION
function initLog(){
	logDocument = window.log_content.document;
	//alert("Init debug: typeof logDocument = "+ typeof logDocument);
	_logContentObj = logDocument.getElementById("logContent");
	//alert("Init debug: typeof _logContentObj = "+ typeof _logContentObj);
}


*/



// APPEND LOG MESSAGE TO LOG CONTENT
function AppendToLog(source, msg) {

    //if(_logContentObj != null){
    if (true) {
        if (msg != "undefined" && source != "undefined") {
            _logContentObj = _logContentObj + "<br>" + "<b>" + source + "</b> " + msg;
        } else if (msg != "undefined") {
            _logContentObj = _logContentObj + "<br>" + msg;
        }
    }
    if (localStorage.getItem("debugEnabled") == "true") {
        console.log("SOURCE: " + source + " - MSG: " + msg);
    }
    /*
    if(source=== "keepAliveStop" && msg == "not started or alredy stopped"){
        var event = new Event('appendingToLog');
        document.dispatchEvent(event);
    }*/
}

function getLog() {
    return _logContentObj;
}
