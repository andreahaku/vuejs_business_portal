<template>
<div style="height: inherit;">
  <sidejsonly :default="false"></sidejsonly>
  <div class="st-pusher" id="content">
    <div class="st-content">
      <div class="st-content-inner padding-none">
        <div class="container-fluid">
          <br>
          <div class="item col-xs-12">
            <h5 class="text-headline" style="margin-top:2px;">{{s.schedaGoal[l]}}</h5>
            <!--
                            <div style="position: absolute; right: 20px; top: 0px; padding-rigth: 15px;">
                                <button class="btn btn-sm btn-danger paper-shadow relative" @click="openPDF()">APRI REGOLAMENTO</button>
                            </div>
                            -->
            <div class="row">
              <!-- CARD con dettagli Goal -->
              <div class="col-xs-12 col-sm-6">
                <div class="panel panel-default">
                  <div class="panel-body">
                    <div class="media-left" style="padding-top: 0px;">
                      <img :src="path + '/' + goal.NomeFileFoto" onerror="this.src = 'images/profile-photo_small.png'" class="img-circle width-70" />
                    </div>
                    <div class="media-body">
                      <h4><strong>{{goal.Valutato}}</strong></h4>
                      <h4 style="margin-top:3px;" class="text-primary"><strong>{{ goal.DescrizioneScheda }}</strong></h4>
                      <h5 style="margin-top:10px; margin-bottom: 5px;">{{s.periodoDa[l]}} {{ goal.InizioPeriodoValutazione }} {{s.a[l]}} {{ goal.FinePeriodoValutazione }}</h5>
                      <h5 style="margin-bottom:2px;" class="margin0"><strong>{{s.responsabile[l]}}:</strong> {{goal.Valutatore}}</h5>
                      <hr style="margin:5px 0px 5px 0px;">
                      <h5 style="margin-bottom:5px;" class="margin0"><strong>{{s.livello[l]}}:</strong> {{goal.NomeRuolo}}</h5>
                      <h5 style="margin-bottom:5px;" class="margin0"><strong>Unità Organizzativa:</strong> {{goal.NomeUO}}</h5>
                      <h5 style="margin-bottom:5px;" class="margin0"><strong>{{s.stato[l]}}:</strong> {{goal.Descrizione}}</h5>
                    </div>
                  </div>
                </div>
              </div>
              <!-- CARD con target variabile-->
              <div class="col-xs-12 col-sm-6">
                <div class="panel panel-default right-labels">
                  <div class="panel-body body-etichetta">
                    <span class="pull-left label-etichetta">{{s.mbokpitrans.varOnTarget[l]}}</span>
                    <span class="pull-right" v-if="goal.PremioMassimo">€ {{ goal.PremioMassimo.formatMoney(2)}}</span>
                  </div>
                </div>
                <div class="panel panel-default right-labels">
                  <div class="panel-body body-etichetta">
                    <span class="pull-left label-etichetta">{{s.mbokpitrans.percentualeRaggiunta[l]}}</span>
                    <span class="pull-right">{{percentualeRaggiunta}}</span>
                  </div>
                </div>
                <div class="panel panel-default right-labels">
                  <div class="panel-body body-etichetta">
                    <span class="pull-left label-etichetta">{{s.mbokpitrans.varRaggiunto[l]}}</span>
                    <span class="pull-right" v-if="PremioRaggiunto">€ {{ PremioRaggiunto.formatMoney(2)}}</span>
                  </div>
                  <div class="var-container">
                   <div v-if="goal.VariabileAnticipato" class="panel panel-default sub-panel right-labels sub-pna">
                    <div class="panel-body body-sub-etichetta">
                      <span class="pull-left label-sub-etichetta">{{s.mbokpitrans.varAnticipato[l]}}</span>
                      <span class="pull-right">€ {{ goal.VariabileAnticipato.formatMoney(2)}}</span>
                    </div>
                  </div>
                  <div v-if="goal.VariabileDaErogare != null" class="panel panel-default sub-panel right-labels">
                    <div class="panel-body body-sub-etichetta">
                      <span class="pull-left label-sub-etichetta">{{s.mbokpitrans.varDaErogare[l]}}</span>
                      <span class="pull-right">€ {{ goal.VariabileDaErogare.formatMoney(2)}}</span>
                    </div>
                  </div>
                  </div>
                </div>

               
                <div v-if="goal.ExtraPremio" class="panel panel-default right-labels">
                  <div class="panel-body body-etichetta">
                    <span class="pull-left label-etichetta">{{s.mbokpitrans.extraMbo[l]}}</span>
                    <span class="pull-right">€ {{ goal.ExtraPremio.formatMoney(2)}}</span>
                  </div>
                </div>
                <!--
                Variabile Anticipato
                Variabile da Erogare
                Extra MBO
                -->
              </div>
              <!--
              <div class="col-xs-6">
                  <div class="panel panel-default panel-body form-group">
                      <label for="note" style="font-weight: 400;">Note</label>
                      <input type="text" class="form-control" id="note">
                  </div>
              </div>
              -->
            </div>
            <div>
              <!-- TABs del KPI e Lettera -->
              <ul class="nav nav-tabs" role="tablist" style="font-size: 1.5rem; font-weight: 300;">
                <li role="presentation" class="active"><a href="#kpi" aria-controls="kpi" role="tab" data-toggle="tab">KPI</a></li>
                <li role="presentation"><a href="#lettera" aria-controls="lettera" role="tab" data-toggle="tab">{{s.lettera[l]}}</a></li>
                <li role="presentation"><a href="#regolamento" aria-controls="regolamento" role="tab" data-toggle="tab" @click="loadPDF()">{{s.regolamento[l]}}</a></li>
              </ul>
            </div>
            <div class="tab-content col-xs-12" style="padding-right: 5px;">
              <!-- TAB KPI -->
              <div role="tabpanel" class="tab-pane active" id="kpi">
                <div class="panel panel-default" style="border: 0px;">
                  <div class="panel-body" style="padding: 0px;">
                    <div style="overflow-y: scroll">
                      <table width="100%">
                        <tbody>
                          <tr>
                            <!-- headers -->
                            <th v-for="(h, c) in headers" v-if="h.visible" :class="{kpi: c == 0, 'non-kpi': c != 0, editable: h.editable}" :width="h.width">
                              <span>{{h.label}}</span>
                              <a v-if="h.editable" class="btn" :class="[h.editing ? 'btn-warning' : 'btn-info']" style="padding: 4px 6px; float: right;" @click="triggerEdit(h)">
                                                                <i class="fa" :class="[h.editing ? 'fa-floppy-o' : 'fa-pencil-square-o']" aria-hidden="true"></i>
                                                            </a></th>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div id="table-content">
                      <table width="100%">
                        <tbody>
                          <tr v-for="(oggetto, index) in tabella" :key="index" :class="{alternata: index%2 == 1}">
                            <!-- celle -->
                            <td v-for="(valore, col) in oggetto.labels" v-if="headers[col].visible" :class="{kpi: col == 0, figlio: oggetto.id != oggetto.father, padre: oggetto.id == oggetto.father, figlioDx: (oggetto.id != oggetto.father && col != 0)}" :width="headers[col].width"
                              @click="toggleChilds(oggetto.id)" v-show="oggetto.visible">
                              <span :class="{'blank_son': !oggetto.hasChild && col == 0 && oggetto.id == oggetto.father}" v-if="!headers[col].editing" v-html="((oggetto.hasChild && col == 0) ? (oggetto.expanded ? minus : plus) :'<span></span>') + valore"></span>
                              <input @click.stop="" v-else-if="headers[col].type == 'number'" type="number" v-model="tabella[index].values[col]" style="width: 100%" />
                              <input @click.stop="" v-else-if="headers[col].type == 'number'" type="text" v-model="tabella[index].values[col]" style="width: 100%" />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              <div role="tabpanel" class="tab-pane" id="lettera">
                <!-- lettera -->
                <div class="panel panel-default" style="border:0px;">
                  <div style="margin:10px;" v-html="goal.TestoHTML">
                  </div>
                </div>
              </div>
              <div role="tabpanel" class="tab-pane" id="regolamento" style="height: 450px; overflow-y: hidden;">
                <!-- lettera -->
                <div v-if="pathPDF!=''" class="panel panel-default" style="border:0px; height: 100%;">
                  <iframe frameborder="0" width="100%" height="100%" id="pdfFrame"></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>
