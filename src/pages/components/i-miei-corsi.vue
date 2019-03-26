<template>
    <div>
        <div class="row">
            <div class="col-xs-12 col-sm-8">
                <h4 class="text-headline margin-none">
                I Miei Corsi <span class="badge">{{quantisono}}</span></h4>
                <p class="text-subhead text-light">I corsi che stai frequentando</p>
            </div>
            <div class="col-xs-4 col-xs-offset-8 col-sm-offset-0 pulsante" :class="{'lg': !$root.xs, 'xs': $root.xs}" 
            v-if="listapartecipazioni.length > 0">
                <a v-if='!tutti' class="btn btn-primary btn-sm pull-right" data-animated="" data-hover-z="1" data-z="0" @click.prevent='tutti = !tutti'>Vedi tutti</a>
                <a v-else class="btn btn-primary btn-sm pull-right" data-animated="" data-hover-z="1" data-z="0" @click.prevent='mostraTutti()'>Solo gli ultimi</a>
            </div>
        </div>
        <div class="panel panel-default paper-shadow animated fadeIn" data-z="0.5">
            <div id="tutti">
            </div>
            <transition name="roll-fade">
                <div v-if='!tutti'>
                    <ul class="list-group">
                        <li class="list-group-item media v-middle" v-for="corso in partecipazioniLimitate">
                            <div class="media-body" :class="{'xs': $root.xs}">
                                <a class="text-subhead list-group-link" @click.prevent="goTakeCourse(corso.idcorso, corso.edizione)">
                                <i v-if="corso.ELearningTipoFormazione == -1" class="fa fa-globe" aria-hidden="true" style="font-size: large; padding-right: 10px;"></i>{{corso.titolo}}</a>
                            </div>
                            <div :class="{'media-footer': $root.xs, 'media-right': !$root.xs}">
                                <div class="progress margin-none" :class="{'width-150': !$root.xs}">
                                    <div aria-valuemax="100" aria-valuemin="0" :aria-valuenow="corso.percentuale" class="progress-bar progress-bar-orange-300" role="progressbar" v-bind:style="{ width: corso.percentuale + '%' }">
                                        <span class="percent" v-if="corso.percentuale >= 50">{{corso.percentuale}}%</span>
                                    </div>
                                    <span class="percent_none" v-if="corso.percentuale < 50" style="text-align: center">{{corso.percentuale}}%</span>
                                </div>
                            </div>
                        </li>
                    </ul>
                    <div v-if="listapartecipazioni.length == 0" class="list-group-item paper-shadow animated fadeIn" data-z="0.5" style="padding: 10px 16px; border-width: 2px;">
                        <span>Non risulti iscritto ad alcun corso</span>
                    </div>
                    <!-- 
                    <div class="panel-footer text-right">
                        <a class="btn btn-primary btn-sm paper-shadow relative" data-animated="" data-hover-z="1" data-z="0" href="#" @click='tutti = !tutti'>Vedi tutti</a>
                    </div>
                     -->
                </div>
            </transition>
            <transition name="roll-fade">
                <div v-if='tutti'>
                    <ul class="list-group">
                        <li class="list-group-item media v-middle" v-for="corso in listapartecipazioni">
                            <div class="media-body" :class="{'xs': $root.xs}">
                                <a class="text-subhead list-group-link" @click.prevent="goTakeCourse(corso.idcorso, corso.edizione)">
                                <i v-if="corso.ELearningTipoFormazione == -1" class="fa fa-globe" aria-hidden="true" style="font-size: large; padding-right: 10px;"></i>{{corso.titolo}}</a>
                            </div>
                            <div :class="{'media-footer': $root.xs, 'media-right': !$root.xs}">
                                <div class="progress margin-none" :class="{'width-150': !$root.xs}">
                                    <div aria-valuemax="100" aria-valuemin="0" :aria-valuenow="corso.percentuale" class="progress-bar progress-bar-orange-300" role="progressbar" v-bind:style="{ width: corso.percentuale + '%' }">
                                        <span class="percent" v-if="corso.percentuale >= 50">{{corso.percentuale}}%</span>
                                    </div>
                                    <span class="percent_none" v-if="corso.percentuale < 50" style="text-align: center">{{corso.percentuale}}%</span>
                                </div>
                            </div>
                        </li>
                    </ul>
                    <div v-if="listapartecipazioni.length == 0" class="list-group-item paper-shadow animated fadeIn" data-z="0.5" style="padding: 10px 16px; border-width: 2px;">
                        <span>Non risulti iscritto ad alcun corso</span>
                    </div>
                </div>
            </transition>
        </div>
    </div>
</template>
<script>
import {
    courseMyMixin
} from '../learning/mixins/courseMyMixin.js';

export default {
    mixins: [courseMyMixin],
    data: function() {
        return {
            idpersona: 0,
            tutti: this.showAll ? this.showAll : false,

            //solo per poter accedere da courseMyMixin, non viene usato in questo componente
            isready: true
        }
    },
    props: {
        showAll: {
            type: Boolean
        }
    },
    computed: {
        partecipazioniLimitate: function() {
            return this.listapartecipazioni.slice(0, 3);
        },
        quantisono: function() {
            return this.listapartecipazioni.length;
        }
    },
    methods: {
        mostraTutti: function() {
            this.tutti = !this.tutti;
        },
        goTakeCourse: function(id, ed) {
            if (ed != null) {
                this.$router.push({
                    name: 'corsoWithEd',
                    params: {
                        idcorso: id,
                        idedizione: ed
                    }
                });
            } else {
                this.$router.push({
                    name: 'corso',
                    params: {
                        idcorso: id
                    }
                });
            }
        }
    }
}
</script>
<style>
div.progress.progress-mini {
    background-color: gainsboro;
}

.panel-footer {
    padding-top: 10px;
}

.list-group {
    margin-bottom: 0px;
}

.badge {
    font-size: 1.5rem;
    font-weight: 100;
    color: white;
    background-color: #42a5f5;
}

.progress,
.progress-bar {
    border-radius: 10px;
}

.progress {
    background-color: #eee;
}

.pulsante.lg {
    margin-top: 25px;
    margin-bottom: 0px;
}

.pulsante.xs {
    margin-top: 0px;
    margin-bottom: 5px;
}

.percent {
    font-size: 0.85rem;
    right: 75px;
    position: absolute;
}

.percent_none {
    font-size: 0.85rem;
    top: 19px;
    right: 75px;
    position: absolute;
}
</style>

<style scoped>
    div.xs {
        text-align: center;
    }
    .media-footer .progress {
        text-align: center;
    }
    .media-footer .percent_none {
        position: initial;
    }
    .media-footer .percent {
        position: initial;
    }
</style>
