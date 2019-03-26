<template>
    <transition name="modal">
        <div class="modal-mask" v-show="datashow">
            <div class="modal-wrapper">
                <div class="modal-container">
                    <div class="modal-header" style="text-align: center">
                        <slot name="header">
                            <h3>{{s.selezionaLingua[l]}}</h3>
                        </slot>
                    </div>
                    <div class="modal-body" style="text-align: center">
                        <slot name="body">
                            <!--
                                <div v-for="l in langs">
                                    <input type="radio" name="language" :value="l.cod" v-model="selected" style="margin-right: 5px;">{{l.nome}}
                                </div>
                       		 -->
                            <div class="box" v-if="langs && langs.length">
                                <div v-for="(l, i) in langs">
                                    <input type="radio" name="language" :value="l.cod" v-model="selected" :id="'r'+i" />
                                    <label :for="'r'+i">{{l.nome}}</label>
                                </div>
                            </div>
                        </slot>
                    </div>
                    <div class="modal-footer" style="text-align: center;">
                        <slot name="footer">
                            <button type="button" class="btn btn-sm btn-primary" @click="switchLang">{{s.applica[l]}}</button>
                            <button type="button" class="btn btn-sm btn-primary" @click.prevent="close">{{s.chiudi[l]}}</button>
                        </slot>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>
<script>
export default {
    mounted: function() {
        this.getInfos();
    },
    props: {
        show: {
            type: Boolean
        }
    },
    data: function() {
        return {
            datashow: this.show,
            langs: [],
            selected: this.$root.getLang().toUpperCase(),
            s: this.$root.getStrings(),
            l: this.$root.lang()
        }
    },
    watch: {
        show: function() {
            this.datashow = this.show;
        }
    },
    methods: {
        switchLang: function() {
            if (this.selected === this.$root.getLang().toUpperCase()) {
                this.close()
            } else {
                this.$root.lsSet("lan", this.selected.toLowerCase());
                location.reload();
            }
        },
        close: function() {
            this.datashow = false
            this.$emit('closed');
        },
        isSel: function(cod) {
            console.log(cod == this.selected)
            return cod == this.selected
        },
        getInfos: function() {
            var conf = JSON.parse(this.$root.lsGet("configs"));
            this.langs = conf.langs;
        }
    }
}
</script>
<style scoped>
label {
    display: inline-block;
    cursor: pointer;
    position: relative;
    padding-left: 25px;
    margin-right: 15px;
    font-size: 15px;
}

input[type=radio] {
    display: none;
}

label:before {
    content: "";
    display: inline-block;
    width: 16px;
    height: 16px;
    margin-right: 10px;
    position: absolute;
    left: 0;
    bottom: 1px;
    background-color: #efefef;
    box-shadow: inset 0px 2px 3px 0px rgba(0, 0, 0, .3), 0px 1px 0px 0px rgba(255, 255, 255, .8);
    border-radius: 8px;
}

input[type=radio]:checked + label:before {
    content: "\2022";
    color: #42b983;
    font-size: 30px;
    text-align: center;
    line-height: 18px;
}
</style>
