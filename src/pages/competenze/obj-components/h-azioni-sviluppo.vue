<template>
    <div v-if="atLeast" class="item col-xs-12 panel panel-default h-container break-before">
        <div class="panel-header h-header">
            <h3 class="text-headline panel-title">{{s.titoloAzioniSviluppo[l]}}</h3>
        </div>
        <div class="panel-body h-body" style="padding: 5px 10px">
            <div v-if="rendMineTA" class="col-xs-12 comp"><span v-if="$root.getPermessi().showNeedlessLabels">{{s.Training1[l]}}</span>
                <textarea rows="5" class="col-xs-12" v-model="dipendente" @change="commChange" :disabled="disableMineTA" :maxlength="$root.getMaxLengthAS()"
                :class="{'dis': disableMineTA, 'mandatory_failed': failed.a_vto}"></textarea>
            </div>
            <div v-if="rendValTA" class="col-xs-12 comp"><span v-if="$root.getPermessi().showNeedlessLabels">{{s.Training2[l]}}</span>
                <textarea rows="5" class="col-xs-12" v-model="chief" @change="commChange" :disabled="disableValTA" :maxlength="$root.getMaxLengthAS()"
                :class="{'dis': disableValTA, 'mandatory_failed': failed.a_vre}"></textarea>
            </div>
            <div v-if="rendThird" class="col-xs-12 comp"><span v-if="$root.getPermessi().showNeedlessLabels">{{s.Training3[l]}}</span>
                <textarea rows="5" class="col-xs-12" v-model="third" @change="commChange" :disabled="disableThird" :maxlength="$root.getMaxLengthAS()"
                :class="{'dis': disableThird, 'mandatory_failed': failed.a_third}"></textarea>
            </div>
        </div>
    </div>
</template>
<script>

import {
    eventBus
} from '../../../eventbus.js';

export default {
    mounted: function() {
        this.$nextTick(function() {
            this.init();
        })
    },
    created: function() {
        var vm = this;
        var auth = this.permits;
        eventBus.$on("mandatoryFail", function() { 
            if(vm.$root.isMandatory(auth["AzioniDiSviluppoValutato"])){
                    vm.failed.a_vto = (vm.dipendente == null || vm.dipendente == "");
            }
            if(vm.$root.isMandatory(auth["AzioniDiSviluppoValutatore"])){
                    vm.failed.a_vre = (vm.chief == null || vm.chief == "");
            }
            if(vm.$root.isMandatory(auth["AzioniDiSviluppoAggiuntive"])){
                    vm.failed.a_third = (vm.third == null || vm.third == "");
            }
        });
        eventBus.$on("mandatoryReset", function() { 
            for(var prop in vm.failed){ vm.failed[prop] = false }
        });
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
            chief: '',
            third: '',

            permits: this.$parent.permessi,

            failed: {
                a_vto: false,
                a_vre: false,
                a_third: false
            }
        }
    },
    methods: {
        init: function() {
            this.dipendente = this.c.NoteValutato;
            this.chief = this.c.NoteGeneriche;
            this.third = this.c.NoteGeneriche2;
        },
        commChange: function() {
            this.$emit('commChange', {
                NoteValutato: this.dipendente,
                NoteGeneriche: this.chief,
                NoteGeneriche2: this.third
            });
        }
    },
    computed: {
        rendMineTA: function(){
            return (this.$Ev(this.permits.AzioniDiSviluppoValutato) != null);
        },
        rendValTA: function(){
            return (this.$Ev(this.permits.AzioniDiSviluppoValutatore) != null);
        },
        rendThird: function(){
            return (this.$Ev(this.permits.AzioniDiSviluppoAggiuntive) != null);
        },
        disableMineTA: function() {
            return (this.$Ev(this.permits.AzioniDiSviluppoValutato) != "mod");
        },
        disableValTA: function() {
            return (this.$Ev(this.permits.AzioniDiSviluppoValutatore) != "mod");
        },
        disableThird: function() {
            return (this.$Ev(this.permits.AzioniDiSviluppoAggiuntive) != "mod");
        },
        atLeast: function() {
            return this.rendMineTA || this.rendValTA || this.rendThird;
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

.dis {
    background-color: #f5f5f5;
}

textarea {
    resize: vertical;
}
</style>
