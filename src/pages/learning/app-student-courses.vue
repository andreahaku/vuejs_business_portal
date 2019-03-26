<template>
<div class="st-pusher" id="content">
  <!-- sidebar effects INSIDE of st-pusher: -->
  <!-- st-effect-3, st-effect-6, st-effect-7, st-effect-8, st-effect-14 -->
  <!-- this is the wrapper for the content -->
  <div class="st-content">
    <!-- extra div for emulating position:fixed of the menu -->
    <div class="st-content-inner padding-none">
      <div class="container-fluid">
        <div class="page-section">
          <div class="media v-middle">
            <div class="media-body">
              <div class="media-left col-xs-12 col-md-5">
                <h1 class="text-display-1 margin-none">I Miei Corsi
                <span class="badge" style="margin: 10px 0px;">{{quantisono}}</span></h1>
              </div>
              <div class="media-right col-xs-12 col-md-7 tools">
                <div class="panel panel-default">
                  <div class="panel-body">
                    <div class="form-group form-control-material">
                      <input id="filtracorso" type="text" class="form-control" placeholder="parola nel titolo" v-model="filtro" @blur="filterOut()" />
                      <label v-show="!labelout" for="filtracorso">Filtra ...</label>
                    </div>
                  </div>
                  <div class="panel panel-primary">
                    <div class="panel-body row" style="margin: 0px; padding: 10px 5px;">
                      <div class="col-xs-10 col-sm-8" style="text-align: left; padding: 0px 0px 0px 10px;">
                        <div v-on:click="pillComplete()" class="tool" style="padding-right: 5px;">
                          <input id="finished" type="checkbox" data-toggle="toggle" data-on="COMPLETATI" data-off="COMPLETATI" data-onstyle="success">
                        </div>
                        <div v-on:click="pillIncomplete()" class="tool">
                          <input id="begin" type="checkbox" data-toggle="toggle" data-on="IN CORSO" data-off="IN CORSO" data-onstyle="success">
                        </div>
                      </div>
                      <div class="col-xs-2 col-sm-4" style="text-align: right; padding: 0px 10px 0px 0px;">
                        <router-link class="btn btn-white btn-sm paper-shadow tool" tag="button" data-z="0.5" data-hover-z="1" data-animated to="/app-directory-grid" style="padding: 8px">
                          <span class="hidden-xs" style="padding-right: 5px">Tutti I Corsi</span>
                          <i class="fa fa-list"></i>
                        </router-link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!--
              <div class="media-right hidden-sm hidden-md hidden-lg">
                <router-link class="btn btn-white paper-shadow relative" data-z="0.5" data-hover-z="1" data-animated to="/app-directory-grid">Tutti I Corsi</router-link>
              </div>
              <hr>
              <div>
                <div class="media-right" style="padding-left: 0px;">
                  <div v-on:click="pillComplete()">
                    <input id="finished" type="checkbox" data-toggle="toggle" data-on="COMPLETATI" data-off="COMPLETATI" data-onstyle="success">
                  </div>
                </div>
                <div class="media-right">
                  <div v-on:click="pillIncomplete()">
                    <input id="begin" type="checkbox" data-toggle="toggle" data-on="IN CORSO" data-off="IN CORSO" data-onstyle="success">
                  </div>
                </div>
                <div class="media-right hidden-xs">
                  <router-link class="btn btn-white paper-shadow relative" data-z="0.5" data-hover-z="1" data-animated to="/app-directory-grid">Tutti I Corsi</router-link>
                </div>
              </div>
            -->
            </div>
          </div>
        </div>
        <div class="row">
          <div v-for="corso in displaycorsi" class="item col-xs-12 col-sm-6 col-md-4 col-lg-3">
            <div class="panel panel-default fixed" data-z="0.5">
              <div class="panel-heading">
                <div class="media media-clearfix-xs-min v-middle">
                  <div class="media-body text-caption text-light">
                    Avanzamento: {{corso.percentuale}} %
                  </div>
                  <div class="media-right">
                    <div class="progress progress-mini width-100 margin-none">
                      <div class="progress-bar progress-bar-orange-300" role="progressbar" :aria-valuenow="corso.percentuale" aria-valuemin="0" aria-valuemax="100" v-bind:style="{ width: corso.percentuale + '%' }">
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="corso.immagine!=null" class="cover overlay overlay-full v-top hover cont bg-img" :style="'background-image:url(' + corso.immagine+ ')'">
                <a @click="goTakeCourse(corso.idcorso, corso.edizione)" class="overlay overlay-full v-top overlay-hover overlay-bg-white hidden-xs">
                    <span class="v-center">
                        <span class="btn btn-circle btn-white btn-lg">
                            <i class="fa fa-graduation-cap"></i>
                        </span>
                    </span>
                </a>
              </div>
              <div style="height: 35%; overflow-y: auto;">
                <div class="panel-body">
                  <h4 class="text-headline margin-v-0-10">
                    <i v-if="corso.ELearningTipoFormazione == -1" class="fa fa-globe" aria-hidden="true" style="font-size: large; padding-right: 10px;"></i>
                    <a @click="goTakeCourse(corso.idcorso, corso.edizione)">{{corso.titolo}}</a>
                  </h4>
                </div>
                <hr v-if="corso.titoloEdizione!=''" class="margin-none" />
                <div v-if="corso.titoloEdizione!=''" class="panel-body">
                  <p v-if="corso.titoloEdizione!=''"><strong>Edizione:</strong> {{corso.titoloEdizione}}</p>
                  <p v-if="corso.stato!=''"><strong>Stato:</strong> {{corso.stato}}</p>
                </div>
                <hr class="margin-none" />
                <div class="panel-body">
                  <a class="btn btn-white btn-flat paper-shadow relative" data-z="0" data-hover-z="1" data-animated @click="goTakeCourse(corso.idcorso, corso.edizione)">Vai al corso</a>
                </div>
              </div>
            </div>
          </div>
          <div v-if="listapartecipazioni.length == 0" class="list-group-item paper-shadow animated fadeIn" data-z="0.5" style="padding: 10px 16px; border-width: 2px;">
            <span>Non risulti iscritto ad alcun corso</span>
          </div>
        </div>

        <div>
          <paginazione v-if="listapartecipazioni.length > 0 && isready" :array="parsedcorsi" :limit="limite" :large="isLarge" :bottom="true" @displayChanged="dispatchedPagination($event)"></paginazione>
        </div>
      </div>
    </div>
    <!-- /st-content-inner -->
  </div>
  <!-- /st-content -->
  <sidejsonly :default="false"></sidejsonly>
