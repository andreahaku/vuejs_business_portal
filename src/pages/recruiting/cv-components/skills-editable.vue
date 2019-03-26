<template>
      <div class="panel panel-default paper-shadow" data-z="0.5">       
      <div class="panel-heading">
        <div class="media v-middle">
          <div class="media-body">
            <h4 class="text-headline margin-none">Capacità e Competenze</h4>
          </div>
            
          
          <div class="media-right">
            <span>
                <a class="btn btn-primary btn-flat" :class="{'btn-primary': !unsavedToken, 'btn-warning': unsavedToken}" 
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
                 <div v-if="ed!=null" :key="ed.id" class="panel panel-default paper-shadow" style="margin-bottom: 0px;" :id="'skill-edit'+ed.id" @change="unsavedChanges = true;">
                      <form class="form-horizontal row" style="padding: 20px; padding-bottom: 0px;">

                       <div v-if="gotReqs" class="form-group col-xs-12">
                             <label for="nome" class="col-sm-12 control-label"><strong>* </strong>Nome</label>
                             <div class="col-xs-11" style="padding-right: 0px;">
                                 <input type="text" class="form-control" 
                                 v-model="ed.nome" @keydown="filterReqs(ind, ed.nome)"
                                 @blur="blur(ind)" @focus="focus(ind)">
                             </div>
                             <div class="col-xs-1" style="padding-left: 0px;">
                                  <button class="btn btn-default" type="button" data-toggle="collapse" :href="'#dropdownMenuReq'+ind" aria-expanded="false"
                                  :aria-controls="'dropdownMenuReq'+ind" 
                                  style="background-color: #eeeeee; height: 36px; padding-top: 14px;" @click="focus(ind)">
                                    <span class="caret" style="position: relative; top: -5px;"></span>
                                  </button>
                              </div>
                              <div class="col-xs-12 collapse" :id="'dropdownMenuReq'+ind" style="
                                position: absolute;
                                top: 60px;
                                z-index: 2; 
                                max-height: 240px;
                                overflow-y: auto;
                                padding-right: 0px;">
                                 <div class="panel panel-default" style="padding: 5px 5px;">
                                      <div v-for="req in reqs" class="panel-body item-req" style="padding: 3px 5px;" @click="thisReq(ind, req.ID, req.nome)">{{req.nome}}</div>   
                                 </div>
                              </div>
                              <div v-if="ed.loadingLiv" class="col-xs-12" style="position: relative;">
                                <div class='uil-rolling-css' style='transform:scale(0.12); 
                                position: absolute; top: -150px; right: -100px; '><div><div></div><div></div></div></div>
                             </div>
                        </div>

                       <div class="form-group col-xs-12">
                          <label for="end" class="hidden-xs col-sm-12 control-label"><strong>* </strong>Valutazione</label>
                          <label for="end" class="visible-xs col-xs-10 control-label"
                          style="text-align: left;"><strong>* </strong>Valutazione</label>
                           
                              <form style="padding: 5px;">
                                 <div class="col-xs-10" style="margin-top: 7px;">
                                     <input id="inputRange" type="range" min='1' :max="ed.itemVals.length"
                                     v-model="ed.livello" @mouseup="leaveIE()"> 
                                 </div>
                                 <div v-if="ed.itemVals!=null" class="col-xs-2">
                                 {{ed.itemVals[ed.livello-1].desc}}</div>
                              </form>
                        </div>

                        <div class="form-group col-xs-12">
                          <label for="nome" class="col-sm-12 control-label">Dettagli</label>
                          <div class="col-sm-12">
                            <div class="form-group">
                                <textarea :id="'note'+ed.id" rows="2" cols="50" class="form-control checkableInput" placeholder="Note .." style="margin-left: 10px;" v-model="ed.note"></textarea>
                            </div>
                          </div>
                        </div>
                      </form>

                <div class="panel-body" style="padding-top: 0px;">
                    
                </div>
              </div>
              
              <!-- LANGS ONES-->
              <div key="univ" class="top-adj panel panel-default paper-shadow" style="margin-bottom: 0px;"  @change="unsavedChanges = true;">
                 <div class="panel panel-header" style="padding: 0px 15px;"><h4>Conoscenze Linguistiche</h4>
                 
                 <div class="media-right hidden-xs">
                    <span style="position: absolute; top: 10px; right: 10px;">
                        <a class="btn btn-primary btn-flat" @click="addLang()">Aggiungi lingua<i class="fa fa-plus pad" aria-hidden="true" style="padding-left: 10px;"></i> </a>
                    </span>
                  </div> 
                  
                  <div class="media-right visible-xs pull-right">
                    <span>
                        <a class="btn btn-primary btn-flat" @click="addLang()"><i class="fa fa-plus pad" aria-hidden="true"></i></a>
                    </span>
                  </div> 
                 </div>
                 
                 
                  <form class="form-horizontal row" style="padding: 20px; padding-bottom: 0px;">
                      <div class="col-xs-12 row" style="margin-bottom: 10px;">
                          <div class="form-group col-xs-12 col-md-6">
                              <label for="nome" class="col-sm-3 control-label"><strong class="lang-obbl">*</strong>Madrelingua(e)</label>
                              <div class="col-sm-9">
                                <input id="ml" type="text" class="form-control checkableInput" placeholder="Italiana/ Italiana e Francese"
                                v-model="madrelingua">
                              </div>
                           </div>
                       </div>
                       
                      <transition-group name='roll-fade'>
                          <div class="col-xs-12 row" v-for="(lang, index) in langs" :id="'lang-edit'+lang.id" @change="unsavedChanges = true;" :key="lang.id"
                            style="padding: 15px 10px;">

                              <div class="media-right hidden-xs" style="position: absolute; right: 0px;">
                                <span>
                                    <a class="btn btn-danger btn-flat" @click="trashLang(lang.id)"><i class="fa fa-times pad" aria-hidden="true"></i> </a>
                                </span>
                              </div> 
                              <div class="media-right visible-xs" style="position: absolute; top: 45px; right: 0px;">
                                <span>
                                    <a class="btn btn-danger btn-flat" @click="trashLang(lang.id)"><i class="fa fa-times pad" aria-hidden="true"></i> </a>
                                </span>
                              </div>

                              <div class="form-group col-xs-12 col-md-6">
                                  <label for="nome" class="col-sm-3 control-label"><strong class="lang-obbl">*</strong>Lingua</label>
                                  <div class="col-sm-9">
                                    <input :id="'lingua'+lang.id" type="text" class="form-control checkableInput" placeholder="Inglese/ Spagnolo"
                                    v-model="lang.lingua">
                                  </div>
                              </div>
                              <div class="form-group col-xs-12 col-md-6">
                                  <label for="nome" class="col-sm-3 control-label">Certificazione</label>
                                  <div class="col-sm-9">
                                    <input :id="'livello'+lang.id" type="text" class="form-control checkableInput" placeholder="B2 - C1 ... "
                                    v-model="lang.livello">
                                  </div>
                              </div>
                              
                              <div class="form-group col-xs-12 col-md-6">
                                  <label for="nome" class="col-sm-3 control-label"><strong class="lang-obbl">*</strong>Livello di comprensione</label>
                                  <div class="col-sm-9">
                                    <form :id="'comprensione'+lang.id">
                                      <input type="radio" name="gender" value="Discreto" v-model="lang.comprensione"> Discreto<br>
                                      <input type="radio" name="gender" value="Buono" v-model="lang.comprensione"> Buono<br>
                                      <input type="radio" name="gender" value="Ottimo" v-model="lang.comprensione"> Ottimo
                                    </form>
                                  </div>
                              </div>
                              <div class="form-group col-xs-12 col-md-6">
                                  <label for="nome" class="col-sm-3 control-label"><strong class="lang-obbl">*</strong>Parlato</label>
                                  <div class="col-sm-9">
                                    <form :id="'parlato'+lang.id" >
                                      <input type="radio" name="gender" value="Discreto" v-model="lang.parlato"> Discreto<br>
                                      <input type="radio" name="gender" value="Buono" v-model="lang.parlato"> Buono<br>
                                      <input type="radio" name="gender" value="Ottimo" v-model="lang.parlato"> Ottimo
                                    </form>
                                  </div>
                              </div>
                              
                          </div>
                        </transition-group>
                  </form>
             </div>
             
             
          </transition-group>
          
          <div class="media-left visible-xs" style="margin-top: 10px;">
            
            <span data-toggle="tooltip" data-placement="top" data-trigger="hover" title="Indietro" style="margin-left: 10px;">
                <a class="btn btn-default btn-flat" @click="back()" style="color: #42a5f5; background-color: white;"><i class="fa fa-reply" aria-hidden="true"></i> </a>
            </span>
            
          </div> 
      </div>
    </div>
