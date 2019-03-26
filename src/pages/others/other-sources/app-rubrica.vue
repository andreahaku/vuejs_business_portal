<template>
    <div class="st-pusher" id="content">
        <alert :show="showAlert" :who="submitWho" :requested="false" @done="submitDone"></alert>
        <alertRequest :show="showRequest" :per="requestFor" :to="requestTo" @done="requestDone"></alertRequest>
        <div class="st-content">
            <div class="st-content-inner padding-none">
                <div class="container-fluid">
                    <br>
                    <div class="row">
                        <div class="item col-xs-12 col-lg-6">
                            <div class="panel panel-default animated fadeIn" style="margin-top:20px; margin-bottom:10px;">
                                <div class="panel-body padding-bottom-none">
                                    <div class="row">
                                        <div class="visible-xs-block col-xs-12">
                                            <a href="#" @click.prevent="filtraPersone()" class="btn btn-sm btn-primary paper-shadow relative pull-right" data-z="0.5" data-hover-z="1">Cerca Tutti</a>
                                        </div>
                                        <div class="col-xs-8 col-sm-5">
                                            <div class="form-group form-control-material">
                                                <input id="search_cognome" type="text" class="form-control" placeholder="cognome da cercare" @blur="filterOut_cognome()" v-model="cognome" />
                                                <label for="search_cognome" :class="{condati: labelout_cognome}">Cognome...</label>
                                            </div>
                                        </div>
                                        <div class="col-xs-8 col-sm-5">
                                            <div class="form-group form-control-material">
                                                <input id="search_nome" type="text" class="form-control" placeholder="nome da cercare" @blur="filterOut_nome()" v-model="nome" />
                                                <label for="search_nome" :class="{condati: labelout_nome}">Nome...</label>
                                            </div>
                                        </div>
                                        <div class="hidden-xs col-sm-2">
                                            <a href="#" @click.prevent="filtraPersone()" class="btn btn-sm btn-primary paper-shadow relative pull-right" data-z="0.5" data-hover-z="1">Cerca Tutti</a>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-xs-12 col-sm-6">
                                            <div class="dropdown dd">
                                                <a v-if="uo_selezionata != -1" class="dropdown-toggle lista-sm" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                                    <span style="max-width: 95%">{{nome_uo_sel}}
                                                    <span class="caret"></span></span>
                                                </a>
                                                <a v-if="uo_selezionata == -1" class="dropdown-toggle lista-sm" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                                    <span>Unità organizzativa
                                                    <span class="caret"></span></span>
                                                </a>
                                                <ul class="dropdown-menu" aria-labelledby="dropdownMenu1">
                                                    <li><a @click="uo_selezionata = -1">Qualsiasi</a></li>
                                                    <li v-for="u in uo"><a @click="uoSelected(u)">{{u.nome}}</a></li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div class="col-xs-12 col-sm-6">
                                            <div class="dropdown dd">
                                                <a v-if="ruolo_selezionato != -1" class="dropdown-toggle lista-sm" type="button" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                                    <span style="max-width: 95%">{{nome_ruolo_sel}}
                                                    <span class="caret"></span></span>
                                                </a>
                                                <a v-if="ruolo_selezionato == -1" class="dropdown-toggle lista-sm" type="button" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                                    <span>Ruolo
                                                <span class="caret"></span></span>
                                                </a>
                                                <ul class="dropdown-menu" aria-labelledby="dropdownMenu2">
                                                    <li><a @click="ruolo_selezionato = -1">Qualsiasi</a></li>
                                                    <li v-for="r in ruoli"><a @click="ruoloSelected(r)">{{r.nome}}</a></li>
                                                </ul>
                                            </div>
                                        </div>
                                        <!-- 
                                        <div class="col-xs-2">
                                            <a href="#" @click.prevent="filtraLista()" class="btn btn-sm btn-primary paper-shadow relative" data-z="0.5" data-hover-z="1">Cerca</a>
                                        </div>
                                         -->
                                    </div>
                                </div>
                            </div>
                            <div v-if="!filterIsEmpty" class="media-body row" style="margin-top: 10px;">
                                <div class="col-xs-12 col-sm-6">
                                    <h5 class="text-headline" style="margin-top:2px;">Ricerca nel Team <span class="badge risul">{{myFilteredPeople.length}}</span></h5>
                                </div>
                                <div class="col-xs-12 col-xs-offset-0 col-sm-6 col-sm-offset-0">
                                    <paginazione :array="myFilteredPeople" @displayChanged="dispatchedPagination_myFilteredPeople($event)" :limit="perpagina_othersFilteredPeople" style="margin-top: -3px;margin-right: -5px;padding-bottom: 3px;">
                                    </paginazione>
                                </div>
                            </div>
                            <div v-if="!filterIsEmpty" id="listaFiltrata" class="panel panel-default paper-shadow" style="margin-bottom: 10px; margin-top: 5px;">
                                <ul class="list-group">
                                    <persona v-if="myFilteredPeople.length > 0" v-for="(persona,i) in display_myFilteredPeople" :persona="persona" @assignFeedback="assignFeedback(persona)" @requestFeedback="requestFeedback(persona, $event)" @switched="switchFavorites(persona, $event)">
                                    </persona>
                                    <li v-if="myFilteredPeople.length == 0" class="list-group-item">
                                        <h4>Nessun Risultato</h4>
                                    </li>
                                </ul>
                            </div>
                            <div v-if="overflow" class="col-xs-12 danger">
                                La ricerca ha restituito un numero eccessivo di risultati e la lista è stata troncata, provare a definire più nello specifico i parametri della ricerca
                            </div>
                            <div class="media-body row" style="margin-top: 10px;">
                                <div class="col-xs-12 col-sm-6">
                                    <h5 class="text-headline" style="margin-top:2px;">Risultati Ricerca <span class="badge risul">{{othersFilteredPeople.length}}</span></h5>
                                </div>
                                <div class="col-xs-12 col-xs-offset-0 col-sm-6 col-sm-offset-0">
                                    <paginazione :array="othersFilteredPeople" @displayChanged="dispatchedPagination_othersFilteredPeople($event)" :limit="perpagina_othersFilteredPeople" style="margin-top: -3px;margin-right: -5px;padding-bottom: 3px;">
                                    </paginazione>
                                </div>
                            </div>
                            <div id="listaFiltrata" class="panel panel-default paper-shadow" style="margin-bottom: 10px; margin-top: 5px;">
                                <ul class="list-group">
                                    <persona v-if="othersFilteredPeople.length > 0" v-for="(persona,i) in display_othersFilteredPeople" :persona="persona" @assignFeedback="assignFeedback(persona)" @requestFeedback="requestFeedback(persona, $event)" @switched="switchFavorites(persona, $event)">
                                    </persona>
                                    <li v-if="othersFilteredPeople.length == 0" class="list-group-item">
                                        <h4>Nessun Risultato</h4>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div class="item col-xs-12 col-lg-6" style="margin-top:10px;">
                            <div class="media-body row">
                                <div class="col-xs-12 col-sm-6">
                                    <h4 class="text-headline margin-none">Il Mio Team<span class="badge" style="position: relative">{{quantisono_my}}</span></h4>
                                </div>
                                <div class="col-xs-12 col-xs-offset-0 col-sm-6 col-sm-offset-0">
                                    <paginazione :array="myPeople" @displayChanged="dispatchedPagination_my($event)" :limit="perpagina_my" style="margin-top: -5px;margin-right: -5px;padding-bottom: 3px;">
                                    </paginazione>
                                </div>
                            </div>
                            <div id="my_people" class="panel panel-default paper-shadow" data-z="0.5">
                                <ul class="list-group">
                                    <persona v-for="(persona,i) in display_my_people" :persona="persona" @assignFeedback="assignFeedback(persona)" @requestFeedback="requestFeedback(persona, $event)" @switched="switchFavorites(persona, $event)">
                                    </persona>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <sidejsonly :default="true"></sidejsonly>
    </div>
