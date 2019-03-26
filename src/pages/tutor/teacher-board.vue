<template>
<div class="st-pusher" id="content">
  <div class="st-content">
    <div class="st-content-inner padding-none">
      <div class="container-fluid">
        <br>
        <div class="row">
          <div class="item col-xs-12 col-sm-5 col-lg-4">
            <div class="row">
              <div class="col-xs-12">
                <h4 class="text-headline margin-none">Le Mie Classi <span class="badge" v-if="!do_searching">{{edizioni.length}}</span></h4>
                <p class="text-subhead text-light">Edizioni di cui sono docente</p>
              </div>
              <div class="col-xs-12">
                <ul class="nav nav-tabs">
                  <li :class="{'active': !date && !searching}" style="width: 33%; text-align: center;"><a href="#" @click.prevent="tutti();" style="font-size: smaller">TUTTI</a></li>
                  <li :class="{'active': date && !searching}" style="width: 34%; text-align: center;"><a href="#" @click.prevent="incorso()" style="font-size: smaller">IN CORSO</a></li>
                  <li :class="{'active': searching}" style="width: 33%; text-align: center;"><a href="#" @click.prevent="cerca()" style="font-size: smaller">CERCA</a></li>
                </ul>
                <div v-if="loading" class="cs custom_spinner"></div>
                <div v-else class="panel panel-default paper-shadow animated" data-z="0.5" style="overflow-y: auto; margin: 0px">
                  <div style="border-radius: 3px;">
                    <ul v-if="displayEdizioni.length > 0 || searching" class="list-group" style="margin: 0px; border-top-left-radius: 3px; border-top-right-radius: 3px;">
                      <li class="list-group-item  form order-li">
                        <div class="col-xs-9" style="padding-right: 0px;">
                          <v-select label="label" :options="orderOptions" v-model="orderReturned" placeholder="Ordina per..." :selectedStyle="{'background-color': 'transparent', border: 'none'}">
                          </v-select>
                        </div>
                        <div class="col-xs-3" style="margin-top: 4px; text-align: right; padding-right: 0px">
                          <a :disabled="orderObject.what == null" class="btn btn-primary btn-sm" @click="toggleOrder"><i class="fa" :class="orderObject.treat == 'string' ? orderObject.asc ? 'fa-sort-alpha-asc' : 'fa-sort-alpha-desc' : orderObject.asc ? 'fa-sort-amount-asc' : 'fa-sort-amount-desc'" aria-hidden="true"></i></a>
                        </div>
                      </li>
                      <!-- LI FINTO E SENZA PAGINAZIONE, replica lo stesso formato dell'elemento ma in una form di ricerca, solo se searching == true -->
                      <li v-if="searching" class="list-group-item media v-middle form">
                        <div class="media-body">
                          <h4 class="media-heading" style="padding-left: 5px; font-style: oblique; color: #42a5f5;">Filtra per:
                            <a href="#" class=" btn btn-sm btn-primary" @click.prevent="applyFilter()" style="float: right; padding: 3px 8px;">
                            <i class="fa fa-search " aria-hidden="true " style="color: white; "></i></a>
                            <a href="#" class=" btn btn-sm btn-warning" @click.prevent="clearFilter()" style="float: right; padding: 3px 8px; margin-right: 5px;">
                            <i class="fa fa-eraser " aria-hidden="true " style="color: white; "></i></a>
                          </h4>
                          <div style="padding: 5px; ">
                            <div class="row" style="margin: 0px; padding: 0px;">
                              <div class="col-xs-3 paddless"><strong>Edizione: </strong></div>
                              <div class="col-xs-9 paddless input"><input type="text" v-model="filtro.edizione" @keydown.enter="applyFilter()" /></div>
                            </div>
                          </div>
                        </div>
                        <div class="media-footer row " style="padding: 0px 5px; margin: 0px; ">
                          <span class="row col-xs-12 col-sm-6" style="margin: 3px 0px 0px 0px; padding: 0px; padding-right: 5px;"><div class="col-xs-12 paddless"><strong>Data Inizio:</strong></div><div class="col-xs-12 paddless filter_datepicker">
                            <datepicker id="dp_inizio"  minimum-view="day" :clear-button="true" placeholder="" v-model="filtro.inizio" format="yyyy-MM-dd" language="it"></datepicker></div></span>
                          <span class="row col-xs-12 col-sm-6" style="margin: 3px 0px 0px 0px; padding: 0px;"><div class="col-xs-12 paddless"><strong>Data Fine:</strong></div><div class="col-xs-12 paddless filter_datepicker">
                            <datepicker id="dp_fine"  minimum-view="day" :clear-button="true" placeholder="" v-model="filtro.fine"format="yyyy-MM-dd" language="it"></datepicker></div></span>
                        </div>
                        <hr style=" margin: 5px 0px; ">
                        <div class="media-footer row " style="padding: 0px 5px; margin: 0px; ">
                          <div class="col-xs-12 " style="padding: 0px; ">
                            <div class="row" style="margin: 0px; padding: 0px;">
                              <div class="col-xs-3 paddless"><strong>Corso: </strong></div>
                              <div class="col-xs-9 paddless input"><input type="text" v-model="filtro.corso" @keydown.enter="applyFilter()" /></div>
                            </div>
                          </div>
                        </div>
                      </li>
                      <!-- EFFETTIVO LOOP SUGLI ELEMENTI CON PAGINAZIONE APPLICATA -->
                      <edition-item v-for="item in displayEdizioni " :item="item " @openDetail="open_detail"></edition-item>
                      <li v-if="displayEdizioni.length == 0 && !do_searching" class="list-group-item media v-middle" style="border-bottom: none;s">Nessun'edizione soddisfa i parametri di ricerca</li>
                    </ul>
                    <ul v-else class="list-group" style="margin: 0px; border-top-left-radius: 3px; border-top-right-radius: 3px;">
                      <li v-if="displayEdizioni.length == 0" class="list-group-item media v-middle" style="border-bottom: none;s">Nessun'edizione soddisfa i parametri di ricerca</li>
                    </ul>
                  </div>
                </div>
              </div>

              <paginazione v-if="edizioni.length> 0" :array="edizioni" limit="5" @displayChanged="dispatchedPagination($event)" :bottom="true" shown="5"></paginazione>
            </div>
          </div>
          <div class="item col-sm-7 col-lg-8 hidden-xs">
            <detail v-if="detailProp" :item="detailProp"></detail>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>
