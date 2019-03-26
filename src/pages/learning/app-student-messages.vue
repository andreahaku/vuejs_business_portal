<template>
    <div class="st-pusher" id="content">
        <div class="st-content">
            <div id="wrapper-div" class="st-content-inner padding-none" style="overflow-y: auto;">
                <div class="container-fluid">
                    <div class="page-section third">
                        <div class="media messages-container media-clearfix-xs-min media-grid">
                            <div class="media-left hidden-xs">
                                <h4 class="text-headline margin-none hidden-xs">Recenti</h4>
                                <p class="text-subhead text-light hidden-xs">Le ultime conversazioni attive</p>
                                <div id="index-chat" class="messages-list panel panel-default paper-shadow">
                                    <div>
                                        <ul class="list-group" style="margin-bottom: 0px;">
                                            <transition-group name="slide">
                                                <li v-for="(chat,index) in tuttechat" class="list-group-item" :class="{'active': active==chat.id}" :key="index">
                                                    <a @click="routeToChat(chat.id)">
                                                        <div class="media v-middle">
                                                            <div class="media-left">
                                                                <img :src="chat.avatar" width="50" alt="" class="media-object" />
                                                            </div>
                                                            <div class="media-body" style="overflow-y: hidden; padding-top: 5px;">
                                                                <span class="date enh">{{chat.displayDate}}</span>
                                                                <span class="user">{{chat.nome}}</span>
                                                                <div class="text-light enh" style="height: 30px;"><span v-if="chat.isLastMine">Tu: </span><span v-html="chat.ultimoMess"></span></div>
                                                            </div>
                                                        </div>
                                                    </a>
                                                </li>
                                            </transition-group>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div class="media-body" id="chat-body">
                                <div id="open-chat">
                                    <div v-for="mess in messaggi" class="panel panel-default paper-shadow" :class="{'al-r': mess.mine, 'al-l': !mess.mine}">
                                        <div class="panel-body">
                                            <div class="media v-middle">
                                                <div class="media-right" :class="{'pull-right': mess.mine}" style="padding: 0px 5px;">
                                                    <img :src="mess.avatar" class="media-object img-circle width-50" />
                                                </div>
                                                <div class="media-body message">
                                                    <h4 class="text-subhead margin-none">{{mess.nome}}</h4>
                                                    <p class="text-caption text-light"><i class="fa fa-clock-o"></i> {{mess.displayDate}}</p>
                                                </div>
                                            </div>
                                            <p v-html="mess.commento"></p>
                                        </div>
                                    </div>
                                </div>
                                <a class="btn btn-primary pull-left visible-xs-block" v-if="!toggleList" style="margin-right:9px;" @click="toggleList=true;">
                                    <i class="fa fa-chevron-right" aria-hidden="true"></i>
                                </a>
                                <div class="form-group" id="send-form">
                                    <div class="input-group">
                                        <!-- /btn-group 
                                        <input type="text" class="form-control share-text" placeholder="Write message..." />-->
                                        <textarea id="send-area" class="form-control" placeholder="Write message..." cols="30" rows="1" @keydown.enter="enterPressed()" v-model="textValue" @click="wrapperScrolldown()" style="background-color: white;"></textarea>
                                        <div class="input-group-btn">
                                            <a class="btn btn-primary" @click="sendReply()" style="margin-left: 5px;">
                                                <i class="fa fa-envelope"></i> Invia
                                            </a>
                                        </div>
                                    </div>
                                    <!-- /input-group -->
                                </div>
                            </div>
                            <div class="panel panel-default paper-shadow" id="xs-mess" :class="{'inn': toggleList}">
                                <div class="input-group-btn" style="padding: 10px 0px 5px 15px;">
                                    <a class="btn btn-primary" @click="toggleList=false;">
                                        <i class="fa fa-reply"></i>
                                    </a>
                                </div>
                                <ul class="list-group">
                                    <li v-for="chat in tuttechat" class="list-group-item" :class="{'active': active==chat.id}">
                                        <a @click="routeToChat(chat.id)">
                                            <div class="media v-middle">
                                                <div class="media-left">
                                                    <img :src="chat.avatar" width="50" alt="" class="media-object" />
                                                </div>
                                                <div class="media-body">
                                                    <span class="date">{{chat.displayDate}}</span>
                                                    <span class="user">{{chat.nome}}</span>
                                                    <div class="text-light" style="width: 80vw; height: 30px;"><span v-if="chat.isLastMine">Tu: </span><span v-html="chat.ultimoMess"></span></div>
                                                </div>
                                            </div>
                                        </a>
                                    </li>
                                    <li class="list-group-item"></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <sidejsonly :default="true"></sidejsonly>
    </div>
