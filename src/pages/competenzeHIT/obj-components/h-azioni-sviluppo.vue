<template>
    <div class="item col-xs-12 panel panel-default h-container break-before">
        <div class="panel-header h-header">
            <h3 class="text-headline panel-title">{{s.titoloAzioniSviluppo[l]}}</h3>
        </div>
        <div class="panel-body h-body">
            <div v-if="rendMineTA" class="col-xs-12 comp"><span v-if="$root.getPermessi().showNeedlessLabels">{{s.dipComment[l]}}</span>
                <textarea rows="5" class="col-xs-12" v-model="dipendente" @change="commChange" :disabled="disableMineTA" :maxlength="$root.getMaxLengthAS()"></textarea>
            </div>
            <div v-if="rendValTA" class="col-xs-12 comp"><span v-if="$root.getPermessi().showNeedlessLabels">{{s.chiefComment[l]}}</span>
                <textarea rows="5" class="col-xs-12" v-model="chief" @change="commChange" :disabled="disableValTA" :maxlength="$root.getMaxLengthAS()"></textarea>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    mounted: function() {
        this.$nextTick(function() {
            this.init();
        })
    },
    props: {
        stato: Number,
        valutatore: Boolean
    },
    data: function() {
        return {
            s: this.$parent.strings,
            l: this.$parent.itaEng01,
            admin: this.$parent.admin,

            c: this.$parent.schedaVal,
            dipendente: '',
            chief: ''
        }
    },
    methods: {
        init: function() {
            //if (this.stato >= 10) {
                this.dipendente = this.c.NoteValutato;
                this.chief = this.c.NoteGeneriche;
            //}
        },
        commChange: function() {
            this.$emit('commChange', {
                NoteValutato: this.dipendente,
                NoteGeneriche: this.chief
            });
        }
    },
    computed: {
        rendMineTA: function(){
            return (this.$parent.permessi.Azioni_sviluppo_vto != null);
        },
        rendValTA: function(){
             return (this.$parent.permessi.Azioni_sviluppo_vre != null);
        },
        disableMineTA: function() {
            return (this.$parent.permessi.Azioni_sviluppo_vto != "mod");
        },
        disableValTA: function() {
            return (this.$parent.permessi.Azioni_sviluppo_vre != "mod");
        }
    }
}
</script>
<style scoped>
.comp {
    margin-top: 5px;
    padding: 0px;
    background-color: rgb(238, 238, 238);
    border-width: 0px;
}

textarea {
    resize: vertical;
}
</style>
