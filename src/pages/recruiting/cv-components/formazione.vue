<template>
     <div>
        <div v-if="updating" class='uil-rolling-css hidden-xs' style='transform:scale(0.20);
        z-index: 1; position: absolute; margin: 0 auto; top: -45px; right: 0px; left: 0px;'><div><div></div><div></div></div></div>
        
         <div v-if="doneUpdating" class="panel panel-default panelcvtoken hidden-xs">
          <div class="media v-middle">
            <div class="media-left"> 
              <div class="text-white" :class="{'bg-green-400': !err, 'bg-red-400': err}" 
               style="border-radius: 3px;">
                <div class="panel-body" style="padding: 10px;">
                  <i class="fa" :class="{'fa-check': !err, 'fa-times': err}"></i>
                </div>
              </div>
            </div>
            <div class="media-body">
              <span v-if="!err">Curriculum salvato con successo</span>
              <span v-else>Curriculum non aggiornato correttamente</span>
            </div>
          </div>
        </div>
        
      <component :is="selectedComponent" @alert="dispatch" @updatecv="dispatchcv"></component>
    </div>
</template>

<script>
    
    import editable from './form-editable.vue';
    import saved from './form-saved.vue';
    import {eventBus} from '../../../eventbus.js';
    import {updateCvTokenMixin} from './updateCvTokenMixin.js';
    
    export default {
        mounted(){
        },
        mixins: [updateCvTokenMixin],
        props: {
            updating: {
              type: Boolean
            },
            err: {
              type: Boolean
            }
        },
        created(){
            var vm = this;
            eventBus.$on('EducationSwitch', function(obj){
                vm.switchComponents(obj) 
            });
        },
        components: {
            appEditable: editable,
            appSaved: saved
        },
        data(){
            return {
               switchComp: false,
               selectedComponent: 'appSaved'
            }
        },
        methods: {
            dispatch($event){
               this.$emit("alert", $event);
            },
            dispatchcv($event){
               this.$emit("updateCV", {value: 'f'});
            },
            switchComponents: function(obj){
                this.switchComp = !this.switchComp;
                if(this.switchComp){
                    this.selectedComponent = 'appEditable';
                } else {
                    this.selectedComponent = 'appSaved';
                    if(obj.switch){
                        var passing = {value: 'f'};
                        if(obj.delete && obj.delete.length > 0){
                            passing.delete = obj.delete;
                        }
                        this.$emit("updateCV", passing);
                    }
                }
                //document.getElementById("f").scrollIntoView();
            }
        }
    }
</script>
<style>
    .panelcvtoken{
        z-index: 1; 
        position: absolute; 
        margin: 0 auto; 
        right: 0px; 
        left: 0px; 
        top: 30px;
        max-width: 250px;
        border-width: 0px;
    }

    .panelcvtoken .media-left{
        padding-top: 0px;
    }
</style>