</div>
</template>
<script>
import paginazione from '../components/paginazione.vue'
import sidejsonly from '../components/side-default-jsonly.vue'

import {
  eventBus
} from '../../eventbus.js';

import {
  courseMyMixin
} from './mixins/courseMyMixin.js';

var bef = false;
var aft = false;

export default {
  mounted: function() {
    this.$nextTick(function() {
      $('#finished').bootstrapToggle();
      $('#begin').bootstrapToggle();
    });
  },
  mixins: [courseMyMixin],
  components: {
    paginazione,

    sidejsonly
  },
  data: function() {
    return {
      idpersona: 0,
      isready: false,
      displaycorsi: [],
      parsedcorsi: [],

      orderByPerc: false,
      orderDesc: false,
      filterComplete: false,
      filterIncomplete: false,
      ignore: false,
      just: '',
      labelout: false,
      filtro: ''
    }
  },
  watch: {
    'filterComplete': function() {
      if (!this.ignore) {
        if (this.filterIncomplete && this.filterComplete) {
          this.ignore = true;
          this.filterIncomplete = false;
          $('#begin').bootstrapToggle('off')
        }
        this.filterParts();
      } else {
        this.ignore = false;
      }
    },
    'filterIncomplete': function() {
      if (!this.ignore) {
        if (this.filterIncomplete && this.filterComplete) {
          this.ignore = true;
          this.filterComplete = false;
          $('#finished').bootstrapToggle('off')
        }
        this.filterParts();
      } else {
        this.ignore = false;
      }
    },
    filtro: function() {
      this.filterParts();
    },
    isready: function() {
      if (this.isready) {
        this.filterParts();
      }
    }
  },
  created: function() {
    var vm = this;
    eventBus.$on('displayChanged', function(toDisplay) {
      vm.displaycorsi = toDisplay;
      vm.loadImages();
    })
  },
  computed: {
    quantisono: function() {
      return this.parsedcorsi.length;
    },
    limite: function() {
      return window.innerWidth >= 1200 ? 8 : 6;
    },
    isLarge: function() {
      return window.innerWidth >= 1200;
    }
  },
  methods: {
    dispatchedPagination: function(toDisplay) {
      this.displaycorsi = toDisplay;
      this.loadImages();
    },
    filterParts: function() {
      var matching;
      if (this.filtro && this.filtro != '') {
        matching = this.listapartecipazioni.filter(function(p) {
          return p.titolo.toLowerCase().includes(this.filtro.toLowerCase());
        }, this)
      } else {
        matching = this.listapartecipazioni;
      }
      var enabled = matching.filter(this.filterFunction);
      this.parsedcorsi = enabled;
    },
    filterFunction: function(part) {
      if (this.filterComplete && this.just === 'Com') {
        if (part.completato === -1) {
          return true;
        } else {
          return false;
        }
      } else if (this.filterIncomplete && this.just === 'Inc') {
        if (part.iniziato === -1 || part.iscritto === -1) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    },
    filterOut: function() {
      if (this.filtro != '') {
        this.labelout = true;
      } else {
        this.labelout = false;
      }
    },
    pillComplete: function() {
      this.just = "Com";
      this.filterComplete = !this.filterComplete;
    },
    pillIncomplete: function() {
      this.just = "Inc";
      this.filterIncomplete = !this.filterIncomplete;
    },
    loadImages: function() {
      //TODO - load images twice

      var ids = [];
      var idz = [];
      for (var i = 0; i < this.displaycorsi.length; i++) {
        ids.push(this.displaycorsi[i].idcorso);
        idz.push(this.displaycorsi[i].edizione);
      }
      ids = ids.join(';');
      idz = idz.join(';');

      if (this.displaycorsi.length > 0) {
        this.$http.get(localStorage.getItem('path') + '/APICorsi?ID=' + ids).then((response) => {
          var corsi = response.body;
          try {
            corsi = JSON.parse(response.body);
          } catch (err) {};

          if (corsi != null && corsi.APICorsi != null) {
            corsi = corsi.APICorsi;
            for (var i = 0; i < corsi.length; i++) {
              for (var ii = 0; ii < this.displaycorsi.length; ii++) {
                if (corsi[i].ID == this.displaycorsi[ii].idcorso) {
                  if (corsi[i].Immagine != null) {
                    try {
                      this.displaycorsi[ii].immagine = corsi[i].Immagine;
                    } catch (err) {};
                  } else {
                    this.displaycorsi[ii].immagine = "images/course-placeholder.png";
                  }
                }
              }
            }
          }
        });
        this.$http.get(localStorage.getItem('path') + '/APIEdizioni?IdEdizione=' + idz).then((response) => {
          var edizioni = response.body;
          try {
            edizioni = JSON.parse(response.body);
          } catch (err) {};

          if (edizioni != null && edizioni.APIEdizioni != null) {
            edizioni = edizioni.APIEdizioni;
            for (var i = 0; i < edizioni.length; i++) {
              for (var ii = 0; ii < this.displaycorsi.length; ii++) {
                if (edizioni[i].IdEdizione == this.displaycorsi[ii].edizione) {
                  this.displaycorsi[ii].titoloEdizione = edizioni[i].Edizione;
                  if (edizioni[i].Stato != null) {
                    this.displaycorsi[ii].stato = edizioni[i].Stato
                  }
                }
              }
            }
          }
        });

      }
    },
    goTakeCourse: function(id, ed) {
      if (ed != null) {
        this.$router.push({
          name: 'corsoWithEd',
          params: {
            idcorso: id,
            idedizione: ed
          }
        });
      } else {
        this.$router.push({
          name: 'corso',
          params: {
            idcorso: id
          }
        });
      }
    }
  }
}
</script>
<style>
.fixed>.panel-heading {
  height: 10%;
}

.miei-head {
  height: 270px !important;
}

.miei-scroll {
  height: 180px !important;
  overflow-y: auto;
}

.miei-img {
  height: inherit;
}

@media (max-width: 768px) {
  .miei {
    height: auto !important;
  }
  .miei-scroll {
    height: auto;
  }
}
</style>

<style scoped>
.tools {
  padding: 0px;
}

.tool {
  display: inline;
}

.tools>.panel-default,
.tools .panel-primary {
  margin-bottom: 0px;
  border-bottom-left-radius: 3px;
  border-bottom-right-radius: 3px;
}

.tools .panel-primary>.panel-body {
  color: white;
  background-color: #42a5f5;
  border-top: 1px solid #999
}

.tools .panel-body {
  padding: 10px;
}


.media-left {
  padding-top: 25px;
}

@media (max-width: 991px) {
  .media-left {
    padding-top: 10px;
    padding-left: 0px;
    padding-bottom: 10px;
    margin: 0px;
  }
}
</style>
