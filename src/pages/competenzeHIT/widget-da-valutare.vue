<template>
    <div>
        <div v-if="loading" class='uil-rolling-css' style='transform:scale(0.5); margin: 0 auto; top: 100px; right: 0px; left: 0px;'>
            <div>
                <div></div>
                <div></div>
            </div>
        </div>
        <div v-if="ready">
            <div v-if="filtro==null" class="row">
                <div v-if="valutatore==true" class="col-xs-8">
                    <h4 class="text-headline margin-none">
                {{s.valV[l]}}<span class="badge">{{quantisono}}</span></h4>
                    <p class="text-subhead text-light">{{s.valS[l]}}</p>
                </div>
                <div v-else="valutatore==true" class="col-xs-8">
                    <h4 class="text-headline margin-none">
                {{s.mieV[l]}}<span class="badge">{{quantisono}}</span></h4>
                    <p class="text-subhead text-light">{{s.mieS[l]}}</p>
                </div>
                <div class="col-xs-4">
                    <paginazione v-if="valutatore" :array="valutazioni" @displayChanged="dispatchedPagination($event)" :limit="20">
                    </paginazione>
                    <paginazione v-else :array="valutazioni" @displayChanged="dispatchedPagination($event)" :limit="1">
                    </paginazione>
                </div>
            </div>
            <div id="myrequests" class="panel panel-default paper-shadow animated" data-z="0.5" style="overflow-y: auto;" :class="{'noBot': filtro!=null}">
                <div>
                    <ul v-if="valutazioni.length > 0" class="list-group" style="margin: 0px;">
                        <transition-group name="roll-fade">
                            <li class="list-group-item media v-middle" v-for="(v, index) in displayval" :key="index">
                                <div class="media-left">
                                    <img :src="v.avatar" class="img-circle width-70" onerror="this.src = 'images/profile-photo_small.png'" />
                                </div>
                                <div class="media-body">
                                    <h4>{{v.valutato}}</h4>
                                    <h5 style="margin-top: 5px;">{{s.responsabile[l] + " : "}} {{v.valutatore}}</h5>
                                    <hr style="margin: 5px 0px;">
                                    <h4 style="margin: 0px;">{{v.nomeModello}}</h4>
                                    <h5 style="margin-top: 5px;"><strong>{{s.stato[l] + ": "}}</strong>{{v.descrizione}}</h5>
                                </div>
                                <div class="media-right">
                                    <button class="btn btn-sm btn-primary paper-shadow relative" @click="goDetail(v.id)">{{s.dettaglio[l]}}</button>
                                </div>
                            </li>
                        </transition-group>
                    </ul>
                    <div v-else class="panel panel-default" style="margin: 0px;">
                        <div class="panel-body" style="border-bottom: 1px solid rgb(238, 238, 238);">Nessuna valutazione è stata rilevata</div>
                    </div>
                </div>
            </div>
            <div v-if="filtro!=null" class="row">
                <div class="col-xs-6 col-md-4 col-xs-offset-6 col-md-offset-8">
                    <paginazione :array="valutazioni" @displayChanged="dispatchedPagination($event)" :limit="10">
                    </paginazione>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import paginazione from "../components/paginazione.vue";

