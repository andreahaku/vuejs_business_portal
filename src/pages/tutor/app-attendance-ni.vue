<template>
<div class="st-pusher" id="content">
  <div class="st-content">
    <div class="st-content-inner padding-none">
      <div class="container-fluid">
        <div class="page-section row" style="padding-bottom: 0px; padding-top: 5px;">
          <div style="float: right;">
                 <router-link tag="button" :to="{ name: 'lista-edizioni'}" class="btn btn-primary btn-sm" type="button" style="margin:10px 5px 0px 5px;">TORNA ALL'INDICE<i class="fa fa-reply" aria-hidden="true" style="padding:0px 5px 0px 10px;"></i></router-link>
          </div>
          <div class="media v-middle col-xs-12 col-md-8">
            <div  class="media-body">

              <div class="media-left">
                <h1 class="text-display-1" style="margin-top: 0px;">Registrazione presenze e assenze</h1>
                <div v-if="sessione">
                  <h4 class="text-headline margin-none" style="text-align: left;">{{sessione.titoloCorso}}</h4>
                  <p class="text-subhead" style="margin: 0px;"><strong>Edizione: </strong>{{sessione.edizione}}</p>
                  <p class="text-subhead" style="margin: 0px;"><strong>Sessione: </strong>{{sessione.dataAttivita}}<span>, Ore </span>
                  <span>{{sessione.daOraAttivita.split(" ")[1] + " - " + sessione.aOraAttivita.split(" ")[1]}}</span></p>
                </div>
                
              </div>
              
            </div>
          </div>
        </div>
        <div v-if="loading" class='uil-rolling-css' style='transform:scale(0.71);
            position: absolute; margin: 0 auto; top: 150px; right: 0px; left: 0px;'>
          <div>
            <div></div>
            <div></div>
          </div>
        </div>
        <div v-else class="row">
          <div class="col-xs-12" style="margin-bottom: 10px;">
            <a v-if="missing.length < jqx_source_data.length" class="btn btn-success" style="float: right; padding: 6px 8px; font-size: smaller; margin-top: 3px; margin-left: 10px;" @click="allIn"><i class="fa fa-user" style="margin-right: 5px;"></i> SEGNA TUTTI PRESENTI</a>
            <a v-if="missing.length > 0" class="btn btn-warning" style="float: right; padding: 6px 8px; font-size: smaller; margin-top: 3px;" @click="allOut"><i class="fa fa-trash" style="margin-right: 5px;"></i> SVUOTA PRESENZE</a>
            
            <h4 class="text-headline" style="margin: 2px 0px 5px 0px; display: inline-block;">Iscritti</h4>
            <div v-if="updating" class="cs custom_spinner" style="margin-left: 10px;"></div>
            <jqx-grid :columns="subscribedHeaders" :source="jqx_source_data" :options="subscribedOptions" lang="it" :name="subId"  :others="{'adaptColumns': true}"
            @API="fetchSubAPI" @jqxGridEvent="catchSubscribedEventPropagation"></jqx-grid>
          </div>
          
        </div>

      </div>
    </div>
  </div>
</div>
</div>
</template>
<script>
import jqxGrid from '../_fullDyn/jqwGrid/jqwGridWrapper.vue'
import {localizationMixin} from '../_fullDyn/jqwGrid/localization.js'
import { eventBus } from '../../eventbus.js'


function toggleImg(row) {
  var d = document.getElementById(row).style.display;
  d = d == "none" ? "inline" : "none";
  document.getElementById(row).style.display = d;
}

