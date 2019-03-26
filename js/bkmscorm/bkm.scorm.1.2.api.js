/** 
 * BKM SCORM 1.2 RTE: API INSTANCE MAIN
 * 
 * IEEE ??? Standard for Learning Technology - 
 * ECMAScript Application Programming Interface for Content to 
 * Runtime Services Communication
 *
 * filename: bkm.scorm.1.2.api.js
 * author: Roberto Guidi
 * copy: Bookmark s.r.l. (www.bkm.it)
 * version: 0.0.3
 * modified: 30/06/16   suspend and insteraction implementation
 *
 *
 * LMS server is called on Initialize (sending no form data) and on Commit (sending form with relevant data):
 * see sendLmsData() to add other relevant data.
 * No lerner preferences, objectives or sequence are implemented:
 * sco start in normal mode (see LMSSetDefaultDomElementValues for other defaut behaviors).
 */

/* TODO
- xsd based data model -> validation of dom elements and data types
*/

// SCORM 1.2 API ISTANCE DECLARATION (USED BY SCORM OBJ TO FIND/BIND A LMS API ISTANCE)
var API = this;

// managed interaction properties that will send to server using corresponding names of 2004 version (see sendLmsData for mapping); text property is not standard but used by some sco makers
var _interactionProperties_1_2 = "id,objectives,time,type,correct_responses.0.pattern,weighting,student_response,result,latency,text";

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
function LMSInitialize(iParam) {
    AppendToLog("bkm.scorm.1.2.api event log", "");
    AppendToLog("--------------------------------------------------------------------------", "");
    AppendToLog("LMSInitialize", "Param = " + iParam);
    // Assume failure
    result = "false";

    if (_terminatedState) {
        setCurrentErrorCode("CONTENT_INSTANCE_TERMINATED");
        AppendToLog("LMSInitialize", "return = " + result);
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
            AppendToLog("LMSInitialize", "_debugApiCallsOnly = " + _debugApiCallsOnly);
            // future: get from lms values of its pertinence like cmi.entry
            // now: use predefined to get wanted behavior
            LMSSetDefaultDomElementValues();

            //SC-CRIF PROVA
            /* result="2E1e607080b0i0p0x0IH1001016z01011012110111101212011140181401016t0n5iZrVJXOXSt.6fAxlq3gGsk1^1^00000000000000";
            setCacheValue("cmi.suspend_data", result); */
            //

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
                        // now: use predefined to get wanted behavior
                        LMSSetDefaultDomElementValues();
                        if (result != "true") {
                            LMSSetDomElementValues(result);
                            if (result.indexOf("cmi.core.entry=resume") != -1) {

                                var suspenddata = xmlhttpRequest("getsuspenddata", "");
                                AppendToLog("Get Suspend Data ", suspenddata);
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
                                            setCacheValue("cmi.core.lesson_location", location);
                                        }

                                        if (_currentErrorCode == NO_ERROR && ((suspenddata != null && suspenddata != "") || (location != null && location != ""))) {

                                            result = xmlhttpRequest("getcompletionstatus", "");
                                            AppendToLog("Get Completion Status ", result);
                                            // check for client error
                                            if (_currentErrorCode == NO_ERROR) {
                                                setCacheValue("cmi.completion_status", result);
                                                var compStatusTmp = result;
                                                // request success status
                                                result = xmlhttpRequest("getsuccessstatus", "");
                                                AppendToLog("Get Success Status ", result);
                                                // check for client error
                                                if (_currentErrorCode == NO_ERROR) {
                                                    if (result != "null") {
                                                        setCacheValue("cmi.success_status", result);
                                                        setCacheValue("cmi.core.lesson_status", result);
                                                    } else {
                                                        setCacheValue("cmi.core.lesson_status", compStatusTmp);
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            // ignore resume error
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
    AppendToLog("LMSInitialize", "return = " + result);
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
function LMSGetValue(iDomElement) {
    AppendToLog("LMSGetValue", "Params: iDomElement = " + iDomElement);
    result = "";
    setCurrentErrorCode("NO_ERROR");
    //check for state errors
    if (_terminatedState) setCurrentErrorCode("GET_AFTER_TERMINATE");
    if (!isInitialized() && _currentErrorCode == NO_ERROR) setCurrentErrorCode("GET_BEFORE_INIT");
    if ((iDomElement == "" || typeof iDomElement == "undefined" || iDomElement == null) && _currentErrorCode == NO_ERROR) setCurrentErrorCode("GENERAL_ARGUMENT_ERROR");
    if (isLmsWriteOnlyDomElement(iDomElement) && _currentErrorCode == NO_ERROR) setCurrentErrorCode("DATA_MODEL_VALUE_IS_WRITEONLY");
    // special elements management
    if (iDomElement == "cmi._version") result = _cmiversion;
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
    AppendToLog("LMSGetValue", "iDomElement = " + iDomElement + ", return = " + result);
    return result;
}
/**
 * Request the transfer to the LMS of the value of
 * iValue for the data element specified as iDataModelElement.  This method
 * allows the SCO to send information to the LMS for storage.
 * The values are locally cached
 * until <code>Commit()</code> is called.
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
function LMSSetValue(iDomElement, iValue) {
    AppendToLog("LMSSetValue", "Params: iDomElement = " + iDomElement + ", iValue = " + iValue);
    result = "false";
    setCurrentErrorCode("NO_ERROR");
    //check for state errors
    if (_terminatedState) setCurrentErrorCode("SET_AFTER_TERMINATE");
    if (!isInitialized() && _currentErrorCode == NO_ERROR) setCurrentErrorCode("SET_BEFORE_INIT");
    if ((iDomElement == "" || typeof iDomElement == "undefined" || iDomElement == null) && _currentErrorCode == NO_ERROR) setCurrentErrorCode("GENERAL_ARGUMENT_ERROR");
    if (isLmsReadOnlyDomElement(iDomElement) && _currentErrorCode == NO_ERROR) setCurrentErrorCode("DATA_MODEL_VALUE_IS_READONLY");

    if (iDomElement == "cmi.core.lesson_status" && _currentErrorCode == NO_ERROR) {
        var lmsValue = iValue; //�passed�, �completed�, �failed�, �incomplete�, �browsed�, �not attempted�
        if (lmsValue != "completed" && lmsValue != "incomplete") lmsValue = "unknow";
        setCacheValue("cmi.completion_status", lmsValue);
        lmsValue = iValue;
        if (lmsValue != "passed" && lmsValue != "failed") lmsValue = "unknow";
        setCacheValue("cmi.success_status", lmsValue);
    }

    if (_currentErrorCode == NO_ERROR) {
        setCacheValue(iDomElement, iValue);
        result = "true";
    }
    AppendToLog("LMSSetValue", "iDomElement = " + iDomElement + " = " + iValue + ", return = " + result);
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
function LMSCommit(iParam) {
    AppendToLog("LMSCommit", "Param = " + iParam);
    // Assume failure
    result = "false";
    setCurrentErrorCode("NO_ERROR");
    if (_terminatedState) setCurrentErrorCode("COMMIT_AFTER_TERMINATE");
    if (!isInitialized()) setCurrentErrorCode("COMMIT_BEFORE_INIT");
    // make sure param is empty string "" - as per the API spec
    setParameterError(iParam);
    if (_currentErrorCode == NO_ERROR) {
        result = sendLmsData();
    }
    AppendToLog("LMSCommit", "return = " + result);
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
function LMSFinish(iParam) {
    AppendToLog("LMSFinish", "Param = " + iParam);
    _terminateCalled = true;
    // Assume failure
    result = "false";

    setCurrentErrorCode("NO_ERROR");
    if (_terminatedState) setCurrentErrorCode("TERMINATE_AFTER_TERMINATE");
    if (!isInitialized()) setCurrentErrorCode("TERMINATE_BEFORE_INIT");
    // make sure param is empty string "" - as per the API spec
    setParameterError(iParam);
    if (_currentErrorCode == NO_ERROR) {
        // state reset: called before send data 'cose no more call is done by sco after terminate
        _terminatedState = true;
        _initializedState = false;
        keepAliveStop();
        // explicit Commit
        if (getCacheValue("bkm.force.commitOnFinish") == "true") {
            result = sendLmsData();
        }
        if (!window.parent.parent._logContentObj) sendCommand("finish");
        // ignore errors
        result = "true";
    }
    AppendToLog("LMSFinish", "return = " + result);

    //MODIFIED HERE
    _terminatedState = false;
    //

    return result;
}

function LMSGetLastError() {
    AppendToLog("LMSGetLastError", "return = " + _currentErrorCode);
    setCurrentErrorCode("NO_ERROR");
    return (_currentErrorCode + "");
}

function LMSGetErrorString(iErrCode) {
    // must return a max 255 char len string
    AppendToLog("LMSGetErrorString", "iErrCode = " + iErrCode);
    result = "";
    setCurrentErrorCode("NO_ERROR");
    if (iErrCode == "" || iErrCode == null || typeof iErrCode == "undefined") {
        setCurrentErrorCode("GEN_ARGUMENT_ERROR");
        AppendToLog("LMSGetErrorString", "return = " + result);
        return result;
    }
    if (typeof getErrorDefString(iErrCode) != "undefined") {
        result = getErrorDefString(iErrCode).substr(0, 255);
        // dont rise error if iErrCode is not into error collection
    }
    AppendToLog("LMSGetErrorString", "return = " + result);
    return result;
}

function LMSGetDiagnostic(iDiagnosticFeatures) {
    // must return a max 255 char len string
    // if iDiagnosticFeatures is unknow must return ""
    // not implemented (can be list values of instance vars, lms info ecc.)
    AppendToLog("LMSGetDiagnostic", "iDiagnosticFeatures = " + iDiagnosticFeatures);
    //AppendToLog("LMSGetDiagnostic","return = ");
    setCurrentErrorCode("NO_ERROR");
    return "";
}

function LMSSetDefaultDomElementValues() {
    AppendToLog("LMSSetDefaultDomElementValues", "called");
    // set predefined values for dom elements to achieve wanted behavior
    // see http://scorm.com/scorm-explained/technical-scorm/run-time/run-time-reference/ SCORM 1.2 Data Model Elements Summary

    //cmi.core.student_id (CMIString (SPM: 255), RO) Identifies the student on behalf of whom the SCO was launched
    setCacheValue("cmi.core.student_id", _learnerId, DME_READ_ONLY);
    //cmi.core.student_name (CMIString (SPM: 255), RO) Name provided for the student by the LMS
    setCacheValue("cmi.core.student_name", _learnerName, DME_READ_ONLY);
    //cmi.core._children (student_id, student_name, lesson_location, credit, lesson_status, entry, score, total_time, lesson_mode, exit, session_time, RO) Listing of supported data model elements
    setCacheValue("cmi.core._children", "student_id,student_name,lesson_location,credit,lesson_status,entry,score,lesson_mode,exit,session_time", true);
    //cmi.core.lesson_location (CMIString (SPM: 255), RW) The learner�s current location in the SCO
    setCacheValue("cmi.core.lesson_location", "");
    //cmi.core.credit (�credit�, �no-credit�, RO) Indicates whether the learner will be credited for performance in the SCO
    setCacheValue("cmi.core.credit", "credit", DME_READ_ONLY);
    //cmi.core.lesson_status (�passed�, �completed�, �failed�, �incomplete�, �browsed�, �not attempted�, RW) Indicates whether the learner has completed and satisfied the requirements for the SCO
    setCacheValue("cmi.core.lesson_status", "not attempted");
    //cmi.core.entry (�ab-initio�, �resume�, ��, RO) Asserts whether the learner has previously accessed the SCO
    setCacheValue("cmi.core.entry", "ab-initio", DME_READ_ONLY);
    //cmi.core.score_children (raw,min,max, RO) Listing of supported data model elements
    setCacheValue("cmi.core.score._children", "raw,min,max", DME_READ_ONLY); //
    //cmi.core.score.raw (CMIDecimal, RW) Number that reflects the performance of the learner relative to the range bounded by the values of min and max
    setCacheValue("cmi.core.score.raw", "0");
    //cmi.core.score.max (CMIDecimal, RW) Maximum value in the range for the raw score
    setCacheValue("cmi.core.score.max", "100");
    //cmi.core.score.min (CMIDecimal, RW) Minimum value in the range for the raw score
    setCacheValue("cmi.core.score.min", "0");
    //cmi.core.total_time (CMITimespan, RO) Sum of all of the learner�s session times accumulated in the current learner attempt
    //cmi.core.lesson_mode (�browse�, �normal�, �review�, RO) Identifies one of three possible modes in which the SCO may be presented to the learner
    setCacheValue("cmi.core.lesson_mode", "normal", DME_READ_ONLY);
    //cmi.core.exit (�time-out�, �suspend�, �logout�, ��, WO) Indicates how or why the learner left the SCO
    addLmsWriteOnlyDomElementName("cmi.core.exit");
    //cmi.core.session_time (CMITimespan, WO) Amount of time that the learner has spent in the current learner session for this SCO
    addLmsWriteOnlyDomElementName("cmi.core.session_time");
    //cmi.suspend_data (CMIString (SPM: 4096), RW) Provides space to store and retrieve data between learner sessions
    setCacheValue("cmi.suspend_data", "");
    //cmi.launch_data (CMIString (SPM: 4096), RO) Data provided to a SCO after launch, initialized from the dataFromLMS manifest element
    setCacheValue("cmi.launch_data", "", DME_READ_ONLY);
    //cmi.comments (CMIString (SPM: 4096), RW) Textual input from the learner about the SCO
    setCacheValue("cmi.comments", "");
    //cmi.comments_from_lms (CMIString (SPM: 4096), RO) Comments or annotations associated with a SCO
    setCacheValue("cmi.comments_from_lms", "", DME_READ_ONLY);
    //cmi.objectives._children (id,score,status, RO) Listing of supported data model elements
    setCacheValue("cmi.objectives._children", "id,score,status", DME_READ_ONLY);
    //cmi.objectives._count (non-negative integer, RO) Current number of objectives being stored by the LMS
    setCacheValue("cmi.objectives._count", "0", DME_READ_ONLY);
    //cmi.objectives.n.id (CMIIdentifier, RW) Unique label for the objective
    //cmi.objectives.n.score._children (raw,min,max, RO) Listing of supported data model elements
    //cmi.objectives.n.score.raw (CMIDecimal, RW) Number that reflects the performance of the learner, for the objective, relative to the range bounded by the values of min and max
    //cmi.objectives.n.score.max (CMIDecimal, Rw) Maximum value, for the objective, in the range for the raw score
    //cmi.objectives.n.score.min (CMIDecimal, RW) Minimum value, for the objective, in the range for the raw score
    //cmi.objectives.n.status (�passed�, �completed�, �failed�, �incomplete�, �browsed�, �not attempted�, RW) Indicates whether the learner has completed or satisfied the objective
    //cmi.student_data._children (mastery_score, max_time_allowed, time_limit_action, RO) Listing of supported data model elements
    setCacheValue("cmi.student_data._children", "mastery_score", DME_READ_ONLY);
    //cmi.student_data.mastery_score (CMIDecimal, RO) Passing score required to master the SCO
    setCacheValue("cmi.student_data.mastery_score", "", DME_READ_ONLY);
    //cmi.student_data.max_time_allowed (CMITimespan, RO) Amount of accumulated time the learner is allowed to use a SCO
    //cmi.student_data.time_limit_action (exit,message,� �exit,no message�,� continue,message�, �continue, no message�, RO) Indicates what the SCO should do when max_time_allowed is exceeded
    //cmi.student_preference._children (audio,language,speed,text, RO) Listing of supported data model elements
    setCacheValue("cmi.student_preference._children", "", DME_READ_ONLY);
    //cmi.student_preference.audio (CMISInteger, RW) Specifies an intended change in perceived audio level
    //cmi.student_preference.language (CMIString (SPM: 255), RW) The student�s preferred language for SCOs with multilingual capability
    //cmi.student_preference.speed (CMISInteger, RW) The learner�s preferred relative speed of content delivery
    //cmi.student_preference.text (CMISInteger, RW) Specifies whether captioning text corresponding to audio is displayed
    //cmi.interactions._children (id,objectives,time,type,correct_responses,weighting,student_response,result,latency, RO) Listing of supported data model elements
    setCacheValue("cmi.interactions._children", _interactionProperties_1_2, DME_READ_ONLY);
    //cmi.interactions._count (CMIInteger, RO) Current number of interactions being stored by the LMS
    setCacheValue("cmi.interactions._count", "0", DME_READ_ONLY);
    //cmi.interactions.n.id (CMIIdentifier, WO) Unique label for the interaction
    //cmi.interactions.n.objectives._count (CMIInteger, RO) Current number of objectives (i.e., objective identifiers) being stored by the LMS for this interaction
    //cmi.interactions.n.objectives.n.id (CMIIdentifier, WO) Label for objectives associated with the interaction
    //cmi.interactions.n.time (CMITime, WO) Point in time at which the interaction was first made available to the student for student interaction and response
    //cmi.interactions.n.type (�true-false�, �choice�, �fill-in�, �matching�, �performance�, �sequencing�, �likert�, �numeric�, WO) Which type of interaction is recorded
    //cmi.interactions.n.correct_responses._count (CMIInteger, RO) Current number of correct responses being stored by the LMS for this interaction
    //cmi.interactions.n.correct_responses.n.pattern (format depends on interaction type, WO) One correct response pattern for the interaction
    //cmi.interactions.n.weighting (CMIDecimal, WO) Weight given to the interaction relative to other interactions
    //cmi.interactions.n.student_response (format depends on interaction type, WO) Data generated when a student responds to an interaction
    //cmi.interactions.n.result (�correct�, �wrong�, �unanticipated�, �neutral�, �x.x [CMIDecimal]�, WO) Judgment of the correctness of the learner response
    //cmi.interactions.n.latency (CMITimespan, WO) Time elapsed between the time the interaction was made available to the learner for response and the time of the first response

    // set custom values
    setCacheValue("bkm.force.commitOnFinish", "false", DME_READ_ONLY);

    //ADDING
    setCacheValue("cmi.interactions", "");
}