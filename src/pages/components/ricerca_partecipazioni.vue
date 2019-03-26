<template>
    <div v-if="show_widget">
        <div>
            <h4 class="text-headline margin-none">Attività Formative 
                <span v-if="partecipazioni.length > 0" class="badge">{{partecipazioni.length}}</span></h4>
            <p class="text-subhead text-light">Gestisci le attività formative delle tue persone</p>
        </div>
        <div class="panel panel-default animated fadeIn">
            <div class="panel-body  padding-bottom-none">
                <div class="row">
                    <div class="col-xs-12 col-sm-6">
                        <div class="form-group form-control-material">
                            <input id="search_cognome" type="text" class="form-control" placeholder="filtra per cognome" @blur="filterOut_cognome()" v-model="filtro.cognome" />
                            <label for="search_cognome" :class="{condati: labelout_cognome}">Cognome</label>
                        </div>
                    </div>
                    <div class="col-xs-12 col-sm-6">
                        <div class="form-group form-control-material">
                            <input id="search_nome" type="text" class="form-control" placeholder="filtra per nome" @blur="filterOut_nome()" v-model="filtro.nome" />
                            <label for="search_nome" :class="{condati: labelout_nome}">Nome</label>
                        </div>
                    </div>
                    <div class="col-xs-12">
                        <div class="form-group form-control-material">
                            <input id="search_corso" type="text" class="form-control" placeholder="filtra per nome corso" @blur="filterOut_corso()" v-model="filtro.corso" />
                            <label for="search_corso" :class="{condati: labelout_corso}">Corso</label>
                        </div>
                    </div>
                    <div class="col-xs-12" v-if="stati.length > 0" style="margin: 10px 0px">
                            <v-select multiple label="Descrizione" :options="stati" v-model="filtro.stato" placeholder="Stato Partecipazione"></v-select>
                    </div>
                    <div class="col-xs-12">
                        <div class="col-xs-6" style="margin-bottom: 10px; text-align: right; padding-right: 0px;">
                            <a href="#" @click.prevent="pulisci_filtro()" class="btn btn-sm btn-warning paper-shadow relative" data-z="0.5" data-hover-z="1" style="margin-right: 10px;">Svuota filtro</a>
                        </div>
                        <div class="col-xs-6" style="margin-bottom: 10px; text-align: left; padding-right: 0px;">
                            <a href="#" @click.prevent="filtra()" class="btn btn-sm btn-primary paper-shadow relative" data-z="0.5" data-hover-z="1" style="margin-right: 10px;">Cerca</a>
                            <div style="float: right;" v-if="$root.getEnablingObject().calendar">
                                <router-link to="calendar-wrapper" href="#" class="btn btn-sm btn-primary paper-shadow relative" data-z="0.5" data-hover-z="1"><i class="fa fa-calendar" aria-hidden="true"></i></router-link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="loading" class='uil-rolling-css' style='transform:scale(0.5); margin: 0 auto; top: 100px; right: 0px; left: 0px;'>
            <div>
                <div></div>
                <div></div>
            </div>
        </div>
        <div v-else-if="filteredOnce">
            <div class="panel panel-default paper-shadow animated noBot" data-z="0.5" style="overflow-y: auto;">
                <div>
                    <transition-group name="roll-fade" tag="ul" v-if="displayPartecipazioni.length > 0" class="list-group" style="margin: 0px;" >
                        <partecipazione :key="index" v-for="(p, index) in displayPartecipazioni" @open="open_alert"
                        :item="p"></partecipazione>
                    </transition-group>
                    <div v-else-if="pagination_ready" class="panel panel-default" style="margin: 0px;">
                        <div class="panel-body" style="border-bottom: 1px solid rgb(238, 238, 238);">Nessuna attività è stata rilevata</div>
                    </div>
                </div>
            </div>
            <div v-if="filtro!=null" class="row">
                <div class="col-xs-12 col-lg-6 col-lg-offset-6">
                    <paginazione v-if="pagination_ready" :array="partecipazioni" @displayChanged="dispatchedPagination($event)" :limit="6">
                    </paginazione>
                </div>
            </div>
        </div>
        <div v-if="!loading && filteredOnce && !pagination_ready" class='uil-rolling-css' style='transform:scale(0.5); margin: 0 auto; top: 100px; right: 0px; left: 0px;'>
            <div>
                <div></div>
                <div></div>
            </div>
        </div>
        <alertWrapper :show="showAlert" :item="item" @close="close"></alertWrapper>
    </div>
</template>

