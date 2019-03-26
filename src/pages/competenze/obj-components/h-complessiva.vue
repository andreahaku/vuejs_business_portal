<template>
<div v-if="atLeast" class="item col-xs-12 panel panel-default h-container" style="background-color: rgb(238,238,238);">
  <div class="panel-header h-header">
    <h3 class="text-headline panel-title">{{s.titoloComplessiva[l]}}</h3>
  </div>

  <div v-if="rendVal" class="row col-xs-12 container_complessiva" style="margin-top: 15px; margin-bottom: 25px">
    <div v-if="evalCommentiFinaliValutato != null" class="col-xs-12 comp">
      <strong>{{s.appraiseeNotes[l]}}</strong>
      <textarea class="col-xs-12" rows="3" v-model="commentA" @change="someChanged()" :disabled="evalCommentiFinaliValutato == 'vis'" :class="{'dis': evalCommentiFinaliValutato == 'vis', 'mandatory_failed': failed.commenti_vre}" :maxlength="$root.getMaxLength()"></textarea>
    </div>
    <div class="col-xs-12 col-sm-6 row" style="margin-top: 0px; padding-top: 0px; padding-right: 0px">
      <div v-if="evalCommentiFinaliValutatore != null" class="col-xs-12 comp" style="margin-top: 0px; margin-bottom: 5px;">
        <strong>{{s.appraiserNotes[l]}}</strong>
        <textarea class="col-xs-12" rows="8" v-model="commentC" @change="someChanged()" :disabled="evalCommentiFinaliValutatore == 'vis'" :class="{'dis': evalCommentiFinaliValutatore == 'vis', 'mandatory_failed': failed.commenti_vre}" :maxlength="$root.getMaxLength()"></textarea>
      </div>

    </div>

    <div class="col-xs-12 col-sm-6 row" style="margin-top: 20px; padding: 0px 10px">
      <div v-if="permits.ValutazioneSuggerita == -1" class="col-xs-12 DandW" style="padding: 0px; margin-bottom: 4px;">
        <li class="col-xs-6 list-group-item media v-middle sx">
          <div class="media-body"><span class="text-subhead">{{s.valMedia[l]}}</span></div>
        </li>
        <li class="col-xs-6 list-group-item media v-middle" style="min-height: 35px">
          <div class="media-body dx">
            <span class="text-subhead" v-if="vAverage">{{averageLabel}}</span>
          </div>
        </li>
      </div>
      <!--
                <div v-if="permits.ValutazioneSuggerita == -1" class="col-xs-12 DandW" style="padding: 0px; margin-bottom: 5px;">
                    <li class="col-xs-6 list-group-item media v-middle sx">
                        <div class="media-body"><span class="text-subhead">{{s.valSuggerita[l]}}</span></div>
                    </li>
                    <li class="col-xs-6 list-group-item media v-middle">
                        <div class="media-body dx">
                            <span v-if="vMedia != null" class="text-subhead">{{vMedia.descrizione}}</span>
                        </div>
                    </li>
                </div>
                -->
      <div v-if="evalValutazioneComplessiva != null" class="col-xs-12 comp" style="padding: 0px; margin-top: 0px; margin-bottom: 10px;">
        <strong>{{s.chiefVal[l]}}</strong>
        <div v-if="vals != null" class="select col-xs-12 print_paddless" style="padding: 0px;">
          <span class="arr"></span>
          <select class="col-xs-12" style="padding: 1px; height: 30px;" v-model="vContainer" :class="{'dis': evalValutazioneComplessiva == 'vis', 'mandatory_failed': failed.valutazione}" :disabled="evalValutazioneComplessiva == 'vis'">
                            <option v-for="val in vals" :value="val">{{val.descrizione}}</option>
                        </select>
          <!-- different select -->
        </div>
        <div v-else class="select col-xs-12" style="padding: 0px; background-color: #fff; border: 1px solid #aaa; text-align: center;">
          <clip-loader :loading="vals== null" :color="'rgb(93, 197, 150)'" size="20px"></clip-loader>
        </div>
      </div>
      <div v-if="evalPromoProposal != null" class="col-xs-12 comp" style="padding: 0px; margin-top: 0px; margin-bottom: 0px;">
        <strong>{{s.proposal[l]}}</strong>
        <div v-if="career != null" class="select col-xs-12 print_paddless" style="padding: 0px;">
          <span class="arr"></span>
          <select class="col-xs-12" style="padding: 1px; height: 30px;" v-model="pContainer" :class="{'dis': evalPromoProposal == 'vis', 'mandatory_failed': failed.proposal}" :disabled="evalPromoProposal == 'vis'">
                            <option v-for="role in career" :value="role">{{role.Ruolo}}</option>
                        </select>
          <!-- different select -->
        </div>
        <div v-else class="select col-xs-12" style="padding: 0px; background-color: #fff; border: 1px solid #aaa; text-align: center;">
          <clip-loader :loading="career == null" :color="'rgb(93, 197, 150)'" size="20px"></clip-loader>
        </div>
      </div>
    </div>
    <div v-if="evalRoundTable != null" class="col-xs-12 row" style="margin-top: 0px; padding-top: 0px">
      <div class="col-xs-12 comp">
        <strong>{{s.roundTable[l]}}</strong>
        <textarea class="col-xs-12" rows="3" v-model="rt" @change="someChanged()" :disabled="evalRoundTable == 'vis'" :class="{'dis': evalRoundTable == 'vis', 'mandatory_failed': failed.rt}" :maxlength="$root.getMaxLength()"></textarea>
      </div>
    </div>
  </div>
