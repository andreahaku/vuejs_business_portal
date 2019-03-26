<template>
   <transition name="modal">
       <div class="modal-mask" v-show="datashow">
        <div class="modal-wrapper">
          <div id="containah" :class="{'modal-container': !isMobile, 'mobile-modal-container': isMobile}">

            <div class="modal-header">
              <slot name="header">
                <h3>Salvando</h3>
              </slot>
            </div>

            <div class="modal-body">
              <slot name="body">
                <h4>{{mess}}</h4>
                <ul v-if="missings.length > 0">
                    <span  v-for="param in missings">
                        <li v-if="param!='separator'"><span style="font-size: 14px;">{{param}}</span></li>
                        <hr v-else style="margin: 15px 0px;"/>
                    </span>
                    
                </ul>
              </slot>
              <slot v-if="missings.length > 0">
                  <br>
                  <h4>Ricorda che non potrai sottomettere un curriculum non valido come candidatura</h4>
              </slot>
            </div>

            <div class="modal-footer">
              <slot name="footer">
              <button class="modal-default-button"
                  @click="send(false)">
                  NO
                </button>
               <button class="modal-default-button yes"
                  @click="send(true)">
                  SI
                </button>

              </slot>
            </div>
         </div>
        </div>
      </div>
  </transition>
</template>
<script>
    
    export default {
        props: {
            show: {
              type: Boolean
            },
            mess: {
              type: String
            },
            missings: {
                type: Array
            }
        },
        data: function(){
            return {
                datashow: this.show,
                list: this.missings,
                
                isMobile: false
            }  
        },
        watch: {
            show: function(){
                this.datashow = this.show;
                if(this.datashow){
                    if(window.innerWidth <= 450){
                        this.isMobile = true;
                        document.getElementById("containah").style.maxHeight = window.innerHeight +'px';
                    } else {
                        this.isMobile = false;
                    }
                }
            }  
        },
        methods: {
            send: function(yes){
                this.$emit('done', yes);
                this.close()
            },
            close: function(){
                this.datashow = false
            }
        }
    }
</script>
<style scoped>

    .modal-mask {
      position: fixed;
      z-index: 9997;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, .5);
      display: table;
      transition: opacity .3s ease;
    }

    .modal-wrapper {
      display: table-cell;
      vertical-align: middle;
    }

    .modal-container {
      width: 500px;
      margin: 0px auto;
      padding: 20px 30px;
      background-color: #fff;
      border-radius: 2px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
      transition: all .3s ease;
      font-family: Helvetica, Arial, sans-serif;
    }
    
    .mobile-modal-container{
      width: 300px;
      margin: 0px auto;
      padding: 20px 30px;
      background-color: #fff;
      border-radius: 2px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
      transition: all .3s ease;
      font-family: Helvetica, Arial, sans-serif;
      overflow-y: auto;
    }

    .modal-header h3 {
      margin-top: 0;
      color: #42b983;
    }

    .modal-body {
      margin: 0px 0;
    }

    .modal-default-button {
      float: right;
    }
    
    button.yes{
        margin-right: 5px;
    }
</style>