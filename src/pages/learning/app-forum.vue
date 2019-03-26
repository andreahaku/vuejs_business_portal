<template>
    <div class="st-pusher" id="content">
        <div class="st-content">
            <div class="st-content-inner padding-none">
                <div class="container-fluid">
                    <br>
                    <div class="row">
                        <div class="col-xs-12 col-md-6">
                            <div class="panel panel-default paper-shadow" data-z="0.5">
                                <ul class="list-group">
                                    <li class="list-group-item">
                                        <div class="media v-middle">
                                            <div class="media-body">
                                                <h4 class="text-headline margin-none">Discussioni</h4>
                                                <p class="text-subhead text-light"></p>
                                            </div>
                                            <br>
                                        </div>
                                        <div class="form-group form-control-material">
                                            <input id="forumSearch" type="text" class="form-control" placeholder="Scrivi per ricercare" v-model="filtro" @blur="filterOut()" />
                                            <label v-show="!labelout" for="forumSearch">Filtra ...</label>
                                        </div>
                                    </li>
                                </ul>
                                <ul class="list-group listadiscussioni">
                                    <li v-for="discussione in topdiscussionifiltered" class="list-group-item media v-middle">
                                        <div class="media-left">
                                            <div class="icon-block half img-circle bg-grey-300">
                                                <i class="fa fa-file-text text-white"></i>
                                            </div>
                                        </div>
                                        <div class="media-body">
                                            <h4 class="text-subhead margin-none" @click="idchat = discussione.id">{{discussione.titolo}}
                                            <!-- 
                                              <router-link  class="link-text-color" 
                                               :to="{ name: 'discussione', params: {iddiscussione: discussione.id}}">{{discussione.titolo}}</router-link>
                                             -->
                                            </h4>
                                            <hr>
                                            <div class="text-light text-caption">
                                                <i class="fa fa-clock-o fa-fw"></i> iniziata il {{discussione.dataInizio}}
                                            </div>
                                        </div>
                                        <div class="media-right">
                                            <router-link class="btn btn-white text-light" :to="{ name: 'discussione', 
                                            params: {iddiscussione: discussione.id}}"><i class="fa fa-comments fa-fw"></i> <span v-if="discussione.commenti > 0">{{discussione.commenti}}</span></router-link>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <br/>
                        </div>
                        <div class="col-xs-12 col-md-6">
                            <div class="panel panel-default">
                                <div class="panel-body">
                                    <chat v-if="discussione.id == idchat" :id="idchat" v-for="discussione in topdiscussionifiltered" class="chat"></chat>
                                    <div v-if="idchat == 0">
                                        <h4 class="text-headline margin-none">Selezionare una discussione</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <sidejsonly :default="false"></sidejsonly>
    </div>
</template>
<script>
import sidejsonly from '../components/side-default-jsonly.vue'
import chat from '../components/chat.vue'

