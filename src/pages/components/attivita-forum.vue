<template>
    <div>
        <div class="row" style="margin: 0px;">
            <div class="col-xs-12 col-sm-6">
                <h4 class="text-headline margin-none" @click.prevent="commentsReady = true">Attività Nel Forum</h4>
                <p class="text-subhead text-light">Ultimi commenti nel forum</p>
            </div>
            <div class="col-xs-12 col-sm-6">
                <paginazione :bottom="$root.xs" v-if="commentsReady" :array="collaborazioni" limit="3" @displayChanged="dispatchedPagination($event)"></paginazione>
            </div>
            <div v-if="!somethingToShow" class="panel panel-default col-xs-12" style="margin: 0px;">
                <div class="panel-body" style="border-bottom: 1px solid rgb(238, 238, 238); padding: 8px;"> Non ci sono nuovi commenti da visualizzare </div>
            </div>
        </div>
        <ul v-if="somethingToShow" class="list-group relative paper-shadow" data-animated="" data-hover-z="0.5">
            <li v-for="commento in displaycommenti" class="list-group-item paper-shadow">
                <div class="media v-middle">
                    <div class="media-left">
                        <a href="#"><img alt="person" class="img-circle width-40" :src="commento.avatar"></a>
                    </div>
                    <div class="media-body">
                        <a class="text-subhead link-text-color" v-html="commento.newestcomm"></a>
                        <br>
                        <div class="text-light">
                            Argomento:
                            <router-link :to="{ name: 'discussione', params: {iddiscussione: commento.target}}">{{commento.titolo}}</router-link>
                            <br>
                            <br> Di: <a href="#">{{commento.autore}}</a>
                            <span class="pad text-caption text-light">{{commento.newestdate}}</span>
                        </div>
                    </div>
                    <div class="media-right">
                        <div>
                            <router-link class="btn btn-white text-light" :to="{ name: 'discussione', params: {iddiscussione: commento.target}}"><i class="fa fa-comments fa-fw"></i> {{commento.counter}}</router-link>
                        </div>
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>
<script>
import paginazione from './paginazione.vue'

