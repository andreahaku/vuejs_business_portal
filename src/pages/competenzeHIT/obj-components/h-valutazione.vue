<template>
    <div v-if="ready" class="row col-xs-12" style="padding-top:5px;border-top: 2px solid white">
        <div class="col-xs-12 col-sm-6 comp six col-lg-3"><span>{{hString}}</span>
            <div class="panel-header h-header" :class="{'dishead': disable}">
                <h5 class="text-subhead panel-title">{{vString}}</h5>
            </div>
            <div class="select col-xs-12" style="padding: 0px;">
                <span class="arr"></span>
                <select class="col-xs-12" :class="{'dis': disable}" style="padding: 1px;" v-model="val" @change="someChanged(true)" :disabled="disable">
                    <option v-for="(val, index) in vals" :value="index">{{val}}</option>
                </select>
            </div>
        </div>
        <div class="col-xs-12 col-sm-6 comp six col-lg-5">{{cString}}
            <textarea class="col-xs-12" rows="3" v-model="comment" @change="someChanged()" :disabled="disable" :maxlength="$root.getMaxLength()">
            </textarea>
        </div>
        <div v-if="note012 > 0" class="visible-lg-block comp col-lg-4 side-0">{{s.note[l]}}
            <textarea class="col-xs-12" rows="3" v-model="note" @change="someChanged()" :disabled="note012 == 1" :maxlength="$root.getMaxLength()">
            </textarea>
        </div>
        <div v-if="note012 > 0" class="hidden-lg col-xs-12 comp six">{{s.note[l]}}
            <textarea class="col-xs-12" rows="3" v-model="note" @change="someChanged()" :disabled="note012 == 1" :maxlength="$root.getMaxLength()">
            </textarea>
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
        auto: Boolean,
        final: Boolean,

        disable: Boolean,
        note012: Number,

        obj: Object
    },
    data: function() {
        return {
            s: this.$parent.s,
            l: this.$parent.l,

            hString: '',
            vString: '',
            cString: '',
            vals: this.$root.getRatingsVals(),

            //input
            val: null,
            comment: null,
            note: null,

            ready: false
        }
    },
    watch: {},
    methods: {
        init: function() {
            if (this.auto) {
                this.vString = this.final ? this.s.autoValF[this.l] : this.s.autoValMT[this.l];
            } else {
                this.vString = this.final ? this.s.valF[this.l] : this.s.valMT[this.l];
            }
            this.hString = this.auto ? this.s.autoVal[this.l] : this.s.chiefVal[this.l];
            this.cString = this.auto ? this.s.dipComment[this.l] : this.s.chiefComment[this.l];

            if (this.obj != null) {

                this.val = this.obj.valutazione;
                this.comment = this.obj.commento;
                this.note = this.obj.nota;
            }

            this.ready = true;
        },
        someChanged: function(isVal) {
            if(this.val == 0){
                this.val = null;
            }
            var json = {
                valutazione: this.val,
                commento: this.comment,
                nota: this.note
            }

            this.$emit('valChange', {
                obj: json,
                isVal: isVal
            });
        }
    }
}
</script>
<style>
    
.p_top {
    padding-top: 20px !important;
}
</style>
<style scoped>

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

.dis {
    color: darkgrey;
}

.dishead {
    background-color: rgb(169, 169, 169);
}

textarea {
    resize: vertical;
}
</style>
