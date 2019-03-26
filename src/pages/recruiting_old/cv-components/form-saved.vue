<template>
    <div class="panel panel-default paper-shadow" style="margin-left: 10px;" data-z="0.5">
        <div class="row" id="f-saved">
            <div class="col-xs-3 col-md-4" style="text-align: right;">
                <div class="media-body">
                    <div class="media-right" style="padding: 5px 20px;">
                        <h4 class="margin-none" style="padding: 15px 0px; font-size: 32px; text-align: left;">
                            Istruzione e Formazione
                             </h4>
                        <div class="row">
                            <hr class="col-xs-6" style="border-width: 3px; border-color: #42a5f5; margin-top: 5px;">
                        </div>
                    </div>
                </div>
                <br>
            </div>
            <!--<div class ="col-md-9 col-lg-8 right-side" style="vertical-align: middle;">   -->
            <div class="panel-heading right-side pull-right">
                <div class="media v-middle hidden-xs">
                    <div class="media-right" style="float: right;">
                        <a class="btn btn-primary btn-flat" @click="edit()">AGGIUNGI <i class="fa fa-plus pad" aria-hidden="true"></i></a>
                    </div>
                </div>
            </div>
        </div>
        <div class="media v-middle visible-xs" style="margin: 0px;">
            <div class="media-right pull-right" style="padding: 0px 10px;">
                <a class="btn btn-primary btn-flat" @click="edit()">AGGIUNGI <i class="fa fa-plus pad" aria-hidden="true"></i></a>
            </div>
        </div>
        <div class="row">
            <div v-if="placeholder" class="panel panel-default paper-shadow" style="margin:20px;">
                <div class="row well" style="padding: 10px;">
                    <div class="col-xs-12 col-sm-6 col-md-4" style="padding: 0px 8px">
                        <div class="panel-body panel panel-default paper-shadow element" style="display: inherit;">
                            <div>
                                <h4>Ente</h4>
                            </div>
                            <div>
                                <h5 style="color: gray">da... - a...</h5>
                            </div>
                            <div>
                                <h5>Descrizione e competenze acquisite</h5>
                            </div>
                            <div>
                                <h5 style="color: gray">Terminato con </h5>
                                <h5><strong>90/100</strong></h5>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else class="panel panel-default paper-shadow" style="margin:20px;">
                <div class="row well" style="padding: 10px;">
                    <div v-for="(ed,index) in education" class="col-xs-12 col-sm-6 col-md-4 col-lg-3" style="padding: 0px 8px" :id="'ed'+index">
                        <div v-if="ed.editing == false" class="panel-body panel panel-default paper-shadow element" style="display: inherit;" :style="minHeight">
                            <div class="media v-middle pull-right">
                                <div class="media-right" style="float: right;">
                                    <a class="btn btn-primary btn-flat" @click="editOne(index)" style="padding: 5px 8px;"><i class="fa fa-pencil-square-o pad" aria-hidden="true"></i></a>
                                </div>
                            </div>
                            <div>
                                <h4>{{ed.ente}} <span v-if="ed.ateneo"> - Ateneo di {{ed.ateneo}}</span></h4>
                                <h5 v-if="ed.nomecorso!=null">Corso di {{ed.nomecorso}}</h5>
                            </div>
                            <div>
                                <h5 style="color: gray">{{ed.da}} - {{ed.a}}</h5>
                            </div>
                            <div>
                                <h5>{{ed.competenze}}</h5>
                            </div>
                            <div v-if="ed.stato == 'Terminato'">
                                <h5 style="color: gray">Stato: </h5>
                                <h5><strong>Terminato</strong><strong v-if="ed.voto"> con {{ed.voto}}</strong></h5>
                            </div>
                            <div v-else>
                                <h5 style="color: gray">Stato: </h5>
                                <h5><strong>In Corso</strong></h5>
                            </div>
                        </div>
                        <transition name="fade">
                            <div v-if="ed.editing == true" class="abs panel-body panel panel-default paper-shadow element" style="display: inherit; z-index: 9996; padding: 10px;" :style="minHeight" :id="'editing'+index">
                                <div class="row">
                                    <div class="col-xs-12">
                                        <div class="form-group form-control-material editInputTop">
                                            <input type="text" class="form-control editInput" style="font-size:15px;" v-model="editables[index].ente">
                                        </div>
                                    </div>
                                    <div class="col-xs-12 row" style="padding: 0px;">
                                        <span v-if="editables[index].titolo=='LA' || editables[index].titolo=='LAB'">
                                    <div class="col-xs-3" style="padding: 8px 0px;"><strong>Ateneo</strong></div>
                                    <div class="col-xs-9 form-group form-control-material editInputTop">
                                        <input type="text" class="form-control editInput" 
                                        v-model="editables[index].ateneo"> 
                                    </div></span>
                                        <span>
                                    <div class="col-xs-3" style="padding: 8px 0px;"><strong>Titolo</strong></div>
                                    <div class="col-xs-9 form-group form-control-material editInputTop">
                                        <select @change="titleChanged(index, editables[index].titolo, true)" class="form-control editInput" v-model="editables[index].titolo">
                                             <option v-for="title in titoli" :value="title.ID">{{title.nome}}</option>
                                        </select>
                                    </div></span>
                                        <span v-if="gotNames && editables[index].titolo!=''">
                                    <div class="col-xs-3" style="padding: 8px 0px;"><strong>Corso</strong></div>
                                    <div class="col-xs-9 form-group form-control-material editInputTop">
                                        <select id="select" class="form-control editInput" 
                                        v-model="editables[index].corso">
                                            <option v-for="corso in editables[index].filtered" :value="corso.id">{{corso.nome}}</option>
                                        </select>
                                    </div></span>
                                    </div>
                                    <div class="col-xs-12 row" style="padding: 0px;">
                                        <div class="col-xs-3" style="padding: 10px 0px;"><strong>Da </strong></div>
                                        <div class="col-xs-9 form-group form-control-material editInputTop">
                                            <input type="date" class="form-control editInput" v-model="editables[index].da">
                                        </div>
                                    </div>
                                    <div class="col-xs-12 row" style="padding: 0px;">
                                        <div class="col-xs-3" style="padding: 10px 0px;"><strong>A </strong></div>
                                        <div class="col-xs-9 form-group form-control-material editInputTop">
                                            <input :id="'to'+index" type="date" class="form-control editInput" v-model="editables[index].a" placeholder="gg/mm/aaaa">
                                        </div>
                                    </div>
                                    <div class="col-xs-12 row" style="padding: 0px;">
                                        <div class="col-xs-3" style="padding: 10px 0px;"><strong>Stato </strong></div>
                                        <div class="col-xs-9 form-group form-control-material editInputTop">
                                            <select @change="status(index)" id="select" class="form-control editInput" v-model="editables[index].stato">
                                                <option>Terminato</option>
                                                <option>In Corso</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div v-if="editables[index].stato == 'Terminato'" class="col-xs-12 row" style="padding: 0px; margin-bottom: 10px;">
                                        <div class="col-xs-3" style="padding: 10px 0px;"><strong>Punteggio</strong></div>
                                        <div class="col-xs-9 form-group form-control-material editInputTop">
                                            <input type="text" class="form-control editInput" v-model="editables[index].voto" placeholder="Es. 90/100">
                                        </div>
                                    </div>
                                    <div class="col-xs-12 row" style="padding: 0px; margin-bottom: 10px;">
                                        <div class="col-xs-3" style="padding: 10px 0px;"><strong>Note</strong></div>
                                        <div class="col-xs-9 form-group form-control-material editInputTop">
                                            <textarea rows="3" cols="30" class="form-control editInput" placeholder="Istruzione .." style="font-size: 12px;" v-model="editables[index].competenze"></textarea>
                                        </div>
                                    </div>
                                    <div class="col-xs-12 col-sm-4 editBtns">
                                        <a class="btn btn-primary btn-flat" @click="annulla(index)" style="padding: 5px 8px;">ANNULLA</a>
                                    </div>
                                    <div class="col-xs-12 col-sm-4 editBtns">
                                        <a class="btn btn-primary btn-flat" @click="elimina(index)" style="padding: 5px 8px;">ELIMINA</a>
                                    </div>
                                    <div class="col-xs-12 col-sm-4 editBtns">
                                        <a class="btn btn-primary btn-flat" @click="save(index)" style="padding: 5px 8px;">SALVA</a>
                                    </div>
                                </div>
                            </div>
                        </transition>
                        <div v-if="ed.editing == true" class="modal-mask"></div>
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
                this.loadFields();
                this.getCourses();
                this.getTitoli();
            });
        },
        created() {
            eventBus.$on("choice", this.handleChoice);
            this.e = eventBus._events.choice[eventBus._events.choice.length - 1];
        },
        beforeDestroy() {
            var index = eventBus._events.choice.indexOf(this.e);
            eventBus._events.choice.splice(index, 1);
        },
        data() {
            return {
                e: {},
                education: [],
                editables: [],
                placeholder: false,
                minHeight: {},

                isChrome: !!window.chrome && !!window.chrome.webstore,
                isIE: /*@cc_on!@*/ false || !!document.documentMode,

                namesToQuery: [],

                doublecheck: 0,
                titoli: [],
                courses: [],
                gotTitles: false,
                gotNames: false,

                backup: {},

                message: '',
                active: 0,
                checkSavings: false,

                univoco: 'form-saved'
            }
        },
        methods: {
            status(i) {

                var el = document.getElementById("to" + this.editables[i].id);
                if (this.editables[i].stato == "In Corso") {
                    el.setAttribute("type", 'text');
                    el.value = "Oggi";
                    this.editables[i].a = "Oggi";
                    this.editables[i].voto = '';
                    el.disabled = true;
                } else {
                    if (this.isChrome) {
                        el.setAttribute("type", 'date');
                        this.editables[i].a = "";
                    } else if (this.isIE) {
                        this.editables[i].a = "gg/mm/aaaa";
                    } else {
                        this.editables[i].a = ""
                    };
                    el.disabled = false;
                }
            },
            edit: function() {
                eventBus.$emit('EducationSwitch');
            },
            editOne(i) {
                this.toggle(i);

                var vm = this.editables[i];

                setTimeout(function() {

                    if (vm.a == 'Oggi') {
                        document.getElementById("to" + vm.id).disabled = true;
                        document.getElementById("to" + vm.id).setAttribute("type", 'text');
                        document.getElementById("to" + vm.id).value = 'Oggi';
                    } else {
                        document.getElementById("to" + vm.id).disabled = false;
                        document.getElementById("to" + vm.id).setAttribute("type", 'date');
                        document.getElementById("to" + vm.id).value = vm.a;
                    }
                }, 50)

                this.backup = $.extend(true, {}, this.editables[i]);
            },
            annulla(i) {
                this.editables[i] = this.backup;
                this.backup = {};
                this.toggle(i);
            },
            elimina(i) {
                this.editables.splice(i, 1);
                this.backup = {};
                this.toggle(i);
                this.commit();
                this.loadFields();
            },
            toggle(i, reload) {
                this.active = 0;
                var ed = [];
                ed = ed.concat(this.education);
                ed[i].editing = !ed[i].editing;
                if (ed[i].editing == true) {
                    setTimeout(function() {
                        $('#cv-inner').css('overflow-y', 'hidden');
                        document.getElementById('editing' + i).scrollIntoView();
                    }, 50);
                } else {
                    $('#cv-inner').css('overflow-y', 'auto');
                }
                this.education = ed;
                if (reload == true) {
                    this.loadFields()
                }
            },
            save(i) {
                this.active = i;
                if (this.getValues(i)) {
                    this.checkSavings = true;
                    this.$emit('alert', ["Salvare i cambiamenti correnti?", this.univoco]);
                } else {
                    this.checkSavings = false;
                    this.$emit('alert', ["L'elemento non sarà aggiornato: \n " + this.message + "\n Continuare?", this.univoco]);
                    this.message = '';
                }
            },
            getValues(i) {
                var obj;

                if (this.editables[i].ente && this.editables[i].ente.trim() != '') {

                    var check = this.checkDates(i);
                    if (check) {

                        if (this.editables[i].competenze && this.editables[i].competenze.length > 2000) {
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
                    return false
                }
            },
            handleChoice($event) {

                if ($event[1] == this.univoco) {

                    if ($event[0]) {
                        if (this.checkSavings) {
                            this.commit()
                            this.toggle(this.active, true);
                        } else {
                            this.annulla(this.active);
                        }
                    } else {
                        if (this.checkSavings) {
                            this.annulla(this.active);
                        } else {}
                    }
                    this.checkSavings = false;
                }
            },
            loadFields() {
                this.namesToQuery = [];
                if (this.$root.lsGet("education") == null) {
                    this.placeholder = true;
                } else {
                    this.editables = JSON.parse(this.$root.lsGet("education"));
                    this.education = JSON.parse(this.$root.lsGet("education"));
                    if (this.isChrome && this.education) {
                        for (var i = 0; i < this.education.length; i++) {
                            //filling education
                            this.education[i].da = this.education[i].daChromeFormat;
                            this.education[i].a = this.education[i].aChromeFormat;
                            this.education[i].editing = false;
                            if (this.education[i].corso != null && this.education[i].corso != '') {
                                this.namesToQuery.push(i);
                            }
                            //filling editables
                            if (this.editables[i].a && this.editables[i].a == 'Oggi') {
                                this.editables[i].tipo = "text";
                            } else {
                                this.editables[i].tipo = "date";
                            }
                            this.editables[i].id = i;
                        }
                        if (this.namesToQuery.length > 0) {
                            this.findName()
                        }
                    } else if (this.education) {
                        for (var i = 0; i < this.education.length; i++) {
                            this.education[i].editing = false;
                            if (this.education[i].corso != null && this.education[i].corso != '') {
                                this.namesToQuery.push(i);
                            }
                            this.editables[i].id = i;
                            this.editables[i].tipo = "text";
                            this.education[i].da = this.noChromeFormat(this.education[i].da);
                            this.editables[i].da = this.education[i].da;
                            this.education[i].a = this.noChromeFormat(this.education[i].a);
                            this.editables[i].a = this.education[i].a;
                        }
                        if (this.namesToQuery.length > 0) {
                            this.findName()
                        }
                    }
                    this.doublecheck++;
                    if (this.doublecheck == 2) {
                        this.fillTitle()
                    }
                }

                //MIN-HEIGHT ADJUST
                if (this.education) {
                    this.adjustMinH();
                }
            },
            adjustMinH() {
                var vm = this;
                var xs = window.innerWidth;
                this.$nextTick(function() {
                    setTimeout(function() {

                        var max = 0;
                        var up = true;
                        for (var i = 0; i < vm.education.length; i++) {
                            try {
                                var el = document.getElementById("ed" + i);
                                if (el.clientHeight > max) {
                                    max = el.clientHeight;
                                }
                            } catch (err) {
                                up = false;
                            }
                        }
                        if (up) {
                            if (xs >= 768) {
                                vm.minHeight = {
                                    'min-height': max + 'px'
                                };
                            } else {
                                vm.minHeight = {
                                    'min-height': 'auto'
                                };
                            }
                        }
                    }, 10)
                });
            },
            findName() {
                var ids = this.education[this.namesToQuery[0]].corso;
                for (var i = 1; i < this.namesToQuery.length; i++) {
                    ids += ';' + this.education[this.namesToQuery[i]].corso;
                }
                this.$http.get(localStorage.getItem("rec-path") + "/CorsoDiStudio?ID=" + ids, {
                    headers: {
                        token: localStorage.getItem("recruitingToken")
                    }
                }).then((response) => {

                    var res = response.body;
                    try{
                        res = JSON.parse(response.body);
                    } catch(err) {};

                    if (res && res.CorsoDiStudio) {
                        for (var i = 0; i < this.namesToQuery.length; i++) {
                            var corso = this.education[this.namesToQuery[i]].corso;
                            if (corso != 195) {
                                for (var j = 0; j < res.CorsoDiStudio.length; j++) {
                                    if (corso == res.CorsoDiStudio[j].ID) {
                                        this.education[this.namesToQuery[i]].nomecorso = res.CorsoDiStudio[j].CorsoDiStudio;

                                        this.editables[this.namesToQuery[i]].nomecorso = res.CorsoDiStudio[j].CorsoDiStudio;
                                        break;
                                    }
                                }
                            }
                        }

                        this.gotNames = true;
                        var place = [];
                        place = place.concat(this.education);
                        this.education = [];
                        this.education = place;

                        this.adjustMinH();
                    }
                });
            },
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
                            this.$root.lsGet("corsiDiStudio", JSON.stringify(this.courses));
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
                for (var i = 0; i < this.editables.length; i++) {
                    var title = this.editables[i].corso;
                    if (title) {
                        if (title == 195) {
                            this.editables[i].titolo = null;
                            this.titleChanged(i, this.editables[i].titolo);
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

                            this.editables[i].titolo = this.courses[ind].titolo;

                            this.titleChanged(i, this.editables[i].titolo);
                        }
                    }
                }
                this.gotTitles = true;
            },
            titleChanged: function(ind, title, top) {

                this.editables[ind].filtered = this.courses.filter(function(c) {
                    if (c.titolo == title) {
                        return true;
                    }
                    return false;
                });

                if (top) {
                    if (title == null) {
                        this.editables[ind].corso = 195;
                    } else {
                        this.editables[ind].corso = '';
                    }
                }
            },
            checkDates(id) {
                var str1 = this.editables[id].da;
                var str2 = this.editables[id].a;
                if (this.isChrome) {
                    return true;
                } else {
                    return checkDateFormat(str1, str2);
                }
            },
            noChromeFormat(date) {
                if (date === 'Oggi') {
                    return 'Oggi';
                }
                var d = date.split('-');
                d = d.reverse();
                date = d.join('/');
                return date;
            },
            commit() {
                var commitObj = {
                    e: this.editables,
                    chrome: this.isChrome
                };

                this.$store.commit('setEducation', commitObj);
                this.$emit("updatecv");
            }
        }
}
</script>
<style scoped>
.left-side {
    background-color: blue;
    float: none;
    display: table-cell;
}

.right-side {
    float: none;
    display: table-cell;
}

h3.marg {
    margin: 0px 0px 3px 0px;
}

.saved {
    border-bottom-style: groove;
    border-bottom-width: 2px;
}

.row {
    margin: 0px;
}

.element {
    padding: 15px;
}

.modal-mask {
    position: fixed;
    z-index: 9995;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    display: table;
    transition: opacity .3s ease;
}

.editInput {
    font-size: 13px;
    padding: 5px;
}

.editInputTop {
    height: inherit;
    margin-bottom: 5px;
    padding-top: 5px;
}

.editBtns {
    text-align: center;
    margin-bottom: 5px;
}

.editBtns > a {
    width: 76px;
}

.abs {
    position: absolute;
}

.fade-enter {
    opacity: 0;
}

.fade-enter-active {
    transition: opacity 0.5s;
}

.fade-leave-active {
    transition: opacity 0.5s;
    opacity: 0;
}
</style>