<script>
import {
  loadEditionsMixin
} from './loadEditionsMixin.js';
import EditionItem from './edition-item.vue'
import Detail from './edition-detail-container.vue'
import paginazione from '../components/paginazione.vue'
import datepicker from "vuejs-datepicker"
import vSelect from "../components/vueSelectWrapper/components/Select.vue"

export default {
  mixins: [loadEditionsMixin],
  data: function() {
    return {
      active: null,
      edizioniCollection: null,
      currentParsedCollection: null,
      edizioni: [],
      //L'array con le edizioni selezionate
      displayEdizioni: [],
      labelout: false,
      //variabile che tiene in memoria se e' spuntata la casella date
      //tab di partenza: IN CORSO
      date: true,
      searching: false,
      do_searching: false,

      active_tab: 1,

      orderObject: {
        what: null,
        treat: null,
        asc: null
      },
      orderReturned: null,
      orderOptions: [{
          label: 'Nome Edizione',
          field: 'Edizione',
          treat: 'string'
        }, {
          label: 'Nome Corso',
          field: 'Corso',
          treat: 'string'
        },
        {
          label: 'Data Inizio Edizione',
          field: 'DataInizio',
          treat: 'date'
        }, {
          label: 'Data Fine Edizione',
          field: 'DataFine',
          treat: 'date'
        }
      ],

      filtro: {},
      imgContainer: {},
      detailProp: null
    }
  },
  watch: {
    orderReturned: function() {
      if (!this.orderReturned || !this.orderReturned.field) {
        this.orderReturned = null;
        this.orderObject = {
          treat: null,
          what: null,
          asc: false
        }
      } else {
        this.orderObject = {
          treat: this.orderReturned.treat,
          what: this.orderReturned.field,
          asc: this.orderReturned.treat != 'int'
        }
        this.sort();
      }
    }
  },
  components: {
    paginazione,
    EditionItem,
    datepicker,
    vSelect,
    Detail
  },
  methods: {
    tutti: function() {
      this.searching = false;
      this.date = false;
      //nella funzione getDataFromCollection il codice controlla da quale collection leggere, il filtro data avviene in quel momento
      this.getDataFromCollection();
      this.do_searching = false;
    },
    incorso: function() {
      this.searching = false;
      this.date = true;
      //nella funzione getDataFromCollection il codice controlla da quale collection leggere, il filtro data avviene in quel momento
      this.getDataFromCollection();
      this.do_searching = false;
    },
    cerca: function() {
      this.searching = true;
      this.date = false;
      this.edizioni = [];
      this.displayEdizioni = [];
      this.do_searching = true;
    },
    open_detail: function($event) {
      console.log("opening & caching detail")
      var in_corso = Date.parse(new Date($event.DataFine)) >= Date.parse(new Date())
      var cached_edition = {
        in_corso: in_corso,
        edition: $event
      }
      console.log("SET AGAIN")
      sessionStorage.setItem("cached_edition", JSON.stringify(cached_edition));

      if (this.$root.xs) {
        if ($event.IdEdizione != null) {
          this.$router.push({
            name: 'edition-detail',
            params: {
              idedizione: $event.IdEdizione
            }
          });
        }
      } else {
        this.detailProp = $event
      }
    },
    editionInit: function() {
      this.edizioniCollection = this.$store.getters.getEdizioni;
      for (var i = 0; i < this.edizioniCollection.data.length; i++) {
        var item = this.edizioniCollection.data[i]
        item.Corso = this.find(item)
      }
      this.currentParsedCollection = this.edizioniCollection.addDynamicView('current');
      this.currentParsedCollection.applyWhere(function(obj) {
        var date = Date.parse(obj.DataFine);
        var today = Date.now();
        return date >= today;
      });

      this.edizioni = this.currentParsedCollection.data().slice();

      if(sessionStorage.getItem("cached_edition") != null){
        var e = JSON.parse(sessionStorage.getItem("cached_edition"));
        console.log("found cached edition at")
        console.log(e)
        if(!e.in_corso){
          this.tutti();
        }
        for(var i = 0; this.edizioni.length; i++){
          if(this.edizioni[i].IdEdizione == e.edition.IdEdizione){
            var extract = this.edizioni.splice(i, 1);
            this.edizioni.unshift(extract[0]);
            // trovo l'edizione visitata in precedenza e la sposto in cima alla lista
            console.log("bubbling")
            this.$nextTick(function(){
              //FOCUS FIRST IN CORSO
              this.$nextTick(function(){
                  if(!this.$root.xs){
                    this.active = this.edizioni[0].IdEdizione;
                    this.open_detail(this.edizioni[0])
                  }
              })
            })
            break;
          }
        }
      }
    },
    getDataFromCollection: function() {
      var sourceList;
      if (this.date) {
        //currentParsedCollection è una Dynamic View già filtrata per data corrente
        sourceList = this.currentParsedCollection.data();
      } else {
        sourceList = this.edizioniCollection.data;
      }
      this.edizioni = sourceList.slice();
      if(this.edizioni.length == 0) this.displayEdizioni = []
      console.log(this.displayEdizioni.length)
      this.sort()
    },
    applyFilter: function() {
      var f = this.filtro;
      var inizio,
        fine,
        edition,
        course;

      if (f.inizio) inizio = Date.parse(f.inizio);
      if (f.fine) fine = Date.parse(f.fine);
      if (f.edizione) edition = f.edizione.trim().toLowerCase();
      if (f.corso) course = f.corso.trim().toLowerCase();

      var filtering = function(obj) {
        if (f.inizio && inizio > Date.parse(new Date(obj.DataInizio))) return false;
        if (f.fine && fine < Date.parse(new Date(obj.DataFine))) return false;
        if (Number.isInteger(obj.Edizione)) obj.Edizione = obj.Edizione.toFixed();
        if (f.edizione && (!obj.Edizione || !obj.Edizione.toLowerCase().includes(edition))) return false;
        if (Number.isInteger(obj.Corso)) obj.Corso = obj.Corso.toFixed();
        if (f.corso && (!obj.Corso || !obj.Corso.toLowerCase().includes(course))) return false;
        return true;
      }
      var results = this.edizioniCollection.where(filtering);
      this.do_searching = false;
      this.edizioni = results;
      if (this.edizioni.length == 0) this.displayEdizioni = [];
    },
    clearFilter: function() {
      this.filtro = {};
      $(".filter_datepicker .vdp-datepicker__clear-button").trigger("click")
    },
    toggleOrder: function() {
      this.orderObject.asc = !this.orderObject.asc;
      this.sort();
    },
    sort: function() {
      var field = this.orderObject.what;
      var asc = this.orderObject.asc;
      var treat_as = this.orderObject.treat;
      var f;
      switch (treat_as) {

        case 'string':
          if (asc) {
            f = function(a, b) {
              return a[field] < b[field] ? -1 : 1;
            }
          } else {
            f = function(a, b) {
              return a[field] > b[field] ? -1 : 1;
            }
          }
          break;
        case 'date':
          if (asc) {
            f = function(a, b) {
              return Date.parse(a[field]) - Date.parse(b[field]);
            }
          } else {
            f = function(a, b) {
              return Date.parse(b[field]) - Date.parse(a[field]);
            }
          }
          break;
        case 'int':
          if (asc) {
            f = function(a, b) {
              return a[field] - b[field];
            }
          } else {
            f = function(a, b) {
              return b[field] - a[field];
            }
          }
          break;
      }
      if (f != null) {
        this.edizioni.sort(f);
      }
    },
    find: function(edition) {

      var position = -1;
      for (var i = 0; i < this.corsi.length; i++) {

        if (this.corsi[i].id == edition.Idcorso) {

          position = i;
          break;
        }
      }
      return position == -1 ? null : this.corsi[position].name;
    },
    dispatchedPagination: function(display) {
      this.displayEdizioni = display;
      this.getCompletamenti(display);
      this.getImmaginiCorso(display);
    },
    getImmaginiCorso: function(display) {
      var ids = [];
      for (var i = 0; i < display.length; i++) {
        var idc = display[i].Idcorso;
        if (ids.indexOf(idc) == -1) {
          if (this.imgContainer[idc] == null) {
            //segnalo che sto già eseguendo il fetching img per questo corso, così non lo ripeto inutilmente
            this.imgContainer[idc] = -1;
            ids.push(idc);
          }
        }
      }
      ids = ids.join(';')
      if (ids != '') {
        this.$http.get(localStorage.getItem("path") + "APICorsi?ID=" + ids).then((response) => {
          var res = response.body
          try {
            res = JSON.parse(response.body);
          } catch (err) {}
          ids = ids.split(";");
          if (res.APICorsi) {
            for (var i = 0; i < ids.length; i++) {
              var found = false;
              for (var ii = 0; ii < res.APICorsi.length; ii++) {
                if (res.APICorsi[ii].ID == ids[i]) {
                  if (res.APICorsi[ii].Immagine) {
                    //se nel riferimento di imgContainer c'è il flag -1, ma l'Immagine ritorna null
                    //allora non sovrascrivo -1, così non vengono ripetute chiamate, se tanto so che l'immagine del corso non esiste
                    this.imgContainer[ids[i]] = res.APICorsi[ii].Immagine;
                  } else {
                    //0 significa che l'immagine non è stata trovata
                    this.imgContainer[ids[i]] = 0;
                  }
                }
              }
            }
            for (var i = 0; i < this.$children.length; i++) {
              if ((this.$children[i]).pickImg) {
                this.$children[i].pickImg()
              }
            }
          }
        });
      }
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
.cs.custom_spinner {
  width: 100%;
}
.cs.custom_spinner:before {
  width: 35px;
  height: 35px;
  top: 50px;
}

.order-li {
  margin: 0px;
  background-color: white;
  color: white;
  border-top-left-radius: inherit;
  border-top-right-radius: inherit;
  height: 35px;
  display: inline-table;
  width: 100%;
}

.nav-tabs li.active>a {
  background-color: #42a5f5;
  color: white;
}

.nav-tabs li:hover {
  cursor: pointer;
}

li.form {
  padding: 5px 10px 5px 5px;
  border-left-width: 8px;
  border-left-color: white;
  border-top-color: white;
  border-bottom-color: #eee;
  border-bottom-width: 3px;
  border-left-color: #42a5f5;
  border-bottom-color: #eee !important;
}

li.form h4,
li.form h5 {
  color: inherit;
}

.paddless {
  padding: 0px;
}

.paddless>strong {
  vertical-align: middle;
}

.paddless.input {
  text-align: right;
}

.paddless>input {
  width: 95%;
  text-align: right;
  padding-right: 5px;
}
</style>
<style>
.filter_datepicker .vdp-datepicker__clear-button {
  position: absolute;
  top: 2px;
  right: 10px;
}

.filter_datepicker .vdp-datepicker__calendar {
  position: relative;
  width: 100%;
}

.filter_datepicker .vdp-datepicker input {
  width: 100%;
  text-align: center;
}

.filter_datepicker .selected {
  color: white;
  background-color: #42a5f5 !important;
}

@keyframes custom_spinner {
  to {
    transform: rotate(360deg);
  }
}

.custom_spinner {
  position: relative;
  display: inline-block;
  width: 25px;
}

.custom_spinner:before {
  content: '';
  box-sizing: border-box;
  position: absolute;
  top: 50%;
  left: 50%;
  width: 15px;
  height: 15px;
  margin-top: -12px;
  margin-left: -8px;
  border-radius: 50%;
  border-top: 2px solid rgb(93, 197, 150);
  border-right: 2px solid transparent;
  animation: custom_spinner .7s linear infinite;
}
</style>
