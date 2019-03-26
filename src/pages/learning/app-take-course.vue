<template>
<div class="st-pusher" id="content">
  <!-- sidebar effects INSIDE of st-pusher: -->
  <!-- st-effect-3, st-effect-6, st-effect-7, st-effect-8, st-effect-14 -->
  <!-- this is the wrapper for the content -->
  <div class="st-content">
    <!-- extra div for emulating position:fixed of the menu -->
    <div class="st-content-inner padding-top-none">
      <div class="container-fluid">
        <div v-if="!ready" class='uil-rolling-css' :style="{transform:'scale(0.71)',
              position: 'absolute', margin: '0 auto', top: '100px', right: '0px', left: '0px'}">
          <div>
            <div></div>
            <div></div>
          </div>
        </div>
        <div v-else class="media media-grid media-clearfix-xs" style="margin-bottom: 10px;">
          <div class="media-body">
            <div class="page-section" style="padding-bottom: 5px !important;">
              <div class="media media-grid v-middle">
                <!-- su mobile, l'immagine va sopra al testo -->
                <div :class="[$root.xs ? 'center-align' : 'media-left']">
                  <!-- <span class="icon-block half bg-blue-300 text-white">{{idcorso}}</span> -->
                  <!-- -->
                  <div class="width-60 height-60 thumbnail" :class="[$root.xs ? 'i-b' : '']">
                    <div class="bg-img" style="height: 100%; width: 100%;" :style="'background-image:url(' + img + ')'"></div>
                    <!-- <img id="thumb-c" class="width-50 height-50"></div> -->
                  </div>
                </div>
                <div class="media-body">
                  <h1 class="text-display-1 margin-none" :class="{'title-shrinked': $root.xs}">{{titolo}}</h1>
                </div>
              </div>
              <br/>
              <p class="text-body-2" v-html="descrizione"></p>
            
            
              <div class="row">
                <div class="col-xs-12">
                  <div v-if="programmazioneEdizione != null && programmazioneEdizione!=''" class="well" style="padding: 12px; overflow: auto;">
                    <h4 class="progr">Programmazione</h4>
                    <div v-html="programmazioneEdizione"></div>
                  </div>
                </div>
                
                <div v-if="allegati_edizione && allegati_edizione.length > 0" class="col-xs-12">
                  <div style="text-align: left; margin-bottom: 10px;">
                    <a class="btn btn-info btn-sm" role="button" data-toggle="collapse" href="#collapseAllegati" aria-expanded="false" aria-controls="collapseAllegati" style="background-color: #7986cb;">
                      Materiali Didattici
                    </a>
                    <div class="collapse" id="collapseAllegati">
                      <div>
                        <ul class="list-group" style="margin: 2px 0px; width: max-content;">
                          <li v-for="file in allegati_edizione" class="list-group-item row"><div class="col-xs-12" style="border-left: 0px;">
                          <a href="" class="btn btn-warning" @click.prevent="download(file)" style="margin: 0px 5px 0px 0px;"><i class="fa fa-download"></i></a>
                          <div style="display: inline-block;">{{file.nome}}</div></div></li>
                        </ul>
                      </div>
                    </div>
                  </div>
              </div>
                
              </div>
              
            </div>
            
            <div class="row">
            <div class="col-xs-12" :class="[info_docenti && info_docenti.length > 0 ? 'col-sm-8' : 'col-sm-12']">
              <module-list :modules_array="moduli" :flag="flag" :edizione="edizione"></module-list>
            </div>
            <div class="col-xs-12 col-sm-4">
              <h4 class="text-headline margin-none" style="text-align: left;">Docenti
              </h4>
              <div v-for="teacher in info_docenti" class="panel panel-default paper-shadow" data-z="0.5" data-hover-z="1" data-animated style="margin-bottom: 18px;">
                <div class="panel-body">
                  <div class="media v-middle">
                    <div class="media-left">
                      <img :src="teacher.Immagine" onerror="this.src = 'images/profile-photo_small.png'" width="60" class="img-circle" />
                    </div>
                    <div class="media-body">
                      <h4 class="text-title margin-none"><a href="#" @click.prevent="">{{teacher.Nome + " " + teacher.Cognome}}</a></h4>
                      <span class="caption text-light" v-if="teacher.RUOLO">{{teacher.RUOLO}}</span>
                    </div>
                  </div>
                  <br/>
                  <div v-if="teacher.Biografia != null">
                    <p v-html="teacher.Biografia" style="margin-top: 4px;"></p>
                  </div>
                </div>
              </div>
            </div>
            </div>
          </div>
          <!-- ROQUETTE
          <div class="media-right">
              <div class="page-section width-270 width-auto-xs">

                  <courseDetails :corso="prop_object" :uo="uos"></courseDetails>
              </div>
          </div>
          -->
        </div>

        <calendar v-if="show_calendar && allow_calendar" :configs="calendar_props"></calendar>
      </div>
      <sidejsonly :default="true"></sidejsonly>
    </div>
    <!-- /st-content-inner -->
  </div>
  <!-- /st-content -->
