<template>
<div class="st-pusher" id="content">
  <div class="st-content">
    <div class="st-content-inner padding-none">
      <div class="container-fluid">
        <div class="page-section row">
          <div class="media v-middle col-xs-12 col-sm-6">
            <div class="media-body">
              <div class="media-left">
                <h1 class="text-display-1 margin-none">Le Mie Classi</h1>
                <p class="text-subhead" style="margin: 0px;">Cerca tra le classi che stai seguendo</p>
              </div>
            </div>
          </div>
          <div class="media-right col-xs-12 col-sm-6 col-md-4 col-md-offset-2 col-lg-3 col-lg-offset-3">
            <div class="panel panel-default" style="margin: 0px;">
              <div class="panel-body" style="padding-top: 8px; padding-bottom: 8px;">
                <div class="form-group form-control-material">
                  <input id="filtraed" type="text" class="form-control" placeholder="parola nel titolo" v-model="titleFilter" @blur="filterOut()" style="font-size: small;" />
                  <label v-show="!labelout" for="filtraed">Filtra per nome corso...</label>
                </div>
              </div>
            </div>
          </div>
          <div class="col-xs-12">
            <label class="switch" style="margin-top: 25px; margin-bottom: 0px;">
  								<input id="deadline" type="checkbox" checked v-model="date">
  								<span class="slider round"></span>
						</label>
            <span style="position: relative; top: -2px;">Mostra in corso</span>
            <paginazione v-if="edizioni.length > 0" :array="edizioni" limit="20" @displayChanged="dispatchedPagination" :bottom="true" :shown="5"></paginazione>
          </div>
        </div>
        <div class="panel panel-primary row int_wrapper" style="margin-bottom: 5px; border-style: none;">
          <div class="col-xs-4 col-lg-2 pad int row" style="margin:0px; text-align: center" @click="orderBy(0)">Edizione
            <i v-if="order[0].active" class="fa" aria-hidden="true" :class="{'fa-sort-asc p-t': order[0].asc, 'fa-sort-desc': !order[0].asc}"></i>
          </div>
          <div class="col-xs-8 col-lg-4 pad int row" style="margin:0px; text-align: center" @click="orderBy(4)">Corso
            <i v-if="order[4].active" class="fa" aria-hidden="true" :class="{'fa-sort-asc p-t': order[4].asc, 'fa-sort-desc': !order[4].asc}"></i>
          </div>
          <div class="col-xs-4 col-lg-2 pad int" @click="orderBy(1)" style="text-align: center;">Data Inizio
            <i v-if="order[1].active" class="fa" aria-hidden="true" :class="{'fa-sort-asc p-t': order[1].asc, 'fa-sort-desc': !order[1].asc}"></i>
          </div>
          <div class="col-xs-4 col-lg-2 pad int" @click="orderBy(2)" style="text-align: center;">Data Fine
            <i v-if="order[2].active" class="fa" aria-hidden="true" :class="{'fa-sort-asc p-t': order[2].asc, 'fa-sort-desc': !order[2].asc}"></i>
          </div>
          <div class="col-xs-4 col-lg-2 pad int" @click="orderBy(3)" style="text-align: center;"><span v-if="$root.xs">Stato</span><span v-else>Stato Partecipanti</span>
            <i v-if="order[3].active" class="fa" aria-hidden="true" :class="{'fa-sort-asc p-t': order[3].asc, 'fa-sort-desc': !order[3].asc}"></i>
          </div>
        </div>
        <!-- TODO add panel for edizioni length == 0-->
        <div v-if="edizioni.length == 0 && !loading" class="list-group-item paper-shadow animated fadeIn" data-z="0.5" style="padding: 10px 16px; border-width: 2px;">
          <span>Nessuna edizione soddisfa i parametri di ricerca</span>
        </div>
        <div v-if="loading" class="list-group-item paper-shadow animated fadeIn" data-z="0.5" style="padding: 10px 16px; border-width: 2px;">
          <span>Caricamento edizioni</span>
          <clip-loader :loading="loading" :color="'rgb(93, 197, 150)'" size="12px"></clip-loader>
        </div>
        <transition-group v-else name="menu" class="list-group" tag="div">
          <div v-for="(ed, i) in displayEdizioni" :key="ed.IdEdizione" class="list-group-item paper-shadow animated fadeIn tutor_row_data" data-z="0.5" style="min-height: 55px;
            padding: 0px;">
            <div class="list-group-item-heading media row" style="margin: 0px;">
              <div class="media-left col-xs-4 col-lg-2" style="padding: 0px; padding-top: 10px; text-align: center">
                <h4><router-link :to="{ name: 'lista-partecipanti', params: {id: ed.IdEdizione, idCorso: ed.Idcorso}}"><strong>{{ed.Edizione}}</strong></router-link></h4>
                <!--<h4><router-link :to="'/lista-partecipanti/' + ed.IdEdizione  + '/' + ed.Idcorso"><strong>{{ed.Edizione}}</strong></router-link></h4>-->
              </div>
              <div class="media-left col-xs-8 col-lg-4" style="padding: 0px; padding-top: 10px; text-align: center">
                {{find(ed)}}
              </div>
              <div class="visible-lg-block col-lg-2 pad" style="text-align: center">{{ed.DataInizio}}</div>
              <div class="visible-lg-block col-lg-2 pad" style="text-align: center">{{ed.DataFine}}</div>
              <div class="visible-lg-block col-lg-2 pad" style="border-style: none; text-align: center"><span class="hidden-xs">Completato da </span><strong>
		                    	<clip-loader :loading="ed.NumCompletamenti == null" :color="'rgb(93, 197, 150)'" size="12px"></clip-loader>
		                    	<span v-if="ed.NumCompletamenti != null">{{ed.NumCompletamenti}}</span>
		                    	</strong> su {{ed.NumPartecipanti}}
              </div>
            </div>
            <!-- nascosto se width == lg, il contenuto sta su una sola riga -->
            <hr class="hidden-lg" style="margin: 5px 16px 0px 16px">
            <div class="list-group-item-text row hidden-lg" style="padding: 0px; margin: 0px">
              <div class="col-xs-4 col-lg-2 pad" style="text-align: center">{{ed.DataInizio}}</div>
              <div class="col-xs-4 col-lg-2 pad" style="text-align: center">{{ed.DataFine}}</div>
              <div class="col-xs-4 col-lg-2 pad" style="border-style: none; text-align: center"><span class="hidden-xs">Completato da </span><strong>
		                    	<clip-loader :loading="ed.NumCompletamenti == null" :color="'rgb(93, 197, 150)'" size="12px"></clip-loader>
		                    	<span v-if="ed.NumCompletamenti != null">{{ed.NumCompletamenti}}</span>
		                    	</strong> su {{ed.NumPartecipanti}}
              </div>
            </div>
            <!-- -->
          </div>
        </transition-group>
      </div>
    </div>
  </div>