export default {
    mounted: function() {
        this.$nextTick(function() {
            $(".listadiscussioni").height($(window).height() - 290)
            this.getTopDiscussioni();
        })
    },
    components: {
        sidejsonly,
        chat
    },
    data: function() {
        return {
            topdiscussioni: [],
            filtro: '',
            labelout: false,
            idchat: 0
        }
    },
    computed: {
        topdiscussionifiltered: function() {
            var filter = this.filtro.toLowerCase();
            return this.topdiscussioni.filter((element) =>
                element.titolo.toLowerCase().includes(filter)
            );
        }
    },
    methods: {
        getTopDiscussioni: function() {
            this.$http.get(localStorage.getItem('path') + '/APICollaboratoriDiscussioni?IDPersona=' + localStorage.getItem("idpersona")).then((response) => {
                let coll = response.body;
                try{
                    coll = JSON.parse(response.body);
                } catch(err) {};

                if (coll && coll.APICollaboratoriDiscussioni) {
                    var ids = [];
                    for (var i = 0; i < coll.APICollaboratoriDiscussioni.length; i++) {
                        ids.push(coll.APICollaboratoriDiscussioni[i].IDDiscussione);
                    }
                    ids = ids.join(";");
                    this.$http.get(localStorage.getItem('path') + '/APIDiscussioni?ID=' + ids).then((response) => {
                        var disc = response.body;
                        try{
                            disc = JSON.parse(response.body);
                        } catch(err) {};

                        if (disc && disc.APIDiscussioni) {
                            for (var i = 0; i < disc.APIDiscussioni.length; i++) {
                                var discussione = disc.APIDiscussioni[i];
                                console.log(discussione.DataInizio)
                                // FORMAT CHANGE
                                // new Date(discussione.DataInizio.replace(/-/g, '/')
                                var date = new Date(discussione.DataInizio.replace(/\./g, ':')).toLocaleDateString();
                                this.topdiscussioni.push({
                                    titolo: discussione.Titolo,
                                    id: discussione.ID,
                                    dataInizio: date,
                                    commenti: 0
                                });
                            }
                            this.$http.get(localStorage.getItem('path') + '/APICommentiDiscussione?IDDiscussione=' + ids).then((response) => {
                                var comm  = response.body;
                                try{
                                    comm = JSON.parse(response.body);
                                } catch(err) {};

                                if (comm && comm.APICommentiDiscussione) {
                                    var comms = comm.APICommentiDiscussione;
                                    comms = comms.sort(function(a, b) {
                                        return a.IDDiscussione - b.IDDiscussione;
                                    })
                                    var counter = 1;
                                    var prev = comms[0].IDDiscussione;
                                    for (var i = 1; i < comms.length; i++) {
                                        if (comms[i].IDDiscussione == prev) {
                                            counter++;
                                        } else {
                                            var index = -1;
                                            this.topdiscussioni.forEach(function(d, i) {
                                                if (d.id == prev) {
                                                    index = i;
                                                }
                                            });

                                            this.topdiscussioni[index].commenti = counter;
                                            counter = 1;
                                            prev = comms[i].IDDiscussione;
                                        }
                                    }
                                    var index = -1;
                                    this.topdiscussioni.forEach(function(d, i) {
                                        if (d.id == prev) {
                                            index = i;
                                        }
                                    });
                                    this.topdiscussioni[index].commenti = counter;
                                }
                            });
                        }
                    });
                }
            });
        },
        getTopDiscussioniOld: function() {

            this.$http.get(localStorage.getItem('path') + '/APICollaboratoriDiscussioni?IDPersona=' + localStorage.getItem("idpersona")).then((response) => {
                let coll  = response.body;
                try{
                    coll = JSON.parse(response.body);
                } catch(err) {};

                if (coll && coll.APICollaboratoriDiscussioni) {
                    for (let i = 0; i < coll.APICollaboratoriDiscussioni.length; i++) {
                        let iddisc = coll.APICollaboratoriDiscussioni[i].IDDiscussione;
                        this.$http.get(localStorage.getItem('path') + '/APIDiscussioni?ID=' + iddisc).then((response) => {
                            let disc = response.body;
                            try{
                                disc = JSON.parse(response.body);
                            } catch(err) {};

                            if (disc && disc.APIDiscussioni) {

                                let discussione = disc.APIDiscussioni[0];
                                let date = new Date(discussione.DataInizio.replace(/-/g, '/')).toLocaleDateString();
                                let obj = {
                                    titolo: discussione.Titolo,
                                    id: discussione.ID,
                                    dataInizio: date,
                                    commenti: 0
                                };
                                this.topdiscussioni.push(obj);

                                this.$http.get(localStorage.getItem('path') + '/APICommentiDiscussione?IDDiscussione=' + discussione.ID).then((response) => {
                                    let comm = response.body;
                                    try{
                                        comm = JSON.parse(response.body);
                                    } catch(err) {};
                                    if (comm && comm.APICommentiDiscussione) {
                                        obj.commenti = comm.APICommentiDiscussione.length;
                                    }
                                });
                            }
                        });
                    }
                }
            });
        },
        filterOut: function() {
            if (this.filtro != '') {
                this.labelout = true;
            } else {
                this.labelout = false;
            }
        }
    }
}
</script>
<style>
.listadiscussioni {
    height: 80vh;
    overflow-y: auto;
    margin-bottom: 0px;
}

.chat {
    height: 80vh;
    overflow-y: auto;
    margin-bottom: 0px;
}
</style>