export default {
    mounted: function() {
        this.$nextTick(function() {
            this.getIDPersona();
        });
    },
    data: function() {
        return {
            idpersona: '',
            nomepersona: 0,
            commentsReady: false,
            commenti: [],
            displaycommenti: [],

            //BETA
            collaborazioni: [],
            somethingToShow: false

        }
    },
    components: {
        paginazione
    },
    methods: {
        dispatchedPagination(toDisplay) {
            this.displaycommenti = toDisplay;
            this.loadUserInfo();
        },
        getIDPersona() {

            this.idpersona = localStorage.getItem("idpersona");

            if (this.idpersona == null) {
                var user = this.$root.lsGet("username");

                if (user != null) {

                    this.$http.get(localStorage.getItem('path') + '/APIUtenti?Utente=' + user).then((response) => {

                        var utente = response.body;
                        try{
                            utente = JSON.parse(response.body);
                        } catch(err) {};

                        this.idpersona = utente.APIUtenti[0].IDPersona

                        localStorage.setItem("nomecognome", utente.APIUtenti[0].Persona)
                        localStorage.setItem("nome", utente.APIUtenti[0].NomePersona)
                        localStorage.setItem("cognome", utente.APIUtenti[0].CognomePersona)
                        localStorage.setItem("idpersona", utente.APIUtenti[0].IDPersona)

                        this.nomepersona = localStorage.getItem("nomecognome");
                    })
                }

                this.getDiscussioni();
            } else {

                this.nomepersona = localStorage.getItem("nomecognome");
                this.getDiscussioni();
            }
        },
        getDiscussioni: function() {
            if (this.idpersona) {
                this.$http.get(localStorage.getItem('path') + '/APICollaboratoriDiscussioni?IDPersona=' + this.idpersona).then((response) => {
                    var coll = response.body;
                    try{
                        coll = JSON.parse(response.body);
                    } catch(err) {};

                    this.collaborazioni = [];
                    var now = new Date(Date.now());

                    if (coll && coll.APICollaboratoriDiscussioni) {
                        var ids = coll.APICollaboratoriDiscussioni[0].IDDiscussione;
                        for (var i = 1; i < coll.APICollaboratoriDiscussioni.length; i++) {
                            ids += ';' + coll.APICollaboratoriDiscussioni[i].IDDiscussione;
                        }
                        coll = coll.APICollaboratoriDiscussioni;
                        this.$http.get(localStorage.getItem('path') + '/APICommentiDiscussione?IDDiscussione=' + ids).then((response) => {
                            var comms = response.body;
                            try{
                                comms = JSON.parse(response.body);
                            } catch(err) {};

                            if (comms && comms.APICommentiDiscussione) {
                                // FORMAT CHANGE
                                // a.DataInserimento.replace(/-/g, '/');
                                // b.DataInserimento.replace(/-/g, '/');
                                comms = comms.APICommentiDiscussione;
                                comms.sort(function(a, b) {
                                    if (a.IDDiscussione != b.IDDiscussione) {
                                        return a.IDDiscussione - b.IDDiscussione;
                                    } else {
                                        var ad = a.DataInserimento.replace(/\./g, ':');
                                        var bd = b.DataInserimento.replace(/\./g, ':')
                                        return new Date(bd) - new Date(ad);
                                    }
                                });

                                var prev = -1;
                                var lastIndex = -1;
                                for (var i = 0; i < comms.length; i++) {
                                    if (comms[i].IDDiscussione != prev) {
                                        var index = -1;
                                        coll.forEach(function(c, ind) {
                                            if (comms[i].IDDiscussione == c.IDDiscussione) {
                                                index = ind;
                                            }
                                        });
                                        if (index != -1) {
                                            lastIndex = index;
                                            var ultimo = coll[lastIndex].DataUltimoAccesso;
                                            var dataUltimo = 0;
                                            if (ultimo != null) {
                                                // FORMAT CHANGE
                                                // new Date(ultimo.replace(/-/g, '/'));
                                                dataUltimo = new Date(ultimo.replace(/\./g, ':'));
                                            }
                                            // FORMAT CHANGE
                                            // new Date(comms[i].DataInserimento.replace(/-/g, '/') 
                                            if (dataUltimo <= new Date(comms[i].DataInserimento.replace(/\./g, ':')) && comms[i].IDAutore != localStorage.getItem("idpersona")) {
                    
                                                this.collaborazioni.push({
                                                    newestcomm: comms[i].Commento,
                                                    newestdate: parseDate(now, new Date(comms[i].DataInserimento.replace(/\./g, ':'))),
                                                    counter: 1,
                                                    autore: comms[i].IDAutore,
                                                    titolo: coll[lastIndex].TITOLO,
                                                    avatar: "../images/profile-photo_small.png",
                                                    target: comms[i].IDDiscussione
                                                });
                                            }
                                        }
                                    } else {
                                        if (lastIndex != -1) {
                                            // FORMAT CHANGE
                                            // new Date(ultimo.replace(/-/g, '/'));
                                            // new Date(comms[i].DataInserimento.replace(/-/g, '/'))
                                            var ultimo = coll[lastIndex].DataUltimoAccesso;
                                            var dataUltimo = 0;
                                            if (ultimo != null) {
                                                dataUltimo = new Date(ultimo.replace(/\./g, ':'));
                                            }

                                            if (dataUltimo <= new Date(comms[i].DataInserimento.replace(/\./g, ':')) && comms[i].IDAutore != localStorage.getItem("idpersona")) {
                                                var size = this.collaborazioni.length;
                                                if (size > 0) {
                                                    this.collaborazioni[size - 1].counter = this.collaborazioni[size - 1].counter + 1;
                                                }
                                            }
                                        }
                                    }
                                    prev = comms[i].IDDiscussione;
                                }
                                this.commentsReady = true;
                                if (this.collaborazioni.length > 0) {
                                    this.somethingToShow = true;
                                }
                            }
                        });
                    }
                });
            } else {
                alert("NO USER LOGGED");
            }
        },
        loadUserInfo: function() {
            for (let i = 0; i < this.displaycommenti.length; i++) {

                this.$http.get(localStorage.getItem('path') + '/APIUtenti?IDPersona=' + this.displaycommenti[i].autore).then((response) => {
                    var utente = response.body;
                    try{
                        utente = JSON.parse(response.body);
                    } catch(err) {};

                    if (utente && utente.APIUtenti) {
                        this.displaycommenti[i].autore = utente.APIUtenti[0].Persona;
                        if (utente.APIUtenti[0].FOTO != null) {
                            this.displaycommenti[i].avatar = utente.APIUtenti[0].FOTO;
                        }
                    }
                });
            }
        }
    }
}
</script>
<style>
span.pad {
    padding-left: 10px;
}
</style>
