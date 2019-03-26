<template>
   <div>
        <div class="row" v-if="loaded"> 
            <div id="scheduler_here" class="dhx_cal_container col-xs-12">
                <div id="dhx_navline" class="dhx_cal_navline">
                    <div class="dhx_cal_prev_button" style="right:100px;"></div>
                    <div class="dhx_cal_today_button" id="today" style="right:32px;"></div>
                    <div class="dhx_cal_next_button" style="right:0px;"></div>
                    <div class="dhx_cal_date"></div>
                    <div class="dhx_cal_tab" id="year" name="year_tab"></div>
                    <!-- timeline -->
                    <div class="dhx_cal_tab" name="timeline_tab" v-show="!hide_timeline"></div>
                    <!-- minical -->
                    <div class="dhx_minical_icon" id="dhx_minical_icon" :class="{'minical_alone': min_alone}" @click="show_minical()">&nbsp;</div>
                    <div class="dhx_cal_tab" name="day_tab" id="day" style="right:204px;"></div>
                    <div class="dhx_cal_tab" name="week_tab" id="week" style="right:140px;"></div>
                    <div class="dhx_cal_tab" name="month_tab" id="month" style="right:76px;"></div>

                    <div class="btn-group" style="right:145px;">
                        <button class="btn btn-default" style="height: 36px;">Corsi</button>
                        <button data-toggle="dropdown" class="btn btn-default dropdown-toggle" data-placeholder="false"
                         style="height: 36px;">
                            <span class="caret"></span>
                        </button>
                        <ul id="corsi" class="dropdown-menu" style="padding: 5px;">
                            <li v-for="(mc, index) in menu_corsi">
                                <input type="checkbox" :id="'corso_' + index" :name="'corso_' + index" v-model="mc.checked"
                                @change="checkedBox('corso', index, this.checked)">
                                <label :for="'corso_' + index">{{mc.valore}}</label>
                            </li>
                        </ul>
                    </div>
                </div>
                <div id="dhx_header" class="dhx_cal_header"></div>
                <div id="dhx_data" class="dhx_cal_data"></div>
            </div>
        </div>

        <div v-else class='uil-rolling-css' style='transform:scale(0.71); 
        position: absolute; margin: 0 auto; top: 100px; right: 0px; left: 0px;'>
            <div>
                <div></div>
                <div></div>
            </div>
        </div>
    </div>
</template>

<style scoped>
    #scheduler_here {
        position: absolute;
        width: 98%;
        height: 100%;
        background-color: transparent;
    }

    .dhx_cal_data {
        border-top-style: none;
    }
    .dhx_cal_header {
        border-style: solid;
        border-width: 1px;
        border-color: rgb(206, 206, 206);
        border-left-style: none;
    }
</style>

<script>

scheduler.templates.tooltip_text = function (start, end, ev) {
    return "<b>Partecipanti:</b> " + ev.partecipanti + "<br/><b>Corso:</b> " + ev.titolo + "<br/><b>Docente:</b> " + ev.docente + "<br/><b>Aula:</b> " + ev.aula + "<br/><b>Inizio:</b> " + scheduler.templates.tooltip_date_format(start) +
        "<br/><b>Fine:</b> " + scheduler.templates.tooltip_date_format(end);
};

scheduler.templates.event_bar_text = function(start,end,ev){
      return ev.partecipanti + " - " + ev.titolo;
};

scheduler.templates.event_text = function(start,end,ev){
      return "<b>Corso: </b> " + ev.titolo + "<br/><b>Partecipanti: </b>" + ev.partecipanti;
};

var vm;
import ElementQueries from 'css-element-queries';
var hml = 0;