export default {
    mounted: function() {
        this.$nextTick(function() {
            this.valutazioni = [];
            if (this.filtro != null) {} else if (this.valutatore != true) {
                this.initMines();
            } else {
                this.initOthers();
            }
        });
    },
    components: {
        paginazione
    },
    props: {
        valutatore: Boolean,
        filtro: Object,
        flagFilter: Boolean
    },
    data: function() {
        return {
            s: this.$root.getStrings(),
            l: this.$root.lang(),
            listaStati: this.$Stati,

            ready: false,
            quantisono: 0,
            valutazioni: [],
            displayval: [],

            statIndex: this.$root.getStatus(),

            loading: false
        }
    },
    watch: {
        flagFilter: function() {
            this.filtraValutazioni();
        }
    },
    methods: {
        dispatchedPagination: function(toDisplay) {
            this.displayval = toDisplay;
        },
        initMines: function() {
            var id = localStorage.getItem("idpersona");

            this.$http.get(localStorage.getItem("path") +
                '/APILISTAVALUTAZIONI?IDValutato=' + id + "&TipoValutazione=KPI 2&RuoloAutorizzazione=Valutato").then((response) => {
                var res = response.body;
                try {
                    res = JSON.parse(response.body);
                } catch (err) {};

                if (res && res.APILISTAVALUTAZIONI) {
                    res = res.APILISTAVALUTAZIONI;
                    this.valutazioni = [];
                    for (var i = 0; i < res.length; i++) {

                        this.valutazioni.push({
                            id: res[i].ID,
                            valutato: res[i].Valutato,
                            valutatore: res[i].Valutatore,
                            stato: res[i].IDStato,
                            descrizione: res[i].Descrizione,
                            nomeModello: res[i].DescrizioneModello,
                            avatar: localStorage.getItem('path') + "/" + res[i].NomeFileFoto
                        })
                    }
                    this.quantisono = this.valutazioni.length;
                    this.transStatus()
                }
                this.ready = true;
            }, (err) => {
                console.log(err)
                this.ready = true;
            });
        },
        initOthers: function() {
            var id = localStorage.getItem("idpersona");
            
            var path = localStorage.getItem("path");
            this.$http.get(path +
                '/APILISTAVALUTAZIONI?IDValutatore=' + id + "&TipoValutazione=KPI 2&RuoloAutorizzazione=Valutatore").then((response) => {
                var res = response.body;
                try {
                    res = JSON.parse(response.body);
                } catch (err) {};

                if (res && res.APILISTAVALUTAZIONI) {
                    res = res.APILISTAVALUTAZIONI;
                    this.valutazioni = [];

                    for (var i = 0; i < res.length; i++) {
                        this.valutazioni.push({
                            id: res[i].ID,
                            valutato: res[i].Valutato,
                            valutatore: res[i].Valutatore,
                            stato: res[i].IDStato,
                            descrizione: res[i].Descrizione,
                            nomeModello: res[i].DescrizioneModello,
                            avatar: path + "/" + res[i].NomeFileFoto
                        })
                    }
                    if (this.valutazioni.length > 0) {
                        this.quantisono = this.valutazioni.length;
                    }
                    this.transStatus()
                }
                this.ready = true;
            }, (err) => {
                console.log("caught lista valutazioni valutatore");
                console.log(err);
                this.ready = true;
            });
        },
        filtraValutazioni: function() {
            this.loading = true;
            this.ready = false;
            var f = this.filtro;
            var filters = ['TipoValutazione=KPI 2'];
            if (f.cognome.trim() != "") {
                filters.push('CognomePersona=' + f.cognome);
            }
            if (f.nome.trim() != "") {
                filters.push('NomePersona=' + f.nome);
            }
            if (f.responsabile.trim() != "") {
                filters.push('Valutatore=' + f.responsabile);
            }
            filters.push('IDRuolo=' + f.funzione);
            if (f.stato != 0) {
                filters.push('IDStato=' + f.stato)
            }
            filters = filters.join('&');

            this.valutazioni = [];
            this.$http.get(localStorage.getItem("path") +
                '/APILISTAVALUTAZIONI?' + filters+"&RuoloAutorizzazione=Supervisore").then((response) => {
                var res = response.body;
                try {
                    res = JSON.parse(response.body);
                } catch (err) {};

                if (res && res.APILISTAVALUTAZIONI) {
                    res = res.APILISTAVALUTAZIONI;

                    for (var i = 0; i < res.length; i++) {
                        this.valutazioni.push({
                            id: res[i].ID,
                            valutato: res[i].Valutato,
                            valutatore: res[i].Valutatore,
                            stato: res[i].IDStato,
                            descrizione: res[i].Descrizione,
                            nomeModello: res[i].DescrizioneModello,
                            avatar: localStorage.getItem("path") + "/" + res[i].NomeFileFoto,
                            ruolo: res[i].NomeRuolo
                        })
                    }
                    this.quantisono = this.valutazioni.length;
                    this.transStatus()
                }
                this.loading = false;
                this.ready = true;
            }, (err) => {
                this.loading = false;
                this.ready = true;
            });
        },
        transStatus: function() {
            if (this.l > 0) {
                for (var i = 0; i < this.valutazioni.length; i++) {
                    for (var ii = 0; ii < this.listaStati.length; ii++) {
                        if (this.valutazioni[i].stato == this.listaStati[ii].IDStato) {
                            this.valutazioni[i].descrizione = this.listaStati[ii].Descrizione;
                            break;
                        }
                    }
                }
            }
        },
        goDetail: function(id) {
            var v = this.valutatore == true ? 'Valutatore' : 'Valutato';
            if (this.filtro != null) {
                v = "Admin";
            }
            v = Base64.encode('' + v);
            this.$router.push({
                name: 'scheda-impiegato',
                params: {
                    idscheda: id,
                    ruolo: v
                }
            })
        }
    }
}
</script>
<style scoped>
.noBot {
    margin-bottom: 0px;
}
</style>
