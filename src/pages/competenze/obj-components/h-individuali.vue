<template>
<div v-if="atLeast" class="item col-xs-12 panel panel-default h-container break" id="individuali">
  <div class="panel-header h-header">
    <h3 class="text-headline panel-title">{{s.titoloIndividuali[l]}}</h3>
  </div>
  <div v-for="(goal, index) in goals" class="col-xs-12 goal" v-if="ctrArray[index].active">
    <h5 v-if="evalDescrizioneObiettivo != null" class="text-subhead" style="margin: 5px 10px 15px 10px; font-size: 1.84rem;
            padding: 8px 5px; background-color: #bbb; border: solid 1px #888;">{{goal.Indicatore}}</h5>

    <div v-if="evalDescrizioneObiettivo != null" class="panel-body h-body col-xs-12 col-sm-6" style="padding: 0px 10px;" :class="[evalDescrizioneKPI == null ? 'col-lg-8' : 'col-lg-6']">
      <!--
                <h5 class="text-subhead" style="margin: 5px 0px 15px 0px; font-size: 1.84rem;">{{goal.Indicatore}}</h5>
                -->

      <span>
                    <div v-if="evalDescrizioneObiettivo == 'vis'" class="panel panel-default obb" v-html="goal.DescrizioneIndicatore"
                    style="background-color: transparent; padding-left: 0px;"></div>
                    <textarea v-else class="texa" v-model="goal.DescrizioneIndicatore" rows="3" @change="update(index)"
                    :maxlength="$root.getMaxLengthKPI()" :class="{'mandatory_failed': failed[index].indicatore}"></textarea>
                </span>
    </div>
    <div v-if="evalDescrizioneKPI != null" class="panel-body h-body col-xs-12 col-sm-6 col-lg-3" :class="{'side-0': !$root.xs}" style="margin-bottom: 10px">
      <h5 class="text-subhead" style="margin: 5px 0px;">
                    <span>{{s.kpi[l]}}</span></h5>
      <div v-if="evalDescrizioneKPI == 'vis'" class="panel panel-default obb">{{goal.NoteObiettivo}}</div>
      <textarea v-else class="texa" v-model="goal.NoteObiettivo" rows="2" @change="update(index)" :maxlength="$root.getMaxLength()" :class="{'mandatory_failed': failed[index].note}"></textarea>
    </div>

    <!--   -->
    <div class="col-xs-12 col-sm-6" :class="[evalDescrizioneKPI == null ? 'col-lg-4' : 'col-lg-3']" style="padding: 0px 10px;">

      <div v-if="evalDataTermine != null" class="col-xs-12 DandW" style="padding: 0px">
        <li class="col-xs-6 list-group-item media v-middle sx">
          <div class="media-body"><span class="text-subhead">{{s.dataTarget[l] +' '}}</span></div>
        </li>
        <li class="col-xs-6 list-group-item media v-middle">
          <div :id="'parent'+index" class="media-body dx" :class="{'ie': isIE}">

            <i v-if="evalDataTermine == 'mod'" class="fa fa-times printden" aria-hidden="true" style="position: absolute; right: 5px; color: #999;" @click="deleteObs(index)"></i>
            <span v-if="evalDataTermine == 'vis'" class="text-subhead">{{goal.DataObiettivo}}</span>
            <datepicker v-else :date="{time: goals[index].DataObiettivo}" @change="tac(index, $event)" :option="option"></datepicker>
          </div>
        </li>
      </div>
      <div v-if="evalPeso != null" class="col-xs-12 DandW" style="padding: 0px">
        <li class="col-xs-6 list-group-item media v-middle sx">
          <div class="media-body"><span class="text-subhead">{{s.weight[l] +' '}}</span></div>
        </li>
        <li class="col-xs-6 list-group-item media v-middle" :class="{'danger': percOk == -1, 'success': percOk == 1, 'mandatory_failed': failed[index].peso}">
          <div class="media-body dx">
            <span v-if="evalPeso == 'vis'" class="text-subhead span_weight">{{goal.Peso}}</span>
            <span v-else><input :id="'weight'+index" type="number" min=0 max=100 style="margin-right: 5px" :class="{'danger': percOk == -1, 'success': percOk == 1}" v-model="goal.Peso" @change="upPerc(index)"></span>
            <span class="perc_label printden">%</span>
          </div>
        </li>
      </div>
    </div>
    <span v-if="showFormValutazione">
                <valutazione v-if="rendMine" @valChange="up( index, 0, $event)" @levChange="up( index, 2, $event)" :auto="true"
                :obj="valutazioni[index][0]" :rating="evalAutovalutazione" :commenti="evalCommentiValutato" :note="evalNotePersonaValutata"></valutazione>
                <valutazione v-if="rendVal" @valChange="up( index, 1, $event)" @levChange="up( index, 3, $event)" :obj="valutazioni[index][1]"
                :auto="false" :rating="evalValutazione" :commenti="evalCommentiValutatore" :note="evalNoteValutatore"></valutazione>
            </span>
  </div>
