<template>
<div>
  <div v-if="!valutatore" class="col-xs-12" style="padding: 0px;">
    <h5 class="text-headline" style="margin-top:2px;">{{s.ricercaGoal[l]}}</h5>
  </div>
  <div v-else>
    <span>
                <h4 class="text-headline margin-none" style="margin-top:2px;">{{s.goalDaValutare[l]}}</h4>
                <p class="text-subhead text-light">{{s.subGoal[l]}}</p>
            </span>
  </div>
  <div class="col-xs-12 panel panel-default animated fadeIn" style="margin-bottom: 10px;">
    <div class="panel-body padding-bottom-none">
      <div class="row">
        <div class="col-xs-12 col-sm-6" style="margin-bottom:10px;">
          <div class="form-group form-control-material">
            <input type="text" class="form-control" :placeholder="s.cognomePlace[l]" @blur="filterOut_cognome()" @focus="focusText()" v-model="cognome" @keydown.enter="filtra()" />
            <label :class="{condati: labelout_cognome}">{{s.cognomeForm[l]}}</label>
          </div>
        </div>
        <div class="col-xs-12 col-sm-6" style="margin-bottom:10px;">
          <div class="form-group form-control-material">
            <input type="text" class="form-control" :placeholder="s.nomePlace[l]" @blur="filterOut_nome()" @focus="focusText()" v-model="nome" @keydown.enter="filtra()" />
            <label :class="{condati: labelout_nome}">{{s.nomeForm[l]}}</label>
          </div>
        </div>

        <!--
                    -->

        <div id="yearpicker" class="hidden-xs col-sm-3" style="padding-top: 6px;">
          <div style="text-align: right">{{s.modelloScheda[l]}}: </div>
        </div>
        <div id="yearpicker" class="visible-xs-block col-xs-12">
          <div>{{s.modelloScheda[l]}}: </div>
        </div>
        <div class="col-xs-12 col-sm-9" style="margin-bottom: 12px;">
          <button class="btn btn-default btn-filtro" type="button" @click="opentype()" style="width: 100%; background-color: white; padding: 8px 0px 8px 16px;">
                            <span style="padding-left: 5px;">
                            <span>{{activeType}}</span></span><span class="caret" style="margin: 7px 10px 0px 5px; float: right;"></span></button>
          <ul v-if="opentypedd" class="dropdown-menu" style="width: 100%; text-align: center; display: block;">
            <li v-for="t in types" :class="{'active': filtro.tipo == t.val}">
              <a href="#" @click="typeChange(t)">{{t.desc}}</a>
            </li>
          </ul>
        </div>

        <span v-if="statusFiltered.length > 0">
                        <div id="yearpicker" class="hidden-xs col-sm-3" style="padding-top: 7px;">
                            <div style="text-align: right">{{s.stato[l]}}:</div>
                        </div>
                         <div id="yearpicker" class="visible-xs-block col-xs-12">
                            <div>{{s.stato[l]}}:</div>
                        </div>
                        <div class="col-xs-12 col-sm-9" v-if="statusFiltered.length > 0" style="margin-bottom: 12px;">
                            <button class="btn btn-default btn-filtro" type="button" @click="openstat()"
                            style="width: 100%; background-color: white; padding: 8px 0px 8px 16px;">
                                <span style="padding-left: 5px;">
                                <span>{{activeStatus}}</span></span><span class="caret" style="margin: 7px 10px 0px 5px; float: right;"></span></button>
        <ul v-if="openstatdd" class="dropdown-menu" style="width: 100%; text-align: center; display: block;">
          <li v-for="s in statusFiltered" :class="{'active': filtro.status == s.IDStato}">
            <a href="#" @click="statChange(s)">{{s.Descrizione}}</a>
          </li>
        </ul>
      </div>
      </span>

      <div id="yearpicker" class="hidden-xs col-sm-3" style="padding-top: 7px;">
        <div style="text-align: right">{{s.labelPeriod[l]}}:</div>
      </div>
      <div id="yearpicker" class="visible-xs-block col-xs-12">
        <div>{{s.labelPeriod[l]}}:</div>
      </div>
      <div id="yearpicker" class="col-xs-12 col-sm-9" style="margin-bottom: 12px;">
        <datepicker minimum-view="year" v-model="filtro.anno" :clear-button="true" :placeholder="s.qualsiasi[l].toUpperCase()" format="yyyy"></datepicker>
      </div>

      <div class="col-xs-12" style="text-align: right; margin: 10px 0px;">
        <a href="#" @click.prevent="filtra()" class="btn btn-sm btn-primary paper-shadow relative">{{s.cerca[l]}}</a>
      </div>
    </div>
  </div>
</div>
<widgetgoal :filtro="filtro" :flag="flag" :valutatore="valutatore"></widgetgoal>
</div>
</template>
<script>
import widgetgoal from "./widget-goal.vue"
import datepicker from "vuejs-datepicker"

