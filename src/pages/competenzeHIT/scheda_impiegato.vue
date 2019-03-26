<template>
    <div class="st-pusher" id="content">
        <div class="st-content">
            <div class="st-content-inner padding-none" id="inner">
                <div v-if="loading" class='uil-rolling-css' style='transform:scale(0.71); 
                position: absolute; margin: 0 auto; top: 100px; right: 0px; left: 0px;'>
                    <div>
                        <div></div>
                        <div></div>
                    </div>
                </div>
                <div v-else class="container-fluid" id="elt" style="padding-top: 10px;">
                    <alertchoice :show="showModal" :mess="message" @done="handleChoice"></alertchoice>
                    <anagrafica v-if="stato!=null" :stato="stato" :valutatore="valutatore" @changeStatus="updateStatus($event)"></anagrafica>
                    <cascading v-if="stato!=null"></cascading>
                    <individuali v-if="stato!=null" :valutatore="valutatore" :stato="stato" @indChange="indChange"></individuali>
                    <!-- FROM
                    pres, ceo, ceo-it
                    -->
                    <competenza v-if="stato!=null" :valutatore="valutatore" :stato="stato" from="pres" :obj="goalPres" @compChange="presChange"></competenza>
                    <competenza v-if="stato!=null" :valutatore="valutatore" :stato="stato" from="ceo" :obj="goalCeo" @compChange="ceoChange"></competenza>
                    <competenza v-if="stato!=null" :valutatore="valutatore" :stato="stato" from="ceo-it" :obj="goalCeoit" @compChange="ceoitChange"></competenza>
                    <div class="break_page"></div>
                    <azioni v-if="stato!=null" :stato="stato" :valutatore="valutatore" @commChange="upComm"></azioni>
                    <complessiva v-if="stato!=null" :valutatore="valutatore" :stato="stato" :aSuggest.sync="aSuggest" :vSuggest.sync="vSuggest" @finalChange="finalChange"></complessiva>

                    <a v-if="stato != 12 && modified" class="btn btn-warning printden" style="margin-bottom: 10px; position: fixed; bottom: 50px; right: 175px;" @click="showSaveModal()">{{strings.btnSave[itaEng01]}}</a>
                    
                    <a class="btn btn-danger printden" style="margin-bottom: 10px; position: fixed; bottom: 50px; right: 25px;" @click="printSetup()">Stampa Scheda</a>
                     
                    
                    <div v-if="$root.getPermessi().showLowerImage" style="text-align: center;">
                        <img :src="$root.getPermessi().lowerImage" class="img-rounded" :class="[$root.xs ?  'width-300' : 'width-400']" style="margin-bottom: 20px;">
                    </div>
                </div>
                <print-content :setup="printSetup" :trigger="flag"></print-content>
            </div>
        </div>
    </div>
</template>
<script>
import sidejsonly from '../components/side-default-jsonly.vue'
import alertchoice from '../recruiting/cv-components/alert-choice.vue'

import anagrafica from './obj-components/h-anagrafica.vue'
import cascading from './obj-components/h-cascading.vue'
import individuali from './obj-components/h-individuali.vue'
import competenza from './obj-components/h-competenze.vue'
import azioni from './obj-components/h-azioni-sviluppo.vue'
import complessiva from './obj-components/h-complessiva.vue'

import printContent from '../../_printContent/printContent.vue'

import {
    eventBus
} from '../../eventbus.js';

