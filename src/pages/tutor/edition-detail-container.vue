<template>
  <div class="col-xs-12" v-if="localItem!=null" :class="{'wrapper_padding_xs' : $root.xs}" style="text-align: right; max-height: 100%; min-height: 200px; overflow-y: auto;">
    <h4 class="text-headline" style="text-align: left; margin-bottom: 5px;">Scheda Edizione</h4>
    <h4 class=" margin-none" style="text-align: left;">{{localItem.Corso}}</h4>
    <h5 class="" style="float: right;"><span><strong>Da: </strong>{{localItem.DataInizio}}</span><span style="margin-left: 10px;"><strong>a: </strong>{{localItem.DataFine}}</span></h5>
    <h5 class="" style="text-align: left;"><strong>Edizione: </strong>{{localItem.Edizione}}</h5>
    
    <div v-if="loading" class="cs custom_spinner"></div>
    <div v-else>
      <div v-if="sessions.length > 0">
        <h4 class="text-headline margin-none" style="text-align: left;">Sessioni in Aula<span class="badge">{{sessions.length}}</span></h4>
        <jqw-grid-wrapper :columns="sessionsHeaders" :source="sessions" :options="sessionsOptions" lang="it" name="sessionsGrid"></jqw-grid-wrapper> <!-- sortby="Data;asc" -->
      </div>
      <div v-if="peopleTracking.length > 0" style="margin: 15px 0px;">
        <h4 class="text-headline margin-none" style="text-align: left;"><span v-show="!learningExpanded">Avanzamento E-Learning<span class="badge">{{peopleTracking.length}}</span></span>
          <!-- GRID EXPAND TOGGLE BUTTON -->
          <a class="btn btn-primary" :class="[learningExpanded ? 'el-expanded' : 'el-compress']" 
          @click.prevent="learningExpanded = !learningExpanded" 
          style="padding: 4px 8px; border-bottom-right-radius: 0px;">
            <i class="fa" :class="[learningExpanded ? 'fa-compress' : 'fa-expand']" aria-hidden="true" style="color: white;"></i>
          </a>
          <!-- -->
        </h4>
        <!-- GRID INLINE -->
        <jqw-grid-wrapper v-if="!learningExpanded" :columns="learningHeaders" :source="peopleTracking" :options="learningOptions" lang="it" name="learningGrid"></jqw-grid-wrapper><!-- sortby="name;asc" -->  
        <!-- GRID FOREGROUND -->
        <div v-else id="jqw_container">
          <jqw-grid-wrapper :title="factorTitle" :columns="learningHeaders" :source="peopleTracking" :options="learningOptions" lang="it" name="learningGrid" sortby="name;asc"></jqw-grid-wrapper>  
        </div>
      </div>
      <div v-if="studentList.length > 0" style="margin: 15px 0px;">
        <h4 class="text-headline margin-none" style="text-align: left;"><span>Lista Partecipanti<span class="badge">{{studentList.length}}</span></span>
        <!-- HIDE EXTENDE  -->
        <a class="btn btn-primary"
          @click.prevent="showSub = true" 
          style="padding: 4px 8px; border-bottom-right-radius: 0px; float: right;">
            <i class="fa fa-plus" aria-hidden="true" style="color: white;"></i>
          </a>
       
        </h4>
        <!-- GRID INLINE -->
        <jqw-grid-wrapper :columns="studentHeaders" :source="studentList" :options="studentOptions" lang="it" name="studentListGrid"></jqw-grid-wrapper><!-- sortby="CognomePersona;asc" -->  
      </div>


      <div v-if="may_edit" class="col-xs-12" style="padding: 0px;">
        <div v-show="false" class="panel panel-default paper-shadow animated" data-z="0.5 " 
        style="overflow-y: auto;  margin-top: 12px; height: 500px;">
        </div> 
        <!-- reversed condition TEST -->
        <h4 class="text-headline margin-none" style="text-align: left;">Programma
        </h4>
        <div v-if="!localItem.ModificaProgramma" id="editor_wrapper" :class="{'expanded' : editor_expanded, 'mobile': $root.xs}" style="padding-bottom: 15px;">
          <!-- EDITOR SAVE BUTTON -->
          <a class="btn btn-warning" :class="[editor_expanded ? 'save-expanded' : 'save-compress']" 
          @click.prevent="saveContent()" 
          style="padding: 4px 8px; border-bottom-right-radius: 0px;">
            <i class="fa fa-save" aria-hidden="true"></i>
          </a>

          <!-- EDITOR EXPAND TOGGLE BUTTON -->
          <a class="btn btn-primary" :class="[editor_expanded ? 'a-expanded' : 'a-compress']" 
          @click.prevent="editor_expanded = !editor_expanded" 
          style="padding: 4px 8px; border-bottom-right-radius: 0px;">
            <i class="fa" :class="[editor_expanded ? 'fa-compress' : 'fa-expand']" aria-hidden="true"></i>
          </a>
          <!-- -->
          <vue-editor v-model="content"></vue-editor>
        </div>
      </div>

      <!-- UPLOADER -->
      <!-- reversed condition TEST , sempre Modifica Programma ?-->
      <span v-if="allegatiEdizione && allegatiEdizione.length > 0 && !localItem.ModificaProgramma">
        <h4 class="text-headline margin-none" style="text-align: left;">Allegati<span class="badge">{{allegatiEdizione ? allegatiEdizione.length : 0}}</span>
          <div v-if="reloadingAllegati" class="custom_spinner" style="left: 6px; bottom: 2px;"></div>
          <a href="" class="btn btn-primary" @click.prevent="showUploader = !showUploader;" style="float: right; padding: 4px 8px; border-bottom-right-radius: 0px;">
            <i class="fa fa-plus" aria-hidden="true" style="color: white;"></i>
          </a>
        </h4>
        
        <div v-if="!reloadingAllegati" class="panel panel-default">
          <!-- Table -->
          <table class="table">
            <thead>
              <tr><th class="filename">Nome</th><th>Tipo</th><th class="center">Scarica</th><th  class="center">Rimuovi</th></tr>
            </thead>
            <tbody>
              <tr v-for="file in allegatiEdizione">
                <td class="filename">{{file.nome.split('.')[0]}}</td>
                <td>{{file.nome.split('.')[1].toUpperCase()}}</td>
                <td class="center"><a class="btn btn-primary" @click.prevent="download(file.id, file.nome)" style="padding: 2px 5px;"><i class="fa fa-download"></i></a></td>
                <td class="center"><a class="btn btn-warning" @click.prevent="checkDeletion(file)" style="padding: 2px 6px;"><i class="fa fa-trash"></i></a></td>
              </tr>
            </tbody>
          </table>
        </div>
      </span>
      <!--same reversed condition TEST ? -->
      <a v-else-if="!localItem.ModificaProgramma" href="" class="btn btn-primary" @click.prevent="showUploader = !showUploader;" style="width: auto;margin-bottom: 5px;padding-top: 5px;padding-bottom: 5px;">
      <i class="fa fa-upload" style="margin-right: 8px;"></i>Inserisci Allegato</a>
      <fileUpload @endModal="endModalUpload($event)" :show="showUploader" :uploadData="uploadData"></fileUpload>

      <!-- POPUPS -->
      <modal-subscribe :show="showSub" @closed="showSub = false;"></modal-subscribe>
      <alert-choice :show="showChoice" mess="L'allegato verrà rimosso dall'edizione" @done="handleChoice"></alert-choice>
    </div>
  </div>
