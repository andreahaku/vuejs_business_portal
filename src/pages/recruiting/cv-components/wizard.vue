<template>
    <div class="container-fluid">
       
       <div v-if="saving" class='uil-rolling-css' style='transform:scale(0.71); 
        position: absolute; margin: 0 auto; top: 100px; right: 0px; left: 0px;'><div><div></div><div></div></div></div>
        
        <div v-else>
           <alert :show="showAlert" :mess="message" :missings="missingPassed" @done="choiceMade"></alert>
       
           <div class="page-section" style="padding-bottom: 20px;">
               <div class="media v-middle">
                    <div class="media-body">
                        <div class="media-left">
                            <h1 class="text-display-1 margin-none">Compila il tuo curriculum</h1>
                            <p class="text-subhead">Nessun esistente curriculum è stato rilevato</p>
                        </div>
                    </div>
                </div>
           </div>

           <div class="panel panel-default paper-shadow"  style="margin-left: 10px;" data-z="0.5">  

             <ul class="nav nav-pills">

                <li :class="{'active': aXsActive, 'hidden-xs': !aXsActive}"><a data-toggle="pill" href="#anagrafica" @click="retPill('anagrafica')" 
                  :class="{'invalid': aValid === 0}">ANAGRAFICA

                    <i v-if="aValid === 0" class="fa fa-exclamation-circle ic-sw"
                        data-toggle="tooltip" data-placement="top" data-trigger="hover" title="Rilevati campi obbligatori mancanti"
                    ></i>
                    <i v-else-if="aValid === 1" class="fa fa-check-circle ic-sw"></i>
                </a></li> 

                <li  :class="{'active': fXsActive, 'hidden-xs': !fXsActive}"><a id="default" data-toggle="pill" href="#formazione" @click="retPill('formazione')" 
                  :class="{'invalid': fValid === 0}">FORMAZIONE

                    <i v-if="fValid === 0" class="fa fa-exclamation-circle ic-sw"
                        data-toggle="tooltip" data-placement="top" data-trigger="hover" title="Rilevati campi obbligatori mancanti"
                    ></i>
                    <i v-else-if="fValid === 1" class="fa fa-check-circle ic-sw"></i>
                </a></li>

                <li  :class="{'active': eXsActive, 'hidden-xs': !eXsActive}"><a id="default" data-toggle="pill" href="#esperienze" @click="retPill('esperienze')" 
                  :class="{'invalid': eValid === 0}">ESPERIENZE

                    <i v-if="eValid === 0" class="fa fa-exclamation-circle ic-sw"
                        data-toggle="tooltip" data-placement="top" data-trigger="hover" title="Rilevati campi obbligatori mancanti"
                    ></i>
                    <i v-else-if="eValid === 1" class="fa fa-check-circle ic-sw"></i>
                </a></li>

                <li  :class="{'active': cXsActive, 'hidden-xs': !cXsActive}"><a id="default" data-toggle="pill" href="#competenze" @click="retPill('competenze')" 
                  :class="{'invalid': cValid === 0}">COMPETENZE

                    <i v-if="cValid === 0" class="fa fa-exclamation-circle ic-sw"
                        data-toggle="tooltip" data-placement="top" data-trigger="hover" title="Rilevati campi obbligatori mancanti"
                    ></i>
                    <i v-else-if="cValid === 1" class="fa fa-check-circle ic-sw"></i>
                </a></li>

                <li  :class="{'active': lXsActive, 'hidden-xs': !lXsActive}"><a id="default" data-toggle="pill" href="#lingue" @click="retPill('lingue')" 
                  :class="{'invalid': lValid === 0}">
                  <span class="hidden-xs">CONOSCENZE LINGUISTICHE</span>
                  <span class="visible-xs">LINGUE</span>

                    <i v-if="lValid === 0" class="fa fa-exclamation-circle ic-sw"
                        data-toggle="tooltip" data-placement="top" data-trigger="hover" title="Rilevati campi obbligatori mancanti"
                    ></i>
                    <i v-else-if="lValid === 1" class="fa fa-check-circle ic-sw"></i>
                </a></li>

                <li class="visible-xs" id="bars">
                    <div class="btn-group">
                      <button class="btn btn-default btn-xs dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style="height: 39px;">
                        <span style="padding: 0px 3px;"><i class="fa fa-bars" aria-hidden="true"></i></span>
                      </button>
                      <ul class="dropdown-menu">
                          <li :class="{'active': aXsActive}"><a :class="{'invalid': !aXsActive &&  aValid === 0}"
                          data-toggle="pill" href="#anagrafica" @click="retPill('anagrafica')">ANAGRAFICA</a></li>
                          <li :class="{'active': fXsActive}"><a :class="{'invalid': !fXsActive &&  fValid === 0}"
                          data-toggle="pill" href="#formazione" @click="retPill('formazione')">FORMAZIONE</a></li>
                          <li :class="{'active': eXsActive}"><a :class="{'invalid': !eXsActive &&  eValid === 0}"
                          data-toggle="pill" href="#esperienze" @click="retPill('esperienze')">ESPERIENZE</a></li>
                          <li :class="{'active': cXsActive}"><a :class="{'invalid': !cXsActive &&  cValid === 0}"
                          data-toggle="pill" href="#competenze" @click="retPill('competenze')" >COMPETENZE</a></li>
                          <li :class="{'active': lXsActive}"><a :class="{'invalid': !lXsActive &&  lValid === 0}"
                          data-toggle="pill" href="#lingue" @click="retPill('lingue')" >LINGUE</a></li>
                      </ul>
                    </div>
                </li>

                <span class="pull-right">
                    <a class="btn btn-primary btn-flat" @click="broadcastSave()">SALVA <i class="fa fa-floppy-o pad hidden-xs" aria-hidden="true"></i> </a>
                </span>
            </ul>


            <div class="tab-content">

                <div id="anagrafica" class="tab-pane active">
                    <anagrafica @isValid="anagraphicValidation" @saved="childSaved" @got="gotAnag" @alert="dispatch"></anagrafica>
                </div>

                <div id="formazione" class="tab-pane">
                    <formazione @isValid="eduValidation" @got="gotForm" @alert="dispatch"></formazione>
                </div>

                <div id="esperienze" class="tab-pane">
                    <esperienze @isValid="expValidation" @got="gotExp" @alert="dispatch"></esperienze>
                </div>

                <div id="competenze" class="tab-pane">
                    <competenze @isValid="compValidation" @got="gotComp" @alert="dispatch"></competenze>
                </div>

                <div id="lingue" class="tab-pane">
                    <lingue @isValid="langValidation" @got="gotLang" @alert="dispatch"></lingue>
                </div>
            </div>
           </div>
        </div>
       
    </div>