</div>
</template>
<script>
import ClipLoader from 'vue-spinner/src/ClipLoader.vue'
import {
  eventBus
} from "../../../eventbus.js";

export default {
  mounted: function() {
    console.log(this.evalValutazioneComplessiva)
    this.init();
  },
  created: function() {
    var vm = this;
    var auth = this.permits;
    eventBus.$on("mandatoryFail", function() {
      if (vm.$root.isMandatory(auth["AutovalutazioneComplessiva"])) {
        vm.failed.auto = (vm.a == null);
      }
      if (vm.$root.isMandatory(auth["CommentiFinaliValutato"])) {
        vm.failed.commenti_vto = (vm.commentA == null || vm.commentA == "");
      }
      if (vm.$root.isMandatory(auth["ValutazioneComplessiva"])) {
        vm.failed.valutazione = (vm.v == null);
      }
      if (vm.$root.isMandatory(auth["CommentiFinaliValutatore"])) {
        vm.failed.commenti_vre = (vm.commentC == null || vm.commentC == "");
      }
      if (vm.$root.isMandatory(auth["RuoloProposto"])) {
        vm.failed.proposal = (vm.proposal == null);
      }
      if (vm.$root.isMandatory(auth["CommentiRoundTable"])) {
        vm.failed.rt = (vm.rt == null);
      }
    });
    eventBus.$on("mandatoryReset", function() {
      for (var prop in vm.failed) {
        vm.failed[prop] = false
      }
    });
  },
  components: {
    ClipLoader
  },
  props: {
    aSuggest: Number,
    vAverage: Number,
    vals: Array,
    career: Array,

    valutatore: Boolean,
    stato: Number
  },
  data: function() {
    return {
      s: this.$parent.strings,
      l: this.$parent.itaEng01,
      permits: this.$parent.permessi,

      f: this.$parent.schedaVal,
      admin: this.$parent.admin,

      a: undefined,
      v: undefined,
      proposal: null,
      vContainer: null,
      pContainer: null,
      vMedia: null,
      commentA: '',
      commentC: '',
      rt: '',

      failed: {
        auto: false,
        valutazione: false,
        commenti_vto: false,
        commenti_vre: false,
        proposal: false,
        rt: false
      },

      my_grid_class: '',
      val_grid_class: '',
      numeroMyForm: null,
      numeroValForm: null,

      vSuggest: 0
    }
  },
  watch: {
    vContainer: function() {
      if (this.vblock != true) {
        this.v = this.vContainer.value
        this.someChanged();
      } else {
        this.vblock = false;
      }
    },
    pContainer: function() {
      if (this.pblock != true) {
        this.proposal = this.pContainer.IDRuolo
        this.someChanged();
      } else {
        this.pblock = false;
      }
    },
    vAverage: function() {
      this.vSuggest = Math.floor(this.vAverage);
      console.log(this.vSuggest)
      for (var i = 0; i < this.vals.length; i++) {
        if (this.vSuggest == this.vals[i].indice) {
          this.vMedia = this.vals[i];
        }
      }
    }
  },
  computed: {
    evalAutovalutazioneComplessiva: function() {
      return this.$Ev(this.permits.AutovalutazioneComplessiva);
    },
    evalCommentiFinaliValutato: function() {
      return this.$Ev(this.permits.CommentiFinaliValutato);
    },
    rendMine: function() {
      return false;
      /* ? definitivo? non ci sono i campi per la autovalutazione
      return this.evalAutovalutazioneComplessiva != null || this.evalCommentiFinaliValutato != null;
      */
    },
    evalValutazioneComplessiva: function() {
      return this.$Ev(this.permits.ValutazioneComplessiva);
    },
    evalCommentiFinaliValutatore: function() {
      return this.$Ev(this.permits.CommentiFinaliValutatore);
    },
    evalPromoProposal: function() {
      return this.$Ev(this.permits.RuoloProposto)
    },
    evalRoundTable: function() {
      return this.$Ev(this.permits.CommentiRoundTable)
    },
    rendVal: function() {
      return this.evalValutazioneComplessiva != null ||
        this.evalCommentiFinaliValutatore != null ||
        this.evalCommentiFinaliValutato != null ||
        this.evalPromoProposal != null ||
        this.evalRoundTable != null;
    },
    atLeast: function() {
      return this.rendMine || this.rendVal;
    },
    averageLabel: function() {
      return this.vAverage.toFixed(1);
    }
  },
  methods: {
    init: function() {
      if (this.atLeast) {
        this.a = this.f.Autovalutazione;
        this.v = this.f.IDDecodificaValutazioneGlobaleForzata;
        this.commentA = this.f.CommentiFinaliValutato;
        this.commentC = this.f.CommentiFinaliValutatore;
        this.proposal = this.f.IDRuoloProposto;
        this.rt = this.f.NoteGeneriche3;

        this.fetchVals();
      }
    },
    someChanged: function() {
      if (this.a == 0) {
        this.a = null;
      }
      if (this.v == 0) {
        this.v = null;
      }
      this.$emit('finalChange', {
        Autovalutazione: this.a,
        Valutazione: this.v,
        CommentiFinaliValutato: this.commentA,
        CommentiFinaliValutatore: this.commentC,
        IDRuoloProposto: this.proposal,
        NoteGeneriche3: this.rt
      });
    },
    fetchVals: function() {
      this.vSuggest = Math.floor(this.vAverage)
      console.log(this.vals)
      for (var i = 0; i < this.vals.length; i++) {
        if (this.v == this.vals[i].value) {
          this.vblock = true;
          this.vContainer = this.vals[i];
        }
        if (this.vSuggest == this.vals[i].indice) {
          this.vMedia = this.vals[i];
        }
      }
      for (var i = 0; i < this.career.length; i++) {
        if (this.proposal == this.career[i].IDRuolo) {
          this.pblock = true;
          this.pContainer = this.career[i];
        }
      }
    }
  }
}
</script>
<style>
.rev {
  font-size: 18px;
}
</style>
<style scoped>
.dis {
  background-color: #f5f5f5 !important;
}

textarea {
  overflow-x: hidden;
}

.dx {
  text-align: right;
}

.sx {
  color: white;
  background-color: #888;
}

.DandW .text-subhead {
  font-size: inherit;
}

.DandW .list-group-item {
  padding: 5px;
  margin-bottom: 5px
}

.comp {
  background-color: rgb(238, 238, 238);
  border-width: 0px;
}

.row {
  padding: 0px;
  margin: 5px 0px;
}

.v-header {
  background-color: #888;
  color: white;
  padding: 5px 10px;
  border-radius: inherit;
}

.select {
  font-size: 16px;
  position: relative;
  display: inline-block;
}

.select select {
  outline: none;
  display: block;
  padding: 5px;
  margin: 0;
  background: #fff;
  line-height: normal;
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
}

.avg {
  color: darkgrey;
}

.sugg {
  background-color: white;
  padding: 1px 5px;
  border: solid 1px darkgray;
  color: black;
}

.dishead {
  background-color: rgb(169, 169, 169);
}

.c-v.col-lg-12 {
  padding-left: 0px;
}

textarea {
  resize: vertical;
}
</style>
