<template>
<div class="jqx_grid_wrapper">
    <div v-if="title != null" v-html="title"></div>
    <div :id="name"></div>
</div>
</template>
<script>
import {localizationMixin} from './localization.js'


    export default {
        mounted: function(){
            var vm = this;
            this.grid_configs.localization = this.getLocalization(this.lang);

            this.overrideGridConfigs();
            this.parseColumns();
            this.initSource();
            this.grid = $("#"+this.name);
            $("#content").resize(function() {
                //chiamo la funzione di refresh per fixare il bug di resize della grid
               vm.grid.jqxGrid('refresh');
            });
            //return filter API as event parameter
            this.$emit('API', {applyFilter: this.filterCommand, removeFilter: this.removeFilterCommand, redraw: this.forcedRedraw});
        },
        mixins: [localizationMixin],
        props: {
            name: String,
            source: Array,
            columns: Array,
            //options configurabili: tutte le PROPERTIES (meno source e columns) definite per JQWGrid (https://www.jqwidgets.com/jquery-widgets-documentation/documentation/jqxgrid/jquery-grid-api.htm?search=)
            options: Object,
            lang: {
				type: String,
	            default: "en"
	        },
            sortby: String,
            title: String,
            others: {
                type: Object,
                default: function(){
                    return {}
                }
            }
        },
        watch: {
            options: function(){
                 this.overrideGridConfigs();
            },
            source: function(){
                this.sorgente.localdata = this.source;
                this.grid.jqxGrid('updatebounddata');
            }
        },
        data: function(){
            return {
                grid_configs: {
                    columnsresize: true,
                    rowsheight: 32,
                    rowdetails: false,
                    theme: 'glacier',
                    width: '100%',
                    selectionmode: 'singlerow',
                    pageable: true,
                    showfilterrow: true,
                    filterable: true,
                    sortable: true,
                    autoheight: true,
                    rowdetailstemplate: {
                        rowdetails: "<div style='margin: 10px 10px 10px 0px;'>Override this</div>",
                        rowdetailsheight: 100
                    },
                    initrowdetails: null
                },
                sorgente: null,
                mappedColumns: [],
                datafields: [],
                grid: null
            }
        },
        methods: {
            overrideGridConfigs: function(){
                if(this.options != null){
                    for (var prop in this.options){
                        this.grid_configs[prop] = this.options[prop];
                    }
                }
                if(this.grid_configs.pagesize == "auto"){
                    this.getRowXPage();
                }
                //console.log("grid and cols configuration")
                //console.log(this.grid_configs);
            },
            parseColumns: function(){
                this.mappedColumns = this.columns.filter(function(obj){
                    return obj.hidden != true;
                });
                this.datafields = []
                var vm = this;
                //mapping columns infos
                for(var i = 0; i < this.mappedColumns.length; i++){
                    //building datafields
                    this.datafields.push({name: this.mappedColumns[i].datafield, type: this.mappedColumns[i].type})
                    //building cellsrenderers
                    if(this.mappedColumns[i].tobecellsrenderered != null){
                        //uso let, altrimenti custom renderer viene sovrascritto quando renderizzato
                        let customRenderer = this.mappedColumns[i].tobecellsrenderered;
                        this.mappedColumns[i].cellsrenderer = function(row, columnfield, value, defaulthtml, columnproperties){
                            return customRenderer(vm.source[row], row, columnfield, value, defaulthtml, columnproperties);
                        }
                    }
                }
                if(this.others.adaptColumns){
                    this.columnsWidthAdjust();
                }
            },
            columnsWidthAdjust: function(){
                var covered = 0;
                //calcolo la percentuale coperta con le colonne visibili
                for(var i = 0; i < this.mappedColumns.length; i++){
                    if(this.mappedColumns[i].hidden != true){
                        try {
                            var n = Number(this.mappedColumns[i].width.split('%')[0]);
                            covered += n;
                        } catch(err) {}
                    }
                }
                // se sono da ricalcolare le percentuali (covered != 100), calcolo le proporzioni
                if(covered != 100 && covered != 0){
                    var covering = 0;
                    // tengo una variabile per non avere problemi d'arrotandomento
                    for(var i = 0; i < this.mappedColumns.length - 1; i++){
                        if(this.mappedColumns[i].hidden != true){
                            try {
                                var n = Number(this.mappedColumns[i].width.split('%')[0]);
                                var perc = Math.floor(n*100/covered);
                                covering += perc;
                                this.mappedColumns[i].width = perc + "%";
                            } catch(err) {}
                        }
                    }
                    this.mappedColumns[i].width = (100 - covering) + "%";
                }
                
            },
            initSource: function(){
                this.sorgente = {
                    localdata: this.source,
                    datatype: "array",
                    datafields: this.datafields
                }
                //console.log(this.datafields);
                this.$nextTick(function(){
                    this.draw();
                });
            },
            draw: function(){
                var dataAdapter = new $.jqx.dataAdapter(this.sorgente);
                this.grid_configs.source = dataAdapter;
                this.grid_configs.columns = this.mappedColumns;
                this.grid.jqxGrid(this.grid_configs);
                this.$nextTick(function(){
                    if(this.sortby){
                        var s = this.sortby.split(';')
                        this.grid.jqxGrid("sortby", s[0], s[1]);
                    }
                    this.$emit("ready")
                    this.eventPropagation()
                })
            },
            filterCommand: function(datafield, AndOperator, filtervalue){
                var filtergroup = new $.jqx.filter();
                var filter_or_operator = AndOperator ? 0 : 1;
                var filtercondition = 'contains';
                var filter1 = filtergroup.createfilter('stringfilter', filtervalue, filtercondition);            
                filtergroup.addfilter(filter_or_operator, filter1);
                // add the filters.
                this.grid.jqxGrid('addfilter', datafield, filtergroup);
                // apply the filters.
                this.grid.jqxGrid('applyfilters');
            },
            removeFilterCommand: function(){
                this.grid.jqxGrid('clearfilters');
            },
            getRowXPage: function() {
                var available = window.innerHeight;
                if (this.grid_configs.showheader) {
                    available -= (this.grid_configs.columnsheight * 2);
                    if (this.grid_configs.filterable && this.grid_configs.showfilterrow) {
                        available -= this.grid_configs.filterrowheight;
                    }
                }
                
                if(this.others.offsetPageCalculation){
                    available -= this.others.offsetPageCalculation;
                }
                //20px come margine di errore
                available -= 20;
                //if rowsheight is fixed, / rowsheight
                var rows_x_page = Math.floor(available / this.grid_configs.rowsheight);
                this.grid_configs.pagesize = rows_x_page;
                var opts = [rows_x_page, 5, 10 , 20];
                this.grid_configs.pagesizeoptions = opts.sort(function(a,b){
                    return a - b;
                });
            },
            forcedRedraw: function() {
                //metodo per forzare l'aggiornamento, nei caso il cambiamento dei dat sorgenti non venga identificato dal componente 
                this.sorgente.localdata = this.source;
                this.grid.jqxGrid('updatebounddata');
                this.grid.jqxGrid('clearselection');
            },
            eventPropagation: function(){
                var vm = this;
                // da inserire man mano gli eventi che si vuole intercettare nella sopra classe
                this.grid.on('rowselect', function (event) {
                    vm.$emit('jqxGridEvent', {name: 'rowselect', event: event});
                });

                this.grid.on('cellendedit', function (event) {
                    // inoltro l'evento di cell edit
                    // delego al componente padre di eseguire il mapping delle modifiche, in quanto non posso sapere a priori la relazione fra tipo dato iniziale e quello dichiarato nella configurazione colonne
                    // a monte potrebbe essere necessario eseguire uno switch su 'event.datafield' e mappare caso per caso
                    vm.$emit('jqxGridEvent', {name: 'cellendedit', event: event});
                });

                this.grid.on('cellclick', function (event) {
                    // inoltro l'evento di cell click per controllare l'edit programmatico
                    vm.$emit('jqxGridEvent', {name: 'cellclick', event: event});
                });

                 this.grid.on('pagechanged', function (event) {
                    // inoltro l'evento di cell click per controllare l'edit programmatico
                    vm.$emit('jqxGridEvent', {name: 'pagechanged', event: event});
                });
            }
        }
    }
</script>
<style>

</style>