</template>
<script>
import { VueEditor } from 'vue2-editor'
import jqwGridWrapper from '../_fullDyn/jqwGrid/jqwGridWrapper.vue'
import { loadParticipantListMixin } from './loadParticipantListMixin.js'
import ModalSubscribe from './popups/ModalSubscribe.vue'
import FileUpload from '../components/FileUpload.vue'
import AlertChoice from '../recruiting/cv-components/alert-choice.vue'
import { eventBus } from '../../eventbus.js'

var vm;

export default {
  props: {
    item: Object
  },
  mounted: function() {
    vm = this;
    if(this.item == null){
      this.tryFromRoute()
    } else {
      this.localItem = this.item;
      this.initDetail();
    }
  },
  watch: {
    item: function() {
      this.localItem = this.item;
      this.initDetail();
    },
    '$route': function() {
      this.tryFromRoute();
    },
    content: function(){
      this.save_content = true;
    }
  },
  mixins: [loadParticipantListMixin],
  components: {
    VueEditor,
    jqwGridWrapper,
    ModalSubscribe,
    FileUpload,
    AlertChoice
  },
  computed: {
    factorTitle: function(){
      return '<h4 class="text-headline margin-none" style="text-align: left; padding: 5px 10px;">Avanzamento E-Learning<span class="badge">'+ this.peopleTracking.length +'</span>';
    }
  },
  data: function() {
    return {
      myid: localStorage.getItem("idpersona"),
      loading: false,
      localItem: {},
      showSub: false,
      showUploader: false,
      allegatiEdizione: [],

      //DESCRIZIONE PROGRAMMA
      content: null,
      save_content: null,
      editor_expanded: false,
      may_edit: true,
      path: localStorage.getItem("path"),

      //SESSIONI
      sessions: [],
      sessionsHeaders: [{
          text: 'Giorno',
          datafield: 'Data',
          width: '20%',
          type: 'string'/*,
          cellsformat: 'dd MMMM yyyy'*/
        },
        {
          text: 'Docente',
          datafield: 'Docente',
          width: '20%',
          type: 'string'
        },
        {
          text: 'Aula',
          datafield: 'Aula',
          width: '20%',
          type: 'string'
        },
        {
          text: 'Inizio',
          datafield: 'Inizio',
          width: '15%',
          type: 'string'
        },
        {
          text: 'Fine',
          datafield: 'Fine',
          width: '15%',
          type: 'string'
        },
        {
          text: 'Presenze',
          datafield: 'ID',
          width: '10%',
          sortable: false,
          tobecellsrenderered: function (data_row, row, columnfield, value, defaulthtml, columnproperties) {
            if(data_row.AmITeacher){
              vm.$nextTick(function(){
                document.getElementById("a_"+row).addEventListener("click", function(){
                  var o = data_row;
                  o.idedizione = vm.localItem.IdEdizione;

                  vm.$router.push({
                    name: 'attendance',
                    params: {
                      id: data_row.ID
                    }
                  });
                });
              })
              return '<div style="text-align: center;"><a id="a_' + row + '" class="btn btn-primary" style="padding: 4px 8px; z-index: 9999; border-bottom-right-radius: 0px;margin-top:2px;"><i class="fa fa-user"></i></a></div>'
            } else {
              return '<span></span>'
            }
          } 
        }
      ],
      sessionsOptions: {
        selectionmode: "none",
        filterable: false,
        showfilterrow: false,
        pagesize: 5
      },
      //E-LEARNING
      learningExpanded: false,
      learningHeaders: [
        {
          text: 'Nome',
          datafield: 'name',
          width: 250,
          type: 'string',
          tobecellsrenderered: function (data_row, row, columnfield, value, defaulthtml, columnproperties) {
            vm.$nextTick(function(){
              document.getElementById("name_client_"+row).addEventListener("click", function(){
                vm.$router.push({
                  name: 'participant',
                  params: {
                    id: data_row.id_part
                  }
                });
              });
            })
            return '<div style="padding: 5px; display: table; width: 100%; height: 100%;"><div style="display: table-cell; vertical-align: middle;"><a id="name_client_'+row+'" style="margin-bottom: 2px;"><span style="color: #42a5f5; font-size: initial;">'+value+'</h4></a></div></div>'
          } 
        },
        {
          text: 'Percentuale Avanzamento',
          datafield: 'percent',
          width: 200,
          type: 'number',
          tobecellsrenderered: function (data_row, row, columnfield, value, defaulthtml, columnproperties) {
            return '<div class="progress" style="height: 18px; padding-left: 0px; padding-right: 0px; margin: 7px 5px;"><div class="progress-bar progress-bar-info" role="progressbar" :aria-valuenow="'+value+'" aria-valuemin="0" aria-valuemax="100" style="width:'+value+'%">'+value+'%</div></div>'
          } 
        },
        {
          text: 'Numero Accessi',
          datafield: 'access',
          width: 100,
          type: 'number'
        },
        {
          text: 'Tempo Previsto',
          datafield: 'timeprev',
          width: 150,
          type: 'number',
          tobecellsrenderered: function (data_row, row, columnfield, value, defaulthtml, columnproperties) {
            return '<div class="jqx-grid-cell-left-align" style="margin-top: 8px;">'+ value + ' ore</div>';
          } 
        },
        {
          text: 'Tempo Consuntivo',
          datafield: 'timecons',
          width: 150,
          type: 'number',
          tobecellsrenderered: function (data_row, row, columnfield, value, defaulthtml, columnproperties) {
            return '<div class="jqx-grid-cell-left-align" style="margin-top: 8px;">'+ value + ' ore</div>';
          } 
        },
        {
          text: 'Consuntivo / Previsto',
          datafield: 'timepercent',
          width: 150,
          type: 'number',
          tobecellsrenderered: function (data_row, row, columnfield, value, defaulthtml, columnproperties) {
            return '<div class="jqx-grid-cell-left-align" style="margin-top: 8px;">'+ value + ' %</div>';
          } 
        },
        {
          text: 'Primo Accesso',
          datafield: 'datefirst',
          width: 200,
          type: 'date',
          cellsformat: 'dd MMMM yyyy, h:mm tt'
        },
        {
          text: 'Ultimo Accesso',
          datafield: 'datelast',
          width: 200,
          type: 'date',
          cellsformat: 'dd MMMM yyyy, h:mm tt'
        },
        {
          text: 'Data di Completamento',
          datafield: 'datecompl',
          width: 200,
          type: 'date',
          cellsformat: 'dd MMMM yyyy, h:mm tt'
        },{
          text: 'Punteggio',
          datafield: 'score',
          width: 150,
          type: 'number'
        }
      ],
      learningOptions: {
        selectionmode: "none",
        filterable: true,
        showfilterrow: true,
        rowsheight: 45,
        pagesize: 5
      },
      //LISTA PARTECIPANTI
      //'IDPartecipazione', 'IDPartecipante', 'NomePersona', 'CognomePersona', 'DescrizioneStato', 'CITTA', 'Immagine'
      studentList: [],
      studentHeaders: [{
          text: '',
          datafield: 'Immagine',
          width: 60,
          sortable: false,
          filterable: false,
          pinned: true,
          hidden: true,
          type: 'string',
          tobecellsrenderered: function (data_row, row, columnfield, value, defaulthtml, columnproperties) {
           return '<div style="width: 100%; text-align: center;"><img style="margin-left: 0px;" height="60" width="60" src="' + localStorage.getItem("path")+value + '"/></div>';
          } 
        },
        {
          text: 'Persona',
          datafield: 'PERSONA',
          width: '75%',
          type: 'string',
          tobecellsrenderered: function (data_row, row, columnfield, value, defaulthtml, columnproperties) {
            return '<div style="padding: 5px; display: table; width: 100%; height: 100%;"><div style="display: table-cell; vertical-align: middle;"><span style="font-size: initial;"><img style="margin: 1px 10px 1px 1px;" height="50" width="50" src="' + localStorage.getItem("path") + data_row.Immagine + '"/>'+value+'</span></div></div>'
          } 
        }, /* {
          text: 'Cognome',
          datafield: 'CognomePersona',
          width: '25%',
          type: 'string'
        }, */ {
          text: 'Città',
          datafield: 'CITTA',
          width: '25%',
          hidden: true,
          type: 'string'
        },{
          text: 'Stato',
          datafield: 'DescrizioneStato',
          width: '25%',
          type: 'string'
        }
      ],
      studentOptions: {
        selectionmode: "none",
        filterable: true,
        showfilterrow: true,
        rowsheight: 60,
        pagesize: 5
      },

      //UPLOADER
      //!! TODO: ID? TIPOOGGETTO?
      uploadData: {
        callerId: "inserisciAllegato",
        idOggetto: null,
        tipoOggetto: "Edizione"
      },
      reloadingAllegati: false,
      showChoice: false,
      deleting: {}
    }
  },
  methods: {
    reset_data: function(){
      this.content = null;
      this.original = null;
      this.editor_expanded = null;
      this.my_edit = null;
      this.sessions = [];
    },
    tryFromRoute: function() {
      var id;
      try {
        id = this.$route.params.idedizione;
        var collection = this.$store.getters.getEdizioni;
        var el = collection.find({
          'IdEdizione': parseInt(id)
        });
        if (el.length > 0) {
          this.localItem = el[0];
          this.initDetail();
        } else {
          this.$router.replace({
            name: 'lista-edizioni'
          });
        }
      } catch (err) {
        this.$router.replace({
          name: 'lista-edizioni'
        });
      }
    },
    initDetail: function() {
      console.log(this.localItem);
      this.uploadData.idOggetto = this.localItem.IdEdizione
      this.reset_data();
      this.loading = true;
      var promises = [];
      
      var vm = this;
      //GET EDITABLE CONTENT
      vm.content = this.localItem.ProgrammaCorso;
      vm.original = this.localItem.ProgrammaCorso;
  
      //GET SESSIONS LIST
      var query = {
        "Data": this.localItem.DataInizio,
        "StringaIdPersone": "",
        "IdCorso": this.localItem.Idcorso,
        "IdEdizione": this.localItem.IdEdizione,
        "IdAttivita": 0
      }
      
      promises.push(this.$http.post(this.path+"/Webapi", JSON.stringify(query), {
          headers: {
              "X-HTTP-Method-Override": "GetJSONCalendarioFormazione",
              "Content-Type": "application/json"
          }
      }).then(function(response){
        var res = response.body
        try {
            var res = JSON.parse(response.body);
        } catch (err) {}
        if(res){
            var testing = false;
            var lessons_factory = [];
            
            if(res && res.data && res.data.length > 0){

              lessons_factory = res.data.map(function(obj){
                try{
                  obj.daOraAttivita = obj.daOraAttivita.split(" ");
                  obj.daOraAttivita = obj.daOraAttivita[obj.daOraAttivita.length - 1];
                  obj.aOraAttivita = obj.aOraAttivita.split(" "); 
                  obj.aOraAttivita = obj.aOraAttivita[obj.aOraAttivita.length - 1];
                  console.log(obj.IdDocente)
                  obj.IdDocente = obj.IdDocente.toFixed();
                } catch(err) {
                  console.log(err)
                }
                return obj;
              })

            } else if(res.do_loaded == 'False' && testing){
              
              var n = chance.natural({min: 2, max: 6})
     
              for(var i = 0; i < n; i++){
                var ndocenti = chance.natural({min: 1, max: 2})
                var amITeacher = chance.bool({likelihood: 60});
                var iddocenti = [];
                var docenti = [];
       
                if(amITeacher){
                  iddocenti.push(vm.myid)
                  docenti.push(localStorage.getItem("nomecognome"))
                  ndocenti--;
                }
                for(var ii = 0; ii< ndocenti; ii++){
                  iddocenti.push(chance.natural({min: 1000, max: 5000}));
                  docenti.push(chance.name({nationality: 'it'}));
                }
                docenti = docenti.join(",")
                iddocenti = iddocenti.join(",")
          
                var milli_i = Date.parse(new Date(this.localItem.DataInizio));
                var milli_f = Date.parse(new Date(this.localItem.DataFine))
                var when = chance.natural({min: milli_i, max: milli_f})
                when = new Date(when).toLocaleDateString();
            
                lessons_factory.push({
                  idAttivita: i*619,
                  dataAttivita: when,
                  daOraAttivita: "09:00",
                  aOraAttivita: "13:30",
                  IdDocente: iddocenti,
                  docente:docenti, 
                  aula: chance.address({country: 'it'})
                })
                
              }
            }
            vm.sessions = lessons_factory.map(function(s){
              var arraystringhe = s.docente.split(',');
              for(var i = 0; i < arraystringhe.length; i++){
                if(arraystringhe[i].trim().toLowerCase() == localStorage.getItem("nomecognome").toLowerCase()){
                  arraystringhe[i] = 'Tu';
                }
              }
              var arrayid = s.IdDocente.split(',');
              var session = {
                ID: s.idAttivita,
                Data: s.dataAttivita,
                Inizio: s.daOraAttivita,
                Fine: s.aOraAttivita,
                IDDocente: arrayid,
                Docente: arraystringhe.join(", "),
                Aula: s.aula,
                AmITeacher: arrayid.indexOf(vm.myid) != -1
              }
              
              return session;
            })
            
        }
      }, function(error){
        console.log("Error in API SESSIONI CALENDARIO LOL");
        console.log(error);
      }))
      //GET EL TRACKING
      promises.push(this.getPeopleTracking(this.localItem.IdEdizione));
      //GET STUDENTS LIST
      promises.push(this.$http.get(this.path + "/APIPartecipazioni?IdEdizione="+this.localItem.IdEdizione).then(function(response){
        var res = response.body
        try {
          res = JSON.parse(response.body);
        } catch (err) {}
        if(res && res.APIPartecipazioni){
          var props = ['IDPartecipazione', 'IDPartecipante', 'NomePersona', 'CognomePersona', 'PERSONA','DescrizioneStato', 'CITTA', 'Immagine'];
          this.studentList = res.APIPartecipazioni.map(function(p){
            var obj = {};
            for (var i in props){
              obj[props[i]] = p[props[i]];
            };
            return obj;
          })
        } else {
          this.studentList = [];
        }
      }, function(error){
        console.log("Error in API Partecipazioni");
        console.log(error);
      }))

      this.allegatiEdizione = [];
      promises.push(this.$http.get(this.path + "/APIDocumenti?TipoOggetto=Edizione&IdOggetto="+this.localItem.IdEdizione).then(function(response){
        var res = response.body
        try {
          res = JSON.parse(response.body);
        } catch (err) {}

        var testing = false;
        if(res && res.APIDocumenti){
          for(var i = 0; i < res.APIDocumenti.length; i++){
            
            var r = res.APIDocumenti[i];
            var obj = {
              id: r.ID,
              nome: r.Nome,
              path: r.Link
            }
              
            var displayName = obj.nome.split(".");
            obj.ext = displayName.splice(displayName.length - 1, 1);
            displayName = displayName.join(".");
            obj.displayName = displayName;
            this.allegatiEdizione.push(obj);
            
          }
        } else {
          if(testing){
            if(this.localItem.IdEdizione % 2 == 0){
              this.allegatiEdizione = [{
                id: 0,
                nome: chance.company() + '.pdf',
                path: '/'
              }];
            }
          }
        }
      }, function(error){
        console.log("Error in API Partecipazioni");
        console.log(error);
      }))

      if (promises.length > 0) {
        Promise.all(promises).then(function() {
          vm.loading = false;
        }, function(err) {
          console.log("Err in Edition Promise All")
          vm.loading = false;
        })
      } else {
        vm.loading = false;
      }
    },
    endModalUpload(uploadData) {
      if (uploadData.choice == "ok") {
        console.log("Upload ok")
        this.reloadAttachedFiles();
      } else if(uploadData.choice == "error"){
        eventBus.$emit('alert', "Se è verificato un errore nel salvataggio degli allegati");
        this.reloadAttachedFiles();
      }
      this.showUploader = false;
    },
    reloadAttachedFiles: function(){
      this.reloadingAllegati = true;
      this.allegatiEdizione = [];
      this.$http.get(this.path + "/APIDocumenti?TipoOggetto=Edizione&IdOggetto="+this.localItem.IdEdizione).then((response) => {
        var res = response.body
        try {
          res = JSON.parse(response.body);
        } catch (err) {}

        var testing = false;
        if(res && res.APIDocumenti){
          for(var i = 0; i < res.APIDocumenti.length; i++){
            var r = res.APIDocumenti[i];
            var obj = {
              id: r.ID,
              nome: r.Nome,
              path: r.Link
            }
            var displayName = obj.nome.split(".");
            obj.ext = displayName.splice(displayName.length - 1, 1);
            displayName = displayName.join(".");
            obj.displayName = displayName;
            this.allegatiEdizione.push(obj);
          }
        } else {
          if(testing){
            if(this.localItem.IdEdizione % 2 == 0){
              this.allegatiEdizione = [{
                id: 0,
                nome: chance.company() + '.pdf',
                path: '/'
              }, {
                id: 1,
                nome: chance.company() + '.pdf',
                path: '/'
              }]
            }
          }
        }
        this.reloadingAllegati = false;
      }, (error) => {
        this.reloadingAllegati = false;
      })

    },
    findAndUpdateCollections: function(ed, count) {
      //effettua l'update nella collezione di loki, così finchè non si ricarica la pagina, non sarà neceserrario rieseguire il fetch
      this.edizioniCollection.findAndUpdate({
        'IdEdizione': ed
      }, function(obj) {
        obj.NumCompletamenti = count
      });
    },
    download: function(id, nome){
      this.$http.get(this.path + "/Webapi", {
        headers: {
          "X-HTTP-Method-Override": "GetDocumento",
          idDocumento: id.toString()
        }
      }).then((response) => {
        var res = response.body
        try {
          res = JSON.parse(response.body);
        } catch (err) {}
        
        if(res.charAt(res.length - 1) == '.'){
          res = res.slice(0, res.length - 1);
        }
        window.open(this.path + res);
      });
    },
    checkDeletion(file){
      this.deleting = file;
      this.showChoice = true;
    },
    handleChoice: function($event){
      this.showChoice = false;
      if ($event == true) {
        this.deleteFile();
      }
    },
    deleteFile: function(){
      var file = this.deleting;
      var deleteObj = {
        IDDocumento: file.id
      }
      this.$http.post(localStorage.getItem('path') + '/Webapi',  deleteObj, {
          headers: {
              "X-HTTP-Method-Override": "DeleteDocumenti"
          }
      }).then((r) => {
          console.log("delete ok")
          this.reloadAttachedFiles();
      },(err) => {
          console.log("error")
          eventBus.$emit('alert', "Se è verificato un errore nella rimozione dell'allegato");
          this.reloadAttachedFiles();
      })
    },
    saveContent: function(){
      // replaced find&Insert with find&update
      // https://rawgit.com/techfort/LokiJS/master/jsdoc/Collection.html
      // TODO: write into APIEdizioni
      var eds = this.$store.getters.getEdizioni;
      var vm = this;
      eds.findAndUpdate({IdEdizione: this.localItem.IdEdizione}, function(obj){
        obj.ProgrammaCorso = vm.content;
      })
    }
  }
}
</script>
<style scoped>

  .badge {
    margin: 2px 0px 0px 5px;
  }
  .cs.custom_spinner {
    width: 100%;
  }
  .cs.custom_spinner:before {
    width: 35px;
    height: 35px;
    top: 50px;
  }

  #editor_wrapper,
  #jqw_container {
	    -webkit-transition: background-color 0.3s ease;
    	transition: background-color 0.3s ease;
	}
	#editor_wrapper.expanded,
  #jqw_container {
		position: fixed;
	    z-index: 9997;
	    top: 0;
	    left: 0;
	    width: 100%;
	    height: 100%;
	    background-color: rgba(0, 0, 0, .5);
	    display: table;
	}
  /*EDITOR*/
	a.a-expanded {
		position: fixed;
		bottom: 10%;
		right: 10%;
	}
	a.a-compress {
		position: absolute; 
		bottom: 15px; 
		right: 0px;
	}
  a.save-expanded {
    position: fixed;
		bottom: 10%;
		right: 15%;
  }
  a.save-compress {
    position: absolute; 
		bottom: 15px; 
		right: 35px;
  }
  /*GRID*/
  a.el-expanded {
    position:fixed;
    top: 5%;
    right: 3%;
  }
  a.el-compress {
    float: right;
  }
  /*BOTH*/
  a.a-compress,
  a.el-compress,
  a.save-compress {
    z-index: 2000;
  }
  a.a-expanded,
  a.el-expanded,
  a.save-expanded {
    z-index: 9999;
  }
  
	.wrapper_padding_xs {
		padding: 10px;
	}

  thead > tr {
    background-color: #42a5f5;
    color: white;
  }
  thead > tr > th {
    font-family: 'segoe ui', arial, sans-serif;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
  }

  td,th{
    width: 15%;
    padding: 5px 10px !important;
    text-align: left;
  }
  td.filename,th.filename {
    width: 55%;
  }

  td.center, th.center {
    text-align: center;
  }
