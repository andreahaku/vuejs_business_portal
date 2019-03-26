<template>
    <div v-if="ready" class="row col-xs-12" style="padding-top: 8px">
        <!-- apply grid class suspended :class="grid_class" -->
        <div v-if="rating != null" class="col-xs-12 col-sm-6 col-lg-4 comp pull-right"><span class="print_bold">{{vString}}</span>
            <!--
            <div class="panel-header h-header" 
            :class="{'dishead': rating == 'vis'}">
                <h5 class="text-subhead panel-title">{{vString}}</h5>
            </div> -->
            <div v-if="vals != null" class="select col-xs-12" style="padding: 0px;">
                <span class="arr"></span>
                <!-- handle obj.tipo = "Competenza" select -->
                <select class="col-xs-12" style="padding: 1px; height: 30px;" v-model="valContainer"
                :disabled="rating == 'vis' || inconsistent == true" :class="{'dis': rating=='vis' ||  inconsistent == true, 'mandatory_failed': failed.rating}">
                    <option v-for="val in vals" :value="val">{{val.descrizione}}</option>
                </select>
                <!-- emit update delegato al watcher su valContainer-->
            </div>
            <div v-else class="select col-xs-12" style="padding: 0px; background-color: #fff; border: 1px solid #aaa; text-align: center;">
                <clip-loader :loading="vals== null" :color="'rgb(93, 197, 150)'" size="20px"></clip-loader>
            </div>

            <checkbox v-if="obj.allow" class="not_app" v-model="not_a" :disabled="rating == 'vis'">
                <div style="display: inline-block; position: relative; top: -3px; left: 5px; cursor: pointer;">
                    <strong>{{s.nonApplicabile[l]}}</strong></div>
            </checkbox>
        </div>
        <!-- apply grid class suspended :class="grid_class" -->
        <div v-if="commenti != null" class="col-xs-12 col-sm-6 col-lg-8 comp" ><span class="print_bold">{{cString}}</span>
            <textarea class="col-xs-12" rows="3" v-model="comment" @change="someChanged()" :maxlength="$root.getMaxLength()"
            :disabled="commenti == 'vis'" :class="{'dis': commenti == 'vis', 'mandatory_failed': failed.commenti}">
            </textarea>
        </div>
        <div v-if="note != null" class="comp col-xs-12" 
        :class="[numeroForm != 3 ? grid_class : 'col-sm-12 col-lg-4']"><span class="print_bold">{{s.note[l]}}</span>
            <textarea class="col-xs-12" rows="3" v-model="notes" @change="someChanged()" :maxlength="$root.getMaxLength()"
            :disabled="note == 'vis'"  :class="{'dis': note == 'vis', 'mandatory_failed': failed.note}">
            </textarea>
        </div>
    </div>
</template>
<script>
import ClipLoader from 'vue-spinner/src/ClipLoader.vue'
import {Checkbox} from 'vue-checkbox-radio';
import {
    eventBus
} from "../../../eventbus.js";

