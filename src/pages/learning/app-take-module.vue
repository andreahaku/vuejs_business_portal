<template>
<div class="st-pusher" id="content">
  <!-- sidebar effects INSIDE of st-pusher: -->
  <!-- st-effect-3, st-effect-6, st-effect-7, st-effect-8, st-effect-14 -->
  <!-- this is the wrapper for the content -->
  <div class="st-content" v-show="display_e">
    <!-- extra div for emulating position:fixed of the menu -->
    <div class="st-content-inner padding-none">
      <div class="container-fluid">
        <div class="visible-xs-block bg" style="text-align: right;">
          <router-link tag="button" :to="{ name: 'corsoWithEd', params: {idcorso: idcorso, idedizione: edizione}}" class="btn btn-primary" type="button" style="margin:10px 5px 0px 5px;">TORNA AL CORSO<i class="fa fa-reply" aria-hidden="true" style="padding:0px 5px 0px 10px;"></i></router-link>
        </div>
        <div class="media media-grid media-clearfix-xs" style="margin-top: 0px;">
        <div class="media-left hidden-xs bg" style="text-align: left;">
            <div class="page-section width-270 width-auto-xs" style="padding-top: 10px;">
              <router-link tag="button" :to="{ name: 'corsoWithEd', params: {idcorso: idcorso, idedizione: edizione}}" class="btn btn-primary" type="button" style="margin:5px 0px 15px 0px;">TORNA AL CORSO<i class="fa fa-reply" aria-hidden="true" style="padding:0px 5px 0px 10px;"></i></router-link>
              <!-- .panel -->
              <div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
                <div v-for="(capitolo, index) in moduli" class="panel panel-default paper-shadow adjust-margin" data-z="0.5" data-hover-z="1" data-animated>
                  <div class="point panel panel-body" data-toggle="collapse" data-parent="#accordion" :data-target="capitolo.target" :aria-controls="index+'alpha'">
                    <h4 class="text-headline">{{capitolo.nome}}</h4>
                  </div>
                  <div :id="index+'alpha'" class="panel-collapse collapse" :class="{in: index==indexfather}" data-toggle="popover" data-placement>
                    <ul class="list-group ul-son">
                      <li v-for="modulo in capitolo.children" class="list-group-item" :class="{activee: modulo.id == idmodulo}" @click="tryRep(modulo.id, edizione)" :id="modulo.id">
                        <div class="media v-middle">
                          <div class="media-left" style="padding-top: 0px;">
                            <!--
                              gestire cambio colore in base allo status del modulo:
                              bg-grey-400 : modulo non iniziato
                              bg-orange-400 : modulo iniziato non terminato
                              bg-green-400 : modulo terminato
                            -->
                            <div v-if="stillTracking" class="icon-block s30 text-white bg-grey-400"><i class="fa fa-mortar-board"></i></div>
                            <div v-else class="icon-block s30 text-white" v-bind:class="{'bg-grey-400': (modulo.tracking_status!='Iniziato' && modulo.tracking_status!='Completato' && modulo.tracking_status!='Incompleto'), 'bg-orange-400': (modulo.tracking_status=='Iniziato'), 'bg-green-400': (modulo.tracking_status=='Completato'), 'bg-red-400':(modulo.tracking_status=='Incompleto')}">
                              <i class="fa fa-mortar-board"></i>
                            </div>
                          </div>
                          <div class="media-body">
                            <span @click="scrollTop()" class="link-text-color">{{modulo.nome}}</span>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <!-- // END .panel -->
            </div>
            <!-- // END .page-section -->
          </div>
          <div class="media-body">
            <div class="page-section">
              <div class="media" :class="{'center-align': $root.xs}">
                <div :class="{'media-left': !$root.xs}">
                  <div class="width-60 height-60 thumbnail" :class="{'i-b': $root.xs}">
                    <div class="bg-img" style="height: 100%; width: 100%;" :style="'background-image:url(' + img + ')'"></div>
                    <!-- <img id="thumb-c" class="width-50 height-50"></div> -->
                  </div>
                </div>
                <div class="media-body">
                  <h2 class="margin-none">{{ titolo }}</h2>
                  <br>
                  <h4 class="margin-none">{{ titoloCorso }}</h4>
                </div>
              </div>
              <hr style="margin: 10px 0px">
              <div>
                <p v-if="mailtutor"><strong v-if="intestazione">{{intestazione}}</strong><strong v-else>Per contattare il supporto tecnico: </strong><span style="color: #3b75c3">  {{mailtutor}}</span></p>
              </div>
            </div>
            <div class="page-section">
              <div id="full_wrapper" :class="{'full': fullscreen}" :style="[fullscreen ? full_style : init_style]">
                <div class="panel panel-default paper-shadow" style="box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4); height: 100%;">
                  <div class="embed-responsive embed-responsive-4by3" style="position: initial;">
                    <!--  <div> -->
                    <iframe v-show="gotSCORM" @load="onFrameLoad()" allowfullscreen id="myframe" :src="SCORMPath"></iframe>
                    <!-- @click="fullscreen = !fullscreen" -->
                    <button id="btnFull" class="btn btn-sm btn-primary" @touchstart="fullscreen = !fullscreen" @mousedown="fullscreen = !fullscreen" :class="{'isFull': fullscreen}"><i class="fa fa-arrows-alt" aria-hidden="true"></i></button>
                  </div>
                </div>
              </div>
              <hr style="margin: 10px;">
              <div class="panel panel-default paper-shadow bg">
                <ul class="nav nav-pills">
                  <li class="active"><a id="default" data-toggle="pill" href="#descrizione">DESCRIZIONE</a></li>
                  <li @click="pillDisc()">
                    <a data-toggle="pill" href="#discussione">DISCUSSIONE</a></li>
                  <li><a data-toggle="pill" href="#moduli">MODULI</a></li>
                  <li><a data-toggle="pill" href="#edizione">EDIZIONE</a></li>
                </ul>
                <div class="tab-content">
                  <div id="descrizione" class="tab-pane fade in active">
                    <h3>Descrizione</h3>
                    <p v-if="durata"><strong>Minuti:</strong> {{durata}}</p>
                    <p v-if="durataMinima"><strong>Durata Minima:</strong> {{durataMinima}}</p>
                    <p v-if="obiettivi"><strong>Obiettivi:</strong><span v-html="obiettivi"></span></p>
                    <p v-if="contenuti"><strong>Contenuti:</strong><span v-html="contenuti"></span></p>
                    <p v-if="target"><strong>Target:</strong><span v-html="target"></span></p>
                    <p v-if="prerequisiti"><strong>Prerequisiti:</strong><span v-html="prerequisiti"></span></p>
                  </div>
                  <div class="tab-pane fade" id="edizione">
                    <span v-if="nomeedizione"><h3>Edizione: {{nomeedizione}}</h3></span>
                    <p v-if="stato"><strong>Stato:</strong> {{stato}}</p>
                    <p v-if="datainizio"><strong>Data Inizio:</strong> {{datainizio}}</p>
                    <p v-if="stato"><strong>Data Fine:</strong> {{datafine}}</p>
                  </div>
                  <div id="discussione" class="tab-pane fade">
                    <div class="well">
                      <div v-if="isEmpty || isEmpty==null" style="padding: 10px;">
                        <p>Non esiste una discussione per questo modulo</p>
                        <p>Commenta per iniziare una discussione</p>
                      </div>
                      <div v-else id="chat">
                        <div v-for="(commento, index) in tutticommenti" :id="index+1" :class="{ 'forum-thread-reply': commento.isMine }" class="media s-container loadin adj-margin" style="margin-bottom: 0px;">
                          <div :class="{ 'pull-right': commento.isMine, 'media-left': !commento.isMine }">
                            <div class="width-70 text-center">
                              <p>
                                <a href="" @click.prevent="">
                                    <img class="img-circle width-40" :src="commento.avatar" alt="../images/profile-photo_small.png" />
                                </a>
                              </p>
                              <p class="text-caption text-light">{{commento.nome}}</p>
                            </div>
                          </div>
                          <div class="media-body responsive-w">
                            <div class="panel panel-default" :class="{'pull-text-r': commento.isMine}">
                              <div class="panel-body">
                                <div class="text-subhead-2">{{commento.autore}}<span class="text-caption text-light hidden-xs"> - {{commento.data}}</span></div>
                                <p>{{commento.comm}}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="page-section padding-top-none" style="padding-bottom: 0px">
                        <div class="panel panel-default paper-shadow reply-body" data-z="0.5">
                          <div class="panel-body">
                            <form>
                              <div class="form-group">
                                <textarea rows="4" cols="50" id="reply" class="form-control" placeholder="Il tuo commento .." v-model="reply"></textarea>
                              </div>
                              <div class="text-right">
                                <button class="btn btn-primary" type="button" @click.prevent="postReply()"> Invio </button>
                              </div>
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div id="moduli" class="tab-pane fade">
                    <module-list :modules_array="moduli" :flag="flag" :edizione="edizione" :active="idmodulo"></module-list>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
    <!-- /st-content-inner -->
  </div>
  <div v-show="!display_e" class='uil-rolling-css' :style="{transform:'scale(0.71)',
        position: 'absolute', margin: '0 auto', top: '100px', right: '0px', left: '0px'}">
    <div>
      <div></div>
      <div></div>
    </div>
  </div>
  <!-- /st-content -->
  <sidejsonly :default="false"></sidejsonly>
