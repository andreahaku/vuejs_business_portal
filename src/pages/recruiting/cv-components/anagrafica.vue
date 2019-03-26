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
      
      <component :is="selectedComponent" @alert="dispatch"></component>
    </div>
</template>

<script>
    
    import editable from './anag-editable.vue';
    import saved from './anag-saved.vue';
    import {eventBus} from '../../../eventbus.js';
    import {updateCvTokenMixin} from './updateCvTokenMixin.js';
    
    export default {
        props: {
            updating: {
              type: Boolean
            },
            err: {
              type: Boolean
            }
        },
        mounted(){
        },
        mixins: [updateCvTokenMixin],
        created(){
            var vm = this;
            eventBus.$on('AnagraficSwitch', function(hasToSave){
                vm.switchComponents(hasToSave)
            })  
        },
        components: {
            appEditable: editable,
            appSaved: saved
        },
        data(){
            return {
               switchComp: false,
               selectedComponent: 'appSaved',
            }
        },
        methods: {
            dispatch($event){
               this.$emit("alert", $event);
            },
            switchComponents: function(hasToSave){
                this.switchComp = !this.switchComp;
                if(this.switchComp){
                    this.selectedComponent = 'appEditable';
                } else {
                    this.selectedComponent = 'appSaved';
                    if(hasToSave){
                        this.$emit('updateCV', 'a');
                    }
                }
                document.getElementById("a").scrollIntoView();
            }
        }
    }
</script>
<style>
    .upd-err{
        color: crimson !important;
    }
</style>