</template>
<script>
import sidejsonly from '../../components/side-default-jsonly.vue'
import paginazione from '../../components/paginazione.vue'
import persona from '../../feedback/persona-component.vue'
import alert from '../../feedback/alert-feedback.vue'
import alertRequest from '../../feedback/alert-request.vue'

import {
    ruoliUoMixin
} from '../../components/ruoliUoMixin.js'

import {
    eventBus
} from '../../../eventbus.js';

export default {
    created: function() {
        this.init()
    },
    components: {
        sidejsonly,
        paginazione,
        persona,
        alert,
        alertRequest
    },
    data: function() {
        return {
            peopleCollection: {},
            myPeople: [],
            myFilteredPeople: [],
            othersFilteredPeople: [],

            nome: '',
            cognome: '',
            uo_selezionata: -1,
            ruolo_selezionato: -1,
            nome_uo_sel: '',
            nome_ruolo_sel: '',
            filteredCollection: {},

            filtro: '',
            labelout_nome: false,
            labelout_cognome: false,

            display_my_people: [],
            display_myFilteredPeople: [],

            display_othersFilteredPeople: [],

            miaUO: -1,
            uo: [],
            ruoli: [],

            filterIsEmpty: true,

            showAlert: false,
            submitWho: '',
            submitting: {},

            showRequest: false,
            requestFor: {},
            requestTo: {},
            requesting: {},

            overflow: false,

            enablingObject: this.$root.getEnablingObject()
        }
    },
    computed: {
        quantisono_my: function() {
            return this.myPeople.length;
        },
        perpagina_my: function() {
            return Math.max(4, Math.floor(($(window).height() - 175) / 95));
        },
        quantisono_othersFilteredPeople: function() {
            return this.othersFilteredPeople.length;
        },
        perpagina_othersFilteredPeople: function() {
            return Math.max(4, Math.floor(($(window).height() - 375) / 101));
        }
    },
    watch: {
        '$route': function() {
            if (localStorage.getItem("TokenScaduto")) {
                localStorage.removeItem("TokenScaduto");
                eventBus.$emit("alert", "Sessione scaduta");
            }
        },
        nome: function() {
            this.filtraTeam()
        },
        cognome: function() {
            this.filtraTeam()
        },
        uo_selezionata: function() {
            this.filtraTeam();
        },
        ruolo_selezionato: function() {
            this.filtraTeam();
        }
    },
    methods: {
        assignFeedback: function(p) {
            this.submitting = p;
            this.submitWho = p.NOME + " " + p.COGNOME;
            this.showAlert = true;
        },
        requestFeedback: function(p, $event) {
            this.requesting = p;
            if ($event) {
                this.requestTo = {
                    nome: p.NOME,
                    cognome: p.COGNOME
                };
                this.requestFor = {};
            } else {
                this.requestFor = {
                    nome: p.NOME,
                    cognome: p.COGNOME
                };
                this.requestTo = {};
            }
            this.showRequest = true;
        },
        submitDone: function($event) {
            var obj = $event;
            this.showAlert = false;
            if (obj.submit) {
                this.inviaFeedback(obj.rating, obj.skill, obj.comment);
            }
        },
        requestDone: function($event) {
            var obj = $event;
            this.showRequest = false;
            if (obj.submit) {
                this.richiediFeedback(obj);
            }
        },
        uoSelected: function(uo) {
            this.uo_selezionata = uo.id;
            this.nome_uo_sel = uo.nome;
        },
        ruoloSelected: function(ruolo) {
            this.ruolo_selezionato = ruolo.id;
            this.nome_ruolo_sel = ruolo.nome;
        },
        dispatchedPagination_myFilteredPeople(toDisplay) {
            this.display_myFilteredPeople = toDisplay;
        },
        dispatchedPagination_my(toDisplay) {

            this.display_my_people = toDisplay;
        },
        dispatchedPagination_othersFilteredPeople(toDisplay) {

            this.display_othersFilteredPeople = toDisplay;
        },
        init() {
            // crea la collezione che sarà usata solamente qui
            this.miaUO = localStorage.getItem("idUO");
            var get = this.$store.getters.getMyTeam;
            if (get == null) {
                this.$store.commit("createMyTeam");
                this.peopleCollection = this.$store.getters.getMyTeam;
                this.getTeam();
            } else {
                this.peopleCollection = get;
                this.myPeople = this.peopleCollection.data
            }

            var url_split = this.$route.path.split('/')

            if (url_split[2]) {
                if (url_split[2] == "+") {
                    this.cognome = ''
                    this.labelout_cognome = false
                } else {
                    this.cognome = url_split[2]
                    this.labelout_cognome = true
                }
            }

            if (url_split[3]) {
                if (url_split[3] == "+") {
                    this.nome = ''
                    this.labelout_nome = false
                } else {
                    this.nome = url_split[3]
                    this.labelout_nome = true
                }
            }

            if (this.nome.trim() != "" || this.cognome.trim() != "") {
                this.filtraPersone()
            }
            if (this.$store.getters.getUo != null) {
                this.uo = this.$store.getters.getUo.data;
            }
            if (this.$store.getters.getRuoli != null) {
                this.ruoli = this.$store.getters.getRuoli.data;
            }
        },
        filtraPersone() {
            this.overflow = false;
            var path = localStorage.getItem("path");
            var string = '/APIPersone?'
            var params = [];
            if (this.nome.trim() != "") {
                params.push("NOME=" +
                    this.nome.trim());
            }
            if (this.cognome.trim() != "") {
                params.push("COGNOME=" +
                    this.cognome.trim());
            }
            if (this.uo_selezionata != -1) {
                params.push("IDUO=" +
                    this.uo_selezionata);
            }
            if (this.ruolo_selezionato != -1) {
                params.push("IDRUOLO=" +
                    this.ruolo_selezionato);
            }
            params = params.join("&");
            if (params.trim() == "") {
                params = "IDPERSONA=."
            }
            string = string + params;
            this.othersFilteredPeople = []
            this.$http.get(path + string).then((response) => {
                var res = response.body;
                try {
                    res = JSON.parse(response.body);
                } catch (err) {};

                if (res && res.APIPersone) {
                    for (var i = 0; i < res.APIPersone.length; i++) {
                        var obj = res.APIPersone[i]
                        obj.favorito = this.isMate(obj.IDUO);;
                        this.othersFilteredPeople.push(obj);
                        //Filtrare qui
                    }
                    if (this.othersFilteredPeople.length > 50) {
                        this.othersFilteredPeople = this.othersFilteredPeople.slice(0, 50);
                        this.overflow = true;
                    }
                }
            })
        },
        isMate: function(id) {
            var uos = localStorage.getItem("idUo").split(";");
            for (var i = 0; i < uos.length; i++) {
                if (id == uos[i]) {
                    return true;
                }
            }
            return false;
        },
        filtraTeam: function() {
            if (this.nome.trim() != "" ||
                this.cognome.trim() != "" ||
                this.uo_selezionata != -1 ||
                this.ruolo_selezionato != -1) {

                var vm = this;
                this.myFilteredPeople = this.peopleCollection.where(function(obj) {
                    if (vm.nome.trim() != "") {
                        if (!obj.NOME.toLowerCase().includes(vm.nome.toLowerCase())) {
                            return false;
                        }
                    }
                    if (vm.cognome.trim() != "") {
                        if (!obj.COGNOME.toLowerCase().includes(vm.cognome.toLowerCase())) {
                            return false;
                        }
                    }
                    if (vm.uo_selezionata != -1) {
                        if (obj.IDUO != vm.uo_selezionata) {
                            return false;
                        }
                    }
                    if (vm.ruolo_selezionato != -1) {
                        if (obj.IDRUOLO != vm.ruolo_selezionato) {
                            return false;
                        }
                    }
                    return true;
                })
                this.filterIsEmpty = false;
            } else {
                this.filterIsEmpty = true;
            }
        },
        getTeam: function() {
            var uo = localStorage.getItem("idUo");
            if (uo != null) {
                this.$http.get(localStorage.getItem("path") + "/APIPersone?IDUO=" + uo).then((response) => {
                    var res = response.body;
                    try {
                        res = JSON.parse(response.body);
                    } catch (err) {};

                    if (res && res.APIPersone) {
                        for (var i = 0; i < res.APIPersone.length; i++) {
                            var obj = res.APIPersone[i];
                            obj.favorito = true;
                            this.peopleCollection.insert(obj);
                        }
                        this.myPeople = this.peopleCollection.data;
                    }
                });
            }
        },
        filterOut_nome: function() {
            if (this.nome.trim() != '') {
                this.labelout_nome = true;
            } else {
                this.labelout_nome = false;
            }
        },
        filterOut_cognome: function() {
            if (this.cognome.trim() != '') {
                this.labelout_cognome = true;
            } else {
                this.labelout_cognome = false;
            }
        },
        switchFavorites: function(persona, $event) {
            if ($event) {
                //this.peopleCollection.insert(persona);
            } else {
                //this.peopleCollection.remove(persona)
            }
        },
        inviaFeedback: function(rating, idSkill, commento) {
            if (this.submitting != {}) {
                var now = new Date(Date.now()).toISOString();
                var now = now.split("T")[0];
                this.$http.post(localStorage.getItem("path") + "/APIFeedback", {
                    "IDAutore": parseInt(localStorage.getItem("idpersona")),
                    "IDDestinatario": this.submitting.IDPERSONA,
                    "DataFeedback": now,
                    "Stato": "Inviato",
                    "IDSkill": idSkill,
                    "Feedback": rating,
                    "CommentoFeedback": commento
                }, {
                    headers: {
                        "Content-type": "application/json"
                    }
                }).then((response) => {
                    console.log(response);
                });
            }
        },
        richiediFeedback: function(obj) {
            if (this.requesting != {}) {
                var now = new Date(Date.now()).toISOString();
                var now = now.split("T")[0];
                var json = {
                    IDRichiedente: parseInt(localStorage.getItem("idpersona")),
                    DataRichiesta: now,
                    Stato: 'Richiesto',
                    IDSkill: obj.skill
                }
                if (obj.to != null) {
                    json.IDDestinatario = this.requesting.IDPERSONA;
                    json.IDAutore = obj.to;
                } else {
                    json.IDAutore = this.requesting.IDPERSONA;
                    json.IDDestinatario = obj.per;
                }
                this.$http.post(localStorage.getItem("path") + "/APIFeedback", JSON.stringify(json), {
                    headers: {
                        "Content-type": "application/json"
                    }
                }).then((response) => {
                    console.log(response);
                });
            }
        }
    }
}
</script>
<style scoped>
span {
    font-weight: 300;
    position: absolute;
}

