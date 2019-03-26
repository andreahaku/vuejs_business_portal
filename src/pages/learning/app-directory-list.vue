<template>
<div class="st-pusher" id="content">
  <!-- sidebar effects INSIDE of st-pusher: -->
  <!-- st-effect-3, st-effect-6, st-effect-7, st-effect-8, st-effect-14 -->
  <!-- this is the wrapper for the content -->
  <div class="st-content">
    <!-- extra div for emulating position:fixed of the menu -->
    <div class="st-content-inner padding-none">
      <div class="container-fluid">
        <div class="page-section" :class="{'section_xs': $root.xs}">
          <div class="media v-middle">
            <div class="media-body">
              <div class="media-left">
                <h1 class="text-display-1 margin-none">Lista Corsi</h1>
                <p class="text-subhead">Cerca tra tutte le lezioni</p>
              </div>
              <div class="media-right">
                <div class="btn-group hidden-xs">
                  <a href="#" class="btn btn-lg btn-white" @click.prevent="switchView()"><i class="fa fa-th"></i></a>
                  <a class="btn btn-lg btn-grey-800"><i class="fa fa-list"></i></a>
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
        <div v-for="corso in displaycorsi" class="panel panel-default paper-shadow animated fadeIn" data-z="0.5">
          <div class="panel-body" :class="{'panel_xs': $root.xs}">
            <div class="media media-clearfix-xs">
              <div class="media-left text-center" style="min-height: 100px;">
                <div v-if="corso.immagine!=null" class="cover width-150 width-100pc-xs overlay hover margin-v-0-10 bg-img" :style="'background-image:url(' + corso.immagine+ ')'" style="min-height: inherit">
                  <!-- <img v-bind:src="corso.immagine" alt=""> -->
                </div>
              </div>
              <div class="media-body">
                <h4 class="text-headline margin-v-5-0">
                                        <i v-if="corso.ELearningTipoFormazione == -1" class="fa fa-globe" aria-hidden="true" style="font-size: large; padding-right: 10px;"></i>
                                    <router-link :to="{ name: 'corso', params: {idcorso: corso.idcorso}}">{{corso.titolo}}</router-link></h4>
                <p class="small">
                  <span class="fa fa-fw fa-star text-yellow-800"></span>
                  <span class="fa fa-fw fa-star text-yellow-800"></span>
                  <span class="fa fa-fw fa-star text-yellow-800"></span>
                  <span class="fa fa-fw fa-star-o text-yellow-800"></span>
                  <span class="fa fa-fw fa-star-o text-yellow-800"></span>
                </p>
                <p v-html="corso.descrizione"></p>
                <hr v-if="corso.docente!=null" class="margin-v-8" />
                <div v-if="corso.docente!=null" class="media v-middle">
                  <div class="media-left">
                    <img :src="corso.imgDocente" class="img-circle width-40" />
                  </div>
                  <div class="media-body">
                    <h4 style="color: #3b75c3">{{corso.docente}}<br/>
                                            </h4> Docente
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="displaycorsi.length == 0" class="panel panel-default col-xs-12" style="margin: 0px;">
          <div class="panel-body" style="border-bottom: 1px solid rgb(238, 238, 238);"> Nessun corso presente soddisfa i parametri di ricerca </div>
        </div>
        <span id="pag">
                    <paginazione v-if="ready" :array="corsifiltrati" limit="5" @displayChanged="dispatchedPagination($event)" :bottom="true">
                    </paginazione>
                    </span>
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
  methods: {
    switchView() {
      if (this.filtro.trim() != "") {
        this.$router.push({
          name: 'griglia',
          params: {
            filtro: this.filtro
          }
        })
      } else {
        this.$router.push({
          name: 'grid'
        })
      }
    }
  }
}
</script>
<style>
.filter {
  padding: 0px;
}

.filter>.panel-default {
  margin-bottom: 0px;
}

.filter .panel-body {
  padding: 10px;
}

@media (min-width: 992px) {
  .filter {
    position: absolute;
    right: 20px;
    top: 20px;
  }
}

.page-section {
  padding-top: 20px;
  padding-bottom: 10px !important;
}
</style>
<style scoped>
.section_xs {
  padding-top: 10px;
}

.section_xs .media-footer {
  position: relative;
  right: 0px;
  top: 0px;
  padding: 0px;
}

.panel_xs h4 {
  line-height: inherit;
  font-size: inherit;
}

.panel_xs h4>a {
  font-weight: 300 !important;
  font-size: 1.2rem;
}
</style>
