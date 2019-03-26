<template>
  <div class="st-pusher" id="content">
    <div class="st-content">
      <div class="st-content-inner padding-none">
        <div class="container-fluid" id="pagina">
          <br>

          <div class="row">
            <div class="item col-xs-12 col-lg-6">
              <div v-for="componente in show_sx">
                <component
                  :is="componente.nome"
                  :valutatore="componente.valutatore"
                  :dash="true"
                  :perpagina="2"
                ></component>
                <br>
              </div>
            </div>
            <div class="item col-xs-12 col-lg-6">
              <div v-for="componente in show_dx">
                <component
                  :is="componente.nome"
                  :valutatore="componente.valutatore"
                  :dash="true"
                  :perpagina="2"
                ></component>
                <br>
              </div>
            </div>
          </div>
        </div>
      </div>
      <sidejsonly :default="true"></sidejsonly>
    </div>
  </div>
</template>
<script>
import imieicorsi from "./components/i-miei-corsi.vue";
import documenti from "./components/documenti.vue";
import attivitaforum from "./components/attivita-forum.vue";
import ricerca from "./components/ricerca.vue";
import featured from "./components/featured.vue";
import ricercapartecipazioni from "./components/ricerca_partecipazioni.vue";

import rubrica from "./components/rubrica.vue";
import sidejsonly from "./components/side-default-jsonly.vue";

import widgetreceived from "./feedback/widget-received.vue";
import widgetgiven from "./feedback/widget-given.vue";

import widgetgoal from "./goal/widget-goal.vue";
import ricercagoal from "./goal/ricerca-goal.vue";

import widgeteval from "./competenzeHIT/widget-da-valutare.vue";
import widgetricerca from "./competenzeHIT/ricerca-admin.vue";

import { eventBus } from "../eventbus.js";

export default {
  mounted() {
    this.$nextTick(function() {
      if (
        localStorage.getItem("TokenScaduto") ||
        this.$root.lsGet("configs") == null
      ) {
        eventBus.$emit("alert", "Sessione scaduta");
      }
      this.init();
    });
  },
  components: {
    appMieiCorsi: imieicorsi,
    appDocumenti: documenti,
    appAttivitaForum: attivitaforum,
    appRicerca: ricerca,
    appRubrica: rubrica,
    appFeatured: featured,
    appWidgetReceived: widgetreceived,
    appWidgetGiven: widgetgiven,
    appWidgetGoal: widgetgoal,
    appRicercaGoal: ricercagoal,
    appWidgetEval: widgeteval,
    appWidgetRicerca: widgetricerca,
    appRicercaPartecipazioni: ricercapartecipazioni,

    sidejsonly
  },
  //BEGIN TESTING
  data: function() {
    return {
      result: "result",
      colonna_dx: [],
      colonna_sx: [],

      show_dx: [],
      show_sx: []
    };
  },
  methods: {
    init: function() {
      var configs = this.$root.getDashConfig();
      this.colonna_dx = configs.dx;
      this.colonna_sx = configs.sx;
      this.show_dx = this.colonna_dx.filter(function(mod) {
        return mod.visibile && mod.abilitato;
      });
      this.show_sx = this.colonna_sx.filter(function(mod) {
        return mod.visibile && mod.abilitato;
      });
    }
  }
};
//END TESTING
</script>
<style>
h4,
h5,
p,
a.text-subhead {
  font-weight: 300 !important;
}

strong {
  font-weight: 500 !important;
}

/*
#pagina {
    background-color: #eee !important;
}
*/
</style>