<script>
import sidejsonly from '../components/side-default-jsonly.vue'

Number.prototype.formatMoney = function(c, d, t) {
  var n = this,
    c = isNaN(c = Math.abs(c)) ? 2 : c,
    d = d == undefined ? "," : d,
    t = t == undefined ? "." : t,
    s = n < 0 ? "-" : "",
    i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
    j = (j = i.length) > 3 ? j % 3 : 0;
  return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};

var vm;

$(window).resize(function() {
  try {
    vm.getHeight()
  } catch (err) {}
});

//Campi API Aggiuntivi

export default {
  mounted: function() {
    vm = this;

    this.$nextTick(function() {
      this.idvalutazione = this.$route.path.split('/')[2];

      this.headers = [{
          label: this.s.mbokpitrans.kpi[this.l],
          editable: false,
          editing: false,
          type: null,
          width: 25,
          visible: true
        },
        {
          label: this.s.mbokpitrans.peso[this.l],
          editable: false,
          editing: false,
          type: null,
          width: 10,
          visible: true
        },
        {
          label: this.s.mbokpitrans.obiettivo[this.l],
          editable: false,
          editing: false,
          type: 'number',
          width: 15,
          visible: true
        },
        {
          label: this.s.mbokpitrans.risultato[this.l],
          editable: false,
          editing: false,
          type: 'number',
          width: 15,
          visible: true
        },
        {
          label: this.s.mbokpitrans.perccalc[this.l],
          editable: false,
          editing: false,
          type: null,
          width: 10,
          visible: true
        },
        {
          label: this.s.mbokpitrans.percragg[this.l],
          editable: false,
          editing: false,
          type: null,
          width: 10,
          visible: true
        },
        {
          label: 'Note',
          editable: false,
          editing: false,
          type: 'text',
          width: 15,
          visible: false
        }
      ]
      //width ricalcolata per riempire la percentuale di eevntuale colonne nascoste
      this.calcolaLarghezzaColonne();

      this.getCard()
      this.getTable()
      this.getPDF();
    })
  },
  components: {
    sidejsonly
  },
  data: function() {
    return {
      s: this.$root.getStrings(),
      l: this.$root.lang(),

      goal: [],
      idvalutazione: 0,
      percentualeRaggiunta: 0,
      PremioRaggiunto: 0,
      headers: null,
      tabella: [],
      plus: '<i class="fa fa-plus-square" aria-hidden="true" style="font-size: 1.3rem; color: #bbb;margin:0px 10px;"></i>',
      minus: '<i class="fa fa-minus-square" aria-hidden="true" style="font-size: 1.3rem; color: #bbb;margin:0px 10px;"></i>',
      path: localStorage.getItem('path'),
      pathPDF: '',
      shown: false
    }
  },
  watch: {
    '$route': function() {
      this.idvalutazione = this.$route.path.split('/')[2]
    }
  },
  /*
  Indirizzo per raggiungere webapi di test: http://13.69.123.225/at_webapi/
  Indirizzo per back office: http://13.69.123.225/activetrees/

  Per entrare come amministratore:
  user = admin
  password = Bkm_Admin_2017

  http://13.69.123.225/at_webapi/ è l’analogo di http://server04:8081, che sarebbe quello che dentro AT si chiama “AT WEB API”.

  La parte di autenticazione/login tienila in piedi: anzi, io in questo momento proverei quella. Ho dato un occhio al codice e mi sembra che:
  ·         per il login ci sia la chiamata a GetToken con user, password e idlingua come argomenti
  ·         non ci sono particolari abilitazioni da attivare sull’utenza: il match viene fatto con username e password e vengono filtrate via solo le utenze che sono bloccate e/o disattivate
  ·         non ho capito come viene gestita la profilazione
  */
  methods: {
    getPDF: function() {
      var lang = this.$root.getLang();
      if (lang == null || lang == "") {
        lang = "ita";
      }
      var path = "pdf/MBO 2017 - KPI Calculation Model - " + lang.toUpperCase() + ".pdf";
      this.pathPDF = path;
      this.getHeight();
    },
    loadPDF: function() {
      if (!this.shown) {
        this.shown = true;
        $("#pdfFrame").attr("src", this.pathPDF);
      }
    },
    getHeight: function() {
      var h = Math.max(430, window.innerHeight - 470);
      $("#regolamento").height(h);
    },
    getCard() {
      if (this.idvalutazione != null) {
        this.$http.get(this.path + '/APILISTAVALUTAZIONI?ID=' + this.idvalutazione).then((response) => {
          var res = response.body;
          try {
            res = JSON.parse(response.body);
          } catch (err) {};

          if (res && res.APILISTAVALUTAZIONI) {
            this.goal = res.APILISTAVALUTAZIONI[0];
            console.log(this.goal)
            this.percentualeRaggiunta = this.formatLabel(this.goal.PercentualeRaggiungimentoObiettiviValutazione, '% calc');
            console.log(this.percentualeRaggiunta)
            this.PremioRaggiunto = this.goal.PremioRaggiuntoValutazione;
          }

        }, (err) => {
          console.log("caught APILISTAVALUTAZIONI GetCard error");

        })
      }
    },
    getTable() {
      if (this.idvalutazione != null) {
        this.$http.get(this.path + '/APIKPIVALUTAZIONE?IDValutazione=' + this.idvalutazione).then((response) => {
          this.tabella = []

          var righe = response.body;
          try {
            righe = JSON.parse(response.body);
          } catch (err) {};

          if (righe && righe.APIKPIVALUTAZIONE) {

            for (var i = 0; i < righe.APIKPIVALUTAZIONE.length; i++) {
              var riga = righe.APIKPIVALUTAZIONE[i]

              var descrizioneValore = ''
              if (riga.IDKPIDettaglio) {
                descrizioneValore = '<span>' + riga.Indicatore + '</span>'
              } else {
                var description = riga.DescrizioneRegole ? riga.DescrizioneRegole : "";
                if (description != "") {
                  descrizioneValore = '<i class="fa fa-info-circle" data-toggle="tooltip" data-placement="auto right" title="' + description + '" style="font-size: 1.3rem; color: #bbb;margin-right:10px;"></i>' + riga.Indicatore
                } else {
                  descrizioneValore = '<i class="fa fa-info-circle" style="display: none; visibility: hidden; font-size: 1.3rem; color: #fff; margin-right:10px;"></i>' + riga.Indicatore
                }
              }
              var valorePeso = riga.Peso ? riga.Peso : 0

              var valoreTarget = 0;
              if (riga.ValoreTarget) {
                //define Valore Raggiunto per test
                console.log(riga.IDKPIFather)
                var index = -1;
                righe.APIKPIVALUTAZIONE.some(function(r, ind) {
                  if (riga.IDKPIFather == r.IDKPI) {
                    index = ind;
                    return true;
                  }
                  return false;
                })
                var picking = i;
                if (index != -1 && index != i) {
                  picking = index;
                }

                var pick = picking % 3;
                var picked = pick == 0 ? 80 : pick == 1 ? 100 : 60;
                // riga.ValoreRaggiunto = Math.floor(riga.ValoreTarget * picked / 100)
                valoreTarget = riga.ValoreTarget;
              }
              var valoreRaggiunto = 0;
              if (riga.ValoreConsuntivo) {
                valoreRaggiunto = riga.ValoreConsuntivo;
              }

              var note = riga.NoteObiettivo ? riga.NoteObiettivo : '';

              var perc = riga.PercentualeRaggiungimentoCalcolata;
              var percErog = riga.PunteggioRaggiunto;

              this.tabella.push({
                id: riga.IDKPIDettaglio ? Math.pow(riga.IDKPIFather, 2) + riga.IDKPI : riga.IDKPI,
                father: riga.IDKPIFather,
                hasChild: (riga.HasChild == -1) ? true : false,
                //figli collassati in partenza
                visible: !riga.IDKPIDettaglio,
                expanded: false,
                values: [descrizioneValore, valorePeso, valoreTarget, valoreRaggiunto, perc, percErog, note],
                labels: [],
                unitaMisura: riga.UnitaDiMisura,
                description: riga.DescrizioneRegole ? riga.DescrizioneRegole : ''
              })
              //percentuali da webapi
              //this.calcolaPercentuali();
            }
            console.log(this.tabella)
            this.getLabels();
          }
        }, (err) => {
          console.log("caught APIKPIVALUTAZIONE?IDValutazione= GetTable error");
        })
      }
    },
    triggerEdit: function(riga) {
      riga.editing = !riga.editing;
      if (!riga.editing) {
        this.calcolaPercentuali();
      }
    },
    calcolaPercentuali: function() {
      this.percentualeRaggiunta = 0;

      for (var i = 0; i < this.tabella.length; i++) {
        var vals = this.tabella[i].values;
        var perc = 0;
        if (vals[2] && vals[3]) {
          perc = Math.floor(vals[3] * 100 / vals[2]);
          if (vals[1] && vals[1] != 0) {
            this.percentualeRaggiunta += Math.floor(perc * vals[1] / 100);
          }
        }
        this.tabella[i].values[4] = perc;
      }
      this.getLabels();
    },
    getLabels: function() {
      for (var i = 0; i < this.tabella.length; i++) {
        var riga = this.tabella[i];
        riga.labels = [];
        //anche se alcune colonne sono nascoste, le labels le inizializzo tutte comunque
        //così, a livello di v-for, rimane la corrispondeza fra indici label e indici colonne, e posso dedurre quali label (e con quale larghezza) mostrare
        riga.labels.push(riga.values[0]);
        riga.labels.push(this.formatLabel(riga.values[1], '%'))
        riga.labels.push(this.formatLabel(riga.values[2], riga.unitaMisura ? riga.unitaMisura : ''))
        riga.labels.push(this.formatLabel(riga.values[3], riga.unitaMisura ? riga.unitaMisura : ''))
        riga.labels.push(this.formatLabel(riga.values[4], '% calc'))
        riga.labels.push(this.formatLabel(riga.values[5], '% calc'))
        riga.labels.push(riga.values[6]);
      }
    },
    /* KEEPING OLD Format Label -- before 09/04/2018
    formatLabel: function(content, unit) {
      console.log(unit)
      if (content == null || content == 0) {
        return '';
      } else {
        if (unit == '€' || unit == '$') {
          content = Number(content)
          return unit + " " + content.formatMoney(2);
        } else if (unit == '%') {
          content = Number(content)
          return Math.floor(content) + " %";
        } else {
          return content + " " + unit;
        }
      }
    }, */
    formatLabel: function(content, unit) {
      var isMoney = unit.includes("€") || unit.includes("$");

      if (content == null || content == 0) {
        return '';
      } else {
        if (isMoney) {
          content = Number(content)
          return content.formatMoney(0) + " " + unit;
        } else if (unit == '%') {
          content = Number(content)
          return Math.floor(content) + " %";
        } else if (unit == '% calc') {
          content = Number(content)
          content = content.toFixed(1);
          content = this.replaceDots(content);
          return content + " %";
        } else if(unit == '% rag') {
          content = Number(content)
          content = content.toFixed(2);
          content = this.replaceDots(content);
          return content + " %";
        } else {
          try {
            content = String(content);
          } catch(err){}
          content = this.replaceDots(content);
          return content + " " + unit;
        }
      }
    },
    replaceDots(s){
      console.log(s)
      return s.replace(".", ",");
    },
    toggleChilds(id) {

      for (let i = 0; i < this.tabella.length; i++) {

        if (this.tabella[i].hasChild && this.tabella[i].id == id) {
          this.tabella[i].expanded = !this.tabella[i].expanded
        }

        if (!this.tabella[i].hasChild && this.tabella[i].father == id && this.tabella[i].father != this.tabella[i].id) {
          this.tabella[i].visible = !this.tabella[i].visible
        }
      }
    },
    calcolaLarghezzaColonne() {
      var total = 0
      for (var i = 0; i < this.headers.length; i++) {
        total += this.headers[i].visible ? this.headers[i].width : 0;
      }
      // ricalcolo le percentuali in proporzione alla larghezza disponibile
      var percentage_covered = 0;
      for (var i = this.headers.length - 1; i > 0; i--) {
        var proporzione = Math.floor(total * this.headers[i].width / 100);
        percentage_covered += proporzione;
        this.headers[i].width = proporzione + '%'
      }
      this.headers[0].width = (100 - percentage_covered) + '%'
    }
  }
}
</script>
<style scoped>
/*
div.body-etichetta {
  font-size: 1.5rem; 
  font-weight: 400;
}
*/

