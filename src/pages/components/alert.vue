<template>
    <div class="new_modal-mask" v-show="datashow">
        <transition name="new_modal">
            <div class="new_modal-wrapper" v-show="toggleTrans">
                <div class="new_modal-container">
                    <div class="new_modal-header">
                        <div class="media">
                            <div class="media-left" style="vertical-align: middle; padding-left: 5px; padding-right: 20px;">
                                <i class="fa fa-exclamation-circle alert-icon" style="width: 40px; height: 40px;"></i>
                            </div>
                            <div class="media-body">
                                <h4 class="media-heading">{{err}}</h4>
                                <p>{{message}}</p>
                            </div>
                            <div class="header-buttons">
                                <a class="close-button" @click="pre_close()"><i class="fa fa-times" style="text-align: center; position: relative;"></i></a>
                            </div>
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
} from './alerts/toggleVisibilityAlertMixin.js';

export default {
    mounted: function() {
        this.$nextTick(function() {
            var l = this.$root.lang()
            var s = this.$root.getStrings()
            if (l == 1) {
                this.err = s.err[l];
            }
        })
    },
    mixins: [toggleVisibility],
    props: {
        message: String
    },
    data: function() {
        return {
            err: 'Errore'
        }
    },
    methods: {
        pre_close: function() {
            if (this.message == "Sessione scaduta") {
                location.pathname = '/login.html';
            }
            this.close();
        }
    }
}
</script>
<style>
.new_modal-mask {
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

.new_modal-wrapper {
    display: table-cell;
    vertical-align: middle;
}

.new_modal-container {
    max-width: 900px;
    margin: auto;
    padding: 0px;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
    transition: all .3s ease;
    font-family: 'Lato', arial;
}

.new_modal-header {
    padding: 14px 18px 15px 18px;
    box-shadow: inset 0 -10px 15px -12px rgba(0, 0, 0, 0.3), 0 0 0px #555;
    background-color: rgb(189, 91, 91);
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
    color: white;
    position: relative;
}

.new_modal-header h4 {
    color: white;
    margin-bottom: 2px !important;
    font-family: inherit;
    text-align: left;
}
.new_modal-header p {
    color: rgba(255, 255, 255, 0.6);
    font-family: inherit;
    text-align: left;
}

.new_modal-body.panel {
    border-bottom-left-radius: 2px;
    border-bottom-right-radius: 2px;
}

.new_modal-body.panel>.panel-body {
    text-align: center;
    margin-bottom: 10px;
}

.alert.custom_spinner:before {
    width: 30px;
    height: 30px;
}

.new_modal-enter {
    opacity: 0;
}

.new_modal-enter-active {
    animation: new_slide-in 0.2s ease-out forwards; */
    transition: opacity 0.4s;
}

.new_modal-leave-active {
    animation: slide-out 0.2s ease-out forwards; */
    transition: opacity 0.4s;
    opacity: 0;
}
@keyframes new_slide-in {
    from {
        transform: translateX(200px);
    }
    to {
        transform: translateX(0px);
    }
}

@keyframes new_slide-out {
    from {
        transform: translateX(0px);
    }
    to {
        transform: translateX(-200px);
    }
}

.new_modal-wrapper i.alert-icon:before {
    color: rgba(255, 255, 255, 0.6);
    font-size: 40px;
}

.new_modal-wrapper .header-buttons {
    position: absolute;
    right: 20px;
    top: 35%;
}

.new_modal-wrapper a.close-button > i:before {
    font-size: 17px;
}

.new_modal-wrapper a.close-button {
    width: 23px;
    height: 23px;
    padding-top: 2px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.6);
    color: rgb(189, 91, 91);
    opacity: 0.3;
    display: block;
    text-align: center;
    transition: 0.70s;
    -webkit-transition: 0.70s;
    -moz-transition: 0.70s;
    -ms-transition: 0.70s;
    -o-transition: 0.70s;
}

.new_modal-wrapper a.close-button:hover {
    opacity: 1;
    transition: 0.70s;
    -webkit-transition: 0.70s;
    -moz-transition: 0.70s;
    -ms-transition: 0.70s;
    -o-transition: 0.70s;
    -webkit-transform: rotate(180deg);
    -moz-transform: rotate(180deg);
    -o-transform: rotate(180deg);
    -ms-transform: rotate(180deg);
    transform: rotate(180deg);
} 
</style>
