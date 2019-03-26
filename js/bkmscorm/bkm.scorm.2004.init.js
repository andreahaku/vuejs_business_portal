/** 
 * BKM SCORM 2004 RTE: API ISTANCE INIT
 * 
 * filename: bkm.scorm.2004.constants.js
 * author: Roberto Guidi
 * copy: Bookmark s.r.l. (www.bkm.it)
 * version: 0.0.2
 * modified: 09.11.12
 *
 */

// DEBUG

var DEBUG_API_CALL_ONLY = " DEBUG_API_CALL_ONLY ";
	
// ERROR COLLECTION
var _errorDefObj = new Object();

function addToErrorDef(iCode,iDesc){
	_errorDefObj[iCode] = iDesc;
}
function getErrorDefString(iCode){
	return _errorDefObj[iCode];
}
// Implementation-defined Errors: range 1000 - 65535

var COMM_REQUEST_EXEPTION = 1000;
var COMM_REQUEST_EXEPTION_STRING = "Non è possibile comunicare con il server LMS";
addToErrorDef(COMM_REQUEST_EXEPTION,COMM_REQUEST_EXEPTION_STRING);

var LMS_GET_ERROR_EXCEPTION = 1100;
var LMS_GET_ERROR_EXCEPTION_STRING = "Errore nella richiesta LMS.GetLastError";
addToErrorDef(LMS_GET_ERROR_EXCEPTION,LMS_GET_ERROR_EXCEPTION_STRING);

/** 
 * SCORM 2004 ERRORS COSTANTS
 * IEEE 1484.11.2-2003 Standard for Learning Technology - 
 * ECMAScript Application Programming Interface for Content to 
 * Runtime Services Communication
 */
 
var UNDEF_DATA_MODEL_ELEMENT = 401; 
var UNDEF_DATA_MODEL_ELEMENT_STRING = "Elemento del modello di dati sconosciuto"; 
addToErrorDef(UNDEF_DATA_MODEL_ELEMENT,UNDEF_DATA_MODEL_ELEMENT_STRING);

var UNIMPLEMENTED_DATA_MODEL_ELEMENT = 402; 
var UNIMPLEMENTED_DATA_MODEL_ELEMENT_STRING = "L'elemento del modello di dati non è implementato dal server LMS"; 
addToErrorDef(UNIMPLEMENTED_DATA_MODEL_ELEMENT,UNIMPLEMENTED_DATA_MODEL_ELEMENT_STRING);

var DATA_MODEL_VALUE_NOT_INITIALIZED = 403; 
var DATA_MODEL_VALUE_NOT_INITIALIZED_STRING = "E' stato richiesto un valore non inizializzato"; 
addToErrorDef(DATA_MODEL_VALUE_NOT_INITIALIZED,DATA_MODEL_VALUE_NOT_INITIALIZED_STRING);

var DATA_MODEL_VALUE_IS_READONLY = 404; 
var DATA_MODEL_VALUE_IS_READONLY_STRING = "Il valore non può essere modificato dallo SCO: l'operazione è riservata al server LMS"; 
addToErrorDef(DATA_MODEL_VALUE_IS_WRITEONLY,DATA_MODEL_VALUE_IS_WRITEONLY_STRING);

var DATA_MODEL_VALUE_IS_WRITEONLY = 405; 
var DATA_MODEL_VALUE_IS_WRITEONLY_STRING = "Il valore non può essere letto: l'operazione è riservata al server LMS"; 
addToErrorDef(DATA_MODEL_VALUE_IS_WRITEONLY,DATA_MODEL_VALUE_IS_WRITEONLY_STRING);

// TODO: implement more data error codes (Type Mismatch (406), Value Out Of Range (407), Data Model Dependency Not Established (408) )


   /**
    * The No Error constant.  System constant used to indicate that no errors 
    * were encountered (i.e., a successful API call).<br><br>
    * See <b>IEEE 1484.11.2-2003</b> for more details
    */
var NO_ERROR = 0;
var NO_ERROR_STRING = "Nessun errore";
addToErrorDef(NO_ERROR,NO_ERROR_STRING);
   /**
    * The General Exception constant.  System constant used to indicate that a 
    * general exception for which a more specific error code is not 
    * available has occurred.<br><br>
    * See <b>IEEE 1484.11.2-2003</b> for more details
    */
