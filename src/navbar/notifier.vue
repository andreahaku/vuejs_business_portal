<template>
    <li class="dropdown notifications updates">
        <a class="dropdown-toggle" data-toggle="dropdown" href="#"><i class="fa fa-bell-o"></i> <span v-if="badge > 0" class=
        "badge badge-primary">{{badge}}</span></a>
        <ul id="adv" class="dropdown-menu" role="notification">
            <li v-if="notifiche.length > 0" class="dropdown-header">Avvisi</li>
            <li v-else class="dropdown-header">Nessuna notifica</li>
            <li v-for="not in notifiche" class="media" @click="checkForToggle">
                <div class="pull-right">
                    <router-link :to="{ name: 'discussione', params: {iddiscussione: not.iddisc}}">
                        <span class="label label-success">Nuovo</span>
                    </router-link>
                </div>
                <div class="media-left"><img alt="../images/profile-photo_small.png" class="img-circle" :src="not.avatar" width="30"></div>
                <div class="media-body">
                    <a href="#">{{not.autore}}</a> ha commentato su
                    <router-link :to="{ name: 'discussione', params: {iddiscussione: not.iddisc}}">{{not.titolo}}</router-link>
                    <br>
                    <span class="text-caption text-muted">{{not.display}}</span>
                </div>
            </li>
        </ul>
    </li>
</template>
<script>
import {
    eventBus
} from '../eventbus.js';

export default {
    data: function() {
        return {
            idpersona: null,
            lastUpdate: Date.now(),
            collaborazioni: [],
            notifiche: [],
            badge: 0,
            toignore: 0,

            poll: JSON.parse(this.$root.lsGet("configs")).notificationPoll
        }
    },
    mounted: function() {
        this.$nextTick(function() {
            var can = this.$root.getEnablingObject();
            if (can.learning) {
                setTimeout(this.getCollaborazioni, 10000);
                var cache = this.$root.lsGet("notifications");
                if (cache != null && cache != undefined) {
                    this.notifiche = JSON.parse(cache);
                    this.badge = this.notifiche.length;
                }
                //loop disabilitato per debug
                this.setLoop(this.poll);
            }
        });

    },
    created: function() {
        var vm = this;
        eventBus.$on('saw', function(idDiscussione) {
            if (vm.notifiche.length > 0) {

                vm.notifiche = vm.notifiche.filter(function(elem) {
                    return elem.iddisc != idDiscussione;
                })
                vm.badge = vm.notifiche.length;

                this.$root.lsSet("notifications", JSON.stringify(vm.notifiche));
            }
        });
        eventBus.$on('ignoreDiscussion', function(idDiscussione) {
            vm.toignore = idDiscussione;
        });
    },
    methods: {
        getCollaborazioni: function() {

            this.idpersona = localStorage.getItem("idpersona");
            if (this.idpersona != null && this.idpersona != undefined) {
                this.$http.get(localStorage.getItem('path') + '/APICollaboratoriDiscussioni?IDPersona=' + this.idpersona).then((response) => {
                    try {
                        var coll = response.body;
                        try{
                            coll = JSON.parse(response.body);
                        }catch(err){}
                        
                        if (coll && coll.APICollaboratoriDiscussioni) {
                            this.collaborazioni = [];
                            for (var i = 0; i < coll.APICollaboratoriDiscussioni.length; i++) {
                                var c = coll.APICollaboratoriDiscussioni[i];
                                this.collaborazioni.push({
                                    iddiscussione: c.IDDiscussione,
                                    titolo: c.TITOLO,
                                    numcommenti: 0
                                })
                            }
                        }
                    } catch (err) {}
                });
            }
        },
        checkForNotifications: function() {
            if (this.collaborazioni.length > 0) {
                var news = [];
                var counter = 0;
                for (let index = 0; index < this.collaborazioni.length; index++) {
                    var co = this.collaborazioni[index];

                    // non notifico i commenti della discussione che sto visualizzando
                    if (this.toignore == 0 || this.toignore != co.iddiscussione) {
                        this.$http.get(localStorage.getItem('path') + '/APICommentiDiscussione?IDDiscussione=' + this.collaborazioni[index].iddiscussione).then((response) => {
                            var commenti = response.body;
                            try {
                                commenti = JSON.parse(response.body);
                            } catch (err) {}

                            if (commenti && commenti.APICommentiDiscussione) {
                                commenti = commenti.APICommentiDiscussione;
                                //non faccio sorting e aggiornamenti se non è cambiato niente
                                //la prima volta co.numcommenti è 0
                                if (commenti.length > co.numcommenti) {
                                    co.numcommenti = commenti.length;

                                    commenti.sort(function(a, b) {
                                        var ad = a.DataInserimento.replace(/-/g, '/');
                                        var bd = b.DataInserimento.replace(/-/g, '/');
                                        return new Date(bd) - new Date(ad);
                                    });

                                    for (let j = 0; j < commenti.length; j++) {
                                        if ((this.lastUpdate > new Date(commenti[j].DataInserimento.replace(/-/g, '/'))) /*&& j>0*/ ) {
                                            break;
                                        }
                                        var displayDate = parseDate(new Date(Date.now()), new Date(commenti[j].DataInserimento.replace(/-/g, '/')));

                                        var obj = {
                                                autore: commenti[j].IDAutore,
                                                avatar: "../images/profile-photo_small.png",
                                                iddisc: co.iddiscussione,
                                                titolo: co.titolo,
                                                data: new Date(commenti[j].DataInserimento.replace(/-/g, '/')),
                                                display: displayDate
                                            }
                                            //non considero i miei commenti --> issue app-take-module
                                            //if(obj.autore != localStorage.getItem("idpersona")){
                                        news.push(obj);
                                        this.$http.get(localStorage.getItem('path') + '/APIUtenti?IDPersona=' + obj.autore).then((response) => {
                                            var utente = response.body;
                                            try{
                                                utente = JSON.parse(response.body)
                                            } catch(err){}
                                            utente = utente.APIUtenti[0];
                                            obj.autore = utente.Persona;
                                            if (utente.FOTO != null) {
                                                obj.avatar = utente.FOTO;
                                            }

                                            if (index == this.collaborazioni.length) {
                                                this.$root.lsSet("notifications", JSON.stringify(this.notifiche));
                                            }
                                        });

                                        if (this.$route.path.split("/")[1].split("/")[0]) {
                                            if (this.$route.path.split("/")[1].split("/")[0] == 'app-take-module') {
                                                this.$emit('reloadModuleDiscussion', obj.iddisc)
                                                    //il controllo su iddisc viene fatto in app-take-module
                                            }
                                        }

                                        counter++;
                                        //}
                                    }
                                }

                            }

                            if (index == this.collaborazioni.length - 1) {
                                if (counter > 0) {
                                    this.badge += counter;

                                    news.sort(function(a, b) {
                                        return b.data - a.data;
                                    });
                                    this.notifiche = news.concat(this.notifiche);
                                    this.$root.lsSet("notifications", JSON.stringify(this.notifiche));
                                }
                            }
                        });
                    }
                }
                this.lastUpdate = Date.now();
                this.setLoop(this.poll);
            }
        },
        setLoop: function(timer) {
            setTimeout(this.checkForNotifications, timer);
        },
        checkForToggle() {
            if (window.innerWidth < 768) {
                $('#main-nav').collapse("toggle");
            }
        }
    }
}
</script>