</div>
</template>
<script>
import sidejsonly from '../components/side-default-jsonly.vue'
import moduleList from './interactive-module-list.vue'

import {
  eventBus
} from '../../eventbus.js';

var fs = false;
var vueReference = null;

$(document).ready(function() {

  document.addEventListener('notYet', function(e) {
    if (vueReference != null) {
      var mod = null;
      try {
        mod = vueReference.$route.params.idmodulo;
      } catch (err) {}
      if (mod != null) {
        var el = document.getElementById(mod);

        var message;
        if (e.detail.custom_mess != null) {
          message = e.detail.custom_mess;
        } else {
          message = "Il modulo non può essere considerato completato perchè hai impiegato un tempo insufficiente";
        }
        el.setAttribute("data-content", "<div><h4>" + message + "</h4></div>");
        el.setAttribute("data-html", "true");
        el.setAttribute("data-placement", "left");
        el.setAttribute("data-toggle", "popover");
        $(el).hover(function() {
          try {
            $("#" + mod).popover('show');
          } catch (err) {}
        });
        $(el).mouseleave(function() {
          try {
            $("#" + mod).popover('hide');
          } catch (err) {}
        });
        try {
          $("#" + mod).popover('show');
        } catch (err) {}

        if (!fs) {
          setTimeout(function() {
            try {
              $("#" + mod).popover('hide');
            } catch (err) {}
          }, 3500);
        }
      }
    }
  }, false);

});