div.body-etichetta {
  font-size: 1.2rem; 
  font-weight: 400;
}

.label-etichetta { 
  font-weight: 400;
}

.var-container{
  margin-left: 10px;
}

div.body-sub-etichetta {
  font-size: 1.2rem; 
  font-weight: 300;
  padding: 6px 12px !important;
}

.label-sub-etichetta { 
  font-weight: 300;
}

.sub-panel { 
  border-style: none;
}

::-webkit-scrollbar-track {
  background-color: #fff;
}

th {
  background-color: #42a5f5;
  color: white;
  padding: 10px;
  font-size: 1.5rem;
  font-weight: 300;
  border-right: 1px solid white;
  border-left: 1px solid white;
  text-align: center;
}

td {
  padding-left: 10px;
  padding-rigth: 10px;
  padding-top: 5px;
  padding-bottom: 5px;
  border-bottom: 1px solid #ddd;
  border-left: 1px dotted #eee;
  border-right: 1px dotted #eee;
  text-align: right;
  font-size: 1.1rem;
}
/*
.right-labels {
  margin-bottom: 10px;
}
*/

.right-labels {
  margin-bottom: 5px;
}
/*
.right-labels>.panel-body {
  padding: 12px;
}
*/
.right-labels>.panel-body {
  padding: 8px 12px;
}

.alternata {
  /*
    background-color: #f5f5f5;
*/
}

.kpi {
  text-align: left;
}

.non-kpi {
  padding: 10px 4px;
}

.editable {
  line-height: initial;
}

tr:hover {
  background-color: #ddd !important;
}

.padre {
  font-weight: 500;
  padding-right: 4px;
}

.figlio {
  font-weight: 300;
  padding-left: 50px !important;
  padding-right: 4px;
}

.figlioDx {
  padding-left: 10px !important;
}

.tab-pane {}

div#table-content {
  overflow-y: scroll;
  max-height: 55vh;
}

.margin0 {
  margin: 0px;
}
</style>
<style>
span.blank_son>span {
  display: inline-block;
  margin-right: 34px;
}
</style>
