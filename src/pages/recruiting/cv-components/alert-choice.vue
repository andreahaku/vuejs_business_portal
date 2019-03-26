<template>

    <div class="new_modal-mask" v-show="datashow">
        <transition name="new_modal">
            <div class="new_modal-wrapper" v-show="toggleTrans">
                <div class="new_modal-container">
                    <div class="new_modal-header">
                        <div class="media">
                            <div class="media-left" style="vertical-align: middle; padding-left: 5px; padding-right: 20px;">
                                <i class="fa fa-question-circle alert-icon" style="width: 40px; height: 40px;"></i>
                            </div>
                            <div class="media-body">
                                <h4 class="media-heading">{{strings.sicuro[this.itaEng01]}}</h4>
                                <p>{{mess}}</p>
                            </div>
                            <div class="header-buttons">
                                <a class="close-button" @click="send(false)"><i class="fa fa-times" style="text-align: center; position: relative;"></i></a>
                            </div>
                        </div>
                    </div>
                    <div class="new_modal-body panel">
                        <div class="panel-footer">
                            <a href="" class="btn btn-warning btn-sm" @click.prevent="send(false)">{{strings.n[this.itaEng01]}}</a>
                            <a href="" class="btn btn-info btn-sm" @click.prevent="send(true)">{{strings.y[this.itaEng01]}}</a>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
    
</template>
<script>

import {
  toggleVisibility
} from '../../components/alerts/toggleVisibilityAlertMixin.js';

export default {
    props: {
        mess: {
            type: String
        }
    },
    mixins: [toggleVisibility],
    data: function() {
        return {
            strings: this.$root.getStrings(),
            itaEng01: this.$root.lang()
        }
    },
    methods: {
        send: function(yes) {
            this.$emit('done', yes);
            //close in questo caso trigghererà un $emit closed che semplicemente non sarò intercettato
            this.close()
        }
    }
}
</script>
<style scoped>
.new_modal-wrapper a.close-button {
    color: rgb(136, 160, 185);
}
.new_modal-header {
    background-color: rgb(136, 160, 185);
}
</style>
