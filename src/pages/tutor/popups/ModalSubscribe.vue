<template>
  <div class="new_modal-mask" v-show="datashow">
    <transition name="new_modal">
      <div class="new_modal-wrapper" v-show="toggleTrans">
        <div class="new_modal-container">
          <div class="new_modal-header">
            <div class="media">
              <div
                class="media-left"
                style="vertical-align: middle; padding-left: 5px; padding-right: 20px;"
              >
                <i class="fa fa-user alert-icon" style="width: 40px; height: 40px;"></i>
              </div>
              <div class="media-body">
                <h4 class="media-heading">Iscrivi Persona</h4>
                <p>Seleziona un nuovo partecipante</p>
              </div>
              <div class="header-buttons">
                <a class="close-button" @click="pre_close()">
                  <i class="fa fa-times" style="text-align: center; position: relative;"></i>
                </a>
              </div>
            </div>
          </div>
          <div class="new_modal-body panel">
            <div class="panel-body">
              <div v-if="loading" class="alert custom_spinner"></div>
              <v-select
                v-else
                label="PERSONA"
                :getOptionLabel="factorLabel"
                :options="persone"
                v-model="selected"
              ></v-select>
            </div>
            <div class="panel-footer">
              <a
                href
                class="btn btn-primary btn-sm"
                :disabled="selected == null"
                @click.prevent="pre_close()"
              >CONFERMA</a>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import { toggleVisibility } from "../../components/alerts/toggleVisibilityAlertMixin.js";
import vSelect from "../../components/vueSelectWrapper/components/Select.vue";

export default {
  mounted: function() {},
  mixins: [toggleVisibility],
  components: {
    vSelect
  },
  data: function() {
    return {
      loading: false,
      persone: [],
      selected: null
    };
  },
  watch: {
    selected: function() {
      console.log(this.selected);
    }
  },
  methods: {
    toggled: function() {
      this.loading = true;
      this.persone = [];
      var testing = true;
      this.$http
        .get(localStorage.getItem("path") + "/APIPersone?IDPERSONA=.")
        .then(
          function(response) {
            var res = response.body;
            try {
              res = JSON.parse(response.body);
            } catch (err) {}
            var people_factory = [];
            if (res && res.APIPersone) {
              people_factory = res.APIPersone;
            } else {
              if (testing) {
                for (var i = 0; i < 100; i++) {
                  people_factory.push({
                    IDPERSONA: chance.integer({ min: 1, max: 9999 }),
                    PERSONA: chance.name({ nationality: "it" }),
                    UO: chance.profession(),
                    RUOLO: chance.profession()
                  });
                }
              }
            }
            this.persone = people_factory.map(function(p) {
              var person = {
                IDPERSONA: p.IDPERSONA,
                PERSONA: p.NOME + " " + p.COGNOME,
                UO: p.UO,
                RUOLO: p.RUOLO
              };
              return person;
            });

            this.loading = false;
          },
          function(err) {
            console.log(err);
            this.loading = false;
          }
        );
    },
    factorLabel: function(p) {
      return p.PERSONA + " - " + p.UO + " - " + p.RUOLO;
    },
    pre_close: function() {
      this.selected = null;
      this.persone = [];
      this.close();
    }
  }
};
</script>
<style scoped>
.new_modal-wrapper a.close-button {
  color: rgb(136, 160, 185);
}
.new_modal-header {
  background-color: rgb(136, 160, 185);
}
</style>