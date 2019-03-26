<template>
    <div class="st-content">
        <!-- extra div for emulating position:fixed of the menu -->
        <div class="st-content-inner padding-none container-fluid">
            <div class="panel panel-default paper-shadow" style="border: none; margin-bottom: 0px;">
                <h4 class="text-headline margin-none">{{title}}</h4>
                <p v-if="date" class="text-light text-caption">
                    iniziata il
                    <i class="fa fa-clock-o fa-fw"></i> {{date}}
                </p>
                <div align="right">
                    <i v-if="isLoading" class="fa fa-spinner fa-spin pad-right" aria-hidden="true"></i>
                    <span class="panel panel-default pad-rel paper-shadow relative">
                                Aggiorna tra <span v-if="!isLoading">{{timer/1000}}</span><span v-else>0</span></span>
                    <a href="#" class="btn btn-white paper-shadow relative reload" data-animated @click.prevent="forceCheck()"><i class="fa fa-refresh" aria-hidden="true"></i></a>
                </div>
                <hr>
                <div id="chat">
                    <div v-if="empty" class="put-padding">Non ci sono commenti per questa discussione</div>
                    <div v-if="!everythingLoaded" class="text-center" style="margin-bottom: 15px;"><i class="fa fa-spinner fa-5x fa-spin pad-right" aria-hidden="true"></i></div>
                    <div v-if="!empty" v-show="everythingLoaded">
                        <!-- 
                        <div v-for="(commento, index) in tutticommenti" :id="index+1" :class="{ 'forum-thread-reply': commento.isMine}" class="media s-container loadin">
                            <div :class="{ 'pull-right': commento.isMine, 'media-left': !commento.isMine }">
                        -->
                        <div v-for="(commento, index) in tutticommenti" :id="index+1" class="media s-container loadin">
                            <div :class="{ 'pull-right': commento.isMine, 'media-left': !commento.isMine }">
                                <div class="width-70 text-center">
                                    <p>
                                        <!-- scommenta per cancellare -->
                                        <!-- <a href="" @click.prevent="delete(commento.id)"> -->
                                        <a href="" @click.prevent="">
                                            <img :src="commento.avatar" alt="../images/profile-photo_small.png" class="img-circle width-40" />
                                        </a>
                                    </p>
                                    <p class="text-caption text-light">{{commento.nome}}</p>
                                    <!--
                                        <span class="icon-block s25 img-circle bg-purple-300"><i class="fa fa-star text-white"></i></span>
                                        <span class="icon-block s25 img-circle bg-indigo-300"><i class="fa fa-trophy text-white"></i></span>
                                    -->
                                </div>
                            </div>
                            <!-- 
                            <div class="media-body panel-comment" :class="{ 'pull-right': commento.isMine, 'media-left': !commento.isMine }">
                                <div class="panel panel-default" :class="{'error': commento.err == true, 'pull-text-r': commento.isMine}">
                             -->
                            <div class="media-body panel-comment media-left">
                                <div class="panel panel-default" :class="{'error': commento.err == true, 'pull-text-r': commento.isMine, 'pull-text-l': !commento.isMine}">
                                    <div class="panel-body" style="padding-top: 8px;">
                                        <div class="text-subhead-2">
                                            <!-- 
                                        {{commento.autore}} - 
                                         -->
                                            <span class="text-caption text-light">{{commento.data}}</span></div>
                                        <p v-html="commento.comm"></p>
                                    </div>
                                    <div class="panel-body err-show" v-if="commento.err == true"><i class="fa fa-exclamation-circle" aria-hidden="true"></i> Errore nell'invio del commento - <a href="#" @click.prevent="retryReply(commento.index, commento.retry)">Riprova</a> più tardi
                                        <i v-if="retrying" class="fa fa-spinner fa-spin pad-right" aria-hidden="true"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <hr style="margin: 2px; border-color: gainsboro">
                <div class="page-section padding-top-none">
                    <div class="panel panel-default paper-shadow reply-body" data-z="0.5">
                        <div class="panel-body inserimento">
                            <form>
                                <div class="form-group">
                                    <textarea rows="4" cols="50" id="reply" class="form-control" placeholder="Il tuo commento .." v-model="reply"></textarea>
                                </div>
                                <div class="text-right">
                                    <button class="btn btn-primary" type="button" @click.prevent="postReply()">Pubblica risposta <i class="fa fa-plus"></i></button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- /st-content-inner -->
    </div>
