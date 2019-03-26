<template>
    <div class="panel panel-default paper-shadow" data-z="0.5">
        <div class="panel-heading">
            <div class="media v-middle">
                <div class="media-body">
                    <h4 class="text-headline margin-none">Istruzione e Formazione</h4>
                </div>
                <div class="media-right" v-if="unsavedChanges">
                    <span>
                <a class="btn btn-primary btn-flat" :class="{'btn-primary': !unsavedChanges, 'btn-warning': unsavedChanges}" 
                @click="save()">SALVA <i class="fa fa-floppy-o pad" aria-hidden="true"></i> </a>
            </span>
                </div>
                <div class="media-right hidden-xs">
                    <span data-toggle="tooltip" data-placement="top" data-trigger="hover" title="Indietro">
                <a class="btn btn-primary btn-flat" @click="back()"><i class="fa fa-reply" aria-hidden="true"></i> </a>
            </span>
                </div>
            </div>
        </div>
        <div class="panel-body bg-cv" style="padding: 10px;">
            <transition-group name='roll-fade'>
                <div v-if="ed!=null" :key="ed.id" class="panel panel-default paper-shadow" style="margin-bottom: 0px;" :id="'ed-edit'+ed.id" @change="unsavedChanges = true;">
                    <div class="col-sm-3"></div>
                    <form class="form-horizontal row col-xs-12 col-md-9" style="padding: 20px; padding-bottom: 0px;">
                        <div v-if="gotTitles" class="form-group col-xs-12 col-md-6">
                            <label for="nome" class="col-sm-12 control-label"><strong>* </strong>Titolo di studio</label>
                            <div class="col-sm-12">
                                <select @change="titleChanged(ind, ed.titolo, true)" id="select" class="form-control checkableInput" v-model="ed.titolo">
                                    <option v-for="title in titoli" :value="title.ID">{{title.nome}}</option>
                                </select>
                            </div>
                        </div>
                        <div v-if="gotCourses && ed.titolo!=''" class="form-group col-xs-12 col-md-6">
                            <label for="nome" class="col-sm-12 control-label">Corso di studio</label>
                            <div class="col-sm-12">
                                <select id="select" class="form-control checkableInput" v-model="ed.corso">
                                    <option v-for="corso in ed.filtered" :value="corso.id">{{corso.nome}}</option>
                                </select>
                            </div>
                        </div>
                        <div v-if="ed.titolo!=''" class="form-group col-xs-12 col-md-6">
                            <label for="nome" class="col-sm-12 control-label">Stato</label>
                            <div class="col-sm-12">
                                <select @change="status(ind)" id="select" class="form-control checkableInput" v-model="ed.stato">
                                    <option>Terminato</option>
                                    <option>In Corso</option>
                                </select>
                            </div>
                        </div>
                        <div v-if="ed.titolo!=''" class="form-group col-xs-12 col-md-6">
                            <label for="nome" class="col-sm-12 control-label"><strong>* </strong>Nome e tipo di organizzazione</label>
                            <div class="col-sm-12">
                                <input :id="'ente'+ed.id" type="text" class="form-control checkableInput" v-model="ed.ente">
                            </div>
                        </div>
                        <div v-if="ed.titolo!=''" class="form-group col-xs-12 col-md-6">
                            <label for="nome" class="col-sm-12 control-label"><strong>* </strong>Inizio Periodo</label>
                            <div class="col-sm-12">
                                <input :id="'from'+ed.id" type="date" class="form-control checkableInput" v-model="ed.da" placeholder="gg/mm/aaaa">
                            </div>
                        </div>
                        <div v-if="ed.titolo!=''" class="form-group col-xs-12 col-md-6">
                            <label for="nome" class="col-sm-12 control-label"><strong>* </strong>Fine Periodo</label>
                            <div class="col-sm-12" style="padding-right: 0px;">
                                <input :id="'to'+ed.id" type="date" class="form-control checkableInput" v-model="ed.a" placeholder="gg/mm/aaaa">
                            </div>
                        </div>
                        <div v-if="ed.titolo=='LA' || ed.titolo=='LAB'" class="form-group col-xs-12 col-md-6">
                            <label for="nome" class="col-sm-12 control-label">Ateneo</label>
                            <div class="col-sm-12">
                                <input :id="'at'+ed.id" type="text" class="form-control checkableInput" v-model="ed.ateneo" placeholder="Bologna, Milano...">
                            </div>
                        </div>
                        <div v-if="ed.stato == 'Terminato' && ed.titolo!=''" class="form-group col-xs-12 col-md-6">
                            <label for="nome" class="col-sm-12 control-label">Punteggio</label>
                            <div class="col-sm-12">
                                <input :id="'voto'+ed.id" type="text" class="form-control checkableInput" v-model="ed.voto" placeholder="ottenuto/massimo. Es. 90/100">
                            </div>
                        </div>
                        <div v-if="ed.titolo!=''" class="form-group col-xs-12">
                            <label for="nome" class="col-sm-12 control-label">Competenze Acquisite e altre note (Max 2000 caratteri)
                                <!--
                          <span v-if="ed.competenze && ed.competenze!=''">{{ed.competenze.length}} - 2000</span>
                          -->
                            </label>
                            <div class="col-sm-12">
                                <div class="form-group">
                                    <textarea :id="'competenze'+ed.id" rows="2" cols="50" class="form-control checkableInput" placeholder="Istruzione .." style="margin-left: 10px;" v-model="ed.competenze"></textarea>
                                </div>
                            </div>
                        </div>
                    </form>
                    <div class="panel-body" style="padding-top: 0px;">
                    </div>
                </div>
            </transition-group>
            <div class="media-left visible-xs" style="margin-top: 10px;">
                <span data-toggle="tooltip" data-placement="top" data-trigger="hover" title="Indietro" style="margin-left: 10px;">
                <a class="btn btn-primary btn-flat" @click="back()" style="color: #42a5f5; background-color: white;"><i class="fa fa-reply" aria-hidden="true"></i> </a>
            </span>
            </div>
        </div>
    </div>
