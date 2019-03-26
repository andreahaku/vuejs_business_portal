<template>
    <div v-if="renderEntireComponent" class="item col-xs-12 panel panel-default h-container" style="background-color: rgb(238,238,238);">
        <div class="panel-header h-header">
            <h3 class="text-headline panel-title">{{s.titoloComplessiva[l]}}</h3>
        </div>
        <div v-if="showValutato || showCommentiValutato" class="row col-xs-12">
            <div v-if="showValutato" class="col-xs-12 col-sm-6 col-lg-3 comp six"><strong>{{s.autoVal[l]}}</strong>
                <div class="panel-header v-header" :class="{'dishead': disableMine}">
                    <h5 class="text-subhead panel-title">{{s.autoValF[l]}}</h5>
                </div>
                <div class="select col-xs-12" style="padding: 0px;">
                    <span class="arr"></span>
                    <select class="col-xs-12" :class="{'sugg': disableMine}" style="padding: 1px;" v-model="a" @change="someChanged('mine')" :disabled="disableMine">
                        <option v-for="(val, index) in vals" :value="index">{{val}}</option>
                    </select>
                </div>
            </div>
            <div v-if="(!valutatore || admin) && showValutato" class="col-xs-12 col-sm-6 col-lg-3 comp six"><strong>{{s.autoSuggerita[l]}}</strong>
                <div class="panel-header v-header" :class="{'dishead': disableMine}">
                    <h5 class="text-subhead panel-title">{{s.autoFinaleSuggerita[l]}}</h5>
                </div>
                <div class="select col-xs-12 sugg" style="padding: 0px;">
                    <span class="arr"></span>
                    <select class="col-xs-12" style="padding: 1px;" v-model="aSuggest" disabled>
                        <option v-for="(val, index) in vals" :value="index">{{val}}</option>
                    </select>
                </div>
            </div>
            <div v-if="showCommentiValutato" class="col-xs-12 col-sm-6 c-v comp" 
            :class="{'col-lg-12': !showValutato, 'col-lg-6': (!valutatore && showValutato) , 'col-lg-9': (valutatore && !admin && showValutato)}"><strong>{{s.dipComment[l]}}</strong>
                <textarea class="col-xs-12" rows="3" v-model="commentA" @change="someChanged('minecomm')" 
                :disabled="disableMine && disableCommentiValutato">
                </textarea>
            </div>
        </div>
        <div v-if="showValutatore" class="row col-xs-12">
            <div class="col-xs-12 col-sm-6 comp six col-lg-3">
                <strong v-if="$root.getPermessi().showNeedlessLabels">{{s.chiefVal[l]}}</strong>
                <div class="panel-header v-header" :class="{'dishead': disableValutatore}">
                    <h5 class="text-subhead panel-title"><span>{{s.valF[l]}}</span></h5>
                </div>
                <div class="select col-xs-12" style="padding: 0px;">
                    <span class="arr"></span>
                    <select class="col-xs-12" :class="{'sugg': disableValutatore}" style="padding: 1px;" v-model="v" @change="someChanged('val')" :disabled="disableValutatore">
                        <option v-for="(val, index) in vals" :value="index">{{val}}</option>
                    </select>
                </div>
            </div>
            <div v-if="(valutatore || admin)" class="col-xs-12 col-sm-6 col-lg-3 comp six"><strong>{{s.valSuggerita[l]}}</strong>
                <div class="panel-header v-header" :class="{'dishead': disableValutatore}">
                    <h5 class="text-subhead panel-title">{{s.valFinaleSuggerita[l]}}</h5>
                </div>
                <div class="select col-xs-12 sugg" style="padding: 0px;">
                    <span class="arr"></span>
                    <select class="col-xs-12" style="padding: 1px;" v-model="vSuggest" disabled>
                        <option v-for="(val, index) in vals" :value="index">{{val}}</option>
                    </select>
                </div>
            </div>
            <!-- not alternative -->
            <div class="col-xs-12 col-sm-6 comp" :class="{'col-lg-6': valutatore, 'col-lg-9': !valutatore && !admin}" >
                <strong >{{s.chiefComment[l]}}</strong>
                <textarea class="col-xs-12" rows="3" v-model="commentC" @change="someChanged('valcomm')" :disabled="disableValutatore" 
                :maxlength="$root.getMaxLength()"></textarea>
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
        aSuggest: Number,
        vSuggest: Number,

        valutatore: Boolean,
        stato: Number
    },
    data: function() {
        return {
            s: this.$parent.strings,
            l: this.$parent.itaEng01,

            f: this.$parent.schedaVal,
            admin: this.$parent.admin,

            vals: this.$root.getRatingsVals(),
            a: undefined,
            v: undefined,
            commentA: '',
            commentC: '',

            showValutato: false,
            showValutatore: false,
            disableMine: false,
            disableValutatore: false,

            showCommentiValutato: false,
            disableCommentiValutato: false
        }
    },
    computed: {
        renderEntireComponent: function(){
            return this.admin 
                || this.$parent.permessi.Autovalutazione_c != null
                || this.$parent.permessi.Commenti_c != null
                || this.$parent.permessi.Valutazione_c != null;
        },
    },
    methods: {
        init: function() {

            this.showValutato = this.$parent.permessi.Autovalutazione_c != null;
            this.showValutatore = this.$parent.permessi.Valutazione_c != null;
            this.showCommentiValutato = this.$parent.permessi.Commenti_c != null;

            this.disableMine = this.$parent.permessi.Autovalutazione_c != "mod";
            this.disableValutatore = this.$parent.permessi.Valutazione_c != "mod";
            this.disableCommentiValutato = this.$parent.permessi.Commenti_c != "mod";

            console.log(this.showCommentiValutato)
            if (this.renderEntireComponent) {
                this.a = this.f.Autovalutazione;
                this.v = this.f.Valutazione;
                this.commentA = this.f.CommentiFinaliValutato;
                this.commentC = this.f.CommentiFinaliValutatore;
            }
        },
        someChanged: function(what) {
            if(this.a == 0){
                this.a = null;
            }
            if(this.v == 0){
                this.v = null;
            }
            this.$emit('finalChange', {
                Autovalutazione: this.a,
                Valutazione: this.v,
                CommentiFinaliValutato: this.commentA,
                CommentiFinaliValutatore: this.commentC
            });
        }
    }
}

</script>
<style>
.rev {
    font-size: 18px;
}
</style>
<style scoped>
.comp {
    background-color: rgb(238, 238, 238);
    border-width: 0px;
}

.row {
    padding: 0px;
    margin: 5px 0px;
}

.v-header {
    background-color: #777;
    color: white;
    padding: 5px 10px;
    border-radius: inherit;
}

.select {
    font-size: 16px;
    position: relative;
    display: inline-block;
}

.select select {
    outline: none;
    display: block;
    padding: 5px;
    margin: 0;
    background: #fff;
    line-height: normal;
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
}

.sugg {
    color: darkgrey;
}

.dishead {
    background-color: rgb(169, 169, 169);
}

.c-v.col-lg-12 {
    padding-left: 0px;
}

textarea {
    resize: vertical;
}
</style>
