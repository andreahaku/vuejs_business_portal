<template>
    <div v-if="ready" class="item col-xs-12 panel panel-default h-container break" id="individuali">
        <div class="panel-header h-header">
            <h3 class="text-headline panel-title">{{s.titoloIndividuali[l]}}</h3>
        </div>
        <div v-for="(goal, index) in goals" class="col-xs-12 goal" v-if="ctrArray[index].active">
            <div class="panel-body h-body col-xs-12 six" :class="[hide_headers.kpi ? 'col-lg-8' : 'col-lg-6']">
                <h5 class="text-subhead" style="margin: 5px 0px; font-size: 1.5rem;">{{goal.Indicatore}}</h5>
                <span v-if="hide_headers.kpi != true">
                    <div v-if="!insertObj" class="panel panel-default obb">{{goal.NoteObiettivo}}</div>
                    <textarea class="texa" v-else v-model="goal.NoteObiettivo" rows="3" @change="update(index)" :maxlength="$root.getMaxLength()"></textarea>
                </span>
                <span v-else>
                    <div v-if="!insertObj" class="panel panel-default obb" v-html="goal.DescrizioneIndicatore"></div>
                    <textarea class="texa" v-else v-model="goal.DescrizioneIndicatore" rows="3" @change="update(index)" :maxlength="$root.getMaxLength()"></textarea>
                </span>
            </div>
            <div v-if="hide_headers.kpi != true" class="panel-body h-body col-xs-12 col-sm-6 col-lg-3" 
            :class="{'side-0': !$root.xs}"  style="margin-bottom: 10px">
                <h5 class="text-subhead" style="margin: 5px 0px;">{{s.kpi[l]}}</h5>
                <div v-if="!insertObj" class="panel panel-default obb">{{goal.DescrizioneIndicatore}}</div>
                <textarea class="texa" v-else v-model="goal.DescrizioneIndicatore" rows="2" @change="update(index)" :maxlength="$root.getMaxLengthKPI()"></textarea>
            </div>
            <div class="col-xs-12 col-sm-6 six" :class="[hide_headers.kpi ? 'col-lg-4' : 'col-lg-3']">
                <h5 class="text-subhead printden visible-lg-block" style="margin: 5px 0px; color: rgb(238, 238, 238);">Nothing</h5>
                <div v-if="hide_headers.date != true" class="col-xs-12 DandW" style="padding: 0px">
                    <li class="col-xs-6 list-group-item media v-middle sx">
                        <div class="media-body"><span class="text-subhead">{{s.dataTarget[l] +' '}}</span></div>
                    </li>
                    <li class="col-xs-6 list-group-item media v-middle">
                        <div :id="'parent'+index" class="media-body dx" :class="{'ie': isIE}">

                            <i v-if="insertObj" class="fa fa-times printden" aria-hidden="true"
                            style="position: absolute; right: 5px; color: #999;" @click="deleteObs(index)"></i>
                            <span v-if="!insertObj" class="text-subhead">{{goal.DataObiettivo}}</span>
                            <!-- <input v-else type="date" v-model="goal.DataObiettivo" @change="update(index)"> -->
                            <datepicker v-else :date="{time: goals[index].DataObiettivo}" @change="tac(index, $event)" :option="option"></datepicker>
                        </div>
                    </li>
                </div>
                <div v-if="hide_headers.weight != true" class="col-xs-12 DandW" style="padding: 0px">
                    <li class="col-xs-6 list-group-item media v-middle sx">
                        <div class="media-body"><span class="text-subhead">{{s.weight[l] +' '}}</span></div>
                    </li>
                    <li class="col-xs-6 list-group-item media v-middle" :class="{'danger': percOk == -1, 'success': percOk == 1}">
                        <div class="media-body dx">
                            <span v-if="!insertObj" class="text-subhead">{{goal.Peso}}</span>
                            <span v-else><input :id="'weight'+index" type="number" min=0 max=100 style="margin-right: 5px" :class="{'danger': percOk == -1, 'success': percOk == 1}" v-model="goal.Peso" @change="upPerc(index)"></span>
                            <span class="perc_label">%</span>
                        </div>
                    </li>
                </div>
            </div>
            <span>
                <h5 v-if="rendMineMT" class="text-headline rev col-xs-12" style="margin: 5px 0px;">{{s.revMT[l]}}</h5>
                <valutazione v-if="rendMineMT" 
                :auto="true" :final="false" :disable="disableMineMT" :note012="noteMineMT" @valChange="up( index, 0, $event)" :obj="valutazioni[index][0]"></valutazione>
                <valutazione v-if="rendValMT" 
                :auto="false" :final="false" :disable="disableValMT" :note012="noteValMT" @valChange="up( index, 1, $event)" :obj="valutazioni[index][1]"></valutazione>
                <h5 v-if="rendMineF" class="text-headline rev col-xs-12" style="margin: 5px 0px;">{{s.revF[l]}}</h5>
                <valutazione v-if="rendMineF" 
                :auto="true" :final="true" :disable="disableMineF" :note012="noteMineF" @valChange="up( index, 2, $event)" :obj="valutazioni[index][2]"></valutazione>
                <valutazione v-if="rendValF" 
                :auto="false" :final="true" :disable="disableValF" :note012="noteValF" @valChange="up( index, 3, $event)" :obj="valutazioni[index][3]"></valutazione>
            </span>
        </div>
    </div>
    </div>
