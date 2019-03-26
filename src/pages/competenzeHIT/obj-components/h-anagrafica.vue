<template>
    <div>
        <div style="float: right; text-align: center; font-size: 1.4rem; margin-bottom: 20px;">
            <div style="float:right; max-width: 200px;">
                <img :src="$root.getPermessi().upperImage" 
                :class="'img-rounded width-'+$root.getPermessi().upperSize" 
                style="margin-bottom: 20px;">
            </div>
            <div class="hidden-lg" style="float: left;">
                <div class="panel panel-default" style="padding:10px; text-align: center; font-size: 1.4rem; margin-bottom: 10px;">
                    <span><span class="h-label">{{s.periodoValutazione[l]}}</span>
                    <br class="visible-xs">{{periodo}}</span>
                </div>
                <div v-if="statsReady" class="panel panel-default hidden-lg ignorePDF">
                    <ul class="list-group" style="font-size: 13px;">
                        <li v-for="(s, index) in stati" class="list-group-item stat" @click="up(s.stato, index)"
                        :class="{'active': stato== s.stato, disabled: stato!=s.stato && !tab_stati[index].allowed, 'printden': stato!= s.stato}">{{s.descrizione}}</li>
                    </ul>
                </div>
            </div>
            <div class="visible-lg" style="position:absolute; right: 0px; top: 100px; margin-right: 20px;">
                <div class="panel panel-default" style="padding:10px; text-align: center; font-size: 1.4rem; margin-bottom:0px;">
                    <span><span class="h-label">{{s.periodoValutazione[l]}}</span>
                    <br class="visible-xs">{{periodo}}</span>
                </div>
            </div>
            <div v-if="statsReady" id="statusPanel" class="visible-lg ignorePDF" style="position: absolute; top: 140px; right: 0px; text-align: right; padding: 10px 20px; font-size: 13px;">
                <ul class="list-group" style="font-size: 13px;">
                    <li v-for="(s, index) in stati" class="list-group-item stat" :class="{'active': stato== s.stato, disabled: stato!=s.stato && !tab_stati[index].allowed, 'printden': stato!= s.stato}" @click="up(s.stato, index)">{{s.descrizione}}</li>
                </ul>
            </div>
            <div class="item col-xs-12 col-lg-7 h-container">
                <div class="panel-header h-header">
                    <h3 class="text-headline panel-title">{{titolo_scheda}}</h3>
                </div>
                <br>

                <div v-if="ready" class="col-xs-12 col-sm-4 col-lg-12">
                    <img class="img-circle width-140" :src="avatar" onerror="src = 'images/profile-photo_small.png'">
                </div> 

                <div class="col-xs-12 col-sm-8 col-lg-12 panel-body h-body">
                    <h5 class="text-headline" style="margin: 5px 0px;">{{società}}</h5>
                    <div class="row">
                        <!-- CARD con dettagli Goal -->
                        <div class="col-xs-12">
                            <li class="col-xs-5 col-md-4 list-group-item media v-middle">
                                <div class="media-body"><span class="text-subhead h-label print_border">{{s.nomeCognome[l]}}</span></div>
                            </li>
                            <li class="col-xs-7 col-md-8 list-group-item media v-middle print_border">
                                <div class="media-body dx"><span class="text-subhead">{{nome}}</span></div>
                            </li>
                            
                            <li v-if="$root.getPermessi().showLevel" class="col-xs-5 col-md-4 list-group-item media v-middle">
                                <div class="media-body"><span class="text-subhead h-label">{{s.funzione[l]}}</span></div>
                            </li>
                            <li v-if="$root.getPermessi().showLevel" class="col-xs-7 col-md-8 list-group-item media v-middle">
                                <div class="media-body dx"><span class="text-subhead">{{funzione}}</span></div>
                            </li>

                            <li v-if="$root.getPermessi().showUO" class="col-xs-5 col-md-4 list-group-item media v-middle">
                                <div class="media-body"><span class="text-subhead h-label">{{s.uo[l]}}</span></div>
                            </li>
                            <li v-if="$root.getPermessi().showUO" class="col-xs-7 col-md-8 list-group-item media v-middle">
                                <div class="media-body dx"><span class="text-subhead">{{uo}}</span></div>
                            </li>
                            
                            <li class="col-xs-5 col-md-4 list-group-item media v-middle print_border">
                                <div class="media-body"><span class="text-subhead h-label">{{s.responsabile[l]}}</span></div>
                            </li>
                            <li class="col-xs-7 col-md-8 list-group-item media v-middle print_border">
                                <div class="media-body dx"><span class="text-subhead">{{responsabile}}</span></div>
                            </li>
                        </div>
                    </div>
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

