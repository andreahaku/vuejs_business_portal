<template>
<div class="st-pusher" id="content">
  <!-- sidebar effects INSIDE of st-pusher: -->
  <!-- st-effect-3, st-effect-6, st-effect-7, st-effect-8, st-effect-14 -->
  <!-- this is the wrapper for the content -->
  <div class="st-content">
    <!-- extra div for emulating position:fixed of the menu -->
    <div class="st-content-inner padding-none">
      <div class="container-fluid">
        <div v-if="!ready" class='uil-rolling-css' :style="{transform:'scale(0.71)',
              position: 'absolute', margin: '0 auto', top: '100px', right: '0px', left: '0px'}">
          <div>
            <div></div>
            <div></div>
          </div>
        </div>
        <div v-else class="media media-grid media-clearfix-xs">
          <div class="media-body">
            <div class="page-section">
              <div class="media">
                <!-- su mobile, l'immagine va sopra al testo -->
                <div :class="[$root.xs ? 'center-align' : 'media-left']">
                  <div class="thumbnail" :class="[$root.xs ? 'width-100 i-b' : 'width-200']">
                    <img :src="course.immagine"></div>
                </div>
                <div class="media-body">
                  <h4 class="text-display-1 margin-none" :class="{'title-shrinked': $root.xs}">{{course.titolo}}</h4>

                  <div class="" v-html="course.descrizione" style="margin-top: 10px;"></div>
                </div>
              </div>
            </div>
            <div v-if="moduli.length > 0" class="page-section">
              <h5 class="text-headline margin-none">Moduli del corso</h5>
              <div v-for="raccoglitore in moduli" class="panel panel-default curriculum open paper-shadow chapter" data-z="0.5">
                <div class="panel-heading panel-heading-gray" @click="togglePanel(raccoglitore.ref)" style="padding-right: 22px;">
                  <div class="media">
                    <div class="media-left" style="vertical-align: middle;">
                      <div class="icon-block s30 bg-indigo-300 text-white img-circle">
                        <i class="fa fa-graduation-cap"></i>
                      </div>
                    </div>
                    <div class="media-body">
                      <h6 class="text-headline">{{raccoglitore.nome}}</h6>
                    </div>
                  </div>
                </div>
                <span class="fa fa-chevron-down collapse-status collapse-close open" aria-hidden="true" @click="togglePanel(raccoglitore.ref)" style="padding: 5px;"></span>
                <!-- assegno l'id adeguatamente per gestire il toggle -->
                <div class="list-group collapse" :id="raccoglitore.ref">
                  <span class="fa fa-chevron-up collapse-status collapse-close open" aria-hidden="true" @click="togglePanel(raccoglitore.ref)" style="padding: 5px;"></span>
                  <div v-for="modulo in raccoglitore.children" class="list-group-item media non-chapter">
                    <div class="media-body">
                      <i class="fa fa-fw fa-circle text-green-300"></i> {{modulo.nome}}
                    </div>
                    <div class="media-right">
                      <div class="width-50 text-right text-caption"> <span v-if="modulo.minuti">{{modulo.minuti}} min</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="list-group-item paper-shadow animated fadeIn" data-z="0.5" style="padding: 10px 16px; border-width: 2px;">
              <span>Non è presente un indice per questo corso</span>
            </div>
            <!-- BOTTOM Commenti
              <hr>
              <h5 class="text-headline margin-none">Commenti</h5>
              <p class="text-subhead text-light">Alcuni giudizi da parte di studenti passati</p>
              <br/>
              <div class="row">
                  <div class="col-md-6">
                      <div class="testimonial">
                          <div class="panel panel-default">
                              <div class="panel-body">
                                  <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam amet doloremque enim error id, inventore magni odio odit quo tenetur.</p>
                              </div>
                          </div>
                          <div class="media v-middle">
                              <div class="media-left">
                                  <img src="images/people/50/guy-7.jpg" alt="People" class="img-circle width-40" />
                              </div>
                              <div class="media-body">
                                  <p class="text-subhead margin-v-5-0">
                                      <strong>Giovanni D. <span class="text-muted">@ Bkm Srl</span></strong>
                                  </p>
                                  <p class="small">
                                      <span class="fa fa-fw fa-star text-yellow-800"></span>
                                      <span class="fa fa-fw fa-star text-yellow-800"></span>
                                      <span class="fa fa-fw fa-star text-yellow-800"></span>
                                      <span class="fa fa-fw fa-star-o text-yellow-800"></span>
                                      <span class="fa fa-fw fa-star-o text-yellow-800"></span>
                                  </p>
                              </div>
                          </div>
                      </div>
                  </div>
                  <div class="col-md-6">
                      <div class="testimonial">
                          <div class="panel panel-default">
                              <div class="panel-body">
                                  <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam amet doloremque enim error id, inventore magni odio odit quo tenetur.</p>
                              </div>
                          </div>
                          <div class="media v-middle">
                              <div class="media-left">
                                  <img src="images/people/50/guy-4.jpg" alt="People" class="img-circle width-40" />
                              </div>
                              <div class="media-body">
                                  <p class="text-subhead margin-v-5-0">
                                      <strong>Adriano D. <span class="text-muted">@ Bkm Srl</span></strong>
                                  </p>
                                  <p class="small">
                                      <span class="fa fa-fw fa-star text-yellow-800"></span>
                                      <span class="fa fa-fw fa-star text-yellow-800"></span>
                                      <span class="fa fa-fw fa-star text-yellow-800"></span>
                                      <span class="fa fa-fw fa-star text-yellow-800"></span>
                                      <span class="fa fa-fw fa-star-o text-yellow-800"></span>
                                  </p>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
              -->
          </div>

          <!-- COURSE AND TUTOR DETAILS   -->
          <div class="media-right">
            <div class="page-section width-270 width-auto-xs">

              <courseDetails :corso="course" :uo="uos"></courseDetails>

              <div class="panel panel-default paper-shadow" data-z="0.5" data-hover-z="1" data-animated>
                <div class="panel-body">
                  <div class="media v-middle">
                    <div class="media-left">
                      <img src="images/people/110/guy-6.jpg" alt="About Adrian" width="60" class="img-circle" />
                    </div>
                    <div class="media-body">
                      <h4 class="text-title margin-none"><a href="#" @click.prevent="">Adriano Darmiano</a></h4>
                      <span class="caption text-light">Biografia</span>
                    </div>
                  </div>
                  <br/>
                  <div>
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. A accusamus aut consectetur consequatur cum cupiditate debitis doloribus, error ex explicabo harum illum minima mollitia nisi nostrum officiis omnis optio qui quisquam saepe
                      sit sunt totam vel velit voluptatibus? Adipisci ducimus expedita id nostrum quas quia!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        

          <!--  ROQUETTE
          <div class="media-right">
              <div class="page-section width-270 width-auto-xs">

                  <courseDetails :corso="course" :uo="uos"></courseDetails>

                  <div class="panel panel-default paper-shadow" data-z="0.5" data-hover-z="1" data-animated>
                      <div class="panel-body">
                          <div class="media v-middle">
                              <div class="media-left">
                                  <img src="images/people/110/guy-6.jpg" alt="About Adrian" width="60" class="img-circle" />
                              </div>
                              <div class="media-body">
                                  <h4 class="text-title margin-none"><a href="#" @click.prevent="">Adriano Darmiano</a></h4>
                                  <span class="caption text-light">Biografia</span>
                              </div>
                          </div>
                          <br/>
                          <div>
                              <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. A accusamus aut consectetur consequatur cum cupiditate debitis doloribus, error ex explicabo harum illum minima mollitia nisi nostrum officiis omnis optio qui quisquam saepe sit sunt totam vel velit voluptatibus? Adipisci ducimus expedita id nostrum quas quia!</p>
                          </div>
                      </div>
                  </div>
                  <div class="panel panel-default paper-shadow" data-z="0.5" data-hover-z="1" data-animated>
                      <div class="panel-body">
                          <h4 class="text-headline">Altri Corsi</h4>
                      </div>
                      <ul class="list-group">
                          <li class="list-group-item">
                              <div class="media v-middle">
                                  <div class="media-left">
                                      <div class="icon-block s30 bg-grey-400 text-white">
                                          <i class="fa fa-mortar-board"></i>
                                      </div>
                                  </div>
                                  <div class="media-body">
                                      <a href="#" class="link-text-color">Dolores explicabo mollitia nisi perspiciatis quas. Itaque.</a>
                                  </div>
                              </div>
                          </li>
                          <li class="list-group-item">
                              <div class="media v-middle">
                                  <div class="media-left">
                                      <div class="icon-block s30 bg-grey-400 text-white">
                                          <i class="fa fa-mortar-board"></i>
                                      </div>
                                  </div>
                                  <div class="media-body">
                                      <a href="#" class="link-text-color">
                      Lorem ipsum dolor sit amet, consectetur adipisicing.
                  </a>
                                  </div>
                              </div>
                          </li>
                          <li class="list-group-item">
                              <div class="media v-middle">
                                  <div class="media-left">
                                      <div class="icon-block s30 bg-grey-400 text-white">
                                          <i class="fa fa-mortar-board"></i>
                                      </div>
                                  </div>
                                  <div class="media-body">
                                      <a href="#" class="link-text-color">A aliquam dolore et explicabo possimus vitae?</a>
                                  </div>
                              </div>
                          </li>
                      </ul>
                  </div>
                  <!-- // END .panel -->
          <!-- .panel -->
          <!--

              </div>

          </div>
          -->
        </div>
      </div>
    </div>
    <!-- /st-content-inner -->
  </div>
  <!-- /st-content -->
  <sidejsonly :default="true"></sidejsonly>