</template>
<script>
import valutazione from './h-valutazione.vue'
import datepicker from 'vue-datepicker'

export default {
    mounted: function() {
        this.$nextTick(function() {
            this.init();
            this.$nextTick(function() {
                for (var i = 0; i < this.goals.length; i++) {
                    var selector = "#parent" + i + " input";
                    this.attach(i);
                }
            });
            try{
                this.hide_headers.kpi = this.$parent.permessi.Hide_Kpi;
                this.hide_headers.date = this.$parent.permessi.Hide_Date;
                this.hide_headers.weight = this.$parent.permessi.Hide_Weight;
            } catch(err) { console.log(err); }
        })
        console.log(this.$parent.permessi)
    },
    props: {
        valutatore: Boolean,
        stato: Number
    },
    data: function() {
        return {
            s: this.$parent.strings,
            l: this.$parent.itaEng01,
            admin: this.$parent.admin,

            insertObj: false,
            showVal: false,
            disableVal: false,
            insertNote: false,
            mt: false,
            finale: false,

            individuali: this.$parent.goalInd,
            goals: [],
            valutazioni: [],
            ready: false,

            //DATEPICKER OPTIONS
            option: {
                type: 'day',
                week: [],
                month: [],
                format: 'YYYY-MM-DD',
                placeholder: 'Nessuna',
                inputStyle: {
                    'text-align': 'center',
                    'display': 'inline-block',
                    'line-height': '22px',
                    'font-size': '13px',
                    'border': '#fff',
                    'border-radius': '2px',
                    'color': '#5F5F5F'
                },
                color: {
                    header: '#42a5f5',
                    headerText: '#ffffff'
                },
                buttons: {
                    ok: 'Ok',
                    cancel: 'Cancel'
                },
                overlayOpacity: 0.5, // 0.5 as default
                dismissible: true // as true as default
            },
            isIE: /*@cc_on!@*/ false || !!document.documentMode,

            percOk: 0,

            ctrArray: [],
            hide_headers : {}
        }
    },
    components: {
        valutazione,
        datepicker
    },
    watch: {},
    methods: {
        // TODO get status from parent
        deleteObs: function(index){
            if(this.goals[index].DataObiettivo != null && this.goals[index].DataObiettivo != "Nessuna"){
                this.goals[index].DataObiettivo = null;
                this.update(index, false);
                var selector = "#parent" + index + " input";
                $(selector).val("Nessuna")
            }
        },
        activateGoal: function(goal){
            if(this.$parent.stato == 4 || (goal.NoteObiettivo && goal.NoteObiettivo.trim() != "")){
                return true;
            }
            return false;
        },
        getOStrings: function() {
            this.option.month = [this.s.months[0][this.l], this.s.months[1][this.l], this.s.months[2][this.l], this.s.months[3][this.l], this.s.months[4][this.l], this.s.months[5][this.l], this.s.months[6][this.l], this.s.months[7][this.l], this.s.months[8][this.l], this.s.months[9][this.l], this.s.months[10][this.l], this.s.months[11][this.l]];
            this.option.week = [this.s.week[0][this.l], this.s.week[1][this.l], this.s.week[2][this.l], this.s.week[3][this.l], this.s.week[4][this.l], this.s.week[5][this.l], this.s.week[6][this.l]];
            this.option.buttons.cancel = this.s.annulla[this.l];
        },
        attach: function(index) {
            var selector = "#parent" + index + " input";
            $(selector).val(this.goals[index].DataObiettivo)
            var g = this.goals
            $(selector).on("blur", function() {
                if ($(selector).val() === "") {
                    $(selector).val(g[index].DataObiettivo);
                }
            })
            $(selector).on("focus", function() {
                if ($(selector).val() === "") {
                    $(selector).val(g[index].DataObiettivo);
                }
            })
        },
        init: function() {
            this.ctrArray = [];
            this.getOStrings();
            this.goals = this.goals.concat(this.individuali);
            console.log(this.$parent)

            for (var i = 0; i < this.goals.length; i++) {
                if (this.goals[i].DataObiettivo == null) {
                    this.goals[i].DataObiettivo = 'Nessuna';
                }
                if (this.goals[i].Peso == null) {
                    this.goals[i].Peso = 0;
                }
                var obj = {active: false};

                var p = this.$parent.permessi;

                try {
                    if( (p.showEveryEditable) || 
                        (this.goals[i].NoteObiettivo &&  this.goals[i].NoteObiettivo.trim() != "") ||
                        (this.goals[i].DescrizioneIndicatore &&  this.goals[i].DescrizioneIndicatore.trim() != "")){
                        obj.active = true;
                    }
                } catch(err) {
                    console.log("Caught Error in h-indiv. init(): show which editables")
                    console.log("err")
                }
                this.ctrArray.push(obj);
            }
            var some = false;
            for(var i = 0; i < this.ctrArray.length; i++ ){
                if(this.ctrArray[i].active){
                    some = true;
                    break;
                }
            }
            
            this.insertObj = p.IntestazioneObbiettivi == "mod";

            if (this.stato > 5 || this.admin) {
              
                for (var i = 0; i < this.goals.length; i++) {
                    try {
                        var d = new Date(this.goals[i].DataObiettivo);
                        if (d == "Invalid Date") {
                            this.goals[i].DataObiettivo = "Nessuna";
                        } else {
                            this.goals[i].DataObiettivo = d.toLocaleDateString();
                        }

                    } catch (err) {
                        this.goals[i].DataObiettivo = "Nessuna";
                    }

                    this.valutazioni.push([{
                        valutazione: this.goals[i].AutoValutazioneIntermedia,
                        commento: this.goals[i].CommentiIntermediValutato,
                        nota: this.goals[i].NoteIntermedieValutato
                    }, {
                        valutazione: this.goals[i].ValutazioneIntermedia,
                        commento: this.goals[i].CommentiIntermediValutatore,
                        nota: this.goals[i].NoteIntermedieValutatore
                    }, {
                        valutazione: this.goals[i].AutoValutazioneFinale,
                        commento: this.goals[i].CommentiFinaliValutato,
                        nota: this.goals[i].NoteFinaliValutato
                    }, {
                        valutazione: this.goals[i].ValutazioneFinale,
                        commento: this.goals[i].CommentiFinaliValutatore,
                        nota: this.goals[i].NoteFinaliValutatore
                    }]);
                }
            }

            this.ready = true;

            if(!some){
                this.ready = false;
            }
        },
        up: function(o, ind, $event) {
            switch (ind) {
                // 0 e 1 non si scatenano se MT non è mai abilitato
                case 0:
                    this.goals[o].AutoValutazioneIntermedia = $event.obj.valutazione;
                    this.goals[o].CommentiIntermediValutato = $event.obj.commento;
                    this.goals[o].NoteIntermedieValutato = $event.obj.nota;
                    break;
                case 1:
                    this.goals[o].ValutazioneIntermedia = $event.obj.valutazione;
                    this.goals[o].CommentiIntermediValutatore = $event.obj.commento;
                    this.goals[o].NoteIntermedieValutatore = $event.obj.nota;
                    break;
                case 2:
                    this.goals[o].AutoValutazioneFinale = $event.obj.valutazione;
                    this.goals[o].CommentiFinaliValutato = $event.obj.commento;
                    this.goals[o].NoteFinaliValutato = $event.obj.nota;
                    break;
                case 3:
                    this.goals[o].ValutazioneFinale = $event.obj.valutazione;
                    this.goals[o].CommentiFinaliValutatore = $event.obj.commento;
                    this.goals[o].NoteFinaliValutatore = $event.obj.nota;
                    break;
                default:
                    console.log('no obb. matched');
            }

            this.update(o, $event.isVal);
        },
        tac(index, $event) {
            this.goals[index].DataObiettivo = $event;
            this.update(index, false);
        },
        checkPerc() {
            var s = 0;
            for (var i = 0; i < this.goals.length; i++) {
                s += this.goals[i].Peso;
            }
            if (s === 100) {
                this.percOk = 1;
            } else {
                this.percOk = -1;
            }
        },
        upPerc(index) {
            var val = this.goals[index].Peso;

            if (val < 0 || val > 100) {
                this.goals[index].Peso = 0;
                var selector = "#weight" + index;
                $(selector).val(0)
            } else {
                this.checkPerc();
            }
            this.update(index);
        },
        update: function(index, isVal) {
            this.$emit('indChange', {
                obj: this.goals[index],
                index: index,
                isVal: isVal
            });
        }
    },
    computed: {
        disableMineMT: function() {
            return this.$parent.disableMineMT;
        },
        disableValMT: function() {
            return this.$parent.disableValMT;
        },
        disableMineF: function() {
            return this.$parent.disableMineF;
        },
        disableValF: function() {
            return this.$parent.disableValF;
        },
        noteMineMT: function() {
            return this.$parent.noteMineMT;
        },
        noteValMT: function() {
            return this.$parent.noteValMT;
        },
        noteMineF: function() {
            return this.$parent.noteMineF;
        },
        noteValF: function() {
            return this.$parent.noteValF;
        },
        rendMineMT: function() {
            return this.$parent.rendMineMT;
        },
        rendValMT: function() {
            return this.$parent.rendValMT;
        },
        rendMineF: function() {
            return this.$parent.rendMineF;
        },
        rendValF: function() {
            return this.$parent.rendValF;
        }
    }
}
</script>
<style scoped>
.side-0 {
    padding-right: 10px;
}