var vm;
export default {
  mounted: function() {
    vm = this;
    this.$nextTick(this.init)
  },
  data: function() {
    return {
      path: localStorage.getItem("path"),
      loading: true,
      updating: false,
      sessione: null,
      source: null,

      //subscribed grid info
      jqx_source_data: [],
      subId: 'subGrid',
      wrapper: '#subGrid',
      subAPI: {},
      subscribedHeaders: [{
          text: 'Persona',
          datafield: 'Persona',
          width: '25%',
          type: 'string',
          editable: false,
          pinned: true,
          tobecellsrenderered: function (data_row, row, columnfield, value, defaulthtml, columnproperties) {
            return '<div style="text-align:left;"><img style="margin: 1px 10px 1px 1px;" height="50" width="50" src="' + data_row.Immagine + '"/>' +
              value + '</div>';
          } 
        },
        {
          text: 'Unità Organizzativa',
          datafield: 'UO',
          filtertype: 'checkedlist',
          editable: false,
          width: '20%'
        },
        {
          text: 'Presente',
          datafield: 'StringAttendance',
          width: '10%',
          filtertype: 'checkedlist',
          editable: false,
          filteritems: ['Presente', 'Assente'],
          tobecellsrenderered: function (data_row, row, columnfield, value, defaulthtml, columnproperties) {
            if (data_row.Attendance) {
              return '<div style="text-align:center; display: table; height: 100%; width: 100%;"><div style="display: table-cell; vertical-align: middle;"><i class="fa fa-check" style="font-size: 1.3em; color: #42b983"></i></div></div>';
            } else {
              vm.$nextTick(function(){
                document.getElementById("sign_"+data_row.ID).addEventListener("touchstart", function(){
                  vm.startInsert([data_row])
                });
              })
              vm.$nextTick(function(){
                document.getElementById("sign_"+data_row.ID).addEventListener("mousedown", function(){
                  vm.startInsert([data_row])
                });
              })

              return '<div style="text-align:center; display: table; height: 100%; width: 100%;"><div class="signAttendance fa" id="sign_' + data_row.ID + '"></div></div>';
            }
          }
        },
        {
          text: 'Ora Entrata',
          datafield: 'Entrata',
          width: '12%',
          cellsformat : "d2",
          //columntype: "datetimeinput",
          columntype: "numberinput",
          //todo add validator
          createeditor: function (row, cellvalue, editor) {
              console.log("creating editor !!!! ")
              console.log(editor)
              //editor.jqxDateTimeInput({ formatString: "hh:mm", showCalendarButton: false, showTimeButton: true});
              editor.jqxNumberInput({ digits: 4 });
          },
          validation: function (cell, value) {
            if(value < 0 || value > 23.59 || value % 1 > 0.59){
              return { result: false, message: "L'ora inserita non è valida" };
            }
            return true;
          }
        },
        {
          text: 'Ora Uscita',
          datafield: 'Uscita',
          width: '12%',
          cellsformat : "d2",
          columntype: "numberinput",
          createeditor: function (row, cellvalue, editor) {
              console.log("creating editor !!!! ")
              editor.jqxNumberInput({ digits: 4 });
          },
          validation: function (cell, value) {
            if(value < 0 || value > 23.59 || value % 1 > 0.59){
              return { result: false, message: "L'ora inserita non è valida" };
            }
            return true;
          }
        },
        {
          text: 'Ore Totali Presenza',
          datafield: 'OreTotali',
          width: '11%',
          cellsformat : "d2",
          cellsalign: 'right',
          editable: false,
          hidden: true,
          columntype: "numberinput"
        },
        {
          text: 'Rimuovi Presenza',
          datafield: 'IDPresenza',
          width: '10%',
          filterable: false,
          editable: false,
          tobecellsrenderered: function (data_row, row, columnfield, value, defaulthtml, columnproperties) {
            if(data_row.Attendance){
              vm.$nextTick(function(){
                if(!vm.$root.xs){
                  document.getElementById("remove_"+row).addEventListener("mousedown", function(){
                    vm.startRemove(value);
                  });
                } else {
                  document.getElementById("remove_"+row).addEventListener("touchstart", function(){
                    vm.startRemove(value);
                  });
                }
              })
              return '<div style="text-align:center; display: table; height: 100%; width: 100%;"><div style="display: table-cell; vertical-align: middle;"><a id="remove_' + row + '" class="btn btn-warning" style="padding: 2px 6px;" @click=""><i class="fa fa-times"></i></a></div></div>';
            } else {
              return ''
            }
          } 
        }
      ],
      subscribedOptions: {
        columnsresize: this.$root.xs ? false : true,
        rowsheight: 52,
        theme: 'glacier',
        width: '100%',
        selectionmode: 'none',
        pageable: true,
        showfilterrow: true,
        editable: true,
        editmode: 'programmatic',
        filterable: true,
        sortable: true,
        autoheight: true,
        columnsreorder: true,
        rowdetails: false,
        rowdetailstemplate: {
          rowdetails: "<div style='margin: 10px 10px 10px 0px;'>Override this</div>",
          rowdetailsheight: 100
        }
      },

      //attendace grid info
      missing: []
      /*
      attendanceOptions: {
        selectionmode: "none",
        filterable: true,
        showfilterrow: true,
        columnsresize: this.$root.xs ? false : true,
        editable: true,
        editmode: !this.$root.xs ? 'click' : 'programmatic',
        enabletooltips: true,
        columnsreorder: true,
        rowdetails: !this.$root.xs ? false : true,
        rowdetailstemplate: {
          rowdetails: "<div style='margin: 10px 10px 10px 0px;'>Override this</div>",
          rowdetailsheight: 100
        },
        initrowdetails: this.initrowdetails,
        rowsheight: 52,
        pagesize: 10
      }*/
    }
  },
  mixins: [localizationMixin],
  components: {
    jqxGrid
  },
  methods: {
    init: function() {
      this.jqx_source_data = [];
      this.missing = [];
      this.fetchFromWebapi();
    },
    insertAttendance: function(row, index) {
      this.missing.splice(index, 1);
      this.jqx_source_data.unshift(row);
      var commit = $(this.wrapper).jqxGrid('addrow', null, row, 'first');
    },
    missingRow: function(index, row) {
      this.missing.push(row);
      this.jqx_source_data.splice(index, 1);
          
      //aggiorno la griglia
      this.subAPI.redraw();
    },
    getTimeDifference: function(u, e){
      var ore = null;
      try {
        var date_e = new Date(2000, 0, 1, Math.floor(Number(e)), Number((Number(e) % 1).toFixed(2)) * 100);
        var date_u = new Date(2000, 0, 1, Math.floor(Number(u)), Number((Number(u) % 1).toFixed(2)) * 100);
        
        var ms = date_u - date_e
        ore = new Date(ms);
        var min_offset = ore.getTimezoneOffset() * 60000;
        ms += min_offset;
        ore =  new Date(ms);
        var m = ore.getMinutes().toString();
        
        ore = ore.getHours() + "." + (m.length == 1 ? "0" + m : m);

        return ore;
      } catch(err){
        return null;
      }
    },
    startInsert: function(value){
      var vm = this;
      
      //da: array partecipazioni => a: array presenze inserite preventivamente
      var new_attendance = value.map(function(obj){
        var e = null;
        var u = null;
        var ore = null;

        try {
          e = vm.sessione.daOraAttivita.split(" ")[1].split(":")
          u = vm.sessione.aOraAttivita.split(" ")[1].split(":")
          e = e.join(".");
          u = u.join(".");

          ore = vm.getTimeDifference(u, e);

        }catch(err){}

        var a = {
          IDPartecipante: obj.ID,
          Nome: obj.Nome,
          Cognome: obj.Cognome,
          Immagine: obj.Immagine,
          Entrata: e,
          Uscita: u,
          OreTotali: ore
        }
        return a;
      });

      if (value != null) {
        this.missing = this.missing.concat(new_attendance);
      }

      //da: array presenze => a: upload APIPRESENZE
      var uploading = new_attendance.map(function(obj){

        var da = vm.sessione.daOraAttivita.split(" ")[1] + ":00";
        var a = vm.sessione.aOraAttivita.split(" ")[1] + ":00";
    
        var up = {
          IdAttivitàFormativa: vm.sessione.idAttivita,
          IdPartecipante: obj.IDPartecipante,
          OreTotaliPresenza: obj.OreTotali,
          OraEntrata: da,
          OraUscita: a,
          DataInizio: vm.sessione.dataAttivita
        }
        return up;
      })

      uploading = { APIPresenze: uploading };
      this.$http.post(this.path+"/APIUPDATEPresenze", JSON.stringify(uploading), {
          headers: {
              "action": "INSERT",
              "Content-Type": "application/json"
          }
      }).then(function(response){

        var res = response.body
        try {
          res = JSON.parse(response.body);
        } catch (err) {}

        //UPDATE ANDATO A BUON FINE, RICARCIO TUTTI I DATI PER AVERE I RIFERIMENTI AGLI ID PRESENZE
        //flag afterInsert true per gestire flag di caricamento
        this.fetchFromWebapi(true);
      }, (err) => {
        var res = err.bodyText
        try {
          res = JSON.parse(err.bodyText);
        } catch (err) {}

        eventBus.$emit("alert", res.error)
        this.fetchFromWebapi(true);
      });
      
      this.subAPI.redraw();
    },
    startRemove: function(string_id){
      var id =  Number(string_id) 
      var deleting = { APIPresenze: [{ IDPRESENZE: id }] };
      
      this.updating = true;
      var missing_one = null;
      var missing_one_index = -1;
      this.missing.some(function(obj, index){
        if(obj.ID == id){
          missing_one = obj;
          missing_one_index = index;
          return true;
        }
        return false;
      });
      //rimuovo preventivamente l'elemento dall'array dei presenti
      this.missing.splice(missing_one_index, 1);

      if(missing_one != null && missing_one_index != -1){
        this.$http.post(this.path+"/APIUPDATEPresenze", JSON.stringify(deleting), {
            headers: {
                "action": "DELETE",
                "Content-Type": "application/json"
            }
        }).then(function(response){

          var res = response.body
          try {
            res = JSON.parse(response.body);
          } catch (err) {}

          //rimuovo il flag di presenza nell'array dei partecipanti
          this.jqx_source_data.some(function(obj){
            if(obj.ID == missing_one.IDPartecipante){
              obj.Attendance = false;
              obj.StringAttendance = "Assente";
              obj.Entrata = null;
              obj.Uscita = null;
              obj.OreTotali = null;
              obj.IDPresenza = null;
              return true;
            }
            return false;
          });

          this.updating = false;
          this.subAPI.redraw();
        }, (err) => {
          var res = err.bodyText
          try {
            res = JSON.parse(err.bodyText);
          } catch (errore) {
            console.log(errore)
          }
          try {
            var fatals = res.error.split(";");
            if(fatals[fatals.length-1] == "") fatals.pop();
          
            eventBus.$emit("alert", "Errore nella rimozione di " + fatals.length + " partecipazioni");
          } catch(errore) {
            eventBus.$emit("alert", JSON.stringify(res));
          }
          //reinserisco l'elemento nell'array delle presenze
          this.missing.splice(missing_one_index, 0, missing_one);
          // non rimuovo alcun flag di presenza nell'array dei partecipanti
          this.updating = false;
          this.subAPI.redraw();
        });
      }
      
      this.subAPI.redraw();
    },
    allIn: function(){
      var missing_indexes = this.missing.map(function(obj){
        return obj.IDPartecipante;
      })
      var vals = this.jqx_source_data.filter(function(obj){
        return missing_indexes.indexOf(obj.ID) == -1;
      })
      this.startInsert(vals);
    },
    allOut: function(){
      
      var backup = this.missing.slice();

      var deleting = this.missing.map(function(obj){
        return {
          IDPRESENZE: obj.ID
        }
      })
      
      deleting = { APIPresenze: deleting };
      this.missing = [];
      this.updating = true;
      this.$http.post(this.path+"/APIUPDATEPresenze", JSON.stringify(deleting), {
          headers: {
              "action": "DELETE",
              "Content-Type": "application/json"
          }
      }).then(function(response){

        var res = response.body
        try {
          res = JSON.parse(response.body);
        } catch (err) {}

        //UPDATE ANDATO A BUON FINE, RICARCIO TUTTI I DATI PER AVERE I RIFERIMENTI AGLI ID PRESENZE
        //flag afterInsert true per gestire flag di caricamento
        this.jqx_source_data = this.jqx_source_data.map(function(obj){
          obj.Attendance = false;
          obj.StringAttendance = "Assente";
          obj.Entrata = null;
          obj.Uscita = null,
          obj.OreTotali = null;
          obj.IDPresenza = null;
          return obj;
        });

        this.updating = false;
      }, (err) => {
        var res = err.bodyText
        try {
          res = JSON.parse(err.bodyText);
        } catch (err) {
          console.log(err)
        }
        var fatals = res.error.split(";");
        if(fatals[fatals.length-1] == "") fatals.pop();
       
        var fatalPartecipanti = [];
        eventBus.$emit("alert", "Errore nella rimozione di " + fatals.length + " partecipazioni");
        this.missing = backup.filter(function(obj){
          var index = fatals.indexOf(obj.ID.toString())
          if(index != -1 || obj.ID == null){
            fatalPartecipanti.push(obj.IDPartecipante);
            return true;
          }
          return false
        }, this);

        this.jqx_source_data = this.jqx_source_data.map(function(obj){
          if(fatalPartecipanti.indexOf(obj.ID) == -1){
            obj.Attendance = false;
            obj.StringAttendance = "Assente";
          }
          return obj;
        });
        this.updating = false;
        this.subAPI.redraw();
      });
      
      this.subAPI.redraw();
    },
    fetchSubAPI: function($event){
      this.subAPI = $event;
    },
    catchSubscribedEventPropagation: function($event){
      switch($event.name){
        case 'rowselect': 
          var e = $event.event;
          // prevengo la selezione di righe relative a persone giù sengate come presenti
          var index = e.args.rowindex; 
          var data_row = vm.jqx_source_data[e.args.row.boundindex];
          if(data_row.Attendance){
            vm.$nextTick(function(){
              $(vm.wrapper).jqxGrid('unselectrow', index);
            })
          }
        break;
        case 'cellendedit': 
          var e = $event.event;
          // mappo le modifiche eseguite sulla tabella
          var index = e.args.rowindex; 
          var data_row = vm.jqx_source_data[e.args.row.boundindex];
          switch(e.args.datafield){
            case 'Entrata':
            case 'Uscita':
              try {
                data_row[e.args.datafield] = e.args.value.toFixed(2);
                // controllo su ora uscita > ora entrata
                // non avevo un riferimento sulla riga nella funzione di validation, quindi devo farlo qui
                if(Number(data_row['Uscita']) <= Number(data_row['Entrata'])){
                  this.$nextTick(function(){
                      $(vm.wrapper).jqxGrid('begincelledit',index, 'Uscita');
                      this.$nextTick(function(){
                        $(vm.wrapper).jqxGrid('setcellvalue', index, 'Uscita', Number(data_row['Entrata']) + 0.05);
                        $(vm.wrapper).jqxGrid('endcelledit', index, 'Uscita', true);
                        this.updateHourCount(data_row, index);
                      })
                      
                  })
                } else {
                  this.updateHourCount(data_row, index)
                }
              } catch(err){
                console.log(err)
              }
            break;
          }
        break;
        case 'cellclick':
          var e = $event.event;
          var args = e.args;
          switch(args.datafield){
            case 'Entrata':
            case 'Uscita':
              var index = args.rowindex; 
              var row = vm.jqx_source_data[index]
              if(row.Attendance){
                // abilito la modifica dell'orario solo per le righe dei presenti
                $(vm.wrapper).jqxGrid('begincelledit',index, args.datafield);
              }
            break;
          }
        break;
      }
    },
    updateHourCount: function(data_row, index){
      var hc = this.getTimeDifference(data_row.Uscita, data_row.Entrata)
      data_row["OreTotali"] = hc;
      this.$nextTick(function(){
          var oreTotaliVisible = false //TODO: mostrare (hidden false) da config
          if(oreTotaliVisible){
            $(vm.wrapper).jqxGrid('begincelledit',index, 'OreTotali');
            this.$nextTick(function(){
              $(vm.wrapper).jqxGrid('setcellvalue', index, 'OreTotali', hc);
              $(vm.wrapper).jqxGrid('endcelledit', index, 'OreTotali', true);
            })
          }
          console.log(hc)
          var e = data_row.Entrata.split('.')
          if(e[0].length == 1) e[0] = "0"+e[0];
          e.push("00");
          e = e.join(":")

          var u = data_row.Uscita.split('.')
          if(u[0].length == 1) u[0] = "0"+u[0];
          u.push("00");
          u = u.join(":")
          var modifica = {APIPresenze: [{
            IDPRESENZE: data_row.IDPresenza,
            IdAttivitàFormativa: vm.sessione.idAttivita,
            IdPartecipante: data_row.ID,
            OreTotaliPresenza: Number(data_row.OreTotali),
            OraEntrata: e,
            OraUscita: u,
            DataInizio: vm.sessione.dataAttivita
          }]}
          this.updating = true;
          this.$http.post(this.path+"/APIUPDATEPresenze", JSON.stringify(modifica), {
              headers: {
                  "action": "UPDATE",
                  "Content-Type": "application/json"
              }
              
          }).then(function(response){

            var res = response.body
            try {
              res = JSON.parse(response.body);
            } catch (err) {}

            //UPDATE ANDATO A BUON FINE, LA VIEW E' GIA' AGGIORNATA
            this.updating = false;
          }, (err) => {
            var res = err.bodyText
            try {
              res = JSON.parse(err.bodyText);
            } catch (err) {}

            eventBus.$emit("alert", res.error)
            this.fetchFromWebapi(true);
          });
      })
    },
    fetchFromWebapi: function(afterInsert){
      if(afterInsert) this.updating = true;

      var query = {
        "Data": 0,
        "StringaIdPersone": "",
        "IdCorso": 0,
        "IdEdizione": 0,
        "IdAttivita": Number(this.$route.params.id)
      }
      
     this.$http.post(this.path+"/Webapi", JSON.stringify(query), {
          headers: {
              "X-HTTP-Method-Override": "GetJSONCalendarioFormazione",
              "Content-Type": "application/json"
          }
      }).then(function(response){
        var res = response.body
        try {
          res = JSON.parse(response.body);
        } catch (err) {}

        this.sessione = null;
        if(res.data) this.sessione = res.data[0];
        console.log(this.sessione)
    
        if(this.$route.params && this.sessione){
            var promises = [];
            var vm = this;
            promises.push(this.$http.get(this.path + "/APIPartecipazioni?IdEdizione=" + this.sessione.idEdizione).then(function(response){
              var res = response.body
              try {
                res = JSON.parse(response.body);
              } catch (err) {}
              if(res && res.APIPartecipazioni){
                vm.jqx_source_data = res.APIPartecipazioni.map(function(p){
                  var obj = {
                    ID: p.IDPartecipante,
                    Nome: p.NomePersona,
                    Cognome: p.CognomePersona,
                    Persona: p.PERSONA,
                    Immagine: vm.path+"/"+p.Immagine,
                    UO: null,
                    Attendance: false,
                    StringAttendance: "Assente"
                  };
                  return obj;
                })
              } else {
                vm.jqx_source_data = [];
              }
            }, function(error){
              console.log("Error in API Partecipazioni");
              console.log(error);
            }))

            var presenze = null;
            promises.push(this.$http.get(this.path + "/APIPresenze?IdAttivitàFormativa=" + this.$route.params.id).then(function(response){
              var res = response.body
              try {
                res = JSON.parse(response.body);
              } catch (err) {}
              if(res && res.APIPresenze){
                presenze = {};
                for(var i = 0; i < res.APIPresenze.length; i++){
                  presenze[res.APIPresenze[i].IdPartecipante] = res.APIPresenze[i];
                }
              }
            }, function(error){
              console.log("Error in API Presenze");
              console.log(error);
            }))

            if (promises.length > 0) {
              Promise.all(promises).then(function() {
                if(presenze != null){
                  vm.missing = [];
                  for(var i = 0; i < vm.jqx_source_data.length; i++){
                    var row_part = vm.jqx_source_data[i];
                    if(presenze[row_part.ID]){
                      vm.jqx_source_data[i].Attendance = true;
                      vm.jqx_source_data[i].StringAttendance = "Presente";

                      var row_att = presenze[row_part.ID];
                      var e = row_att.OraEntrata;
                      var u = row_att.OraUscita;
                      e = e.split(":");
                      u = u.split(":");
                      e.pop();
                      u.pop();

                      console.log(row_att)
                      console.log(row_att.OraEntrata)
                      //vm.jqx_source_data[i].Entrata = row_att.OraEntrata;
                      vm.jqx_source_data[i].Entrata = e.join(".");
                      vm.jqx_source_data[i].Uscita = u.join(".");
                      vm.jqx_source_data[i].OreTotali = row_att.OreTotaliPresenza;
                      vm.jqx_source_data[i].IDPresenza = row_att.IDPRESENZE;

                      vm.missing.push({
                        ID: row_att.IDPRESENZE,
                        IDPartecipante: row_part.ID,
                        Nome: row_part.Nome,
                        Cognome: row_part.Cognome,
                        Immagine: row_part.Immagine,
                        Entrata: e.join("."),
                        Uscita: u.join("."),
                        OreTotali: row_att.OreTotaliPresenza
                      })
                    }
                  }
                }

                
              if(afterInsert) {vm.updating = false; vm.subAPI.redraw(); } else {vm.loading = false;}
              }, function(err) {
                console.log("Err in Edition Promise All")
                if(afterInsert) {vm.updating = false;} else {vm.loading = false;}
              })
            } else {
              if(afterInsert) {this.updating = false;} else {this.loading = false;}
            }
        } else {
          if(afterInsert) {this.updating = false;} else {this.loading = false;}
        }

      });
    }
  }
}
</script>
<style>
.signAttendance{
  width: 100%; 
  height: 100%; 
  cursor: pointer;
  font-size: 1.3em;
  color: #42b983;
  vertical-align: middle;
  display: table-cell;
  opacity: 0.5;
}
.signAttendance:hover::before{
  content: "\f00c"
}

.jqx-grid-column-header.jqx-grid-column-header-glacier.jqx-widget-header.jqx-widget-header-glacier {
  background-color: #42a5f5;
  color: white;
}

.small_icon {
  padding: 2px 5px;
  margin: 4px;
  float: right;
}

.input-form {
  margin: 6px 0px;
}

.detail_edit_field {
  display: inline-grid;
}

</style>
<style scoped>

.cs.custom_spinner {
  bottom: 8px;
}

.cs.custom_spinner:before {
  width: 25px;
  height: 25px;
}

.missing-panel {
  padding: 7px;
}

.thumbnail {
  min-height: 235px;
  max-height: 235px;
  overflow-y: auto;
  overflow-x: hidden;
  border-radius: 4px;
  background-color: white;
  box-shadow: rgba(0, 0, 0, 0.3) 0px 2px 4px;
  margin-bottom: 5px;
}

.thumbnail>img {
  border-radius: 4px;
  max-width: 150px;
}

.is_extra_small .thumbnail {
  min-height: 200px;
  max-height: 200px;
}

.is_extra_small .thumbnail>img {
  max-height: 90px;
}

::-webkit-scrollbar {
  width: 10px;
}
</style>