</template>
<script>
import {
    eventBus
} from '../../eventbus.js';

export default {
    mounted: function() {
        this.$nextTick(function() {
            $("#chat").css('max-height', ($(window).height() - 550) + 'px')

            this.initialize();
        });
    },

    beforeDestroy: function() {
        eventBus.$emit('ignoreDiscussion', 0);
    },
    data: function() {
        return {
            isLoading: false,
            everythingLoaded: false,
            empty: false,
            reply: '',
            labelout: false,
            title: '',
            date: '',
            iddiscussione: this.id ? this.id : '',
            commentsReady: false,
            tutticommenti: [],
            replies: [],
            unsuccessfulReplies: 0,
            retrying: false,

            timer: 0,
            time: 15000,
            gate: 0,
            key: false,

            userImg: "../images/profile-photo_small.png"
        }
    },
    watch: {
        '$route': function() {
            this.initialize();
        }
    },
    props: {
        id: {
            type: Number
        }
    },
    methods: {
        initialize: function() {
            //this.iddiscussione = this.$route.path.split('/')[2];
            //lancio un evento per notifier
            eventBus.$emit('ignoreDiscussion', this.iddiscussione);

            this.checkForAuthorization();
            this.getCommenti();
            this.timer = this.time;
            this.reloadLoop();
            this.timerLoop();
        },
        getCommenti: function() {
            if (localStorage.getItem("userAvatar") != null) {
                this.userImg = localStorage.getItem("userAvatar");
            }

            this.$http.get(localStorage.getItem('path') + '/APIDiscussioni?ID=' + this.iddiscussione).then((response) => {
                let disc = response.body;
                try{
                    disc = JSON.parse(response.body);
                } catch(err) {};

                if (disc.APIDiscussioni && disc.APIDiscussioni.length > 0) {
                    disc = disc.APIDiscussioni[0];
                    this.title = disc.Titolo;
                    this.date = disc.DataInizio;
                }
            });

            this.$http.get(localStorage.getItem('path') + '/APICommentiDiscussione?IDDiscussione=' + this.iddiscussione).then((response) => {
                let comm = response.body;
                try{
                    comm = JSON.parse(response.body);
                } catch(err) {};

                this.tutticommenti = [];

                if (comm.APICommentiDiscussione && comm.APICommentiDiscussione.length > 0) {
                    let now = new Date(Date.now());

                    for (let i = 0; i < comm.APICommentiDiscussione.length; i++) {
                        let commento = comm.APICommentiDiscussione[i];
                        //FORMAT CHANGE
                        //new Date(commento.DataInserimento.replace(/-/g, '/'));
                        let fullDate = new Date(commento.DataInserimento.replace(/\./g, ':'));
                        

                        //elabora cosa mostrare a lato del commento
                        let displayDate;
                        displayDate = parseDate(now, fullDate);

                        //controllo id localStorage
                        if (commento.IDAutore == localStorage.getItem("idpersona")) {
                            this.tutticommenti.push({
                                autore: "Tu",
                                nome: localStorage.getItem("nomecognome"),
                                avatar: this.userImg,
                                data: displayDate,
                                isMine: true,
                                titolo: commento.Titolo,
                                comm: commento.Commento,
                                id: commento.ID,

                                orderdate: fullDate
                            });

                            if (this.tutticommenti.length == comm.APICommentiDiscussione.length) {
                                //automaticamente ordinati solo su chrome
                                this.tutticommenti.sort(function(a, b) {
                                    return a.orderdate - b.orderdate;
                                })
                                this.everythingLoaded = true;

                                this.scrolldown();
                                this.loadAvatars();
                            }

                        } else {

                            this.$http.get(localStorage.getItem('path') + '/APIUtenti?IDPersona=' + commento.IDAutore, {
                                headers: {
                                    light: "1"
                                }
                            }).then((response) => {
                                let author = response.body;
                                try{
                                    author = JSON.parse(response.body);
                                } catch(err) {};

                                author = author.APIUtenti[0];

                                let obj = {
                                    autore: author.Persona,
                                    nome: author.NomePersona,
                                    avatar: "../images/profile-photo_small.png",
                                    data: displayDate,
                                    isMine: false,
                                    titolo: commento.Titolo,
                                    comm: commento.Commento,
                                    id: commento.ID,

                                    orderdate: fullDate
                                }
                                this.tutticommenti.push(obj);

                                if (this.tutticommenti.length == comm.APICommentiDiscussione.length) {
                                    //automaticamente ordinati solo su chrome
                                    this.tutticommenti.sort(function(a, b) {
                                        return a.orderdate - b.orderdate;
                                    })
                                    this.everythingLoaded = true;

                                    this.scrolldown();
                                    this.loadAvatars();
                                }
                            });
                        }
                    }
                }
            });
        },
        loadAvatars: function() {
            for (var i = 0; i < this.tutticommenti.length; i++) {
                if (!this.tutticommenti[i].isMine) {
                    this.$http.get(localStorage.getItem('path') + '/APIUtenti?IDPersona=' + this.tutticommenti[i].autore).then((response) => {
                        var res = response.body;
                        try{
                            res = JSON.parse(response.body);
                        } catch(err) {};
                        if (res && res.APIUtenti && res.APIUtenti[0].FOTO) {
                            this.tutticommenti[i].avatar = res.APIUtenti[0].FOTO;
                        }
                    })
                }
            }
        },
        postReply: function() {

            if (this.reply.trim() != "") {
                let idautore = localStorage.getItem("idpersona");
                let iddisc = this.iddiscussione;
                let commento = this.reply;

                var json = {
                    "IdDiscussione": iddisc,
                    "IdPersona": idautore,
                    "Testo": commento
                }
                this.reply = '';

                this.$http.post(localStorage.getItem('path') + '/APICommentiDiscussione', json, {
                    headers: {
                        'X-HTTP-Method-Override': "InserisciCommento",
                        'Content-Type': 'application/json'
                    }
                }).then((response) => {

                    var obj = {
                        autore: 'Tu',
                        nome: localStorage.getItem("nomecognome"),
                        avatar: this.userImg,
                        data: 'adesso',
                        isMine: true,
                        titolo: 'Locale',
                        comm: commento
                    }

                    this.tutticommenti.push(obj);
                    if (this.empty) {
                        this.empty = false;
                    }

                    this.scrolldown();
                    this.updateDate();
                });
            }
        },
        retried: function() {
            this.retrying = false;
        },
        retryReply: function(index, json) {
            this.retrying = true;
            setTimeout(this.retried, 1500);

            this.unsuccessfulReplies--;


            this.$http.post(localStorage.getItem('path') + '/APICommentiDiscussione',
                json, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                },
                function(data) {}).then((response) => {

                var obj = {
                    autore: 'Tu',
                    avatar: this.userImg,
                    data: 'adesso',
                    isMine: true,
                    titolo: 'Locale',
                    comm: json.Commento
                }

                if (response.status == 200 || response.status == 204) {

                } else {
                    this.unsuccessfulReplies++;

                    obj.err = true;
                    obj.retry = json;
                }

                this.tutticommenti.splice(index, 1);
                this.tutticommenti.push(obj);

                if (this.empty) {
                    this.empty = false;
                }


                this.scrolldown();
                this.updateDate();
            });
        },
        delete: function(id) {
            this.$http.delete(localStorage.getItem('path') + '/APICommentiDiscussione/' + id).then((response) => {
                this.getCommenti();
            });
        },
        scrolldown: function() {

            $('#chat').animate({
                scrollTop: 9999
            });
        },
        updateDate: function() {
            var json = {
                "IDPersona": localStorage.getItem("idpersona"),
                "IDDiscussione": this.iddiscussione
            }
            this.$http.post(localStorage.getItem('path') + '/APICollaboratoriDiscussioni', json, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                },
                function(data) {}).then((response) => {

            });
        },
        checkForAuthorization: function() {
            this.$http.get(localStorage.getItem('path') + '/APICollaboratoriDiscussioni?IDPersona=' + localStorage.getItem("idpersona") + "&IDDiscussione=" + this.iddiscussione).then((response) => {

                let coll = response.body;
                try{
                    coll = JSON.parse(response.body);
                } catch(err) {};
                coll = coll.APICollaboratoriDiscussioni;

                if (coll && coll.length > 0) {
                    //se si carica qui invece che in ready si aspetta questa risposta per cominciare a caricare i commenti
                    //this.getCommenti();
                    this.updateDate();
                    eventBus.$emit('saw', this.iddiscussione);

                } else {

                    eventBus.$emit('alert', "Non sei autorizzato a partecipare a questa discussione");
                    this.$router.replace({
                        name: 'forum'
                    })
                }
            });
        },
        forceCheck: function() {
            this.key = true;
            this.checkForReplies();
            this.key = false;
            this.gate++;
        },
        reloadLoop: function() {
            this.isLoading = false;
            this.timer = this.time;
            if (this.$route.path.split('/')[1] == 'app-forum') {
                setTimeout(this.checkForReplies, this.time);
            }
        },
        checkForReplies: function() {

            if (this.gate == 0 || this.key) {
                this.isLoading = true;
                this.$http.get(localStorage.getItem('path') + '/APICommentiDiscussione?IDDiscussione=' + this.iddiscussione).then((response) => {

                    var comm = response.body;
                    try{
                        comm = JSON.parse(response.body);
                    } catch(err) {};

                    if (comm && comm.APICommentiDiscussione) {
                        //se tutticommenti contiene risposte "errore", non vengono conteggiate
                        if (comm.APICommentiDiscussione.length <= (this.tutticommenti.length - this.unsuccessfulReplies)) {
                            setTimeout(this.reloadLoop, 1500);
                        } else {

                            var count = (comm.APICommentiDiscussione.length - this.tutticommenti.length);
                            for (var i = 0; i < count; i++) {
                                var commento = comm.APICommentiDiscussione.pop()
                                var obj = {
                                    autore: commento.IDAutore,
                                    avatar: "../images/profile-photo_small.png",
                                    data: 'adesso',
                                    isMine: false,
                                    titolo: commento.Titolo,
                                    comm: commento.Commento,
                                    id: commento.ID
                                }
                                this.replies.push(obj);
                                this.$http.get(localStorage.getItem('path') + '/APIUtenti?IDPersona=' + commento.IDAutore).then((response) => {
                                    var author = response.body;
                                    try{
                                        author = JSON.parse(response.body);
                                    } catch(err) {};

                                    if (author && author.APIUtenti) {
                                        obj.autore = author.APIUtenti[0].Persona;
                                    }
                                });
                            }
                            this.updateDate();
                            this.replies.reverse();
                            setTimeout(this.addReplies, 1500);
                        }
                    } else {
                        setTimeout(this.reloadLoop, 1500);
                    }
                });
            } else {
                this.gate--;
            }
        },
        addReplies: function() {
            if (this.replies.length > 0) {
                for (var i = 0; i < this.replies.length; i++) {
                    this.tutticommenti.push(this.replies[i]);
                }
                this.scrolldown();
            }
            this.replies = [];
            this.reloadLoop();
        },
        timerLoop: function() {
            if (this.$route.path.split('/')[1] == 'app-forum') {
                setTimeout(this.countdown, 1000);
            }
        },
        countdown: function() {
            this.timer -= 1000;
            this.timerLoop();
        }
    }
}
</script>
<style scoped>
.pull-right {
    margin-left: 0px !important;
    margin-top: 10px !important;
}

