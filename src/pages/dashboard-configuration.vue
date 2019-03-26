<template>
    <div class="st-pusher" id="content">
        <div class="st-content">
            <div class="st-content-inner padding-none">
                <div class="container-fluid">
                    <br>
                    <h4 class="text-headline margin-none">Configurazione Componenti Home Page</h4>
                    <p class="text-subhead text-light">Configura il layout della tua "Home Page". Utilizza la lista completa di tutte le componenti disponibili mostrate per colonna. In grigio, le componenti abilitate e quindi visibili. Per abilitare e disabilitare le componenti fare click sulla riga. E' possibile spostare l'ordine delle componenti con il "drag&drop". E' inoltre possibile spostare le componenti da una colonna all'altra.</p>
                    <br>
                    <div class="row">
                        <div class="item col-xs-12 col-lg-6">
                            <div class="panel panel-default paper-shadow" data-z="0.5">
                                <ul class="list-group">
                                    <li class="list-group-item">
                                        <div class="media v-middle">
                                            <div class="media-body">
                                                <h4 class="text-headline margin-none">Colonna Sinistra</h4>
                                            </div>
                                        </div>
                                    </li>
                                    <draggable v-model="show_sx" class="dragArea" :options="{group:'componenti'}">
                                        <li v-if="show_sx.length > 0" class="list-group-item media v-middle" v-for="(componente,i) in show_sx" :class="{active: componente.visibile}" @click="toggle_sx(i)" :key="i" :id="componente.nome">
                                            <span class="elemento">{{componente.title}} (<span v-if="componente.visibile">visibile</span><span v-if="!componente.visibile">nascosto</span>)</span>
                                            <div class="componente">
                                                <component :is="componente.nome"
                                                :valutatore="componente.valutatore" @notInCharge="hide(componente.nome)"></component>
                                            </div>
                                        </li>
                                        <li v-if="show_sx.length == 0" class="list-group-item media v-middle"><span class="elemento">colonna vuota</span></li>
                                    </draggable>
                                </ul>
                            </div>
                            <br/>
                        </div>
                        <div class="item col-xs-12 col-lg-6">
                            <div class="panel panel-default paper-shadow" data-z="0.5">
                                <ul class="list-group">
                                    <li class="list-group-item">
                                        <div class="media v-middle">
                                            <div class="media-body">
                                                <h4 class="text-headline margin-none">Colonna Destra</h4>
                                            </div>
                                        </div>
                                    </li>
                                    <draggable v-model="show_dx" class="dragArea" :options="{group:'componenti'}">
                                        <li v-if="show_dx.length > 0" class="list-group-item media v-middle" v-for="(componente,i) in show_dx" :class="{active: componente.visibile}" @click="toggle_dx(i)" :key="i">
                                            <span class="elemento">{{componente.title}} (<span v-if="componente.visibile">visibile</span><span v-if="!componente.visibile">nascosto</span>)</span>
                                            <div class="componente">
                                                <component :is="componente.nome" :valutatore="componente.valutatore"></component>
                                            </div>
                                        </li>
                                        </li>
                                        <li v-if="show_dx.length == 0" class="list-group-item media v-middle"><span class="elemento">colonna vuota</span></li>
                                    </draggable>
                                </ul>
                            </div>
                            <br/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <sidejsonly :default="true"></sidejsonly>
    </div>
</template>
<script>
import sidejsonly from './components/side-default-jsonly.vue'
import draggable from 'vuedraggable'

import imieicorsi from './components/i-miei-corsi.vue'
import documenti from './components/documenti.vue'
import attivitaforum from './components/attivita-forum.vue'
import ricerca from './components/ricerca.vue'
import rubrica from './components/rubrica.vue'
import featured from './components/featured.vue'
import widgetreceived from './feedback/widget-received.vue'
import widgetgiven from './feedback/widget-given.vue'
import widgetgoal from './goal/widget-goal.vue'
import widgeteval from './competenzeHIT/widget-da-valutare.vue'
import widgetricerca from './competenzeHIT/ricerca-admin.vue'
import ricercagoal from './goal/ricerca-goal.vue'
import ricercapartecipazioni from './components/ricerca_partecipazioni.vue'

var modules;

var components_sx;

var components_dx;

export default {
    mounted() {
            this.$nextTick(function() {
                this.init();
            });
        },
        components: {
            // scrivi alias
            draggable,
            sidejsonly,

            appMieiCorsi: imieicorsi,
            appDocumenti: documenti,
            appAttivitaForum: attivitaforum,
            appRicerca: ricerca,
            appRubrica: rubrica,
            appFeatured: featured,
            appWidgetReceived: widgetreceived,
            appWidgetGiven: widgetgiven,
            appWidgetGoal: widgetgoal,
            appRicercaGoal: ricercagoal,
            appWidgetEval: widgeteval,
            appWidgetRicerca: widgetricerca,
            appRicercaPartecipazioni: ricercapartecipazioni,
        },
        data: function() {
            return {
                show_dx: [],
                show_sx: [],
                colonna_dx: [],
                colonna_sx: []
            }
        },
        watch: {
            // dopo il primo cambiamento, la dashboard lavora solo con abilitato = true
            show_dx: function() {
                this.$root.lsSet("colonna_dx", JSON.stringify(this.show_dx))
            },
            show_sx: function() {
                this.$root.lsSet("colonna_sx", JSON.stringify(this.show_sx))
            }
        },
        methods: {
            hide: function(nome){
                $("#"+nome).hide();
            },
            init: function() {
                var config = this.$root.getDashConfig();
                this.colonna_dx = config.dx;
                this.colonna_sx = config.sx;
                this.show_dx = this.colonna_dx.filter(function(mod) {
                    return mod.abilitato;
                })

                this.show_sx = this.colonna_sx.filter(function(mod) {
                    return mod.abilitato;
                })
            },
            toggle_sx: function(i) {
                this.show_sx[i].visibile = !this.show_sx[i].visibile;
                this.$root.lsSet("colonna_sx", JSON.stringify(this.show_sx))
            },
            toggle_dx: function(i) {
                this.show_dx[i].visibile = !this.show_dx[i].visibile;
                this.$root.lsSet("colonna_dx", JSON.stringify(this.show_dx))
            }
        }
}
</script>
<style scoped>
.elemento {
    font-size: 1.5rem;
}

.active {
    border-color: white !important;
    background-color: #999 !important;
    border-radius: 10px !important;
    margin-top: 3px !important;
    margin-bottom: 3px !important;
}

.componente {
    margin-top: 10px;
    padding: 10px;
    border: 1px solid black;
    background-color: #eee;
    max-height: 200px;
    overflow-y: hidden;
    pointer-events: none;
}

.text-headline,
.text-subhead,
.list-group-item {
    font-weight: 300;
}

.subcategoria {
    font-size: 1.3rem;
}

.subcategoria:hover {
    background-color: #ececec;
}

.categoria {
    padding-bottom: 5px;
    font-size: 1.5rem;
    font-weight: 400;
    border-bottom: 1px solid black;
    opacity: 1;
}

.freccia {
    position: absolute;
    right: 10px;
    opacity: 0.3;
}

.freccia-cat {
    position: absolute;
    right: 25px;
    opacity: 0.3;
}
</style>
