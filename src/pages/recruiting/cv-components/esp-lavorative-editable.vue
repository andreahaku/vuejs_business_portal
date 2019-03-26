<template>
    <div class="panel panel-default paper-shadow" data-z="0.5">
        <div class="panel-heading">
            <div class="media v-middle">
                <div class="media-body">
                    <h4 class="text-headline margin-none">Esperienze Lavorative</h4>
                </div>
                <div class="media-right">
                    <span>
                <a class="btn btn-flat" :class="{'btn-primary': !unsavedToken, 'btn-warning': unsavedToken}" 
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
            <transition-group name='fade'>
                <div v-if="ed!=null" :key="ed.id" class="panel panel-default paper-shadow" style="margin-bottom: 0px;" :id="'exp-edit'+ed.id" @change="unsavedChanges = true;">
                    <div class="col-sm-3"></div>
                    <form class="form-horizontal row col-xs-12 col-md-9" style="padding: 20px; padding-bottom: 0px;">
                        <div class="form-group col-xs-12 col-md-6">
                            <label for="nome" class="col-sm-12 control-label"><strong>* </strong>Datore di Lavoro</label>
                            <div class="col-sm-12">
                                <input type="text" class="form-control" v-model="ed.datore">
                            </div>
                        </div>
                        <div class="form-group col-xs-12 col-md-6">
                            <label for="nome" class="col-sm-12 control-label"><strong>* </strong>Tipo di Impiego</label>
                            <div class="col-sm-12">
                                <input :id="'ruolo'+ed.id" type="text" class="form-control checkableInput" v-model="ed.ruolo">
                            </div>
                        </div>
                        <div class="form-group col-xs-12 col-md-6">
                            <label for="nome" class="col-sm-12 control-label"><strong>* </strong>Da</label>
                            <div class="col-sm-12">
                                <input :id="'fromExp'+ind" type="date" class="form-control checkableInput" v-model="ed.da" placeholder="gg/mm/aaaa">
                            </div>
                        </div>
                        <div class="form-group col-xs-12 col-md-6">
                            <label for="nome" class="col-sm-12 control-label" style="text-align: left;"><strong>* </strong>A</label>
                            <div class="col-xs-11" style="padding-right: 0px;">
                                <input :id="'toExp'+ind" type="date" class="form-control checkableInput" v-model="ed.a" placeholder="gg/mm/aaaa">
                            </div>
                            <div class="col-xs-1" style="padding-left: 0px;">
                                <div class="dropdown">
                                    <button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" style="background-color: #eeeeee; height: 36px;">
                                        <span class="caret" style="position: relative; top: -5px;"></span>
                                    </button>
                                    <ul class="dropdown-menu" aria-labelledby="dropdownMenu1">
                                        <li><a @click="switchType(ind,'text')">Oggi</a></li>
                                        <li><a @click="switchType(ind, 'date')">Seleziona data</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div class="form-group col-xs-12">
                            <label for="nome" class="col-sm-12 control-label">Descrizione/ Attività svolte (Max 2000 caratteri)
                                <!--
                          <span v-if="ed.attività && ed.attività!=''">{{ed.attività.length}} - 2000</span>
                          -->
                            </label>
                            <div class="col-sm-12">
                                <div class="form-group">
                                    <textarea :id="'attività'+ed.id" rows="2" cols="50" class="form-control" placeholder="Attività svolte ..." style="margin-left: 10px;" v-model="ed.attività"></textarea>
                                </div>
                            </div>
                        </div>
                    </form>
                    <div class="panel-body" style="padding-top: 0px;">
                    </div>
                </div>
            </transition-group>
            <div class="media-left visible-xs" style="margin-top: 10px;">
                <span>
                <a class="btn btn-primary btn-flat" @click="add()" style="color: #42a5f5; background-color: white;"><i class="fa fa-plus pad" aria-hidden="true"></i> </a>
            </span>
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
                experiences: [],
                e: {},
                last: 0,
                controlSaving: false,
                sure: false,

                isChrome: !!window.chrome && !!window.chrome.webstore,
                isIE: /*@cc_on!@*/ false || !!document.documentMode,

                toBeDeleted: [],


                ed: null,
                ind: 0,
                message: '',
                univoco: "esp-lavorative-editable"
            }
        },
        methods: {
            back: function() {
                var tips = document.getElementsByClassName("tooltip");
                for (var i = 0; i < tips.length; i++) {
                    tips[i].parentElement.removeChild(tips[i]);
                }

                if (this.unsavedToken) {
                    this.$emit('alert', ['Le modifiche rilevate verranno ignorate. Continuare?', this.univoco]);
                } else {
                    eventBus.$emit('WorkSwitch', {
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
                eventBus.$emit('WorkSwitch', passing);
            },
            handleChoice: function($event) {
                if ($event[1] == this.univoco) {
                    if ($event[0]) {
                        if (this.sure) {
                            this.commit()
                            this.switchTrue();
                        } else {
                            this.$store.commit('fakeCommit');
                            eventBus.$emit('WorkSwitch', {
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
            saveItem: function(id) {
                var obj;
                var ind = this.ind;

                if (this.experiences[ind].datore && this.experiences[ind].datore.trim() != '' &&
                    this.experiences[ind].ruolo && this.experiences[ind].ruolo.trim() != '') {

                    var check = this.checkDates(ind);
                    if (check) {

                        if (this.experiences[ind].attività && this.experiences[ind].attività.length > 2000) {
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
            checkDates(id) {
                var str1 = this.experiences[id].da;
                var str2 = this.experiences[id].a;
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
                    type: 'date',
                    datore: '',
                    a: ''
                }
                this.last++;
                this.experiences.push(obj);
                var id = obj.id;

                this.ed = obj;
                this.ind = this.experiences.length - 1;
            },
            switchType(id, tipo) {
                var el = document.getElementById("toExp" + id);
                //el.setAttribute("type", tipo);
                this.experiences[id].type = tipo;
                if (tipo === 'text') {
                    el.type = 'text';
                    this.experiences[id].a = 'Oggi';
                    el.disabled = true;
                } else {
                    if (this.isChrome) {
                        el.type = 'date';
                    }
                    el.type = 'text';
                    this.experiences[id].a = '';
                    el.placeholder = 'gg/mm/aaaa';
                    el.disabled = false;
                }
            },
            fillSpots() {

                this.experiences = this.$store.getters.getWorkExperiences;
                if (this.experiences == null || this.experiences.length == 0) {
                    this.experiences = [];

                } else {
                    for (var i = 0; i < this.experiences.length; i++) {
                        this.experiences[i].id = i;
                        if (this.experiences[i].a == "Oggi") {
                            this.experiences[i].type = "text";
                        } else {
                            this.experiences[i].type = "date";
                        }
                    }
                    this.listeningEnabled = true;
                    this.last = this.experiences.length - 1;
                }
                this.add();
            },
            commit() {
                if (this.isChrome) {
                    for (var i = 0; i < this.experiences.length; i++) {
                        var da = this.experiences[i].da;
                        var a = this.experiences[i].a;

                        if (da.indexOf("-") != -1) {
                            da = da.split("-")
                            da.reverse();
                            var n = da[0];
                            for (var j = 1; j < da.length; j++) {
                                n += "/" + da[j];
                            }
                            this.experiences[i].daChromeFormat = n;
                        } else {
                            this.experiences[i].daChromeFormat = 'Oggi';
                        }

                        if (a.indexOf("-") != -1) {
                            a = a.split("-")
                            a.reverse();
                            var n = a[0];
                            for (var j = 1; j < a.length; j++) {
                                n += "/" + a[j];
                            }
                            this.experiences[i].aChromeFormat = n;
                        } else {
                            this.experiences[i].aChromeFormat = 'Oggi';
                        }
                    }
                }
                this.$store.commit('setWorkExperiences', this.experiences);
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

.fade-enter {
    opacity: 0;
}

.fade-enter-active {
    animation: slide-in 0.5s ease-out forwards;
    transition: opacity 0.5s;
}

.fade-leave-active {
    animation: slide-out 0.5s ease-out forwards;
    transition: opacity 0.5s;
    opacity: 0;
    position: absolute;
}

.fade-move {
    transition: transform 0.5s;
}

@keyframes slide-in {
    from {
        transform: translateX(100px);
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
</style>