export default {
    mounted: function() {
        this.initTabs();
        this.$nextTick(function() {
            this.init();
        })
    },
    components: {
        sidejsonly
    },
    props: {
        stato: Number,
        valutatore: Boolean
    },
    data: function() {
        return {
            s: this.$parent.strings,
            l: this.$parent.itaEng01,
            a: this.$parent.schedaVal,

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
            stati: this.$root.getStatus(),

            tab_stati: [],

            allowed: [],
            statsReady: false,
            ready: false,
        }
    },
    watch: {},
    methods: {
        initTabs: function(){
            this.tab_stati = [];
            for(var i = 0; i < this.stati.length; i++){
                this.tab_stati.push({
                    id: this.stati[i].stato,
                    allowed: false
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
            console.log(this.a)
            this.nome = this.a.Valutato;
            this.funzione = this.a.NomeRuolo;
            this.uo = this.a.NomeUO;
            this.società = this.a.Societa;
            this.titolo_scheda = this.a.DescrizioneScheda;

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
                    this.periodo = this.s.months[mi][this.l] + " " + i.getFullYear() + " - " + this.s.months[mf][this.l] + " " + f.getFullYear();
                }
            } catch (err) {
                console.log(err);
            }
        },
        up: function(status, index) {
            if(this.tab_stati[index].allowed){
                console.log(this.tab_stati[index].allowed)
                this.$emit('changeStatus', status);
            } else {
                console.log(this.tab_stati[index].allowed)
            }
        },
        getTabStati: function() {
            if (!this.admin) {
                var isv = this.valutatore ? 'Valutatore' : 'Valutato';

                this.$http.get(localStorage.getItem("path") +
                    '/APISTATIVALUTAZIONE?IDValutazione=' + this.a.ID + "&StatoIniziale=" + this.stato + "&Ruolo=" + isv).then((response) => {

                    var res = response.body;
                    try {
                        res = JSON.parse(response.body);
                    } catch (err) {};

                    if (res != null && res.APISTATIVALUTAZIONE != null) {
                        res = res.APISTATIVALUTAZIONE;
                        var counter = 0;
                        for (var i = 0; i < res.length; i++) {
                            if(isv == res[i].Ruolo){
                                for (var ii = 0; ii < this.tab_stati.length; ii++) {
                                    if (this.tab_stati[ii].id == res[i].StatoFinale) {
                                        this.tab_stati[ii].allowed = true;
                                        counter++;
                                        break;
                                    }
                                }
                            }
                        }
                        console.log(this.tab_stati)
                    }

                    /*
                    this.tab_stati.sort(function(a, b) {
                        return a.id - b.id;
                    })
                    */

                    this.statsReady = true;
                }, (err) => {

                    var t = (localStorage.getItem("testing") == 1);
                    if (t) {
                        if (this.valutatore) {
                            if (this.stato != 5) {
                                this.tab_stati[1].allowed = true;
                            }
                            if (this.stato != 6) {
                                this.tab_stati[2].allowed = true;
                            }
                            if (this.stato != 9) {
                                this.tab_stati[5].allowed = true;
                            }
                            if (this.stato != 12) {
                                this.tab_stati[8].allowed = true;
                            }
                        } else {
                            if (this.stato == 9) {
                                this.tab_stati[3].allowed = true;
                            }
                            if (this.stato != 9) {
                                this.tab_stati[5].allowed = true;
                            }
                        }

                        this.tab_stati.sort(function(a, b) {
                            return a.id - b.id;
                        })
                    } else {
                        console.log("caught get stati");
                        console.log(err);
                    }

                    this.statsReady = true;

                });
            } else {
                for (var i = 0; i < this.tab_stati.length; i++) {
                    this.tab_stati[i].allowed = true;
                }
                this.statsReady = true;
            }
        }
    }
}
</script>
<style>
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
</style>
