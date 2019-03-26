<template>
    <li class="list-group-item media v-middle" style="overflow: visible;" :class="{'me': me}">
        <div class="media-left avt">
            <img :src="path+'/'+persona.IMMAGINE" onerror="this.src = 'images/profile-photo_small.png'" class="img-circle width-70" />
            <span v-if="me || persona.favorito" class="prefer fa fa-fw fa-2x fa-star text-yellow-800 m1" @click="switchFavorites()"></span>
            <span v-else class="prefer fa fa-fw fa-2x fa-star-o text-yellow-800 m1" @click="switchFavorites()"></span>
        </div>
        <div class="media-body row" style="overflow: visible;">
            <div class="col-xs-9">
                <div class="cnom">{{persona.COGNOME}} {{persona.NOME}}</div>
                <div class="cuo">UO: {{persona.UO}}</div>
                <div class="cruolo">Ruolo: {{persona.RUOLO}}</div>
            </div>
            <div class="col-xs-3">
                <div style="text-align: right; padding: 0px;">
                    <button v-if="somethingToShow" href="#" class="btn btn-default dropdown-toggle" type="button" id="dropdownMenuP" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true" style="padding: 0px 8px; height: auto; line-height: inherit; background-color: #efefef;"><i class="fa fa-bars" style="padding: 5px 0px;"></i></button>
                    <ul role="menu" class="dropdown-menu" aria-labelledby="dropdownMenuP" style="right: 0px; left: auto; padding: 0px;">
                        <li v-if="!me && enablingObject.feedback"><a @click.prevent="assegna()">Emmetti Feedback</a></li>
                        <li v-if="me && enablingObject.feedback"><a @click.prevent="richiedi(false)">Richiedi Feedback</a></li>
                        <li v-if="!me && enablingObject.feedback"><a @click.prevent="richiedi(true)">Richiedi Feedback a {{nFormat()}}</a></li>
                        <li v-if="!me && enablingObject.feedback"><a @click.prevent="richiedi(false)">Richiedi Feedback per {{nFormat()}}</a></li>
                        <li v-if="enablingObject.feedback">
                            <router-link :to="{ name: 'personaFeedback', params: { idpersona: persona.IDPERSONA }}"><span v-if="!me">Guarda i Feedback di {{nFormat()}}</span><span v-else>Guarda i tuoi Feedback</span></router-link>
                        </li>
                    </ul>
                </div>
            </div>
            <hr class="linea col-xs-12">
            <!--
            <div class="row">
                <div class="col-xs-6 btn-container" style="text-align: left;">
                    <a href="#" class="btn btn-primary">Feedback</a>
                </div>
                <div class="col-xs-6 btn-container" style="text-align: right;">
                    <a href="#" class="btn btn-primary">Feedback</a>
                </div>
            </div>
            -->
        </div>
    </li>
</template>
<script>
export default {
    mounted: function() {
        this.$nextTick(function() {
            this.somethingToShow = this.enablingObject.feedback
        })
    },
    props: {
        persona: Object
    },
    computed: {
        me: function() {
            return localStorage.getItem("idpersona") == this.persona.IDPERSONA;
        }
    },
    data: function() {
        return {
            path: localStorage.getItem("path"),
            enablingObject: this.$parent.enablingObject,
            somethingToShow: false
        }
    },
    methods: {
        nFormat: function() {
            var n = this.persona.NOME.split(" ");
            for (var i = 0; i < n.length; i++) {
                if (n[i].trim() != "") {
                    var formatting = n[i][0].toUpperCase();
                    formatting += n[i].slice(1).toLowerCase();
                    n[i] = formatting;
                }
            }
            var nFormat = n.join(" ");
            return nFormat
        },
        switchFavorites: function() {
            this.persona.favorito = !this.persona.favorito;
            this.$emit("switched", this.persona.favorito);
        },
        assegna: function() {
            this.$emit("assignFeedback");
        },
        richiedi: function(a) {
            this.$emit("requestFeedback", a);
        }
    }
}
</script>
<style scoped>
.prefer {
    position: absolute;
    top: 4px;
    margin-left: -15px;
    -ms-transform: rotate(-15deg);
    -webkit-transform: rotate(-15deg);
    transform: rotate(-15deg);
}

.linea {
    margin: 5px 0px;
}

.btn-container {
    padding: 2px;
}

.btn-container > a {
    padding: 5px 10px;
    font-size: smaller;
    min-width: 75px;
}

.dropdown-menu > li.active > a,
.dropdown-menu > li a:hover {
    background: #f5f7f7;
    color: #42a5f5;
}

.dropdown-menu > li > a,
.dropdown-menu > li > a:focus {
    padding: 8px 14px;
    border-top: 1px solid #efefef;
}

.me {
    font-style: italic;
    background-color: #42a5f5;
    color: white;
}
</style>
