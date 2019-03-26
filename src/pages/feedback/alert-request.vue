<template>
    <transition name="modal">
        <div class="modal-mask" v-show="datashow">
            <div class="modal-wrapper">
                <div class="modal-container" id="request-container" style="position: relative; padding:5px;">
                    <div class="modal-header">
                        <slot name="header">
                            <h3>Richiedi Feedback</h3>
                            <div v-if="loading" class='uil-rolling-css' style='transform:scale(0.15); position: absolute; top: -50px; right: 0px;'>
                                <div>
                                    <div style="border-color: #42b983;"></div>
                                    <div style="border-color: #42b983;"></div>
                                </div>
                            </div>
                        </slot>
                    </div>
                    <div class="modal-body">
                        <slot name="body">
                            <div v-if="errChief == 1 && to_for" class="media" style="margin: 0px;">
                                <div v-if="!xs" class="media-left">
                                    <label class="control-label"></label>
                                </div>
                                <div class="alert alert-danger media-body" role="alert">Seleziona un Destinatario valido</div>
                            </div>
                            <div class="media">
                                <div class="media-left">
                                    <label class="control-label">Per:</label>
                                </div>
                                <div v-if="xs" class="media-body" style="padding: 0px; text-align: right;">
                                    <a class="btn btn-default" style="padding: 8px 9px;" @click="findPeople" :disabled="!to_for"><i class="fa fa-eye"></i></a>
                                </div>
                                <div :class="{'media-body': !xs}">
                                    <input type="text" v-model="for_nome" @change="ncChange" placeholder="cerca per nome" class="form-control" :disabled="!to_for" :class="{'danger': errChief == 1 && to_for, 'success': errChief == 2 && to_for}">
                                </div>
                                <div v-if="!xs" class="media-body separator"></div>
                                <div :class="{'media-body': !xs}">
                                    <input type="text" v-model="for_cognome" @change="ncChange" placeholder="cerca per cognome" class="form-control" :disabled="!to_for" :class="{'danger': errChief == 1 && to_for, 'success': errChief == 2 && to_for}">
                                </div>
                                <div v-if="!xs" class="media-right" style="padding: 0px;">
                                    <a class="btn btn-default" style="padding: 8px 9px;" @click="findPeople" :disabled="!to_for"><i class="fa fa-eye"></i></a>
                                </div>
                                <div class="col-xs-12" v-if="persone.length > 0 && to_for" style="padding:0px;">
                                    <div class="media-left">
                                        <label class="control-label"></label>
                                    </div>
                                    <div class="media-body collapsibleRequest" :class="{'lger': !xs}" v-if="persone.length > 0">
                                        <ul class="list-group" style="max-height:150px;">
                                            <li class="list-group-item sk" v-for="p in persone" @click="personaSelectedFor(p)">{{p.nome + " " + p.cognome}}</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div v-if="errChief == 1 && !to_for" class="media" style="margin: 0px;">
                                <div v-if="!xs" class="media-left">
                                    <label class="control-label"></label>
                                </div>
                                <div class="alert alert-danger media-body" role="alert">Seleziona un Valutatore valido</div>
                            </div>
                            <div class="media">
                                <div class="media-left">
                                    <label class="control-label">A:</label>
                                </div>
                                <div v-if="xs" class="media-body" style="padding: 0px; text-align: right;">
                                    <a class="btn btn-default" style="padding: 8px 9px;" @click="findPeople" :disabled="to_for"><i class="fa fa-eye"></i></a>
                                </div>
                                <div :class="{'media-body': !xs}">
                                    <input type="text" v-model="to_nome" @change="ncChange" placeholder="cerca per nome" class="form-control" :disabled="to_for" :class="{'danger': errChief == 1 && !to_for, 'success': errChief == 2 && !to_for}">
                                </div>
                                <div v-if="!xs" class="media-body separator"></div>
                                <div :class="{'media-body': !xs}">
                                    <input type="text" v-model="to_cognome" @change="ncChange" placeholder="cerca per cognome" class="form-control" :disabled="to_for" :class="{'danger': errChief == 1 && !to_for, 'success': errChief == 2 && !to_for}">
                                </div>
                                <div v-if="!xs" class="media-right" style="padding: 0px;">
                                    <a class="btn btn-default" style="padding: 8px 9px;" @click="findPeople" :disabled="to_for"><i class="fa fa-eye"></i></a>
                                </div>
                                <div class="col-xs-12" v-if="persone.length > 0 && !to_for" style="padding:0px;">
                                    <div class="media-left">
                                        <label class="control-label"></label>
                                    </div>
                                    <div class="media-body collapsibleRequest" :class="{'lger': !xs}" v-if="persone.length > 0">
                                        <ul class="list-group" style="max-height:150px;">
                                            <li class="list-group-item sk" v-for="p in persone" @click="personaSelected(p)">{{p.nome + " " + p.cognome}}</li>
                                        </ul>
                                    </div>
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
                                    <input type="text" v-model="skill" class="form-control">
                                    <div class="collapse collapsibleRequest" :class="{'lger': !xs}" id="collapseSkill">
                                        <ul class="list-group" v-if="results.length > 0">
                                            <li class="list-group-item sk" v-for="r in results" @click="selected(r.nome)">{{r.nome}}</li>
                                        </ul>
                                        <ul v-else class="list-group">
                                            <li class="list-group-item" style="font-style: italic">Nessun risultato per '{{skill}}'</li>
                                        </ul>
                                    </div>
                                </div>
                                <div class="media-right" style="padding: 0px;">
                                    <a class="btn btn-default" @click="toggleList()"><i v-if="!shown" class="fa fa-caret-down" aria-hidden="true"></i><i v-else class="fa fa-caret-up" aria-hidden="true"></i></a>
                                </div>
                            </div>
                        </slot>
                    </div>
                    <div class="modal-footer">
                        <slot name="footer">
                            <button class="modal-default-button yes" @click="send(true)">
                                Richiedi Feedback
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
//inserisce nell'array in ordine alfabetico con ricerca binaria
Array.prototype.pushAlpha = function(obj) {
    if (obj.cognome != null && this.length > 0) {
        var index = -99;
        var start = 0;
        var end = this.length - 1;
        var mid;
        var count = 0;
        while (index == -99) {
            if (start != 0 || end != 0) {
                mid = Math.floor((end + start) / 2)
            } else {
                mid = 0;
            }
            if (obj.cognome.toLowerCase() < this[mid].cognome.toLowerCase()) {
                if (mid == start) {
                    index = start;
                } else {
                    end = mid - 1;
                }
            } else if (obj.cognome.toLowerCase() > this[mid].cognome.toLowerCase()) {
                if (mid == end) {
                    index = end + 1;
                } else {
                    start = mid + 1;
                }
            } else {
                if (obj.nome.toLowerCase() == this[mid].nome.toLowerCase()) {
                    index = -1;
                } else if (obj.nome.toLowerCase() < this[mid].nome.toLowerCase()) {
                    index = mid;
                } else {
                    index = mid + 1;
                }
            }
            count++;
            //se per qualche motivo va in loop
            if (count == (this.length * 2)) {
                console.log(obj.cognome + " break");
                index = this.length;
                break;
            }
        }
        if (index == this.length) {
            this.push(obj)
        } else if (index == -1) {
            //omonimo
        } else {
            this.splice(index, 0, obj);
        }

    } else {
        this.push(obj);
    }
};

