import {
  eventBus
} from '../../eventbus.js';

export const loadParticipantListMixin = {
  mounted: function () {
    //this.init();
  },
  data: function () {
    return {
      path: localStorage.getItem("path"),
      loadingPeopleTracking: true,
      /*
      id_edizione: this.$route.params.id,
      id_corso: this.$route.params.idCorso
      */
      //Creo un vettore con tutti i valori divisi per persona
      peopleTracking: [],
      peopleTrackingFilter: []
    }
  },
  methods: {
    getPeopleTracking: function (id_edizione) {
      this.peopleTracking = [];
      this.peopleTrackingFilter = [];
      //return promise
      return this.$http.get(this.path + "/APIAvanzamentoCorsi?IdEdizionePartecipazione=" + id_edizione).then(function (response) {
        var res = response.body;
        try {

          var res = JSON.parse(response.body);
        } catch (err) { }
        if (res && res.APIAvanzamentoCorsi) {

          //Il vettore ha 2 record perche con edizione 51 si hanno 2 partecipanti
          for (var i = 0; i < res.APIAvanzamentoCorsi.length; i++) {

            //p contiene il record preso dal database con ancora le info da prendere
            var p = res.APIAvanzamentoCorsi[i];
            if (p.NomeEntità == null) {

              p.NomeEntità = "";
            }
            this.peopleTracking.push({
              name: p.Persona,
              client: p.NomeEntità,
              percent: p.Completamento,
              access: p.NumeroAccessi,
              timeprev: p.TempoPrevisto,
              timecons: p.TempoConsuntivo,
              timepercent: p.PercentualeTempo,
              datefirst: p.DataPrimoAccesso,
              datelast: p.DataUltimaUscita,
              datecompl: p.DataCompletamentoPartecipazione,
              score: p.Punteggio,
              id_part: p.IDPartecipazione
            });
          }
        }
        this.loadingPeopleTracking = false;
        //Mi copio la lista dei partecipanti prima del filtro in modo da ripristinarlo piu tardi
        this.peopleTrackingFilter = this.peopleTracking.slice();
      }, function (err) {
        console.log(err)
        this.loadingPeopleTracking = false;
      })
    }
  }
}