</div>
</div>
</template>
<script>
import valutazione from './h-valutazione.vue'
import datepicker from 'vue-datepicker'
import {
  eventBus
} from "../../../eventbus.js";

export default {
  mounted: function() {
    this.$nextTick(function() {
      this.init();
      this.$nextTick(function() {
        for (var i = 0; i < this.goals.length; i++) {
          var selector = "#parent" + i + " input";
          this.attach(i);
        }
      });
    })
  },
  created: function() {
    var vm = this;
    var auth = this.permits;
    eventBus.$on("mandatoryFail", function() {
      for (var i = 0; i < vm.goals.length; i++) {
        if (vm.$root.isMandatory(auth["DescrizioneObiettivo"])) {
          vm.failed[i].indicatore = (vm.goals[i].DescrizioneIndicatore == null);
        }
        if (vm.$root.isMandatory(auth["DescrizioneKPI"])) {
          vm.failed[i].note = (vm.goals[i].NoteObiettivo == null);
        }
        if (vm.$root.isMandatory(auth["DataTermine"])) {
          vm.failed[i].data = (vm.goals[i].DataObiettivo == null);
        }
        if (vm.$root.isMandatory(auth["Peso"])) {
          vm.failed[i].peso = (vm.goals[i].Peso == null);
        }
      }
    });
    eventBus.$on("mandatoryReset", function() {
      for (var i = 0; i < vm.failed.length; i++) {
        for (var prop in vm.failed[i]) {
          vm.failed[prop] = false
        }
      }
    });
  },
  props: {
    valutatore: Boolean,
    stato: Number
  },
  data: function() {
    return {
      s: this.$parent.strings,
      l: this.$parent.itaEng01,
      admin: this.$parent.admin,
      individuali: this.$parent.goalInd,
      permits: this.$parent.permessi,

      showVal: false,
      disableVal: false,
      insertNote: false,
      mt: false,
      finale: false,

      failed: [],
      goals: [],
      valutazioni: [],
      atLeast: false,

      //DATEPICKER OPTIONS
      option: {
        type: 'day',
        week: [],
        month: [],
        format: 'YYYY-MM-DD',
        placeholder: 'Nessuna',
        inputStyle: {
          'text-align': 'center',
          'display': 'inline-block',
          'line-height': '22px',
          'font-size': '13px',
          'border': '#fff',
          'border-radius': '2px',
          'color': '#5F5F5F'
        },
        color: {
          header: '#42a5f5',
          headerText: '#ffffff'
        },
        buttons: {
          ok: 'Ok',
          cancel: 'Cancel'
        },
        overlayOpacity: 0.5, // 0.5 as default
        dismissible: true // as true as default
      },
      isIE: /*@cc_on!@*/ false || !!document.documentMode,

      percOk: 0,

      ctrArray: []
    }
  },
  components: {
    valutazione,
    datepicker
  },
  watch: {},
  methods: {
    // TODO get status from parent
    deleteObs: function(index) {
      if (this.goals[index].DataObiettivo != null && this.goals[index].DataObiettivo != "Nessuna") {
        this.goals[index].DataObiettivo = null;
        this.update(index, false);
        var selector = "#parent" + index + " input";
        $(selector).val("Nessuna")
      }
    },
    getOStrings: function() {
      this.option.month = [this.s.months[0][this.l], this.s.months[1][this.l], this.s.months[2][this.l], this.s.months[3][this.l], this.s.months[4][this.l], this.s.months[5][this.l], this.s.months[6][this.l], this.s.months[7][this.l], this.s.months[
        8][this.l], this.s.months[9][this.l], this.s.months[10][this.l], this.s.months[11][this.l]];
      this.option.week = [this.s.week[0][this.l], this.s.week[1][this.l], this.s.week[2][this.l], this.s.week[3][this.l], this.s.week[4][this.l], this.s.week[5][this.l], this.s.week[6][this.l]];
      this.option.buttons.cancel = this.s.annulla[this.l];
    },
    attach: function(index) {
      var selector = "#parent" + index + " input";
      $(selector).val(this.goals[index].DataObiettivo)
      var g = this.goals
      $(selector).on("blur", function() {
        if ($(selector).val() === "") {
          $(selector).val(g[index].DataObiettivo);
        }
      })
      $(selector).on("focus", function() {
        if ($(selector).val() === "") {
          $(selector).val(g[index].DataObiettivo);
        }
      })
    },
    init: function() {
      this.ctrArray = [];
      this.getOStrings();
      this.goals = this.goals.concat(this.individuali);
      this.failed = [];
      for (var i = 0; i < this.goals.length; i++) {
        this.failed.push({
          indicatore: false,
          note: false,
          data: false,
          peso: false
        });
      }

      var some = false;
      for (var i = 0; i < this.goals.length; i++) {
        if (this.goals[i].DataObiettivo == null) {
          this.goals[i].DataObiettivo = 'Nessuna';
        }
        if (this.goals[i].Peso == null) {
          this.goals[i].Peso = 0;
        }
        var obj = {
          active: false
        };
        try {
          if (this.permits.MostraObbiettiviNonDefiniti == -1 ||
            (this.goals[i].NoteObiettivo && this.goals[i].NoteObiettivo.trim() != "") ||
            (this.goals[i].DescrizioneIndicatore && this.goals[i].DescrizioneIndicatore.trim() != "")) {
            obj.active = true;
            some = true;
          }
        } catch (err) {
          console.log("Caught Error in h-indiv. init(): show which editables")
          console.log("err")
        }
        this.ctrArray.push(obj);
      }

      for (var i = 0; i < this.goals.length; i++) {
        try {
          var d = new Date(this.goals[i].DataObiettivo);
          if (d == "Invalid Date") {
            this.goals[i].DataObiettivo = "Nessuna";
          } else {
            this.goals[i].DataObiettivo = d.toLocaleDateString();
          }

        } catch (err) {
          this.goals[i].DataObiettivo = "Nessuna";
        }

        //push new field into valutazione
        this.valutazioni.push([{
          commento: this.goals[i].CommentiFinaliValutato,
          nota: this.goals[i].NoteFinaliValutato,
          requisito: this.goals[i].IDRequisito,
          valutazione: this.goals[i].LivelloRequisitoAutovalutato,
          allow: this.goals[i].PermettiNonApplicabile == -1,
          non_applicabile: this.goals[i].NonApplicabileAutovalutato
        }, {
          commento: this.goals[i].CommentiFinaliValutatore,
          nota: this.goals[i].NoteFinaliValutatore,
          requisito: this.goals[i].IDRequisito,
          valutazione: this.goals[i].LivelloRequisito,
          allow: this.goals[i].PermettiNonApplicabile == -1,
          non_applicabile: this.goals[i].NonApplicabileValutato
        }]);
        console.log(this.valutazioni)

      }

      this.atLeast = some && this.evalDescrizioneObiettivo ? true : false;
    },
    up: function(o, ind, $event) {

      switch (ind) {
        //override informazioni per livello requisito
        case 2:
          this.goals[o].LivelloRequisitoAutovalutato = $event.obj.valutazione;
          this.goals[o].CommentiFinaliValutato = $event.obj.commento;
          this.goals[o].NoteFinaliValutato = $event.obj.nota;
          this.goals[o].NonApplicabileAutovalutato = $event.obj.non_applicabile;
          break;
        case 3:
          this.goals[o].LivelloRequisito = $event.obj.valutazione;
          this.goals[o].CommentiFinaliValutatore = $event.obj.commento;
          this.goals[o].NoteFinaliValutatore = $event.obj.nota;
          this.goals[o].NonApplicabileValutato = $event.obj.non_applicabile;
          break;
        default:
          console.log('no obb. matched');
      }

      this.update(o, $event.isVal);
    },
    tac(index, $event) {
      this.goals[index].DataObiettivo = $event;
      this.update(index, false);
    },
    checkPerc() {
      var s = 0;
      for (var i = 0; i < this.goals.length; i++) {
        s += this.goals[i].Peso;
      }
      if (s === 100) {
        this.percOk = 1;
      } else {
        this.percOk = -1;
      }
    },
    upPerc(index) {
      var val = this.goals[index].Peso;

      if (val < 0 || val > 100) {
        this.goals[index].Peso = 0;
        var selector = "#weight" + index;
        $(selector).val(0)
      } else {
        this.checkPerc();
      }
      this.update(index);
    },
    update: function(index, isVal) {
      this.$emit('indChange', {
        obj: this.goals[index],
        index: index,
        isVal: isVal
      });
    }
  },
  computed: {
    //COMP. INTESTAZIONE
    evalDescrizioneObiettivo: function() {
      return this.$Ev(this.permits.DescrizioneObiettivo);
    },
    evalDescrizioneKPI: function() {
      return this.$Ev(this.permits.DescrizioneKPI);
    },
    evalDataTermine: function() {
      return this.$Ev(this.permits.DataTermine);
    },
    evalPeso: function() {
      return this.$Ev(this.permits.Peso);
    },
    //COMP FORM VALUTAZIONE
    evalAutovalutazione: function() {
      return this.$Ev(this.permits.Autovalutazione);
    },
    evalCommentiValutato: function() {
      return this.$Ev(this.permits.CommentiValutato);
    },
    evalNotePersonaValutata: function() {
      return this.$Ev(this.permits.NotePersonaValutata);
    },
    rendMine: function() {
      return this.evalAutovalutazione != null ||
        this.evalCommentiValutato != null ||
        this.evalNotePersonaValutata != null;
    },
    evalValutazione: function() {
      return this.$Ev(this.permits.Valutazione);
    },
    evalCommentiValutatore: function() {
      return this.$Ev(this.permits.CommentiValutatore);
    },
    evalNoteValutatore: function() {
      return this.$Ev(this.permits.NoteValutatore);
    },
    rendVal: function() {
      return this.evalValutazione != null ||
        this.evalCommentiValutatore != null ||
        this.evalNoteValutatore != null;
    },
    showFormValutazione: function() {
      return this.rendMine || this.rendVal;
    }
  }
}
</script>
<style scoped>
.side-0 {
  padding-right: 10px;
}