var GENERAL_EXCEPTION = 101;
var GENERAL_EXCEPTION_STRING = "Errore di tipo generico";
addToErrorDef(GENERAL_EXCEPTION,GENERAL_EXCEPTION_STRING);
   /**
    * The General Initialization Failure constant.  System constant used to 
    * indicate that an attempt to initialize 
    * (i.e., <code>Initialize("")</code>) failed.  No other error information
    * is available.<br><br>
    * See <b>IEEE 1484.11.2-2003</b> for more details
    */
var GENERAL_INIT_FAILURE = 102;
var GENERAL_INIT_FAILURE_STRING = "Errore inatteso e nativo di inizializzazione della sessione";
addToErrorDef(GENERAL_INIT_FAILURE,GENERAL_INIT_FAILURE_STRING);
   /**
    * The Already Initialized constant.  System constant used to indicate that 
    * an attempt was made to re-initialize communication 
    * (i.e., <code>Initialize("")</code>) that had already been 
    * initialized.<br><br>
    * See <b>IEEE 1484.11.2-2003</b> for more details
    */
var ALREADY_INITIALIZED = 103;
var ALREADY_INITIALIZED_STRING = "La sessione è già stata inizializzata";
addToErrorDef(ALREADY_INITIALIZED,ALREADY_INITIALIZED_STRING);
   /**
    * The Content Instance Terminated constant.  System constant 
    * used to indicate that an attempt was made to re-initialize 
    * communication (i.e., <code>Initialize("")</code>) by an instance of a
    * content object with a communication state of <b>"terminated"</b>.<br><br>
    * 
    * See <b>IEEE 1484.11.2-2003</b> for more details
    */
var CONTENT_INSTANCE_TERMINATED = 104;
var CONTENT_INSTANCE_TERMINATED_STRING = "La sessione è già stata terminata";
addToErrorDef(CONTENT_INSTANCE_TERMINATED,CONTENT_INSTANCE_TERMINATED_STRING);
   /**
    * The General Termination Failure constant.  System constant 
    * used to indicate that an attempt to terminate the communication
    * session (i.e., <code>Terminate("")</code>) failed and no other error
    * information is available.<br><br>
    * See <b>IEEE 1484.11.2-2003</b> for more details
    */
var GENERAL_TERMINATION_FAILURE = 111;
var GENERAL_TERMINATION_FAILURE_STRING = "La sessione non può essere terminata";
addToErrorDef(GENERAL_TERMINATION_FAILURE,GENERAL_TERMINATION_FAILURE_STRING);
   /**
    * The Terminate Before Initialization constant.  System constant
    * used to indicate that an attempt was made to terminate 
    * communication (i.e., <code>Terminate("")</code>) prior to
    * initialization (i.e., <code>Initialization("")</code>).<br><br>
    * See <b>IEEE 1484.11.2-2003</b> for more details
    */
var TERMINATE_BEFORE_INIT = 112;
var TERMINATE_BEFORE_INIT_STRING = "La sessione non può essere terminata se non è stata prima inizializzata";
addToErrorDef(TERMINATE_BEFORE_INIT,TERMINATE_BEFORE_INIT_STRING); 
   /**
    * The Terminate After Terminate constant.  System constant
    * used to indicate that an attempt was made to terminate
    * communication (i.e., <code>Terminate("")</code>) that had already
    * been terminated (i.e., <code>Terminate("")</code>).<br><br>
    * See <b>IEEE 1484.11.2-2003</b> for more details
    */
var TERMINATE_AFTER_TERMINATE = 113;
var TERMINATE_AFTER_TERMINATE_STRING = "La sessione è già stata terminata";
addToErrorDef(TERMINATE_AFTER_TERMINATE,TERMINATE_AFTER_TERMINATE_STRING);
   /**
    * The Get Before Initialization constant.  System constant 
    * used to indicate that an attempt was made to retrieve a value for 
    * a data element (i.e., <code>GetValue(parm1)</code>) before communication
    * had been initialized (i.e., <code>Initialize("").</code>)<br><br>
    * See <b>IEEE 1484.11.2-2003</b> for more details
    */
