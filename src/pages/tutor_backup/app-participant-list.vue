<template>
  <div class="st-pusher" id="content">
    <div class="st-content">
      <div class="st-content-inner padding-none">
        <div class="container-fluid">
          <div class="page-section row">
            <div class="media v-middle col-xs-12 col-sm-6">
              <div class="media-body">
                <div class="media-left">
                  <h1
                    class="text-display-1 margin-none"
                  >Partecipanti al corso - Edizione {{id_edizione}}</h1>
                  <p class="text-subhead" style="margin: 0px;">Cerca tra i partecipanti</p>
                  <!-- TODO HANDLE TUTOR NAVIGATION !!
                <router-link :to="'/app-take-course/' + id_corso"><button class="button"><span>Vai al corso</span></button></router-link>
                  -->
                </div>
              </div>
            </div>
            <div
              class="media-right col-xs-12 col-sm-6 col-md-4 col-md-offset-2 col-lg-3 col-lg-offset-3"
            >
              <div class="panel panel-default" style="margin: 0px;">
                <div class="panel-body" style="padding-top: 8px; padding-bottom: 8px;">
                  <div class="form-group form-control-material">
                    <input
                      id="filtraed"
                      type="text"
                      class="form-control"
                      placeholder="nome o cognome"
                      v-model="titleFilter"
                      @blur="filterOut()"
                      style="font-size: small;"
                    >
                    <label v-show="!labelout" for="filtraed">Filtra per partecipante...</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <!-- hanndler panels for mobile table -->
            <div
              v-if="persons.length == 0 && !loading"
              class="list-group-item paper-shadow animated fadeIn"
              data-z="0.5"
              style="padding: 10px 16px; border-width: 2px;"
            >
              <span>Non ci sono partecipanti per questa edizione</span>
            </div>

            <div
              v-else-if="persons.length == 0"
              class="list-group-item paper-shadow animated fadeIn"
              data-z="0.5"
              style="padding: 10px 16px; border-width: 2px;"
            >
              <span>Caricamento partecipanti</span>
              <clip-loader :loading="loading" :color="'rgb(93, 197, 150)'" size="12px"></clip-loader>
            </div>
            <MobileFriendlyTable
              v-else
              :headers="headers"
              :array="persons"
              :rel="$root.xs ? '40;60' : '30;70'"
              :rows="$root.xs ? 7 : 12"
            ></MobileFriendlyTable>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { loadParticipantListMixin } from "./loadParticipantListMixin.js";
import ClipLoader from "vue-spinner/src/ClipLoader.vue";
import MobileFriendlyTable from "../_fullDyn/mobileFriendlyTable.vue";

export default {
  mixins: [loadParticipantListMixin],
  data: function() {
    return {
      titleFilter: "",
      labelout: false,

      //Mobile Friendly props
      headers: [
        {
          prop: "name",
          label: "Partecipante",
          clickable: true,
          onClicked: this.routeToPartecipant,
          sticked: true,
          isLead: true,
          treat_as: "string"
        },
        {
          prop: "percent",
          label: "Avanzamento",
          isprogress: true,
          treat_as: "number",
          width: 150
        },
        {
          prop: "access",
          label: "Numero Accessi",
          treat_as: "number",
          width: 80
        },
        {
          prop: "timeprev",
          label: "Tempo Previsto",
          treat_as: "string",
          width: 100
        },
        {
          prop: "timecons",
          label: "Tempo Consuntivo",
          treat_as: "string",
          width: 100
        },
        {
          prop: "timepercent",
          label: "% Prev/Cons",
          treat_as: "number",
          width: 80
        },
        {
          prop: "datefirst",
          label: "Primo Accesso",
          treat_as: "date",
          width: 150
        },
        {
          prop: "datelast",
          label: "Ultima Uscita",
          treat_as: "date",
          width: 150
        },
        {
          prop: "datecompl",
          label: "Data Completamento",
          treat_as: "date",
          width: 150
        },
        {
          prop: "score",
          label: "Punteggio",
          treat_as: "number",
          width: 80
        }
      ]
    };
  },
  watch: {
    titleFilter: function() {
      //vm.titleFilter contiene ciò che ho scritto nel filtro
      var vm = this;
      if (this.titleFilter.trim() != "" && this.persons.length != 0) {
        for (var i = this.persons.length - 1; i >= 0; i--) {
          if (
            !this.persons[i].name
              .toUpperCase()
              .includes(vm.titleFilter.toUpperCase()) &&
            !this.persons[i].client
              .toUpperCase()
              .includes(vm.titleFilter.toUpperCase())
          ) {
            this.persons.splice(i, 1);
          }
        }
      } else {
        //Lo resetto dall'inizio
        this.persons = this.personsFilter.slice();
      }
    }
  },
  methods: {
    filterOut: function() {
      if (this.titleFilter != "") {
        this.labelout = true;
      } else {
        this.labelout = false;
      }
    },
    routeToPartecipant: function(obj) {
      this.$router.push({
        name: "participant",
        params: {
          id: obj.id_part
        }
      });
    }
  },
  components: {
    ClipLoader,
    MobileFriendlyTable
  }
};
</script>
<style scoped>
#cliente {
  font-size: 12px;
}

h1 {
  font-size: 30px;
}

.button {
  border-radius: 4px;
  background-color: #3399ff;
  border: none;
  color: #ffffff;
  text-align: center;
  font-size: 14px;
  padding: 5px;
  width: 150px;
  transition: all 0.5s;
  cursor: pointer;
  margin: 5px;
  margin-left: 0px;
}

.button span {
  cursor: pointer;
  display: inline-block;
  position: relative;
  transition: 0.5s;
}

.button span:after {
  content: "\00bb";
  position: absolute;
  opacity: 0;
  top: 0;
  right: -20px;
  transition: 0.5s;
}

.button:hover span {
  padding-right: 25px;
}

.button:hover span:after {
  opacity: 1;
  right: 0;
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
.v-spinner {
  display: initial;
  padding: 0px 2px;
}

.tutor_cell {
  border-style: solid;
  border-width: 1px;
  border-color: white;
  background-color: #42a5f5;
  cursor: pointer;
  font-size: smaller;
  /*
  display: table;
  table-layout: fixed;
  */
  height: 55px;
  text-align: left;
  padding: 4px 4px 4px 6px !important;
}

.header-label {
  /*
  display: table-cell;
  vertical-align: middle;
  */
  text-overflow: ellipsis;
  overflow-x: hidden;
}

.tutor_cell_wrapper {
  margin: 0px;
  background-color: transparent;
  color: white;
  border-radius: 2px;
  border-top-width: 0px;
  border-bottom-width: 0px;
}
</style>
