<template>
    <div class="panel panel-default paper-shadow" style="margin-left: 10px;" data-z="0.5">
        <div class="row" id="e-saved">
            <div class="col-xs-3 col-md-4" style="text-align: right;">
                <div class="media-body">
                    <div class="media-right" style="padding: 5px 20px;">
                        <h4 class="margin-none" style="padding: 15px 0px; font-size: 32px; text-align: left;">
                            Esperienze Lavorative
                             </h4>
                        <div class="row">
                            <hr class="col-xs-6" style="border-width: 3px; border-color: #42a5f5; margin-top: 5px;">
                        </div>
                    </div>
                </div>
                <br>
            </div>
            <!--<div class ="col-md-9 col-lg-8 right-side" style="vertical-align: middle;">   -->
            <div class="panel-heading right-side pull-right hidden-xs">
                <div class="media v-middle">
                    <div class="media-right hidden-xs" style="float: right;">
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
                                <h4>Ruolo</h4>
                            </div>
                            <div>
                                <h5 style="color: gray">da... - a...</h5>
                            </div>
                            <div>
                                <h5>Descrizione e attività</h5>
                            </div>
                            <div>
                                <h5 style="color: gray">Presso </h5>
                                <h5><strong>...Datore</strong></h5>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else class="panel panel-default paper-shadow" style="margin:20px;">
                <div class="row well" style="padding: 10px;">
                    <div v-for="(work,index) in experiences" class="col-xs-12 col-sm-6 col-md-4 col-lg-3" style="padding: 0px 8px" :id="'exp'+index">
                        <div v-if="work.editing == false" class="panel-body panel panel-default paper-shadow element" style="display: inherit;" :style="minHeight">
                            <div class="media v-middle pull-right">
                                <div class="media-right" style="float: right;">
                                    <a class="btn btn-primary btn-flat" @click="editOne(index)" style="padding: 5px 8px;"><i class="fa fa-pencil-square-o pad" aria-hidden="true"></i></a>
                                </div>
                            </div>
                            <div>
                                <h4>{{work.ruolo}}</h4>
                            </div>
                            <div>
                                <h5 style="color: gray">{{work.da}} - {{work.a}}</h5>
                            </div>
                            <div>
                                <h5>{{work.attività}}</h5>
                            </div>
                            <div>
                                <h5 style="color: gray">Presso </h5>
                                <h5><strong>{{work.datore}}</strong></h5>
                            </div>
                        </div>
                        <transition name="fade">
                            <div v-if="work.editing == true" class="abs panel-body panel panel-default paper-shadow element" style="display: inherit; z-index: 9996; padding: 10px;" :style="minHeight" :id="'editing'+index">
                                <div class="row">
                                    <div class="col-xs-12">
                                        <div class="form-group form-control-material editInputTop">
                                            <input type="text" class="form-control editInput" style="font-size:15px;" v-model="editables[index].datore">
                                        </div>
                                    </div>
                                    <div class="col-xs-12 row" style="padding: 0px;">
                                        <span>
                                    <div class="col-xs-3" style="padding: 8px 0px;"><strong>Impiego</strong></div>
                                    <div class="col-xs-9 form-group form-control-material editInputTop">
                                        <input type="text" class="form-control editInput" 
                                        v-model="editables[index].ruolo"> 
                                    </div></span>
                                        <span>
                                    <div class="col-xs-3" style="padding: 8px 0px;"><strong>Da</strong></div>
                                    <div class="col-xs-9 form-group form-control-material editInputTop">
                                        <input type="date" class="form-control editInput" 
                                        v-model="editables[index].da" placeholder="gg/mm/aaaa"> 
                                    </div></span>
                                        <span>
                                    <div class="col-xs-3" style="padding: 8px 0px;"><strong>A</strong></div>
                                    <div class="col-xs-7 form-group form-control-material editInputTop">
                                        
                                        <input v-if="editables[index].a!='Oggi'" 
                                           :id="'toExp'+editables[index].id" type="date" class="form-control editInput" v-model="editables[index].a"
                                           placeholder="gg/mm/aaaa">
                                        <input v-else
                                            :id="'toExp'+editables[index].id" type="text" class="form-control editInput" v-model="editables[index].a" disable>
                                        
                                    </div>
                                    <div class="col-xs-2" style="padding-left: 0px;">
                                        <div class="dropdown">
                                          <button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" style="background-color: #eeeeee; height: 36px; margin-left: 5px;">
                                            <span class="caret" style="position: relative; top: -5px;"></span>
                                        </button>
                                        <ul class="dropdown-menu datedrop" aria-labelledby="dropdownMenu1">
                                            <li><a @click="switchType(index,'text')">Oggi</a></li>
                                            <li><a @click="switchType(index, 'date')">Seleziona data</a></li>
                                        </ul>
                                    </div>
                                </div>
                                </span>
                            </div>
                            <div class="col-xs-12 row" style="padding: 0px; margin-bottom: 10px;">
                                <div class="col-xs-3" style="padding: 10px 0px;"><strong>Note</strong></div>
                                <div class="col-xs-9 form-group form-control-material editInputTop">
                                    <textarea rows="5" cols="30" class="form-control editInput" placeholder="Attività svolte.." style="font-size: 12px;" v-model="editables[index].attività"></textarea>
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
                <div v-if="work.editing == true" class="modal-mask"></div>
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
                editables: [],
                experiences: [],
                placeholder: false,
                minHeight: {},

                isChrome: !!window.chrome && !!window.chrome.webstore,
                isIE: /*@cc_on!@*/ false || !!document.documentMode,

                backup: {},

                message: '',
                active: 0,
                checkSavings: false,

                univoco: 'esp-lavorative-saved'
            }
        },
        methods: {
            edit: function() {
                eventBus.$emit('WorkSwitch');
            },
            editOne(i) {
                this.toggle(i);

                let vm = this.editables[i];
                setTimeout(function() {
                    if (vm.a == 'Oggi') {
                        document.getElementById("toExp" + vm.id).disabled = true;
                        document.getElementById("toExp" + vm.id).setAttribute("type", 'text');
                        document.getElementById("toExp" + vm.id).value = 'Oggi';
                    } else {
                        document.getElementById("toExp" + vm.id).setAttribute("type", 'date');
                        document.getElementById("toExp" + vm.id).disabled = false;
                        document.getElementById("toExp" + vm.id).value = vm.a;
                    }
                }, 50)

                this.backup = $.extend(true, {}, this.editables[i]);
            },
            loadFields() {
                if (this.$root.lsGet("experiences") == null) {
                    this.placeholder = true;
                } else {
                    this.experiences = JSON.parse(this.$root.lsGet("experiences"));
                    this.editables = JSON.parse(this.$root.lsGet("experiences"));
                    if (this.isChrome) {
                        for (var i = 0; i < this.experiences.length; i++) {
                            this.experiences[i].da = this.experiences[i].daChromeFormat;
                            this.experiences[i].a = this.experiences[i].aChromeFormat;
                            this.experiences[i].editing = false;
                        }
                    } else {
                        for (var i = 0; i < this.experiences.length; i++) {
                            this.experiences[i].editing = false;
                            this.experiences[i].da = this.noChromeFormat(this.experiences[i].da);
                            this.editables[i].da = this.experiences[i].da;
                            this.experiences[i].a = this.noChromeFormat(this.experiences[i].a);
                            this.editables[i].a = this.experiences[i].a;
                        }
                    }
                    if (this.experiences.length > 0) {
                        this.adjustMinH();
                    }
                }

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
                ed = ed.concat(this.experiences);
                ed[i].editing = !ed[i].editing;
                if (ed[i].editing == true) {
                    setTimeout(function() {
                        $('#cv-inner').css('overflow-y', 'hidden');
                        document.getElementById('editing' + i).scrollIntoView();
                    }, 50);
                } else {
                    $('#cv-inner').css('overflow-y', 'auto');
                }
                this.experiences = ed;
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

                if (this.editables[i].datore && this.editables[i].datore.trim() != '' &&
                    this.editables[i].ruolo && this.editables[i].ruolo.trim() != '') {

                    var check = this.checkDates(i);
                    if (check) {

                        if (this.editables[i].attività && this.editables[i].attività.length > 2000) {
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
                    this.message = "Campo 'Datore' o 'Impiego' mancante";
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
            checkDates(id) {
                var str1 = this.editables[id].da;
                var str2 = this.editables[id].a;
                if (this.isChrome) {
                    return true;
                } else {
                    return checkDateFormat(str1, str2);
                }
            },
            commit() {
                if (this.isChrome) {
                    for (var i = 0; i < this.editables.length; i++) {
                        var da = this.editables[i].da;
                        var a = this.editables[i].a;

                        if (da.indexOf("-") != -1) {
                            da = da.split("-")
                            da.reverse();
                            var n = da[0];
                            for (var j = 1; j < da.length; j++) {
                                n += "/" + da[j];
                            }
                            this.editables[i].daChromeFormat = n;
                        } else {
                            this.editables[i].daChromeFormat = 'Oggi';
                        }

                        if (a.indexOf("-") != -1) {
                            a = a.split("-")
                            a.reverse();
                            var n = a[0];
                            for (var j = 1; j < a.length; j++) {
                                n += "/" + a[j];
                            }
                            this.editables[i].aChromeFormat = n;
                        } else {
                            this.editables[i].aChromeFormat = 'Oggi';
                        }
                    }
                }
                this.$store.commit('setWorkExperiences', this.editables);
                this.$emit("updatecv");
            },
            switchType(id, tipo) {
                var el = document.getElementById("toExp" + this.editables[id].id);
                //el.setAttribute("type", tipo);
                this.editables[id].type = tipo;
                if (tipo === 'text') {
                    this.editables[id].a = 'Oggi';
                    el.disabled = true;
                } else {
                    if (this.isIE) {
                        this.editables[id].a = 'gg/mm/aaaa';
                    } else {
                        this.editables[id].a = '';
                    }

                    el.placeholder = 'gg/mm/aaaa';
                    el.disabled = false;
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
            adjustMinH() {
                var vm = this;
                var xs = window.innerWidth;
                this.$nextTick(function() {
                    setTimeout(function() {

                        var max = 0;
                        for (var i = 0; i < vm.experiences.length; i++) {
                            var el = document.getElementById("exp" + i);
                            if (el.clientHeight > max) {
                                max = el.clientHeight;
                            }
                        }
                        if (xs >= 768) {
                            vm.minHeight = {
                                'min-height': max + 'px'
                            };
                        } else {
                            vm.minHeight = {
                                'min-height': 'auto'
                            };
                        }
                    }, 10)
                });
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

.datedrop {
    position: absolute;
    left: -125px;
}
</style>
