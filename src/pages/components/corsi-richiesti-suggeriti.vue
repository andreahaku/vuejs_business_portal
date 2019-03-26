<template>
    <div class="panel panel-default paper-shadow" data-z="0.5">
        <div class="panel-heading">
            <h4 class="text-headline margin-none">
            Corsi Richiesti/Suggeriti</h4>
            <p class="text-subhead text-light">I corsi che ti sono stati suggeriti o </p>
        </div>
        <ul class="list-group">
            <li v-show='!tutti' class="list-group-item media v-middle" v-for="corso in listapartecipazioni | limitBy 3">
                <div class="media-body">
                    <a class="text-subhead list-group-link" href="app-take-course.html">{{corso.titolo}}</a>
                </div>
                <div class="media-right">
                    <div class="progress progress-mini width-100 margin-none">
                        <div aria-valuemax="100" aria-valuemin="0" aria-valuenow="45" class="progress-bar progress-bar-green-300" role="progressbar" style="width:45%;"></div>
                    </div>
                </div>
            </li>
            <li v-show='tutti' transition="expand" class="list-group-item media v-middle" v-for="corso in listapartecipazioni">
                <div class="media-body">
                    <a class="text-subhead list-group-link" href="app-take-course.html">{{corso.titolo}}</a>
                </div>
                <div class="media-right">
                    <div class="progress progress-mini width-100 margin-none">
                        <div aria-valuemax="100" aria-valuemin="0" aria-valuenow="45" class="progress-bar progress-bar-green-300" role="progressbar" style="width:45%;"></div>
                    </div>
                </div>
            </li>
        </ul>
        <div class="panel-footer text-right">
            <a v-show='!tutti' class="btn btn-white paper-shadow relative" data-animated="" data-hover-z="1" data-z="0" href="#" v-on:click='tutti = true'>Vedi tutti</a>
            <a v-show='tutti' class="btn btn-white paper-shadow relative" data-animated="" data-hover-z="1" data-z="0" href="#" v-on:click='tutti = false'>Solo gli ultimi</a>
        </div>
    </div>
</template>
<script>
export default {
    ready: function() {
        //this.getIDPersona();
    },
    data: function() {
        return {
            listapartecipazioni: '',
            listacorsi: '',
            idpersona: ''
        }
    },
    methods: {
        getIDPersona: function() {

            this.idpersona = localStorage.getItem("idpersona")

            if (this.idpersona == null) {
                var user = this.$root.lsGet("username")
                this.$http.get('http://dev28:8081/APIUtenti?Utente=' + user).then((response) => {

                    var utente = response.body;
                    try{
                        utente = JSON.parse(response.body);
                    } catch(err) {};

                    this.idpersona = utente.APIUtenti[0].IDPersona

                    localStorage.setItem("nomecognome", utente.APIUtenti[0].Persona)
                    localStorage.setItem("nome", utente.APIUtenti[0].NomePersona)
                    localStorage.setItem("cognome", utente.APIUtenti[0].CognomePersona)
                    localStorage.setItem("idpersona", utente.APIUtenti[0].IDPersona)

                    this.getMieiCorsi(utente.APIUtenti[0].IDPersona)
                })
            }

            this.getMieiCorsi(this.idpersona);
        },
        getMieiCorsi: function(idp) {

            if (idp != null) {
                this.$http.get('http://dev28:8081/APIPartecipazioni?IDPartecipante=' + idp).then((response) => {

                    var listaP = response.body;
                    try{
                        listaP = JSON.parse(response.body);
                    } catch(err) {};

                    listaP = listaP.APIPartecipazioni
                    var listacorsi = []

                    for (let i = 0; i < listaP.length; i++) {
                        let corso = listaP[i]
                        let idcorso = corso.IDCorso

                        this.$http.get('http://dev28:8081/APICorsi?ID=' + idcorso).then((response) => {
                            var dettaglioCorso = response.body;
                            try{
                                dettaglioCorso = JSON.parse(response.body);
                            } catch(err) {};

                            listacorsi.push({
                                titolo: dettaglioCorso.APICorsi[0].Titolo
                            })

                            if (listacorsi.length == listaP.length) {
                                this.listapartecipazioni = listacorsi
                                this.$root.lsSet('listapartecipazioni', JSON.stringify(this.listapartecipazioni))
                            }
                        })
                    }
                })
            }
        }
    }
}
</script>
<style>
</style>
