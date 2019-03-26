<template>
   <transition name="modal">
       <div class="modal-mask" v-show="datashow">
        <div class="modal-wrapper">
          <div class="modal-container">

            <div class="modal-header">
              <slot name="header">
                <h3>Sessione rilevata</h3>
              </slot>
            </div>

            <div class="modal-body">
              <slot name="body">
                <h4>Vuoi ripristinare l'ultima sessione?</h4>
              </slot>
            </div>

            <div class="modal-footer">
              <slot name="footer">
              <button class="modal-default-button"
                  @click="close">
                  NO
                </button>
               <button class="modal-default-button yes"
                  @click="redirect">
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
            }
        },
        data: function(){
            return {
                datashow: this.show
            }  
        },
        watch: {
            show: function(){
                this.datashow = this.show;
            }  
        },
        methods: {
            redirect: function(){
                
                this.$router.push({
                    path: localStorage.getItem("lastFound")
                })
                localStorage.removeItem("lastFound");
                this.datashow = false
                this.$emit('closed');
            },
            close: function(){
                localStorage.removeItem("lastFound");
                this.datashow = false
            }
        }
    }
</script>
<style>

    .modal-mask {
      position: fixed;
      z-index: 9998;
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
      width: 300px;
      margin: 0px auto;
      padding: 20px 30px;
      background-color: #fff;
      border-radius: 2px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
      transition: all .3s ease;
      font-family: Helvetica, Arial, sans-serif;
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