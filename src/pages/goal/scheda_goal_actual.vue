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
                                                <h5 style="margin-bottom:5px;" class="margin0"><strong>ADB/COE:</strong> {{goal.NomeUO}}</h5>
                                                <h5 style="margin-bottom:5px;" class="margin0"><strong>{{s.stato[l]}}:</strong> {{goal.Descrizione}}</h5>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <!-- CARD con target variabile-->
                                <div class="col-xs-12 col-sm-6">
                                    <div class="panel panel-default">
                                        <div class="panel-body" style="font-size: 1.5rem; font-weight: 100;">
                                            <span class="pull-left" style="font-weight: 400;">{{s.variabileTarget[l]}}</span>
                                            <span class="pull-right" v-if="goal.PremioMassimo">€ {{ goal.PremioMassimo.formatMoney(2)}}</span>
                                        </div>
                                    </div>
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
                                                            <th v-for="(h, c) in headers" :class="{kpi: c == 0}" :width="span[c]">{{h}}</th>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div id="table-content">
                                                <table width="100%">
                                                    <tbody>
                                                        <tr v-for="(oggetto, index) in tabella" :key="index" :class="{alternata: index%2 == 1}">
                                                            <!-- celle -->
                                                            <td v-for="(valore, col) in oggetto.values" :class="{kpi: col == 0, figlio: oggetto.id != oggetto.father, padre: oggetto.id == oggetto.father, figlioDx: (oggetto.id != oggetto.father && col != 0)}" :width="span[col]" @click="toggleChilds(oggetto.id)" v-show="oggetto.visible">
                                                                <span v-html="valore + ((oggetto.hasChild && col == 0) ? (oggetto.expanded ? minus : plus) :'')"></span>
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

var headers = ['KPI', 'Peso', 'Target', 'Note']
var span = ['55%', '15%', '15%', '15%']

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

export default {
    mounted: function() {
        vm = this;

        this.$nextTick(function() {
            this.idvalutazione = this.$route.path.split('/')[2];

            this.headers = ['KPI', this.s.weight[this.l], 'Target', this.s.note[this.l]];

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
            headers: headers,
            span: span,
            tabella: [],
            plus: '<i class="fa fa-plus-square" aria-hidden="true" style="font-size: 1.3rem; color: #bbb;margin-left:10px;"></i>',
            minus: '<i class="fa fa-minus-square" aria-hidden="true" style="font-size: 1.3rem; color: #bbb;margin-left:10px;"></i>',
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
            var path = "pdf/MBO 2017 - KPI Calculation Model - " + lang.toUpperCase() + ".pptx";
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
                                    descrizioneValore = '<i class="fa fa-info-circle" style="visibility: hidden; font-size: 1.3rem; color: #fff; margin-right:10px;"></i>' + riga.Indicatore
                                }
                            }

                            var valorePeso = riga.Peso ? riga.Peso + '%' : ''

                            var valoreTarget;
                            if (riga.ValoreTarget) {
                                if (riga.UnitaDiMisura == '€' || riga.UnitaDiMisura == '$') {
                                    valoreTarget = riga.UnitaDiMisura + ' ' + riga.ValoreTarget.formatMoney(2)
                                } else if (!riga.UnitaDiMisura) {
                                    valoreTarget = riga.ValoreTarget
                                } else {
                                    valoreTarget = riga.ValoreTarget + ' ' + riga.UnitaDiMisura
                                }

                            } else {
                                valoreTarget = ''
                            }

                            var note = riga.NoteObiettivo ? riga.NoteObiettivo : '';

                            this.tabella.push({
                                id: riga.IDKPIDettaglio ? Math.pow(riga.IDKPIFather, 2) + riga.IDKPI : riga.IDKPI,
                                father: riga.IDKPIFather,
                                hasChild: (riga.HasChild == -1) ? true : false,
                                visible: true,
                                expanded: true,
                                values: [descrizioneValore, valorePeso, valoreTarget, note],
                                unitaMisura: riga.UnitaDiMisura,
                                description: riga.DescrizioneRegole ? riga.DescrizioneRegole : ''
                            })
                        }
                    }
                }, (err) => {
                    console.log("caught APIKPIVALUTAZIONE?IDValutazione= GetTable error");
                })
            }
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
        }
    }
}
</script>
<style scoped>
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

.alternata {
    /*
    background-color: #f5f5f5;
*/
}

.kpi {
    text-align: left;
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
