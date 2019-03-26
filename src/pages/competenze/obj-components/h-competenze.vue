<template>
    <div v-if="ready && atLeast" class="item col-xs-12 panel panel-default h-container">
        <div class="panel-header h-header">
            <h3 class="text-headline panel-title">{{title}}</h3>
        </div>
        <div class="panel-body h-body">
            <div class="panel panel-default html-fields" v-html="goal.DescrizioneIndicatore"></div>
        </div>
        <div class="col-xs-12" style="padding: 0px; background-color: rgb(238, 238, 238);">
            <span>
                <h5 class="text-headline rev col-xs-12" style="margin: 5px 0px; padding: 0px;">{{s.revF[l]}}</h5>
                <valutazione v-if="rendMine" @valChange="up(0, $event)" :obj="valutazioni[0]"
                :auto="true" :rating="evalAutovalutazione" :commenti="evalCommentiValutato" :note="evalNotePersonaValutata"></valutazione>
                <valutazione v-if="rendVal" @valChange="up(1, $event)" :obj="valutazioni[1]"
                :auto="false" :rating="evalValutazione" :commenti="evalCommentiValutatore" :note="evalNoteValutatore" ></valutazione>
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
        stato: Number,
        obj: Object
    },
    components: {
        valutazione
    },
    data: function() {
        return {
            s: this.$parent.strings,
            l: this.$parent.itaEng01,
            permits: this.$parent.permessi,

            descrizione: "",

            valutazioni: [],
            ready: false,

            title: '',

            goal: null,
            show: true
        }
    },
    methods: {
        init: function() {
            //FROM pres, ceo, ceo-it
            this.goal = this.obj;
            if(this.goal != null){
                this.title = this.goal.Indicatore;
                this.valutazioni.push({
                    valutazione: this.goal.AutoValutazioneFinale,
                    commento: this.goal.CommentiFinaliValutato,
                    nota: this.goal.NoteFinaliValutato,
                    kpi: this.goal.IDKPI
                }, {
                    valutazione: this.goal.ValutazioneFinale,
                    commento: this.goal.CommentiFinaliValutatore,
                    nota: this.goal.NoteFinaliValutatore,
                    kpi: this.goal.IDKPI
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
                    this.goal.AutoValutazioneFinale = $event.obj.valutazione;
                    this.goal.CommentiFinaliValutato = $event.obj.commento;
                    this.goal.NoteFinaliValutato = $event.obj.nota;
                    break;
                case 1:
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
    computed : {
        evalAutovalutazione: function(){
            return this.$Ev(this.permits.Autovalutazione);
        },
        evalCommentiValutato: function(){
            return this.$Ev(this.permits.CommentiValutato);
        },
        evalNotePersonaValutata: function(){
            return this.$Ev(this.permits.NotePersonaValutata);
        },
        rendMine: function(){
            return this.evalAutovalutazione != null 
                || this.evalCommentiValutato != null
                || this.evalNotePersonaValutata != null; 
        },
        evalValutazione: function(){
            return this.$Ev(this.permits.Valutazione);
        },
        evalCommentiValutatore: function(){
            return this.$Ev(this.permits.CommentiValutatore);
        },
        evalNoteValutatore: function(){
            return this.$Ev(this.permits.NoteValutatore);
        },
        rendVal: function(){
            return this.evalValutazione != null
                || this.evalCommentiValutatore != null
                || this.evalNoteValutatore != null; 
        },
        atLeast: function(){
            return this.rendMine || this.rendVal;
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
