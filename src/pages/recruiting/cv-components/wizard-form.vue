<template>
    <div class="media">
        <div class="media-body">
            <div class="media v-middle">
                <div class="media-right">
                    <h4 class="text-headline margin-none">Istruzione e Formazione
                 </h4>
                </div>
            </div>
            <div class="panel-body">
                <div class="panel panel-default paper-shadow row" style="border-width: 0px;">
                    <div class="col-sm-2"></div>
                    <div class="col-xs-12 col-md-10">
                        <transition-group name='roll-fade'>
                            <form class="form-horizontal row" v-for="(edu, index) in education" :key="index">
                                <div v-if="gotTitles" class="form-group col-xs-12 col-md-6">
                                    <label for="nome" class="col-sm-12 control-label">Titolo di Studio</label>
                                    <div class="col-sm-12">
                                        <select @change="titleChanged(index,edu.required.titolo)" id="select" class="form-control checkableInput" v-model="edu.required.titolo">
                                            <option v-for="title in titoli" :value="title.ID">{{title.nome}}</option>
                                        </select>
                                    </div>
                                </div>
                                <div v-if="gotCourses && edu.required.titolo!=''" class="form-group col-xs-12 col-md-6">
                                    <label for="nome" class="col-sm-12 control-label">Corso di Studio</label>
                                    <div class="col-sm-12">
                                        <select id="select" class="form-control checkableInput" v-model="edu.required.corso">
                                            <option v-for="corso in edu.required.filtered" :value="corso.id" :disabled="corso.livello == -1">{{corso.nome}}</option>
                                        </select>
                                    </div>
                                </div>
                                <div v-if="edu.required.titolo!=''" class="form-group col-xs-12 col-md-6">
                                    <label for="nome" class="col-sm-12 control-label">Stato</label>
                                    <div class="col-sm-12">
                                        <select @change="status(index)" id="select" class="form-control checkableInput" v-model="edu.required.stato">
                                            <option>Terminato</option>
                                            <option>In Corso</option>
                                        </select>
                                    </div>
                                </div>
                                <div v-if="edu.required.titolo!=''" class="form-group col-xs-12 col-md-6">
                                    <label for="nome" class="col-sm-12 control-label"><strong>* </strong>Nome ente</label>
                                    <div class="col-sm-12">
                                        <input type="text" class="form-control checkableInput" placeholder="Nome scuola o istituto" v-model="edu.required.ente" :class="{'missing': edu.missingFields.ente}">
                                    </div>
                                </div>
                                <div v-if="edu.required.titolo!=''" class="form-group col-xs-12 col-md-6">
                                    <label for="end" class="col-sm-12 control-label"><strong>* </strong>Inizio periodo</label>
                                    <div class="col-sm-12">
                                        <input type="date" class="form-control checkableInput" placeholder="gg/mm/aaaa" v-model="edu.required.da" :class="{'missing': edu.missingFields.da}">
                                    </div>
                                </div>
                                <div v-if="edu.required.titolo!=''" class="form-group col-xs-12 col-md-6">
                                    <label for="end" class="col-sm-12 control-label"><strong>* </strong>Fine periodo</label>
                                    <div class="col-sm-12">
                                        <input type="date" class="form-control checkableInput" placeholder="gg/mm/aaaa oppure 'Oggi'" :id="'to'+index" v-model="edu.required.a" :class="{'missing': edu.missingFields.a}">
                                    </div>
                                </div>
                                <div v-if="edu.required.titolo=='LA' || edu.required.titolo=='LAB'" class="form-group col-xs-12 col-md-6">
                                    <label for="nome" class="col-sm-12 control-label">Ateneo</label>
                                    <div class="col-sm-12">
                                        <input type="text" class="form-control checkableInput" placeholder="Bologna, Milano..." v-model="edu.required.ateneo">
                                    </div>
                                </div>
                                <div v-if="edu.required.titolo!='' && edu.required.stato == 'Terminato'" class="form-group col-xs-12 col-md-6">
                                    <label for="nome" class="col-sm-12 control-label">Punteggio</label>
                                    <div class="col-sm-12">
                                        <input type="text" class="form-control checkableInput" placeholder="ottenuto/massimo, Es: 80/100" v-model="edu.required.voto">
                                    </div>
                                </div>
                                <div v-if="edu.required.titolo!=''" class="form-group col-xs-12">
                                    <label for="end" class="col-sm-12 control-label">Competenze acquisite e altre note (Max 2000 caratteri) <span v-if="edu.required.competenze != ''">{{edu.required.competenze.length}} - 2000</span></label>
                                    <div class="col-sm-11">
                                        <textarea rows="2" cols="45" class="form-control checkableInput" placeholder="Dettagli .." style="margin: 0px;" v-model="edu.required.competenze" :class="{'missing': edu.missingFields.comp}"></textarea>
                                    </div>
                                </div>
                                <span class="pull-right hidden-xs">
                                       <a class="btn btn-danger btn-flat" style="margin-right: 50px;"
                                       @click="deleteObs(index)">RIMUOVI <i class="fa fa-minus pad" aria-hidden="true"></i> </a>
                                    </span>
                                <span class="center-delete-btn visible-xs">
                                       <a class="btn btn-danger btn-flat"
                                       @click="deleteObs(index)">RIMUOVI <i class="fa fa-minus pad" aria-hidden="true"></i> </a>
                                    </span>
                                <hr class="visible-xs">
                            </form>
                        </transition-group>
                        <span class="pull-left">
                              <a class="btn btn-primary btn-flat" 
                              @click="addEmptyForm()">AGGIUNGI <i class="fa fa-plus pad" aria-hidden="true"></i> </a>
                          </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {
    eventBus
} from '../../../eventbus.js'