export default {
    mounted: function() {
        this.init();
    },
    components: {
        sidejsonly,
        alertchoice,
        anagrafica,
        cascading,
        individuali,
        competenza,
        azioni,
        complessiva,
        printContent
    },
    data: function() {
        return {
            strings: this.$root.getStrings(),
            itaEng01: this.$root.lang(),
            permessi: {},
            toPrint: false,

            stato: null,
            valutatore: null,
            admin: this.$root.isAdmin(),

            loading: true,
            modified: false,

            everything: [],
            goalCascading: [],
            goalInd: [],
            goalPres: {},
            goalCeo: {},
            goalCeoit: {},
            schedaVal: {},

            //calcolo media

            objAutoTot: 0,
            objValTot: 0,
            objAutoNon0: 0,
            objValNon0: 0,
            aSuggest: 0,
            vSuggest: 0,

            index: {},
            message: '',
            showModal: false,

            howMany: 0,
            flag: false
        }
    },
    watch: {
        '$route': function() {
            location.reload();
        }
    },
    methods: {
        printSetup: function(){
            // array con le informazioni su come trasformare HTML dinamico in statico
            var array = [
                {selector: "#elt .not_app", into: 'SPAN', how: function(el){
                    var input = el.children[0];
                    var c = input.checked;
                    if(!c){ 
                        return 'nothing';
                    } else {
                        return 'Not Applicable: ✓'
                    }
                }},
                {selector: "#elt textarea", into: 'DIV', how: function(el){
                    return el.value
                }},
                {selector: "#elt input", into: 'SPAN', how: function(el){
                    return el.value
                }},
                {selector: "#elt select", into: 'SPAN', how: function(el){
                    var selezionato = el.selectedIndex;
                    var text;
                    if(el[selezionato] != null){
                        text = el[selezionato].label;
                    } else {
                        text = '';
                    }
                    return text;
                }},
                {selector: "#elt span.span_weight", into: 'keep', how: function(el){
                    return (el.innerHTML+' %');
                }}
            ];
            // selettore degli elementi da non stampare
            var deny = "#elt .printden";
            var wrapper_id = "content"

            var css_custom = [{
                selector: ".col-xs-12",
                style: [{what: "padding-left", val: "5px"},{what: "padding-right", val: "5px"}]
            },{
                selector: "h3.text-headline.panel-title",
                style: [{what: "padding", val: "15px"}]
            },{
                selector: "h5.text-subhead",
                style: [{what: "margin-top", val: "15px"}]
            },
            {
                selector: ".col-xs-12.comp",
                style: [{what: "padding", val: "5px 20px"}]
            },{
                selector: "span.print_bold",
                style: [{what: "font-weight", val: '600'}, {what: "font-size", val: '15px'}]
            },{
                selector: ".panel.panel-default.obb",
                style: [{what: "margin-left", val: '8px'}]
            },{
                selector: ".container_complessiva",
                style: [{what: "margin", val: '5px 10px'}]
            },{
                selector: ".print_paddless",
                style: [{what: "padding", val: '0px'}]
            },{
                selector: ".print_avatar",
                style: [{what: "margin-left", val: '235px'}]
            }]
            this.printContent(array, wrapper_id, deny, css_custom);
        },
        updateStatus: function(status) {
            this.showSaveModal(status);
        },
        showSaveModal(status) {
            if (status != null) {
                localStorage.setItem("changingStatus", status);

                this.message = this.strings.statusMessage[this.itaEng01];
            } else {
                this.message = this.strings.checkMessage[this.itaEng01];
            }
            var numero_obiettivi = this.goalInd.length;
            var peso = 0;

            for (let i = 0; i < numero_obiettivi; i++) {
                peso = peso + this.goalInd[i].Peso;
            }
            if (peso == 100 || peso == 0 || this.stato > 5) {
                this.showModal = true;
            } else {
                if (localStorage.getItem("changingStatus") != null) {
                    localStorage.removeItem("changingStatus");
                }
                eventBus.$emit('alert', this.strings.alertPerc[this.itaEng01]);
            }
        },
        handleChoice: function($event) {
            this.showModal = false;

            if ($event == true) {
                if (localStorage.getItem("changingStatus") != null) {
                    this.save(localStorage.getItem("changingStatus"))
                } else {
                    this.save();
                }
            } else if (localStorage.getItem("changingStatus") != null) {
                localStorage.removeItem("changingStatus");
            }
        },
        init: function() {
            if (localStorage.getItem("changingStatus") != null) {
                localStorage.removeItem("changingStatus");
            }

            var par = this.$route.params;
            var v = Base64.decode(par.ruolo);
            if (v === "Valutato") {
                v = false;
            } else if (v === "Valutatore") {
                v = true;
            }
            if (par.idscheda != null && (v === true || v === false)) {
                this.valutatore = v;
                this.getMeta(par.idscheda);
            } else {
                if (par.idscheda != null && Base64.decode(par.ruolo) == "Admin" && this.admin) {
                    this.valutatore = null;
                    this.getMeta(par.idscheda);
                } else {
                    eventBus.$emit('alert', this.strings.alertAcc[this.itaEng01]);
                    this.$router.replace({
                        path: '/'
                    })
                }
            }
        },
        indChange: function($event) {
            this.goalInd[$event.index] = $event.obj;
            this.goalInd[$event.index].do_updated = -1;
            this.modified = true;
            if ($event.isVal && this.stato >= 10) {
                this.calcolaMedia();
            }
        },
        presChange: function($event) {
            this.goalPres = $event.obj;
            this.goalPres.do_updated = -1;
            this.modified = true;

            if ($event.isVal) {
                this.calcolaMedia()
            }
        },
        ceoChange: function($event) {
            this.goalCeo = $event.obj;
            this.goalCeo.do_updated = -1;
            this.modified = true;

            if ($event.isVal) {
                this.calcolaMedia()
            }
        },
        ceoitChange: function($event) {
            this.goalCeoit = $event.obj;
            this.goalCeoit.do_updated = -1;
            this.modified = true;

            if ($event.isVal) {
                this.calcolaMedia()
            }
        },
        upComm: function($event) {
            this.schedaVal.NoteGeneriche = $event.NoteGeneriche;
            this.schedaVal.NoteValutato = $event.NoteValutato;
            this.schedaVal.do_updated = -1;
            this.modified = true;
        },
        finalChange: function($event) {
            this.schedaVal.Autovalutazione = $event.Autovalutazione;
            this.schedaVal.Valutazione = $event.Valutazione;
            this.schedaVal.CommentiFinaliValutato = $event.CommentiFinaliValutato;
            this.schedaVal.CommentiFinaliValutatore = $event.CommentiFinaliValutatore;
            this.schedaVal.do_updated = -1;
            this.modified = true;
        },
        calcolaMedia: function() {
            var anon0 = 0;
            var vnon0 = 0;
            var tota = 0;
            var totv = 0;

            for (var i = 0; i < this.goalInd.length; i++) {
                var goal = this.goalInd[i];
                if (goal.AutoValutazioneFinale != 0 && goal.AutoValutazioneFinale != null) {
                    anon0++;
                    tota += goal.AutoValutazioneFinale;
                }
                if (goal.ValutazioneFinale != 0 && goal.ValutazioneFinale != null) {
                    vnon0++;
                    totv += goal.ValutazioneFinale;
                }
            }

            if (anon0 != 0) {
                this.objAutoNon0 = anon0;
                this.objAutoTot = tota;
            }
            if (vnon0 != 0) {
                this.objValNon0 = vnon0;
                this.objValTot = totv;
            }
            this.suggerisci();
        },
        suggerisci: function() {
            var tota = 0;
            var totv = 0;
            var anon0 = 0;
            var vnon0 = 0;
            if (this.objAutoNon0 > 0) {
                anon0 = this.objAutoNon0;
                tota = this.objAutoTot;
            }
            if (this.objValNon0 > 0) {
                vnon0 = this.objValNon0;
                totv = this.objValTot;
            }

            if (this.goalPres && this.goalPres.AutoValutazioneFinale != 0 && this.goalPres.AutoValutazioneFinale != null) {
                anon0++;
                tota += this.goalPres.AutoValutazioneFinale;
            }
            if (this.goalPres && this.goalPres.ValutazioneFinale != 0 && this.goalPres.ValutazioneFinale != null) {
                vnon0++;
                totv += this.goalPres.ValutazioneFinale;
            }
            if (this.goalCeo && this.goalCeo.AutoValutazioneFinale != 0 && this.goalCeo.AutoValutazioneFinale != null) {
                anon0++;
                tota += this.goalCeo.AutoValutazioneFinale;
            }
            if (this.goalCeo && this.goalCeo.ValutazioneFinale != 0 && this.goalCeo.ValutazioneFinale != null) {
                vnon0++;
                totv += this.goalCeo.ValutazioneFinale;
            }
            if (this.goalCeoit && this.goalCeoit.AutoValutazioneFinale != 0 && this.goalCeoit.AutoValutazioneFinale != null) {
                anon0++;
                tota += this.goalCeoit.AutoValutazioneFinale;
            }
            if (this.goalCeoit && this.goalCeoit.ValutazioneFinale != 0 && this.goalCeoit.ValutazioneFinale != null) {
                vnon0++;
                totv += this.goalCeoit.ValutazioneFinale;
            }

            if (anon0 > 0) {
                this.aSuggest = Math.floor(tota / anon0);
            }
            if (vnon0 > 0) {
                this.vSuggest = Math.floor(totv / vnon0);
            }
        },
        save: function(status) {
            // aggiungere ciclo for per calcolo totale
            var numero_obiettivi = this.goalInd.length;
            var peso = 0;

            for (let i = 0; i < numero_obiettivi; i++) {
                peso = peso + this.goalInd[i].Peso;
            }

            //            if (this.goalInd[0].Peso + this.goalInd[1].Peso + this.goalInd[2].Peso == 100 ||
            //                this.goalInd[0].Peso + this.goalInd[1].Peso + this.goalInd[2].Peso == 0 ||
            if (peso == 100 || peso == 0 || this.stato > 5) {
                this.everything = [];
                this.everything.push(this.goalCascading[0]);
                this.everything.push(this.goalCascading[1]);
                this.everything.push(this.goalCascading[2]);
                this.everything.push(this.goalCascading[3]);

                // modificare per calcolo dinamico
                for (let i = 0; i < numero_obiettivi; i++) {
                    this.everything.push(this.goalInd[i]);
                }

                this.everything.push(this.goalPres);
                this.everything.push(this.goalCeo);
                this.everything.push(this.goalCeoit);

                if (status != null) {
                    this.schedaVal.do_updated = -1;
                    try {
                        status = parseInt(status);
                    } catch(err){}
                    this.schedaVal.IDStato = status;
                }
                this.modified = false;

                var json = {
                    JsonTestata: this.schedaVal,
                    JsonDettaglio: this.everything
                }

                this.$http.post(localStorage.getItem("path")+"/APIUPDATEVALUTAZIONE", JSON.stringify(json)).then((response) => {
                    
                    if(status != null){
                        localStorage.removeItem("changingStatus");
                        //localStorage.setItem("testStatus", status);
                        localStorage.setItem("newStatus", -1);
                        location.reload();  
                    }
                    
                    this.goalCascading[0].do_updated = 0;
                    this.goalCascading[1].do_updated = 0;
                    this.goalCascading[2].do_updated = 0;
                    this.goalCascading[3].do_updated = 0;

                    // modifica con ciclo for
                    for (let i = 0; i < numero_obiettivi; i++) {
                        this.goalInd[i].do_updated = 0;
                    }

                    this.goalPres.do_updated = 0;
                    this.goalCeo.do_updated = 0;
                    this.goalCeoit.do_updated = 0;

                    //location.reload()
                }, (err) => {
                    console.log(err);

                    this.goalCascading[0].do_updated = 0;
                    this.goalCascading[1].do_updated = 0;
                    this.goalCascading[2].do_updated = 0;
                    this.goalCascading[3].do_updated = 0;

                    // modifica con ciclo for
                    for (let i = 0; i < numero_obiettivi; i++) {
                        this.goalInd[i].do_updated = 0;
                    }

                    this.goalPres.do_updated = 0;
                    this.goalCeo.do_updated = 0;
                    this.goalCeoit.do_updated = 0;

                    eventBus.$emit('alert', this.strings.alertSave[this.itaEng01]);
                });
            } else {
                eventBus.$emit('alert', this.strings.alertPerc[this.itaEng01]);
            }

        },
        getMeta: function(idscheda) {
            this.admin = this.admin && Base64.decode(this.$route.params.ruolo) == "Admin";
            var string;
            var v = localStorage.getItem("idpersona");
            var t = (localStorage.getItem("testing") == 1)
            var path = localStorage.getItem("path");

            if (this.valutatore == true) {
                string = '/APILISTAVALUTAZIONI?ID=' + idscheda + "&IDValutatore=" + v;
            } else if (this.valutatore == false) {
                string = '/APILISTAVALUTAZIONI?ID=' + idscheda + "&IDValutato=" + v;
            } else if (this.admin) {
                string = '/APILISTAVALUTAZIONI?ID=' + idscheda;
            }
            this.$http.get(path + '' + string).then((response) => {
                var res = response.body;
                try{
                    res = JSON.parse(response.body);
                } catch(err) {};

                if (res && res.APILISTAVALUTAZIONI) {
                    res = res.APILISTAVALUTAZIONI[0];
                    this.schedaVal = res;
                    var st = this.schedaVal.IDStato;
                    var pass = this.$root.getPermessi();
                    if(!this.admin){
                    
                        if(this.valutatore == true){
                            pass = pass.valutatore;
                        } else {
                            pass = pass.valutato;
                        }
                        var vm = this;
                        var x = pass.some(function(p){
                            if(p.id == st){
                                vm.permessi = p.permessi;
                                return true;
                            }
                            return false
                        });

                    } else {
                        
                        pass = pass.supervisore;
                        var vm = this;
                        var x = pass.some(function(p){
                            if(p.id == st){
                                vm.permessi = p.permessi;
                                return true;
                            }
                            return false
                        });
                    }
                    console.log(this.permessi);
                    this.stato = st;
                    
                    if (localStorage.getItem("testStatus") != null) {
                        this.stato = parseInt(localStorage.getItem("testStatus"));
                        localStorage.removeItem("testStatus");
                    }
                    this.getJSON(idscheda);
                    
                } else {
                    if(localStorage.getItem("newStatus") == -1){
                        localStorage.removeItem("newStatus");
                        eventBus.$emit('alert', this.strings.alertStat[this.itaEng01]);
                    } else {
                        console.log("here")
                        eventBus.$emit('alert', this.strings.alertAcc[this.itaEng01]);
                    }
                    this.$router.replace({
                        path: '/'
                    })
                }
            }, (err) => {
                console.log("caught get valutazione");
                console.log(err);
                eventBus.$emit('alert', this.strings.alertAcc[this.itaEng01]);
                this.$router.replace({
                    path: '/'
                })
            });
        },
        getJSON: function(idValutazione) {
            var id;
            var t = (localStorage.getItem("testing") == 1)
            var path = localStorage.getItem("path");

            if (idValutazione != null) {
                id = idValutazione;
                this.$http.get(path +
                    '/APIKPIVALUTAZIONE?IDValutazione=' + id).then((response) => {
                    var res = response.body;
                    try{
                        res = JSON.parse(response.body);
                    } catch(err) {};

                    if (res && res.APIKPIVALUTAZIONE) {
                        res = res.APIKPIVALUTAZIONE;
                        res.sort(function(a, b) {
                            return a.Sequenza - b.Sequenza;
                        });
                        this.everything = res;
                        this.fetchEverything();
                    } else {
                        eventBus.$emit('alert', this.strings.alertKpi[this.itaEng01]);
                        this.$router.replace({
                            path: '/'
                        })
                    }
                }, (err) => {
                    console.log("caught get dettaglio valutazione");
                    console.log(err);
                    eventBus.$emit('alert', this.strings.alertAcc[this.itaEng01]);
                    this.$router.replace({
                        path: '/'
                    })
                });
            } else {
                eventBus.$emit('alert', this.strings.alertAcc[this.itaEng01]);
                this.$router.replace({
                    path: '/'
                })
            }
        },
        fetchEverything: function() {
            // calcola numero di obiettivi
            var howManyCasc = 0;
            for(var i = 0; i < this.everything.length; i++){
                if(this.everything[i].Modificabile == null){
                    howManyCasc++;
                } else {
                    break;
                }
            }

            var o = 0;
            for (let i = 0; i < this.everything.length; i++) {
                if (this.everything[i].Modificabile == -1) {
                    o++;
                    this.goalInd.push(this.everything[i]);
                }
            }

            for (var i = 0; i < howManyCasc; i++) {
                this.goalCascading.push(this.everything[i]);      
            }

            this.goalPres = this.everything[howManyCasc + o];
            this.goalCeo = this.everything[howManyCasc + o + 1];
            this.goalCeoit = this.everything[howManyCasc + o + 2];
            this.loading = false;

            this.calcolaMedia();
        }
    },

    // COMPUTED PROPS SHARED BY SUB-COMPONENTS

    computed: {
        disableMineMT: function() {
            return (this.permessi.Autovalutazione_mp != "mod");
        },
        disableValMT: function() {
            return (this.permessi.Valutazione_mp != "mod");
        },
        disableMineF: function() {
            return (this.permessi.Autovalutazione_f != "mod");
        },
        disableValF: function() {
            return (this.permessi.Valutazione_f != "mod");
        },
        noteMineMT: function() {
            if (this.permessi.Note_vto_mp == "mod") {
                return 2;
            }
            if (this.permessi.Note_vto_mp == "vis") {
                return 1;
            }
            return 0;
        },
        noteValMT: function() {
            if (this.permessi.Note_vre_mp == "mod") {
                return 2;
            }
            if (this.permessi.Note_vre_mp == "vis") {
                return 1;
            }
            return 0;
        },
        noteMineF: function() {
            if (this.permessi.Note_vto_f == "mod") {
                return 2;
            }
            if (this.permessi.Note_vto_f == "vis") {
                return 1;
            }
            return 0;
        },
        noteValF: function() {
            if (this.permessi.Note_vre_f == "mod") {
                return 2;
            }
            if (this.permessi.Note_vre_f == "vis") {
                return 1;
            }
            return 0;
        },
        rendMineMT: function() {
            return this.permessi.Autovalutazione_mp != null;
        },
        rendValMT: function() {
            return this.permessi.Valutazione_mp != null;
        },
        rendMineF: function() {
            return this.permessi.Autovalutazione_f != null;;
        },
        rendValF: function() {
            return this.permessi.Valutazione_f != null;
        }
    }
}
</script>
<style scoped>
#content {
    background-color: #666;
}
</style>
<style>
.six {
    padding-left: 0px !important;
    padding-right: 20px !important;
}
@media (max-width: 768px) {
    .six {
        padding-right: 0px !important;
    }
}
</style>
