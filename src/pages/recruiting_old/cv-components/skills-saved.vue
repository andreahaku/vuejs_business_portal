<template>
    <div class="panel panel-default paper-shadow" style="margin-left: 10px;" data-z="0.5">
        <div class="row">
            <div class="col-xs-3 col-md-4" style="text-align: right;">
                <div class="media-body">
                    <div class="media-right" style="padding: 5px 20px;">
                       
                        <h4 class="margin-none" style="padding: 15px 0px; font-size: 32px; text-align: left;">
                            Capacità e Competenze
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
                <div class="media v-middle">
                    <div v-if="!editing" class="media-right hidden-xs" style="float: right;">
                        <a class="btn btn-primary btn-flat" @click="addOne()">AGGIUNGI <i class="fa fa-plus pad" aria-hidden="true"></i></a>
                    </div>
                    <div v-else class="media-right hidden-xs" style="float: right;">
                        <a class="btn btn-primary btn-flat" @click="toggle()"><i class="fa fa-reply pad" aria-hidden="true"></i></a>
                    </div>
                    <div v-if="!editing && gotReqName" class="media-right hidden-xs" style="float: right;">
                        <a class="btn btn-primary btn-flat" @click="edit()">MODIFICA <i class="fa fa-pencil-square-o pad" aria-hidden="true"></i></a>
                    </div>
                    <div v-else-if="gotReqName" class="media-right hidden-xs" style="float: right;">
                        <a class="btn btn-primary btn-flat" @click="save()">SALVA <i class="fa fa-floppy-o pad" aria-hidden="true"></i></a>
                    </div>
                </div>
            </div>
        </div>
        <div class="media v-middle" style="margin-top: 0px;">
            <div v-if="!editing" class="media-right visible-xs" style="float: right; padding: 0px 10px;">
                <a class="btn btn-primary btn-flat" @click="addOne()">AGGIUNGI <i class="fa fa-plus pad" aria-hidden="true"></i></a>
            </div>
            <div v-else class="media-right visible-xs" style="float: right; padding: 0px 10px;">
                <a class="btn btn-primary btn-flat" @click="toggle()"><i class="fa fa-reply pad" aria-hidden="true"></i></a>
            </div>
            <div v-if="!editing && gotReqName" class="media-right visible-xs" style="padding: 0px 10px;">
                <a class="btn btn-primary btn-flat" @click="edit()">MODIFICA <i class="fa fa-pencil-square-o pad" aria-hidden="true"></i></a>
            </div>
            <div v-else-if="gotReqName" class="media-right visible-xs" style="float: right; padding: 0px 10px;">
                <a class="btn btn-primary btn-flat" @click="save()">SALVA <i class="fa fa-floppy-o pad" aria-hidden="true"></i></a>
            </div>
        </div>
        
           <!-- <div class="hidden-xs hidden-sm
               col-xs-4 col-sm-2 left-side-skills" v-show="skills!=null && skills.length > 0">

                <div class="media-body">
                    <div class="media-right">
                       <!--
                        <h5 class="text-headline margin-none">Capacità Personali
                             </h5>
                        <div class="row">
                            <hr class="col-xs-6" style="border-width: 3px; border-color: #42a5f5; margin-top: 5px;">
                        </div> 
                    </div>
                </div>    
            </div> 
            <br class="visible-xs">-->
            
            <!-- unclassified skills 
            <div class="col-xs-8 col-sm-8 col-md-9 right-side container-fluid" style="padding-top: 5px;" v-show="skills.pers!=null && skills.pers.length > 0">
                <div class="panel-body panel panel-default element row" v-for="skill in skills.pers">
                    <span class="col-xs-12 col-md-6"><strong><h4 style="margin: 0px; margin-bottom:15px;">
                            <i class="fa fa-circle hidden-xs" style="padding-right: 10px;"></i>{{skill.nome}}</h4></strong>
                            </span>

                    <div class="col-xs-12 col-md-6 progress" style="padding: 0px; height: 20px;">
                        <div class="progress-bar" role="progressbar" aria-valuenow="skill.livello" aria-valuemin="0" :aria-valuemax="skill.livLength" :style="{'width': skill.livello*(100/skill.livLength)+'%'}">
                            <p v-if="skill.livello >= 2">{{skill.livDesc}}</p>
                        </div>
                        <p v-if="skill.livello < 2" style="text-align: center; color: #42a5f5; margin-top: 2px;">{{skill.livDesc}}</p>
                    </div>
                    <br>
                    <div v-if="skill.note && skill.note!=''" class="col-sm-12 hidden-xs" style="padding-top: 5px;">
                        <p v-html="'<strong>Dettagli: </strong>'+skill.note"></p>
                    </div>
                    <div v-if="skill.note && skill.note!='' && skill.note!=null" class="col-sm-12 visible-xs" style="margin-bottom: 10px;">
                        <p v-html="'<strong>Dettagli: </strong>'+skill.note"></p>
                    </div>
                </div>
            </div>
            <hr v-if="skills.pers!=null && skills.pers.length > 0 && skills.prof!=null && skills.prof.length > 0" /> -->

            <div style="padding: 25px 20px;" v-show="skills!=null && skills.length > 0">
                <div class="panel-body panel panel-default element row" v-for="(skill, index) in skills">
                    <span class="col-xs-12 col-md-6">
                           <span :class="{'col-xs-12': !editing, 'col-xs-10': editing}" style="padding-left: 0px;">
                               <strong><h4 style="margin: 0px; margin-bottom:15px;">
                               <i class="fa fa-circle hidden-xs" style="padding-right: 10px;"></i>{{skill.nome}}</h4></strong>
                           </span>
                           <span v-if="editing" class="col-xs-2">
                               <a class="btn btn-primary btn-flat" @click="trash(index)"><i class="fa fa-trash pad" aria-hidden="true"></i></a>
                           </span>
                    </span>
                    
                    <div v-if="!editing" class="col-xs-12 col-md-6 progress" style="padding: 0px; height: 20px;">
                        <div class="progress-bar" role="progressbar" aria-valuenow="skill.livello" aria-valuemin="0" :aria-valuemax="skill.livLength" :style="{'width': skill.livello*(100/skill.livLength)+'%'}">
                            <p v-if="skill.livello >= 2">{{skill.livDesc}}</p>
                        </div>
                        <p v-if="skill.livello < 2" style="text-align: center; color: #42a5f5; margin-top: 2px;">{{skill.livDesc}}</p>
                    </div>
                    <transition name="roll-fade">
                        <div v-if="editing">
                             <div class="col-xs-12 col-sm-10 col-md-5" style="margin-top: 7px;">
                                 <input type="range" min='1' :max="editables[index].itemVals.length"
                                 v-model="editables[index].livello" 
                                 :id="'ieIndex'+index" @mouseup="leaveIE(index)"> 
                             </div>
                             <div class="col-xs-12 col-sm-2 col-md-1" style="margin-top:5px;">
                             {{editables[index].itemVals[editables[index].livello-1].desc}}</div>
                        </div>
                    </transition>
                    <br>
                    <div v-if="!editing && skill.note && skill.note!='' && skill.note.trim()!=''" class="col-sm-12 hidden-xs" style="padding-top: 5px;">
                        <p v-html="'<strong>Dettagli: </strong>'+skill.note"></p>
                    </div>
                    <div v-if="!editing && skill.note && skill.note!='' && skill.note.trim()!=''" class="col-sm-12 visible-xs" style="margin-bottom: 10px;">
                        <p v-html="'<strong>Dettagli: </strong>'+skill.note"></p>
                    </div>
                    <div v-if="editing" class="col-xs-12 row" style="padding: 0px; margin-bottom: 0px;">
                        <div class="col-xs-12 col-sm-2" style="padding: 10px;"><strong>Dettagli</strong></div>
                        <div class="col-xs-12 col-sm-10 form-group form-control-material editInputTop">
                            <textarea rows="2" cols="50" class="form-control editInput" placeholder="Descrizione .." style="font-size: 13px; padding-top: 15px;"
                            v-model="editables[index].note"></textarea>
                        </div>
                    </div>
                </div>
            </div>

            <hr v-if="(skills!=null && skills.length > 0)" />
            <div class="col-xs-4 col-sm-4 col-md-3 left-side-skills">
                <div class="media-body">
                    <div class="media-right">
                        <h5 class="text-headline margin-none">Conoscenze Linguistiche
                             </h5>
                        <div class="row">
                            <hr class="col-xs-6" style="border-width: 3px; border-color: #42a5f5; margin-top: 5px;">
                        </div>
                    </div>
                </div>
            </div>
            <br class="visible-xs">
            <div class="col-xs-8 col-sm-8 col-md-9 right-side container-fluid" style="padding-top: 5px; padding-bottom: 10px;">
                <div class="panel-body panel panel-default element row lang-label">
                    <span><h4> <strong class="lab">Madrelingua: </strong>{{madrelingua}}</h4>
                            </span>
                </div>
                
                <div class="panel-body panel panel-default element language row" v-for="lang in langs">
                    <span class="col-xs-12"><strong><h4><i class="fa fa-circle hidden-xs" style="padding-right: 10px;"></i>
                            {{lang.lingua}}</h4></strong>
                            </span>
                    <span class="col-xs-12 col-sm-6 voce"><strong class="lab">Comprensione:</strong>{{lang.comprensione}}
                            </span>
                    <span class="col-xs-12 col-sm-6 voce"><strong class="lab">Parlato:</strong>{{lang.parlato}}
                            </span>
                    <span v-if="lang.livello.trim()!=''" class="col-xs-12 col-sm-6 voce"><strong class="lab">Certificazione:</strong>{{lang.livello}}
                            </span>
                </div>
            </div>
            
        </div>
    
