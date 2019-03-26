<template>
  <div class="st-pusher" id="content">
    <div class="st-content">
      <div class="st-content-inner padding-none">
        <div class="container-fluid">
          <div class="page-section row">
            <div class="media v-middle col-xs-12">
              <div class="media-body">
                <div class="media-left">
                  <h1 class="text-display-1 margin-none">Partecipante - {{nome_completo}}</h1>
                  <p class="text-subhead" style="margin: 0px; padding-top: 2px;">{{courseTitle}}</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <!-- hanndler panels for mobile table -->
            <div
              v-if="moduli.length == 0 && !loading"
              class="list-group-item paper-shadow animated fadeIn"
              data-z="0.5"
              style="padding: 10px 16px; border-width: 2px;"
            >
              <span>Non ci sono partecipanti per questa edizione</span>
            </div>

            <div
              v-else-if="moduli.length == 0"
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
              :array="moduli"
              :rel="$root.xs ? '40;60' : '30;70'"
              :rows="$root.xs ? 8 : 14"
            ></MobileFriendlyTable>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { loadParticipantMixin } from "./loadParticipantMixin.js";
import ClipLoader from "vue-spinner/src/ClipLoader.vue";
import MobileFriendlyTable from "../_fullDyn/mobileFriendlyTable.vue";

export default {
  mixins: [loadParticipantMixin],
  components: {
    ClipLoader,
    MobileFriendlyTable
  },
  data: function() {
    return {
      titleFilter: "",
      labelout: false,
      courseTitle: "",

      //Mobile Friendly props
      headers: [
        {
          prop: "name",
          label: "Modulo",
          sticked: true,
          treat_as: "string"
        },
        {
          prop: "state",
          label: "Stato",
          treat_as: "string",
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
          prop: "maxscore",
          label: "Punteggio Massimo",
          treat_as: "number",
          width: 80
        }
      ]
    };
  }
};
</script>
<style scoped>
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
