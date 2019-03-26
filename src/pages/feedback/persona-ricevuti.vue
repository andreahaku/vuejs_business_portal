<template>
    <div class="st-content-inner padding-none">
        <div class="container-fluid">
            <div class="page-section">
                <div class="media v-middle">
                    <div class="media-left media row">
                        <h1 class="text-display-1 margin-none">Lista Feedback</h1>
                        <p class="text-subhead">Elenco dei Feedback ricevuti da:</p>
                        <div class="hidden-xs media-left" style="margin-top: 5px;">
                            <img :src="path+'/'+persona.IMMAGINE" class="img-rounded width-150" onerror="this.src = 'images/profile-photo_small.png'">
                        </div>
                        <div class="visible-xs-block" style="margin: 10px 5px; text-align: center;">
                            <img :src="path+'/'+persona.IMMAGINE" class="img-rounded width-150" onerror="this.src = 'images/profile-photo_small.png'">
                        </div>
                        <div class="media-body row" style="text-align: center; padding-left: 10px">
                            <li class="col-xs-12 col-lg-8 list-group-item anag media v-middle">
                                <div class="media-body sx"><span class="text-subhead h-label"><strong>Nome e Cognome:</strong></span></div>
                                <div class="media-body dx"><span class="text-subhead">{{persona.NOME + " " + persona.COGNOME}}</span></div>
                            </li>
                            <li class="col-xs-12 col-lg-8 list-group-item anag media v-middle">
                                <div class="media-body sx"><span class="text-subhead h-label"><strong>Unità Organizzativa:</strong></span></div>
                                <div class="media-body dx"><span class="text-subhead">{{persona.UO}}</span></div>
                            </li>
                            <li class="col-xs-12 col-lg-8 list-group-item anag media v-middle">
                                <div class="media-body sx"><span class="text-subhead h-label"><strong>Ruolo:</strong></span></div>
                                <div class="media-body dx"><span class="text-subhead">{{persona.RUOLO}}</span></div>
                            </li>
                        </div>
                    </div>
                </div>
                <div class="col-xs-12" style="text-align:right;margin-bottom: 5px;">
                    <paginazione v-if="paginationReady" :array="feedbacks" @displayChanged="dispatchedPagination($event)" :limit="perpagina" style="margin-top: 10px"></paginazione>
                </div>
                <div v-if="feedbacks_displayed.length > 0" class="row" style="margin-top: 20px;">
                    <div v-for="feed in feedbacks_displayed" class="col-xs-12 col-md-6 col-lg-4 feed">
                        <li class="list-group-item media v-middle" :id="'feed'+feed.id" style="overflow-y:auto">
                            <div class="media-left" style="float: left;">
                                <img :src="path+'/'+feed.avatar" onerror="this.src = 'images/profile-photo_small.png'" class="img-circle width-100" />
                            </div>
                            <div class="media-body">
                                <div>
                                    <strong>Emesso da:</strong>
                                    <div style="text-align: center; margin-top: 5px;">{{feed.nomeValutatore}}
                                        <div>In Data: {{feed.data}}</div>
                                    </div>
                                </div>
                                <div v-if="feed.idRichiedente != null">
                                    <strong>Richiesto da:</strong>
                                    <div style="text-align: center; margin-top: 5px;">{{feed.nomeRichiedente}}
                                        <div>In Data: {{feed.dataRichiesta}}</div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <hr>
                                <div style="text-align: center">
                                    <rating :stars="feed.punteggio"></rating>
                                    <h4 v-if="feed.nomeSkill" style="margin-top: 5px;">{{feed.nomeSkill}}</h4>
                                </div>
                            </div>
                            <div v-if="feed.commento && feed.commento.trim()!=''">
                                <hr>
                                <p style="padding-top: 5px;">{{feed.commento}}</p>
                            </div>
                        </li>
                    </div>
                </div>
                <div v-else class="row" style="margin-top: 20px;">
                    <div class="col-xs-12" style="text-align: center">
                        <li class="list-group-item media v-middle">Attualmente non è presente alcun feedback per {{persona.NOME}}</li>
                    </div>
                </div>
            </div>
            <!-- PLACE SRC e anagraphics-->
        </div>
    </div>
    </div>