export default {
    mounted: function() {
        this.$nextTick(function() {
            this.init();
        })
    },
    created: function(){
        var vm = this;
        var auth = this.$parent.permits;
        eventBus.$on("mandatoryFail", function() { 
            if(!vm.not_a){
                if(vm.$root.isMandatory(auth[vm.auto ? "Autovalutazione" : "Valutazione"])){
                        vm.failed.rating = (vm.val == null);
                }
                if(vm.$root.isMandatory(auth[vm.auto ? "CommentiValutato" : "CommentiValutatore"])){
                        vm.failed.commenti = (vm.comment == null || vm.comment == "");
                }
                if(vm.$root.isMandatory(auth[vm.auto ? "NotePersonaValutata" : "NoteValutatore"])){
                        vm.failed.note = (vm.notes == null || vm.notes == "");
                }
            } else {
                for(var prop in vm.failed){ vm.failed[prop] = false }
            }
        });
        eventBus.$on("mandatoryReset", function() { 
            for(var prop in vm.failed){ vm.failed[prop] = false }
        });
    },
    components: {
        ClipLoader,
        Checkbox
    },
    props: {
        auto: Boolean,

        rating: String,
        commenti: String,
        note: String,
        non_applicabile: Number,

        obj: Object,
    },
    data: function() {
        return {
            s: this.$parent.s,
            l: this.$parent.l,
            hString: '',
            vString: '',
            cString: '',
            vals: null,

            val: null,
            valContainer: null,
            inconsistent: false,

            comment: null,
            notes: null,
            not_a: false,
            a_change_ignore: true,

            ready: false,

            grid_class: '',
            numeroForm: null,

            failed: {
                rating: false,
                commenti: false,
                note: false
            }
        }
    },
    watch: {
        valContainer: function(){
            if(this.vblock != true){

                this.val = this.valContainer.value;
                this.someChanged(true);
            } else { this.vblock = false; }
        },
        not_a: function(){
            this.consistency();
            if(!this.a_change_ignore){
                this.someChanged();
            }
        }
    },
    methods: {
        init: function() {

            this.vString = this.auto ? this.s.autoValF[this.l] :this.s.valF[this.l];
            this.hString = this.auto ? this.s.autoVal[this.l] : this.s.chiefVal[this.l];
            this.cString = this.auto ? this.s.dipComment[this.l] : this.s.chiefComment[this.l];

            this.numeroForm = 0;
            this.numeroForm = this.rating != null ? this.numeroForm+1 : this.numeroForm;
            this.numeroForm = this.commenti != null ? this.numeroForm+1 : this.numeroForm;
            this.numeroForm = this.note != null ? this.numeroForm+1 : this.numeroForm;
            if(this.numeroForm == 2){
                this.grid_class = 'col-sm-6';
            } else if(this.numeroForm == 3){
                this.grid_class = 'col-sm-6 col-lg-4';
            }

            if(this.rating != null)
            this.ready = true;

            if (this.obj != null) {
                this.val = this.obj.valutazione;
                this.comment = this.obj.commento;
                this.notes = this.obj.nota;
                this.not_a = this.obj.non_applicabile == -1;

                this.$nextTick(function(){ this.a_change_ignore = false; })

                this.$http.get(localStorage.getItem('path') + '/APILivelliRequisiti?IDRequisiti='+this.obj.requisito).then((response) => {
                    var res = response.body;
                    try{
                        res = JSON.parse(response.body);
                    } catch(err) {};
                    if(res && res.APILivelliRequisiti){
                        this.vals = [{value: 0, descrizione: ''}];
                        for(var i = 0; i < res.APILivelliRequisiti.length; i++){
                            this.vals.push({
                                value: res.APILivelliRequisiti[i].Livello,
                                descrizione: res.APILivelliRequisiti[i].DescrizioneLivello
                            })
                            this.vals.sort(function(a,b){
                                return a.value - b.value;
                            })
                            if(this.val != null){
                                this.vals.some(function(v){
                                    if(v.value == this.val){
                                        this.vblock = true;
                                        this.valContainer = v;
                                        return true;
                                    }
                                }, this)
                            }
                        }
                    }

                })
            }
        },
        someChanged: function(isVal) {
            this.val = this.val == 0 ? null : this.val;

            var json = {
                valutazione: this.val,
                commento: this.comment,
                nota: this.notes,
                non_applicabile: this.not_a ? -1 : 0
            }
            this.$emit('levChange', {
                obj: json,
                isVal: isVal
            });
        },
        consistency: function(){
    
            if(this.not_a == true){
                this.val = null;
                this.vblock = true;
                this.valContainer = null;
                this.inconsistent = true;
            } else {
                this.vblock = false;
                this.inconsistent = false;
            }
        }
    }
}
</script>
<style>
    
.p_top {
    padding-top: 20px !important;
}

.checkbox-component > label {
  margin: 10px 0px 0px 0px;   
}

.checkbox-component > input + label > .input-box {
  position: relative;
  border: 1px solid #939393 !important;
  border-radius: 35% !important;
  width: 2.2em !important;
  height: 1.3em !important;
  background: #fff;
  transition: background 0.2s ease-in;
  vertical-align: -15%;
  cursor: pointer;
}
.checkbox-component > input + label > .input-box > .input-box-tick {
  display: none;
}
.checkbox-component > input + label > .input-box:before {
  content: '';
  position: absolute;
  top: -1px;
  left: -1px;
  border: 1px solid #939393;
  border-radius: 50%;
  width: 1.3em;
  height: 1.3em;
  background: #fff;
  cursor: pointer;
  transition: transform 0.3s ease-out;
}
.checkbox-component > input:checked + label > .input-box {
  background: #42a5f5;
}
.checkbox-component > input:checked + label > .input-box:before {
  border-color: #498d47;
  transform: translateX(1em);
}
</style>
<style scoped>
textarea {
    overflow-x: hidden;
}

.side-0 {
    padding: 0px;
}

.row {
    margin: 0px;
    padding: 0px;
}

.comp {
    background-color: rgb(238, 238, 238);
    border-width: 0px;
}

.panel-body {
    background-color: white;
}

.h-header {
    background-color: #888;
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

.dishead {
    background-color: rgb(169, 169, 169);
}

textarea {
    resize: vertical;
}

.dis {
    background-color: #f4f4f4 !important;
}
</style>