</div>
</template>
<script>
import {
  loadEditionsMixin
} from './loadEditionsMixin.js';

import paginazione from '../components/paginazione.vue';
import ClipLoader from 'vue-spinner/src/ClipLoader.vue'


export default {
  mixins: [loadEditionsMixin],
  data: function() {
    return {
      edizioniCollection: null,
      currentParsedCollection: null,
      edizioni: [],
      //L'array con le edizioni selezionate
      displayEdizioni: [],
      titleFilter: '',
      labelout: false,
      //variabile che tiene in memoria se e' spuntata la casella date
      date: true,

      order: [{
          active: false,
          asc: true
        },
        {
          active: false,
          asc: true
        },
        {
          active: false,
          asc: true
        },
        {
          active: false,
          asc: true
        },
        {
          active: false,
          asc: true
        }
      ]
    }
  },
  components: {
    paginazione,
    ClipLoader,
  },
  watch: {
    date: function() {
      //nella funzione filterEditionList il codice controlla da quale collection leggere, il filtro data avviene in quel momento
      this.filterEditionList();
    },
    titleFilter: function() {
      this.filterEditionList();
    }
  },
  methods: {
    editionInit: function() {
      this.edizioniCollection = this.$store.getters.getEdizioni;
      this.currentParsedCollection = this.edizioniCollection.addDynamicView('current');
      this.currentParsedCollection.applyWhere(function(obj) {
        var date = Date.parse(obj.DataFine);
        var today = Date.now();
        return date >= today;
      });

      this.edizioni = this.currentParsedCollection.data().slice();
    },
    filterEditionList: function() {
      var sourceList;
      if (this.date) {
        //currentParsedCollection è una Dynamic View già filtrata per data corrente
        sourceList = this.currentParsedCollection.data();
      } else {
        sourceList = this.edizioniCollection.data;
      }
      this.applyTitleFilter(sourceList);
    },
    applyTitleFilter: function(sourceEditionList) {

      if (this.titleFilter.trim() != "") {
        this.edizioni = sourceEditionList.filter(function(ed) {
          var s = ed.Corso + ''
          return s.toUpperCase().includes((this.titleFilter.toUpperCase()))
        }, this)
        if (this.edizioni.length == 0) {
          this.displayEdizioni = []
        }
      } else {
        this.edizioni = sourceEditionList.slice();
      }
      this.sort()
    },
    handleOrderIndex: function(index) {
      for (var i = 0; i < this.order.length; i++) {
        if (i != index) {
          this.order[i].active = false;
          this.order[i].asc = true;
        } else {
          if (this.order[i].active) {
            this.order[i].asc = !this.order[i].asc;
          } else {
            this.order[i].active = true;
          }
        }
      }
    },
    orderBy: function(index) {
      this.handleOrderIndex(index);
      this.sort();
    },
    sort: function() {
      var index, asc;
      for (var i = 0; i < this.order.length; i++) {
        if (this.order[i].active) {
          index = i;
          asc = this.order[i].asc;
          break;
        }
      }
      var f = null;

      switch (index) {

        case 0:
          if (asc) {
            f = function(a, b) {
              return a.Edizione < b.Edizione ? -1 : 1;
            }
          } else {
            f = function(a, b) {
              return a.Edizione > b.Edizione ? -1 : 1;
            }
          }
          break;
        case 1:
          if (asc) {
            f = function(a, b) {
              return Date.parse(a.DataInizio) - Date.parse(b.DataInizio);
            }
          } else {
            f = function(a, b) {
              return Date.parse(b.DataInizio) - Date.parse(a.DataInizio);
            }
          }
          break;
        case 2:
          if (asc) {
            f = function(a, b) {
              return Date.parse(a.DataFine) - Date.parse(b.DataFine);
            }
          } else {
            f = function(a, b) {
              return Date.parse(b.DataFine) - Date.parse(a.DataFine);
            }
          }
          break;
        case 3:
          if (asc) {
            f = function(a, b) {
              return a.NumPartecipanti - b.NumPartecipanti;
            }
          } else {
            f = function(a, b) {
              return b.NumPartecipanti - a.NumPartecipanti;
            }
          }
          break;
        case 4:
          if (asc) {
            f = function(a, b) {
              return a.Idcorso < b.Idcorso ? -1 : 1;
            }
          } else {
            f = function(a, b) {
              return a.Idcorso > b.Idcorso ? -1 : 1;
            }
          }
          break;
      }
      if (f != null) {
        this.edizioni.sort(f);
      }
    },
    find: function(edition) {

      var position;
      for (var i = 0; i < this.corsi.length; i++) {

        if (this.corsi[i].id == edition.Idcorso) {

          position = i;
          break;
        }
      }
      edition.Corso = this.corsi[position].name;
      return this.corsi[position].name;
    },
    filterOut: function() {
      if (this.titleFilter != '') {
        this.labelout = true;
      } else {
        this.labelout = false;
      }
    },
    dispatchedPagination: function(display) {
      this.displayEdizioni = display;
      this.getCompletamenti(display);
    },
    getCompletamenti: function(display) {
      var updater = {};
      var ids = [];
      for (var i = 0; i < display.length; i++) {
        //il fetch non avviene se e per chi è già presente l'informazione sui completamenti
        if (display[i].NumPartecipanti > 0 && display[i].NumCompletamenti == null) {
          ids.push(this.displayEdizioni[i].IdEdizione);
          //memorizzo il riferimento all'indice in displayEdizioni per quando farò l'update
          updater[this.displayEdizioni[i].IdEdizione] = {
            count: 0,
            index: i
          }
        } else if (display[i].NumPartecipanti == 0 && display[i].NumCompletamenti != 0) {
          //se il numero Partecipanti è 0, non serve richiedere l'informazione
          this.displayEdizioni[i].NumCompletamenti = 0;
          this.findAndUpdateCollections(this.displayEdizioni[i].IdEdizione, 0);
        }
      }
      ids = ids.join(';');

      if (ids != '') {
        this.$http.get(localStorage.getItem("path") + "APIAvanzamentoCorsi?IdEdizionePartecipazione=" + ids + "&Completamento=100").then((response) => {
          var res = response.body
          try {
            res = JSON.parse(response.body);
          } catch (err) {}

          if (res && res.APIAvanzamentoCorsi) {
            for (var i = 0; i < res.APIAvanzamentoCorsi.length; i++) {
              //conto le istanze dei partecipanti nel campo corretto di updater
              updater[res.APIAvanzamentoCorsi[i].IdEdizionePartecipazione].count++;
            }
          }

          for (var prop in updater) {
            //itero ogni edizione da aggiornare
            try {
              //se l'utente scorre velocemente nella paginazione, l'edizione potrebbe non trovarsi fra quelle esposte a video:
              if (this.displayEdizioni[updater[prop].index].IdEdizione == prop) {
                //se è presente, aggiorno l'array mostrato a video
                this.displayEdizioni[updater[prop].index].NumCompletamenti = updater[prop].count;
              } else {
                //altrimenti, cerco l'edizione nell'array sorgente e aggiorno quella
                for (var i = 0; i < this.edizioni.length; i++) {
                  if (this.edizioni[i].IdEdizione == prop) {
                    this.edizioni[i].NumCompletamenti = updater[prop].count;
                  }
                }
              }

              this.findAndUpdateCollections(prop, updater[prop].count)
            } catch (err) {
              console.log("caught speed in fetching compl.")
            }
          }
        });
      }
    },
    findAndUpdateCollections: function(ed, count) {
      //effettua l'update nella collezione di loki, così finchè non si ricarica la pagina, non sarà neceserrario rieseguire il fetch
      this.edizioniCollection.findAndUpdate({
        'IdEdizione': ed
      }, function(obj) {
        obj.NumCompletamenti = count
      });
    }
  }
}
</script>
<style scoped>
.p-t {
  padding-top: 3px;

}