export default {
    mounted() {
            this.$nextTick(function() {
                this.getCourses();
                this.getTitoli();
            })
        },
        created() {
            var vm = this;
            eventBus.$on('pillChanged', function(id) {
                if (id === 'formazione') {
                    vm.checkRequired();
                }
            });
            eventBus.$on('saveFirstCv', function() {
                vm.save();
            })

            eventBus.$on("choice", this.handleChoice);
            this.e = eventBus._events.choice[eventBus._events.choice.length - 1];

            this.addEmptyForm();
        },
        beforeDestroy() {
            var index = eventBus._events.choice.indexOf(this.e);
            eventBus._events.choice.splice(index, 1);
        },
        data() {
            return {
                valid: 1,

                education: [],
                index: 0,
                deleting: 0,
                gotCourses: false,
                courses: [],
                titoli: [],
                gotTitles: false,

                isChrome: !!window.chrome && !!window.chrome.webstore,
                e: {},

                univoco: 'wizard-form'
            }
        },
        methods: {
            titleChanged: function(ind, title) {
                this.education[ind].required.filtered = this.courses.filter(function(c) {
                    if (c.titolo == title) {
                        return true;
                    }
                    return false;
                });
            },
            getTitoli() {
                var token = "recruiting_token";
                var get = this.$store.getters.getLevels;
                if (get != null && get.length > 0) {
                    this.titoli = get;
                    this.gotTitles = true;
                } else {
                    this.titoli = [{
                        ID: null,
                        nome: "NESSUNO"
                    }, {
                        ID: 'DM',
                        nome: "DIPLOMA DI MATURITA'"
                    }, {
                        ID: 'DQ',
                        nome: "DIPLOMA DI QUALIFICA"
                    }, {
                        ID: 'DQP',
                        nome: "DIPLOMA DI QUAL. PROFESSIONALE"
                    }, {
                        ID: 'LA',
                        nome: "LAUREA"
                    }, {
                        ID: 'LAB',
                        nome: "LAUREA BREVE"
                    }, {
                        ID: 'LE',
                        nome: "LICENZA ELEMENTARE"
                    }, {
                        ID: 'LM',
                        nome: "LICENZA MEDIA"
                    }];
                    this.$store.commit("setLevels", this.titoli);
                    this.gotTitles = true;
                }
            },
            getCourses() {
                var token = "recruiting_token";
                if (this.$root.lsGet("corsiDiStudio") != null) {
                    this.courses = JSON.parse(this.$root.lsGet("corsiDiStudio"));
                    this.gotCourses = true;
                } else if (token != null) {
                    this.$http.get(localStorage.getItem("rec-path") + "/CorsoDiStudio?ID=.", {
                        headers: {
                            token: token
                        }
                    }).then((response) => {
                        var res = response.body;
                        try{
                            res = JSON.parse(response.body);
                        } catch(err) {};
                        if (res && res.CorsoDiStudio) {
                            for (var i = 0; i < res.CorsoDiStudio.length; i++) {
                                var c = res.CorsoDiStudio[i];
                                this.courses.push({
                                    nome: c.CorsoDiStudio,
                                    id: c.ID,
                                    livello: c.LivelloFormazione,
                                    titolo: c.IDTitoloDiStudio
                                })
                            }
                            this.courses.sort(function(a, b) {
                                if (a.livello == null) {
                                    return -1;
                                } else if (b.livello == null) {
                                    return 1;
                                } else {
                                    return a.livello - b.livello;
                                }
                            })
                            this.gotCourses = true;

                            this.$root.lsSet("corsiDiStudio", JSON.stringify(this.courses));
                        }
                    })
                }
            },
            status(i) {
                if (this.education[i].required.stato == "In Corso") {
                    this.education[i].required.a = "Oggi";
                    this.education[i].required.voto = "";
                    document.getElementById("to" + i).disabled = true;
                } else {
                    this.education[i].required.a = "";
                    document.getElementById("to" + i).disabled = false;
                }

            },
            checkRequired() {

                this.valid = 1;
                var missing = [];

                for (var i = 0; i < this.education.length; i++) {

                    if (this.education[i].required.ente.trim() === '') {
                        this.valid = 0;
                        if (missing.indexOf("Organizzazione educativa") === -1) {
                            missing.push("Organizzazione educativa");
                        }
                        this.education[i].missingFields.ente = true;
                    } else {
                        this.education[i].missingFields.ente = false;
                    }

                    if (this.education[i].required.da.trim() === '') {
                        this.valid = 0;
                        if (missing.indexOf("Inizio periodo") === -1) {
                            missing.push("Inizio periodo");
                        }
                        this.education[i].missingFields.da = true;
                    } else {
                        if (!this.isChrome && !checkDateFormat(this.education[i].required.da, 'Oggi')) {
                            this.valid = 0;
                            if (missing.indexOf("Inizio periodo - Formato Errato") === -1) {
                                missing.push("Inizio periodo - Formato Errato");
                            }
                            this.education[i].missingFields.da = true;
                        } else {
                            this.education[i].missingFields.da = false;
                        }
                    }

                    if (this.education[i].required.a.trim() === '' && this.education[i].required.stato == "Terminato") {
                        this.valid = 0;
                        if (missing.indexOf("Fine periodo") === -1) {
                            missing.push("Fine periodo");
                        }
                        this.education[i].missingFields.a = true;
                    } else {
                        if (!this.isChrome && !checkDateFormat('01/01/2001', this.education[i].required.a)) {
                            this.valid = 0;
                            if (missing.indexOf("Fine periodo - Formato Errato") === -1) {
                                missing.push("Fine periodo - Formato Errato");
                            }
                            this.education[i].missingFields.a = true;
                        } else {
                            this.education[i].missingFields.a = false;
                        }
                    }

                    if (this.education[i].required.competenze != '' && this.education[i].required.competenze.length > 2000) {
                        this.valid = 0;
                        if (missing.indexOf("Descrizione competenze - Limite caratteri superato") === -1) {
                            missing.push("Descrizione competenze - Limite caratteri superato");
                        }
                        this.education[i].missingFields.comp = true;
                    } else {
                        this.education[i].missingFields.comp = false;
                    }
                }

                this.$emit("isValid", [this.valid, missing]);

            },
            save() {
                this.checkRequired();

                var education = [];
                for (var i = 0; i < this.education.length; i++) {
                    education.push(this.education[i].required);
                }

                this.$emit("got", education);
            },
            addEmptyForm() {
                var emptyElement = {
                    required: {
                        ente: '',
                        stato: 'Terminato',
                        da: '',
                        a: '',
                        competenze: '',
                        voto: '',
                        ateneo: '',
                        corso: '195',
                        titolo: '',
                        filtered: []
                    },
                    missingFields: {
                        ente: false,
                        stato: false,
                        da: false,
                        a: false,
                        comp: false
                    }
                };
                this.education.push(emptyElement);
            },
            deleteObs(id) {
                this.deleting = id;
                this.$emit('alert', ["Eliminare questo elemento di formazione?", this.univoco]);
            },
            handleChoice($event) {
                if ($event[1] == this.univoco) {
                    if ($event[0]) {
                        this.education.splice(this.deleting, 1);
                        if (this.education.length <= 0) {
                            this.addEmptyForm();
                        }
                    }
                    this.deleting = 0;
                }
            }
        }
}
</script>
<style scoped>
.pad {
    padding-left: 5px;
}

.control-label {
    text-align: left;
}
</style>