</template>
<script>
    
import { eventBus } from '../../../eventbus.js';
import { requirementsHandlerMixin } from './requirementsHandlerMixin.js';

export default {
    mounted() {
            this.$nextTick(function() {
                this.loadFields();
            });
        },
        mixins : [requirementsHandlerMixin],
        created(){
            eventBus.$on("choice", this.handleChoice);
            this.e = eventBus._events.choice[eventBus._events.choice.length -1];
        },
        beforeDestroy(){
            var index = eventBus._events.choice.indexOf(this.e);
            eventBus._events.choice.splice(index, 1);
        },
        data() {
            return {
                skills: {},
                placeholders: false,
                valid: 1,

                langs: [],
                madrelingua: 'Italiana',

                usualLevels: ['Basso', 'Medio-Basso', 'Medio', 'Medio-Alto', 'Alto'],

                gotReqName: false,
                gotLevelDesc: false,
                gotLevelCount: 0,
                gotReqCount: 0,

                skillsToQuery: [],
                
                editing: false,
                editables: [],
                backup: [],
                
                univoco: 'skill-saved',
                e: {},
                
                trashing: -1,
                isIE: /*@cc_on!@*/false || !!document.documentMode
            }
        },
        methods: {
            leaveIE(i){
                if(this.isIE){
                    this.editables[i].livello = document.getElementById('ieIndex'+i).value;
                }
            },
            addOne: function() {
                eventBus.$emit('SkillSwitch');
            },
            edit(){ 
                this.editing = true;
                this.editables = []
                this.editables = this.editables.concat(this.skills)
            },
            trash(i){
                this.trashing = i;
                this.$emit('alert', ["Eliminare questo elemento?", this.univoco]);
            },
            toggle(){ 
                this.editing = false; 
                if(this.backup.length > 0){
                    for(var i = 0; i < this.skills.length; i++){
                        this.skills[i].livello = this.backup[i].lv;
                        this.skills[i].note = this.backup[i].desc;
                    }
                }
            },
            save(){
                this.$emit('alert', ["Salvare i cambiamenti correnti?", this.univoco]);
            },
            handleChoice($event){
               
                if($event[1] == this.univoco){
                  
                    if($event[0]){
                        if(this.trashing != -1){
                            this.editables.splice(this.trashing,1);
                            this.backup.splice(this.trashing,1);
                            this.commit();
                        } else {
                            this.commit();
                            this.$emit("updatecv");
                            this.backup = [];
                        }
                        this.trashing = -1;
                    }
                    this.toggle();
                }
            },
            loadFields() {
                this.skills = this.$store.getters.getSkills;
                if (this.skills == null || this.skills == {}) {
                    this.skills = [];
                    /*
                    this.skills = {
                        pers: [],
                        prof: []
                    }; */
                    //this.skills.pers.push({
                    this.skills.push({
                        nome: "Es5",
                        livello: 3,
                        livDesc: 'Medio',
                        livLength: 5
                    })
                    //this.skills.prof.push({
                    this.skills.push({
                        nome: "Esempio: Photoshop",
                        livello: 3,
                        livDesc: 'Medio',
                        livLength: 5
                    })
                    
                    this.valid = false;
                    this.placeholders = true;
                } else {
                    /*
                    for (var i = 0; i < this.skills.pers.length; i++) {
                        this.skillsToQuery.push({
                            index: i,
                            what: 'pers',
                            req: this.skills.pers[i].idReq,
                            liv: this.skills.pers[i].livello
                        })
                        this.skills.pers[i].livDesc = this.usualLevels[this.skills.pers[i].livello - 1];
                        this.skills.pers[i].livLength = this.usualLevels.length;
                    }
                    for (var i = 0; i < this.skills.prof.length; i++) {
                        this.skillsToQuery.push({
                            index: i,
                            what: 'prof',
                            req: this.skills.prof[i].idReq,
                            liv: this.skills.prof[i].livello
                        })
                        this.skills.prof[i].livDesc = this.usualLevels[this.skills.prof[i].livello - 1];
                        this.skills.prof[i].livLength = this.usualLevels.length;
                    } */
                    this.skillsToQuery = [];
                    for (var i = 0; i < this.skills.length; i++) {
                        this.skillsToQuery.push({
                            index: i,
                            req: this.skills[i].idReq,
                            liv: this.skills[i].livello
                        })
                        this.backup.push({lv: this.skills[i].livello, desc: this.skills[i].note});
                        this.skills[i].livDesc = this.usualLevels[this.skills[i].livello - 1];
                        this.skills[i].livLength = this.usualLevels.length;
                        this.skills[i].itemVals = this.vals;
                    }
                    
                    if (this.skillsToQuery.length > 0) {
                        this.getLevelDescs();
                        this.getReqNames()
                    }
                }

                var gotLangs = this.$store.getters.getLanguages;
                if (gotLangs == null || gotLangs.langs == null) {
                    this.langs = [];
                } else {
                    this.langs = gotLangs.langs;
                    this.madrelingua = gotLangs.madrelingua;
                }
            },
            getLevelDescs() {
                var querys = [];
                var ids = '';
                for (var i = 0; i < this.skillsToQuery.length; i++) {
                    var query = this.skillsToQuery[i];
                    var get = this.$store.getters.getReqLevel(query.req);
               
                    if (get && get.length > 0) {
                        for (var j = 0; j < get.length; j++) {
                            if (query.liv == get[j].val) {
                                //if (query.what == 'pers') {
                                    this.skills[query.index].livDesc = get[j].desc;
                                    this.skills[query.index].livLength = get.length;
                                
                                //} else {
                            }
                        }
                        this.addLevCount();
                    } else if (get == 1) {
                        this.addLevCount();
                    } else {
                        querys.push(query);
                        if (querys.length == 1) {
                            ids = query.req;
                        } else {
                            ids += ';' + query.req;
                        }
                    }
                }

                if (ids != '') {
                    this.$http.get(localStorage.getItem("rec-path") + "/Livelli?IDRequisiti=" + ids, {
                        headers: {
                            token: localStorage.getItem("recruitingToken")
                        }
                    }).then((response) => {
                        var res = response.body;
                        try{
                            res = JSON.parse(response.body);
                        } catch(err) {};

                        if (res && res.Livelli && res.Livelli.length > 0) {
                            var prev = 0;
                            var levels;
                            var map;
                            for (var i = 0; i < res.Livelli.length; i++) {
                                var liv = res.Livelli[i];
                                if (liv.IDRequisiti != prev) {
                                    if (prev != 0) {
                                        map.levels = levels;
                                        this.$store.commit('addReqLevelMapping', map);
                                    }
                                    prev = liv.IDRequisiti;
                                    map = {
                                        id: liv.IDRequisiti
                                    };
                                    levels = [];
                                }
                                levels.push({
                                    val: liv.Livello,
                                    desc: liv.DescrizioneLivello
                                })
                            }
                            map.levels = levels;
                            this.$store.commit('addReqLevelMapping', map);

                            this.getLastDescs(querys);
                        }
                    });
                }
            },
            getLastDescs(querys) {
                for (var i = 0; i < querys.length; i++) {
                    var q = querys[i];
                    var get = this.$store.getters.getReqLevel(q.req);
                 
                    if (get && get.length > 0) {
                        for (var j = 0; j < get.length; j++) {
                            if (q.liv == get[j].val) {
                                //if (q.what == 'pers') {
                                    this.skills[q.index].livDesc = get[j].desc;
                                    this.skills[q.index].livLength = get.length;
                                    this.searchLevel(q.index, q.req)
                                //} else {
                                
                            }
                        }
                        this.addLevCount();
                    } else {
                        this.addLevCount();
                    }
                }
            },
            getReqNames() {
                var querys = [];
                var ids = '';
                for (var i = 0; i < this.skillsToQuery.length; i++) {
                    var query = this.skillsToQuery[i];
                    var get = this.$store.getters.getReqName(query.req);
                    if (get != -1) {
                        //if (query.what == 'pers') {
                            this.skills[query.index].nome = get;
                        //} else {
                        
                        this.addReqCount();
                    } else {
                        querys.push(query);
                        if (querys.length == 1) {
                            ids = query.req;
                        } else {
                            ids += ';' + query.req;
                        }
                    }
                }

                if (ids != '') {
                    this.$http.get(localStorage.getItem("rec-path") + '/Requisito?ID=' + ids, {
                        headers: {
                            token: localStorage.getItem("recruitingToken")
                        }
                    }).then((response) => {
                        var res = response.body;
                        try{
                            res = JSON.parse(response.body);
                        } catch(err) {};
                            
                        if (res && res.Requisito) {
                            for (var i = 0; i < res.Requisito.length; i++) {
                                var get = res.Requisito[i].NOMEREQUISITO;
                                if (get && get.trim != '') {
                                    var char = get.match(/\D/);
                                    var ind = get.indexOf(char);
                                    get = get.slice(ind).trim();
                                }
                                this.$store.commit('addReqNameMapping', {
                                    id: res.Requisito[i].ID,
                                    name: get
                                });
                            }
                            this.getLastNames(querys);
                        }
                    })
                }
            },
            getLastNames(querys) {
                for (var i = 0; i < querys.length; i++) {
                    var q = querys[i];
                    var get = this.$store.getters.getReqName(q.req);
                    if (get != -1) {
                        //if (q.what == 'pers') {
                            this.skills[q.index].nome = get;
                        //} else {
                        
                        this.addReqCount();
                    } else {
                        this.addReqCount();
                    }
                }
            },
            forceDOM() {
                var place = [];
                place = place.concat(this.skills);
                this.skills = [];
                this.skills = place;
            },
            addReqCount() {
                this.gotReqCount++;
                if (this.gotReqCount == this.skills.length) {
                    this.gotReqName = true;
                    if (this.gotLevelDesc == true) {
                        this.forceDOM();
                    }
                }
            },
            addLevCount() {
                this.gotLevelCount++;
                if (this.gotLevelCount == this.skills.length) {
                    this.gotLevelDesc = true;
                    if (this.gotReqName) {
                        this.forceDOM();
                    }
                }
            },
            commit(){
                var skills = [];
               
                for(var i = 0; i < this.editables.length; i++){
                    skills.push(this.editables[0]);
                }
                this.$store.commit('setSkills', this.editables);
                this.loadFields();
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

.left-side-skills {
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

.an-icon {
    padding-right: 5px;
    color: #42a5f5;
}

.element {
    padding: 10px;
    border-width: 0px;
}

.progress {
    background: rgba(255, 255, 255, 1);
    border: 1px solid #ddd;
    border-radius: 10px;
    height: 15px;
}

.progress-bar-custom {
    background: rgba(98, 165, 224, 1);
}

.lang-label {
    padding-left: 10px;
}

.lab {
    padding-right: 10px;
}

.language {
    padding-left: 20px;
}

.voce {
    padding: 5px 10px;
}

.fa-circle {
    color: rgba(98, 165, 224, 1);
}
</style>
