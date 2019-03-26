<template>
    <div v-if="ready && any" class="item col-xs-12 panel panel-default h-container">
        <div class="panel-header h-header">
            <h3 class="text-headline panel-title">{{s.titoloCascading[l]}}</h3>
        </div>
        <div class="panel-body h-body" v-for="(casc, index) in goals" :class="{'break_after': index == goals.length - 2}">
            <div v-if="showElab(index)">
                <h5 class="text-subhead" style="margin: 5px 0px;">{{casc.Indicatore}}</h5>
                <div class="panel panel-default html-fields" v-html="casc.DescrizioneIndicatore"></div>
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

            cascading: this.$parent.goalCascading,
            goals: [],
            ready: false,
            insert: false,
            any: false
        }
    },
    watch: {},
    methods: {
        init: function() {
            this.getCascading();
        },
        getCascading: function() {
            this.goals = [];
            this.goals = this.goals.concat(this.cascading);
            this.ready = true;
            //goals empty, non dovrebbe mostrare nemmeno il componente
            this.checkForAny();
        },
        showElab: function(i){
            if(this.goals[i].DescrizioneIndicatore == null){
                return false;
            } else if(this.goals[i].DescrizioneIndicatore == "<p></p>"){
                return false;
            }
            return true;
        },
        checkForAny: function(){
            for(var i = 0; i < this.goals.length; i++){
                if(this.goals[i].DescrizioneIndicatore != null && this.goals[i].DescrizioneIndicatore != "<p></p>"){
                    this.any = true;
                }
            }
        }
    }
}
</script>
<style scoped>
.html-fields {
    padding: 10px 15px;
    margin-bottom: 5px;
    min-height: 50px;
}
</style>
