<template>
<div class="st-pusher" id="content">
  <div class="st-content">
    <div class="st-content-inner padding-none" id="inner">
      <div v-if="loading" class='uil-rolling-css' style='transform:scale(0.71);
                position: absolute; margin: 0 auto; top: 100px; right: 0px; left: 0px;'>
        <div>
          <div></div>
          <div></div>
        </div>
      </div>
      <div v-else class="container-fluid" id="elt" style="padding-top: 10px;">
        <alertchoice :show="showModal" :mess="message" @done="handleChoice"></alertchoice>

        <anagrafica v-if="stato!=null" :stato="stato" :valutatore="valutatore" :approvatore="approvatore" @mandatoryCheck="mandatoryCheck($event)" @changeStatus="updateStatus($event)" @further="furtherChange"></anagrafica>
        <cascading v-if="stato!=null"></cascading>
        <individuali v-if="stato!=null" :valutatore="valutatore" :stato="stato" @indChange="indChange"></individuali>
        <competenza v-if="stato!=null" :valutatore="valutatore" :stato="stato" v-for="(item, index) in otherGoals" :obj="item" @compChange="otherChange($event, index)"></competenza>

        <div class="break_page"></div>
        <azioni v-if="stato!=null" :stato="stato" :valutatore="valutatore" @commChange="upComm"></azioni>
        <complessiva v-if="stato!=null" :valutatore="valutatore" :stato="stato" :aSuggest.sync="aSuggest" :vAverage.sync="vAverage" @finalChange="finalChange" :vals="decodificaRisultati" :career="carriera"></complessiva>

        <a v-if="modified" class="btn btn-warning printden" @click="showSaveModal()" style="margin-bottom: 10px; position: fixed; bottom: 0px; right: 110px; z-index: 1">
                    {{strings.btnSave[itaEng01]}}</a>


        <a class="btn btn-danger printden" @click="flag = !flag" style="margin-bottom: 10px; position: fixed; bottom: 0px; right: 25px; z-index: 1">Print</a>

        <div v-if="$root.getPermessi().showLowerImage" style="text-align: center;">
          <img :src="$root.getPermessi().lowerImage" class="img-rounded" :class="[$root.xs ?  'width-300' : 'width-400']" style="margin-bottom: 20px;">
        </div>
        <span class="printden">
          <survey v-if="$Ev(permessi.Survey)" @SurveyAPI="assignSurveyAPI"
          wrapperClasses="col-xs-12" :wrapperStyle="{'padding': '0px', 'margin-bottom': '10px'}" headerClasses="h-header" titleClasses="performance_survey_title"></survey>
        </span>
      </div>

      <print-content :setup="printSetup" :trigger="flag" @printing="loading = true"></print-content>
    </div>
  </div>
</div>
</template>
<script>
import sidejsonly from '../components/side-default-jsonly.vue'
import alertchoice from '../recruiting/cv-components/alert-choice.vue'

import anagrafica from './obj-components/h-anagrafica.vue'
import cascading from './obj-components/h-cascading.vue'
import individuali from './obj-components/h-individuali.vue'
import competenza from './obj-components/h-competenze.vue'
import azioni from './obj-components/h-azioni-sviluppo.vue'
import complessiva from './obj-components/h-complessiva.vue'
import survey from '../_fullDyn/surveyWrapper.vue'

import printContent from '../../_printContent/printContent.vue'

import {
  eventBus
} from '../../eventbus.js';

import {
  override
} from './state_settings_override.js'

import {
  relationships
} from './auth_fields_relationships.js'

