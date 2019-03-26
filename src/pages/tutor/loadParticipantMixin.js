import {
  eventBus
} from '../../eventbus.js';

export const loadParticipantMixin = {
  mounted: function () {

    this.moduli = [];
    this.init();
  },
  data: function () {
    return {
      path: localStorage.getItem("path"),
      id_partecipazione: this.$route.params.id,
      loading: true,
      //Mi salvo il nome del partecipante in modo da visualizzarlo a schermo
      nome_completo: null,
      //Creo un vettore con tutti i valori divisi per modulo
      moduli: []
    }
  },
  methods: {
    init: function () {
      this.$http.get(this.path + "/APIAvanzamentoModuli?IDPartecipazione=" + this.id_partecipazione).then(function (response) {
        var res = response.body;
        try {

          var res = JSON.parse(response.body);
        } catch (err) { }
        if (res && res.APIAvanzamentoModuli) {
          this.courseTitle = res.APIAvanzamentoModuli[0].TitoloCorso;

          for (var i = 0; i < res.APIAvanzamentoModuli.length; i++) {

            //p contiene il record preso dal database con ancora le info da prendere
            var p = res.APIAvanzamentoModuli[i];
            this.nome_completo = p.Persona;
            this.moduli.push({
              name: p.Modulo,
              state: p.Stato,
              datecompl: p.DataCompletamento,
              access: p.NumeroAccessi,
              timeprev: p.TempoPrevisto,
              timecons: p.TempoConsuntivo,
              datefirst: p.DataPrimoAccesso,
              datelast: p.DataUltimaUscita,
              maxscore: p.MassimoPunteggio
            });
          }
        }
        this.loading = false;
      })
    }
  }
}