.obb {
    padding: 5px 0px 5px 5px;
    border-color: rgb(238, 238, 238);
    min-height: 75px;
    margin-bottom: 10px;
}

.texa {
    width: 100%;
    padding: 5px 10px;
    /* border-right-width: 10px; */
    border-color: rgb(238, 238, 238);
}

.dx {
    text-align: right;
}

.sx {
    color: white;
    background-color: #888;
    /*
    background-color: #42a5f5;
    */
}

.DandW .text-subhead {
    font-size: inherit;
}

.DandW .list-group-item {
    padding: 5px;
    margin-bottom: 5px
}

input {
    width: 100%;
    height: 23px;
    box-sizing: border-box;
    border-width: 0px;
    border-color: darkgray;
    border-radius: 3px;
    text-align: right;
}

input[type="number"] {
    width: 85%;
}

input:focus {
    border-width: 1px;
}

.rev {
    padding: 0px;
}

.goal {
    padding: 0px;
    padding-bottom: 10px;
    padding-top: 10px;
    background-color: rgb(238, 238, 238);
    border-bottom: 1px solid #999;
}

.goal-end {
    padding: 0px;
    padding-top: 10px;
    background-color: rgb(238, 238, 238);
}

textarea {
    resize: vertical;
}

.success {
    background-color: #dff0d8;
    border-color: #d6e9c6;
}

.success span {
    color: #3c763d;
}

.danger {
    background-color: #f2dede;
    border-color: #ebccd1;
}

.danger span {
    color: #a94442;
}
</style>
<style>
.cov-date-body {
    font-family: 'Roboto', 'Helvetica Neue', Helvetica, Arial !important;
    font-weight: 100 !important;
    display: inline-block !important;
    border-width: 10px;
    border-style: solid;
    border-color: rgba(0, 0, 0, 0.5);
}

.day.checked {
    background-color: #888 !important;
}

.ie .datepicker-overlay {
    top: auto !important;
    left: auto !important;
}

.datepickbox > input {
    text-align: right;
}
</style>
