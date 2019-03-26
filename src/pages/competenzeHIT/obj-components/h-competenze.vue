<template>
    <div v-if="ready && show" class="item col-xs-12 panel panel-default h-container">
        <div class="panel-header h-header">
            <h3 class="text-headline panel-title">{{title}}</h3>
        </div>
        <div class="panel-body h-body">
            <div class="panel panel-default html-fields" v-html="goal.DescrizioneIndicatore"></div>
        </div>
        <div class="col-xs-12" style="padding: 0px; background-color: rgb(238, 238, 238);">
            <span>
                <h5 v-if="rendMineMT" class="text-headline rev col-xs-12" style="margin: 5px 0px; padding: 0px;">{{s.revMT[l]}}</h5>
                <valutazione v-if="rendMineMT" 
                :auto="true" :final="false" :disable="disableMineMT" :note012="noteMineMT" @valChange="up( 0, $event)" :obj="valutazioni[0]"></valutazione>
                <valutazione v-if="rendValMT" 
                :auto="false" :final="false" :disable="disableValMT" :note012="noteValMT" @valChange="up( 1,$event)" :obj="valutazioni[1]"></valutazione>
                <h5 v-if="rendValMT" class="text-headline rev col-xs-12" style="margin: 5px 0px; padding: 0px;">{{s.revF[l]}}</h5>
                <valutazione v-if="rendMineF" 
                :auto="true" :final="true" :disable="disableMineF" :note012="noteMineF" @valChange="up( 2, $event)" :obj="valutazioni[2]"></valutazione>
                <valutazione v-if="rendValF" 
                :auto="false" :final="true" :disable="disableValF" :note012="noteValF" @valChange="up( 3, $event)" :obj="valutazioni[3]"></valutazione>
            </span>
        </div>
    </div>
</template>
<script>
import valutazione from "./h-valutazione.vue"

export default {
    mounted: function() {
        this.$nextTick(function() {
            this.init();
        })
    },
    props: {
        from: String,
        valutatore: Boolean,
        stato: Number
    },
    components: {
        valutazione
    },
    data: function() {
        return {
            s: this.$parent.strings,
            l: this.$parent.itaEng01,

            descrizione: "",

            valutazioni: [],
            ready: false,

            title: '',

            goal: null,
            show: true
        }
    },
    watch: {},
    methods: {
        init: function() {
            //FROM pres, ceo, ceo-it
            switch (this.from) {
                case 'pres':
                    this.goal = this.$parent.goalPres;
                    break;
                case 'ceo':
                    this.goal = this.$parent.goalCeo;
                    break;
                case 'ceo-it':
                    this.goal = this.$parent.goalCeoit;
                    break;
                default:
            }
            if(this.goal != null){
                this.title = this.goal.Indicatore;
                this.valutazioni.push({
                    valutazione: this.goal.AutoValutazioneIntermedia,
                    commento: this.goal.CommentiIntermediValutato,
                    nota: this.goal.NoteIntermedieValutato
                }, {
                    valutazione: this.goal.ValutazioneIntermedia,
                    commento: this.goal.CommentiIntermediValutatore,
                    nota: this.goal.NoteIntermedieValutatore
                }, {
                    valutazione: this.goal.AutoValutazioneFinale,
                    commento: this.goal.CommentiFinaliValutato,
                    nota: this.goal.NoteFinaliValutato
                }, {
                    valutazione: this.goal.ValutazioneFinale,
                    commento: this.goal.CommentiFinaliValutatore,
                    nota: this.goal.NoteFinaliValutatore
                });

                this.ready = true;
                this.show = this.isEmpty();
            } else {
                //se viene passato goal undefined, non mostra il componente
                this.ready = true;
                this.show = false;
            }
        },
        up: function(ind, $event) {

            this.valutazioni[ind] = $event.obj;
            // 0 e 1 non si scatenano mai se MT non è abilitato
            switch (ind) {
                case 0:
                    this.goal.AutoValutazioneIntermedia = $event.obj.valutazione;
                    this.goal.CommentiIntermediValutato = $event.obj.commento;
                    this.goal.NoteIntermedieValutato = $event.obj.nota;
                    break;
                case 1:
                    this.goal.ValutazioneIntermedia = $event.obj.valutazione;
                    this.goal.CommentiIntermediValutatore = $event.obj.commento;
                    this.goal.NoteIntermedieValutatore = $event.obj.nota;
                    break;
                case 2:
                    this.goal.AutoValutazioneFinale = $event.obj.valutazione;
                    this.goal.CommentiFinaliValutato = $event.obj.commento;
                    this.goal.NoteFinaliValutato = $event.obj.nota;
                    break;
                case 3:
                    this.goal.ValutazioneFinale = $event.obj.valutazione;
                    this.goal.CommentiFinaliValutatore = $event.obj.commento;
                    this.goal.NoteFinaliValutatore = $event.obj.nota;
                    break;
                default:
                    console.log('no obb. matched');
            }

            this.$emit('compChange', {
                obj: this.goal,
                isVal: $event.isVal
            });
        },
        isEmpty: function(){
            return this.goal.DescrizioneIndicatore != "" && this.goal.DescrizioneIndicatore != null && this.goal.DescrizioneIndicatore != "<p></p>";
        }
    },
    computed: {
        disableMineMT: function() {
            return this.$parent.disableMineMT;
        },
        disableValMT: function() {
            return this.$parent.disableValMT;
        },
        disableMineF: function() {
            return this.$parent.disableMineF;
        },
        disableValF: function() {
            return this.$parent.disableValF;
        },
        noteMineMT: function() {
            return this.$parent.noteMineMT;
        },
        noteValMT: function() {
            return this.$parent.noteValMT;
        },
        noteMineF: function() {
            return this.$parent.noteMineF;
        },
        noteValF: function() {
            return this.$parent.noteValF;
        },
        rendMineMT: function() {
            return this.$parent.rendMineMT;
        },
        rendValMT: function() {
            return this.$parent.rendValMT;
        },
        rendMineF: function() {
            return this.$parent.rendMineF;
        },
        rendValF: function() {
            return this.$parent.rendValF;
        }
    }
}
</script>
<style scoped>
.html-fields {
    padding: 5px;
    margin-bottom: 5px;
    margin-top: 10px;
    min-height: 50px;
}
</style>