export default {
  mounted: function() {
    vueReference = this;
  },
  created: function() {
    this.firstLoad = true;
    this.eachLoad();

    var vm = this;
    eventBus.$on('reloadModuleDiscussion', function(id) {
      if (id == vm.iddiscussione) {
        vm.showDiscussion();
      }
    })
  },
  beforeDestroy() {
    try {
      document.getElementById("myframe").src = "";
    } catch (err) {}
    this.fullscreen = false;
    this.fsChange(true)
  },
  components: {
    sidejsonly,
    moduleList
  },
  watch: {
    'fullscreen': function() {
      this.fsChange()
    },
    '$route': function() {
      try {
        document.getElementById("myframe").src = "";
      } catch (err) {}

      this.eachLoad();
    }
  },
  data: function() {
    return {

      idpersona: 0,
      idmodulo: 0,
      idcorso: 0,
      titoloCorso: '',
      titolo: '',
      descrizione: '',
      durata: 0,
      durataMinima: 0,
      target: '',
      obiettivi: '',
      prerequisiti: '',
      contenuti: '',

      nomeedizione: '',
      datainizio: '',
      datafine: '',
      mailtutor: '',
      intestazione: '',
      stato: '',

      moduli: [],
      fullscreen: false,

      imgIcon: '',

      openfather: '',
      flagfather: false,
      indexfather: 0,

      // campi per discussione
      iddiscussione: '',
      loadedDiscussion: false,
      tutticommenti: [],
      reply: '',
      labelout: false,
      isEmpty: true,

      //SCORM
      API: '',
      gotSCORM: false,
      SCORMPath: null,
      allowed: false,

      json: {},
      edizione: 0,

      linkScorm: '',
      userImg: "../images/profile-photo_small.png",
      stillTracking: true,
      firstload: false,

      img: null,

      display_e: false,
      start_f: false,

      static_path: 'static/html/placeholders',

      full_style: {
        'width': '0%',
        'height': '0%'
      },
      init_style: {
        'width': '100%',
        'height': '100%'
      },

      flag: false
    }
  },
  methods: {
    eachLoad() {
      fs = false;
      this.allowed = false;
      this.tutticommenti = [];
      if (this.edizione == 0) {
        // first load, refresh, back
      } else if (this.edizione != this.$route.params.idedizione) {
        // manually change on URL
        this.redirect();
      }

      this.getDettagliModulo();

      $("#default").tab('show');
    },
    tryRep: function(mod, ed) {
      if (mod != this.idmodulo) {
        localStorage.setItem("leaving", this.idmodulo);
        document.getElementById("myframe").src = "";
        this.$router.push({
          name: 'modulo',
          params: {
            idmodulo: mod,
            idedizione: ed
          }
        })
        this.scrollTop();
      }
    },
    assignScorm: function(module) {

      this.SCORMPath = '../../SCORM-modules/' + module;

      this.gotSCORM = true;

      //attachFrameListener();

      //setTimeout(this.initScorm,500);
    },
    onFrameLoad: function() {
      console.log("frame-Loaded")
      if (this.SCORMPath != null) {
        console.log(this.display_e)
        var vm = this;
        setTimeout(function() {
          vm.display_e = true;
          vm.fullscreen = vm.start_f;
        }, 500)
      }
    },
    loadScorm: function() {
      var url;
      if (this.json.TipoModulo === "Attestato") {
        //url = 'http://10.6.240.20:8082';
        url = JSON.parse(this.$root.lsGet("configs")).urlBase64ToPdf;
      } else {
        url = localStorage.getItem('path') + '/Webapi';
      }

      this.$http.post(url, this.json, {
        headers: {
          'X-HTTP-Method-Override': "ApriModuli",
          'Content-Type': 'application/json'
        }
      }).then((response) => {
        if (response.status == 200) {
          var body = response.body;
          try {
            body = JSON.parse(response.body);
          } catch (err) {};

          if (body.Response.Messaggio != "") {
            eventBus.$emit("alert", body.Response.Messaggio);
          }

          if (body.Response.IdTracking != 0) {
            if (this.linkScorm == null && this.json.TipoModulo != "Attestato") {
              eventBus.$emit("alert", "Errore nell'apertura del modulo");
              this.$router.replace({
                name: 'list'
              })
            } else {

              switch (this.json.TipoModulo) {
                case 'Attestato':

                  this.SCORMPath = this.static_path + '/place-pdf.html';
                  this.gotSCORM = true;
                  window.open("./pdf/" + body.Response.Attestato + ".pdf");
                  this.display_e = true;
                  break;
                case 'Link':
                  this.SCORMPath = this.static_path + "/place-link.html";
                  console.log(this.SCORMPath)
                  this.gotSCORM = true;
                  //attachFrameListener();
                  window.open(this.linkScorm);
                  this.display_e = true;
                  break;
                case 'Documento':
                  var link = this.linkScorm.split('.');
                  if (link.length > 1 && link[link.length - 1] === 'mp4') {

                    this.SCORMPath = '../../SCORM-modules/' + this.linkScorm;
                    this.gotSCORM = true;
                    //attachFrameListener();
                  } else {

                    this.SCORMPath = this.static_path + '/place-zip.html';
                    this.gotSCORM = true;
                    //attachFrameListener();
                    window.open('../../SCORM-modules/' + this.linkScorm);
                  }
                  this.display_e = true;
                  break;
                case 'E-learning':
                case 'Valutazione':
                case 'Test':

                  localStorage.setItem("IdTracking", body.Response.IdTracking);
                  this.linkScorm = this.linkScorm.replace("'\'", "/");
                  var path = this.linkScorm.split('/');
                  path.splice(-1, 1, 'imsmanifest.xml');
                  //path.splice(-2,2, 'imsmanifest.xml');
                  var manifestPath = path[0];
                  for (var i = 1; i < path.length; i++) {
                    manifestPath += '/' + path[i];
                  }
                  localStorage.setItem("ManifestPath", manifestPath);
                  localStorage.setItem("IdPartecipazione", this.json.IdPartecipazione);

                  this.assignScorm(this.linkScorm);
                  break;
              }
            }
          } else {
            this.$router.replace({
              name: 'corsoWithEd',
              params: {
                idcorso: this.idcorso,
                idedizione: this.edizione
              }
            })
          }
        }
      }, function(response) {

        if (response.status == 401) {
          eventBus.$emit("alert", "Sessione scaduta");
        } else {

          alert("SOMETHING WENT WRONG: \nresponse status - " + response.status + " " + response.statusText + "\n" + response.body);

          this.$router.replace({
            name: 'corsoWithEd',
            params: {
              idcorso: this.idcorso,
              idedizione: this.edizione
            }
          })
        }
      });
    },
    /*
    convertDataURIToBinary: function(dataURI) {
        var BASE64_MARKER = ';base64,';

        var base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
        var base64 = dataURI.substring(base64Index);
        var raw = window.atob(base64);
        var rawLength = raw.length;
        var array = new Uint8Array(new ArrayBuffer(rawLength));

        for (var i = 0; i < rawLength; i++) {
            array[i] = raw.charCodeAt(i);
        }
        return array;
    }, */
    initScorm: function() {

      if (this.allowed) {
        var x = document.getElementById("myframe");
        var y = (x.contentWindow || x.contentDocument);
        this.API = y.window;
        //bugs sometimes
        if (this.API.globals != null) {
          this.API.globals.strBrowserSize = "fullscreen";
          this.API.globals.strScale = "show all";
          this.API.globals.bScrollbars = false;
          this.API.player.initGlobals();
        }
      }
    },
    getDettagliModulo: function() {
      this.idmodulo = this.$route.params.idmodulo;
      this.isEmpty = true;
      this.iddiscussione = '';
      this.loadedDiscussion = false;
      this.reply = '';

      this.$http.get(localStorage.getItem('path') + '/APIModuli/?IDModulo=' + this.idmodulo).then((response) => {
        var m = response.body;
        try {
          m = JSON.parse(response.body);
        } catch (err) {};

        if (!m || !m.APIModuli) {
          if (this.edizione == 0) {
            history.back();
          } else {
            this.$router.replace({
              name: 'list'
            })
            eventBus.$emit('alert', "Modulo inesistente");
          }
          return;
        }

        this.edizione = this.$route.params.idedizione;

        var tutti_moduli = m.APIModuli;

        //controlla percorso
        //se identificando corso risponde vuoto
        var pCollection = this.$store.getters.getPartecipazioni;
        var parts = pCollection.find({
          "IDPartecipante": Number(localStorage.getItem("idpersona")),
          "IdEdizione": Number(this.edizione)
        })
        // -- CHECK PARTECIPAZIONE --
        if (parts && parts.length > 0) {
          this.allowed = true;
          //flag per aggiornare miei-corsi
          localStorage.setItem("courseFlag", 1);
          var part = parts[0];
          this.idcorso = part.IDCorso;
          localStorage.setItem("currentlyOnCourse", this.idcorso);
          var dettagliModulo;

          // -- FETCHING TITOLO CORSO --
          var corsiCollection = this.$store.getters.getCorsi;
          var results = corsiCollection.find({
            "ID": Number(this.idcorso)
          });
          if (results && results.length > 0) {
            this.titoloCorso = results[0].Titolo;
          }

          //se un modulo è condiviso da più corsi, seleziono quello adatto
          for (var k = 0; k < tutti_moduli.length; k++) {
            if (tutti_moduli[k].IdCorso == this.idcorso) {
              dettagliModulo = tutti_moduli[k];
              break;
            }
          }

          //proseguo se il modulo esiste e non è un contentiore
          if (dettagliModulo == null || dettagliModulo.TipoModulo == 'Raccoglitore') {
            this.$router.replace({
              name: 'list'
            })
            eventBus.$emit('alert', "Modulo inesistente");
            return;
          }

          //  MAURIZIO?
          if (dettagliModulo.NuovoCampo == -1 || dettagliModulo.ApriASchermoIntero == -1) {
            this.start_f = true;
            this.display_e = false;
          }

          //Fetching Dati di contorno
          this.titolo = dettagliModulo.Modulo
          this.durata = parseInt(dettagliModulo.Minuti)
          this.durataMinima = parseInt(dettagliModulo.MinutiMinimi)
          this.obiettivi = dettagliModulo.Obiettivi
          this.contenuti = dettagliModulo.Contenuti
          this.target = dettagliModulo.Target
          this.prerequisiti = dettagliModulo.Prerequisiti

          //Inizializzo il json utilizzato nell'ApriModuli
          this.json.IdPartecipazione = part.IDPartecipazione;
          this.json.IdPartecipante = part.IDPartecipante;
          this.json.IdCorso = this.idcorso;
          this.json.IdEdizione = this.edizione;
          this.json.IdModulo = this.idmodulo;
          this.json.TipoFattibilita = dettagliModulo.TipoFattibilita;
          this.json.FlagDocente = 0;
          this.json.TipoModulo = dettagliModulo.TipoModulo;

          this.linkScorm = dettagliModulo.Link;
          //caricamento modulo SCORM
          this.loadScorm();

          /*i dati in merito al resto dei moduli del corso, del tracciamento e delle discussioni,
          vengono reperiti indipendentemente (e quindi in parallelo) dal caricamento del modulo SCORM */
          this.$http.get(localStorage.getItem('path') + '/APICorsi/?ID=' + this.idcorso).then((response) => {
            var res = response.body;
            try {
              res = JSON.parse(response.body);
            } catch (err) {};

            if (res && res.APICorsi) {
              if (res.APICorsi[0].Immagine != null) {
                this.img = res.APICorsi[0].Immagine;
              } else {
                this.img = "images/course-placeholder.png";
              }
            }
          }, (err) => {
            this.img = "images/course-placeholder.png";
          });

          var mod = this.$root.getModule(this.idcorso);
          //refresha ogni ora
          if (mod) {
            this.moduli = mod.data;
            for (let i = 0; i < this.moduli.length; i++) {
              this.moduli[i].toshow = false;
              for (let j = 0; j < this.moduli[i].children.length; j++) {

                if (this.moduli[i].children[j].id == this.idmodulo) {
                  this.indexfather = i;
                  this.moduli[i].toshow = true;
                }
              }
            }

            //first load è true on created
            if (this.firstLoad) {
              this.firstLoad = false;
              //all'inizio controllo (e aggiorno) l'intero tracking della partecipazione
              this.controlTracking();
            } else {
              //altrimenti significa che ho navigato all'interno della pagina, e controllo solo l'ultimo
              this.stillTracking = false;
              var prev = localStorage.getItem("prevVisited")
              if (prev != null) {
                prev = prev.split('/');
                if (prev[1] === 'app-take-module' &&
                  prev[3] == this.edizione) {
                  this.updateLastTracking(prev[2]);
                }
              }
            }
            this.checkForModulesRelatedDiscussions();
          } else {

            this.$http.get(localStorage.getItem('path') + '/APIModuli/?IdCorso=' + dettagliModulo.IdCorso).then((response) => {

              var moduliCorso = response.body;
              try {
                moduliCorso = JSON.parse(response.body);
              } catch (err) {};

              if (moduliCorso != null && moduliCorso.APIModuli != null) {

                moduliCorso = moduliCorso.APIModuli;

                let moduliCorsoOrdered = moduliCorso.sort(function(a, b) {
                  return a.Sequenza - b.Sequenza
                })

                var padre = moduliCorsoOrdered[0].Modulo
                var figli = []
                this.moduli = []

                for (let i = 0; i < moduliCorsoOrdered.length; i++) {

                  let nodo = moduliCorsoOrdered[i]

                  if (nodo.TipoModulo == "Raccoglitore") {
                    if (figli.length > 0) {
                      this.moduli.push({
                        nome: padre,
                        toshow: false,
                        children: figli,
                        //aggiungo alpha altrimenti collide con gli di nelle discussioni
                        target: '#' + this.moduli.length + 'alpha',
                        ref: i
                      })
                      if (this.flagfather) {
                        this.openfather = padre;
                        this.flagfather = false;
                      }
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
                      tracking_status: 'Non Iniziato'
                    }
                    figli.push(obj);

                    if (nodo.IDModulo == this.idmodulo) {
                      this.flagfather = true;
                    }
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

                this.checkForModulesRelatedDiscussions();
                this.controlTracking();

                for (let i = 0; i < this.moduli.length; i++) {
                  if (this.moduli[i].nome == this.openfather) {
                    this.indexfather = i;
                    this.moduli[i].toshow = true;
                  }
                }

              } else {
                alert("errore nel caricamento dei corsi");
              }
            });
          }

          if (this.nomeedizione == '') {
            this.$http.get(localStorage.getItem('path') + '/APIEdizioni?IdEdizione=' + this.edizione).then((response) => {
              var ed = response.body;
              try {
                ed = JSON.parse(response.body);
              } catch (err) {};

              if (ed != null && ed.APIEdizioni != null) {
                ed = ed.APIEdizioni[0];
                this.nomeedizione = ed.Edizione;
                this.datainizio = ed.DataInizio;
                this.datafine = ed.DataFine;
                this.mailtutor = ed.MailTutor;
                this.intestazione = ed.IntestazioneMailTutor;
                this.stato = ed.Stato;
              }
            });
          }

        } else {

          eventBus.$emit('alert', "Edizione non trovata o non accessibile");
          this.$router.replace({
            name: 'list'
          })
        }
      });
    },
    checkForModulesRelatedDiscussions: function() {
      var allChildren = [];
      for (var i = 0; i < this.moduli.length; i++) {
        allChildren = allChildren.concat(this.moduli[i].children);
      }

      this.$http.get(localStorage.getItem('path') + '/APIDiscussioni?IdOggetto=' + this.edizione + '&IdOggettoSecondario=.').then((response) => {
        let mess = response.body;
        try {
          mess = JSON.parse(response.body);
        } catch (err) {};
        if (mess && mess.APIDiscussioni) {
          mess = mess.APIDiscussioni;
          var promises = []
          for (let i = 0; i < mess.length; i++) {
            promises.push(this.$http.get(localStorage.getItem('path') + '/APICommentiDiscussione?IDDiscussione=' + mess[i].ID).then((response) => {
              let comm = response.body;
              try {
                comm = JSON.parse(response.body);
              } catch (err) {};

              comm = comm.APICommentiDiscussione;
              if (comm) {
                for (var ii = 0; ii < allChildren.length; ii++) {
                  if (allChildren[ii].id == mess[i].IdOggettoSecondario) {
                    allChildren[ii].commenti = comm.length;
                    allChildren[ii].iddisc = mess[i].ID;
                    break;
                  }
                }
              }
            }));
            //scollegato dalla promise, controllo se esiste una discussione relativa al modulo corrente
            if (mess[i].IdOggettoSecondario == this.idmodulo) {
              this.iddiscussione = mess[i].ID;
              this.isEmpty = false;
              if (this.loadedDiscussion) {
                this.showDiscussion();
              }
            }

          }
          var vm = this;
          Promise.all(promises).then(function() {
            vm.$root.saveModules(vm.idcorso, vm.moduli);
          });
        }
      });
    },
    updateLastTracking: function(modId) {
      var mod = 0;
      var child = -1;
      for (var i = 0; i < this.moduli.length; i++) {
        var sons = this.moduli[i].children;
        for (var j = 0; j < sons.length; j++) {
          if (sons[j].id == modId) {
            child = j;
            break;
          }
        }
        if (child != -1) {
          mod = i;
          break;
        }
      }

      //controlla il tracking solo per un modulo (l'ultimo visitato)
      this.$http.get(localStorage.getItem('path') + '/APITracking?IDModulo=' + modId + '&IDEdizione=' + this.edizione + '&IDPersona=' +
        localStorage.getItem("idpersona") + "&MassimoAvanzamento=-1").then((response) => {
        var tracking = response.body;
        try {
          tracking = JSON.parse(response.body);
        } catch (err) {};

        if (tracking != null && tracking.APITracking != null) {
          tracking = tracking.APITracking[0];

          if (tracking.Stato != "Iniziato" || this.moduli[mod].children[child].tracking_status != "Incompleto") {

            this.moduli[mod].children[child].tracking_status = tracking.Stato;
            this.saveModAndTracking();
          }

        } else {
          this.$http.get(localStorage.getItem('path') + '/APITracking?IDModulo=' + sons[j].id + '&IDEdizione=' + this.edizione + '&IDPersona=' + localStorage.getItem("idpersona")).then((response) => {
            var tracking = response.body;
            try {
              tracking = JSON.parse(response.body);
            } catch (err) {};

            if (tracking != null && tracking.APITracking != null) {

              this.dispatch("alert", "massimo avanzamento non trovato");
              tracking = tracking.APITracking[0];

              if (tracking.Stato != "Iniziato" || this.moduli[mod].children[child].tracking_status != "Incompleto") {


                this.moduli[mod].children[child].tracking_status = tracking.Stato;
                this.saveModAndTracking();
              }

            }
          });
        }
      });
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
    saveModAndTracking() {
      this.stillTracking = false;
      this.flag = !this.flag;
      this.$root.saveModules(this.idcorso, this.moduli);
    },
    scrollTop: function() {
      $(".st-content-inner").scrollTop(0);
    },
    //      METODI PER DISCUSSIONE      //
    pillDisc: function() {
      if (!this.loadedDiscussion) {
        this.loadedDiscussion = true;
        if (this.iddiscussione != '') {
          this.showDiscussion();
          eventBus.$emit('saw', this.iddiscussione);
        }
      } else {
        if (!this.isEmpty) {
          eventBus.$emit('saw', this.iddiscussione)
          this.scrolldown();
        }
      }
    },
    filterOut: function() {
      if (this.reply != '') {
        this.labelout = true;
      } else {
        this.labelout = false;
      }
    },
    showDiscussion: function() {

      if (localStorage.getItem("userAvatar") != null) {
        this.userImg = localStorage.getItem("userAvatar");
      }
      this.$http.get(localStorage.getItem('path') + '/APICommentiDiscussione?IDDiscussione=' + this.iddiscussione).then((response) => {
        let comm = response.body;
        try {
          comm = JSON.parse(response.body);
        } catch (err) {};
        this.tutticommenti = [];

        if (comm.APICommentiDiscussione && comm.APICommentiDiscussione.length > 0) {

          let now = new Date(Date.now());

          for (let i = 0; i < comm.APICommentiDiscussione.length; i++) {
            let commento = comm.APICommentiDiscussione[i];
            
            // FORMAT CHANGE
            // new Date(commento.DataInserimento.replace(/-/g, '/'));
            let fullDate = new Date(commento.DataInserimento.replace(/\./g, ':'));

            //elabora cosa mostrare a lato del commento
            let displayDate;
            displayDate = parseDate(now, fullDate);

            if (commento.IDAutore == localStorage.getItem("idpersona")) {
              this.tutticommenti.push({
                autore: "Tu",
                nome: localStorage.getItem("nomecognome"),
                avatar: this.userImg,
                data: displayDate,
                isMine: true,
                titolo: commento.Titolo,
                comm: commento.Commento,
                id: commento.ID,

                orderdate: fullDate
              });

              if (this.tutticommenti.length == comm.APICommentiDiscussione.length) {

                this.tutticommenti.sort(function(a, b) {
                  return a.orderdate - b.orderdate;
                })

                this.scrolldown();
                this.loadAvatars()
              }
            } else {

              this.$http.get(localStorage.getItem('path') + '/APIUtenti?IDPersona=' + commento.IDAutore, {
                headers: {
                  light: "1"
                }

              }).then((response) => {
                let author = response.body;
                try {
                  author = JSON.parse(response.body);
                } catch (err) {};

                author = author.APIUtenti[0];

                this.tutticommenti.push({
                  autore: author.Persona,
                  nome: author.NomePersona,
                  avatar: "../images/profile-photo_small.png",
                  data: displayDate,
                  isMine: false,
                  titolo: commento.Titolo,
                  comm: commento.Commento,
                  id: commento.ID,

                  orderdate: fullDate
                });

                if (this.tutticommenti.length == comm.APICommentiDiscussione.length) {

                  this.tutticommenti.sort(function(a, b) {
                    return a.orderdate - b.orderdate;
                  })

                  this.scrolldown();
                  this.loadAvatars()
                }
              });
            }
          }
        }
      });
    },
    loadAvatars: function() {
      for (var i = 0; i < this.tutticommenti.length; i++) {
        if (!this.tutticommenti[i].isMine) {
          this.$http.get(localStorage.getItem('path') + '/APIUtenti?IDPersona=' + this.tutticommenti[i].autore).then((response) => {
            var res = response.body;
            try {
              res = JSON.parse(response.body);
            } catch (err) {};

            if (res && res.APIUtenti && res.APIUtenti[0].FOTO) {
              this.tutticommenti[i].avatar = res.APIUtenti[0].FOTO;
            }
          })
        }
      }
    },
    postReply: function() {
      if (this.reply.trim() != "") {
        if (!this.isEmpty) {
          let idautore = localStorage.getItem("idpersona");
          let iddisc = this.iddiscussione;
          let commento = this.reply;

          var json = {
            "IdDiscussione": iddisc,
            "IdPersona": idautore,
            "Testo": commento
          }
          this.reply = '';
          this.filterOut();

          this.$http.post(localStorage.getItem('path') + '/APICommentiDiscussione', json, {
            headers: {
              'X-HTTP-Method-Override': "InserisciCommento",
              'Content-Type': 'application/json'
            }
          }).then((response) => {

            if (response.status == 204) {

              let obj = {
                autore: 'Tu',
                nome: localStorage.getItem("nomecognome"),
                avatar: this.userImg,
                data: 'adesso',
                isMine: true,
                titolo: 'Locale',
                comm: commento
              }

              this.tutticommenti.push(obj);
              console.log(this.tutticommenti)
              this.scrolldown();
            }
          });
        } else {
          this.aggiungiDiscussione();
        }
      }
    },
    aggiungiDiscussione: function() {

      var title = '';
      var json = {};

      if (this.idcorso == 0) {
        return
      }

      this.$http.get(localStorage.getItem('path') + '/APICorsi?ID=' + this.idcorso, {
        headers: {
          light: "1"
        }
      }).then((response) => {
        var corso = response.body;
        try {
          corso = JSON.parse(response.body);
        } catch (err) {};

        if (corso && corso.APICorsi) {
          title = corso.APICorsi[0].Titolo;

          json = {
            "TipoOggetto": "Edizione",
            "IdOggetto": "" + this.edizione,
            "Titolo": title + ' - ' + this.titolo,
            "TipoOggettoSecondario": 'Modulo',
            "IdOggettoSecondario": this.idmodulo,
            "TipoDiscussione": "Discussione",
            "StringaIdCollaboratori": ""
          }

          this.$http.post(localStorage.getItem('path') + '/APIDiscussioni',
            json, {
              headers: {
                'X-HTTP-Method-Override': 'InserisciDiscussione',
                'Content-Type': 'application/json'
              }
            },
            function(data) {}).then((response) => {

            this.isEmpty = false;
            var res = response.body;
            try {
              res = JSON.parse(response.body);
            } catch (err) {};

            this.iddiscussione = res.Response.Result;
            if (this.iddiscussione != null) {
              if (localStorage.getItem("userAvatar") != null) {
                this.userImg = localStorage.getItem("userAvatar");
              }
              this.postReply();
            } else {
              eventBus.$emit('alert', "Errore nella creazione della discussione");
            }

          });

        } else {
          eventBus.$emit('alert', "Errore nella creazione della discussione");
        }
      });
    },
    scrolldown: function() {
      $('#chat').animate({
        scrollTop: 9999
      });
    },
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
    redirect: function() {
      eventBus.$emit('alert', "Edizione non trovata o non accessibile");
      this.$router.replace({
        name: 'list'
      })
    },
    fsChange: function(beforeDestroing) {
      if (this.fullscreen) {
        fs = true;
        setTimeout(function() {
            document.getElementById("full_wrapper").style['-webkit-transition'] = 'all 0.3s';
            document.getElementById("full_wrapper").style['transition'] = 'all 0.3s';
            document.getElementById("full_wrapper").style.width = '100%';
            document.getElementById("full_wrapper").style.height = '100%';

            var isIE = /*@cc_on!@*/ false || !!document.documentMode;
            if (isIE) {
              document.getElementById("myframe").style.height = (window.innerHeight + "px");
            }
          },
          100);
      } else {
        fs = false;
        if (beforeDestroing != true) {
          document.getElementById("full_wrapper").style['-webkit-transition'] = 'unset';
          document.getElementById("full_wrapper").style['transition'] = 'unset';
        }
      }
      /*
            if (this.fullscreen) {
              var onBack = document.getElementsByClassName("bg");
              for (var i = 0; i < onBack.length; i++) {
                onBack[i].setAttribute("style", "position: relative; z-index: -1 !important;");
              }
            } else {
              var onBack = document.getElementsByClassName("bg");
              for (var i = 0; i < onBack.length; i++) {
                onBack[i].setAttribute("style", "");
              }
            }
            */
    }
  }
}
</script>
<style>
.adjust-margin {
  margin-bottom: 5px !important;
}

.point {
  padding: 12px;
  cursor: pointer;
}

.nopoint {
  cursor: auto !important;
}

.activee {
  background-color: dimgrey !important;
}

.activee span {
  color: white !important;
}

.ul-son>li:hover {
  cursor: pointer;
  background-color: dimgrey !important;
}

.ul-son>li:hover span {
  color: white !important;
}

span.pad-badge {
  margin-right: 10px;
}

span.pad-badge:hover {
  padding-left: 10px;
  padding-right: 10px;
}

button#btnFull {
  position: absolute;
  right: 2px;
  top: 2px;
  padding: 4px 6px !important;
}

button#btnFull.isFull {
  z-index: 999999;
  position: fixed;
  top: 5px;
}

body {
  position: relative;
  z-index: -1;
}

iframe {
  overflow: hidden !important;
}

#full_wrapper.full {
  position: fixed;
  overflow: hidden;
  left: 0px;
  right: 0px;
  bottom: 0px;
  z-index: 999000;
  height: 100%;
  width: 100%;
}

.popover.fade.left.in {
  z-index: 999999;
}

i.fa-grey {
  color: gainsboro;
}

i.fa-orange {
  color: orange;
}

i.fa-green {
  color: #66bb6a;
}

i.fa-red {
  color: red;
}

.pull-text-r {
  text-align: right;
}

@media (min-width: 1200px) {
  div.adj-margin {
    padding-right: 180px;
  }
  div.adj-margin.forum-thread-reply {
    padding-right: 20px;
    padding-left: 180px;
  }
}

@media (min-width: 1500px) {
  div.adj-margin {
    padding-right: 280px;
  }
  div.adj-margin.forum-thread-reply {
    padding-right: 20px;
    padding-left: 280px;
  }
}
</style>