export default {
  mounted: function() {
    /* ---- IF previous filter detected, force search ---- */
    this.getAllStatus();
    var prev = null;
    try {
      prev = JSON.parse(this.$root.lsGet("prevFtr"));
      if (prev != null) {
        var previous = localStorage.getItem('prevVisited');
        previous = previous.split('/')[1];
        if (previous == 'scheda-impiegato' || previous == 'scheda-goal') {
          this.nome = prev.nome;
          this.cognome = prev.cognome;
          this.filtro.tipo = prev.tipo;
          this.filtro.status = prev.status;
          if (prev.anno != null) {
            this.filtro.anno = new Date(prev.anno);
          }

          this.filterOut_nome();
          this.filterOut_cognome();
          this.types.some(function(t) {
            if (t.val == this.filtro.tipo) {
              this.activeType = t.desc;
              return true;
            }
          }, this)
          this.filtra()

        } else {
          localStorage.removeItem('prevFtr');
        }
      }
    } catch (err) {
      console.log("Error parsing previous filter")
      console.log(err)
      localStorage.removeItem('prevFtr');
    }
  },
  //valutatore true, supervisore false
  props: {
    valutatore: Boolean
  },
  components: {
    widgetgoal,
    datepicker
  },
  created: function() {
    this.types = [{
        val: -1,
        desc: this.s.qualsiasi[this.l]
      },
      {
        val: 1,
        desc: 'MBO'
      },
      {
        val: 2,
        desc: 'Performance'
      }
    ];
    this.activeType = this.types[0].desc;
  },
  data: function() {
    return {
      labelout_nome: false,
      labelout_cognome: false,

      nome: '',
      cognome: '',
      flag: false,
      filtro: {
        nome: '',
        cognome: '',
        tipo: -1,
        status: -1,
        anno: null
      },
      activeType: '',
      types: [],

      s: this.$root.getStrings(),
      l: this.$root.lang(),

      statusArray: [],
      statusFiltered: [],
      activeStatus: '',

      opentypedd: false,
      openstatdd: false
    }
  },
  watch: {
    'filtro.anno': function() {
      console.log(this.filtro.anno)
    }
  },
  methods: {
    year: function($event) {
      console.log($event);
    },
    focusText: function() {
      this.openstatdd = false;
      this.opentypedd = false;
    },
    opentype: function() {
      this.opentypedd = !this.opentypedd;
      this.openstatdd = false;
    },
    openstat: function() {
      this.openstatdd = !this.openstatdd;
      this.opentypedd = false;
    },
    typeChange: function(t) {
      this.opentypedd = false;
      this.filtro.tipo = t.val;
      this.activeType = t.desc;
      this.filtro.status = -1;
      this.filterStatus();
    },
    statChange: function(s) {
      this.openstatdd = false;
      this.filtro.status = s.IDStato;
      this.activeStatus = s.Descrizione;
    },
    filterOut_nome: function() {
      if (this.nome.trim() != '') {
        this.labelout_nome = true;
      } else {
        this.labelout_nome = false;
      }
    },
    filterOut_cognome: function() {
      if (this.cognome.trim() != '') {
        this.labelout_cognome = true;
      } else {
        this.labelout_cognome = false;
      }
    },
    filtra: function() {
      this.opentypedd = false;
      this.openstatdd = false;
      this.filtro.nome = this.nome;
      this.filtro.cognome = this.cognome;
      try {
        this.$root.lsSet("prevFtr", JSON.stringify(this.filtro));
      } catch (err) {
        console.log("Error stringifying previous filter")
        console.log(err)
      }
      this.flag = !this.flag;
    },
    filterStatus: function() {
      if (this.filtro.tipo == -1) {
        this.statusFiltered = [];
        this.filtro.status = -1;
      } else {
        this.statusFiltered = [{
          IDStato: -1,
          Descrizione: this.s.qualsiasi[this.l]
        }];
        this.statusFiltered = this.statusFiltered.concat(this.statusArray.filter(function(s) {
          return s.IDTipologiaValutazione == this.filtro.tipo;
        }, this))
      }
      if (this.filtro.status != null) {
        this.statusFiltered.some(function(s) {
          if (s.IDStato == this.filtro.status) {
            this.activeStatus = s.Descrizione;
            return true;
          }
        }, this)
      }
    },
    getAllStatus: function() {
      this.$http.get(localStorage.getItem('path') + '/APIStatiValutazione?IDStato=.')
        .then(function(response) {
          try {
            var res = response.body
            try {
              var res = JSON.parse(response.body);
            } catch (err) {}

            if (res && res.APIStatiValutazione) {
              res = res.APIStatiValutazione;

              res.sort(function(a, b) {
                if (a.Sequenza && b.Sequenza && (a.Sequenza != b.Sequenza)) {
                  return a.Sequenza - b.Sequenza;
                } else {
                  return a.Descrizione < b.Descrizione ? -1 : 1;
                }
              })
              console.log(res)
            } else {
              res = []
            }

            this.statusArray = res;
          } catch (err) {
            this.statusArray = [];
          }
          this.filterStatus();
        });
    }
  }
}
</script>
<style>
#yearpicker input {
  width: 100%;
  padding: 5px 0px;
  text-align: center
}

#yearpicker .vdp-datepicker__clear-button {
  position: absolute;
  top: 2px;
  right: 10px;
}

#yearpicker .vdp-datepicker__calendar {
  width: 100%;
}

#yearpicker .selected {
  color: white;
  background-color: #42a5f5;
}
</style>
