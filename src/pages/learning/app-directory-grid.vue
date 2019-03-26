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
              <div class="media-left">
                <h1 class="text-display-1 margin-none">Griglia Corsi</h1>
                <p class="text-subhead">Cerca tra tutte le lezioni</p>
              </div>
              <div class="media-right">
                <div class="btn-group hidden-xs">
                  <router-link to='/app-directory-grid' class="btn btn-lg btn-grey-800"><i class="fa fa-th"></i></router-link>
                  <a href="#" class="btn btn-lg btn-white" @click.prevent="switchView()"><i class="fa fa-list"></i></a>
                </div>
              </div>
              <div class="media-right filter col-xs-12 col-md-4 col-lg-3">
                <div class="panel panel-default">
                  <div class="panel-body">
                    <div class="form-group form-control-material">
                      <input id="filtracorso" type="text" class="form-control" placeholder="parola nel titolo" v-model="filtro" @blur="filterOut()" />
                      <label v-show="!labelout" for="filtracorso">Filtra ...</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- INIZIO VISUALIZZAZIONE GRIGLIA CORSI -->
        <div class="row">
          <!-- template HTML per ogni corso (vedi v-for) -->
          <div class="item col-xs-12 col-sm-6 col-md-4 col-lg-3 animated fadeIn" v-for="corso in displaycorsi">
            <div class="panel panel-default fixed" data-z="0.5">

              <div v-if="corso.immagine!=null" class="cover overlay overlay-full v-top hover cont bg-img" :style="'background-image:url(' + corso.immagine+ ')'">
                <router-link :to="{ name: 'corso', params: {idcorso: corso.idcorso}}" class="overlay overlay-full v-top overlay-hover overlay-bg-white hidden-xs">
                  <span class="v-center">
                    <span class="btn btn-circle btn-white btn-lg">
                        <i class="fa fa-graduation-cap"></i>
                    </span>
                  </span>
                </router-link>
              </div>
              <div class="scrollable">
                <div class="panel-body">
                  <h4 class="text-headline margin-v-0-10">
                      <i v-if="corso.ELearningTipoFormazione == -1" class="fa fa-globe" aria-hidden="true" style="font-size: large; padding-right: 10px;"></i>
                      <router-link :to="{ name: 'corso', params: {idcorso: corso.idcorso}}">{{corso.titolo}}</router-link>
                  </h4>

                  <!-- Informazione sui rating mancante -->
                  <p class="small">
                    <span class="fa fa-fw fa-star text-yellow-800"></span>
                    <span class="fa fa-fw fa-star text-yellow-800"></span>
                    <span class="fa fa-fw fa-star text-yellow-800"></span>
                    <span class="fa fa-fw fa-star-o text-yellow-800"></span>
                    <span class="fa fa-fw fa-star-o text-yellow-800"></span>
                  </p>

                </div>
                <hr class="margin-none" />
                <div class="panel-body" v-html="corso.descrizione">
                  <hr v-if="corso.docente!=null" class="margin-v-8" />
                  <div v-if="corso.docente!=null" class="media v-middle">
                    <div class="media-left">
                      <img :src="corso.imgDocente" class="img-circle width-40" />
                    </div>
                    <div class="media-body">
                      <h4><font color="#3b75c3">{{corso.docente}}</font><br/>
                                                    </h4> Docente
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- TERMINE VISUALIZZAZIONE GRIGLIA CORSI -->
        <div v-if="displaycorsi.length == 0" class="panel panel-default col-xs-12" style="margin: 0px;">
          <div class="panel-body" style="border-bottom: 1px solid rgb(238, 238, 238);"> Nessun corso presente soddisfa i parametri di ricerca </div>
        </div>

      </div>
      <div>
        <!-- Invoco componente di paginazione -->
        <paginazione v-if="ready" :array="corsifiltrati" :limit="limite" :large="isLarge" :bottom="true" @displayChanged="dispatchedPagination($event)"></paginazione>
      </div>
    </div>
  </div>
  <sidejsonly :default="false"></sidejsonly>
</div>
</template>
<script>
//import LZString from 'lz-string'
import paginazione from '../components/paginazione.vue'
//import rating from './components/rating.vue'
import sidejsonly from '../components/side-default-jsonly.vue'

import {
  courseMixin
} from './mixins/courseMixin.js';
import {
  eventBus
} from '../../eventbus.js';

export default {
  mixins: [courseMixin],
  components: {
    paginazione,
    sidejsonly
  },
  computed: {
    limite: function() {
      return window.innerWidth >= 1200 ? 8 : 6;
    },
    isLarge: function() {
      return window.innerWidth >= 1200;
    }
  },
  mounted: function() {
    if (this.$root.xs) {
      this.$router.replace({
        name: 'list'
      })
    }
  },
  methods: {
    switchView() {
      if (this.filtro.trim() != "") {
        this.$router.push({
          name: 'lista',
          params: {
            filtro: this.filtro
          }
        })
      } else {
        this.$router.push({
          name: 'list'
        })
      }
    }
  }
}
</script>

<style>
.bg-img {
  background-position: center;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
}

.fixed {
  /* height: 540px !important */
  height: 440px !important;
}

.cont {
  height: 55% !important;

}

.scrollable {
  height: 45% !important;
  overflow-y: auto;
}

.this-img {
  height: 100% !important;
}

div.item {
  margin-bottom: 10px;
}

ul.pagination {
  margin-left: 15px;
}

@media (max-width: 767px) {
  .fixed {
    height: auto !important;
  }
}

.page-section {
  padding-bottom: 10px !important;
}
</style>