<script>
    
    import paginazione from './paginazione.vue';
    import partecipazione from './partecipazione.vue';
    import alertWrapper from './alerts/alert-wrapper.vue';
    import vSelect from 'vue-select';

    export default {
        components: {
            paginazione,
            partecipazione,
            alertWrapper,
            vSelect
        },
        mounted: function(){
            if(this.$root.inCharge){
                if(this.$root.inCharge.is && this.$root.inCharge.uos.length > 0){
                    this.getStati();
                } else {
                    this.$emit("notInCharge");
                }
            } else {
                this.$emit("notInCharge");
            }
            console.log(this.$root.inCharge);
        },
        data: function(){
            return {
                show_widget: false,
                labelout_nome: false,
                labelout_cognome: false,
                labelout_corso: false,

                filtro: {
                    nome: '',
                    cognome: '',
                    corso: '',
                    stato: null
                },

                loading: false,
                filteredOnce: false,
                fetched: false,
                partecipazioni: [],
                displayPartecipazioni: [],
                pagination_ready: false,
                emptyOnes: [],
                stati: [],

                showAlert: false,
                item: {}
            }
        },
        methods : {
            close: function($event){
                this.showAlert = false;
                if($event!= null && $event == true){
                    this.filtra();
                }
            },
            pulisci_filtro: function(){
                this.filtro = {
                    nome: '',
                    cognome: '',
                    corso: '',
                    stato: null
                }
                this.filterOut_nome();
                this.filterOut_cognome();
                this.filterOut_corso();
            },
            open_alert: function($event){
                this.item = $event;
                this.showAlert = true;
            },
            filterOut_nome: function() {
                if (this.filtro.nome.trim() != '') {
                    this.labelout_nome = true;
                } else {
                    this.labelout_nome = false;
                }
            },
            filterOut_cognome: function() {
                if (this.filtro.cognome.trim() != '') {
                    this.labelout_cognome = true;
                } else {
                    this.labelout_cognome = false;
                }
            },
            filterOut_corso: function() {
                if (this.filtro.corso.trim() != '') {
                    this.labelout_corso = true;
                } else {
                    this.labelout_corso = false;
                }
            },
            dispatchedPagination: function(display){
                this.displayPartecipazioni = display;
                this.loadInfoEdizioni();
            },
            loadInfoEdizioni: function(){
                this.fetched = false;
                var ids = [];
                for (var i = 0; i < this.displayPartecipazioni.length; i++) {
                    if(ids.indexOf(this.displayPartecipazioni[i].IdEdizione) == -1){
                        ids.push(this.displayPartecipazioni[i].IdEdizione);
                    }
                }
                ids = ids.join(";");
                this.$http.get(localStorage.getItem('path') + '/APIEdizioni?IdEdizione='+ids).then((response) => {
                    var res = response.body
                    try {
                        var res = JSON.parse(response.body);
                    } catch (err) {}

                    if(res && res.APIEdizioni){
                        for(var i = 0; i < res.APIEdizioni.length; i++){
                            var ed = res.APIEdizioni[i];
                            for(var ii = 0; ii < this.displayPartecipazioni.length; ii++){
                                if(this.displayPartecipazioni[ii].IdEdizione == ed.IdEdizione){
                                    this.displayPartecipazioni.label_ed = ed.Edizione + " " + 
                                    ed.DataInizio.replace(/-/g, "/") + " - " + ed.DataFine.replace(/-/g, "/");
                                }
                            }
                        }
                    }
                    this.fetched = true;
                }, (err) => {
                    console.log(err);
                });

            },
            filtra: function(){
                this.pagination_ready = false;
                this.filteredOnce = true;
                this.loading = true;
                this.partecipazioni = [];
                this.displayPartecipazioni = [];
                this.emptyOnes = [];

                var query_uos = this.$root.inCharge.uos.join(";");
                var condizioni = ["IDUnitàOrganizzativa="+query_uos];
                if(this.filtro.nome.trim()!=''){
                    condizioni.push("NomePersona="+this.filtro.nome.trim());
                }
                if(this.filtro.cognome.trim()!=''){
                    condizioni.push("CognomePersona="+this.filtro.cognome.trim());
                }
                if(this.filtro.corso.trim()!=''){
                    condizioni.push("TITOLOCORSO="+this.filtro.corso.trim());
                }
                if(this.filtro.stato != null){
                    var ids_stati = [];
                    if(this.filtro.stato.length > 0){
                        for ( var i = 0; i < this.filtro.stato.length; i++){
                            ids_stati.push(this.filtro.stato[i].IDStato);
                        }
                        ids_stati = ids_stati.join(";");
                    }
                    condizioni.push("IDStatoPartecipante="+ids_stati);
                }
                condizioni = condizioni.join("&");

                this.$http.get(localStorage.getItem('path') + '/APIPartecipazioni?'+condizioni).then((response) => {
                    var res = response.body
                    try {
                        var res = JSON.parse(response.body);
                    } catch (err) {}

                    if(res && res.APIPartecipazioni){
                        this.partecipazioni = res.APIPartecipazioni;

                        var vm = this;
                        this.partecipazioni = this.partecipazioni.filter(function(p){
                            if(p.IDPartecipante != null){
                                return true;
                            } else {
                                var found = false;

                                for(var i = 0; i < vm.emptyOnes.length; i++){
                                    if(vm.emptyOnes[i].IDUnitàOrganizzativa == p.IDUnitàOrganizzativa &&
                                        vm.emptyOnes[i].IdEdizione == p.IdEdizione &&
                                        vm.emptyOnes[i].corso == p.IDCorso){
                                        vm.emptyOnes[i].grouped++;
                                        found = true;
                                        break;
                                    }
                                }
                                if(!found){
                                    vm.emptyOnes.push({
                                        IDUnitàOrganizzativa: p.IDUnitàOrganizzativa,
                                        IdEdizione: p.IdEdizione,
                                        corso: p.IDCorso,
                                        titolo: p.TITOLOCORSO,
                                        grouped: 1
                                    })
                                }
                                return false;
                            }
                        })

                        this.partecipazioni = this.emptyOnes.concat(this.partecipazioni)
                        var ids = [];
                        var idsuo = [];
                        console.log(this.partecipazioni)
                        for(var i = 0; i < this.partecipazioni.length; i++){
                            if(ids.indexOf(this.partecipazioni[i].IdEdizione) == -1){
                                ids.push(this.partecipazioni[i].IdEdizione);
                            }
                            if(idsuo.indexOf(this.partecipazioni[i].IDUnitàOrganizzativa) == -1){
                                idsuo.push(this.partecipazioni[i].IDUnitàOrganizzativa);
                            }
                        }
                        ids = ids.join(";");
                        idsuo = idsuo.join(";");

                        var promises = []
                        promises.push(this.$http.get(localStorage.getItem('path') + '/APIEdizioni?IdEdizione='+ids).then((response) => {
                            var res = response.body
                            try {
                                var res = JSON.parse(response.body);
                            } catch (err) {}
                            if(res && res.APIEdizioni){
                                for (var i = 0; i < res.APIEdizioni.length; i++) {
                                    var e = res.APIEdizioni[i];
                                    for (var ii = 0; ii < this.partecipazioni.length; ii++) {
                                        if(this.partecipazioni[ii].IdEdizione == e.IdEdizione){
                                            var labels = []
                                            if(e.DataInizio && (e.DataInizio == e.DataFine)){
                                                labels.push("Data " + e.DataInizio.replace(/-/g, "/"));
                                            } else {
                                                if(e.DataInizio){labels.push("Dal " + e.DataInizio.replace(/-/g, "/"))}
                                                if(e.DataFine){labels.push("Al " + e.DataFine.replace(/-/g, "/"))}
                                            }
                                            if(e.Edizione != e.IdEdizione){labels.push(e.Edizione)}
                                            if(e.IDProvinciaSede){labels.push(e.IDProvinciaSede)}
                                            labels.push(e.IdEdizione);
                                    
                                            this.partecipazioni[ii].label = labels.join(" - ");
                                            this.partecipazioni[ii].inizio = e.DataInizio;
                                            this.partecipazioni[ii].fine = e.DataFine;
                                        }
                                    }
                                }
                            }
                        }, (err) => {
                            console.log(err);
                        }))
                        promises.push(this.$http.get(localStorage.getItem('path') + '/APIUO?ID='+idsuo).then((response) => {
                            var res = response.body
                            try {
                                var res = JSON.parse(response.body);
                            } catch (err) {}
                            if(res && res.APIUO){
                                for(var i = 0; i < res.APIUO.length; i++) {
                                    var uo = res.APIUO[i];
                                    for(var ii = 0; ii < this.partecipazioni.length; ii++){
                                        if(this.partecipazioni[ii].IDUnitàOrganizzativa == uo.ID){
                                            // this.partecipazioni[ii].uo_label = uo.ID + " " + uo.UO;
                                            this.partecipazioni[ii].uo_label = uo.UO;
                                        }
                                    }
                                }
                            }
                        }, (err) => {
                            console.log(err);
                        }))
                        Promise.all(promises).then(() => {
                            
                            this.partecipazioni.sort(function(a,b){
                                if(a.grouped != null){return -1;}
                                if(b.grouped != null){return 1;}
                                if(a.IdEdizione == null){return -1;}
                                if(b.IdEdizione == null){return 1;}
                                return Date.parse(a.inizio) - Date.parse(b.inizio);
                            })
                            this.pagination_ready = true;
                        })
                    } else {
                        this.pagination_ready = true;
                    }
                    this.loading = false;
                }, (err) => {
                    this.loading = false;
                    this.pagination_ready = true;
                    console.log(err);
                })
            },
            getStati: function(){
                this.stati = [];
                this.$http.get(localStorage.getItem('path') + '/APIStatiPartecipanti?IDStato=.').then((response) => {
                    var res = response.body
                    try {
                        var res = JSON.parse(response.body);
                    } catch (err) {}
                    if(res && res.APIStatiPartecipanti){
                        this.stati = res.APIStatiPartecipanti;
                    }
                    this.show_widget = true;
                }, (err) => {
                    console.log(err)
                });
            }
        }
    }

</script>

<style scoped>
.condati {
    color: #42a5f5 !important;
    font-size: 1rem !important;
    top: -18px !important;
}

.btn-filtro {
    padding: 0px;
    margin-bottom: 10px;
    height: 38px;
    width: 100%;
    overflow-x: hidden;
}

.noBot {
    margin-bottom: 0px;
}

</style>