export default {
    props: {
        configs: Object
    },
    mounted: function(){
        vm = this;
        this.getCalendarData();
    },
    data: function(){
        return {
            newScheduler : true,
            loaded: false,
            corsi : {
                "data": [{
                    "idAttivita": 6,
                    "dataAttivita": "12/03/2016",
                    "daOraAttivita": "09:00",
                    "aOraAttivita": "13:00",
                    "idEdizione": 2662,
                    "edizione": "!2/03 MI",
                    "idCorso": 4,
                    "titoloCorso": "Excel avanzato",
                    "idAula": 1,
                    "aula": "Aula 1",
                    "numeroPostiAula": 40,
                    "coloreAula": 123134,
                    "docente": "MONICA CASADEI 1"
                }, {
                    "idAttivita": 7,
                    "dataAttivita": "19/03/2016",
                    "daOraAttivita": "09:00",
                    "aOraAttivita": "13:00",
                    "idEdizione": 2662,
                    "edizione": "!2/03 MI",
                    "idCorso": 4,
                    "titoloCorso": "Excel avanzato",
                    "idAula": 1,
                    "aula": "Aula 1",
                    "numeroPostiAula": 40,
                    "coloreAula": 123134,
                    "docente": "Lucia Arrigo 2"
                }, {
                    "idAttivita": 8,
                    "dataAttivita": "21/03/2016",
                    "daOraAttivita": "14:00",
                    "aOraAttivita": "18:00",
                    "idEdizione": 2662,
                    "edizione": "!2/03 MI",
                    "idCorso": 4,
                    "titoloCorso": "Excel avanzato 3",
                    "idAula": 1,
                    "aula": "Aula 1",
                    "numeroPostiAula": 40,
                    "coloreAula": 123134,
                    "docente": "MASSIMO ARGILLI 3"
                }, {
                    "idAttivita": 9,
                    "dataAttivita": "30/03/2016",
                    "daOraAttivita": "14:00",
                    "aOraAttivita": "18:00",
                    "idEdizione": 2662,
                    "edizione": "!2/03 MI",
                    "idCorso": 4,
                    "titoloCorso": "Excel avanzato",
                    "idAula": 1,
                    "aula": "Aula 1",
                    "numeroPostiAula": 40,
                    "coloreAula": 123134,
                    "docente": "LUIGI BERRA 4"
                }, {
                    "idAttivita": 10,
                    "dataAttivita": "15/03/2016",
                    "daOraAttivita": "09:00",
                    "aOraAttivita": "13:00",
                    "idEdizione": 1,
                    "edizione": "15/03 BO",
                    "idCorso": 2,
                    "titoloCorso": "Acquisti avanzato",
                    "postiTotaliCorso": 10,
                    "postiTotaliCorso_O": "",
                    "idAula": 2,
                    "aula": "Aula 2",
                    "numeroPostiAula": 35,
                    "coloreAula": 555555,
                    "docente": "Carlo Tattani 5"
                }, {
                    "idAttivita": 11,
                    "dataAttivita": "29/03/2016",
                    "daOraAttivita": "09:00",
                    "aOraAttivita": "13:00",
                    "idEdizione": 1,
                    "edizione": "15/03 BO",
                    "idCorso": 2,
                    "titoloCorso": "Acquisti avanzato",
                    "postiTotaliCorso": 10,
                    "postiTotaliCorso_O": "",
                    "idAula": 2,
                    "aula": "Aula 2",
                    "numeroPostiAula": 35,
                    "coloreAula": 555555,
                    "docente": "Carlo Tattani 6"
                }, {
                    "idAttivita": 13,
                    "dataAttivita": "30/03/2016",
                    "daOraAttivita": "14:00",
                    "aOraAttivita": "18:00",
                    "idEdizione": 1,
                    "edizione": "15/03 BO",
                    "idCorso": 2,
                    "titoloCorso": "Acquisti avanzato",
                    "postiTotaliCorso": 10,
                    "postiTotaliCorso_O": "",
                    "idAula": 2,
                    "aula": "Aula 2",
                    "numeroPostiAula": 35,
                    "coloreAula": 555555,
                    "docente": "MONICA CASADEI 7"
                }, {
                    "idAttivita": 12,
                    "dataAttivita": "30/03/2016",
                    "daOraAttivita": "09:00",
                    "aOraAttivita": "13:00",
                    "idEdizione": 1,
                    "edizione": "15/03 BO",
                    "idCorso": 2,
                    "titoloCorso": "Acquisti avanzato",
                    "postiTotaliCorso": 10,
                    "postiTotaliCorso_O": "",
                    "idAula": 2,
                    "aula": "Aula 2",
                    "numeroPostiAula": 35,
                    "coloreAula": 555555,
                    "docente": "LUIGI BERRA 8"
                }, {
                    "idAttivita": 14,
                    "dataAttivita": "02/04/2016",
                    "daOraAttivita": "14:00",
                    "aOraAttivita": "18:00",
                    "idEdizione": 1,
                    "edizione": "15/03 BO",
                    "idCorso": 2,
                    "titoloCorso": "Acquisti avanzato",
                    "postiTotaliCorso": 10,
                    "postiTotaliCorso_O": "",
                    "idAula": 2,
                    "aula": "Aula 2",
                    "numeroPostiAula": 35,
                    "coloreAula": 555555,
                    "docente": "Lucia Arrigo 9"
                }, {
                    "idAttivita": 35,
                    "dataAttivita": "20/12/2017",
                    "daOraAttivita": "09:00",
                    "aOraAttivita": "13:00",
                    "idEdizione": 2680,
                    "edizione": 2680,
                    "idCorso": 3,
                    "titoloCorso": "Excel base",
                    "idAula": 1,
                    "aula": "Aula 1",
                    "numeroPostiAula": 40,
                    "coloreAula": 123134,
                    "docente": "LUIGI BERRA 10"
                }, {
                    "idAttivita": 36,
                    "dataAttivita": "21/12/2017",
                    "daOraAttivita": "09:00",
                    "aOraAttivita": "13:00",
                    "idEdizione": 2680,
                    "edizione": 2680,
                    "idCorso": 3,
                    "titoloCorso": "Excel base",
                    "idAula": 2,
                    "aula": "Aula 2",
                    "numeroPostiAula": 35,
                    "coloreAula": 555555,
                    "docente": "MONICA CASADEI 11"
                }, {
                    "idAttivita": 4,
                    "dataAttivita": "16/03/2016",
                    "daOraAttivita": "14:00",
                    "aOraAttivita": "18:00",
                    "idEdizione": 2661,
                    "edizione": "Edizione 1",
                    "idCorso": 4,
                    "titoloCorso": "Excel avanzato",
                    "idAula": 2,
                    "aula": "Aula 2",
                    "numeroPostiAula": 35,
                    "coloreAula": 555555,
                    "docente": "DAVIDE TURA 12"
                }, {
                    "idAttivita": 3,
                    "dataAttivita": "16/03/2016",
                    "daOraAttivita": "09:00",
                    "aOraAttivita": "13:00",
                    "idEdizione": 2661,
                    "edizione": "Edizione 1",
                    "idCorso": 4,
                    "titoloCorso": "Excel avanzato",
                    "idAula": 2,
                    "aula": "Aula 2",
                    "numeroPostiAula": 35,
                    "coloreAula": 555555,
                    "docente": "LUIGI BERRA 13"
                }]
            },
            events: [],
            sezioni: [],
            menu_corsi: [],
            sections: [],
            hide_timeline: false,
            min_alone: false
        }
    },
    methods: {
        getCalendarData: function(){
            this.loaded = false;
            var stringa_persone = localStorage.getItem("idpersona");
            if(this.configs != null){
                console.log("CONFIGS OBJECT PASSED")
                this.fetchCalendarData(stringa_persone, this.configs.corso, this.configs.edizione);
            } else if(this.$root.inCharge && this.$root.inCharge.is){
                var persone;
                stringa_persone = [];
                var uos = this.$root.inCharge.uos.join(";");
                this.$http.get(localStorage.getItem("path")+"/APIPersonaUO?IDUnitàOrganizzativa="+uos)
                .then((response) => {
                    var res = response.body;
                    try {
                        res = JSON.parse(response.body);
                    } catch (err) {};

                    if(res && res.APIPersonaUO){
                        for(var i = 0; i < res.APIPersonaUO.length; i++){
                            if(stringa_persone.indexOf(res.APIPersonaUO[i].IDPersona) == -1){
                                stringa_persone.push(res.APIPersonaUO[i].IDPersona);
                            }
                        }
                    }
                    stringa_persone = stringa_persone.join(",");
                    if(stringa_persone==''){
                        stringa_persone = localStorage.getItem("idpersona");
                    }
                    console.log(stringa_persone);
                    this.fetchCalendarData(stringa_persone);
                });
            } else {
                this.fetchCalendarData(stringa_persone);
            }
            
        },
        fetchCalendarData: function(stringa_persone, corso, edizione){
            console.log(this.configs)
            if(corso != null && edizione != null){
                var json = {
                    "Data":"2017-07-01",
                    "StringaIdPersone": stringa_persone,
                    "IdCorso": corso,
                    "IdEdizione": edizione,
                    "IdAttivita": 0
                };
            } else {
                var json = {
                    "Data":"2017-07-01",
                    "StringaIdPersone": stringa_persone,
                    "IdCorso": 0,
                    "IdEdizione": 0,
                    "IdAttivita": 0
                };
            }
            
            this.$http.post(localStorage.getItem("path")+"/Webapi", json, {
                headers: {
                    "X-HTTP-Method-Override": "GetJSONCalendarioFormazione",
                    "Content-Type": "application/json"
                }
            }).then((response) => {

                var res = response.body
                try {
                    var res = JSON.parse(response.body);
                } catch (err) {}
                if(res){
                    this.corsi = res;
                    console.log(this.corsi)
                }
                localStorage.setItem("corsi_json", JSON.stringify(this.corsi));
                this.loaded = true;
                this.$nextTick(function(){
                    this.initDataStructure();
                })
                console.log(response);
            }, (err) => {

                localStorage.setItem("corsi_json", JSON.stringify(this.corsi));
                this.loaded = true;
                this.$nextTick(function(){
                    this.initDataStructure();
                })
                console.log(err);
            })
        },
        initDataStructure: function(){
            // popola l'array degli eventi
            scheduler.clearAll();
            this.events = [];
            this.sezioni = [];
            this.menu_corsi = [];
            this.sections = [];
            this.hide_timeline = false;
            this.min_alone = false;
            for (var i = 0; i < this.corsi.data.length; i++) {
                // task dal json
                var oggetto = this.corsi.data[i];

                // start date
                var anno, mese, giorno, ora;

                anno = oggetto.dataAttivita.substr(6, 4);
                mese = oggetto.dataAttivita.substr(3, 2);
                giorno = oggetto.dataAttivita.substr(0, 2);

                var data = anno + "-" + mese + "-" + giorno;

                // aggiunta evento all'array
                this.events.push({
                    id: oggetto.idAttivita,
                    idEdizione: oggetto.idEdizione,
                    start_date: data + " " + oggetto.daOraAttivita,
                    end_date: data + " " + oggetto.aOraAttivita,
                    text: oggetto.titoloCorso + " - " + oggetto.edizione,
                    section_name: oggetto.titoloCorso,
                    color: (oggetto.coloreAula !== "#000000") ? oggetto.coloreAula : "#5B9BE0",
                    titolo: oggetto.titoloCorso,
                    edizione: oggetto.edizione,
                    docente: oggetto.docente,
                    aula: oggetto.aula,
                    partecipanti: oggetto.partecipanti
                });
            }
            // END EVENTS Array Creation
            var contatore = 0;
            for (i = 0; i < this.events.length; i++) {
                var nome = this.events[i].section_name;
                var pos_sezioni = this.sezioni.indexOf(nome);

                // sezioni (taskName)
                if (pos_sezioni === -1) {
                    contatore++;
                    this.sezioni.push(nome);
                    this.sections.push({
                        key: contatore,
                        label: nome
                    });
                    this.menu_corsi.push({
                        valore: this.events[i].section_name,
                        checked: true
                    });
                }

                this.events[i].section_id = this.sezioni.indexOf(nome) + 1;
            }
            this.setConfigs();
        },
        setConfigs: function(){
            console.log(this.sezioni.length)
            if (this.sezioni.length == 1) {
                // nasconde il pulsante della timeline
                scheduler.locale.labels.timeline_giorno_tab = "";
                this.hide_timeline = true;
                // sposta il minical
                this.min_alone = true;
            } else {
                // se è più di uno
                scheduler.locale.labels.timeline_tab = "Corsi";
            }

            hml++;

            if(hml == 1){
                // configurazione della timeline
                scheduler.createTimelineView({
                    name: "timeline",
                    x_unit: "minute",
                    x_date: "%i",
                    x_step: 30,
                    x_size: 24,
                    x_start: 16,
                    x_length: 48,
                    y_unit: this.sections,
                    y_property: "section_id",
                    render: "bar",
                    event_dy: "full",
                    second_scale: {
                        x_unit: "hour", // unit which should be used for second scale
                        x_date: "%H" // date format which should be used for second scale, "July 01"
                    }
                });

                //evidenzia i weekends
                scheduler.addMarkedTimespan({
                    days: [6, 0],
                    zones: "fullday",
                    css: "weekend"
                });
            }

            scheduler.locale.labels.section_custom = "Section";
            scheduler.config.details_on_create = false;
            scheduler.config.details_on_dblclick = false;
            scheduler.config.xml_date = "%Y-%m-%d %H:%i";
            scheduler.config.show_quick_info = false;
            scheduler.config.mark_now = true;
            scheduler.config.dblclick_create = false;

            scheduler.attachEvent("onViewChange", function (new_mode, new_date) {
                localStorage.setItem("view", new_mode);
                localStorage.setItem("date", new_date);
            });

            scheduler.attachEvent("onDblClick", function (id, e) {
                // chiama INDE per l'apertura dei dettagli di una azione

                //var result = $.grep(this.events, function(e){ return e.id == id; });
                console.log(id)
                console.log(e)
                //new parent.IDEvent('cmd', "", null, parent.RD3_Glb.EVENT_ACTIVE, 'ApriDettaglioEdizione,' + result[0].idEdizione);
            });

            this.initScheduler();
        },
        initScheduler: function(){
            // INIT dello scheduler
            if (this.newScheduler) {
                // se è una nuova apertura, parte con le impostazioni di default:
                // view: timeline e date: oggi
                if (this.sezioni.length == 1) {
                    scheduler.init('scheduler_here', new Date(), "month");
                } else {
                    scheduler.init('scheduler_here', new Date(), "timeline");
                }
                this.renameLabels()
            } else {
                // se non è una nuova apertura, carica dal localStorage del browser
                // i valori della view e date
                var vista = localStorage.getItem("view");
                var data = localStorage.getItem("date");
                scheduler.init('scheduler_here', new Date(data), vista);
            }
            scheduler.parse(JSON.stringify(this.events), "json");

            var x = new ElementQueries.ResizeSensor($('#scheduler_here'), function(){ 
                scheduler.updateView();
            });
            scheduler.updateView();
        },
        renameLabels: function(){
            this.$nextTick(function(){
                document.getElementById("day").innerText = "Giorno"
                document.getElementById("week").innerText = "Settimana"
                document.getElementById("month").innerText = "Mese"
                document.getElementById("year").innerText = "Anno"
                document.getElementById("today").innerText = "Oggi"
            })
        },
        show_minical: function() {
            if (scheduler.isCalendarVisible()){
                scheduler.destroyCalendar();
            } else {
                scheduler.renderCalendar({
                    position: "dhx_minical_icon",
                    date: scheduler._date,
                    navigation: true,
                    handler: function (date, calendar) {
                        scheduler.setCurrentView(date);
                        scheduler.destroyCalendar();
                    }
                });
            }
        },
        checkedBox: function(serie, valore, selezionato){
            console.log("box")
            console.log(serie);
            console.log(valore);
            console.log(this.menu_corsi[valore].checked)

            // quale voce di quale menu è stato selezionato?
            switch (serie) {
                case "corso":
                    //this.menu_corsi[valore].checked = selezionato;
                    break;
                case "ambito":
                    //menu_ambiti[valore].checked = selezionato;
                    break;
                case "stato":
                    //menu_stati[valore].checked = selezionato;
                    break;
                default:
                    break;
            }

            // applica i filtri in base alle scelte delle voci dei dropdown menu
            var vm = this;
            scheduler.filter_year = scheduler.filter_month = scheduler.filter_day = scheduler.filter_week = scheduler.filter_timeline = function (id, elemento){

                // filtro per le corsi
                var m_corso = vm.menu_corsi.filter(function (obj) {
                    return obj.valore == elemento.section_name;
                });
                var risposta = m_corso[0].checked;
                return risposta;
            };
            scheduler.updateView();
        }
    }
}
</script>
<style>
    /*Evento a calendario - Mese*/
	.dhx_cal_event_clear.dhx_cal_event_line_start.dhx_cal_event_line_end{
        line-height: normal;
        text-overflow: ellipsis;
    }
    .dhx_cal_event_clear {
        color: black;
    }
    #month{
        left: 146px !important;
    }
    #week{
        left: 79px !important;
    }
</style>