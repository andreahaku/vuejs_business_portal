export const competenze = {
    data: function () {
        return {
            promisesCompetenze: []
        }
    },
    mounted: function () {
        if (this.enablingObject.competenze || this.enablingObject.competenzeHIT) {
            this.initCompetenze();
        }
    },
    methods: {
        initCompetenze: function () {
            var vm = this;
            this.promisesCompetenze = [];
            this.promisesCompetenze.push(function tryGet() {
                //&IDTipologiaValutazione
                return vm.$http.get(localStorage.getItem('path') + '/APIStatiValutazione?IDStato=.&IDTipologiaValutazione=2')
                    .then(function (response) {
                        console.log("RESOLVING")
                        try {
                            var res = response.body
                            try {
                                var res = JSON.parse(response.body);
                            } catch (err) { }

                            if (res && res.APIStatiValutazione) {
                                res = res.APIStatiValutazione;

                                res.sort(function (a, b) {
                                    if (a.Sequenza && b.Sequenza) {
                                        return a.Sequenza - b.Sequenza;
                                    } else {
                                        return a.Descrizione < b.Descrizione ? -1 : 1;
                                    }
                                })
                            } else { res = [] }

                            this.$root.stati_valutazione = res;
                            console.log("resolved stati valutazione")
                            vm.resolved()
                        } catch (err) {
                            // in caso di errore restituisco la funzione per ri-eseguire la get/promise
                            throw { nome: "StatiValutazione", err: tryGet };
                        }
                    });
            }());
        }
    }
}