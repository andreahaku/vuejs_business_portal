import { eventBus } from '../../../eventbus.js';

export const courseMyMixin = {
    created: function () {
        this.getIDPersona()
    },
    data: function () {
        return {
            partecipazioniCollection: {},
            listapartecipazioni: [],
            toQuery: []
        }
    },
    methods: {
        getIDPersona: function () {
            this.idpersona = localStorage.getItem("idpersona")

            if (this.idpersona == null) {
                var user = this.$root.lsGet("username")

                this.$http.get(localStorage.getItem('path') + '/APIUtenti?Utente=' + user).then(function (response) {

                    var utente = response.body;
                    try {
                        utente = JSON.parse(response.body);
                    } catch (err) { };

                    if (utente && utente.APIUtenti) {
                        this.idpersona = utente.APIUtenti[0].IDPersona

                        localStorage.setItem("nomecognome", utente.APIUtenti[0].Persona)
                        localStorage.setItem("nome", utente.APIUtenti[0].NomePersona)
                        localStorage.setItem("cognome", utente.APIUtenti[0].CognomePersona)
                        localStorage.getItem("idpersona", utente.APIUtenti[0].IDPersona)

                        this.getMieiCorsi()
                    } else {
                        console.log("APIUtenti -student courseS- returns: ")
                        console.log(utente)
                    }
                })
            } else {
                this.getMieiCorsi()
            }
        },
        getMieiCorsi: function () {

            this.partecipazioniCollection = this.$store.getters.getPartecipazioni;
            var listaP = this.partecipazioniCollection;
            if (listaP != null) {
                if (listaP.data != null) {
                    listaP = listaP.data.slice();
                    this.listapartecipazioni = []
                    this.toQuery = []

                    for (var i = 0; i < listaP.length; i++) {
                        var corso = listaP[i];
                        this.toQuery.push(corso);
                    }
                    if (this.toQuery.length > 0) {
                        this.fetchCorsi();
                    }
                }
            } else {
                //eventBus.$emit("alert", "Non risulti iscritto a corsi");
            }
        },
        fetchCorsi: function () {
            this.toQuery.sort(function (a, b) {
                return a.IDCorso - b.IDCorso;
            });
            var dettagliCorsi = this.$store.getters.getCorsi;

            if (dettagliCorsi != null && dettagliCorsi.data != null) {
                dettagliCorsi = dettagliCorsi.data;

                var j = 0;
                for (var i = 0; i < dettagliCorsi.length; i++) {
                    var dettaglioCorso = dettagliCorsi[i];
                    //le stesse edizioni sono in fila
                    if (j < this.toQuery.length) {
                        while (dettaglioCorso.ID == this.toQuery[j].IDCorso) {
                            var c = this.toQuery[j];
                            this.pushCourse(dettaglioCorso, c);
                            j++;
                            if (j >= this.toQuery.length) {
                                break;
                            }
                        }
                    }
                }
                //abilita la paginazione a fine ciclo
                this.isready = true;
            }
        },
        pushCourse: function (dettaglioCorso, c) {
            this.listapartecipazioni.push({
                idcorso: dettaglioCorso.ID,
                titolo: dettaglioCorso.Titolo,
                percentuale: c.CompletamentoPercentuale,
                immagine: null,

                edizione: c.IdEdizione,
                iscritto: c.StatoIscritto,
                dataInserimento: c.DataInserimento ? c.DataInserimento.replace(/-/g, '/') : null,
                completato: c.StatoFinale,
                iniziato: c.StatoInCorso,
                titoloEdizione: "",
                stato: "",

                ELearningTipoFormazione: c.ELearningTipoFormazione
            });
        }
    }
}