</template>

<script>

    import anagrafica from './wizard-anagraphics.vue';
    import formazione from './wizard-form.vue';
    import esperienze from './wizard-esp-lavorative.vue';
    import competenze from './wizard-skills.vue';
    import lingue from './wizard-lang.vue';
    
    import alert from './alert-saving.vue';
    import {eventBus} from '../../../eventbus.js';
        
    export default {
        mounted(){
            this.$nextTick(function(){
                this.getStructure();
            });
        },
        created(){
            var vm = this;
        },
        components: {
            anagrafica,
            formazione,
            esperienze,
            competenze,
            lingue,
            alert
        },
        data(){
            return {
                active: 'anagrafica',
                missing: {
                    aMissing: [],
                    fMissing: [],
                    eMissing: [],
                    cMissing: [],
                    lMissing: []
                },
                missingPassed: [],
                showAlert: false,
                message: '',
                
                aValid: -1,
                fValid: -1,
                eValid: -1,
                cValid: -1,
                lValid: -1,
                committedChilds: 0,
                aIsLoaded: false,
                
                commitA: {},
                commitF: [],
                commitE: [],
                commitC: [],
                commitL: {},
                
                parsedF: [],
                parsedE: [],
                parsedC: [],
                parsedL: {},
                
                structureString: '',
                saving: false,
                
                isChrome: !!window.chrome && !!window.chrome.webstore,
                user: localStorage.getItem("career-user-id")
            }
        },
        computed: {
            aXsActive: function(){
                return this.active === 'anagrafica';
            },
            fXsActive: function(){
                return this.active === 'formazione';
            },
            eXsActive: function(){
                return this.active === 'esperienze';
            },
            cXsActive: function(){
                return this.active === 'competenze';
            },
            lXsActive: function(){
                return this.active === 'lingue';
            }
        },
        methods : {
            retPill(id){
                
                var vm = this;
                setTimeout(function(){
                    vm.pill(id)
                },50);   
            },
            pill(id){
                eventBus.$emit('pillChanged', this.active)
                this.active = id;
                
                var tips = document.getElementsByClassName("tooltip");
                for(var i = 0; i < tips.length; i++){
                    tips[i].parentElement.removeChild(tips[i]);
                }
                
                var required = document.getElementsByClassName("missing");
                if(required.length > 0){
                    setTimeout(function(){
                        $(required[0]).focus();    
                    },50);
                }
            },
            anagraphicLoaded(){
                this.aIsLoaded = true; 
            },
            anagraphicValidation($event){
                this.aValid = $event[0];
                this.missing.aMissing = $event[1];
            },
            eduValidation($event){
                this.fValid = $event[0];
                this.missing.fMissing = $event[1];
            },
            expValidation($event){
                this.eValid = $event[0];
                this.missing.eMissing = $event[1];
            },
            compValidation($event){
                this.cValid = $event[0];
                this.missing.cMissing = $event[1];
            },
            langValidation($event){
                this.lValid = $event[0];
                this.missing.lMissing = $event[1];
            },
            broadcastSave(){
                eventBus.$emit('saveFirstCv');
            },
            
            gotAnag($event){
                this.commitA = $event;
                this.childSaved();
            },
            gotForm($event){
                this.commitF = $event;
                this.childSaved();
            },
            gotExp($event){
                this.commitE = $event;
                this.childSaved();
            },
            gotComp($event){
                this.commitC = $event;
                this.childSaved();
            },
            gotLang($event){
                this.commitL = $event;
                this.childSaved();
            },
            
            childSaved(){
                this.committedChilds++;
                if(this.committedChilds === 5){
                    this.dispatchSave();
                }
            },
            dispatchSave(){
                if(this.missing.aMissing.length > 0
                    || this.missing.fMissing.length > 0
                        || this.missing.eMissing.length > 0 
                            || this.missing.cMissing.length > 0 || this.missing.lMissing.length > 0){
                        
                        var subarrays = 0; 
                        if(this.missing.aMissing.length > 0){ subarrays++; }
                        if(this.missing.fMissing.length > 0){ subarrays++; }
                        if(this.missing.eMissing.length > 0){ subarrays++; }
                        if(this.missing.cMissing.length > 0){ subarrays++; }
                        if(this.missing.lMissing.length > 0){ subarrays++; }
                        
                        if(this.missing.aMissing.length > 0){
                            this.missingPassed = this.missingPassed.concat(this.missing.aMissing);
                            if(subarrays > 1){
                                this.missingPassed.push('separator');
                                subarrays--; 
                            }
                        }
                    
                        this.parsedF = this.commitF.filter(function(el){
                             el.filtered = null;
                             if(el.ente.trim()===""){
                                 return false;
                             }
                             return true;
                        })
                    
                        if(this.missing.fMissing.length > 0){
                            
                            this.missingPassed = this.missingPassed.concat(this.missing.fMissing);
                            
                            if(subarrays > 1){
                                this.missingPassed.push('separator');
                                subarrays--; 
                            }
                        }
                    
                        this.parsedE = this.commitE.filter(function(el){
                             if(el.datore.trim()==="" || el.ruolo.trim()===""){
                                 return false;
                             }
                             return true;
                        })
                    
                        if(this.missing.eMissing.length > 0){
                            
                            this.missingPassed = this.missingPassed.concat(this.missing.eMissing);
                            
                            if(subarrays > 1){
                                this.missingPassed.push('separator');
                                subarrays--; 
                            }
                        }
                    
                        this.parsedC = this.commitC.filter(function(el){
                             if(el.nome.trim()==="" || el.livello==null){
                                 return false;
                             }
                             return true;
                        })
                    
                        if(this.missing.cMissing.length > 0){
                            
                            this.missingPassed = this.missingPassed.concat(this.missing.cMissing);
                            
                            if(subarrays > 1){
                                this.missingPassed.push('separator');
                                subarrays--; 
                            }
                        }
                    
                        this.parsedL = this.commitL.langs.filter(function(el){
                             if(el.lingua.trim()==="" || el.comprensione.trim()==="" || el.parlato.trim()===""){
                                 return false;
                             }
                             return true;
                        })
                        
                        this.parsedL = {madrelingua: this.commitL.madrelingua, langs: this.parsedL};
                        
                        if(this.missing.lMissing.length > 0){
                            
                            this.missingPassed = this.missingPassed.concat(this.missing.lMissing);
                            
                            if(subarrays > 1){
                                this.missingPassed.push('separator');
                                subarrays--; 
                            }
                        }
                    
                    this.message = "I seguenti campi obbligatori non risultano correttamente inseriti. Salvare ugualmente? Potrai modificare il curriculum in seguito:";
                    this.showAlert = true;
                    
                } else {
                    this.parsedF = this.commitF;
                    this.parsedE = this.commitE;
                    this.parsedC = this.commitC;
                    this.parsedL = this.commitL;
                    
                    this.message = "Tutti i campi risultano correttamente inseriti. Continuare?";
                    this.showAlert = true;
                }
            },
            choiceMade($event){
                this.missingPassed = [];
                this.committedChilds = 0;
                this.showAlert = false;
                if($event){
                    
                    this.$store.commit('setAnagraphics', this.commitA);
                                    
                    if(this.parsedF!=null ){
                        this.$store.commit('setEducation', {e: this.parsedF, chrome: this.isChrome});
                    }
                    
                    if(this.parsedE!=null){
                        this.$store.commit('setWorkExperiences', this.parsedE); 
                    }
                    
                    if(this.parsedC!=null){
                        this.$store.commit('setSkills', this.parsedC);
                    }
                    
                    if(this.parsedL!=null){
                        this.$store.commit('setLanguages', this.parsedL);
                    }
                    
                    this.saveCV();
                }
            },
            dispatch($event){
               this.$emit("alert", $event);
            },
            getStructure(){
                //GET VC STRUCTURE? 
                this.$http.get(localStorage.getItem("path")+"/Webapi", {
                    headers: {
                        'X-HTTP-Method-Override': "GetCVStructure"
                    }
                }).then((response) => {
                    var res = response.body;
                    this.structureString = res;
                    console.log("got structure");
                })
                
                localStorage.setItem("experiences", null);
                localStorage.setItem("education", null);
                localStorage.setItem("skills", null);
                localStorage.setItem("langs", null);
            },
            saveCV(){
                var a = this.$store.getters.getFullAnagraphics;
                
                var obj = { ID: this.user };
                obj.Nome = a.nome;
                obj.Cognome = a.cognome;
                obj.Persona = obj.Nome + ' ' + obj.Cognome;
                if(a.birth){    obj.DataNascita = a.birth;}
                if(a.indirizzo){  obj.Indirizzo = a.indirizzo;}
                if(a.citta){  obj.Città = a.citta;}
                if(a.cittadinanza){  obj.Cittadinanza = a.cittadinanza;}
                if(a.cap){  obj.CAP = a.cap;}
                if(a.provincia){  obj.IDProvincia = a.provincia.toUpperCase();}
                if(a.mail){  obj.Email = a.mail;}
                if(a.tel){  obj.Telefono = a.tel;}
                if(a.intro){   obj.Note = a.intro;}
                if(a.sesso){   obj.Sesso = a.sesso;}
                
                var earray = [];
                var f = this.$store.getters.getEducation;
                if(f!=null && f.length > 0){
                    console.log("saving " + f.length + " CVS");
                    for( var i = 0; i < f.length; i++){
                        var curr = f[i];
                        var eObj = { IDPersona: this.user };

                        eObj.EnteFormazione = curr.ente;
                        if(curr.stato == 'In Corso'){
                            eObj.InConseguimento = 1;
                            eObj.A = null;
                        } else {
                            eObj.InConseguimento = 0;
                            if(curr.a){
                                eObj.A = curr.a;
                            }
                            var vot = curr.voto.split('/');
                            if(vot[0] && vot[1]){
                                if(vot[0].match(/\D/g)==null
                                  && vot[1].match(/\D/g)==null){
                                    eObj.Votazione = vot[0];
                                    eObj.SuMassimoVotazione = vot[1];
                                }
                            }
                        }
                        if(curr.corso){ eObj.CorsoDiStudio = curr.corso;}
                        
                        eObj.Da = curr.da;
                        if(curr.competenze){
                            eObj.Note = curr.competenze; 
                        }
                        if(curr.ateneo){
                            if(curr.titolo == "LA" || curr.titolo == "LAB")
                            eObj.Ateneo = curr.ateneo; 
                        }
                        earray.push(eObj)
                    }
                    obj.CVS = earray;
                }
                
                var exparray = [];
                var e = this.$store.getters.getWorkExperiences;
                if(e!=null && e.length > 0){
                    console.log("saving " + e.length + " CVP");
                    for(var i = 0; i < e.length; i++){
                        var exp = e[i];
                        var expObj = {IDPersona: this.user };
                        if(exp.datore){expObj.Ente = exp.datore;}
                        if(exp.ruolo){expObj.Ruolo = exp.ruolo;}
                        if(exp.da){expObj.Da = exp.da;}
                        if(exp.a){
                            if(exp.a=='Oggi'){
                                expObj.Attuale = -1;
                            } else {
                                expObj.Attuale = 0;
                                expObj.A = exp.a;
                            }
                        }
                        if(exp.attività!=''){expObj.DescrizioneAttività = exp.attività;}
                        exparray.push(expObj);
                    }
                }
                if(exparray.length > 0){
                    obj.EsperienzeProfessionali = exparray;
                }
                
                var carray = [];
                var c = this.$store.getters.getSkills;
                
                if(c!=null){
                    var skillz = c;
                    
                    console.log("saving " + skillz.length + " Skills");
                    
                    for(var i = 0; i < skillz.length; i++){
                        var cObj = {IDPersona: this.user };
                        cObj.IDRequisito= skillz[i].idReq;
                        cObj.Anno= 2017;
                        cObj.Descrizione= skillz[i].note;
                        cObj.LivelloAutovalutato= skillz[i].livello;
                        this.$store.commit('addReqNameMapping', {id: skillz[i].idReq, name: skillz[i].nome});
                        
                        carray.push(cObj)
                    };
                }
                
                if(carray.length > 0){
                    obj.Competenza = carray;
                }
                
                this.saving = true;
                
                this.$http.put(localStorage.getItem("rec-path")+"/PersonaCV", 
                    JSON.stringify(obj), {
                    headers: {
                        'Content-type': 'application/json',
                        'token': "recruiting_token",
                        'child-level': "9999"
                    }
                }).then((response) => {
                    this.saving = false;
                    this.$emit("cvCreated");
                }, function(err){
                    console.log("ERROR");
                    console.log(err);
                    this.saving = false;
                })
                
            }
        }
    }