export default {
    /*
    mounted: function() {
        var insert = [];
        var prova = [{
            nome: "Lorenzo"
        }, {
            nome: "Antonio"
        }, {
            nome: "Roberto"
        }, {
            nome: "Antani"
        }, {
            nome: "Toh"
        }, {
            nome: "Hdfahuisdgf"
        }];
        for (var i = 0; i < prova.length; i++) {
            insert.pushAlpha(prova[i]);
            console.log(insert.slice())
        }
    },*/
    props: {
        show: {
            type: Boolean
        },
        per: {
            type: Object
        },
        to: {
            type: Object
        }
    },
    data: function() {
        return {
            datashow: this.show,
            skill: '',
            for_nome: '',
            for_cognome: '',
            to_nome: '',
            to_cognome: '',
            errChief: 0,
            loading: false,
            persone: [],
            pSelected: -1,

            skillsCollection: null,
            results: [],
            shown: false,

            errSkill: false,

            to_for: false,
            xs: false
        }
    },
    watch: {
        per: function() {
            this.for_nome = this.per.nome ? this.per.nome : "";
            this.for_cognome = this.per.cognome ? this.per.cognome : "";
            if (this.for_nome) {
                this.to_for = false;
            }
        },
        to: function() {
            this.to_nome = this.to.nome ? this.to.nome : "";
            this.to_cognome = this.to.cognome ? this.to.cognome : "";
            if (this.to_nome) {
                this.to_for = true;
            }
        },
        show: function() {
            this.datashow = this.show;
            if (this.skillsCollection == null) {
                this.skillsCollection = this.$store.getters.getCompetenze;
            }
            this.results = this.skillsCollection.data;
            if (this.datashow) {
                if (window.innerWidth < 768) {
                    this.xs = true;
                    $("#request-container").width(320);
                } else {
                    this.xs = false;
                    $("#request-container").width(600);
                }
            }
        },
        skill: function() {
            this.filter();
        }
    },
    methods: {
        ncChange: function() {
            if (this.pSelected != -1) {
                this.errChief = 1;
            }
        },
        send: function(yes) {
            if (yes) {

                var data = this.skillsCollection.chain().find({
                    'nome': this.skill
                }).data();
                var allowed = data.length;

                if (allowed == 0) {
                    this.errSkill = true;
                }
                if (this.pSelected == -1 && this.errChief != 2) {
                    this.errChief = 1;
                }
                if (allowed > 0 && this.pSelected != -1 && this.errChief == 2) {
                    var obj = {
                        submit: yes,
                        to: this.to_for ? null : this.pSelected,
                        per: !this.to_for ? null : this.pSelected,
                        skill: data[0].id
                    };
                    this.$emit('done', obj);
                    this.close()
                }
            } else {
                this.$emit('done', {
                    submit: yes
                });
                this.close()
            }
        },
        close: function() {
            $('#collapseSkill').collapse('hide');
            this.shown = false;
            this.errSkill = false;
            this.results = [];
            this.persone = []
            this.skill = '';
            this.to_nome = '';
            this.to_cognome = '';
            this.for_nome = '';
            this.for_cognome = '';
            this.pSelected = -1;
            this.errChief = 0;
            this.datashow = false;
        },
        filter() {
            var vm = this;
            this.results = this.skillsCollection.where(function(obj) {
                    return obj.nome.toLowerCase().includes(vm.skill.toLowerCase());
                })
                /*
            $('#collapseSkill').collapse('show');
            this.shown = true;
            */
        },
        findPeople() {
            this.loading = true;
            this.persone = [];
            var filtro_nome = this.to_for ? this.for_nome : this.to_nome;
            var filtro_cognome = this.to_for ? this.for_cognome : this.to_cognome;

            if (filtro_nome.trim() != "" || filtro_cognome.trim() != "" || true) {
                var string = [];
                if (filtro_nome.trim() != "") {
                    string.push("NOME=" + filtro_nome);
                }
                if (filtro_cognome.trim() != "") {
                    string.push("COGNOME=" + filtro_cognome);
                }
                string = string.join("&");
                if (string.trim() == "") {
                    string = "IDPERSONA=."
                }
                this.$http.get(localStorage.getItem("path") + "/APIPersone?" + string).then((response) => {
                    var res = response.body;
                    try {
                        res = JSON.parse(response.body);
                    } catch (err) {};

                    if (res && res.APIPersone) {
                        for (var i = 0; i < res.APIPersone.length; i++) {
                            var p = res.APIPersone[i];

                            this.persone.pushAlpha({
                                nome: p.NOME,
                                cognome: p.COGNOME,
                                idpersona: p.IDPERSONA
                            })
                        }
                    }
                    this.loading = false;
                })
            } else {
                this.loading = false;
            }

        },
        selected(nome) {
            this.skill = nome;
            $('#collapseSkill').collapse('hide');
            this.shown = false;
            this.errSkill = false;
        },
        personaSelected(p) {
            this.to_nome = p.nome;
            this.to_cognome = p.cognome;
            this.pSelected = p.idpersona;
            this.persone = [];
            this.errChief = 2;
        },
        personaSelectedFor(p) {
            this.for_nome = p.nome;
            this.for_cognome = p.cognome;
            this.pSelected = p.idpersona;
            this.persone = [];
            this.errChief = 2;
        },
        toggleList() {
            $('#collapseSkill').collapse('toggle');
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
    width: 600px;
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

.collapsibleRequest {
    max-width: 245px;
    max-height: 150px;
    overflow-y: auto;
}

.lger {
    width: 450px;
    max-width: 480px;
}

.alert-danger {
    margin-top: 10px;
    margin-bottom: 0px;
    padding: 10px 15px;
    background-color: #f2dede;
    color: #a94442;
    border-color: #ebccd1;
}

.success {
    background-color: #dff0d8;
    border-color: #d6e9c6;
    color: #3c763d;
}

.danger {
    background-color: #f2dede;
    border-color: #ebccd1;
    color: #a94442;
}

.separator {
    min-width: 20px;
    width: 20px;
}
</style>
</style>