</div>
</template>
<script>
import rating from '../components/rating.vue'
import sidejsonly from '../components/side-default-jsonly.vue'
import courseDetails from '../components/course-details.vue'

import {
  eventBus
} from '../../eventbus.js';

export default {

  mounted() {
    this.$nextTick(function() {
      this.getCorso();
    });
    if (this.$root.inCharge) {
      this.isChief = true;
      this.uos = this.$root.inCharge.uos;
    }
  },
  data: function() {
    return {
      idcorso: '',
      course: {},
      moduli: [],
      ready: false,
      isChief: false,

      uos: [],
    }
  },
  components: {
    rating,
    sidejsonly,
    courseDetails
  },
  watch: {
    '$route': function() {
      this.getCorso();
    }
  },
  methods: {
    getCorso: function() {
      this.idcorso = null;
      try {
        this.idcorso = this.$route.path.split('/')[2];
      } catch (err) {
        console.log(err);
      }

      var partecipazioni = this.$store.getters.getPartecipazioni;

      if (partecipazioni) {
        var matching = partecipazioni.find({
          'IDCorso': Number(this.idcorso)
        });
        for (var i = 0; i < matching.length; i++) {

          if (matching[i].IdEdizione != null &&
            (matching[i].StatoIscritto + matching[i].StatoFinale) < 0) {
            //se esiste una mia partecipazione al corso
            this.$router.replace({
              name: 'corso',
              params: {
                idcorso: this.idcorso
              }
            })
          }
        }
      }
      this.$http.get(localStorage.getItem('path') + '/APICorsi?ID=' + this.idcorso).then((response) => {
        var corso = response.body;
        try {
          corso = JSON.parse(response.body);
        } catch (err) {};

        if (corso && corso.APICorsi) {
          corso = corso.APICorsi[0];

          var descrizione = '';
          if (corso.Contenuti) {
            descrizione = corso.Contenuti;
            if (descrizione.split('>')[1] != '' && descrizione.split('>')[1] != null) {
              descrizione = descrizione.split('>')[1].split('</')[0];
            }
          }


          this.course = {
            id: this.idcorso,
            titolo: corso.Titolo,
            ore: corso.Ore,
            descrizione: descrizione,
            stato: corso.StatoCorso,
            immagine: corso.Immagine ? corso.Immagine : "images/course-placeholder.png",
            rate: (Math.random() * 5) + 1
          }
          console.log(this.course)

          this.getModuli();
        } else {
          eventBus.$emit("alert", "Corso non esistente");
          this.$router.replace({
            name: 'list'
          })
        }
      });
    },
    getModuli: function() {

      this.$http.get(localStorage.getItem('path') + '/APIModuli/?IdCorso=' + this.idcorso).then((response) => {
        var moduliCorso = response.body;
        try {
          moduliCorso = JSON.parse(response.body);
        } catch (err) {};
        moduliCorso = moduliCorso.APIModuli;

        if (moduliCorso != null) {
          let moduliCorsoOrdered = moduliCorso.sort(function(a, b) {
            return a.Sequenza - b.Sequenza
          })

          var padre = moduliCorsoOrdered[0].Modulo;
          var figli = [];
          this.moduli = [];

          for (let i = 0; i < moduliCorsoOrdered.length; i++) {

            let nodo = moduliCorsoOrdered[i]

            if (nodo.TipoModulo == "Raccoglitore") {
              if (figli.length > 0) {
                this.moduli.push({
                  nome: padre,
                  children: figli,
                  //aggiunto ref per gestire il toggle
                  ref: i,

                  target: '#' + this.moduli.length + 'beta'
                })
                figli = []
                padre = nodo.Modulo
              }
            } else {

              let obj = {
                nome: nodo.Modulo,
                id: nodo.IDModulo,
                minuti: nodo.Minuti
              }
              figli.push(obj);

            }

            if (i == moduliCorsoOrdered.length - 1) {

              this.moduli.push({
                nome: padre,
                children: figli,
                toshow: false,
                //aggiunto ref per gestire il toggle
                ref: i,

                target: '#' + this.moduli.length + 'alpha'
              })
            }

          }
        }
        this.ready = true;
      })
    },
    togglePanel: function(param) {
      var id = "#" + param;
      $(id).collapse("toggle");
    }
  }
}
</script>
<style scoped>
.large {
  font-weight: 100 !important;
  font-size: 1.5rem;
}

h6 {
  margin-top: 0px;
  font-weight: 300 !important;
  font-size: 1.5rem !important;
}

.chapter {
  margin-bottom: 0px;
  margin-top: 8px;
}

.non-chapter {
  cursor: auto !important;
}

.media-body {
  vertical-align: middle;
}
</style>
