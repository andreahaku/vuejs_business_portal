<template>
    <div>
        <div class="row">
            <div class="col-xs-8">
                <h4 class="text-headline">I Miei Documenti <span class="badge">{{daleggere}} da leggere</span></h4>
                <p class="text-subhead text-light">I tuoi ultimi documenti</p>
            </div>
            <div class="col-xs-4 pulsante">
                <router-link :to="{name: 'documenti'}" tag="a">
                    <a class="btn btn-primary btn-sm pull-right" data-animated="" data-hover-z="1" data-z="0">Vedi tutti</a>
                </router-link>
            </div>
        </div>
        <div class="panel panel-default paper-shadow" data-z="0.5">
            <div class="panel-body">
                <router-link v-for="doc in documents" :to="'/app-documents/'+doc.id" tag="a">
                    <div v-if="!doc.letto" class="btn btn-warning text-white-400 btn-lg btn-circle paper-shadow relative doc" data-animated="" data-hover-z="0.5" :data-title="doc.nome" data-toggle="tooltip">
                        <i class="fa fa-file-word-o"></i>
                    </div>
                    <div v-if="doc.letto" class="btn btn-default text-white-400 btn-lg btn-circle paper-shadow relative doc" data-animated="" data-hover-z="0.5" :data-title="doc.nome" data-toggle="tooltip">
                        <i class="fa fa-file-word-o"></i>
                    </div>
                </router-link>
            </div>
            <!-- 
            <div class="panel-footer text-right">
                <a class="btn btn-primary btn-sm paper-shadow relative" data-animated="" data-hover-z="1" data-z="0" href="#" @click='tutti = !tutti'>Vedi tutti</a>
            </div>
             -->
        </div>
    </div>
</template>
<script>
import sidejsonly from './side-default-jsonly.vue'

var documenti = [{
    id: 0,
    nome: "CUD 2017",
    icon: "fa fa-file-word-o",
    path: "../documenti/cu_2017_modello_sintetico.pdf",
    letto: false
}, {
    id: 1,
    nome: "Busta Paga - Gennaio 2017",
    icon: "fa fa-file-word-o",
    path: "../documenti/modulo_bustapaga.pdf",
    letto: true
}, {
    id: 2,
    nome: "Lettera Assunzione",
    icon: "fa fa-file-word-o",
    path: "../documenti/LETTERA_ASSUNZIONE.pdf",
    letto: false
}, {
    id: 3,
    nome: "Lettera Promozione - Assunzione Tempo Indeterminato",
    icon: "fa fa-file-word-o",
    path: "../documenti/Assunzione_tempo_indeterminato.doc",
    letto: true
}];

export default {
    mounted() {
        this.$nextTick(function() {});
    },
    data: function() {
        return {
            documents: documenti
        }
    },
    methods: {},
    computed: {
        daleggere: function() {
            let conta = 0;

            for (let i = 0; i < this.documents.length; i++) {
                if (!this.documents[i].letto) conta++
            }
            return conta
        }
    }
}
</script>
<style scoped>
.badge {
    top: 7px !important;
    margin-left: 7px;
    position: absolute !important;
    font-size: 1rem !important;
    font-weight: 100;
    color: white;
    background-color: #42a5f5;
}
</style>
<style>
h4 {
    margin: 0px;
}

.pulsante {
    margin-top: 25px;
}

.doc {
    margin-right: 10px;
}
</style>
