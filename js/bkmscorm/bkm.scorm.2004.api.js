/** 
 * BKM SCORM 2004 RTE: API INSTANCE MAIN
 * 
 * IEEE 1484.11.2-2003 Standard for Learning Technology - 
 * ECMAScript Application Programming Interface for Content to 
 * Runtime Services Communication
 *
 * filename: bkm.scorm.2004.api.js
 * author: Roberto Guidi
 * copy: Bookmark s.r.l. (www.bkm.it)
 * version: 0.0.5
 * modified:
 * 18.12.12 added resume and interective funtions
 * 30.06.16 added commit for interaction 1.2 version
 *
 * LMS server is called on Initialize (sending no form data), on Commit and on Terminate (sending form with relevant data):
 * see sendLmsData() to add other relevant data.
 * No lerner preferences, interaction, objectives, suspend or sequence are implemented:
 * sco start in normal mode without resume (see setDefaultLmsDomElementValues for other defaut behaviors).
 */

/* TODO
- xsd based data model -> validation of dom elements and data types
 
 
*/

// SCORM 2004 API ISTANCE DECLARATION (USED BY SCORM OBJ TO FIND/BIND A LMS API ISTANCE)
var API_1484_11 = this;

// INSTANCE VARS
// dont change _cmiversion!
var _cmiversion = "1.0";
var _terminatedState = false;
var _initializedState = false;
var _terminateCalled = false;
var _scoVer2 = false;
var _currentErrorCode = NO_ERROR;
var _currentErrorString = NO_ERROR_STRING;
var _cacheObj = new Object();
var _lmsDataObj = new Object();
var _lmsWriteOnlyDomElementNamesObj = new Object();
var _lmsReadOnlyDomElementNamesObj = new Object();
var _interactionCount = -1;
var _interactionProperties = "id,type,objective,objectives,timestamp,correct_responses.0.pattern,weighting,learner_response,result,latency,description";


// DATA MODEL CONSTANTS
var DME_WRITE_ONLY = "DME_WRITE_ONLY";
var DME_READ_ONLY = "DME_READ_ONLY";

// DEBUG MASK DECODE
//modified here
//var _debugApiCallsOnly = true;
var _debugApiCallsOnly = false;

if (typeof _debug == "string") _debugApiCallsOnly = (_debug.indexOf(DEBUG_API_CALL_ONLY) != -1);

// SCORM API FUNCTIONS
// all parameters are strings�
// all functions must return string�
// �string rappresentation of dom data type that can be casted by ECMAScript functions


/**
 * Initiates the communication session. 
 * This function must be called by a SCO before any other
 * API calls are made.   It can not be called more than once
 * consecutively unless Terminate is called.
 *
 * @param iParam  ("") - empty characterstring.
 * An empty characterstring shall be passed as a parameter.
 *
 * @return The function can return one of two values.  The return value
 * shall be represented as a characterstring.<br>
 * <ul>
 *    <li><code>true</code> - The characterstring "true" shall be returned 
 *    if communication session initialization, as determined by the LMS, was 
 *    successful.</li>
 *    <li><code>false</code> - The characterstring "false" shall be returned
 *    if communication session initialization, as determined by the LMS, was
 *    unsuccessful.</li>
 * </ul>
 */