export default {
  mounted: function() {
    this.init();
  },
  components: {
    sidejsonly,
    alertchoice,
    anagrafica,
    cascading,
    individuali,
    competenza,
    azioni,
    complessiva,

    survey,
    printContent
  },
  data: function() {
    return {
      strings: this.$root.getStrings(),
      itaEng01: this.$root.lang(),
      permessi: {},
      toPrint: false,

      stato: null,
      valutatore: null,
      approvatore: false,
      admin: this.$root.isAdmin(),

      loading: true,
      modified: false,

      everything: [],
      goalCascading: [],
      goalInd: [],
      otherGoals: [],
      schedaVal: {},
      decodificaRisultati: [],
      carriera: [],

      //calcolo media
      aSuggest: 0,
      vAverage: 0,

      index: {},
      message: '',
      showModal: false,

      howMany: 0,
      flag: false,

      surveyAPI: null
    }
  },
  watch: {
    '$route': function() {
      location.reload();
    }
  },
  methods: {
    assignSurveyAPI($event){
      this.surveyAPI = $event;
    },
    printSetup: function() {
      // array con le informazioni su come trasformare HTML dinamico in statico
      var array = [{
          selector: "#elt .not_app",
          into: 'SPAN',
          how: function(el) {
            var input = el.children[0];
            var c = input.checked;
            if (!c) {
              return 'nothing';
            } else {
              return 'Not Applicable: ✓'
            }
          }
        },
        {
          selector: "#elt textarea",
          into: 'DIV',
          how: function(el) {
            return el.value
          }
        },
        {
          selector: "#elt input",
          into: 'SPAN',
          how: function(el) {
            return el.value
          }
        },
        {
          selector: "#elt select",
          into: 'SPAN',
          how: function(el) {
            var selezionato = el.selectedIndex;
            var text;
            if (el[selezionato] != null) {
              text = el[selezionato].label;
            } else {
              text = '';
            }
            return text;
          }
        },
        {
          selector: "#elt span.span_weight",
          into: 'keep',
          how: function(el) {
            return (el.innerHTML + ' %');
          }
        }
      ];
      // selettore degli elementi da non stampare
      var deny = "#elt .printden";
      var wrapper_id = "content"

      var css_custom = [{
          selector: ".col-xs-12",
          style: [{
            what: "padding-left",
            val: "5px"
          }, {
            what: "padding-right",
            val: "5px"
          }]
        }, {
          selector: "h3.text-headline.panel-title",
          style: [{
            what: "padding",
            val: "15px"
          }]
        }, {
          selector: "h5.text-subhead",
          style: [{
            what: "margin-top",
            val: "15px"
          }]
        },
        {
          selector: ".col-xs-12.comp",
          style: [{
            what: "padding",
            val: "5px 20px"
          }]
        }, {
          selector: "span.print_bold",
          style: [{
            what: "font-weight",
            val: '600'
          }, {
            what: "font-size",
            val: '15px'
          }]
        }, {
          selector: ".panel.panel-default.obb",
          style: [{
            what: "margin-left",
            val: '8px'
          }]
        }, {
          selector: ".container_complessiva",
          style: [{
            what: "margin",
            val: '5px 10px'
          }]
        }, {
          selector: ".print_paddless",
          style: [{
            what: "padding",
            val: '0px'
          }]
        }, {
          selector: ".print_avatar",
          style: [{
            what: "margin-left",
            val: '235px'
          }]
        }
      ]

      return {
        'dynamic': array,
        'container': wrapper_id,
        'ignore_selector': deny,
        'css_custom': css_custom
      }
    },
    mandatoryCheck: function(status) {
      console.log(this.schedaVal)
      if (this.iterAll()) {
        this.updateStatus(status)
        eventBus.$emit("mandatoryReset");
      } else {
        eventBus.$emit("alert", this.strings.mandatoryErr[this.itaEng01])
        eventBus.$emit("mandatoryFail");
      }
    },
    iterAll: function() {
      var check = this.mandatoryIter(this.schedaVal, relationships.Testata);
      if (!check) {
        return false
      };
      for (var i = 0; i < this.goalInd.length; i++) {
        check = this.mandatoryIter(this.goalInd[i], relationships.IndividualiGeneriche)
        if (!check) {
          return false
        };
        if (this.goalInd[i].NonApplicabileAutovalutato != -1) {
          check = this.mandatoryIter(this.goalInd[i], relationships.IndividualiValutato)
          if (!check) {
            return false
          };
        } else {
          console.log("Autovalutazione Non Applicabile")
        }
        if (this.goalInd[i].NonApplicabileValutato != -1) {
          check = this.mandatoryIter(this.goalInd[i], relationships.IndividualiValutatore)
          if (!check) {
            return false
          };
        } else {
          console.log("Valutazione Non Applicabile")
        }
      }
      return true;
    },
    mandatoryIter: function(what, legami) {
      console.log("Mandatory Iter")
      //handle exception prop == Survey
      if(this.$root.isMandatory(this.permessi.Survey)){
        var checking = this.surveyAPI.mandatoryCheck();
        if(!checking){
          console.log("Survey Mandatory Check Method returned false")
          return false; 
        }
      }
      for (var prop in legami) {
        try {
          if (this.$root.isMandatory(this.permessi[prop]) && prop != "Survey") {
            console.log(prop + " is Mandatory!")
            
            var campi_associati = legami[prop];
            for (var i = 0; i < campi_associati.length; i++) {
              var checking = what[campi_associati[i]]
              if (checking == null || checking == '') {
                console.log(campi_associati[i])
                console.log(checking)
                return false;
              }
            }
          }
        } catch (err) {
          console.log("Error checking mandatory permit")
          console.log(err)
          return false;
        }
      }
      return true;
    },
    updateStatus: function(status) {
      this.showSaveModal(status);
    },
    showSaveModal(status) {
      if (status != null) {
        localStorage.setItem("changingStatus", status);

        this.message = this.strings.statusMessage[this.itaEng01];
      } else {
        this.message = this.strings.checkMessage[this.itaEng01];
      }
      var numero_obiettivi = this.goalInd.length;
      var peso = 0;

      for (let i = 0; i < numero_obiettivi; i++) {
        peso = peso + this.goalInd[i].Peso;
      }
      if (peso == 100 || peso == 0) {
        this.showModal = true;
      } else {
        if (localStorage.getItem("changingStatus") != null) {
          localStorage.removeItem("changingStatus");
        }
        eventBus.$emit('alert', this.strings.alertPerc[this.itaEng01]);
      }
    },
    handleChoice: function($event) {
      this.showModal = false;

      if ($event == true) {
        if (localStorage.getItem("changingStatus") != null) {
          this.save(localStorage.getItem("changingStatus"))
        } else {
          this.save();
        }
      } else if (localStorage.getItem("changingStatus") != null) {
        localStorage.removeItem("changingStatus");
      }
    },
    furtherChange: function($event) {
      try {
        this.schedaVal.IDValutatoreAggiuntivo1 = $event.further1.id;
        this.schedaVal.IDValutatoreAggiuntivo2 = $event.further2.id;
      } catch (err) {
        console.log(err)
      }
      this.schedaVal.do_updated = -1;
      this.modified = true;
    },
    indChange: function($event) {
      this.goalInd[$event.index] = $event.obj;
      this.goalInd[$event.index].do_updated = -1;
      this.modified = true;
      console.log(this.goalInd[$event.index])
      this.calcolaMedia();
    },
    otherChange: function($event, index) {
      this.otherGoals[index] = $event.obj;
      this.otherGoals[index].do_updated = -1;
      this.modified = true;
      if ($event.isVal) {
        this.calcolaMedia()
      }
    },
    upComm: function($event) {
      this.schedaVal.NoteGeneriche = $event.NoteGeneriche;
      this.schedaVal.NoteValutato = $event.NoteValutato;
      this.schedaVal.NoteGeneriche2 = $event.NoteGeneriche2

      this.schedaVal.do_updated = -1;
      this.modified = true;
    },
    finalChange: function($event) {
      this.schedaVal.Autovalutazione = $event.Autovalutazione;
      this.schedaVal.IDDecodificaValutazioneGlobaleForzata = $event.Valutazione;
      this.schedaVal.CommentiFinaliValutato = $event.CommentiFinaliValutato;
      this.schedaVal.CommentiFinaliValutatore = $event.CommentiFinaliValutatore;
      this.schedaVal.NoteGeneriche3 = $event.NoteGeneriche3;
      this.schedaVal.IDRuoloProposto = $event.IDRuoloProposto;

      this.schedaVal.do_updated = -1;
      this.modified = true;
    },
    calcolaMedia: function() {
      var anon0 = 0,
        vnon0 = 0,
        tota = 0,
        totv = 0,
        weight_a_0 = false,
        avg_a = 0,
        weight_a = 0,
        weight_v_0 = false,
        avg_v = 0,
        weight_v = 0;
      var average = null;

      //iter INDIVIDUALI
      for (var i = 0; i < this.goalInd.length; i++) {
        var goal = this.goalInd[i];
        if (goal.AutoValutazioneFinale != 0 && goal.AutoValutazioneFinale != null && goal.NonApplicabileAutovalutato != -1) {
          anon0++;
          tota += goal.AutoValutazioneFinale;
          weight_a_0 = goal.Peso == 0 ? true : weight_a_0;
          if (!weight_a_0) {
            avg_a += (goal.AutoValutazioneFinale * goal.Peso);
            weight_a += goal.Peso;
          }
        }

        if (goal.LivelloRequisito != 0 && goal.LivelloRequisito != null && goal.NonApplicabileValutato != -1) {
          vnon0++;
          totv += goal.LivelloRequisito;
          weight_v_0 = goal.Peso == 0 ? true : weight_v_0;
          if (!weight_v_0) {
            avg_v += (goal.LivelloRequisito * goal.Peso);
            weight_v += goal.Peso;
          }
        }
      }
      //  iter ALTRE QUALITATIVE
      /*  Qualitative per ora non fanno media
      for(var i = 0; i < this.otherGoals.length; i++){
          var goal = this.otherGoals[i];
          console.log(goal.Peso)
          if (goal && goal.AutoValutazioneFinale != 0 && goal.AutoValutazioneFinale != null) {
              anon0++;
              tota += goal.AutoValutazioneFinale;
          }
          if (goal && goal.ValutazioneFinale != 0 && goal.ValutazioneFinale != null) {
              vnon0++;
              totv += goal.ValutazioneFinale;
          }
      }
      */

      if (anon0 > 0) {
        if (!weight_a_0) {
          this.aSuggest = Math.floor(avg_a / weight_a)
        } else {
          this.aSuggest = Math.floor(tota / anon0);
        }
      }
      if (vnon0 > 0) {
        average = weight_v_0 == true ? (totv / vnon0) : (avg_v / weight_v);

      }
      /* SAVE CHANGES */

      if (average != null) {
        this.vAverage = average;
        var parse = this.vAverage.toFixed(2);
        this.vAverage = Number(parse);
        this.schedaVal.MediaCompetenzeValutate = this.vAverage;
        this.schedaVal.do_updated = -1;
        if (this.schedaVal.MediaCompetenzeValutate == null) {
          console.log("Avg not matched")
        }
      } else if (this.schedaVal.MediaCompetenzeValutate != null) {
        this.vAverage = null;
        this.schedaVal.MediaCompetenzeValutate = null;
        this.schedaVal.do_updated = -1;
      }
      
      console.log(this.schedaVal.MediaCompetenzeValutate)
    },
    save: function(status) {
      //sending survey results
      if(this.surveyAPI != null){
        var localSurvey = this.surveyAPI.getValue();
        if(localSurvey != null){
          localSurvey = JSON.stringify(localSurvey);
          if(localSurvey != this.schedaVal.RisposteSurvey){
            this.schedaVal.RisposteSurvey = localSurvey;
            console.log("found update in Survey Sections")
            this.schedaVal.do_updated = -1;
          }
        }
      }

      var peso = 0;
      for (let i = 0; i < this.goalInd.length; i++) {
        peso = peso + this.goalInd[i].Peso;
      }

      if (peso == 100 || peso == 0) {
        this.everything = [];
        for (var i = 0; i < this.goalCascading.length; i++) {
          this.everything.push(this.goalCascading[i])
        }
        for (var i = 0; i < this.goalInd.length; i++) {
          this.everything.push(this.goalInd[i])
        }
        for (var i = 0; i < this.otherGoals.length; i++) {
          this.everything.push(this.otherGoals[i])
        }

        if (status != null) {
          this.schedaVal.do_updated = -1;
          try {
            status = parseInt(status);
          } catch (err) {}
          this.schedaVal.IDStato = status;
        }
        // this.modified = false;
        // sposto modified false nella callback di successo della promise
        var json = {
          JsonTestata: this.schedaVal,
          JsonDettaglio: this.everything
        }

        switch (this.valutatore) {
          case true:
            if (this.approvatore) {
              json.JsonTestata.RuoloAutorizzazione = "Approvatore"
            } else {
              json.JsonTestata.RuoloAutorizzazione = "Valutatore"
            }
            break;
          case false:
            json.JsonTestata.RuoloAutorizzazione = "Valutato"
            break;
          case null:
            if (this.admin) {
              json.JsonTestata.RuoloAutorizzazione = "Supervisore"
            }
            break;
        }
        console.log(json)
        this.$http.post(localStorage.getItem("path") + "/APIUPDATEVALUTAZIONE", JSON.stringify(json), {
          headers: {
            'friendly-renew': '-1'
          }
        }).then((response) => {
          if (status != null) {
            localStorage.removeItem("changingStatus");
            localStorage.setItem("newStatus", -1);
            location.reload();
          }

          for (var i = 0; i < this.goalCascading.length; i++) {
            this.goalCascading[i].do_updated = 0
          }
          for (var i = 0; i < this.goalInd.length; i++) {
            this.goalInd[i].do_updated = 0
          }
          for (var i = 0; i < this.otherGoals.length; i++) {
            this.otherGoals[i].do_updated = 0
          }
          this.modified = false;
        }, (err) => {
          console.log(err);

          //error 401 già intercettato dall'interceptor di gestione scadenza token
          if (err.status != 401) {
            eventBus.$emit('alert', this.strings.alertSave[this.itaEng01]);
          }
        });

      } else {
        eventBus.$emit('alert', this.strings.alertPerc[this.itaEng01]);
      }
    },
    init: function() {
      if (localStorage.getItem("changingStatus") != null) {
        localStorage.removeItem("changingStatus");
      }

      var par = this.$route.params;
      var v = Base64.decode(par.ruolo);
      if (v === "Valutato") {
        v = false;
      } else if (v === "Valutatore") {
        v = true;
      }
      if (par.idscheda != null && (v === true || v === false)) {
        this.valutatore = v;
        this.getMeta(par.idscheda);
      } else {
        if (par.idscheda != null && Base64.decode(par.ruolo) == "Admin" && this.admin) {
          this.valutatore = null;
          this.getMeta(par.idscheda);
        } else {
          eventBus.$emit('alert', this.strings.alertAcc[this.itaEng01]);
          this.$router.replace({
            path: '/'
          })
        }
      }
    },
    getMeta: function(idscheda, f_o_attempt) {
      this.admin = this.admin && Base64.decode(this.$route.params.ruolo) == "Admin";
      var string;
      var v = localStorage.getItem("idpersona");
      var t = (localStorage.getItem("testing") == 1)
      var path = localStorage.getItem("path");
      var pass;
      var same_person = false;

      if (this.valutatore == true) {
        if (f_o_attempt != true) {
          //al primo tentativo interrogo come valutatore
          string = '/APILISTAVALUTAZIONI?ID=' + idscheda + "&IDValutatore=" + v + "&RuoloAutorizzazione=Valutatore";
          pass = "Valutatore";
        } else {
          //al secondo tentativo interrogo come approvatore
          string = '/APILISTAVALUTAZIONI?ID=' + idscheda + "&IDApprovatore=" + v + "&RuoloAutorizzazione=Approvatore";
          pass = "Approvatore";
          //approvatore = true verrà eventualmente rivalutato nel caso Approvatore e Valutatore coincidano in fase di Promise All
          this.approvatore = true;
        }
      } else if (this.valutatore == false) {
        string = '/APILISTAVALUTAZIONI?ID=' + idscheda + "&IDValutato=" + v + "&RuoloAutorizzazione=Valutato";
        pass = "Valutato";
      } else if (this.admin) {
        string = '/APILISTAVALUTAZIONI?ID=' + idscheda + "&RuoloAutorizzazione=Supervisore";
        pass = "Supervisore";
      }

      this.$http.get(path + '' + string).then((response) => {
        var res = response.body;
        try {
          res = JSON.parse(response.body);
        } catch (err) {};

        if (res && res.APILISTAVALUTAZIONI) {
          res = res.APILISTAVALUTAZIONI[0];
          this.schedaVal = res;
          this.vAverage = this.schedaVal.MediaCompetenzeValutate;

          var st = this.schedaVal.IDStato;

          var promises = [];

          same_person = this.valutatore == true && res.IDApprovatore == res.IDValutatore;
          //a prescindere dal RuoloAutorizzazione usato nell'interrogazione, nel caso l'utente risulti sia come valutatore che come approvatore della scheda, devo interrogare APIAutorizzazioni a seconda del flag indicato nell'API Passaggio Stati
          //per farlo interrogo con RuoloValutazione in ||, e poi faccio il fetching usando la lista valutazioni memorizzata in onLoad
          if (same_person) {
            pass = 'Valutatore;Approvatore'
          }

          //OLD PROMISE
          /*
          promises.push(this.$http.get(path + '/APIAutorizzazioneValutazioni?StatoValutazione=' + st + "&RuoloValutazione=" + pass)
          .then((response) => {
              var res = response.body;
              try{
                  res = JSON.parse(response.body);
              } catch(err) {};

              if(res && res.APIAutorizzazioneValutazioni){
                  this.permessi = res.APIAutorizzazioneValutazioni;
                  console.log(this.permessi)
              }

          })) */
          //NEW PROMISE

          promises.push(this.$http.get(path + '/APIAutorizzazioneValutazioni?StatoValutazione=' + st)
            .then((response) => {
              var res = response.body;
              try {
                res = JSON.parse(response.body);
              } catch (err) {};

              if (res && res.APIAutorizzazioneValutazioni) {
                this.permessi = [];
                var ps = pass.split(';');
                for (var i = 0; i < res.APIAutorizzazioneValutazioni.length; i++) {
                  for (var ii = 0; ii < ps.length; ii++) {
                    if (res.APIAutorizzazioneValutazioni[i].RuoloValutazione == ps[ii]) {
                      this.permessi.push(res.APIAutorizzazioneValutazioni[i]);
                    }
                  }
                }
                console.log(this.permessi)
              }

            }))
          promises.push(this.$http.get(path + '/APIDecodificheRisultati?IDProfiloDecodifica=' + this.schedaVal.IDProfiloDecodifica).then((response) => {
            var res = response.body;
            try {
              res = JSON.parse(response.body);
            } catch (err) {};
            if (res && res.APIDecodificheRisultati) {

              this.decodificaRisultati = [{
                value: 0,
                descrizione: '',
                sequenza: -1
              }]
              for (var i = 0; i < res.APIDecodificheRisultati.length; i++) {
                this.decodificaRisultati.push({
                  value: res.APIDecodificheRisultati[i].ID,
                  descrizione: res.APIDecodificheRisultati[i].Decodifica,
                  sequenza: res.APIDecodificheRisultati[i].ValoreMinimo
                })
              }
              this.decodificaRisultati.sort(function(a, b) {
                return a.sequenza - b.sequenza;
              })
              for (var i = 0; i < this.decodificaRisultati.length; i++) {
                this.decodificaRisultati[i].indice = i;
              }
            }
          }))
          var ruoli_ids = [];

          promises.push(this.$http.get(path + '/APIPercorsoCarriera?IDRuoloDa=' + this.schedaVal.IDRuolo).then((response) => {
            var res = response.body;
            try {
              res = JSON.parse(response.body);
            } catch (err) {};
            if (res && res.APIPercorsoCarriera) {
              for (var i = 0; i < res.APIPercorsoCarriera.length; i++) {
                ruoli_ids.push(res.APIPercorsoCarriera[i].IDRuoloA)
              }
              ruoli_ids = ruoli_ids.join(";");
            }
          }));

          this.carriera = [{
            IDRuolo: null,
            Ruolo: ''
          }];

          Promise.all(promises).then(() => {
            var auth_ok = false;
            if (same_person != true) {
              console.log("isn't same person")
              //se non devo scegliere fra AUTH approvatore e valutatore, prendo il primo (unico) risultato dell'api
              this.permessi = this.permessi[0]
              auth_ok = true;
            } else {
              console.log("is same person")
              //altrimenti, elaboro il risultato dell'elenco stati
              var ruolo_prevalente = null;
              for (var i = 0; i < this.$root.stati_valutazione.length; i++) {
                if (this.$root.stati_valutazione[i].IDStato == st) {
                  console.log("state found")
                  ruolo_prevalente = this.$root.stati_valutazione[i].RuoloPrevalente;
                  console.log("ruolo prevalente: " + ruolo_prevalente)
                  break;
                }
              }
              for (var i = 0; i < this.permessi.length; i++) {
                if (this.permessi[i].RuoloValutazione == ruolo_prevalente) {
                  this.permessi = this.permessi[i];
                  console.log("found match at index " + i);
                  break;
                }
              }
              console.log(this.permessi)
              // controllo ulteriore solo per intercettare il caso in cui permessi.length == 0 e ruolo == null
              if (ruolo_prevalente != null && this.permessi.RuoloValutazione == ruolo_prevalente) {
                auth_ok = true;
                this.approvatore = ruolo_prevalente == "Approvatore";
              } else if (ruolo_prevalente == null && this.permessi.length > 0) {
                this.permessi = this.permessi[0];
                auth_ok = true;
                this.approvatore = this.permessi.RuoloValutazione == "Approvatore"
              } else {
                this.backToHome();
              }
            }
            if (auth_ok) {
              if (ruoli_ids != null && ruoli_ids != '') {
                this.$http.get(path + '/APIRuoli?ID=' + ruoli_ids).then((response) => {
                  var res = response.body;
                  try {
                    res = JSON.parse(response.body);
                  } catch (err) {};
                  if (res && res.APIRuoli) {
                    for (var i = 0; i < res.APIRuoli.length; i++) {
                      this.carriera.push({
                        IDRuolo: res.APIRuoli[i].ID,
                        Ruolo: res.APIRuoli[i].RUOLO
                      })
                    }
                  }
                  this.stato = st;
                  this.getJSON(idscheda)
                }, (err) => {
                  console.log("Err in APIRuoli")
                  this.stato = st;
                  this.getJSON(idscheda)
                })
              } else {
                console.log("Empty Career")
                this.stato = st;
                this.getJSON(idscheda)
              }
            }
          });

        } else {
          //la prima volta, F-O-Attempt è undefined
          if (f_o_attempt != true && this.valutatore == true) {
            //se risulto come valutatore, ma l'api non ritorna risultati faccio un tentativo come feedback owner
            this.getMeta(idscheda, true);
          } else {
            //se non risulto come valutatore, o anche il tentativo come feedback owner non ha ritornato risultati
            this.backToHome();
          }
        }
      }, (err) => {
        console.log("caught get valutazione");
        console.log(err);
        eventBus.$emit('alert', this.strings.alertAcc[this.itaEng01]);
        this.$router.replace({
          path: '/'
        })
      });
    },
    backToHome: function() {
      //FORSE NEW STATUS NON E' USATO
      if (localStorage.getItem("newStatus") == -1) {
        localStorage.removeItem("newStatus");
        eventBus.$emit('alert', this.strings.alertStat[this.itaEng01]);
      } else {
        eventBus.$emit('alert', this.strings.alertAcc[this.itaEng01]);
      }
      this.$router.replace({
        path: '/'
      })
    },
    getJSON: function(idValutazione) {
      var id;
      var t = (localStorage.getItem("testing") == 1)
      var path = localStorage.getItem("path");

      if (idValutazione != null) {
        id = idValutazione;
        this.$http.get(path +
          '/APIKPIVALUTAZIONE?IDValutazione=' + id).then((response) => {
          var res = response.body;
          try {
            res = JSON.parse(response.body);
          } catch (err) {};

          if (res && res.APIKPIVALUTAZIONE) {
            res = res.APIKPIVALUTAZIONE;

            res.sort(function(a, b) {
              return a.Sequenza - b.Sequenza;
            });

            this.everything = res;
            this.fetchEverything();
          } else {
            // TODO everything = {}
            // this fetch everything ?
            // to test
            eventBus.$emit('alert', this.strings.alertKpi[this.itaEng01]);
            this.$router.replace({
              path: '/'
            })
          }
        }, (err) => {
          console.log("caught get dettaglio valutazione");
          console.log(err);
          eventBus.$emit('alert', this.strings.alertAcc[this.itaEng01]);
          this.$router.replace({
            path: '/'
          })
        });
      } else {
        eventBus.$emit('alert', this.strings.alertAcc[this.itaEng01]);
        this.$router.replace({
          path: '/'
        })
      }
    },
    fetchEverything: function() {

      var ordinaPerSequenza = function(a, b) {
        if (a.Sequenza == null) {
          return -1
        }
        if (b.Sequenza == null) {
          return 1
        }
        return a.Sequenza - b.Sequenza;
      }

      //se Tipo non è definito, non lo elaboro
      this.goalCascading = this.everything.filter(function(obj) {
        return obj.Tipo == "Descrizione UO";
      })
      this.goalCascading.sort(ordinaPerSequenza);

      this.goalInd = this.everything.filter(function(obj) {
        //return obj.Modificabile == -1;
        return obj.Tipo == "Competenza"
      })
      this.goalInd.sort(ordinaPerSequenza);

      this.otherGoals = this.everything.filter(function(obj) {
        return false;
        //return obj.Tipo == "Qualitativo" && obj.Modificabile != -1;
      })
      this.otherGoals.sort(ordinaPerSequenza);

      //this.calcolaMedia(); PARAMETRIZZATO NELLE WEBAPI
      this.loading = false;
    }
  }
}
</script>
<style scoped>
#content {
  background-color: #666;
}
</style>
<style>
.six {
  padding-left: 0px !important;
  padding-right: 20px !important;
}

@media (max-width: 768px) {
  .six {
    padding-right: 0px !important;
  }
}

.mandatory_failed {
  color: #a94442 !important;
  background-color: #f2dede !important;
  border-color: #ebccd1 !important;
}

h3.performance_survey_title {
  color: white;
  font-weight: 300;
  font-size: 1.84rem;
  line-height: 2.46rem;
}
</style>