.obb {
  padding: 5px 0px 5px 5px;
  border-color: rgb(238, 238, 238);
  min-height: 40px;
  margin-bottom: 10px;
}

.texa {
  width: 100%;
  padding: 5px 10px;
  /* border-right-width: 10px; */
  border-color: rgb(238, 238, 238);
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

input {
  width: 100%;
  height: 23px;
  box-sizing: border-box;
  border-width: 0px;
  border-color: darkgray;
  border-radius: 3px;
  text-align: right;
}

input[type="number"] {
  width: 85%;
}

input:focus {
  border-width: 1px;
}

.rev {
  padding: 0px;
}

.goal {
  padding: 0px;
  padding-bottom: 10px;
  padding-top: 10px;
  background-color: rgb(238, 238, 238);
  border-bottom: 1px solid #999;
}

.goal-end {
  padding: 0px;
  padding-top: 10px;
  background-color: rgb(238, 238, 238);
}

textarea {
  resize: vertical;
}

.success {
  background-color: #dff0d8;
  border-color: #d6e9c6;
}

.success span {
  color: #3c763d;
}

.danger {
  background-color: #f2dede;
  border-color: #ebccd1;
}

.danger span {
  color: #a94442;
}
</style>
<style>
.cov-date-body {
  font-family: 'Roboto', 'Helvetica Neue', Helvetica, Arial !important;
  font-weight: 100 !important;
  display: inline-block !important;
  border-width: 10px;
  border-style: solid;
  border-color: rgba(0, 0, 0, 0.5);
}

.day.checked {
  background-color: #888 !important;
}

.ie .datepicker-overlay {
  top: auto !important;
  left: auto !important;
}

.datepickbox>input {
  text-align: right;
}
</style>
