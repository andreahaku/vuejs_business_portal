<template>
    <transition name="modal">
        <div class="modal-mask" v-show="datashow">
            <div class="modal-wrapper">
                <div class="modal-container" id="alert-container">
                    <div class="modal-header">
                        <slot name="header">
                            <h3>Invio Feedback</h3>
                        </slot>
                    </div>
                    <div class="modal-body">
                        <slot name="body">
                            <div class="media">
                                <div class="media-left">
                                    <label class="control-label">A:</label>
                                </div>
                                <div class="media-body">
                                    <input type="text" disabled :value="who" class="form-control">
                                </div>
                            </div>
                            <div v-if="errSkill" class="media" style="margin: 0px;">
                                <div class="media-left">
                                    <label class="control-label"></label>
                                </div>
                                <div class="alert alert-danger media-body" role="alert">Competenza non valida</div>
                            </div>
                            <div class="media">
                                <div class="media-left">
                                    <label class="control-label">Su:</label>
                                </div>
                                <div class="media-body">
                                    <input type="text" :disabled="requested" v-model="skill" class="form-control">
                                    <div v-if="!requested && results.length > 0" class="collapse" id="collapseList">
                                        <ul class="list-group">
                                            <li class="list-group-item sk" v-for="r in results" @click="selected(r.nome)">{{r.nome}}</li>
                                        </ul>
                                    </div>
                                </div>
                                <div class="media-right" style="padding: 0px;">
                                    <a class="btn btn-default" @click="toggleList()" :disabled="requested"><i v-if="!shown" class="fa fa-caret-down" aria-hidden="true"></i><i v-else class="fa fa-caret-up" aria-hidden="true"></i></a>
                                </div>
                            </div>
                            <div v-if="errRating" class="alert alert-danger" role="alert">Punteggio obbligatorio</div>
                            <rating @star="starsChanged" :rating="rating"></rating>
                            <label class="control-label">Commento (opzionale)</label>
                            <textarea name="" id="" cols="30" rows="4" v-model="comment" class="form-control"></textarea>
                        </slot>
                    </div>
                    <div class="modal-footer">
                        <slot name="footer">
                            <button class="modal-default-button yes" @click="send(true)">
                                Invia Feedback
                            </button>
                            <button class="modal-default-button" @click="send(false)">
                                Annulla
                            </button>
                        </slot>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>
<script>
import rating from './input-rating.vue';

export default {
    props: {
        show: {
            type: Boolean
        },
        feed: {
            type: String
        },
        who: {
            type: String
        },
        requested: {
            type: Boolean
        }
    },
    components: {
        rating
    },
    data: function() {
        return {
            datashow: this.show,
            comment: '',
            rating: 0,
            skill: '',

            skillsCollection: null,
            results: [],
            shown: false,

            errRating: false,
            errSkill: false
        }
    },
    watch: {
        show: function() {
            this.datashow = this.show;
            if (!this.requested && this.skillsCollection == null) {
                this.skillsCollection = this.$store.getters.getCompetenze;
            }
            if (!this.requested) {
                this.results = this.skillsCollection.data;
            }
            if (this.datashow) {
                if (window.innerWidth < 768) {
                    this.xs = true;
                    $("#alert-container").width(280);
                } else {
                    this.xs = false;
                    $("#alert-container").width(400);
                }
            }
        },
        feed: function() {
            if (this.requested) {
                this.skill = this.feed;
            }
        },
        skill: function() {
            if (!this.requested) {
                this.filter();
            }
        }
    },
    methods: {
        send: function(yes) {
            if (yes) {
                var allowed = 1;
                var data = {};
                if (!this.requested) {
                    data = this.skillsCollection.chain().find({
                        'nome': this.skill
                    }).data();
                    allowed = data.length;
                }

                if (this.rating == 0) {
                    this.errRating = true;
                }
                if (allowed == 0) {
                    this.errSkill = true;
                }
                if (this.rating > 0 && allowed > 0) {
                    var obj = {
                        submit: yes,
                        rating: this.rating,
                        comment: this.comment
                    };
                    if (!this.requested) {
                        obj.skill = data[0].id;
                    }
                    this.$emit('done', obj);
                    this.close()
                }
            } else {
                this.$emit('done', {
                    submit: yes,
                    rating: 0
                });
                this.close()
            }
        },
        close: function() {
            if (!this.requested) {
                $('#collapseList').collapse('hide');
                this.skill = '';
            }
            this.shown = false;
            this.rating = 0;
            this.errRating = false;
            this.errSkill = false;
            this.comment = '';
            this.results = [];
            this.datashow = false;
        },
        starsChanged($event) {
            this.rating = $event;
            this.errRating = false;
        },
        filter() {
            var vm = this;
            this.results = this.skillsCollection.where(function(obj) {
                return obj.nome.toLowerCase().includes(vm.skill.toLowerCase());
            })
        },
        selected(nome) {
            this.skill = nome;
            $('#collapseList').collapse('hide');
            this.shown = false;
            this.errSkill = false;
        },
        toggleList() {
            $('#collapseList').collapse('toggle');
            this.shown = !this.shown;
        }
    }
}
</script>
<style scoped>
.modal-mask {
    position: fixed;
    z-index: 9997;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    display: table;
    transition: opacity .3s ease;
}

.modal-wrapper {
    display: table-cell;
    vertical-align: middle;
}

.modal-container {
    width: 400px;
    margin: 0px auto;
    padding: 20px 30px;
    background-color: #fff;
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
    transition: all .3s ease;
    font-family: Helvetica, Arial, sans-serif;
}

.modal-header h3 {
    margin-top: 0;
    color: #42b983;
}

.modal-body {
    margin: 0px 0;
}

.modal-default-button {
    float: right;
}

button.yes {
    margin-left: 5px;
}

h4 {
    margin-top: 5px;
}

.control-label {
    width: 20px;
}

.media {
    margin-top: 0px;
    margin-bottom: 10px;
}

.sk {
    margin: 0px;
    border-width: 0px 1px 1px 1px;
    padding: 5px 15px;
}

.sk:hover {
    background-color: #42a5f5;
    color: white;
    cursor: pointer;
}

#collapseList {
    max-width: 490px;
    max-height: 150px;
    overflow-y: auto;
}

.alert-danger {
    margin-top: 10px;
    margin-bottom: 0px;
    padding: 10px 15px;
    background-color: #f2dede;
    color: #a94442;
    border-color: #ebccd1;
}
</style>