</template>

<script>
    
   import {eventBus} from '../../../eventbus.js';
   import {changesDetectorMixin} from './changesDetectorMixin.js';
   import {requirementsHandlerMixin} from './requirementsHandlerMixin.js';

    export default {
        mounted(){
            this.$nextTick(function(){
                this.fillSpots(); 
                this.findReq();
            });
        },
        mixins : [changesDetectorMixin, requirementsHandlerMixin],
        created(){
            eventBus.$on("choice", this.handleChoice);
            this.e = eventBus._events.choice[eventBus._events.choice.length -1];
        },
        beforeDestroy(){
              var index = eventBus._events.choice.indexOf(this.e);
              eventBus._events.choice.splice(index, 1);
        },
        data: function(){
            return {
                skills: [],
                last: 0,
                invalid: false,
                controlSaving: false,
                sure: false,
                
                isIE: /*@cc_on!@*/false || !!document.documentMode,
                toBeDeleted: [],
                
                madrelingua: "Italiana",
                langs: [],
                langsFiltered: [],
                
                e: {},
                ed: null,
                ind: 0,
                message: '',
                univoco: "form-editable"
                
            }
        },
        methods: {
            leaveIE(){
                if(this.isIE){
                    this.ed.livello = document.getElementById("inputRange").value;   
                }
            },
            back: function(){
                var tips = document.getElementsByClassName("tooltip");
                for(var i = 0; i < tips.length; i++){
                    tips[i].parentElement.removeChild(tips[i]);
                }
                
                if(this.unsavedToken){
                    this.$emit('alert', ['Le modifiche rilevate verranno ignorate. Continuare?', this]);
                } else {
                    eventBus.$emit('SkillSwitch', {switch: false});  
                }
            },
            switchTrue(){
                var passing = {switch: true};
                if(this.toBeDeleted.length > 0){
                    passing.delete = this.toBeDeleted
                }
                eventBus.$emit('SkillSwitch', passing);
            },
            handleChoice: function($event){
                if($event[1] == this){
                    if($event[0]){
                        if(this.sure){
                            if(this.saveItem()){
                                this.commit();
                            }
                            var obj = {madrelingua: this.madrelingua, langs: this.langsFiltered};
                            this.$store.commit('setLanguages', obj);
                            this.switchTrue();
                        } else if(this.controlSaving){
                            this.commit();
                            var obj = {madrelingua: this.madrelingua, langs: this.langsFiltered};
                            this.$store.commit('setLanguages', obj);
                            this.switchTrue();
                        } else {
                            this.$store.commit('fakeCommit');
                            eventBus.$emit('SkillSwitch', {switch: false});  
                        }
                    }
                    if(this.sure){
                        this.sure = false;
                    }
                    if(this.controlSaving){
                        this.controlSaving = false;
                    }
                }
            },
            save: function(){
                
                if(this.getValues()){
                    if(this.invalid){
                        this.sure = true;
                        this.$emit('alert', ["Un componente non risulta valido e non verrà inserito, Continuare?", this]);
                        this.invalid = false;
                    } else {
                        if(this.unsavedToken){
                            this.controlSaving = true;
                            
                            this.$emit('alert', ["Salvare i cambiamenti correnti?", this]);
                        } else {
                            this.commit();
                            
                            var obj = {madrelingua: this.madrelingua, langs: this.langsFiltered};
                            this.$store.commit('setLanguages', obj);
                            this.switchTrue();
                        }
                    }
                } else {
                    eventBus.$emit('alert', "Alcuni campi obbligatori non sono stati compilati");
                }
            },
            getValues: function(){
                var sk = this.saveItem();
                if(!sk) {this.invalid = true;} else {this.invalid = false;}
                
                for(var i = 0; i < this.langs.length; i++){
                    this.saveLang(i);
                }
                
                this.langsFiltered = this.langs.filter(function(l){
                    if(l.deleteFlag){
                        vm.invalid = true;
                        return false;
                    }
                    return true;
                })
                
                if(sk || this.langsFiltered.length > 0){
                    return true;
                } else {
                    return false;
                }
            },
            saveItem: function(){
                if(this.ed.nome && this.ed.nome.trim() != '' &&
                    this.ed.livello >= 0){
                    if(this.ed.nome == this.skills[this.skills.length -1].goodOne){
                        return true;
                    } 
                    return false; 
                } else {
                    return false;
                }
            },
            saveLang: function(id){
                if(this.langs[id].lingua.trim() !=''){
                    this.langs[id].deleteFlag = false;
                } else {
                    this.langs[id].deleteFlag = true;
                }
            },
            add(){
                var obj = {
                    id: this.last + 1,
                    deleteFlag: false,
                    tipo: 'Personale',
                    nome: '',
                    livello: 1,
                    note: '',
                    idReq: -1,
                    
                    itemVals: this.vals,
                    loadingLiv: false
                    
                }
                this.last++;
                this.skills.push(obj);
                
                this.ed = obj;
                this.ind = this.skills.length -1;
                
                this.unsavedChanges = true;
            },
            //Lang ones
            addLang(){
                var obj = {
                    id: this.last + 1,
                    deleteFlag: false,
                    lingua: '',
                    livello: '',
                    comprensione: 'Buono',
                    parlato: 'Buono'
                    
                }
                this.last++;
                this.langs.push(obj);
                var id = obj.id;
                setTimeout(function(){
                    document.getElementById("lang-edit"+id).scrollIntoView();
                },50);
                this.unsavedChanges = true;
            },
            trashLang(id){
                var i = id;
                var ind;
                try{
                    this.langs.find(function(s, index){
                        if(s.id == i){
                            ind = index ;
                            return true;
                        }
                        return false;
                    })
                } catch(err){
                    for ( var j = 0; j < this.langs.length; j++){
                        if(this.langs[j].id == i){
                            ind = j;
                            break;
                        }
                    }
                }
                
                this.langs.splice(ind,1);
                this.unsavedChanges = true;
            },
            fillSpots(){
                var gotSkills = this.$store.getters.getSkills;
                this.skills = [];
                
                if(gotSkills== null || gotSkills == {}){
                } else {
                    for(var i = 0; i < gotSkills.length; i++){
                        this.skills.push(gotSkills[i]);
                        this.skills[i].id = i; 
                        this.skills[i].itemVals = this.vals;
                        this.skills[i].loadingLiv = false;
                        this.searchLevel(i, this.skills[i].idReq);
                    }
                    this.listeningEnabled = true;
                    this.last = this.skills.length -1;
                }
                this.add();
                
                var gotLangs = null;
                var gotLangs = this.$store.getters.getLanguages;
                this.langs = [];
                if(gotLangs == null || gotLangs == {}){
                } else {
                    this.madrelingua = gotLangs.madrelingua;
                    if(gotLangs.langs){
                        this.langs = gotLangs.langs;
                        for(var i = 0; i < this.langs.length; i++){
                            this.langs[i].id = this.last + 1;
                            this.last++;
                        }
                    }
                    
                }
            },
            thisReq(i, id, name){
                this.skills[i].idReq = id;
                this.skills[i].nome = name;
                this.skills[i].goodOne = name;
                this.searchLevel(i, id);
                this.afterAssigned(i, id);
            },
            commit(){
                var n = this.skills[this.skills.length-1];
                var ind = -1;
                for(var i = 0; i < this.skills.length-1; i++){
                    if(this.skills[i].idReq == n.idReq){
                        console.log('existing skill - update');
                        ind = i;
                        break;
                    }
                }
                if(ind != -1){
                    this.skills.splice(ind,1);
                }
                this.$store.commit('setSkills', this.skills);
            }
        }
    }
</script>


<style scoped>
    .top-adj{
        margin-top: 5px;
    }
    
    .lang-obbl{
        padding-right: 4px;
    }
    .item-req:hover{
        background-color: #42a5f5;
        color: white;
        cursor: pointer;
    }
    
    .control-label{
        text-align: left;
    }
</style>