.media {
    margin-top: 0px !important;
}

.s-container {
    margin-bottom: 0px !important;
}

.pull-text-r {
    background-color: #eee !important;
    border-radius: 10px 0px 10px 10px !important;
    border: 1px solid #bbb !important;
}

.pull-text-l {
    background-color: #fff !important;
    border-radius: 0px 10px 10px 10px !important;
    border: 1px solid #bbb !important;
}

#chat {
    max-height: 600px;
    overflow-y: auto;
    margin-bottom: 15px;
}

.inserimento {
    background-color: #bbb;
    border-radius: 10px;
}

textarea#reply {
    font-weight: 300;
}


/*

.put-padding {
    padding: 10px;
    margin-bottom: 20px;
}


.pad-right {
    margin-right: 5px;
}

.pad-rel {
    padding: 8px;
    padding-bottom: 11px;
}

.reload {
    background-color: white !important;
}

.reload:hover {
    background-color: #e6e6e6 !important;
}

div.error {
    background-color: lightgray !important;
    opacity: 0.7;
}

div.err-show {
    color: white !important;
}

textarea#reply {
    background-color: white;
}

div.reply-body {
    background-color: #f5f5f5;
    border-color: #f5f5f5;
}

div.pull-text-r {
    background-color: gainsboro;
    border-color: silver;
    text-align: right;
}

@media (max-width: 768px) {
    .panel-comment {
        width: auto;
    }
}

@media (min-width: 769px) {
    .panel-comment {
        width: 300px;
    }
    @media (min-width: 1080px) {
        .panel-comment {
            width: 550px;
        }
    }
    @media (min-width: 1480px) {
        .panel-comment {
            width: 800px;
        }
    }
}
*/
</style>
