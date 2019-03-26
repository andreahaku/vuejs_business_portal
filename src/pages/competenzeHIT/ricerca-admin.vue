<template>
    <div>
        <div>
            <h4 class="text-headline margin-none">{{s.admV[l]}}</h4>
            <p class="text-subhead text-light">{{s.admS[l]}}</p>
        </div>
        <div class="panel panel-default animated fadeIn">
            <div class="panel-body  padding-bottom-none">
                <div class="row">
                    <div style="float: right;">
                        <a href="#" @click.prevent="filtra()" class="btn btn-sm btn-primary paper-shadow relative" data-z="0.5" data-hover-z="1" style="margin-right: 10px;">{{s.cerca[l]}}</a>
                    </div>
                    <div class="col-xs-10 col-sm-5">
                        <div class="form-group form-control-material">
                            <input id="search_cognome" type="text" class="form-control" :placeholder="s.cognomePlace[l]" @blur="filterOut_cognome()" v-model="filtro.cognome" />
                            <label for="search_cognome" :class="{condati: labelout_cognome}">{{s.cognomeForm[l]}}</label>
                        </div>
                    </div>
                    <div class="col-xs-12 col-sm-5">
                        <div class="form-group form-control-material">
                            <input id="search_nome" type="text" class="form-control" :placeholder="s.nomePlace[l]" @blur="filterOut_nome()" v-model="filtro.nome" />
                            <label for="search_nome" :class="{condati: labelout_nome}">{{s.nomeForm[l]}}</label>
                        </div>
                    </div>
                    <div class="col-xs-12">
                        <div class="form-group form-control-material">
                            <input id="search_responsabile" type="text" class="form-control" :placeholder="s.responsabilePlace[l].toLowerCase()" @blur="filterOut_responsabile()" v-model="filtro.responsabile" />
                            <label for="search_responsabile" :class="{condati: labelout_responsabile}">{{s.responsabileForm[l]}}</label>
                        </div>
                    </div>
                    <div class="col-xs-12" style="margin-top: 0px;" v-if="listaFunzioni.length > 0">
                        <div class="dropdown" style="padding-top: 0px;">
                            <button class="btn btn-default btn-filtro" type="button" id="dropdownFunz" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                <span style="padding-left: 5px;">{{s.funzione[l]}}: 
                                <span>{{activeRole}}</span></span><span class="caret" style="margin: 0px 10px 0px 5px;"></span></button>
                            <ul class="dropdown-menu" aria-labelledby="dropdownFunz">
                                <li v-for="(f, i) in listaFunzioni" :class="{'active': filtro.funzione==f.id}"><a href="#" @click="filtro.funzione=f.id">{{f.ruolo}}</a></li>
                            </ul>
                        </div>
                    </div>
                    <div class="col-xs-12" style="margin-top: 0px;">
                        <div class="dropdown" style="padding-top: 0px;">
                            <button class="btn btn-default btn-filtro" type="button" id="dropdownFunz" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                <span style="padding-left: 5px;">{{s.stato[l]}}: <span> {{selectedStatus}} </span></span><span class="caret" style="margin: 0px 10px 0px 5px;"></span></button>
                            <ul class="dropdown-menu" aria-labelledby="dropdownFunz">
                                <li :class="{'active': filtro.stato==0}"><a href="#" @click="filtro.stato=0">{{s.qualsiasi[l]}}</a></li>
                                <li v-for="s in listaStati" :class="{'active': filtro.stato==s.stato}"><a href="#" @click="filtro.stato=s.stato">{{s.descrizione}}</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <widgetEval :filtro="filtro" :flagFilter="flag"></widgetEval>
    </div>
</template>
<script>
import widgetEval from './widget-da-valutare.vue';

export default {
    mounted: function() {
        this.selectedStatus = this.s.qualsiasi[this.l]
        var vm = this;
        this.$root.getFunzioni(function(result){
            result.unshift({id: '.', ruolo: vm.s.qualsiasi[vm.l] })
            vm.listaFunzioni = result;
        })
    },
    data: function() {
        return {
            s: this.$root.getStrings(),
            l: this.$root.lang(),

            listaFunzioni: [],
            listaStati: this.$Stati,

            selectedStatus: "",
            labelout_nome: false,
            labelout_cognome: false,
            labelout_responsabile: false,

            filtro: {
                nome: '',
                cognome: '',
                responsabile: '',
                funzione: '.',
                stato: 0,
            },
            flag: false
        }
    },
    components: {
        widgetEval
    },
    watch: {
        'filtro.stato': function() {
            if (this.filtro.stato == 0) {
                this.selectedStatus = this.s.qualsiasi[this.l];
            } else {
                var vm = this;
                this.listaStati.forEach(function(s) {
                    if (vm.filtro.stato == s.stato) {
                        vm.selectedStatus = s.descrizione;
                    }
                });
            }
        }
    },
    computed: {
        activeRole: function(){
            var vm = this;
            var ind = -1;
            try{
                this.listaFunzioni.filter(function(role, index){
                    if(role.id == vm.filtro.funzione){
                        ind = index;
                        return true;
                    } 
                })
                return ind != -1 ? this.listaFunzioni[ind].ruolo : null;
            } catch(err){}
        }
    },  
    methods: {
        filterOut_nome: function() {
            if (this.filtro.nome.trim() != '') {
                this.labelout_nome = true;
            } else {
                this.labelout_nome = false;
            }
        },
        filterOut_cognome: function() {
            if (this.filtro.cognome.trim() != '') {
                this.labelout_cognome = true;
            } else {
                this.labelout_cognome = false;
            }
        },
        filterOut_responsabile: function() {
            if (this.filtro.responsabile.trim() != '') {
                this.labelout_responsabile = true;
            } else {
                this.labelout_responsabile = false;
            }
        },
        filtra() {
            this.flag = !this.flag;
        }
    }
}
</script>
<style scoped>
.condati {
    color: #42a5f5 !important;
    font-size: 1rem !important;
    top: -18px !important;
}

.dropdown-menu {
    border: 0;
    border-radius: 0;
    padding: 0;
    margin-top: 1px;
}

.dropdown-menu > li.active > a,
.dropdown-menu > li a:hover {
    background: #f5f7f7;
    color: #42a5f5;
}

.dropdown-menu > li > a,
.dropdown-menu > li > a:focus {
    padding: 8px 14px;
    border-top: 1px solid #efefef;
}

.btn-filtro {
    padding: 0px;
    margin-bottom: 10px;
    height: 38px;
    width: 100%;
    overflow-x: hidden;
}
</style>
