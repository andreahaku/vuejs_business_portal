<template>
    <!-- extra div for emulating position:fixed of the menu -->
    <div class="st-content-inner padding-top-none" id="cv-inner">
        <div v-if="loading" class='uil-rolling-css' style='transform:scale(0.71); 
        position: absolute; margin: 0 auto; top: 100px; right: 0px; left: 0px;'>
            <div>
                <div></div>
                <div></div>
            </div>
        </div>
        <div v-else>
            <alert :show="showAlert" :mess="message" @done="choiceMade"></alert>
            <div v-if="cvDetected == 1" class="hidden-xs" style="position:fixed; z-index:2; max-width: 400px; margin: 0 auto; right: 0px;" :style="leftStyle">
                <ul class="nav nav-tabs">
                    <li role="presentation" class="active"><a @click.prevent="scrollTo('a')" class="pills-spy">Anagrafica</a></li>
                    <li role="presentation" class="active"><a @click.prevent="scrollTo('f')" class="pills-spy">Formazione</a></li>
                    <li role="presentation" class="active"><a @click.prevent="scrollTo('e')" class="pills-spy">Esperienze</a></li>
                    <li role="presentation" class="active"><a @click.prevent="scrollTo('c')" class="pills-spy">Competenze</a></li>
                </ul>
            </div>
            <div v-if="cvDetected == 1" class="container-fluid">
                <div class="page-section" style="padding-bottom: 20px;">
                    <div class="media v-middle">
                        <div class="media-body">
                            <div class="media-left">
                                <h1 id="tt" class="text-display-1 margin-none">Il Mio Curriculum Vitae</h1>
                                <p class="text-subhead">Modifica o Aggiorna il tuo curriculum</p>
                            </div>
                        </div>
                    </div>
                </div>
                <anagrafica id="a" @alert="openAlert" :updating="aUpdating" :err="aErr" @updateCV="updateCV" style="position: relative;"></anagrafica>
                <formazione id="f" @alert="openAlert" :updating="fUpdating" :err="fErr" @updateCV="updateCV" style="position: relative;"></formazione>
                <esperienze id="e" @alert="openAlert" :updating="eUpdating" :err="eErr" @updateCV="updateCV" style="position: relative;"></esperienze>
                <competenze id="c" @alert="openAlert" :updating="cUpdating" :err="cErr" @updateCV="updateCV" style="position: relative;"></competenze>
            </div>
            <div v-else-if="cvDetected == 0">
                <wizard @cvCreated="updateStore" @alert="openAlert"></wizard>
            </div>
            <sidejsonly :default="false"></sidejsonly>
        </div>
    </div>
</template>
<script>
import anagrafica from "./cv-components/anagrafica.vue";
import formazione from "./cv-components/formazione.vue";
import esperienze from "./cv-components/esp-lavorative.vue";
import competenze from "./cv-components/skills.vue";
import wizard from "./cv-components/wizard.vue";

import alert from "./cv-components/alert-choice.vue";
import sidejsonly from "../components/side-default-jsonly.vue"
import {
    eventBus
} from "../../eventbus.js";

