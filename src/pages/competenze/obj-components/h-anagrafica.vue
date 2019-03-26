<template>
    <div>
        <div style="float: right; text-align: center; font-size: 1.4rem; margin-bottom: 20px; width: 100%">
            <div class="hidden-lg" style="float:right; max-width: 200px;">
                <img :src="$root.getPermessi().upperImage" 
                :class="'img-rounded width-'+$root.getPermessi().upperSize" 
                style="margin-bottom: 20px; margin-left: 5px;">
            </div>
            <div class="hidden-lg" style="float: left;">
                <div class="panel panel-default" style="padding:10px; text-align: center; font-size: 1.4rem; margin-bottom: 10px;">
                    <span><span class="h-label">{{s.periodoValutazione[l]}}</span>
                    <br class="visible-xs">{{periodo}}</span>
                </div>
                <div v-if="statsReady" class="panel panel-default hidden-lg ignorePDF" style="z-index: 0">
                    <ul class="list-group" style="font-size: 13px;">
                        <li v-for="(s, index) in stati" class="list-group-item stat" @click="up(s.IDStato, index)"
                        :class="{'active': stato== s.IDStato, disabled: stato!=s.IDStato && !tab_stati[index].allowed, 'printden': stato!= s.IDStato}">{{s.Descrizione}}</li>
                    </ul>
                </div>
            </div>
            <!--
            <div class="visible-lg" style="position:absolute; right: 0px; top: 100px; margin-right: 20px;">
                <div class="panel panel-default" style="padding:10px; text-align: center; font-size: 1.4rem; margin-bottom:0px;">
                    <span><span class="h-label">{{s.periodoValutazione[l]}}</span>
                    <br class="visible-xs">{{periodo}}</span>
                </div>
            </div>
            <div v-if="statsReady" id="statusPanel" class="visible-lg ignorePDF" 
            style="position: absolute; top: 140px; right: 0px; text-align: right; padding: 10px 20px; font-size: 13px; z-index: 0">
                <ul class="list-group" style="font-size: 13px;">
                    <li v-for="(s, index) in stati" class="list-group-item stat" @click="up(s.IDStato, index)"
                        :class="{'active': stato== s.IDStato, disabled: stato!=s.IDStato && !tab_stati[index].allowed, 'printden': stato!= s.IDStato}">{{s.Descrizione}}</li>
                </ul>
            </div>
            -->
            <div class="item col-xs-12 col-lg-7 h-container">
                <div class="hidden-lg printden" style="display: block;margin-bottom: 10px;position: relative;">
                    <a href="#" @click.prevent="openGuideline()" 
                    style="font-size: smaller; text-decoration: underline;">download guidelines</a>
                </div>
                <div class="panel-header h-header">
                    <h3 class="text-headline panel-title">{{titolo_scheda}}</h3>
                </div>
                <br>
                
                <toast :show="showToast" :message="toast" class="printden"></toast>

                <div v-if="ready" class="col-xs-12 row" style="margin: 0px;">
                    <div class="col-xs-12 col-sm-4 print_avatar" style="padding: 0px;">
                        <img class="img-circle width-140"
                        :src="avatar" onerror="src = 'images/profile-photo_small.png'">
                    </div>
                    <div class="hidden-xs col-sm-8" style="text-align: left;">
                        <h3 style="padding: 5px; color: #42a5f5">{{nome}}</h3>
                        <div style="padding: 5px;">{{funzione}}</div>
                        <div style="padding: 5px;">{{uo}}</div>
                    </div>
                    <div class="col-xs-12 visible-xs-block" style="text-align: center;">
                        <h3 style="padding: 5px; color: #42a5f5">{{nome}}</h3>
                        <div style="padding: 5px;">{{funzione}}</div>
                        <div style="padding: 5px;">{{uo}}</div>
                    </div>
                </div> 

                <div class="col-xs-12 panel-body h-body" style="padding-top: 15px;">
                    <!-- <h5 class="text-headline" style="margin: 5px 0px;">{{società}}</h5> -->
                    <div class="row">
                        <!-- CARD con dettagli Goal -->
                        <div class="col-xs-12">
                           
                            <li class="col-xs-5 col-md-4 list-group-item media v-middle print_border">
                                <div class="media-body"><span class="text-subhead h-label">{{s.responsabile[l]}}</span></div>
                            </li>
                            <li class="col-xs-7 col-md-8 list-group-item media v-middle print_border">
                                <div class="media-body"><span class="text-subhead">{{responsabile}}</span></div>
                            </li>

                            <li v-if="evalValutatoreAggiuntivo1 == 'mod' || (evalValutatoreAggiuntivo1 == 'vis' && v_a_1.id != null)" 
                            class="list-group-item media v-middle print_border"
                            :class="[evalValutatoreAggiuntivo1 == 'mod' ? 'col-xs-12' : 'col-xs-5 col-md-4']">
                                <div class="media-body">
                                    <span v-if="evalValutatoreAggiuntivo1 == 'vis'" class="text-subhead h-label">{{s.VA[l] + " 1"}}</span>
                                    <span v-else class="text-subhead h-label"><strong>{{s.selectVA[l] + " 1:"}}</strong></span>
                                </div>
                            </li>
                            <li v-if="evalValutatoreAggiuntivo1 == 'mod' || (evalValutatoreAggiuntivo1 == 'vis' && v_a_1.id != null)"
                            class="list-group-item media v-middle print_border bless"
                            :class="[evalValutatoreAggiuntivo1 == 'mod' ? 'col-xs-12' : 'col-xs-7 col-md-8', failed.v1 ? 'mandatory_failed' : '']"
                            :style="[evalValutatoreAggiuntivo1 == 'mod' ? {padding: '0px', height: 'auto'} : {}]">
                                <div v-if="evalValutatoreAggiuntivo1 == 'vis'" class="media-body"><span class="text-subhead">{{v_a_1.nome}}</span></div>
                                <vue-select v-else-if="people != null" label="COGNOME" 
                                    :selectedStyle="{'margin-right': '30px', float: 'right', 'font-size': '1.1rem', background: 'none', 'border-style': 'none'}" 
                                    :inputStyle="inputStyleSelect"
                                    :getOptionLabel="optionLabel" :options="people" v-model="v_1_full" 
                                    :placeholder="s.nominaVA[l]" :nothing="s.nothingFound[l]"
                                    :conditionalRender="conditionalRender([v_a_2.id, a.IDValutatore])"></vue-select>
                                <div v-else class="spin" style="text-align: center; padding-top: 5px;">
                                    <clip-loader :loading="people == null" :color="'rgb(93, 197, 150)'" size="24px"></clip-loader>
                                </div>
                            </li>


                            <li v-if="evalValutatoreAggiuntivo2 == 'mod' || (evalValutatoreAggiuntivo2 == 'vis' && v_a_2.id != null)"
                            class="list-group-item media v-middle print_border"
                            :class="[evalValutatoreAggiuntivo2 == 'mod' ? 'col-xs-12' : 'col-xs-5 col-md-4']">
                                <div class="media-body">
                                    <span v-if="evalValutatoreAggiuntivo2 == 'vis'" class="text-subhead h-label">{{s.VA[l] + " 2"}}</span>
                                    <span v-else class="text-subhead h-label"><strong>{{s.selectVA[l] + " 2:"}}</strong></span>
                                </div>
                            </li>
                            <li v-if="evalValutatoreAggiuntivo2 == 'mod' || (evalValutatoreAggiuntivo2 == 'vis' && v_a_2.id != null)"
                            class="list-group-item media v-middle print_border bless"
                            :class="[evalValutatoreAggiuntivo2 == 'mod' ? 'col-xs-12' : 'col-xs-7 col-md-8', failed.v2 ? 'mandatory_failed' : '']"
                            :style="[evalValutatoreAggiuntivo2 == 'mod' ? {padding: '0px', height: 'auto'} : {}]">
                                <div v-if="evalValutatoreAggiuntivo2 == 'vis'" class="media-body"><span class="text-subhead">{{v_a_2.nome}}</span></div>
                                <vue-select v-else-if="people != null" label="COGNOME" 
                                    :selectedStyle="{'margin-right': '30px', float: 'right', 'font-size': '1.1rem', background: 'none', 'border-style': 'none'}"
                                    :inputStyle="inputStyleSelect"
                                    :getOptionLabel="optionLabel" :options="people" v-model="v_2_full" 
                                    :placeholder="s.nominaVA[l]" :nothing="s.nothingFound[l]"
                                    :conditionalRender="conditionalRender([v_a_1.id, a.IDValutatore])"></vue-select>
                                <div v-else class="spin" style="text-align: center; padding-top: 5px;">
                                    <clip-loader :loading="people == null" :color="'rgb(93, 197, 150)'" size="24px"></clip-loader>
                                </div>
                            </li>
                        </div>
                    </div>
                </div>
            </div>
            <div class="visible-lg-block col-lg-5" style="text-align: right;">
                <div class="visible-lg-inline printden" style="float: left;">
                    <a href="#" @click.prevent="openGuideline()" 
                    style="font-size: smaller; text-decoration: underline;">download guidelines</a>
                </div>
                <div>
                    <img :src="$root.getPermessi().upperImage" 
                    :class="'img-rounded width-'+$root.getPermessi().upperSize" 
                    style="margin-bottom: 20px; margin-left: 5px;">
                </div>
                <div>
                    <div class="panel panel-default" style="padding:10px; text-align: center; font-size: 1.4rem; margin-bottom:0px;">
                        <span><span class="h-label">{{s.periodoValutazione[l]}}</span>
                        <br class="visible-xs">{{periodo}}</span>
                    </div>
                </div>
                <div v-if="statsReady" id="statusPanel" class="visible-lg ignorePDF" 
                style="text-align: right; padding: 10px 0px; font-size: 13px; z-index: 0; float: right;">
                    <ul class="list-group" style="font-size: 13px;">
                        <li v-for="(s, index) in stati" class="list-group-item stat" @click="up(s.IDStato, index)"
                            :class="{'active': stato== s.IDStato, disabled: stato!=s.IDStato && !tab_stati[index].allowed, 'printden': stato!= s.IDStato}">{{s.Descrizione}}</li>
                    </ul>
                </div>
            </div>
            <sidejsonly :default="false"></sidejsonly>
        </div>
    </div>
