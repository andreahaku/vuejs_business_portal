import { eventBus } from '../../eventbus.js';

export const loadTotalParticipantListMixin = {
    mounted: function () {

        this.persons = [];
        this.personsFilter = [];
        this.init();
    },
    data: function () {
        return {
            path: localStorage.getItem("path"),
            loading: true,
            //Creo un vettore con tutti i valori divisi per persona
            persons: [],
            personsFilter: [],
            //Creo un vettore dove tengo in memoria l'ultimo ordinamento eseguito, 1 se asce 0 se disce
            ordered: [0, 0, 0, 0, 0, 0, 0]
        }
    },
    methods: {
        init: function () {
            this.$http.get(this.path + "/APIAvanzamentoCorsi?IdEdizionePartecipazione").then(function (response) {
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
                        this.persons.push({
                            name: p.Persona, client: p.NomeEntità, percent: p.Completamento, corso: p.TitoloCorso,
                            edition: p.Edizione, datecompl: p.DataCompletamentoPartecipazione, score: p.Punteggio, id: p.IDPartecipazione
                        });
                    }
                }
                this.loading = false;
                //Mi copio la lista dei partecipanti prima del filtro in modo da ripristinarlo piu tardi
                this.personsFilter = this.persons.slice();
            })
        }
    }
}
