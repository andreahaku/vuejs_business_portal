<template>
    <div class="st-pusher" id="content">
        <div class="st-content">
            <div class="st-content-inner padding-none">
                <div class="container-fluid" id="pagina">
                    <br>
                    <!-- 
                   <div class="page-section">
                        <h1 class="text-display-1 margin-none">Dashboard Studente</h1>
                    </div>
                    -->
                    <div class="row">
                        <div class="item col-xs-12 col-lg-6">
                            <div v-for="componente in show_sx">
                                <component :is="componente.nome" :valutatore="componente.valutatore" :dash="true" :perpagina="2"></component>
                                <br>
                            </div>
                        </div>
                        <div class="item col-xs-12 col-lg-6">
                            <div v-for="componente in show_dx">
                                <component :is="componente.nome" :valutatore="componente.valutatore" :dash="true" :perpagina="2"></component>
                                <br>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <sidejsonly :default="true"></sidejsonly>
        </div>
    </div>
</template>
<script>
import imieicorsi from '../components/i-miei-corsi.vue'
import ricerca from '../components/ricerca.vue'
import featured from '../components/featured.vue'
import sidejsonly from '../components/side-default-jsonly.vue'

import {
    eventBus
} from '../../eventbus.js';

var modules;

var components_sx;

var components_dx;


export default {
    mounted() {
            this.initComponents();
            this.$nextTick(function() {
                if (localStorage.getItem("TokenScaduto") || this.$root.lsGet("configs") == null) {
                    localStorage.removeItem("TokenScaduto");
                    eventBus.$emit("alert", "Sessione scaduta");

                }
                this.init();
            })

        },
        components: {
            appMieiCorsi: imieicorsi,
            appRicerca: ricerca,
            appFeatured: featured,


            sidejsonly
        },
        //BEGIN TESTING
        data: function() {
            return {
                result: 'result',
                enabledOnes: {},
                isValutatore: false,
                colonna_dx: [],
                colonna_sx: [],

                show_dx: [],
                show_sx: []
            }
        },
        watch: {
            '$route': function() {
                if (localStorage.getItem("TokenScaduto")) {
                    localStorage.removeItem("TokenScaduto");
                    eventBus.$emit("alert", "Sessione scaduta");
                }
            }
        },
        methods: {
            initComponents: function() {
                modules = this.$root.getEnablingObject();
                if (modules.rubrica == null) {
                    location.pathname = '/login.html';
                }

                components_sx = [{
                    nome: "appRicerca",
                    title: "ricerca corsi",
                    abilitato: true,
                    visibile: true
                }, {
                    nome: "appFeatured",
                    title: "corsi consigliati",
                    abilitato: true,
                    visibile: true
                }];
                components_dx = [{
                    nome: "appMieiCorsi",
                    title: "i miei corsi",
                    abilitato: true,
                    visibile: true
                }]
            },
            init: function() {
                this.colonna_dx = components_dx;
                this.colonna_sx = components_sx;
                this.show_dx = this.colonna_dx.filter(function(mod) {
                    return mod.visibile && mod.abilitato;
                })
                this.show_sx = this.colonna_sx.filter(function(mod) {
                    return mod.visibile && mod.abilitato;
                })
            }
        }
}
//END TESTING
</script>
<style>
h4,
h5,
p,
a.text-subhead {
    font-weight: 300 !important;
}

strong {
    font-weight: 500 !important;
}


/*
#pagina {
    background-color: #eee !important;
}
*/
</style>
