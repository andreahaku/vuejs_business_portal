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
            this.overrideGridConfigs();
            this.parseColumns();
            this.initSource();

            $("#content").resize(function() {
                //chiamo la funzione di refresh per fixare il bug di resize della grid
                $('#'+vm.name).jqxGrid('refresh');
            });
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
            title: String
        },
        watch: {
            options: function(){
                 this.overrideGridConfigs();
            },
            source: function(){
                this.sorgente.localdata = this.source;
                 $('#'+this.name).jqxGrid('updatebounddata');
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
                    selectionmode: 'singlerow ',
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
                datafields: []
            }
        },
        methods: {
            overrideGridConfigs: function(){
                if(this.options != null){
                    for (var prop in this.options){
                        this.grid_configs[prop] = this.options[prop];
                    }
                }
            },
            parseColumns: function(){
                this.mappedColumns = this.columns.slice();
                this.datafields = []
                var vm = this;
                //mapping columns infos
                for(var i = 0; i < this.columns.length; i++){
                    //building datafields
                    this.datafields.push({name: this.columns[i].datafield, type: this.columns[i].type})
                    //building cellsrenderers
                    if(this.columns[i].tobecellsrenderered != null){
                        //uso let, altrimenti custom renderer viene sovrascritto quando renderizzato
                        let customRenderer = this.columns[i].tobecellsrenderered;
                        this.mappedColumns[i].cellsrenderer = function(row, columnfield, value, defaulthtml, columnproperties){
                            return customRenderer(vm.source[row], row, columnfield, value, defaulthtml, columnproperties);
                        }
                    }
                }
            },
            initSource: function(){
                this.sorgente = {
                    localdata: this.source,
                    datatype: "array",
                    datafields: this.datafields
                }
                console.log(this.datafields);
                this.$nextTick(function(){
                    this.draw();
                });
            },
            draw: function(){
                var dataAdapter = new $.jqx.dataAdapter(this.sorgente);
                this.grid_configs.source = dataAdapter;
                this.grid_configs.columns = this.mappedColumns;
                this.grid_configs.localization = this.getLocalization(this.lang);
                $('#'+this.name).jqxGrid(this.grid_configs);
                this.$nextTick(function(){
                    if(this.sortby){
                        var s = this.sortby.split(';')
                        $('#'+this.name).jqxGrid("sortby", s[0], s[1]);
                    }
                })
            }
        }
    }
</script>
<style>

</style>