</template>
<script>
import sidejsonly from '../components/side-default-jsonly.vue'

export default {

    mounted: function() {
        this.$nextTick(function() {
            if (localStorage.getItem("userAvatar") != null) {
                this.userImage = localStorage.getItem("userAvatar");
            }
            this.clearCache();
            this.getChats();
        });

    },
    beforeDestroy: function() {
        this.clearCache();
    },
    components: {
        sidejsonly
    },
    data: function() {
        return {
            toggleList: false,
            tuttechat: [],
            messaggi: [],
            active: -1,
            idparameter: -1,
            textValue: '',
            userImage: "../images/profile-photo_small.png"
        }
    },
    watch: {
        'textValue': function() {
            if (this.textValue.trim() == "") {
                this.textValue = '';
                document.getElementById("send-area").setAttribute("rows", 1);
            }
        },
        '$route': function() {
            if (this.tuttechat.length > 0) {
                var par = this.$route.path.split('/')[2];
                if (par != null && par.trim() != "") {
                    this.idparameter = par;
                    var focusing;
                    var ix = -1;
                    for (var i = 0; i < this.tuttechat.length; i++) {
                        if (this.tuttechat[i].id == this.idparameter) {
                            ix = i;
                            focusing = this.tuttechat[i];
                            break;
                        }
                    }
                    if (focusing != null && ix != -1) {
                        this.tuttechat.splice(ix, 1);
                        this.tuttechat.splice(0, 0, focusing);
                        this.getMessages(focusing.id);
                    }
                }
                this.indexScrolltop();
            }
        }
    },
    methods: {
        getChats: function() {
            var par = this.$route.path.split('/')[2];
            if (par != null && par.trim() != "") {
                this.idparameter = par;
            }
            /*
            this.$http("chat").then((response) => { 
            }); */
            for (var i = 0; i < 10; i++) {
                var obj;
                if (i % 2 == 0) {
                    obj = {
                        id: i,
                        idpersona: 1111,
                        nome: 'Sofia Michelini',
                        ultimoMess: "Ci vediamo?",
                        isLastMine: true,
                        avatar: "../images/profile-photo_small.png",
                        date: 147999500000 + 3000000 * i
                    }
                } else {
                    obj = {
                        id: i,
                        idpersona: 2222,
                        nome: 'Adriano Darmiano',
                        ultimoMess: "Possiamo organizzare una call skype? Possiamo? Possiamo? Dai Dai Dai Dai Dai Dai Dai Dai. Possiamo organizzare una call skype? Possiamo? Possiamo? Dai Dai Dai Dai Dai Dai Dai Dai. ",
                        isLastMine: false,
                        avatar: "../images/profile-photo_small.png",
                        date: 147999500000 + 3000000 * i + 500000
                    }
                }

                var displayDate = parseDate(new Date(Date.now()), new Date(obj.date));
                obj.displayDate = displayDate;
                this.tuttechat.push(obj);

            }

            if (this.idparameter != -1) {
                this.getMessages(this.idparameter);
                this.orderByParameter(this.idparameter);
            } else {
                this.orderByParameter(-1);
                this.getMessages(this.tuttechat[0].id);
            }

        },
        routeToChat: function(id) {
            this.$router.push({
                name: 'chat',
                params: {
                    idchat: id
                }
            })
        },
        getMessages: function(id) {

            if (this.active != id) {
                this.active = id;
                /*
                this.$http("chat-messages").then((response) => { 
                }); */
                this.messaggi = [];
                if (localStorage.getItem("chat" + id) != null) {
                    this.messaggi = JSON.parse(localStorage.getItem("chat" + id));
                } else {
                    for (var i = 0; i < 10; i++) {
                        var obj;
                        var idpersona;
                        if (i % 2 == 0) {
                            idpersona = 2834;
                        } else {
                            idpersona = 1111;
                        }
                        if (id % 2 == 0) {

                            if (i % 2 == 0) {
                                obj = {
                                    idpersona: idpersona,
                                    nome: 'Sofia Michelini',
                                    displayDate: '2 minuti fa',
                                    commento: "Ci vediamo allora?",
                                    avatar: 'images/people/110/woman-5.jpg',
                                    date: 147999500000 + 3000000 * i
                                }
                            } else {
                                obj = {
                                    idpersona: idpersona,
                                    nome: 'Adriano Darmiano',
                                    displayDate: "poco fa",
                                    commento: "Ciao Sofia. <br> Certo, domani va bene. A che ora?",
                                    avatar: 'images/people/110/guy-5.jpg',
                                    date: 147999500000 + 3000000 * i + 500000
                                }
                            }
                        } else {
                            if (i % 2 != 0) {
                                obj = {
                                    idpersona: idpersona,
                                    nome: 'Sofia Michelini',
                                    displayDate: '2 minuti fa',
                                    commento: "Certo.<br>Domani va bene per vederci e discutere di quella cosa?",
                                    avatar: 'images/people/110/woman-5.jpg',
                                    date: 147999500000 + 3000000 * i
                                }
                            } else {
                                obj = {
                                    idpersona: idpersona,
                                    nome: 'Adriano Darmiano',
                                    displayDate: "ieri",
                                    commento: "Possiamo organizzare una call Skype?",
                                    avatar: 'images/people/110/guy-5.jpg',
                                    date: 147999500000 + 3000000 * i + 500000
                                }
                            }
                        }
                        if (obj.idpersona == localStorage.getItem("idpersona")) {
                            obj.mine = true;
                            obj.nome = 'Tu';
                            obj.avatar = this.userImage;
                        } else {
                            obj.mine = false;
                            obj.nome = obj.nome;
                            obj.avatar = "../images/profile-photo_small.png";
                        }

                        this.messaggi.push(obj);
                    }

                    this.messaggi.sort(function(a, b) {
                        return a.date - b.date;
                    });
                    this.tuttechat[0].ultimoMess = this.messaggi[this.messaggi.length - 1].commento;
                    this.stackMessage(this.messaggi[this.messaggi.length - 1].commento, obj.date, this.messaggi[this.messaggi.length - 1].mine);
                    this.cacheChat(this.messaggi);
                }
                this.loadChatImages();
                this.loadIndexImages();
            }

            this.chatScrolldown();
            this.wrapperScrolldown();
            if (this.toggleList) {
                this.toggleList = !this.toggleList;
            }
        },
        loadChatImages: function() {
            for (let i = 0; i < this.messaggi.length; i++) {
                if (!this.messaggi[i].mine) {
                    /* WAITING API
                    this.$http.get(localStorage.getItem("path")+'/APIUtenti?IDPersona='+this.messaggi[i].idpersona).then((response) => {
                        try{
                            var res = JSON.parse(response.body);
                            if(res != null && res.APIUtenti != null && res.APIUtenti[0].FOTO != null){
                                this.messaggi[i].avatar = res.APIUtenti[0].FOTO;   
                            }
                        } catch(err){}
                    }); */
                }
            }

        },
        loadIndexImages: function() {
            for (let i = 0; i < this.tuttechat.length; i++) {
                /* WAITING API
                this.$http.get(localStorage.getItem("path")+'/APIUtenti?IDPersona='+this.tuttechat[i].idpersona).then((response) => {
                    try{
                        var res = JSON.parse(response.body);
                        if(res != null && res.APIUtenti != null && res.APIUtenti[0].FOTO != null){
                            this.tuttechat[i].avatar = res.APIUtenti[0].FOTO;   
                        }
                    } catch(err){}
                }); */
                //WAITING API:
                if (this.tuttechat[i].idpersona === 1111) {
                    this.tuttechat[i].avatar = "../images/people/50/woman-5.jpg";
                } else if (this.tuttechat[i].idpersona === 2222) {
                    this.tuttechat[i].avatar = "../images/people/50/guy-4.jpg";
                }
                //
            }
        },
        orderByParameter: function(par) {
            if (par != -1) {
                this.tuttechat.sort(function(a, b) {
                    if (a.id == par) {
                        return -1;
                    } else if (b.id == par) {
                        return 1;
                    } else {
                        return b.date - a.date;
                    }
                });
            } else {
                this.tuttechat.sort(function(a, b) {
                    return b.date - a.date;
                });
            }
        },
        cacheChat: function(chat) {
            var ind = localStorage.getItem("chats");
            if (ind != null) {
                ind = JSON.parse(ind);
                var dex = ind.indexOf("chat" + this.active);
                if (dex == -1) {
                    ind.push('chat' + this.active);
                    localStorage.setItem("chats", JSON.stringify(ind));
                }
            } else {
                var chats = [];
                chats.push('chat' + this.active);
                localStorage.setItem("chats", JSON.stringify(chats));
            }
            localStorage.setItem("chat" + this.active, JSON.stringify(chat));
        },
        clearCache: function() {

            var chats = localStorage.getItem('chats');
            if (chats != null) {
                chats = JSON.parse(chats)
                for (var i = 0; i < chats.length; i++) {
                    localStorage.removeItem(chats[i]);
                }
                localStorage.removeItem("chats");
            }
        },
        enterPressed: function() {
            this.alterAreaColumns(1);
        },
        alterAreaColumns: function(delta) {
            var curr = document.getElementById("send-area").getAttribute("rows");
            curr = curr * 1;
            if (curr < 3) {
                curr += delta;
                document.getElementById("send-area").setAttribute("rows", curr);
            }
            this.wrapperScrolldown();
        },
        sendReply: function() {
            if (this.textValue.trim() != "") {
                /*  var url = "" //?
                var json = {} //?
                this.$http.post("", json, {
                    header: {}
                }).then(response => {}) */

                this.textValue = this.textValue.replace(/\n/g, "<br>");
                this.messaggi.push({
                    nome: 'Tu',
                    displayDate: "ora",
                    commento: this.textValue,
                    avatar: this.userImage,
                    mine: true,
                    date: Date.now()
                });

                this.stackMessage(this.textValue, new Date(Date.now()), true);
                this.cacheChat(this.messaggi);
                this.textValue = '';
                this.chatScrolldown();
            }
        },
        stackMessage: function(str, date, mine) {

            this.tuttechat[0].ultimoMess = str;
            var display = parseDate(new Date(Date.now()), new Date(date));
            this.tuttechat[0].displayDate = display;
            this.tuttechat[0].isLastMine = mine;
        },
        wrapperScrolldown: function() {
            $('#wrapper-div').animate({
                scrollTop: 9999
            });
        },
        chatScrolldown: function() {
            $('#open-chat').animate({
                scrollTop: 9999
            });
        },
        indexScrolltop: function() {
            $('#index-chat').animate({
                scrollTop: 0
            });
        }
    }
}
</script>
<style>
.pull-transition {
    transition: all .25s ease;
}

