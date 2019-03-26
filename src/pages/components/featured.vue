<template>
<div>
  <div class="row">
    <div class="col-xs-12 col-sm-6">
      <h4 class="text-headline margin-none" id="feat">Corsi Consigliati <span class="badge">{{quantisono}}</span></h4>
      <p class="text-subhead text-light" :class="{'no-bottom': $root.xs}">I corsi più popolari o recenti</p>
    </div>
    <div class="col-xs-12 col-sm-6">
      <!--
                <paginazione v-if="tuttifeatured.length > 0" :array="featured" @displayChanged="dispatchedPagination($event)" :limit="perpagina">
                -->
      <paginazione v-if="tuttifeatured.length > 0" :array="featured" @displayChanged="dispatchedPagination($event)" :limit="ppg" :bottom="true">
      </paginazione>
    </div>
  </div>
  <div class="panel panel-default paper-shadow" data-z="0.5" style="margin-bottom: 0px;">
    <div class="panel-body">
      <div v-for='corso in displaycorsi' class="col-xs-12">
        <div class="media media-clearfix-xs">
          <div class="row" style="vertical-align: middle">
            <div class="col-xs-4 col-xs-offset-4 col-sm-offset-0 col-sm-3">
              <div class="text-center" v-if="corso.immagine!=null">
                <img v-bind:src="corso.immagine" width="100%" height="100%" alt="">

              </div>
            </div>
            <div class="col-xs-12 col-sm-9 absolute-center">
              <!--
                                <h5 style="margin-top: 0px;">
                                 -->
              <h5 :class="{'xs': $root.xs}"><i v-if="corso.ELearningTipoFormazione == -1" class="fa fa-globe" aria-hidden="true" style="font-size: large; padding-right: 10px;"></i>
                                    <router-link
                                    :to="{ name: 'course', params: {idcorso: corso.idcorso}}"
                                    :class="{'lg': !$root.xs}">{{corso.titolo}}</router-link>
                                </h5>
              <!--
                                <span class="descr">{{corso.descrizione}}</span>
                                 -->
            </div>
          </div>
          <hr>
          <!--
                        <div class="media-body">
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
                         -->
        </div>
      </div>
    </div>
  </div>
  <!--
        <paginazione v-if="tuttifeatured.length > 0" :array="featured" @displayChanged="dispatchedPagination($event)" limit="1">
        </paginazione>
         -->
</div>
</template>
<script>
import paginazione from './paginazione.vue'
import rating from './rating.vue'

import {
  eventBus
} from '../../eventbus.js';

export default {
  mounted: function() {
    this.$nextTick(function() {
      this.getCorsi();
    })
  },
  props: {
    perpagina: {
      type: Number
    }
  },
  components: {
    paginazione,
    rating
  },
  data: function() {
    return {
      tuttifeatured: [],
      displaycorsi: [],
      ppg: this.perpagina ? this.perpagina : 1
    }
  },
  computed: {
    featured: function() {
      return this.tuttifeatured.slice(this.tuttifeatured.length - 5, this.tuttifeatured.length - 1);
    },
    quantisono: function() {
      return this.featured.length;
    },
    /*
    perpagina: function() {
        return Math.ceil(this.featured.length / 5);
    }
    */

  },
  methods: {
    dispatchedPagination(toDisplay) {
      /*
      if (this.displaycorsi.length > 0) {
          document.getElementById("feat").scrollIntoView();
      }
      */
      this.displaycorsi = toDisplay;
      this.loadImages();
    },
    getCorsi: function() {

      var corsi = this.$store.getters.getCorsi
      if (corsi && corsi.data) {
        corsi = corsi.data;
        if (corsi.length > 0) {
          var counter = 0;
          for (var i = 0; i < corsi.length; i++) {
            var corso = corsi[i]
            if(corso.Catalogo == -1){
              var descrizione = '';

              if (corso.Contenuti) {
                descrizione = corso.Contenuti;
                if (descrizione.split('>')[1] != '' && descrizione.split('>')[1] != null) {
                  descrizione = descrizione.split('>')[1].split('</')[0];
                }
              }

              var obj = {
                idcorso: corso.ID,
                idareatematica: corso.IDAreaTematica,
                titolo: corso.Titolo,
                ore: corso.Ore,
                descrizione: descrizione,
                immagine: null,
                ELearningTipoFormazione: corso.ELearningTipoFormazione,

                //random rating
                rating: Math.floor((Math.random() * 5) + 1),
                idDocente: corso.IDResponsabile
              };

              if (obj.idDocente != null) {
                obj.imgDocente = '/images/profile-photo_small.png'
                obj.docente = '';
              }
              this.tuttifeatured.push(obj);
            }
          }
        }
      }
    },
    loadImages: function() {

      for (let i = 0; i < this.displaycorsi.length; i++) {

        this.$http.get(localStorage.getItem('path') + '/APICorsi?ID=' + this.displaycorsi[i].idcorso).then((response) => {
          let corso = response.body;
          try {
            corso = JSON.parse(response.body);
          } catch (err) {};

          try {
            corso = corso.APICorsi[0];
          } catch (err) {}

          try {
            if (corso.Immagine) {
              this.displaycorsi[i].immagine = corso.Immagine;
            } else {
              this.displaycorsi[i].immagine = 'images/course-placeholder.png'
            }
          } catch (err) {
            this.displaycorsi[i].immagine = 'images/course-placeholder.png'
          }

        });

        if (this.displaycorsi[i].idDocente != null) {
          this.$http.get(localStorage.getItem('path') + '/APIUtenti?IDPersona=' + this.displaycorsi[i].idDocente).then((response) => {

            try {
              var user = response.body;
              try {
                user = JSON.parse(response.body);
              } catch (err) {};

              if (user != null && user.APIUtenti != null) {
                user = user.APIUtenti[0];
                this.displaycorsi[i].docente = user.Persona;
                if (user.FOTO != null) {
                  this.displaycorsi[i].imgDocente = user.FOTO;
                  //this.displaycorsi[i].imgDocente = 'http://www.michaelemerson.net/wp-content/uploads/2012/08/michael_emerson.png'
                }
              }
            } catch (err) {}
          });
        }
      }
    }
  }
}
</script>
<style scoped>
a {
  color: #212121 !important;
  font-weight: 300 !important;
  font-size: 1.2rem;
}

a.lg {
  line-height: 2rem !important;
  font-size: 1.4rem !important;
}

.xs {
  text-align: center;
}

a:hover {
  color: #42a5f5 !important;
}

img {
  border-radius: 5px;
}

.descr {
  font-weight: 300;
}
</style>
<style>
.badge {
  font-size: small !important;
  position: relative;
  top: -3px;
  right: -3px;
}

.no-bottom {
  margin-bottom: 0px;
}
</style>