</template>
<script>
import {
    eventBus
} from '../../../eventbus.js';

import sidejsonly from "../../components/side-default-jsonly.vue";
import vueSelect from "../../components/vueSelectWrapper/components/Select.vue";
import ClipLoader from 'vue-spinner/src/ClipLoader.vue';

import Toast from '../../_fullDyn/toast.vue';

export default {
    mounted: function() {
        this.initTabs();
        this.$nextTick(function() {
            this.init();
            if(this.permits.NoteCompilazione != null){
                this.toast = this.permits.NoteCompilazione;
                this.showToast = true;
            }
            
        })
    },
    created: function() {
        var vm = this;
        var auth = this.permits;
        eventBus.$on("mandatoryFail", function() { 
            if(vm.$root.isMandatory(auth["ValutatoreAggiuntivo1"])){
                    vm.failed.v1 = (vm.v_a_1 == null || vm.v_a_1.id == null);
            }
            if(vm.$root.isMandatory(auth["ValutatoreAggiuntivo2"])){
                    vm.failed.v2 = (vm.v_a_2 == null || vm.v_a_2.id == null);
            }
        });
        eventBus.$on("mandatoryReset", function() { 
            for(var prop in vm.failed){ vm.failed[prop] = false }
        });
    },
    components: {
        sidejsonly,
        vueSelect,
        ClipLoader,
        Toast
    },
    props: {
        stato: Number,
        valutatore: Boolean,
        approvatore: Boolean
    },
    data: function() {
        return {
            guideline: 'Intro Performance Management Process 2017-2018.pptx',

            s: this.$parent.strings,
            l: this.$parent.itaEng01,
            a: this.$parent.schedaVal,
            permits: this.$parent.permessi,

            admin: this.$parent.admin,

            nome: '',
            funzione: '',
            responsabile: '',
            periodo: '',
            avatar: '',
            società: '',
            titolo_scheda: '',
            uo: '',
            insert: false,
            stati: this.$Stati,

            tab_stati: [],

            allowed: [],
            statsReady: false,
            ready: false,

            v_a_1: {},
            v_a_2: {},
            v_1_full: null,
            v_2_full: null,
            people: null,

            failed: {
                v1: false,
                v2: false
            },
            inputStyleSelect: {
                'padding-right': '30px', 
                'text-align': 'right', 
                'font-size': '1.1rem'
            },

            toast: null,
            showToast: false
        }
    },
    watch: {
        v_1_full: function(){
            if(this.v_1_block != true){
                this.v_a_1.id  = this.v_1_full == null ? null : this.v_1_full.IDPERSONA;
                this.updateFurther()
            } else { this.v_1_block = false}
        },
        v_2_full: function(){
            if(this.v_2_block != true){
                this.v_a_2.id  = this.v_2_full == null ? null : this.v_2_full.IDPERSONA;
                this.updateFurther()
            } else { this.v_2_block = false}
        }
    },
    methods: {
        openGuideline: function(){
            if(this.guideline != null){
                window.open('documenti/' + this.guideline);
            }
        },
        initTabs: function(){
            this.tab_stati = [];
            for(var i = 0; i < this.stati.length; i++){
                this.tab_stati.push({
                    id: this.stati[i].IDStato,
                    allowed: false,
                    mandatory_check: false
                })
            }
        },
        imgErr: function($event) {
            this.avatar = 'images/profile-photo_small.png';
        },
        init: function() {
            this.getAnagraphics();

            this.getTabStati();
        },
        getAnagraphics: function() {
            this.nome = this.a.Valutato;
            this.funzione = this.a.NomeRuolo;
            this.uo = this.a.NomeUO;
            this.società = this.a.Societa;
            this.titolo_scheda = this.a.DescrizioneScheda;
            this.v_a_1 = {
                id: this.a.IDValutatoreAggiuntivo1,
                nome: this.a.Valutatore1
            }
            this.v_a_2 = {
                id: this.a.IDValutatoreAggiuntivo2,
                nome: this.a.Valutatore2
            }
            
            if(this.evalValutatoreAggiuntivo1 == 'mod' ||
                this.evalValutatoreAggiuntivo2 == 'mod'){
                this.loadPeople();
            }

            if (this.l > 0) {
                for (var i = 0; i < this.s.funzioni.length; i++) {
                    if (this.funzione === this.s.funzioni[i][0]) {
                        this.funzione = this.s.funzioni[i][this.l];
                    }
                }
            }

            this.responsabile = this.a.Valutatore;
            this.periodo = this.a.InizioPeriodoValutazione + ' - ' + this.a.FinePeriodoValutazione;
            var t = (localStorage.getItem("testing") == 1)
            var path = localStorage.getItem("path");

            this.avatar = path + "/" + this.a.NomeFileFoto;
            this.ready = true;
            try {
                var i = new Date(this.a.InizioPeriodoValutazione);
                var f = new Date(this.a.FinePeriodoValutazione);
                var mi = i.getMonth();
                var mf = f.getMonth();
                if (mi >= 0 && mi <= 11 && mf >= 0 && mf <= 11) {
                    this.periodo = this.s.months[mi][1] + " " + i.getFullYear() + " - " + this.s.months[mf][1] + " " + f.getFullYear();
                }
            } catch (err) {
                console.log(err);
            }
        },
        up: function(status, index) {
            if(this.tab_stati[index].allowed){
                if(this.tab_stati[index].mandatory_check){
                    this.$emit('mandatoryCheck', status);
                } else {
                    //this.$emit('mandatoryCheck', status);
                    this.$emit('changeStatus', status);
                }
            }
        },
        updateFurther: function(){
            this.$emit('further', { further1: this.v_a_1, further2: this.v_a_2});
        },
        //aggiornamento valutatori aggiuntivi
        getTabStati: function() {
            // interrogo passaggio stati come Approvatore, Valutatore o Valutato
            var role = this.valutatore && this.approvatore ? 'Approvatore' : this.valutatore ? 'Valutatore' : 'Valutato';

            if(this.admin){
                role = 'Supervisore';
            }

            this.$http.get(localStorage.getItem("path") +
                '/APIPASSAGGIOSTATIVALUTAZIONE?IDValutazione=' + this.a.ID + "&StatoIniziale=" + this.stato + "&Ruolo=" + role).then((response) => {

                var res = response.body;
                try {
                    res = JSON.parse(response.body);
                } catch (err) {};

                if (res != null && res.APIPASSAGGIOSTATIVALUTAZIONE != null) {
                    res = res.APIPASSAGGIOSTATIVALUTAZIONE;
                    var counter = 0;
                    for (var i = 0; i < res.length; i++) {
                        if(role == res[i].Ruolo){
                            for (var ii = 0; ii < this.tab_stati.length; ii++) {
                                if (this.tab_stati[ii].id == res[i].StatoFinale) {
                                    this.tab_stati[ii].allowed = true;
                                    this.tab_stati[ii].mandatory_check = res[i].ControlliObbligatorieta == -1;
                                    counter++;
                                    break;
                                }
                            }
                        }
                    }
                    console.log(this.tab_stati)
                }

                this.statsReady = true;
            }, (err) => {
                console.log("Error in get tab stati http req")
                console.log(err)

            });
           
        },
        loadPeople: function(){
            this.$http.get(localStorage.getItem("path") + 'APIPersone?IDPERSONA=.').then((response) => {
                var res = response.body;
                try {
                    res = JSON.parse(response.body);
                } catch (err) {};

                if(res && res.APIPersone){
                    var array = res.APIPersone;
                    if(this.v_a_1.id != null){
                        array.some(function(p){
                            if(p.IDPERSONA == this.v_a_1.id){
                                this.v_1_block = true;
                                this.v_1_full = p;
                                return true;
                            }
                        }, this)
                    }
                    if(this.v_a_2.id != null){
                        array.some(function(p){
                            if(p.IDPERSONA == this.v_a_2.id){
                                this.v_2_block = true;
                                this.v_2_full = p;
                                return true;
                            }
                        }, this)
                    }
                    this.people = array;
                } else {
                    this.people = []
                }
            }, (err) => {
                this.people = []
                console.log("Error getting people list")
                console.log(err)
            })
        },
        optionLabel: function(option){
            return option.COGNOME + " " + option.NOME;
        },
        conditionalRender: function(exclude){
            return function(option){
                var ex = false;
                ex = exclude.some(function(opt){
                    return option.IDPERSONA == opt;
                })
                return !ex;
            }
        }   
    },
    computed: {
        evalValutatoreAggiuntivo1: function(){
            console.log(this.$Ev(this.permits.ValutatoreAggiuntivo1));
            return this.$Ev(this.permits.ValutatoreAggiuntivo1);
        },
        evalValutatoreAggiuntivo2: function(){
            return this.$Ev(this.permits.ValutatoreAggiuntivo2);
        }
    }
}
</script>
<style>
.slide-enter {
    opacity: 0;
}

