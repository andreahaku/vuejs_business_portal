<template>
    <div>
        <div class="col-xs-12" style="padding: 0px;">
            <div v-if="!isSearch" class="row">
                <div class="col-xs-8">
                    <span>
                        <h4 class="text-headline margin-none" style="margin-top:2px;">{{s.mieiGoal[l]}}<span class="badge">{{quantisono}}</span></h4>
                    <p class="text-subhead text-light">{{s.subMiei[l]}}</p>
                    </span>
                     <!-- <span v-else>
                        <h4 class="text-headline margin-none" style="margin-top:2px;">{{s.goalDaValutare[l]}}<span class="badge">{{quantisono}}</span></h4>
                    <p class="text-subhead text-light">{{s.subGoal[l]}}</p>
                    </span>  -->
                </div>
                <div v-if="ready" class="col-xs-4">
                    <paginazione :array="mbos" @displayChanged="dispatchedPagination($event)" :limit="5">
                    </paginazione>
                </div>
            </div>
            <div v-if="isSearch && overflow" class="danger" style="margin-bottom: 5px;">
                {{s.erroreRicerca[l]}}
            </div>
            <div v-if="mbos.length > 0" class="panel panel-default paper-shadow">
                <div v-for="mbo in displaymbos" class="panel-body" style="border-bottom: 1px solid #eee; cursor: pointer;" @click="apriDettaglio(mbo)">
                    <div class="media-left" style="padding-top: 0px;">
                        <img :src="path + '/' + mbo.NomeFileFoto" onerror="this.src = 'images/profile-photo_small.png'" class="img-circle width-70" />
                    </div>
                    <div class="media-body">
                        <h4>{{mbo.Valutato}}</h4>
                        <h4 style="margin-top:3px;" class="text-primary"><strong>{{ mbo.DescrizioneScheda }}</strong></h4>
                        <h5 style="margin-top:10px; margin-bottom: 5px;">{{s.periodoDa[l]}} {{ mbo.InizioPeriodoValutazione }} {{s.a[l]}} {{ mbo.FinePeriodoValutazione }}</h5>
                        <h5 style="margin-bottom:4px;" class="margin0"><strong>{{s.responsabile[l]}}:</strong>
                        {{mbo.v_me ? s.tu[l] : mbo.Valutatore}}</h5>
                        <h5 v-if="mbo.Approvatore && mbo.Approvatore!=''" style="margin-bottom:2px;" class="margin0">
                            <strong>{{s.approvatore[l]}}:</strong>
                        {{mbo.a_me ? s.tu[l] : mbo.Approvatore}}</h5>
                        <hr style="margin:5px 0px 5px 0px;">
                        <h5 style="margin-bottom:2px;" class="margin0"><strong>{{s.livello[l]}}:</strong> {{mbo.NomeRuolo}}</h5>
                        <h5 style="margin-bottom:2px;" class="margin0"><strong>ADB/COE:</strong> {{mbo.NomeUO}}</h5>
                        <h5 style="margin-bottom:2px;" class="margin0"><strong>{{s.stato[l]}}:</strong> {{mbo.Descrizione}}</h5>
                    </div>
                </div>
            </div>
            <ul v-else-if="!isSearch || filtered == true" class="list-group" style="margin: 0px;">
                <li class="list-group-item" style="margin-bottom: 18px;">
                    <h4>{{s.noGoal[l]}}</h4>
                </li>
            </ul>
            <div v-else-if="isSearch && filtered == false" style="margin: 0px; text-align: center;">
                <clip-loader :loading="!filtered" :color="'rgb(93, 197, 150)'" size="35px"></clip-loader>
            </div>
            <div v-if="isSearch && ready" class="row">
                <div class="col-xs-12">
                    <paginazione :bottom="true" :array="mbos" @displayChanged="dispatchedPagination($event)" :limit="5">
                    </paginazione>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import paginazione from "../components/paginazione.vue"
import ClipLoader from 'vue-spinner/src/ClipLoader.vue'

