<template>
    <div>
        <alert :show="showAlert" :feed="submitFeed" :who="submitWho" :requested="true" @done="submitDone"></alert>
        <div class="row">
            <div class="col-xs-12 col-sm-8">
                <h4 class="text-headline margin-none">Feedback Richiesti <span class="badge">{{quantisono}}</span></h4>
                <p class="text-subhead text-light">La lista dei feedback da dare</p>
            </div>
            <div class="col-xs-12 col-sm-4">
                <paginazione :array="myRequested" @displayChanged="dispatchedPagination($event)" :limit="perpagina">
                </paginazione>
            </div>
        </div>
        <div id="myrequests" class="panel panel-default paper-shadow animated" data-z="0.5" style="overflow-y: auto; margin-bottom:0px;">
            <div>
                <ul v-if="myRequested.length > 0" class="list-group" style="margin: 0px;">
                    <transition-group name="roll-fade">
                        <li class="list-group-item media v-middle" v-for="(req, index) in displayrequests" :key="index">
                            <div class="media-left">
                                <img :src="path+'/'+req.avatar" onerror="this.src = 'images/profile-photo_small.png'" class="img-circle width-70" />
                            </div>
                            <div class="media-body">
                                <h4>{{req.nomeValutato}}</h4>
                                <h5 style="margin-top:3px; margin-bottom: 0px;">Richiesto da: {{req.nomeRichiedente}}</h5>
                                <h5 style="margin-top:3px;">In data: {{req.dataRichiesta}}</h5>
                                <hr style="margin:5px 0px 5px 0px;">
                                <h4 style="margin:0px;">{{req.nomeCompetenza}}</h4>
                            </div>
                            <div class="hidden-xs media-right">
                                <button class="btn btn-sm btn-primary paper-shadow relative" @click="submitFeedback(req, index)">Valuta</button>
                            </div>
                            <div class="visible-xs-block" style="margin-top:5px; text-align: right;">
                                <button class="btn btn-sm btn-primary paper-shadow relative" @click="submitFeedback(req, index)">Valuta</button>
                            </div>
                        </li>
                    </transition-group>
                </ul>
                <ul v-else class="list-group" style="margin: 0px;">
                    <li class="list-group-item">
                        <h4>Non hai nessun feedback richiesto</h4>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
import alert from './alert-feedback.vue'
import paginazione from '../components/paginazione.vue'

import {
    eventBus
} from '../../eventbus.js'

export default {
    created: function() {
        this.init()
    },
    data() {
        return {
            skillsCollection: [],
            feedbacksCollection: [],
            myRequested: [],
            displayrequests: [],

            index: -1,
            submitting: {},
            showAlert: false,
            submitFeed: '',
            submitWho: '',
            path: localStorage.getItem("path")
        }
    },
    computed: {
        quantisono: function() {
            return this.myRequested.length;
        },
        perpagina: function() {
            return Math.max(2, Math.ceil(this.myRequested.length / 4));
        }
    },
    components: {
        alert,
        paginazione
    },
    methods: {
        dispatchedPagination(toDisplay) {
            var parsing = [];
            for (var i = 0; i < toDisplay.length; i++) {
                var obj = toDisplay[i];
                var skill = this.skillsCollection.chain().find({
                    'id': obj.idCompetenza
                }).data()[0];
                if (skill) {
                    obj.nomeCompetenza = skill.nome;
                }
                parsing.push(obj);
            }
            this.displayrequests = parsing;
        },
        init: function() {
            this.initFeedbacks();
        },
        initFeedbacks() {
            this.feedbacksCollection = this.$store.getters.getOthersFeedback;
            this.skillsCollection = this.$store.getters.getCompetenze;
            this.myRequested = this.feedbacksCollection.data.slice();
        },
        submitFeedback(request, i) {
            this.submitFeed = request.nomeCompetenza;
            this.submitWho = request.nomeValutato;
            this.submitting = this.displayrequests[i];
            this.showAlert = true;
        },
        submitDone($event) {
            var obj = $event;
            this.showAlert = false;
            var head = {
                idFeedback: this.submitting.id,
                feedback: obj.rating,
            }
            if (obj.comment && obj.comment.trim() != "") {
                head.commentoFeedback = obj.comment;
            }
            if (obj.submit) {
                if (this.submitting != {}) {
                    this.$http.get(localStorage.getItem("path") + "/APIFeedbackUpdate?ID=.", {
                        headers: head
                    }).then((response) => {
                        console.log(response);
                        this.$store.commit("removeOthersFeedback", this.submitting);
                        this.initFeedbacks();
                    })
                }
            } else {}
        }
    }
}
</script>
<style>
#myrequests {
    /*
    max-height: 106px;
    */
    border-width: 0px;
}

.media-right {
    padding-top: 8px;
    vertical-align: top !important;
}

.badge {
    font-size: 1.5rem;
    font-weight: 300;
    color: white;
    /*
    background-color: #42a5f5;
    */
    background-color: #555;
}

.comp {
    background-color: white;
    padding: 5px;
    border: 1px solid #e3e3e3;
    margin-bottom: 10px;
}

h6 {
    font-weight: 400;
}
</style>