.slide-enter-active {
    animation: slide-in 0.5s ease-out forwards;
    transition: opacity 0.5s;
}

.slide-leave-active {
    animation: slide-out 0.5s ease-out forwards;
    transition: opacity 0.5s;
    opacity: 0;
    position: absolute !important;
}

.slide-move {
    transition: transform 0.5s;
}

@keyframes slide-in {
    from {
        transform: translateX(-100px);
    }
    to {
        transform: translateX(0px);
    }
}

@keyframes slide-out {
    from {
        transform: translateX(0px);
    }
    to {
        transform: translateX(100px);
    }
}

.bless .dropdown-toggle {
    border-style: none;
}
.bless .dropdown-menu {
    position: relative;
    text-align: right;
    overflow-x: hidden;
}
.bless input,
.bless .spin {
    height: 33px !important;
}

.text-headline {
    font-weight: 300 !important;
}

.text-subhead {
    font-weight: 400 !important;
    font-size: 1.1rem;
}

.h-container {
    padding: 0px;
    border-width: 0px;
    border-top-right-radius: 5px;
    border-top-left-radius: 5px;
    margin-bottom: 20px !important;
}

.h-header {
    color: white;
    background-color: #42a5f5;
    padding: 5px 10px;
    /*
    border-radius: inherit;
    */
}

.h-label {
    font-weight: 500;
    padding-right: 15px;
}

.h-body {
    background-color: rgb(238, 238, 238);
    padding: 0px;
}

textarea:disabled {
    background-color: #ddd;
}
</style>
<style scoped>
.dx {
    text-align: right;
}

.media {
    padding: 5px;
}

.v-middle {
    height: 35px;
    text-align: left;
}

input {
    width: 100%;
    box-sizing: border-box;
    border-width: 0px;
    padding: 1px 10px;
    border-color: darkgray;
    border-radius: 3px;
    text-align: right;
}

input:focus {
    border-width: 1px;
}

.picker {
    height: 25px;
    text-align: left;
    width: inherit;
    margin-left: 5px;
}

li.stat {
    padding: 1px 10px;
    cursor: pointer;
}

li.stat.disabled {
    cursor: no-drop;
}

li.stat.active {
    cursor: default;
}

.mandatory {
    color: #a94442;
    background-color: #f2dede;
    border-color: #ebccd1;
} 

.vue-toast_message {
    position: relative;
    max-width: 100%;
    border-radius: 3px;
    padding: 12px 16px;
    background-color: #cfe8fc;
    color: black;
    font-size: initial;
}
 

</style>