export default {
    components: {
        anagrafica,
        formazione,
        esperienze,
        competenze,

        wizard,
        alert,
        sidejsonly
    },
    mounted() {
        this.$nextTick(function() {
            this.checkToken();
        })
    },
    data() {
        return {
            cvDetected: -1,
            loading: true,
            baseToken: {},

            showAlert: false,
            istance: {},
            message: '',
            leftStyle: {
                left: '35px'
            },
            isIE: /*@cc_on!@*/ false || !!document.documentMode,
            isChrome: !!window.chrome && !!window.chrome.webstore,

            aUpdating: false,
            aErr: false,
            eUpdating: false,
            eErr: false,
            fUpdating: false,
            fErr: false,
            cUpdating: false,
            cErr: false,

            user: localStorage.getItem("career-user-id")
        }
    },
    created() {
        var vm = this;
        if (!this.isIE) {
            eventBus.$on("listenCV", function(visible) {
                var px;
                if (visible) {
                    px = "250px";
                } else {
                    px = "35px";
                }
                vm.leftStyle = {
                    left: px
                };
            });
        } else {
            this.leftStyle = {
                left: '40%'
            }
            eventBus.$on("listenCV", function(visible) {
                var perc;
                if (visible) {
                    perc = "45%";
                } else {
                    perc = "40%";
                }
                vm.leftStyle = {
                    left: perc
                };
            });
        }
    },
    methods: {
        openAlert($event) {
            this.showAlert = true;
            this.message = $event[0];
            this.istance = $event[1];
        },
        choiceMade($event) {
            this.showAlert = false;
            eventBus.$emit('choice', [$event, this.istance]);
        },
        scrollTo(id) {
            document.getElementById(id).scrollIntoView();
        },
        findCV() {
            var a = this.$store.getters.getAnagraphics;
            if (a == null || a == {}) {

                this.$http.get(localStorage.getItem("rec-path") + "/PersonaCV?ID=" + this.user, {
                    headers: {
                        token: this.baseToken.token,
                        'child-level': "9999"
                    }
                }).then((response) => {

                    var res = response.body;
                    try{
                        res = JSON.parse(response.body);
                    } catch(err) {};

                    if (res && res.PersonaCV && res.PersonaCV[0]) {
                        if (res.PersonaCV[0].Competenza == null &&
                            res.PersonaCV[0].CVS == null &&
                            res.PersonaCV[0].EsperienzeProfessionali) {

                            localStorage.setItem("nomewiz", res.PersonaCV[0].Nome);
                            localStorage.setItem("cognomewiz", res.PersonaCV[0].Cognome);
                            localStorage.setItem("mailwiz", res.PersonaCV[0].Email);

                            this.cvDetected = 0;
                            this.loading = false;

                        } else {
                            this.commitData(res.PersonaCV[0]);
                            this.cvDetected = 1;
                            this.loading = false;
                        }
                    }
                }, function(err) {

                    alert("get Persona CV error: \n" + err);
                    this.cvDetected = 0;
                    this.loading = false;
                })
            } else {
                this.cvDetected = 1;
                this.loading = false;
            }

        },
        commitData(cv) {
            //commits if cv found
            var anagraphics = {}
            anagraphics.nome = cv.Nome;
            anagraphics.cognome = cv.Cognome;
            anagraphics.indirizzo = cv.Indirizzo;
            anagraphics.citta = cv.Città;
            anagraphics.tel = cv.Telefono;
            anagraphics.birth = cv.DataNascita;

            //optional in store
            anagraphics.cap = '' + cv.CAP;
            anagraphics.provincia = cv.IDProvincia.toLowerCase();
            anagraphics.mail = cv.Email;
            anagraphics.cittadinanza = cv.Cittadinanza;
            anagraphics.intro = cv.Note.replace(/\n/g, "<br>");
            anagraphics.sesso = cv.Sesso;

            this.$store.commit('setAnagraphics', anagraphics);

            if (cv.Competenza && cv.Competenza.length > 0) {
                var comps = []
                for (var i = 0; i < cv.Competenza.length; i++) {
                    var c = cv.Competenza[i];
                    var obj = {
                        idReq: c.IDRequisito,
                        anno: c.Anno
                    };
                    /*
                    var parse = c.Descrizione.split("|");
                    if(parse[0]){   obj.tipo = parse[0];}
                    if(parse[1]){   obj.note = parse[1];}
                    if(obj.tipo==null || obj.tipo==='undefined'){
                        obj.tipo = 'Personale';
                        obj.note = null;
                    }*/
                    if (c.Descrizione != null) {
                        obj.note = c.Descrizione;
                    }
                    if (c.LivelloAutovalutato) {
                        obj.livello = c.LivelloAutovalutato;
                    }
                    comps.push(obj);
                }
                if (comps.length > 0) {
                    this.$store.commit('setSkills', comps);
                } else {}
            } else {
                console.log("NO SKILLS FOUND");
            }

            if (cv.CVS && cv.CVS.length > 0) {
                var education = [];
                for (var i = 0; i < cv.CVS.length; i++) {
                    var cvs = cv.CVS[i];
                    var obj = {};

                    obj.da = cvs.Da;
                    if (cvs.InConseguimento == 0) {
                        obj.stato = "Terminato";
                        obj.a = cvs.A;
                        if (cvs.Votazione != -1 && cvs.SuMassimoVotazione != -1) {
                            obj.voto = cvs.Votazione + '/' + cvs.SuMassimoVotazione;
                        }
                    } else {
                        obj.stato = "In Corso";
                        obj.a = 'Oggi';
                    }
                    if (cvs.CorsoDiStudio != "") {
                        obj.corso = cvs.CorsoDiStudio
                    }
                    obj.ente = cvs.EnteFormazione;
                    obj.competenze = cvs.Note;
                    if (cvs.Ateneo) {
                        obj.ateneo = cvs.Ateneo;
                    }

                    obj.DBID = cvs.ID;

                    education.push(obj);
                }
                this.$store.commit('setEducation', {
                    e: education,
                    chrome: this.isChrome
                });
            } else {
                console.log("NO EDUCATION FOUND");
            }

            if (cv.EsperienzeProfessionali && cv.EsperienzeProfessionali.length > 0) {
                var experiences = [];

                for (var i = 0; i < cv.EsperienzeProfessionali.length; i++) {
                    var exp = cv.EsperienzeProfessionali[i];
                    var obj = {};
                    obj.datore = exp.Ente;
                    obj.ruolo = exp.Ruolo;
                    obj.attività = exp.DescrizioneAttività;
                    obj.da = exp.Da;

                    if (obj.da.indexOf("-") != -1) {
                        var da = obj.da.split("-")
                        da.reverse();
                        var n = da[0];
                        for (var j = 1; j < da.length; j++) {
                            n += "/" + da[j];
                        }
                        obj.daChromeFormat = n;
                    }

                    if (exp.Attuale === -1) {
                        obj.a = 'Oggi'
                        obj.aChromeFormat = 'Oggi';
                    } else {
                        obj.a = exp.A;
                        if (obj.a.indexOf("-") != -1) {
                            var a = obj.a.split("-")
                            a.reverse();
                            var n = a[0];
                            for (var j = 1; j < a.length; j++) {
                                n += "/" + a[j];
                            }
                            obj.aChromeFormat = n;
                        }
                    }
                    obj.DBID = exp.ID;
                    experiences.push(obj);
                }
                this.$store.commit('setWorkExperiences', experiences);
            }
        },
        checkToken() {
            var path = JSON.parse(this.$root.lsGet("configs")).urlApiRecruiting;
            localStorage.setItem("rec-path", path);

            if (localStorage.getItem("career-user-logged") == null) {
                localStorage.setItem("goingCv", true);
                this.$router.replace({
                    name: 'log'
                })
            } else if (localStorage.getItem("recruitingToken") == null) {
                localStorage.removeItem("goingCv");
                this.$http.get(localStorage.getItem("rec-path") + "/Webapi", {
                    headers: {
                        'X-HTTP-Method-Override': 'GetToken',
                        email: 'maicol.buscherini@bkm.it',
                        password: 'Bkm-2008'
                    }
                }).then((response) => {

                    if (response.body != null) {
                        localStorage.setItem("recruitingToken", response.body);
                        this.baseToken.token = response.body;
                        this.findCV();
                    } else {
                        alert("Get Token empty");
                    }
                }, function(err) {
                    alert("Get Token error \n " + err);
                });
            } else {
                this.baseToken.token = localStorage.getItem("recruitingToken");
                this.findCV();
            }
        },
        updateStore(avoid) {
            //updates store after wizard 
            if (avoid != true) {
                this.loading = true;
            }

            this.$http.get(localStorage.getItem("rec-path") + "/PersonaCV?ID=" + this.user, {
                headers: {
                    token: this.baseToken.token,
                    'child-level': 9999
                }
            }).then((response) => {
                var res = response.body;
                try{
                    res = JSON.parse(response.body);
                } catch(err) {};
                
                if (res && res.PersonaCV && res.PersonaCV[0]) {
                    this.commitData(res.PersonaCV[0]);
                    this.cvDetected = 1;
                    this.loading = false;
                }
            });
        },
        updateCV($event) {
            //ogni volta che si fa una modifica
            var vm = this;
            var hasToUpdateStore = false;

            if ($event == 'a') {
                this.aUpdating = true;

                var a = this.$store.getters.getFullAnagraphics;
                var obj = {
                    ID: this.user
                };
                if (a.nome && a.cognome) {
                    //obj.Nome = a.nome;
                    //obj.Cognome = a.cognome;
                    //obj.Persona = a.nome + ' ' + a.cognome;
                }
                if (a.tel) {
                    obj.Telefono = a.tel;
                }
                if (a.cittadinanza) {
                    obj.Cittadinanza = a.cittadinanza;
                }
                if (a.birth) {
                    obj.DataNascita = a.birth;
                }
                if (a.indirizzo) {
                    obj.Indirizzo = a.indirizzo;
                }
                if (a.citta) {
                    obj.Città = a.citta;
                }
                if (a.cap) {
                    obj.CAP = a.cap;
                }
                if (a.provincia) {
                    obj.IDProvincia = a.provincia.toUpperCase();
                }
                if (a.mail) {
                    obj.Email = a.mail;
                }
                if (a.intro) {
                    obj.Note = a.intro;
                }

                this.$http.put(localStorage.getItem("rec-path") + "/PersonaCV",
                    JSON.stringify(obj), {
                        headers: {
                            'Content-type': 'application/json',
                            'token': localStorage.getItem('recruitingToken'),
                            'child-level': 9999
                        }
                    }).then((response) => {
                    this.aUpdating = false;
                    this.aErr = false;
                }, function(err) {
                    console.log("ERROR");
                    console.log(err);
                    this.aUpdating = false;
                    this.aErr = true;
                })


            } else if ($event.value == 'f') {
                this.fUpdating = true;

                var f = this.$store.getters.getEducation;

                var obj = {
                    ID: this.user
                };
                var form = [];
                if (f != null) {
                    for (var i = 0; i < f.length; i++) {
                        var item = f[i];
                        var fObj = {
                            IDPersona: this.user
                        };
                        if (item.DBID) {
                            fObj.ID = item.DBID;
                        } else {
                            hasToUpdateStore = true;
                        }
                        if (item.ente) {
                            fObj.EnteFormazione = item.ente;
                        }
                        if (item.da) {
                            fObj.Da = item.da;
                        }
                        if (item.stato == "In Corso") {
                            fObj.InConseguimento = 1;
                        } else {
                            fObj.InConseguimento = 0;
                            if (item.a) {
                                fObj.A = item.a
                            }
                            if (item.voto) {
                                var voti = item.voto.split('/');
                                if (voti[0].match(/\D/g) == null && voti[1].match(/\D/g) == null) {
                                    fObj.Votazione = voti[0];
                                    fObj.SuMassimoVotazione = voti[1];
                                }
                            }
                        }
                        if (item.corso) {
                            fObj.CorsoDiStudio = item.corso;
                        }
                        if (item.ateneo) {
                            fObj.Ateneo = item.ateneo;
                        }
                        if (item.competenze) {
                            fObj.Note = item.competenze
                        }
                        form.push(fObj);
                    }
                }
                if (form.length > 0) {
                    obj.CVS = form;
                    var range = 1;
                    var counter = 0;
                    if ($event.delete) {
                        console.log("delete from DB");
                        range += $event.delete.length;
                    }
                    this.$http.put(localStorage.getItem("rec-path") + "/PersonaCV",
                        JSON.stringify(obj), {
                            headers: {
                                'Content-type': 'application/json',
                                'token': localStorage.getItem('recruitingToken'),
                                'child-level': 9999
                            }
                        }).then((response) => {
                        counter++
                        if (counter == range) {
                            this.fUpdating = false;
                            this.fErr = false;
                            if (hasToUpdateStore) {
                                this.updateStore(true);
                            }
                        }
                        if ($event.delete) {
                            for (var i = 0; i < $event.delete.length; i++) {
                                this.$http.get(localStorage.getItem("rec-path") + "/Webapi", {
                                    headers: {
                                        'X-HTTP-Method-Override': 'DeleteCVS',
                                        'token': localStorage.getItem('recruitingToken'),
                                        'idCVS': $event.delete[i]
                                    }
                                }).then((response) => {
                                    counter++;
                                    if (counter == range) {
                                        this.fUpdating = false;
                                        this.fErr = false;
                                        if (hasToUpdateStore) {
                                            this.updateStore(true);
                                        }
                                    }
                                }, function(err) {
                                    counter++;
                                    console.log("ERROR");
                                    console.log(err);
                                    this.fErr = true;
                                    this.fUpdating = false;
                                    this.updateStore(true);
                                });
                            }
                        }
                    }, function(err) {
                        console.log("ERROR");
                        console.log(err);
                        this.fUpdating = false;
                        this.fErr = true;
                    })
                } else {
                    this.fUpdating = false;
                    this.fErr = false;
                }

            } else if ($event.value == 'e') {
                this.eUpdating = true;

                var e = this.$store.getters.getWorkExperiences;
                var obj = {
                    ID: this.user
                };
                var exps = [];
                if (e != null) {
                    for (var i = 0; i < e.length; i++) {
                        var exp = e[i];
                        var eObj = {
                            IDPersona: this.user
                        };
                        if (exp.datore) {
                            eObj.Ente = exp.datore;
                        }
                        if (exp.ruolo) {
                            eObj.Ruolo = exp.ruolo;
                        }
                        if (exp.attività) {
                            eObj.DescrizioneAttività = exp.attività;
                        }
                        if (exp.da) {
                            eObj.Da = exp.da;
                        }
                        if (exp.a) {
                            if (exp.a == 'Oggi') {
                                eObj.Attuale = -1;
                            } else {
                                eObj.Attuale = 0;
                                eObj.A = exp.a;
                            }
                        }
                        if (exp.DBID) {
                            eObj.ID = exp.DBID;
                            eObj.IDRuolo = 506;
                            eObj.IDSettore = 25;
                            eObj.IDTipoRapporto = 'APP';
                            eObj.IDAreaOrganizzativa = 4;
                        } else {
                            hasToUpdateStore = true;
                        }
                        exps.push(eObj);
                    }
                }
                if (exps.length > 0) {
                    obj.EsperienzeProfessionali = exps;
                    var range = 1;
                    var counter = 0;
                    if ($event.delete) {
                        console.log("delete from DB");
                        range += $event.delete.length;
                    }
                    this.$http.put(localStorage.getItem("rec-path") + "/PersonaCV",
                        JSON.stringify(obj), {
                            headers: {
                                'Content-type': 'application/json',
                                'token': localStorage.getItem('recruitingToken'),
                                'child-level': 9999
                            }
                        }).then((response) => {
                        counter++
                        if (counter == range) {
                            this.eUpdating = false;
                            this.eErr = false;
                            if (hasToUpdateStore) {
                                this.updateStore(true);
                            }
                        }
                        if ($event.delete) {
                            for (var i = 0; i < $event.delete.length; i++) {
                                this.$http.get(localStorage.getItem("rec-path") + "/Webapi", {
                                    headers: {
                                        'X-HTTP-Method-Override': 'DeleteEsperienza',
                                        'token': localStorage.getItem('recruitingToken'),
                                        'idEsperienza': $event.delete[i]
                                    }
                                }).then((response) => {
                                    counter++;
                                    if (counter == range) {
                                        this.eUpdating = false;
                                        this.eErr = false;
                                        if (hasToUpdateStore) {
                                            this.updateStore(true);
                                        }
                                    }
                                }, function(err) {
                                    counter++
                                    console.log("ERROR");
                                    console.log(err);
                                    this.eErr = true;
                                    this.eUpdating = false;
                                    this.updateStore(true);
                                });
                            }
                        }
                    }, function(err) {
                        console.log("ERROR");
                        console.log(err);
                        this.eErr = true;
                        this.eUpdating = false;
                    })
                } else {
                    this.eUpdating = false;
                    this.eErr = false;
                }

            } else if ($event.value == 'c') {
                this.cUpdating = true;
                var c = this.$store.getters.getSkills;

                var obj = {
                    ID: this.user
                };
                if (c.length > 0 || c.length > 0) {
                    var skills = c;
                    var skarray = [];
                    for (var i = 0; i < skills.length; i++) {
                        console.log("updating " + skills.length + " skills")
                        var skill = skills[i];
                        var sObj = {
                            IDPersona: this.user
                        }
                        if (skill.idReq) {
                            sObj.IDRequisito = skill.idReq;
                        }
                        if (skill.anno) {
                            sObj.Anno = skill.anno;
                        } else {
                            sObj.Anno = 2017;
                            hasToUpdateStore = true;
                        }

                        if (skill.note && skill.note.trim() != '') {
                            sObj.Descrizione = skill.note;
                        } else {
                            sObj.Descrizione = null;
                        }
                        if (skill.livello) {
                            sObj.LivelloAutovalutato = skill.livello;
                        }
                        skarray.push(sObj);
                    }
                }
                if (skarray.length > 0) {
                    obj.Competenza = skarray;
                    this.$http.put(localStorage.getItem("rec-path") + "/PersonaCV",
                        JSON.stringify(obj), {
                            headers: {
                                'Content-type': 'application/json',
                                'token': localStorage.getItem('recruitingToken'),
                                'child-level': 9999
                            }
                        }).then((response) => {
                        this.cUpdating = false;
                        this.cErr = false;
                        if (hasToUpdateStore) {
                            this.updateStore(true);
                        }
                    }, function(err) {
                        console.log("ERROR");
                        console.log(err);
                        this.cErr = true;
                        this.cUpdating = false;
                    })
                } else {
                    this.cUpdating = false;
                    this.cErr = false;
                }

            }

        },
    }
}
</script>
<style>
.bg-cv {
    background-color: #42a5f5;
}

a.pills-spy {
    margin: 0px !important;
    border-width: 0px !important;
    background-color: #42a5f5 !important;
    color: white !important;
}

a.pills-spy:hover {
    cursor: pointer !important;
    background-color: white !important;
    color: #42a5f5 !important;
}
</style>