.cnom {
    top: 11px;
    font-size: 1.2rem;
    font-weight: 400;
}

.cuo {
    top: 26px;
    font-size: 1rem;
}

.cruolo {
    top: 39px;
    font-size: 1rem;
}

hr {
    margin-top: 29px;
    margin-left: 0px;
    margin-right: 0px;
}

.cemail {
    top: 56px;
    font-size: 1rem;
}

.ctel {
    top: 70px;
    font-size: 1rem;
}

.avt {
    padding-top: 5px !important;
}

.lista {
    font-size: 1.3rem;
    font-weight: 300;
    padding: 10px;
    padding-right: 20px;
    border: 1px solid #e9e9e9;
    border-radius: 5px;
}

.lista-sm {}

.lista-sm > span {
    font-size: 1rem;
    font-weight: 300;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 10px;
    padding-right: 20px;
    border: 1px solid #e9e9e9;
    border-radius: 5px;
}

.dd {
    margin-top: 5px;
    height: 30px;
    margin-bottom: 20px;
}

.caret {
    margin-top: 8px;
    margin-left: 5px;
}

.risul {
    position: initial !important;
}

ul.dropdown-menu {
    max-height: 300px;
    overflow: auto !important;
    max-width: 100%;
}

.danger {
    padding: 8px 12px;
    border-radius: 2px;
    background-color: #f2dede;
    border-color: #ebccd1;
    color: #a94442;
}
</style>