.fa-sort-desc,
.fa-sort-asc {
  position: absolute;
  right: 5px;
  top: 2px;
}

.int {
  border-style: solid;
  border-width: 1px;
  border-color: white;
  background-color: #42a5f5;
  cursor: pointer;
}

.pad {
  padding: 8px;
  padding-left: 16px;
}

.int_wrapper {
  margin: 0px;
  background-color: transparent;
  color: white;
  border-radius: 2px;
  border-top-width: 0px;
  border-bottom-width: 0px;
}

.menu-enter {
  opacity: 0;
}

.menu-enter-active {
  animation: slide-in 0.5s ease-out forwards;
  transition: opacity 0.5s;
}

.menu-leave-active {
  animation: slide-out 0.5s ease-out forwards;
  transition: opacity 0.5s;
  opacity: 0;
  position: absolute;
}

.menu-move {
  transition: transform 0.5s;
}

/* The switch - the box around the slider */

.switch {
  position: relative;
  display: inline-block;
  width: 30px;
  height: 15px;
}

/* Hide default HTML checkbox */

.switch input {
  display: none;
}

/* The slider */

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: .4s;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 10px;
  width: 10px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
}

input:checked+.slider {
  background-color: #2196F3;
}

input:focus+.slider {
  box-shadow: 0 0 1px #2196F3;
}

input:checked+.slider:before {
  -webkit-transform: translateX(15px);
  -ms-transform: translateX(15px);
  transform: translateX(15px);
}

/* Rounded sliders */

.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}

@keyframes slide-in {
  from {
    transform: translateX(80px);
  }
  to {
    transform: translateX(0px);
  }
}

@keyframes slide-out {
  from {
    transform: translateX(0px);
  }
  to {
    transform: translateX(80px);
  }
}
</style>
<style>
.tutor_row_data {
  box-shadow: rgba(0, 0, 0, 0.3) 0px 2px 4px;
  border-style: none;
  margin-bottom: 4px;
}
</style>