</template>
<script>
import rating from "../components/rating.vue"
import paginazione from "../components/paginazione.vue"
import {
    eventBus
} from '../../eventbus.js'
export default {
    mounted: function() {
        this.$nextTick(function() {
            this.init();
        })
    },
    components: {
        rating,
        paginazione
    },
    data: function() {
        return {
            persona: {},
            feedbacks: [],
            feedbacks_displayed: [],
            skillsCollection: {},
            paginationReady: false,
            path: localStorage.getItem("path")
        }
    },
    watch: {
        '$route': function() {
            this.init();
        }
    },
    computed: {
        perpagina: function() {
            return window.innerWidth >= 1200 ? 6 : 4;
        }
    },
    methods: {
        init: function() {
            if (this.$route.params.idpersona) {
                this.$http.get(localStorage.getItem("path") + "/APIPersone?IDPERSONA=" + this.$route.params.idpersona).then((response) => {
                    var res = response.body;
                    try {
                        res = JSON.parse(response.body);
                    } catch (err) {};

                    if (res && res.APIPersone) {
                        var max = -1;
                        var maxIndex = -1;
                        for (var i = 0; i < res.APIPersone.length; i++) {
                            if (res.APIPersone[i].PercentualeFTEContabilePersonauo > max) {
                                max = res.APIPersone[i].PercentualeFTEContabilePersonauo;
                                maxIndex = i;
                            }
                        }
                        this.persona = res.APIPersone[maxIndex];
                        this.getFeedbacks();
                    } else {
                        this.$router.replace({
                            path: '/'
                        })
                    }
                })
            } else {
                this.$router.replace({
                    path: '/'
                })
            }
        },
        getFeedbacks: function() {
            this.skillsCollection = this.$store.getters.getCompetenze;
            if (this.skillsCollection != null) {

                this.$http.get(localStorage.getItem("path") + "/APIFeedbackRicevuti?ID=.", {
                    headers: {
                        idPersona: this.persona.IDPERSONA.toString()
                    }
                }).then((response) => {
                    var res = response.body;
                    try {
                        res = JSON.parse(response.body);
                    } catch (err) {};

                    if (res && res.APIFeedbackRicevuti) {
                        for (var i = 0; i < res.APIFeedbackRicevuti.length; i++) {
                            var f = res.APIFeedbackRicevuti[i];
                            this.feedbacks.push({
                                id: f.ID,
                                idCompetenza: f.IDSkill,
                                idValutato: f.IDDestinatario,
                                nomeValutato: f.Destinatario,
                                idValutatore: f.IDAutore,
                                nomeValutatore: f.Autore,
                                idRichiedente: f.IDRichiedente,
                                nomeRichiedente: f.Richiedente,
                                dataRichiesta: f.DataRichiesta ? new Date(f.DataRichiesta).toLocaleDateString() : null,
                                data: f.DataFeedback ? new Date(f.DataFeedback).toLocaleDateString() : null,
                                punteggio: f.Feedback,
                                commento: f.CommentoFeedback,
                                avatar: f.ImmagineAutore
                            });

                            var results = this.skillsCollection.find({
                                'id': this.feedbacks[i].idCompetenza
                            });
                            if (results.length > 0) {
                                this.feedbacks[i].nomeSkill = results[0].nome;
                            }
                        }
                        this.feedbacks.sort(function(a, b) {
                            var newa;
                            var newb;
                            if (new Date(a.data) != "Invalid Date") {
                                newa = a.data;
                                newb = b.data;
                            } else {
                                var aData = a.data.split("/");
                                newa = [aData[1], aData[0], aData[2]];
                                newa = newa.join("/");
                                var bData = b.data.split("/");
                                newb = [bData[1], bData[0], bData[2]];
                                newb = newb.join("/");
                            }
                            return new Date(newb) - new Date(newa);
                        });
                        this.paginationReady = true;
                    }
                })
            }
        },
        dispatchedPagination: function(toDisplay) {
            this.feedbacks_displayed = toDisplay;
            if (window.innerWidth > 768) {
                this.fixHeight();
            }
        },
        fixHeight: function() {
            var vm = this;
            this.$nextTick(function() {
                setTimeout(function() {
                    var max = 0;
                    for (var i = 0; i < vm.feedbacks_displayed.length; i++) {
                        var h = $("#feed" + vm.feedbacks_displayed[i].id).height();
                        if (h > max) {
                            max = h;
                        }
                    }
                    for (var i = 0; i < vm.feedbacks_displayed.length; i++) {
                        $("#feed" + vm.feedbacks_displayed[i].id).height(max);
                    }
                }, 50);
            })
        }
    }
}
</script>
<style scoped>
.sx {
    text-align: left;
}

.dx {
    text-align: center;
}

.anag {
    padding: 5px 8px;
}

.feed {
    border-radius: 3px;
    margin-bottom: 5px;
}
</style>
