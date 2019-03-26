export const documentiMixin = {
    mounted: function () {
        this.getDocumenti();
    },
    data: function () {
        return {
            documenti: []
        }
    },
    methods: {
        getDocumenti: function () {
            var get = this.$root.lsGet("doc-list");
            if (get != null) {
                console.log("hit doc storage");
                this.documenti = JSON.parse(get);
            } else {
                this.$http.get(localStorage.getItem("path") +
                    '/APIDocumentiPersona?TipoOggetto=Persona&IdOggetto=' + localStorage.getItem("idpersona")).then(function (response) {
                        var res = response.body;
                        try {
                            res = JSON.parse(response.body);
                        } catch (err) { };

                        if (res && res.APIDocumentiPersona) {
                            for (var i = 0; i < res.APIDocumentiPersona.length; i++) {
                                var doc = res.APIDocumentiPersona[i];
                                this.documenti.push({
                                    id: doc.ID,
                                    data: doc.Data,
                                    dataString: doc.DATASTRINGA,
                                    nome: doc.Nome,
                                    nomeFile: doc.NomeFile,
                                    tipo: doc.Tipo
                                })
                                console.log(this.documenti);
                            }
                            this.$root.lsSet("doc-list", JSON.stringify(this.documenti));
                        }
                    });
            }

        }
    }

}