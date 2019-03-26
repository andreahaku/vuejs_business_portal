<template>
    <transition name="modal">
        <div class="modal-mask" v-show="datashow">
            <div class="modal-wrapper">
                <div class="modal-container">
                    <div class="modal-header">
                        <slot name="header">
                            <h3>{{strings.sicuro[this.itaEng01]}}</h3>
                        </slot>
                    </div>
                    <div class="modal-body">
                        <slot name="body">
                            <h4>{{mess}}</h4>
                        </slot>
                    </div>
                    <div class="modal-footer">
                        <slot name="footer">
                            <button class="modal-default-button" @click="send(false)">
                                {{strings.n[this.itaEng01]}}
                            </button>
                            <button class="modal-default-button yes" @click="send(true)">
                                {{strings.y[this.itaEng01]}}
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
        }
    },
    data: function() {
        return {
            strings: this.$root.getStrings(),
            itaEng01: this.$root.lang(),
            datashow: this.show
        }
    },
    watch: {
        show: function() {
            this.datashow = this.show;
        }
    },
    methods: {
        send: function(yes) {
            this.$emit('done', yes);
            this.close()
        },
        close: function() {
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

button.yes {
    margin-right: 5px;
}
</style>