</template>
<script>
import {
    eventBus
} from '../../../eventbus.js';
import {
    changesDetectorMixin
} from './changesDetectorMixin.js';

export default {
    mounted() {
            this.$nextTick(function() {
                this.fillSpots();
                this.getCourses();
                this.getTitoli();
            });
        },
        mixins: [changesDetectorMixin],
        created() {
            eventBus.$on("choice", this.handleChoice);
            this.e = eventBus._events.choice[eventBus._events.choice.length - 1];
        },
        beforeDestroy() {
            var index = eventBus._events.choice.indexOf(this.e);
            eventBus._events.choice.splice(index, 1);
        },
        data: function() {
            return {
                e: {},
                education: [],
                last: 0,
                invalid: false,
                controlSaving: false,
                sure: false,

                isChrome: !!window.chrome && !!window.chrome.webstore,

                toBeDeleted: [],
                gotCourses: false,
                courses: [],

                gotTitles: false,
                titoli: [],
                doublecheck: 0,

                ed: null,
                ind: 0,
                message: '',
                univoco: "form-editable"
            }
        },
        methods: {
            titleChanged: function(ind, title, top) {

                this.education[ind].filtered = this.courses.filter(function(c) {
                    if (c.titolo == title) {
                        return true;
                    }
                    return false;
                });

                if (top) {
                    if (title == null) {
                        this.education[ind].corso = 195;
                    } else {
                        this.education[ind].corso = '';
                    }
                }
            },
            back: function() {
                var tips = document.getElementsByClassName("tooltip");
                for (var i = 0; i < tips.length; i++) {
                    tips[i].parentElement.removeChild(tips[i]);
                }
                if (this.unsavedToken) {

                    this.$emit('alert', ['Le modifiche rilevate verranno ignorate. Continuare?', this.univoco]);
                } else {
                    eventBus.$emit('EducationSwitch', {
                        switch: false
                    });
                }
            },
            switchTrue() {
                var passing = {
                    switch: true
                };
                if (this.toBeDeleted.length > 0) {
                    passing.delete = this.toBeDeleted
                }
                eventBus.$emit('EducationSwitch', passing);
            },
            handleChoice: function($event) {

                if ($event[1] == this.univoco) {

                    if ($event[0]) {
                        if (this.sure) {
                            this.commit()
                            this.switchTrue();
                        } else {
                            this.$store.commit('fakeCommit');
                            eventBus.$emit('EducationSwitch', {
                                switch: false
                            });
                        }
                    }
                    if (this.sure) {
                        this.sure = false;
                    }
                }
            },
            save: function() {

                if (!this.saveItem()) {
                    this.$emit('alert', ["Il componente non risulta valido e non verrà inserito, Continuare?", this.univoco]);
                } else {
                    if (this.unsavedChanges) {
                        this.sure = true;
                        this.$emit('alert', ["Aggiungere il nuovo elemento?", this.univoco]);
                    } else {
                        this.commit();
                        this.switchTrue()
                    }
                }
            },
            saveItem: function() {
                var obj;
                var ind = this.ind;

                if (this.education[ind].ente && this.education[ind].ente.trim() != '') {

                    var check = this.checkDates(ind);
                    if (check) {

                        if (this.education[ind].competenze && this.education[id].competenze.length > 2000) {
                            this.message = "Limite caratteri (2000) superato nel campo Descrizione";
                            return false;
                        } else {
                            return true;
                        }

                    } else {
                        this.message = "Formato data non corretto";
                        return false;
                    }
                } else {
                    this.message = "Campo 'Nome organizzazione' mancante";
                    return false;
                }
            },
            checkDates(id) {
                var str1 = this.education[id].da;
                var str2 = this.education[id].a;
                if (this.isChrome) {
                    return true;
                } else {
                    return checkDateFormat(str1, str2);
                }
            },
            add() {
                var obj = {
                    id: this.last + 1,
                    deleteFlag: false,
                    tipo: 'date',
                    stato: 'Terminato',
                    da: '',
                    a: '',
                    corso: null,
                    titolo: '',
                    filtered: []
                }
                this.last++;
                this.education.push(obj);

                this.ed = obj;
                this.ind = this.education.length - 1;
            },
            trash(id) {
                var i = id;
                var ind;
                try {
                    this.education.find(function(ed, index) {
                        if (ed.id == i) {
                            ind = index;
                            return true;
                        }
                        return false;
                    })
                } catch (err) {
                    for (var j = 0; j < this.education.length; j++) {
                        if (this.education[j].id == i) {
                            ind = j;
                            break;
                        }
                    }
                }
                if (this.education[ind].DBID && this.education[ind].DBID != '') {
                    this.toBeDeleted.push(this.education[ind].DBID);
                }
                this.education.splice(ind, 1);
                this.unsavedChanges = true;
                if (this.education.length == 0) {
                    this.add();
                }

            },
            status(i) {
                var el = document.getElementById("to" + this.education[i].id);
                if (this.education[i].stato == "In Corso") {
                    el.setAttribute("type", 'text');
                    el.value = "Oggi";
                    this.education[i].a = "Oggi";
                    this.education[i].voto = '';
                    el.disabled = true;
                } else {
                    el.setAttribute("type", 'date');
                    el.value = "";
                    this.education[i].a = "";
                    el.disabled = false;
                }
            },
            fillSpots() {
                this.education = this.$store.getters.getEducation;
                if (this.education == null || this.education.length == 0) {
                    this.education = [];
                } else {
                    for (var i = 0; i < this.education.length; i++) {
                        this.education[i].id = i;
                        if (this.education[i].a && this.education[i].a == 'Oggi') {
                            this.education[i].tipo = "text";
                            let vm = this.education[i].id;

                        } else {
                            this.education[i].tipo = "date";
                        }
                    }
                }
                this.add();
                this.doublecheck++;
                if (this.doublecheck == 2) {
                    this.fillTitle()
                }
                this.listeningEnabled = true;
                this.last = this.education.length - 1;
            },
            commit() {
                var commitObj = {
                    e: this.education,
                    chrome: this.isChrome
                };
                if (this.toBeDeleted.length > 0) {
                    commitObj.delete = this.toBeDeleted;
                }
                this.$store.commit('setEducation', commitObj);
            },

            //get courses
            getCourses() {
                var token = localStorage.getItem("recruitingToken");
                if (this.$root.lsGet("corsiDiStudio") != null) {
                    this.courses = JSON.parse(this.$root.lsGet("corsiDiStudio"));
                    this.gotCourses = true;
                    this.doublecheck++;
                    if (this.doublecheck == 2) {
                        this.fillTitle()
                    }
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
                            this.doublecheck++;
                            if (this.doublecheck == 2) {
                                this.fillTitle()
                            }
                            this.$root.lsSet("corsiDiStudio", JSON.stringify(this.courses));
                        }
                    })
                }
            },
            getTitoli() {
                var token = localStorage.getItem("recruitingToken");
                var get = this.$store.getters.getLevels;
                if (get != null && get.length > 0) {
                    this.titoli = get;
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
                }
            },
            fillTitle() {
                this.doublecheck = 0;
                for (var i = 0; i < this.education.length; i++) {
                    var title = this.education[i].corso;
                    if (title) {
                        if (title == 195) {
                            this.education[i].titolo = null;
                            this.titleChanged(i, this.education[i].titolo);
                        } else {
                            var ind = -1;
                            try {
                                ind = this.courses.findIndex(function(item) {
                                    if (item.id == title) {
                                        return true;
                                    }
                                    return false;
                                })
                            } catch (err) {
                                this.courses.some(function(item, index) {
                                    if (item.id == title) {
                                        ind = index;
                                        return true;
                                    }
                                    return false;
                                })
                            }

                            this.education[i].titolo = this.courses[ind].titolo;

                            this.titleChanged(i, this.education[i].titolo);
                        }
                    }
                }
                this.gotTitles = true;
            }
        }
}
</script>
<style scoped>
.top-adj {
    margin-top: 5px;
}

.control-label {
    text-align: left;
}
</style>
