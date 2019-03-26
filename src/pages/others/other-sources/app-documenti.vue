<template>
    <div class="st-pusher" id="content">
        <div class="st-content">
            <div class="st-content-inner padding-none">
                <div class="container-fluid">
                    <br>
                    <div class="row">
                        <div class="item col-xs-12 col-lg-4">
                            <div class="row">
                                <div class="col-xs-8">
                                    <h4 class="text-headline margin-none">I Miei Documenti <span class="badge">{{daleggere}}</span></h4>
                                    <p class="text-subhead text-light">La lista dei tuoi documenti</p>
                                </div>
                                <div class="col-xs-4">
                                    <!-- 
                                    <paginazione :array="myrequests" @displayChanged="dispatchedPagination($event)" :limit="perpagina">
                                    </paginazione>
                                 -->
                                </div>
                                <div class="col-xs-12">
                                    <div class="panel panel-default paper-shadow animated" data-z="0.5" style="overflow-y: auto;">
                                        <div>
                                            <ul class="list-group" style="margin: 0px;">
                                                <li class="list-group-item media v-middle" v-for="doc in documents">
                                                    <div class="media-left">
                                                        <span v-if="doc.letto" class="btn btn-default text-white-400 btn-lg btn-circle paper-shadow relative"><i :class="doc.icon"></i></span>
                                                        <span v-if="!doc.letto" class="btn btn-warning text-white-400 btn-lg btn-circle paper-shadow relative"><i :class="doc.icon"></i></span>
                                                        <!-- 
                            <img :src="req.avatar" class="img-circle width-70" />
                         -->
                                                    </div>
                                                    <div class="media-body">
                                                        <h4>{{doc.nome}}</h4>
                                                    </div>
                                                    <div class="media-right">
                                                        <button class="btn btn-sm btn-primary paper-shadow relative" @click="doc.letto = true; apriAnteprima(doc.path);">Apri</button>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="item col-xs-12 col-lg-8">
                            <h4 class="text-headline margin-none">Anteprima</h4>
                            <div class="col-xs-12 panel panel-default paper-shadow animated" data-z="0.5 " style="overflow-y: auto;  margin-top: 12px; height: 500px;">
                                <iframe id="anteprima" src="" frameborder="0" width="100%" height="100%"></iframe>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
var documenti = [{
    nome: "CUD 2017",
    icon: "fa fa-file-word-o",
    path: "../documenti/cu_2017_modello_sintetico.pdf",
    letto: false
}, {
    nome: "Busta Paga - Gennaio 2017",
    icon: "fa fa-file-word-o",
    path: "../documenti/modulo_bustapaga.pdf",
    letto: false
}, {
    nome: "Lettera Assunzione",
    icon: "fa fa-file-word-o",
    path: "../documenti/LETTERA_ASSUNZIONE.pdf",
    letto: false
}, {
    nome: "Lettera Promozione - Assunzione Tempo Indeterminato",
    icon: "fa fa-file-word-o",
    path: "../documenti/Assunzione_tempo_indeterminato.doc",
    letto: false
}];

import sidejsonly from '../../components/side-default-jsonly.vue'

export default {
    mounted() {
            this.$nextTick(function() {
                var iFrame = document.getElementById('anteprima');
                iFrame.height = $(window).height() - 200
            });

            var url_split = this.$route.path.split('/')

            var id_doc = url_split[2]

            if (id_doc) {
                this.apriAnteprima(this.documents[id_doc].path)
                this.documents[id_doc].letto = true
            }

        },
        data: function() {
            return {
                documents: documenti
            }
        },
        methods: {
            apriAnteprima: function(percorso) {
                document.getElementById('anteprima').src = percorso
            },
            resizeIFrameToFitContent: function(iFrame) {
                iFrame.width = iFrame.contentWindow.document.body.scrollWidth;
                iFrame.height = iFrame.contentWindow.document.body.scrollHeight;
            }
        },
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
