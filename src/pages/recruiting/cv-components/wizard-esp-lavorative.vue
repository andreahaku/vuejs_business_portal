<template>
    <div class="media">
        <div class="media-body">
             <div class="media v-middle">
               <div class="media-right">
                 <h4 class="text-headline margin-none">Esperienze Lavorative
                 </h4>
               </div>
             </div>

             <div class="panel-body">
                 <div class="panel panel-default paper-shadow row" style="border-width: 0px;">
                  
                   
                    <div class="col-sm-2"></div>
                    
                    <div class="col-xs-12 col-md-10">
                       <transition-group name='roll-fade'>
                            <form class="form-horizontal row" v-for="(exp, index) in experiences" :key="index">
                                <div class="form-group col-xs-12 col-md-6">
                                  <label for="nome" class="col-sm-12 control-label"><strong>* </strong>Presso</label>
                                  <div class="col-sm-12">
                                    <input type="text" class="form-control checkableInput" placeholder="Nome datore di lavoro, azienda, ente..." 
                                    v-model="exp.required.datore" 
                                    :class="{'missing': exp.missingFields.datore}">
                                  </div>
                                </div>
                                <div class="form-group col-xs-12 col-md-6">
                                  <label for="nome" class="col-sm-12 control-label"><strong>* </strong>Impiego</label>
                                  <div class="col-sm-12">
                                    <input type="text" class="form-control checkableInput" placeholder="ruolo" 
                                    v-model="exp.required.ruolo"
                                    :class="{'missing': exp.missingFields.ruolo}">
                                  </div>
                                </div>

                                <div class="form-group col-xs-12 col-md-6">
                                  <label for="end" class="col-sm-12 control-label"><strong>* </strong>Inizio periodo</label>
                                  <div class="col-sm-12">
                                    <input type="date" class="form-control checkableInput" placeholder="gg/mm/aaaa" 
                                    v-model="exp.required.da"
                                    :class="{'missing': exp.missingFields.da}">
                                  </div>
                                </div>

                                <div class="form-group col-xs-12 col-md-6">
                                  <label for="end" class="col-sm-12 control-label"><strong>* </strong>Fine periodo</label>
                                
                                       <div class="col-xs-10" style="padding-right: 0px;">
                                            <input type="date" class="form-control checkableInput" placeholder="gg/mm/aaaa oppure 'Oggi'" 
                                            v-model="exp.required.a" :id="'toExp'+index"
                                            :class="{'missing': exp.missingFields.a}">
                                        </div>
                                        <div class="col-xs-2" style="padding-left: 0px;">
                                              <div class="dropdown">
                                              <button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" style="background-color: #eeeeee; height: 36px;">
                                                <span class="caret" style="position: relative; top: -5px;"></span>
                                              </button>
                                              <ul class="dropdown-menu" aria-labelledby="dropdownMenu1" 
                                               style="position: absolute; left: -128px;">
                                                <li><a @click="switchType(index,'date')">Seleziona Data</a></li>
                                                <li><a @click="switchType(index, 'text')">Oggi</a></li>
                                              </ul>
                                            </div>
                                      </div>
                                </div>
                                
                                <div class="form-group col-xs-12">
                                  <label for="end" class="col-sm-12 control-label">Descrizione/ Principali attività (Max 2000 caratteri) <span v-if="exp.required.attività!=''">{{exp.required.attività.length}} - 2000</span></label>
                                  <div class="col-sm-11">
                                    <textarea rows="2" cols="45" class="form-control checkableInput" placeholder="Dettagli .." style="margin: 0px;" v-model="exp.required.attività"
                                    :class="{'missing': exp.missingFields.attività}"
                                    ></textarea>
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
    
    import {eventBus} from '../../../eventbus.js'
        
    export default {
        mounted(){
            this.$nextTick(function(){
                
            })
        },
        created(){
            var vm = this;
            eventBus.$on('pillChanged', function(id){
                if(id==='esperienze'){
                   vm.checkRequired();
                }
            });
            eventBus.$on('saveFirstCv', function(){
                vm.save();
            })
            
            eventBus.$on("choice", this.handleChoice);
            this.e = eventBus._events.choice[eventBus._events.choice.length -1];
            
            this.addEmptyForm();
        },
        beforeDestroy(){
            var index = eventBus._events.choice.indexOf(this.e);
            eventBus._events.choice.splice(index, 1);
        },
        data(){
            return {
                valid: 1,
                
                experiences: [],
                deleting: 0,
                
                isChrome: !!window.chrome && !!window.chrome.webstore,
                
                e: {},
                
                univoco: 'wizard-esp'
            }
        },
        methods: {
            switchType(ind, type){
                var el = document.getElementById("toExp"+ind);
                el.setAttribute("type", type);
                if(type === 'text'){                    
                    this.experiences[ind].required.a = 'Oggi';
                    el.disabled = true;
                } else {
                    this.experiences[ind].required.a = '';
                    el.placeholder = 'gg/mm/aaaa';
                    el.disabled = false;
                }
            }, 
            checkRequired(){
                this.valid = 1;
                var missing = [];
                    
                for(var i = 0; i < this.experiences.length; i++){
                    
                    if(this.experiences[i].required.datore.trim()===''){
                        this.valid = 0;
                        if(missing.indexOf("Nome datore di lavoro")===-1){
                            missing.push("Nome datore di lavoro");
                        }
                        this.experiences[i].missingFields.datore = true;
                    } else {
                        this.experiences[i].missingFields.datore = false;
                    }
                    
                    if(this.experiences[i].required.ruolo.trim()===''){
                        this.valid = 0;
                        if(missing.indexOf("Impiego")===-1){
                            missing.push("Impiego");
                        }
                        this.experiences[i].missingFields.ruolo = true;
                    } else {
                        this.experiences[i].missingFields.ruolo = false;
                    }
                    
                    if(this.experiences[i].required.da.trim()===''){
                        this.valid = 0;
                        if(missing.indexOf("Inizio periodo")===-1){
                            missing.push("Inizio periodo");
                        }
                        this.experiences[i].missingFields.da = true;
                    } else {
                        if(!this.isChrome && !checkDateFormat(this.experiences[i].required.da, 'Oggi')){
                            this.valid = 0;
                            if(missing.indexOf("Inizio periodo - Formato Errato")===-1){
                                missing.push("Inizio periodo - Formato Errato");
                            }
                            this.experiences[i].missingFields.da = true;
                        } else {
                            this.experiences[i].missingFields.da = false;
                        }
                    }

                    if(this.experiences[i].required.a.trim()===''){
                        this.valid = 0;
                        if(missing.indexOf("Fine periodo")===-1){
                            missing.push("Fine periodo");
                        }
                        this.experiences[i].missingFields.a = true;
                    } else {
                        if(!this.isChrome && !checkDateFormat('01/01/2001', this.experiences[i].required.a)){
                            this.valid = 0;
                            if(missing.indexOf("Fine periodo - Formato Errato")===-1){
                                missing.push("Fine periodo - Formato Errato");
                            }
                            this.experiences[i].missingFields.a = true;
                        } else {
                            this.experiences[i].missingFields.a = false;
                        }
                    }
                    
                    if(this.experiences[i].required.attività!='' && this.experiences[i].required.attività.length > 2000){
                        this.valid = 0;
                        if(missing.indexOf("Descrizione attività - Limite caratteri superato")===-1){
                            missing.push("Descrizione attività - Limite caratteri superato");
                        }
                        this.experiences[i].missingFields.attività = true;
                    } else {
                        this.experiences[i].missingFields.attività = false;
                    }
                }
                this.$emit("isValid", [this.valid, missing]);
            },
            save(){
                this.checkRequired();
                
                var experiences = [];
                for(var i = 0; i < this.experiences.length; i++){
                    experiences.push(this.experiences[i].required);
                }
                
                this.$emit("got", experiences);
            },
            addEmptyForm(){
                var emptyElement = {
                    required: {
                        datore: '',
                        ruolo: '',
                        da: '',
                        a: '',
                        attività: ''
                    },
                    missingFields: {
                        datore: false,
                        ruolo: false,
                        da: false,
                        a: false,
                        attività: false
                    }
                };
                this.experiences.push(emptyElement);
            },
            deleteObs(id){
                this.deleting = id;
                this.$emit('alert', ["Eliminare questo elemento?", this.univoco]);
            },
            handleChoice($event){
                if($event[1] == this.univoco){
                    if($event[0]){
                        this.experiences.splice(this.deleting, 1);
                        if(this.experiences.length <= 0){
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
    
    .pad{
        padding-left: 5px;
    }

    .control-label{
        text-align: left;
    }
</style>