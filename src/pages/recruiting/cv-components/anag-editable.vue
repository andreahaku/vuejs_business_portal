<template>
   
    <div class="panel panel-default paper-shadow" data-z="0.5">       
      <div class="panel-heading">
        <div class="media v-middle">
          <div class="media-body">
            <h4 class="text-headline margin-none">Informazioni Personali</h4>
          </div>
            
          <div class="media-right">
            <a class="btn btn-flat" :class="{'btn-primary': !unsavedToken, 'btn-warning': unsavedToken}"
            @click="save()">SALVA <i class="fa fa-floppy-o pad" aria-hidden="true"></i> </a>
          </div>
        </div>
      </div>
       
        <div class="panel-body bg-cv" style="padding: 10px;">
             <div class="panel panel-default paper-shadow" @change="unsavedChanges = true;">
              <form class="form-horizontal row" style="padding: 20px; padding-bottom: 5px;">
                
                <div class="form-group col-xs-12 col-md-6">
                  <label for="nome" class="col-sm-3 control-label"><strong>* </strong>Nome</label>
                  <div class="col-sm-9">
                    <input v-model="params.nome" type="text" class="form-control checkableInput">
                  </div>
                </div>
                <div class="form-group col-xs-12 col-md-6">
                  <label for="nome" class="col-sm-3 control-label"><strong>* </strong>Cognome</label>
                  <div class="col-sm-9">
                    <input v-model="params.cognome" type="text" class="form-control checkableInput">
                  </div>
                </div>
                
                <div class="form-group col-xs-12 col-md-6">
                  <label for="start" class="col-sm-3 control-label"><strong>* </strong>Indirizzo</label>
                  <div class="col-sm-9">
                    <input v-model="params.indirizzo" type="text" class="form-control checkableInput">
                  </div>
                </div>
                <div class="form-group col-xs-12 col-md-6">
                  <label for="start" class="col-sm-3 control-label">CAP</label>
                  <div class="col-sm-9">
                    <input v-model="params.cap" type="text" class="form-control optionalInput">
                  </div>
                </div>
                <div class="form-group col-xs-12 col-md-6">
                  <label for="start" class="col-sm-3 control-label"><strong>* </strong>Città</label>
                  <div class="col-sm-9">
                    <input v-model="params.citta" type="text" class="form-control checkableInput">
                  </div>
                </div>
                
                <picker v-if="params.provincia != ''" :val="params.provincia" @changed="updateProv"></picker>
                
                <div class="form-group col-xs-12 col-md-6">
                  <label for="start" class="col-sm-3 control-label"><strong>* </strong>Telefono</label>
                  <div class="col-sm-9">
                    <input v-model="params.tel" type="text" class="form-control checkableInput">
                  </div>
                </div>
                <div class="form-group col-xs-12 col-md-6">
                  <label for="start" class="col-sm-3 control-label">E-mail</label>
                  <div class="col-sm-9">
                    <input v-model="params.mail" type="text" class="form-control optionalInput">
                  </div>
                </div>
                <div class="form-group col-xs-12 col-md-6">
                  <label for="start" class="col-sm-3 control-label">Cittadinanza</label>
                  <div class="col-sm-9">
                    <input v-model="params.cittadinanza" type="text" class="form-control optionalInput">
                  </div>
                </div>
                <div class="form-group col-xs-12 col-md-6">
                  <label for="end" class="col-sm-3 control-label"><strong>* </strong>Data di nascita</label>
                  <div class="col-sm-9">
                    <input v-model="params.birth" type="date" class="form-control checkableInput" placeholder="gg/mm/aaaa">
                  </div>
                </div>
                <div class="form-group col-xs-12" style="padding-top: 10px;">
                  <label for="nome" class="col-sm-3 control-label">Presentazione</label>
                  <div class="col-sm-9">
                    <div class="form-group">
                        <textarea rows="5" cols="50" class="form-control optionalInput" placeholder="Presentati.." style="margin-left: 10px;" v-model="params.intro"></textarea>
                    </div>
                  </div>
                </div>
              </form>
            <div class="panel-body" style="padding-top: 0px;">
                <div class="media v-middle">
                  <div class="media-right pull-right" data-toggle="tooltip" data-placement="top" data-trigger="hover" title="Indietro">
                    <a class="btn btn-primary btn-flat" @click="back()"><i class="fa fa-reply" aria-hidden="true"></i> </a>
                  </div>
                </div>
            </div>
          </div>
      </div>
    </div>