function Initialize(iParam) {
    AppendToLog("bkm.scorm.2004.api event log", "");
    AppendToLog("--------------------------------------------------------------------------", "");
    AppendToLog("Initialize", "iParam = " + iParam);
    // Assume failure
    result = "false";
    // check if terminated
    if (_terminatedState) {
        setCurrentErrorCode("CONTENT_INSTANCE_TERMINATED");
        AppendToLog("Initialize", "return = " + result);
        return result;
    }
    _terminatedState = false;
    _terminateCalled = false;
    _scoVer2 = false;
    // check if already initialized
    if (_initializedState) {
        setCurrentErrorCode("ALREADY_INITIALIZED");
    } else {

        if (_debugApiCallsOnly) {
            AppendToLog("Initialize", "_debugApiCallsOnly = " + _debugApiCallsOnly);
            // future: get from lms values of its pertinence like cmi.entry
            // now: use predefined to get wanted behavior
            setDefaultLmsDomElementValues();

            result = "true";

        } else {
            // make sure param is empty string "" - as per the API spec
            setParameterError(iParam);
            // check for parameter error
            if (_currentErrorCode == NO_ERROR) {
                // initialize call to LMS
                result = xmlhttpRequest("initialize", "");
                // check for client error
                if (_currentErrorCode == NO_ERROR) {
                    // check server response
                    if (result == "false") {
                        // get server error and set istance current error
                        setLmsLastError();
                    } else {
                        // use predefined to get wanted behavior
                        setDefaultLmsDomElementValues();
                        // check server response to know if it support new functions (first versions return true)
                        if (result != "true") {
                            // get from lms values of its pertinence like cmi.entry
                            LMSSetDomElementValues(result);
                            // check server response to know if it support resume function
                            if (result.indexOf("cmi.entry=resume") != -1) {

                                var suspenddata = xmlhttpRequest("getsuspenddata", "");
                                AppendToLog("Get Suspend Data ", result);
                                // check for client error or result data empty
                                if (_currentErrorCode == NO_ERROR) {
                                    if (suspenddata != "") {
                                        setCacheValue("cmi.suspend_data", suspenddata);
                                    }

                                    // request suspend location
                                    var location = xmlhttpRequest("getlocation", "");
                                    AppendToLog("Get Location ", location);
                                    // check for client error
                                    if (_currentErrorCode == NO_ERROR) {
                                        if (location != "null") {
                                            setCacheValue("cmi.location", location);
                                        }

                                        if (_currentErrorCode == NO_ERROR && ((suspenddata != null && suspenddata != "") || (location != null && location != ""))) {

                                            result = xmlhttpRequest("getcompletionstatus", "");
                                            AppendToLog("Get Completion Status ", result);
                                            // check for client error
                                            if (_currentErrorCode == NO_ERROR) {
                                                setCacheValue("cmi.completion_status", result);

                                                // request success status
                                                result = xmlhttpRequest("getsuccessstatus", "");
                                                AppendToLog("Get Success Status ", result);
                                                // check for client error
                                                if (_currentErrorCode == NO_ERROR) {
                                                    if (result != "null") {
                                                        setCacheValue("cmi.success_status", result);
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            // ignore resume errors
                            result = "true";
                        }
                    }
                } else {
                    result = "false";
                }
            }
        }
    }
    if (result == "true") {
        _initializedState = true;
        keepAliveStart();
    }
    AppendToLog("Initialize", "return = " + result);
    return result;
}
/**
 * The function requests information from an LMS.  It permits the SCO to
 * request information from the LMS to determine among other things:
 * <ul>
 *    <li>Values for data model elements supported by the LMS.</li>
 *    <li>Version of the data model supported by the LMS.</li>
 *    <li>Whether or not specific data model elements are supported.</li>
 * </ul>
 * Retrieves the current value of the specified data model element
 * for a SCORM 2004 3rd Edition SCO.  The  values are locally cached except for
 * nav.event_permitted, which requires a call to LMSCMIServlet to get the
 * current value.<br><br>
 *
 * @param iDataModelElement The parameter represents the complete
 * identification of a data model element within a data model.<br><br>
 *
 * @return The method can return one of two values.  If there is not error,
 * the return value shall be represented as a characterstring containing
 * the value associated with the parameter.  If an error occurs, then the
 * API Instance shall set an error code to a value specific to the error and
 * return an empty characterstring ("").
 */
function GetValue(iDomElement) {
    result = "";
    setCurrentErrorCode("NO_ERROR");
    //check for state errors
    if (_terminatedState) setCurrentErrorCode("GET_AFTER_TERMINATE");
    if (!isInitialized()) setCurrentErrorCode("GET_BEFORE_INIT");
    if (iDomElement == "" || typeof iDomElement == "undefined" || iDomElement == null) setCurrentErrorCode("GENERAL_ARGUMENT_ERROR");
    if (isLmsWriteOnlyDomElement(iDomElement)) setCurrentErrorCode("DATA_MODEL_VALUE_IS_WRITEONLY");
    // special elements management
    if (iDomElement == "cmi._version" && _currentErrorCode == NO_ERROR) result = _cmiversion;
    if (iDomElement == "cmi.completion_status" && _currentErrorCode == NO_ERROR) {
        // Indicates whether the learner has completed the SCO.
        // return "completed", "incomplete", "not attempted", "unknown"
        completionThreshold = getCacheValue("cmi.completion_threshold");
        if (completionThreshold != "undefined") {
            progressMeasure = getCacheValue("cmi.progress_measure");
            if (progressMeasure != "undefined") {
                if (progressMeasure >= completionThreshold) {
                    result = "completed";
                } else {
                    result = "incomplete";
                }
            } else {
                result = "unknown";
            }
        }
    }
    if (iDomElement == "cmi.success_status" && _currentErrorCode == NO_ERROR) {
        // Indicates whether the learner has mastered the SCO
        scaledPassingScore = getCacheValue("cmi.scaled_passing_score");
        if (scaledPassingScore != "undefined") {
            scoreScaled = getCacheValue("cmi.score.scaled");
            if (scoreScaled != "undefined") {
                if (scoreScaled >= scaledPassingScore) {
                    result = "passed";
                } else {
                    result = "failed";
                }
            } else {
                result = "unknown";
            }
        }
    }
    // increment the index of the interaction
    if (iDomElement == "cmi.interactions._count" && _currentErrorCode == NO_ERROR) {
        _interactionCount++;
        result = "" + _interactionCount;
    }
    // if value is not set and no error
    if (result == "" && _currentErrorCode == NO_ERROR) {
        //retrieve data from cache
        if (iDomElement.indexOf("cmi.") == 0) {
            cacheVal = getCacheValue(iDomElement);
            if (cacheVal != null && cacheVal != "undefined") {
                result = cacheVal;
            } else {
                setCurrentErrorCode("DATA_MODEL_VALUE_NOT_INITIALIZED");
            }
        } else {
            setCurrentErrorCode("UNDEF_DATA_MODEL_ELEMENT");
        }
    }
    AppendToLog("GetValue", "iDomElement = " + iDomElement + ", return = " + result);
    return result;
}
/**
 * Request the transfer to the LMS of the value of
 * iValue for the data element specified as iDataModelElement.  This method
 * allows the SCO to send information to the LMS for storage.
 * Used by SCORM 2004 3rd Edition SCOs.  The values are locally cached
 * until <code>Commit()</code> or <code>Terminate()</code> is called.
 *
 * @param iDataModelElement - The complete identification of a data model
 *        element within a data model to be set.
 * @param iValue  - The intended value of the CMI or Navigation
 *        datamodel element.  The value shall be a characterstring that shall
 *        be convertible to the data type defined for the data model element
 *        identified in iDataModelElement.<br><br>
 *
 * @return The method can return one of two values.  The return value shall
 *         be represented as a characterstring.
 * <ul>
 *    <li><code>true</code> - The characterstring "true" shall be returned 
 *    if the LMS accepts the content of iValue to set the value of 
 *    iDataModelElement.</li>
 *    <li><code>false</code> - The characterstring "false" shall be returned 
 *    if the LMS encounters an error in setting the contents of 
 *    iDataModelElement with the value of iValue.</li>
 * </ul>
 */
function SetValue(iDomElement, iValue) {
    result = "false";
    setCurrentErrorCode("NO_ERROR");
    //check for state errors
    if (_terminatedState) setCurrentErrorCode("SET_AFTER_TERMINATE");
    if (!isInitialized()) setCurrentErrorCode("SET_BEFORE_INIT");
    if (iDomElement == "" || typeof iDomElement == "undefined" || iDomElement == null) setCurrentErrorCode("GENERAL_ARGUMENT_ERROR");
    if (isLmsReadOnlyDomElement(iDomElement)) setCurrentErrorCode("DATA_MODEL_VALUE_IS_READONLY");
    if (_currentErrorCode == NO_ERROR) {

        setCacheValue(iDomElement, iValue);
        result = "true";
    }
    AppendToLog("SetValue", "iDomElement = " + iDomElement + " = " + iValue + ", return = " + result);
    return result;
}
/**
 * Requests forwarding to the persistent data store any data
 * from the SCO that may have been cached by the API Implementation since
 * the last call to <code>Initialize()</code> or <code>Commit()</code>, 
 * whichever occurred most recently.  Used by SCORM 2004 3rd Edition SCOs.
 *
 * @param iParam ("") - empty characterstring.  An empty characterstring
 * shall be passed as a parameter.<br><br>
 *
 * @return The method can return one of two values.  The return value shall
 *         be represented as a characterstring.
 * <ul>
 *    <li><code>true</code> - The characterstring "true" shall be returned 
 *    if the data was successfully persisted to a long-term data store.</li>
 *    <li><code>false</code> - The characterstring "false" shall be returned 
 *    if the data was unsuccessfully persisted to a long-term data 
 *    store.</li>
 * </ul>
 * 
 * The API Instance shall set the error code to a value specific to
 * the error encountered.
 */
function Commit(iParam) {
    AppendToLog("Commit", "iParam = " + iParam);
    // Assume failure
    result = "false";
    setCurrentErrorCode("NO_ERROR");
    if (_terminatedState) setCurrentErrorCode("COMMIT_AFTER_TERMINATE");
    if (!isInitialized()) setCurrentErrorCode("COMMIT_BEFORE_INIT");
    // make sure param is empty string "" - as per the API spec
    setParameterError(iParam);
    if (_currentErrorCode == NO_ERROR) {
        result = sendLmsData(true)
        console.log("RESULT : " + result)
    }
    AppendToLog("Commit", "return = " + result);
    return "true";
}
/**
 * Terminates the communication session.  It is used
 * by a SCORM Version 2004 3rd Edition SCO when the SCO has determined that it no longer
 * needs to communicate with the LMS.  The Terminiate() function also shall
 * cause the persistence of any data (i.e., an implicit Commit("") call) set
 * by the SCO since the last successful call to Initialize("") or Commit(""),
 * whichever occurred most recently.  This guarantees to the SCO that all
 * data set by the SCO has been persisted by the LMS.
 * If the SCO has set a nav.event, the navigation event is communicated
 * to the Web browser through LiveConnect.
 *
 * @param iParam ("") - empty characterstring.  An empty characterstring
 * shall be passed as a parameter.
 *
 * @return The method can return one of two values.  The return value shall
 * be represented as a characterstring.
 * <ul>
 *    <li><code>true</code> - The characterstring "true" shall be returned 
 *    if termination of the communication session, as determined by the 
 *    LMS, was successful.</li>
 *    <li><code>false</code> - The characterstring "false" shall be returned 
 *    if termination of the communication session, as determined by the LMS,
 *    was unsuccessful.
 * </ul>
 */
function Terminate(iParam) {
    AppendToLog("Terminate", "iParam = " + iParam);
    _terminateCalled = true;
    // Assume failure
    result = "false";
    setCurrentErrorCode("NO_ERROR");
    if (_terminatedState) setCurrentErrorCode("TERMINATE_AFTER_TERMINATE");
    if (!isInitialized()) setCurrentErrorCode("TERMINATE_BEFORE_INIT");
    // make sure param is empty string "" - as per the API spec
    setParameterError(iParam);
    if (_currentErrorCode == NO_ERROR) {
        // implicit Commit
        result = sendLmsData(true);
        sendCommand("finish");
        // state reset: called before send data 'cose no more call is done by sco after terminate
        _terminatedState = true;
        _initializedState = false;
        keepAliveStop();
        result = "true";
    }
    AppendToLog("Terminate", "return = " + result);
    //MODIFIED HERE
    _terminatedState = false;
    //
    return result;
}

function GetLastError() {
    AppendToLog("GetLastError", "return = " + _currentErrorCode);
    setCurrentErrorCode("NO_ERROR");
    return (_currentErrorCode + "");
}

function GetErrorString(iErrCode) {
    // must return a max 255 char len string
    AppendToLog("GetErrorString", "iErrCode = " + iErrCode);
    result = "";
    setCurrentErrorCode("NO_ERROR");
    if (iErrCode == "" || iErrCode == null || typeof iErrCode == "undefined") {
        setCurrentErrorCode("GEN_ARGUMENT_ERROR");
        AppendToLog("GetErrorString", "return = " + result);
        return result;
    }
    if (typeof getErrorDefString(iErrCode) != "undefined") {
        result = getErrorDefString(iErrCode).substr(0, 255);
        // dont rise error if iErrCode is not into error collection
    }
    AppendToLog("GetErrorString", "return = " + result);
    return result;
}

function GetDiagnostic(iDiagnosticFeatures) {
    // must return a max 255 char len string
    // if iDiagnosticFeatures is unknow must return ""
    // not implemented (can be list values of instance vars, lms info ecc.)
    AppendToLog("GetDiagnostic", "iDiagnosticFeatures = " + iDiagnosticFeatures);
    AppendToLog("GetDiagnostic", "return = ");
    setCurrentErrorCode("NO_ERROR");
    return "";
}

// API INSTACE FUNCTIONS
function isInitialized() {
    if ((!_initializedState) && (_scoVer2)) {
        setCurrentErrorCode("GEN_GET_FAILURE");
    }
    return _initializedState;
}

function LMSSetDomElementValues(lmsResponse) {
    //cmiId=value;cmi.student_data.mastery_score=20;cmi.entry=ab_initio|resume
    var cmiIdArray = lmsResponse.split(";");
    for (var i = 0; i < cmiIdArray.length; i++) {
        var cmiArray = cmiIdArray[i].split("=");
        setCacheValue(cmiArray[0], cmiArray[1]);
        AppendToLog("LMSSetValue", cmiArray[0] + " = " + cmiArray[1]);
    }
}

function setDefaultLmsDomElementValues() {
    // set predefined values for dom elements to achieve wanted behavior
    // see Table 4.2a: SCORM Run-Time Environment Data Model Elements Summary
    setCacheValue("cmi.learner_id", _learnerId, DME_READ_ONLY);
    setCacheValue("cmi.learner_name", _learnerName, DME_READ_ONLY);
    // cmi.comments_from_learner: set by sco only
    addLmsWriteOnlyDomElementName("cmi.comments_from_learner");
    // cmi.comments_from_lms: get fron lms (not implemented but interesting)
    setCacheValue("cmi.comments_from_lms", "", DME_READ_ONLY);
    // cmi.credit: "credit" (default), "no-credit", if cmi.mode is "browse" or "review" must be "no-credit"
    setCacheValue("cmi.credit", "credit", DME_READ_ONLY);
    // cmi.completion_status: calculated in GetData using cmi.completion_threshold and cmi.progress_measure
    // cmi.completion_threshold: from 0 to 1 (set by sco only for now)
    // see also cmi.progress_measure
    // cmi.entry: "resume", "ab-initio", "" (review after completition or unspecified)
    setCacheValue("cmi.entry", "ab-initio", DME_READ_ONLY);
    // cmi.exit: Indicates how or why the learner left the SCO, set by sco only
    addLmsWriteOnlyDomElementName("cmi.exit");
    // cmi.interactions._children: user activity info
    setCacheValue("cmi.interactions._children", _interactionProperties, DME_READ_ONLY);
    // cmi.interactions._count: see get value
    setCacheValue("cmi.interactions._count", "0", DME_READ_ONLY);
    // cmi.launch_data: special data needed to launch sco
    setCacheValue("cmi.launch_data", "", DME_READ_ONLY);
    // cmi.learner_preference._children: 
    // a comma-separated list of all of the data model elements in the Learner Preference parent data model element
    // required list is "audio_level,language,delivery_speed,audio_captioning"
    setCacheValue("cmi.learner_preference._children", "audio_level,language,delivery_speed,audio_captioning", DME_READ_ONLY);
    // cmi.learner_preference.audio_level: > 0, read/write
    setCacheValue("cmi.learner_preference.audio_level", "3");
    // cmi.learner_preference.language: if = "" sco decide, read/write
    setCacheValue("cmi.learner_preference.language", "");
    // cmi.learner_preference.delivery_speed: > 0, 1 default
    setCacheValue("cmi.learner_preference.delivery_speed", "1", DME_READ_ONLY);
    // cmi.learner_preference.audio_captioning: -1 (off), 0 (no change), 1 (on), read/write
    setCacheValue("cmi.learner_preference.audio_captioning", "0");
    // cmi.location: bookmark for resume last session progress, read/write
    setCacheValue("cmi.location", "");
    // cmi.max_time_allowed: timeinterval (second,10,2) - a time interval with resolution to 0.01 seconds
    setCacheValue("cmi.max_time_allowed", "1000000000", DME_READ_ONLY);
    //cmi.mode: �browse�: The SCO is presented without the intent of recording any information about the current learner session
    //			�normal�: The SCO is presented with the intent of recording information about the current learner session [1]. This is the default value if no mechanism is in place to identify the mode
    //			�review�: The SCO has previously recorded information about the learner attempt and is presented without the intent of updating this information with data from the current learner session [1].
    // affected by cmi.credit
    setCacheValue("cmi.mode", "normal", DME_READ_ONLY);
    // cmi.objectives._children:
    // a comma-separated list of all of the data model elements in the cmi.objectives parent data model element
    setCacheValue("cmi.objectives._children", "id,score,success_status,completion_status,progress_measure,description", DME_READ_ONLY);
    // cmi.objectives._count: number of objective, inimplemented 
    setCacheValue("cmi.objectives._count", "0", DME_READ_ONLY);
    // cmi.progress_measure: read/write, set by sco only for now
    // setCacheValue("cmi.progress_measure","0");
    // cmi.scaled_passing_score: from -1 to 1
    setCacheValue("cmi.scaled_passing_score", "0", DME_READ_ONLY);
    // cmi.session_time: lms read only
    addLmsWriteOnlyDomElementName("cmi.session_time");
    // cmi.success_status: read/write
    setCacheValue("cmi.success_status", "unknown");
    // cmi.suspend_data: used id entry is resume and exit is suspend, inited by lms, read/write
    setCacheValue("cmi.suspend_data", "");
    // cmi.time_limit_action: read only
    // values "exit,message", "continue,message", "exit,no message", "continue,no message"
    setCacheValue("cmi.time_limit_action", "continue,no message", DME_READ_ONLY);
    // cmi.total_time:
    setCacheValue("cmi.total_time", "0", DME_READ_ONLY);

    //ADDING
    setCacheValue("cmi.interactions", "");
}

function sendLmsData(scorm2004) {
    AppendToLog("sendLmsData", "Param = scorm2004 = " + ((scorm2004) ? scorm2004 : "false"));
    // assuming failure
    result = "false";
    var interactions = "";

    // add only relevant data
    setLmsValue("cmi.suspend_data");
    if (scorm2004) {
        setLmsValue("cmi.completion_status"); //completed, incomplete, unknow
        setLmsValue("cmi.success_status"); //passed, failed
        setLmsValue("cmi.score.raw");
        setLmsValue("cmi.score.max");
        setLmsValue("cmi.score.min");
        setLmsValue("cmi.score.scaled");
        setLmsValue("cmi.session_time");
        setLmsValue("cmi.location");

        var ipNames = _interactionProperties.split(",");
        for (var ii = 0; ii <= _interactionCount; ii++) {
            for (var iip = 0; iip < ipNames.length; iip++) {
                var iipName = "cmi.interactions." + ii + "." + ipNames[iip];
                var iipVal = getCacheValue(iipName);
                //if(typeof iipVal != "undefined")setLmsValue( iipName, iipVal );
                // TODO: verifica backoffice, era "Undefined" quindi creava sempre la propriet�

                if (typeof iipVal != "undefined") {
                    interactions += iipName + '=' + iipVal;

                    if (iip == ipNames.length - 1) {
                        interactions += '$%$';
                    } else {
                        interactions += '$&$';
                    }
                } else if (iip == ipNames.length - 1) {
                    var str = interactions.substr(interactions.length - 3);
                    if (str === "$&$") {
                        interactions = interactions.substring(0, interactions.length - 3);
                        interactions += '$%$';
                    }

                }
            }
            /*
                        if(ii == _interactionCount){
                            if(interactions!=""){
                                interactions = interactions.substring(0,interactions.length-3);
                            }
                        }*/
        }
        if (interactions != "") {
            interactions = Base64.encode(interactions);
            setLmsValue("cmi.interactions", interactions);
        }

    } else {
        var status = getCacheValue("cmi.core.lesson_status");
        if (status == "completed" || status == "passed" || status == "failed") {
            setLmsValue("cmi.completion_status", "completed");
        } else if (status == "incomplete") {
            setLmsValue("cmi.completion_status", status);
        } else { //browsed, not attempted
            setLmsValue("cmi.completion_status", "unknow");
        }
        if (status == "passed" || status == "failed") {
            setLmsValue("cmi.success_status", status);
        } else {
            setLmsValue("cmi.success_status", "unknow");
        }
        setLmsValue("cmi.score.raw", getCacheValue("cmi.core.score.raw"));
        setLmsValue("cmi.score.max", getCacheValue("cmi.core.score.max"));
        setLmsValue("cmi.score.min", getCacheValue("cmi.core.score.min"));
        setLmsValue("cmi.session_time", getCacheValue("cmi.core.session_time")); //0000:00:00.0
        setLmsValue("cmi.location", getCacheValue("cmi.core.lesson_location"));
        var ipNames = _interactionProperties_1_2.split(",");
        for (var ii = 0; ii <= _interactionCount; ii++) {
            for (var iip = 0; iip < ipNames.length; iip++) {
                // map 1.2 properties to 2004 properties
                // objective and description does't exists in 1.2
                var iipBaseName = "cmi.interactions." + ii + ".";
                var pName = ipNames[iip];
                if (ipNames[iip] == "time") pName = "timestamp";
                if (ipNames[iip] == "student_response") pName = "learner_response";
                if (ipNames[iip] == "text") pName = "description";
                var iipVal = getCacheValue(iipBaseName + ipNames[iip]);
                //if(typeof iipVal != "undefined")setLmsValue( iipBaseName + pName, iipVal ); // TODO: verifica backoffice, era "Undefined" quindi creava sempre la propriet�

                if (typeof iipVal != "undefined") {
                    interactions += iipBaseName + '' + pName + '=' + iipVal;

                    if (iip == ipNames.length - 1) {
                        interactions += '$%$';
                    } else {
                        interactions += '$&$';
                    }
                } else if (iip == ipNames.length - 1) {
                    var str = interactions.substr(interactions.length - 3);

                    if (str === "$&$") {
                        interactions = interactions.substring(0, interactions.length - 3);
                        interactions += '$%$';
                    }

                }
            }
            if (ii == _interactionCount) {
                if (interactions != "") {
                    interactions = interactions.substring(0, interactions.length - 3);
                }
            }
        }
        _interactionCount = 0;
        if (interactions != "") {
            interactions = Base64.encode(interactions);
            setLmsValue("cmi.interactions", interactions);
        }
    }
    if (_debugApiCallsOnly) {
        return "true";
    }


    // *********************** ABILITARE LA SEGUENTE RIGA PER LA TRACCIATURA LATO SERVER DEL LOG ***************************
    //if(_log)setLmsValue( "log",_logContentObj.innerHTML);
    // *********************************************************************************************************************


    // pass _cacheObj to xmlhttpRequest
    result = xmlhttpRequest("commit", _lmsDataObj); //
    // check for client error
    if (_currentErrorCode == NO_ERROR) {
        // check server response
        if (result != "true") {
            // get server error and set istance current error
            setLmsLastError();
            result = false;
        }
    }
    return result;
}

// DATA STRUCTURE FUNCTIONS
function setLmsValue(iDomElement, iVal) {

    if (iVal != null) {
        _lmsDataObj[iDomElement] = iVal;
        AppendToLog("setLmsValue", "iDomElement = " + iDomElement + ", iValue = " + iVal);
    } else {

        _lmsDataObj[iDomElement] = getCacheValue(iDomElement);
        AppendToLog("setLmsValue", "iDomElement = " + iDomElement + ", iValue = " + getCacheValue(iDomElement));
    }
}

function setCacheValue(iDomElement, iValue, iRw) {
    _cacheObj[iDomElement] = iValue;
    if (iRw == DME_WRITE_ONLY) addLmsWriteOnlyDomElementName(iDomElement);
    if (iRw == DME_READ_ONLY) addLmsReadOnlyDomElementName(iDomElement);
}

function getCacheValue(iDomElement) {
    return _cacheObj[iDomElement];
}

function addLmsWriteOnlyDomElementName(iDomElement) {
    _lmsWriteOnlyDomElementNamesObj[iDomElement] = "";
}

function addLmsReadOnlyDomElementName(iDomElement) {
    _lmsReadOnlyDomElementNamesObj[iDomElement] = "";
}

function isLmsWriteOnlyDomElement(iDomElement) {
    if (_lmsWriteOnlyDomElementNamesObj[iDomElement] == "") {
        return true;
    } else {
        return false;
    }
}

function isLmsReadOnlyDomElement(iDomElement) {
    if (_lmsReadOnlyDomElementNamesObj[iDomElement] == "") {
        return true;
    } else {
        return false;
    }
}
// ERROR HANDLERS
function setParameterError(iParam) {
    // Make sure param is empty string "" - as per the API spec
    if (iParam != "") {
        setCurrentErrorCode("GEN_ARGUMENT_ERROR");
    }
}

function setLmsLastError() {
    result = xmlhttpRequest("getLastError", "");
    if (result != null && typeof result != "undefined") {
        if (result.indexOf("[#]") != -1) {
            setCurrentErrorCode(result.split("[#]")[0], result.split("[#]")[1]);
        } else {
            setCurrentErrorCode("LMS_GET_ERROR_EXCEPTION", result);
        }
    }
}

function setCurrentErrorCode(iErrCodeName, iNativeErrString) {
    _currentErrorCode = eval(iErrCodeName);
    if (_currentErrorCode == NO_ERROR) {
        _currentErrorString = NO_ERROR_STRING;
        return;
    }
    if (typeof iNativeErrString != "undefined") {
        _currentErrorString = iNativeErrString;
    } else {
        _currentErrorString = eval(iErrCodeName + "_STRING");
        if (typeof _currentErrorString == "undefined") _currentErrorString == "";
    }
    condition = (typeof getErrorDefString(_currentErrorCode) == "undefined" && typeof iNativeErrString != "undefined");
    //AppendToLog("","add error def = "+condition);
    if (condition) {
        _errorDefObj[_currentErrorCode] = iNativeErrString;
    }
    AppendToLog("setCurrentErrorCode", "scorm code = " + _currentErrorCode + ", desc = " + _currentErrorString);
    //AppendToLog("","getErrorDefString = "+getErrorDefString(_currentErrorCode));
}