</style>
<style> 

.jqx-scrollbar-mobile .jqx-scrollbar-thumb-state-normal-horizontal, .jqx-scrollbar-mobile .jqx-scrollbar-thumb-state-normal {
  z-index: 9997 !important;
}

#innerListBoxgridpagerlistlearningGrid{
  z-index: 9999 !important;
}
    
#jqw_container .jqx_grid_wrapper {
  background: #ebebeb;
  border-radius: 2px;
  overflow-y: auto;
  overflow-x: hidden;
  width: 94% !important;
  position: absolute;
  max-height: 90%;
  top: 5%;
  left: 3%;
}

div.quillWrapper {
  background-color: white;
  box-shadow: rgba(0, 0, 0, 0.3) 0px 2px 6px;
}
#editor_wrapper.expanded div.quillWrapper {
  top: 10%;
  left: 10%;
  height: 80%;
  width: 80%;
  position: fixed;
  z-index: 9998;
}

#editor_wrapper.expanded div.ql-toolbar {
  text-align: center;
  height: 8%;
}
#editor_wrapper.expanded div.ql-container {
  height: 92% !important;
}
#editor_wrapper.expanded.mobile div.ql-toolbar {
  height: 25%;
}
#editor_wrapper.expanded.mobile div.ql-container {
  height: 75% !important;
}

div.quillWrapper polygon {
  display: none;
}
#quill-container {
  height: 100px !important;
}
</style>