.pull-enter,
.pull-leave {
    width: 0px;
}

div#open-chat {
    height: 70vh;
    overflow-y: auto;
    margin-bottom: 25px;
}

div#chat-body {
    /*
        padding: 15px;
        border-top-style: ridge;
        border-left-style: ridge;
        border-color: gainsboro;
        border-width: medium;
        */
}

@media (max-width: 768px) {
    div#open-chat {
        height: 70vh;
        overflow-y: auto;
        margin-bottom: 25px;
    }
    div.page-section.third {
        padding-top: 10px;
        padding-bottom: 10px;
    }
    div#index-chat {
        width: 70px;
    }
    div#chat-body {
        padding: inherit;
        border-style: inherit;
    }
}

div#index-chat {
    width: 300px;
    max-height: 45vh;
    overflow-y: auto;
    overflow-x: hidden;
}

#xs-mess {
    position: fixed;
    top: 50px;
    left: 0px;
    height: 85vh;
    overflow-y: auto;
    z-index: 99;
    width: 0px;
    transition: width 0.5s;
}

.inn {
    width: 100vh !important;
}

.al-r {
    text-align: right;
    margin-right: 5px;
    margin-left: 50px;
    background-color: gainsboro;
}

.al-l {
    text-align: left;
    margin-right: 50px;
}

@media (min-width: 950px) {
    .al-r {
        text-align: right;
        margin-right: 5px;
        margin-left: 10vw;
    }
    .al-l {
        text-align: left;
        margin-right: 10vw;
    }
}

@media (min-width: 1200px) {
    .al-r {
        margin-left: 25vw;
    }
    .al-l {
        margin-right: 25vw;
    }
}

li.active span.enh {
    color: black;
}

li.active div.enh {
    color: darkslategray !important;
}
</style>