</script>

<style>
    i.ic-sw{
        padding-left: 5px;    
    }
    
    a.invalid{
        color: #f0ad4e !important;
    }
    li.active > a.invalid{
        color: white !important;
        background-color: #f0ad4e;
    }
    
    .control-label{
        text-align: left;
        padding-bottom: 5px;
    }
    .missing{
        background-color: blanchedalmond;
        border-width: 2px;
        border-color: navajowhite;
    }

    .roll-fade-enter{
        opacity: 0;
    }
    .roll-fade-enter-active{
        animation: slide-in 0.5s ease-out forwards;
        transition: opacity 0.5s;
    }
    .roll-fade-leave-active{
        animation: slide-out 0.5s ease-out forwards;
        transition: opacity 0.5s;
        opacity: 0;
        position: absolute;
    }
    .roll-fade-move{
        transition: transform 0.5s;
    }
    
    @keyframes slide-in{
        from {
            transform: translateX(100px);
        }
        to {
            transform: translateX(0px);
        }
    }
    
    @keyframes slide-out{
        from {
            transform: translateX(0px);
        }
        to {
            transform: translateX(100px);
        }
    }
    
    .center-delete-btn{
        max-width: 100px;
        margin: 0 auto;
        left: 0px;
        right: 0px;
    };
    
    input[type=range]{
        -webkit-appearance: none;
    }
    
    input[type=range]::-webkit-slider-runnable-track {
        width: 300px;
        height: 5px;
        background-color: #42a5f5;
        border: none;
        border-radius: 3px;
    }
    
    input[type=range]::-webkit-slider-thumb {
        -webkit-appearance: none;
        border: 1px gray solid;
        height: 16px;
        width: 16px;
        border-radius: 50%;
        background-color: whitesmoke;
        margin-top: -5px;
    }

    input[type=range]:focus {
        outline: none;
    }
       
    input[type=range]:focus::-webkit-slider-runnable-track,
    {
        background-color: #ccc;
    }
    
    
    input[type=range]::-ms-track {
        height: 5px;

        /*remove bg colour from the track, we'll use ms-fill-lower and ms-fill-upper instead */
        background: transparent;

        /*leave room for the larger thumb to overflow with a transparent border */
        border-color: transparent;
        border-width: 6px 0;

        /*remove default tick marks*/
        color: transparent;
    }
    
    input[type=range]::-ms-fill-lower {
        background: #42a5f5;
        border-radius: 3px;
    }
    
    input[type=range]::-ms-fill-upper {
        background: #ccc;
        border-radius: 3px;
    }
    
    input[type=range]::-ms-thumb {
        border: 1px gray solid;
        height: 16px;
        width: 16px;
        border-radius: 50%;
        background-color: whitesmoke;
        margin: -3px;
    }
    
    input[type=range]:focus::-ms-fill-lower {
        background: #42a5f5;
    }
    
    input[type=range]:focus::-ms-fill-upper {
        background: #ccc;
    }
</style>