</template>

<script>
    
    import {eventBus} from '../../../eventbus.js';
    import {changesDetectorMixin} from './changesDetectorMixin.js';
    import picker from './picker.vue';

    export default {
        mounted(){
            this.$nextTick(function(){
                this.fillSpots(); 
            });
        },
        mixins : [changesDetectorMixin],
        created(){
            eventBus.$on("choice", this.handleChoice);
            this.index = eventBus._events.choice.length-1;
        },
        beforeDestroy(){
              eventBus._events.choice.splice(this.index, 1);
        },
        components:{
            picker  
        },
        data: function(){
            return {
                anagraphics: {},
                listener: {},
                index: {},
                controlSaving: false,
                
                params: {
                    nome: '',
                    cognome: '',
                    indirizzo: '',
                    citta: '',
                    tel: '',
                    birth: '',
                    cap: '',
                    provincia: '',
                    mail: '',
                    cittadinanza: '',
                    intro: ''
                },
                
                isChrome: !!window.chrome && !!window.chrome.webstore
            }
        },
        methods: {
            back: function(){
                var tips = document.getElementsByClassName("tooltip");
                for(var i = 0; i < tips.length; i++){
                    tips[i].parentElement.removeChild(tips[i]);
                }
                
                if(this.unsavedToken){
                    this.$emit('alert', ['Le modifiche rilevate verranno ignorate. Continuare?', this]);
                } else {
                    eventBus.$emit('AnagraficSwitch', false);  
                }
            },
            updateProv($event){
                this.params.provincia = $event;  
            },
            handleChoice: function($event){
                if($event[1] == this){
                    if($event[0]){
                        var toUpdate = false;
                        if(this.controlSaving){
                            toUpdate = true;
                            this.$store.commit('setAnagraphics', this.anagraphics);
                        }
                        eventBus.$emit('AnagraficSwitch', toUpdate);
                    }
                    if(this.controlSaving){
                        this.controlSaving = false;
                    }
                }
            },
            save: function(){
                if(this.getValues()){
                    if(this.unsavedToken){
                        this.$emit('alert', ["Salvare i cambiamenti correnti?", this]);
                    } else {
                        eventBus.$emit('AnagraficSwitch', false);
                    }
                }
            },
            getValues: function(){
                  
                var obbl = {
                    nome: this.params.nome,
                    cognome: this.params.cognome,
                    indirizzo: this.params.indirizzo,
                    citta: this.params.citta,
                    tel: this.params.tel,
                    birth: this.params.birth,
                }
                var ok = true;
                for(var prop in obbl){
                    if(obbl[prop].trim()===""){
                        ok = false;
                        break;
                    }
                }
                if(!ok){
                    eventBus.$emit('alert', "Alcuni campi obbligatori non sono stati compilati");
                    return false;
                } else {
                    if(!this.isChrome){
                        var str1 = this.params.birth;
                        if(!checkDateFormat(str1,'Oggi')){
                            eventBus.$emit('alert', "Formato data di nascita errato");
                            return false;
                        }
                    }
                    this.anagraphics = obbl;
                    
                    this.anagraphics.cap = this.params.cap;
                    this.anagraphics.provincia = this.params.provincia;
                    this.anagraphics.mail = this.params.mail;
                    this.anagraphics.cittadinanza = this.params.cittadinanza;
                    this.anagraphics.intro = this.params.intro;
                    
                    this.anagraphics.intro = this.anagraphics.intro.replace(/\n/g, "<br>");
                    
                    this.controlSaving = true;
                    return true;
                }
            },
            fillSpots(){
                this.anagraphics = this.$store.getters.getFullAnagraphics;
                if(this.anagraphics== null || this.anagraphics== {}){
                    this.anagraphics = {};
                    this.params.provincia = 'fc';
                } else {
                    if(this.anagraphics.intro != null){
                        this.anagraphics.intro = this.anagraphics.intro.replace(/<br>/g, "\n");   
                    }
                    this.listeningEnabled = true;
                    this.params = this.anagraphics;
                }
            }
        }
    }
        
</script>

<style>

</style>