</div>
</template>
<script>
import {
  eventBus
} from '../../eventbus.js';

import calendar from '../calendar/calendar.vue'
import sidejsonly from '../components/side-default-jsonly.vue'
import courseDetails from '../components/course-details.vue'
import moduleList from './interactive-module-list.vue'

export default {
  components: {
    calendar,
    sidejsonly,
    courseDetails,
    moduleList
  },
  mounted: function() {
    if (this.$root.inCharge) {
      this.isChief = true;
      this.uos = this.$root.inCharge.uos;
    }
  },
  created: function() {
    this.init();
  },
  data: function() {
    return {
      idpersona: 0,
      idcorso: null,
      titolo: '',
      descrizione: '',
      moduli: [],
      edizione: null,
      programmazioneEdizione: null,
      ready: false,

      imgIcon: '',
      stillTracking: true,
      dontWatch: false,

      img: null,

      allow_calendar: this.$root.getEnablingObject().calendar,
      show_calendar: false,
      calendar_props: {},

      isChief: false,
      uos: [],
      prop_object: {},
      flag: false,

      allegati_edizione: null,
      info_docenti: []
    }
  },
  watch: {
    edizione: function() {
      if (!this.dontWatch) {
        this.applyCheckPartecipazione();
      }
    },
    '$route': function() {
      this.init();
    }
  },
  methods: {
    init: function() {
      this.idpersona = localStorage.getItem("idpersona")

      this.idcorso = null;
      try {
        this.idcorso = this.$route.params.idcorso;
      } catch (err) {
        console.log(err)
      }

      this.edizione = null;
      this.dontWatch = false;
      this.stillTacking = true;
      this.show_calendar = false;
      this.calendar_props = {};
      this.applyCheckPartecipazione();
    },
    loadCalendar: function() {
      this.calendar_props = {
        edizione: this.edizione,
        corso: this.idcorso
      }
      this.show_calendar = true;
    },
    applyCheckPartecipazione: function() {
      var vm = this;
      var id = this.idcorso;
      var controllo = new Promise(function(resolve, reject) {
        var ed = null;
        try {
          ed = vm.$route.params.idedizione;
        } catch (err) {
          console.log(err);
        }
        //Edizione definita come parametro di routing
        var partecipazioni = vm.$store.getters.getPartecipazioni;
        if (partecipazioni && partecipazioni != 'undefined') {

          if (ed != null && ed != "") {

            var res = partecipazioni.find({
              'IDCorso': Number(id)
            })
            var got_it = false;
            for (var i = 0; i < res.length; i++) {
              if (res[i].IdEdizione == ed) {
                got_it = true;
                resolve(ed);
              }
            }
            if (!got_it) {
              eventBus.$emit('alert', "Accesso negato");
              reject({
                msg: 'matching edition not found, searching for one...',
                try_again: true
              });
            }
          } else {

            var suitables = [];
            var matching_corsi = partecipazioni.find({
              'IDCorso': Number(id)
            });
            for (var i = 0; i < matching_corsi.length; i++) {
              //se la partecipazione è relativa a un'edizione, e lo stato è iscritto o completato.. elaboro
              //MAICOL ?
              if (matching_corsi[i].IdEdizione != null &&
                (matching_corsi[i].StatoIscritto + matching_corsi[i].StatoFinale) < 0) {
                suitables.push(matching_corsi[i]);
              }
            }
            suitables.sort(function(a, b) {
              //uno iscritto e l'altro no
              if (a.StatoIscritto != b.StatoIscritto) {
                return a.StatoIscritto - (b.StatoIscritto);
              }
              //entrambi iscritti
              if ((a.StatoIscritto + b.StatoIscritto) == -2) {
                return new Date(b.DataInserimento.replace(/-/g, '/')) - new Date(a.DataInserimento.replace(/-/g, '/'));
              }
              //nessuno dei due è iscritto... stessa cosa
              return new Date(b.DataInserimento.replace(/-/g, '/')) - new Date(a.DataInserimento.replace(/-/g, '/'));

            });
            if (suitables.length > 0) {
              resolve(suitables[0].IdEdizione);
            } else {
              reject({
                msg: 'no suitable attendance found',
                try_again: false
              });
            }
          }
        } else {
          reject({
            msg: 'missing attendances data',
            try_again: false
          });
        }
      });
      controllo.then((response) => {
        console.log(response)
        //response riporta l'id edizione corretto oppure "nothing found"
        this.getContentCorso(response);
      }, (err) => {
        console.log(err.msg)
        if (err.try_again) {
          this.attemptWithoutEdition()
        } else {
          this.navigateToUnsubscribed();
        }
      });
    },
    getContentCorso: function(with_edition) {

      this.dontWatch = true;
      this.edizione = with_edition;
      var promises = [];
      // DATA CORSO
      promises.push(this.$http.get(localStorage.getItem('path') + '/APICorsi?ID=' + this.idcorso).then((response) => {
        var dettaglioCorso = response.body;
        try {
          dettaglioCorso = JSON.parse(response.body);
        } catch (err) {};

        dettaglioCorso = dettaglioCorso.APICorsi[0]

        //CALENDAR CHECK
        console.log(dettaglioCorso)
        if (dettaglioCorso.ELearningTipoFormazione != -1 && this.allow_calendar) {
          this.loadCalendar();
        }

        this.titolo = dettaglioCorso.Titolo
        if (dettaglioCorso.Contenuti != null) {
          this.descrizione = dettaglioCorso.Contenuti.replace(/style=".*?"/g, '');
        }

        if (dettaglioCorso.Immagine != null) {
          this.img = dettaglioCorso.Immagine;
        } else {
          this.img = "images/course-placeholder.png";
        }
        this.prop_object = {
          titolo: this.titolo,
          idcorso: this.idcorso,
          ore: dettaglioCorso.Ore
        }
      }));

      var m = this.$root.getModule(this.idcorso);
      // DATA MODULI
      if (m == null) {
        promises.push(this.$http.get(localStorage.getItem('path') + '/APIModuli?IdCorso=' + this.idcorso).then((response) => {
          var moduliCorso = response.body;
          try {
            moduliCorso = JSON.parse(response.body);
          } catch (err) {};
          if (moduliCorso && moduliCorso.APIModuli) {
            moduliCorso = moduliCorso.APIModuli;

            let moduliCorsoOrdered = moduliCorso.sort(function(a, b) {
              return a.Sequenza - b.Sequenza
            })

            this.moduli = [];
            var padre
            if (moduliCorsoOrdered[0].TipoModulo != "Raccoglitore") {
              padre = moduliCorsoOrdered[0].Modulo
            } else {
              padre = moduliCorsoOrdered[0].Modulo
            }

            var figli = []

            for (let i = 0; i < moduliCorsoOrdered.length; i++) {

              let nodo = moduliCorsoOrdered[i]

              //!nodo.Minuti
              if (nodo.TipoModulo == "Raccoglitore") {
                if (figli.length > 0) {
                  this.moduli.push({
                    nome: padre,
                    children: figli,
                    toshow: false,
                    //aggiunto ref per gestire il toggle
                    ref: i,

                    target: '#' + this.moduli.length + 'alpha'
                  })
                  figli = []
                  padre = nodo.Modulo
                }
              } else {

                let obj = {
                  nome: nodo.Modulo,
                  id: nodo.IDModulo,
                  minuti: nodo.Minuti,
                  commenti: 0,
                  iddisc: 0,
                  allowed_open: nodo.Link != null
                }

                figli.push(obj);
              }
            }

            this.moduli.push({
              nome: padre,
              children: figli,
              toshow: false,
              //aggiunto ref per gestire il toggle
              ref: moduliCorsoOrdered.length - 1,

              target: '#' + this.moduli.length + 'alpha'
            })
            console.log(this.moduli)
            this.$root.saveModules(this.idcorso, this.moduli);
            this.controlTracking();
            this.findDiscussions();
          }
        }));
      } else {
        this.moduli = m.data;
        this.controlTracking();
        this.updateDiscussionsCount();
      }
      // DATA EDIZIONE
      promises.push(this.$http.get(localStorage.getItem("path")+"/APIEdizioni?IdEdizione=" + this.edizione).then((response) => {
        var res = response.body;
        try {
          res = JSON.parse(response.body);
        } catch (err) {};
        if(res && res.APIEdizioni){
          res = res.APIEdizioni[0];
          this.programmazioneEdizione = res.ProgrammaCorso;
          
          // -  FORCING FETCHING FROM STORED LOKI COLLECTION
          try {
            var eds = this.$store.getters.getEdizioni;
            console.log(eds)
            if(eds != null){
              var ed = eds.find({IdEdizione: this.edizione})
              console.log(ed)
              this.programmazioneEdizione = ed[0].ProgrammaCorso;
              console.log(this.programmazioneEdizione)
            }
          } catch(err){
            console.log(err)
          }
        }
      }));

      //ALLEGATI EDIZIONE
      this.allegati_edizione = [];
      promises.push(this.$http.get(localStorage.getItem("path")+"/APIDocumenti?TipoOggetto=Edizione&IdOggetto=" + this.edizione).then((response) => {
        var res = response.body;
        try {
          res = JSON.parse(response.body);
        } catch (err) {};

        if(res && res.APIDocumenti){
          for(var i = 0; i < res.APIDocumenti.length; i++){
            var r = res.APIDocumenti[i];
            this.allegati_edizione.push({
              id: r.ID,
              nome: r.Nome,
              path: r.Link
            });
          }
        }
      }));

      //INFO DOCENTI
      this.info_docenti = [];
      console.log(this.edizione)
      promises.push(this.$http.get(localStorage.getItem("path") + "/APIDocentiEdizioni?IdEdizione=" + this.edizione).then((response) => {
        var res = response.body;
        try {
          res = JSON.parse(response.body);
        } catch (err) {};
        if(res && res.APIDocentiEdizioni){
          var ids = [];
          for(var i = 0; i < res.APIDocentiEdizioni.length; i++){
            ids.push(res.APIDocentiEdizioni[i].IDPersona)
          }
          ids = ids.join(";")
          
          var testing = true;
          
          this.$http.get(localStorage.getItem("path") + "/APIPersone?IDPERSONA=" +ids).then((response) => {
            var res = response.body;
            try {
              res = JSON.parse(response.body);
            } catch (err) {};
            if(res && res.APIPersone) {
              for (var i = 0; i < res.APIPersone.length; i++){
                var r = res.APIPersone[i];
                var obj = {
                  Nome: r.NOME,
                  Cognome: r.COGNOME,
                  ID: r.IDPERSONA,
                  RUOLO: r.RUOLO,
                  Immagine: r.IMMAGINE,
                  Biografia: r.Biografia
                }
                
                if(obj.Immagine != null){
                  obj.Immagine = localStorage.getItem("path") + obj.Immagine;
                }
                this.info_docenti.push(obj);
              }
              console.log(this.info_docenti)
            } else{
              if(testing){
                this.$http.get(localStorage.getItem("path") + "/APIUtenti?IDPersona=" +ids).then((response) => {
                  var res = response.body;
                  try {
                    res = JSON.parse(response.body);
                  } catch (err) {};
                  if(res && res.APIUtenti) {
                    for (var i = 0; i < res.APIUtenti.length; i++){
                      var obj = {
                        Nome: res.APIUtenti[i].NomePersona,
                        Cognome: res.APIUtenti[i].CognomePersona,
                        ID: res.APIUtenti[i].IDPersona,
                        RUOLO: res.APIUtenti[i].Utente,
                        Immagine: null,
                        Biografia: "<p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, commodo vitae, ornare sit amet, wisi. Aenean fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui. Donec non enim in turpis pulvinar facilisis. Ut felis. Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat. Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus</p>"
                      }
                      if(i == 0){
                        obj.Biografia = null;
                      }
                      if(obj.Immagine != null){
                        obj.Immagine = localStorage.getItem("path") + obj.Immagine;
                      }
                      this.info_docenti.push(obj);
                    }
                    console.log(this.info_docenti)
                  }
                  
                });
              }
            }
            
          });
          
        }
      }));

      var vm = this;
      Promise.all(promises).then(function() {
        vm.ready = true;
      }, function(err) {
        console.log("Error in promise all with promises length " + promises.length);
        console.log(err)
      });
    },
    attemptWithoutEdition: function() {
      this.$router.replace({
        name: 'corso',
        params: {
          idcorso: this.idcorso
        }
      });
    },
    navigateToUnsubscribed: function() {
      this.$router.replace({
        name: 'course',
        params: {
          idcorso: this.idcorso
        }
      });
    },
    findDiscussions: function() {
      this.$http.get(localStorage.getItem('path') + '/APIDiscussioni?IdOggetto=' + this.edizione).then((response) => {
        var discussioni = response.body;
        try {
          discussioni = JSON.parse(response.body);
        } catch (err) {};

        if (discussioni != null && discussioni.APIDiscussioni != null && discussioni.APIDiscussioni.length > 0) {
          discussioni = discussioni.APIDiscussioni;

          var ids = []
          for (var i = 0; i < discussioni.length; i++) {
            ids.push(discussioni[i].ID);
          }
          ids = ids.join(";");
          this.$http.get(localStorage.getItem('path') + '/APICommentiDiscussione?IDDiscussione=' + ids).then((response) => {
            var res = response.body;
            try {
              res = JSON.parse(response.body);
            } catch (err) {};

            if (res && res.APICommentiDiscussione) {
              var comms = res.APICommentiDiscussione.sort(function(a, b) {
                return a.IDDiscussione - b.IDDiscussione;
              })
              var prev = comms[0].IDDiscussione;
              var counter = 1;
              for (var i = 1; i < comms.length; i++) {
                if (comms[i].IDDiscussione == prev) {
                  counter++;
                } else {
                  this.registerComms(prev, counter, discussioni);
                  counter = 1;
                  prev = comms[i].IDDiscussione;
                }
              }
              this.registerComms(prev, counter, discussioni);

              this.$root.saveModules(this.idcorso, this.moduli);
            }
          }, (err) => {
            console.log(err)
          });
        }
      });
    },
    registerComms: function(prev, counter, discussioni) {
      var ind = -1;
      discussioni.forEach(function(d, i) {
        if (d.ID == prev) {
          ind = i;
        }
      });
      var idModulo = discussioni[ind].IdOggettoSecondario;
      for (var ii = 0; ii < this.moduli.length; ii++) {
        var index = -1;
        this.moduli[ii].children.forEach(function(child, i) {
          if (child.id == idModulo) {
            index = i;
          }
        });

        if (index != null && index != -1) {
          this.moduli[ii].children[index].commenti = counter;
          this.moduli[ii].children[index].iddisc = prev;
          break;
        }
      }
    },
    controlTracking: function() {
      var allChildren = [];
      for (var i = 0; i < this.moduli.length; i++) {
        allChildren = allChildren.concat(this.moduli[i].children);
      }

      this.$http.get(localStorage.getItem('path') + '/APITracking?IDEdizione=' + this.edizione + '&IDPersona=' + localStorage.getItem("idpersona") + "&MassimoAvanzamento=-1").then((response) => {
        var trackers = response.body;
        try {
          trackers = JSON.parse(response.body);
        } catch (err) {};

        if (trackers != null && trackers.APITracking != null) {
          trackers = trackers.APITracking;
          var k = 0
          for (var i = 0; i < trackers.length; i++) {
            var found = false;
            var kw = k;
            for (kw; kw < allChildren.length; kw++) {
              if (trackers[i].IDModulo == allChildren[kw].id) {
                allChildren[kw].tracking_status = trackers[i].Stato;
                found = true;
                kw++;
                // non aggiorno se il passo è troppo grande
                if (kw - k <= 5) {
                  k = kw;
                }
                break;
              }
            }
            //se non lo trova in ordine
            if (!found) {
              for (var j = 0; j < allChildren.length; j++) {
                if (trackers[i].IDModulo == allChildren[j].id) {
                  allChildren[j].tracking_status = trackers[i].Stato;
                  break;
                }
              }
            }
          }

          this.saveModAndTracking();
        }
      });
    },
    updateDiscussionsCount: function() {
      for (var i = 0; i < this.moduli.length; i++) {
        var mod = this.moduli[i].children;
        for (var j = 0; j < mod.length; j++) {
          // i moduli che non avevano una discussione all'ultimo aggiornamento non vengono presi in considerazione
          if (mod[j].commenti != 0) {
            let ref = this.moduli[i].children[j];
            this.$http.get(localStorage.getItem('path') + '/APICommentiDiscussione?IDDiscussione=' + mod[j].iddisc).then((response) => {
              var comm = response.body;
              try {
                comm = JSON.parse(response.body);
              } catch (err) {};

              if (comm && comm.APICommentiDiscussione) {
                ref.commenti = comm.APICommentiDiscussione.length;
                //solo il conteggio dei commenti è aggiornato, non il contenuto del corso, quindi non aggiorno la data nella cache
                this.$root.saveModules(this.idcorso, this.moduli);
              }
            });
          }
        }
      }
    },
    saveModAndTracking() {
      this.stillTracking = false;
      this.flag = !this.flag;
      this.$root.saveModules(this.idcorso, this.moduli);
    },

    //DOIN'
    resizeBase64Img: function(base64, width, height) {

      var canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      var context = canvas.getContext("2d");
      var deferred = $.Deferred();
      $("<img/>").attr("src", base64).load(function() {
        context.scale(width / this.width, height / this.height);
        context.drawImage(this, 0, 0);
        deferred.resolve($("<img/>").attr("src", canvas.toDataURL()));
      });

      return deferred.promise();
    },
    download: function(file){
       this.$http.get(localStorage.getItem('path') + "/Webapi", {
        headers: {
          "X-HTTP-Method-Override": "GetDocumento",
          idDocumento: file.id.toString()
        }
      }).then((response) => {
        var res = response.body
        try {
          res = JSON.parse(response.body);
        } catch (err) {}
        
        console.log(res.length)
        console.log(res.charAt(res.length - 1));
        if(res.charAt(res.length - 1) == '.'){
          res = res.slice(0, res.length - 1);
        }
        window.open(localStorage.getItem('path') + res);
      });
    }
  }
}
</script>
<style>
span.collapse-close {
  color: #757575;
}

.pad-badge {
  margin-top: 7px;
  right: 50px;
}
</style>
<style scoped>
#collapseAllegati .list-group-item.row {
    margin: 0px; 
    background: transparent; 
    padding: 0px;
    border-style: none;
}
#collapseAllegati .list-group-item.row > div{
  border-radius: 1px 6px 6px 1px;
  padding: 6px 10px; 
  background-color: white;
  border: 1px solid #e2e9e6;
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.05);
}

#collapseAllegati .list-group-item.row > div > a{
  padding: 4px 6px;
  background-color: transparent;
  color: #f0ad4e;
  border-color: #f0ad4e;
  border-radius: 3px;
  margin: 0px 0px 0px 6px;
}

#collapseAllegati .list-group-item.row > div > a:hover{
  background-color: #f0ad4e;
  color: white;
}

h4.progr {
  margin-bottom: 10px; 
  font-weight: 400 !important
}
</style>