export default {
    mounted: function() {

        this.isSearch = this.filtro != null ? true : false;
        this.isAdmin = this.$root.isAdmin();

        if (!this.isSearch) {
            this.getList();
        }
    },
    components: {
        paginazione,
        ClipLoader
    },
    data: function() {
        return {

            s: this.$root.getStrings(),
            l: this.$root.lang(),

            mbos: [],
            displaymbos: [],
            path: localStorage.getItem('path'),
            isSearch: false,
            isAdmin: false,
            filtered: null,
            ready: false,
            overflow: false
        }
    },
    props: {
        valutatore: {
            type: Boolean
        },
        filtro: {
            type: Object
        },
        flag: {
            type: Boolean
        }
    },
    watch: {
        flag: function() {
            this.getGoals();
        }
    },
    computed: {
        quantisono: function() {
            return this.mbos.length;
        }
    },
    methods: {
        dispatchedPagination: function(toDisplay) {
            this.displaymbos = toDisplay;
        },
        getList: function() {
            this.idpersona = localStorage.getItem("idpersona")

            if (!this.valutatore) {

                this.$http.get(this.path + '/APILISTAVALUTAZIONI?IDValutato=' + this.idpersona + "&RuoloAutorizzazione=Valutato").then((response) => {
                    var mbos = response.body;
                    try {
                        mbos = JSON.parse(response.body);
                    } catch (err) {};
                    if (mbos && mbos.APILISTAVALUTAZIONI) {
                        this.mbos = mbos.APILISTAVALUTAZIONI
                    }
                    this.ready = true;
                }, (err) => {

                })
            } else {
                this.$http.get(this.path + '/APILISTAVALUTAZIONI?IDValutatore=' + this.idpersona + "&RuoloAutorizzazione=Valutatore").then((response) => {
                    var mbos = response.body;
                    try {
                        mbos = JSON.parse(response.body);
                    } catch (err) {};
                    if (mbos && mbos.APILISTAVALUTAZIONI) {
                        this.mbos = mbos.APILISTAVALUTAZIONI
                    }
                    this.ready = true;
                }, (err) => {

                })
            }
        },
        getGoals: function() {
            this.mbos = []
            this.overflow = false;
            this.filtered = false;
            var f = this.filtro;
            var string = ["ID=."];
            if (f.cognome.trim() != "") {
                string.push('CognomePersona=' + f.cognome);
            }
            if (f.nome.trim() != "") {
                string.push("NomePersona=" + f.nome);
            }

            if(!this.valutatore){
                string.push("RuoloAutorizzazione=Supervisore");
            }

            if(this.filtro.tipo != -1){
                string.push("TipoValutazione=KPI " + this.filtro.tipo);
            }
            if(this.filtro.status != -1){
                string.push("IDStato=" + this.filtro.status);
            }
            if(this.filtro.anno != null){
                var year = this.filtro.anno.getFullYear();
                string.push("FinePeriodoValutazione=" + year);
            }
            string = string.join("&");

            if(this.valutatore){
                this.mergeValutatoreApprovatore(string);
            } else {
                this.$http.get(this.path + '/APILISTAVALUTAZIONI?' + string).then((response) => {
                    var goals = response.body;
                    try {
                        goals = JSON.parse(response.body);
                    } catch (err) {};
                    if (goals && goals.APILISTAVALUTAZIONI) {

                        this.mbos = goals.APILISTAVALUTAZIONI;

                        if (this.mbos.length > 50 && this.isAdmin) {
                            this.overflow = true;
                            this.mbos = this.mbos.splice(0, 50);
                        }
                    }
                    this.ready = true;
                    this.filtered = true;
                }, (err) => {
                    this.filtered = true;
                })
            }
        },
        mergeValutatoreApprovatore: function(string){
            var promises = [];
            var v_string = [string];
            v_string.push("IDValutatore=" + localStorage.getItem("idpersona"))
            v_string.push("RuoloAutorizzazione=Valutatore");
            var v_results = [];
            v_string = v_string.join("&")
            console.log(v_string)

            promises.push(this.$http.get(this.path + '/APILISTAVALUTAZIONI?' + v_string).then((response) => {
                var goals = response.body;
                try {
                    goals = JSON.parse(response.body);
                } catch (err) {};
                if (goals && goals.APILISTAVALUTAZIONI) {
                    v_results = goals.APILISTAVALUTAZIONI.map(function(obj){
                        obj.v_me = true;
                        return obj;
                    });
                }
            }, (err) => {
                console.log("Err in Get Lista Valutatore")
            }))

            var a_string = [string];
            a_string.push("IDApprovatore=" + localStorage.getItem("idpersona"))
            a_string.push("RuoloAutorizzazione=Approvatore");
            var a_results = [];
            a_string = a_string.join("&")
            console.log(a_string)

            promises.push(this.$http.get(this.path + '/APILISTAVALUTAZIONI?' + a_string).then((response) => {
                var goals = response.body;
                try {
                    goals = JSON.parse(response.body);
                } catch (err) {};
                if (goals && goals.APILISTAVALUTAZIONI) {
                    a_results =goals.APILISTAVALUTAZIONI;
                }
            }, (err) => {
                console.log("Err in Get Lista Approvatore")
            }))

            Promise.all(promises).then(() => {
                this.fetch(v_results, a_results)
            }, (err) => {
                console.log("Fetching past Error")
                this.fetch(v_results, a_results)
            }) 
        },
        fetch: function(v_results, a_results){
            console.log("Appraiser's")
            console.log(v_results)
            this.mbos = v_results;
            console.log("Owner's")
            console.log(a_results)
            for(var i = 0; i < a_results.length; i++){
                var index = -1;
                this.mbos.some(function(item, ind){
                    if(item.ID == a_results[i].ID){
                        index = ind;
                        console.log("Found match in IDScheda: " + item.ID);
                        return true;
                    }
                    return false;
                })

                if (index == -1){ 
                    a_results[i].a_me = true 
                    this.mbos.push(a_results[i]);
                }
                else { this.mbos[index].a_me = true }    
            }
            console.log(this.mbos);

            this.ready = true;
            this.filtered = true;
        },
        apriDettaglio: function(mbo) {
            if(mbo.TipoValutazione=='KPI 1'){
                 this.$router.push({
                    name: 'scheda-goal',
                    params: {
                        idvalutazione: mbo.ID
                    }
                });
            } else if(mbo.TipoValutazione=='KPI 2') {
                var v = this.valutatore == true ? 'Valutatore' : 'Valutato';
                if (this.filtro != null && this.valutatore != true) {
                    v = "Admin";
                }
               
                v = Base64.encode('' + v);
                this.$router.push({
                    name: 'scheda-impiegato',
                    params: {
                        idscheda: mbo.ID,
                        ruolo: v
                    }
                })
            }
        },
        peopleInit: function() {
            var get = this.$store.getters.getPeople;
            if (get != null) {
                this.people = get;
            } else {
                this.$store.co
                mmit("initPeople");
                this.people = this.$store.getters.getPeople;
            }
        }
    }
}
</script>
<style scoped>
th {
    background-color: #42a5f5;
    color: white;
    padding: 10px;
    font-size: 1.5rem;
    font-weight: 300;
    border-right: 1px solid white;
    border-left: 1px solid white;
    text-align: center;
}

td {
    padding-left: 10px;
    padding-rigth: 10px;
    padding-top: 5px;
    padding-bottom: 5px;
    border-bottom: 1px solid #ddd;
    border-left: 1px dotted #eee;
    border-right: 1px dotted #eee;
    text-align: right;
    font-size: 1.1rem;
}

.alternata {
    background-color: #eee;
}

.kpi {
    text-align: left;
}

tr:hover {
    background-color: #ddd !important;
}

.padre {
    font-weight: 400;
}

.figlio {
    font-weight: 300;
    padding-left: 50px !important;
}

.tab-pane {
    max-height: 53vh;
    overflow-y: auto;
}

.danger {
    padding: 8px 12px;
    border-radius: 2px;
    background-color: #f2dede;
    border-color: #ebccd1;
    color: #a94442;
}

.margin0 {
    margin: 0px;
}
</style>