var GET_BEFORE_INIT = 122;
var GET_BEFORE_INIT_STRING = "La richiesta non può essere eseguita perchè la sessione non è stata inizializzata";
addToErrorDef(GET_BEFORE_INIT,GET_BEFORE_INIT_STRING);
   /**
    * The Get After Terminate constant.  System constant 
    * used to indicate that an attempt was made to retrieve a value 
    * for a data element (i.e., <code>GetValue(parm1)</code>) after 
    * communication had been terminated 
    * (i.e., <code>Terminate("").</code>)<br><br>
    * See <b>IEEE 1484.11.2-2003</b> for more details
    */
var GET_AFTER_TERMINATE = 123;
var GET_AFTER_TERMINATE_STRING = "La richiesta GET non può essere eseguita perchè la sessione è già stata terminata";
addToErrorDef(GET_AFTER_TERMINATE,GET_AFTER_TERMINATE_STRING);
   /**
    * The Set Before Initialization constant.  System constant used to indicate 
    * that an attempt was made to store a value for a data element 
    * (i.e., <code>SetValue(parm1,parm2)</code>) before communication
    * had been initialized (i.e., <code>Initialize("").</code>)<br><br>
    * See <b>IEEE 1484.11.2-2003</b> for more details
    */
var SET_BEFORE_INIT = 132;
var SET_BEFORE_INIT_STRING = "La richiesta SET non può essere eseguita perchè la sessione non è stata inizializzata";
addToErrorDef(SET_BEFORE_INIT,SET_BEFORE_INIT_STRING);
   /**
    * The Set After Terminate constant.  System constant used to indicate that 
    * an attempt was made to store a value for a data element 
    * (i.e., <code>SetValue(parm1,parm2)</code>) after communication had been 
    * terminated (i.e., <code>Terminate("")</code>).<br><br>
    * See <b>IEEE 1484.11.2-2003</b> for more details
    */
var SET_AFTER_TERMINATE = 133;
var SET_AFTER_TERMINATE_STRING = "La richiesta SET non può essere eseguita perchè la sessione è già stata terminata";
addToErrorDef(SET_AFTER_TERMINATE,SET_AFTER_TERMINATE_STRING);
   /**
    * The Commit Before Initialization constant.  System constant used to 
    * indicate that an attempt was made to commit (i.e., <code>Commit("")</code>) data 
    * to storage before communication had been initialized 
    * (i.e., <code>Initialize("")</code>).<br><br>
    * See <b>IEEE 1484.11.2-2003</b> for more details
    */
var COMMIT_BEFORE_INIT = 142;
var COMMIT_BEFORE_INIT_STRING = "La richiesta COMMIT non può essere eseguita perchè la sessione non è stata inizializzata";
addToErrorDef(COMMIT_BEFORE_INIT,COMMIT_BEFORE_INIT_STRING);
   /**
    * The Commit After Terminate constant.  System constant used to indicate 
    * that an attempt was made to commit (i.e., <code>Commit("")</code>) data 
    * to storage after communication has been terminated 
    * (i.e., <code>Terminate("")</code>).<br><br>
    * See <b>IEEE 1484.11.2-2003</b> for more details
    */
var COMMIT_AFTER_TERMINATE = 143;
var COMMIT_AFTER_TERMINATE_STRING = "La richiesta COMMIT non può essere eseguita perchè la sessione è già stata terminata";
addToErrorDef(COMMIT_AFTER_TERMINATE,COMMIT_AFTER_TERMINATE_STRING);
   /**
    * The General Argument Error constant.  System constant used to indicate 
    * that an attempt was made to pass an invalid argument.<br><br>
    * See <b>IEEE 1484.11.2-2003</b> for more details
    */
var GENERAL_ARGUMENT_ERROR = 201;
var GENERAL_ARGUMENT_STRING = "Errore nei parametri di chiamata della funzione API effettuata dall'oggetto SCORM";
addToErrorDef(GENERAL_ARGUMENT_ERROR,GENERAL_ARGUMENT_STRING);
   /**
    * The General Commit Failure constant.  System constant used to indicate 
    * that an attempt to commit (i.e., <code>Commit("")</code> data to storage 
    * failed and no other error information is available<br><br>
    * See <b>IEEE 1484.11.2-2003</b> for more details
    */
var GENERAL_COMMIT_FAILURE = 391;
var GENERAL_COMMIT_FAILURE_STRING = "Errore nella richiesta di COMMIT";
addToErrorDef(GENERAL_COMMIT_FAILURE,GENERAL_COMMIT_FAILURE_STRING);