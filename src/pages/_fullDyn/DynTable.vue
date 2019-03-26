<template>
<div v-if="ready" class="box row table-color" style="margin: 0px 0px 20px 0px">
    <div v-if="!noHead" class="box-header col-xs-6">
        <h3 class="box-title">{{title}}</h3>
    </div>
     <div v-if="searchable.length > 0 && !noHead" class="col-xs-6" style="padding: 15px 15px 0px 15px">
        <div class="dataTables_filter">
            <label>Cerca: <input type="search" class="form-control input-sm" aria-controls="example1" v-model="filter"></label>
        </div>
    </div>
    <!-- /.box-header -->
    <div class="box-body">
    <div class="dataTables_wrapper form-inline dt-bootstrap" id="example1_wrapper">
        <div class="row">
            <div class="col-xs-6">
                <div id="example1_length" class="dataTables_length"></div>
            </div>
        </div>

        <div class="row">
        <div class="col-xs-12 table-responsive" style="margin-bottom: 0px;">
            <table :aria-describedby="configs.ID" role="grid" :id="configs.ID" class="table table-bordered table-striped dataTable" :style="tableCss">

            <thead>
                <tr role="row">
                <th :key="h.name" v-if="h.visible" v-for="h in header" :style="'width:'+ h.width +'%'" class="sorting" :class="{'xs': $root.xs}" 
                aria-controls="example1" rowspan="1"
                @click="sortBy(h.prop)" >{{h.name}}</th>
                </tr>
            </thead>

            <tbody>
                <tr :key="index" v-for="(iter, index) in iterable" class="even" role="row" 
                :class="{'active': iter == highlighted}" style="cursor: pointer"
                @click="rowClicked(iter)">
                    <td :key="h.name" v-if="h.visible" v-for="h in header">{{iter[h.prop]}}</td>
                </tr>
            </tbody>

            </table>
        </div>
        <div v-if="!iterable || iterable.length == 0" class="col-sm-12">
            <div class="list-group-item table-color">{{nothing_found}}</div>
        </div>
        </div>
    </div>
    <!-- /.box-body -->
    </div>
</div>
</template>

<script>

export default {
    name: 'Tables',
    props: {
        array: {
            type: Array,
            default: function() {
                return []
            }
        },
        // funzione da eseguire all'onclick della riga, di default: evidenzia la selezione
        rowClicked: {
            type: Function,
            default(option) {
                if(this.highlighted == option){
                    this.highlighted = {}
                } else {
                    this.highlighted = option;
                }
            }
        },
        // il nome del'oggetto colonna (def - "prima" e "seconda"), deve coincidere con il nome della proprietà dell'array da visualizzare
        configs: {
          type: Object,
          default: function () {
            return { 
                title: "Default Table",
                visible: true,
                columns: {
                    ID: {
                        name: "0",
                        position: 1,
                        visible: true,
                        editable: false,
                        width: 35
                    },
                    Descrizione: {
                        name: "Zero",
                        position: 2,
                        visible: true,
                        editable: false,
                        width: 65
                    }
                }
             }
          }
        },
        //Stringa da mostrare quando la ricerca non restituisce risultati
        nothing_found: {
            type: String,
            default: "Nessun risultato corrispondente ai parametri di ricerca"
        },
        tableCss: {
            type: Object
        },
        noHead: {
            type: Boolean,
            default: false
        }
    },
    mounted: function() {
        this.$nextTick(() => {
            this.merged_c = this.configs;
            this.title = this.configs.title

            for(var prop in this.merged_c.columns){
                var obj = this.merged_c.columns[prop];
                
                obj.prop = prop;
                this.header.push(obj);
            }
            this.header.sort(function(a,b){
                return a.position - b.position;
            })
            this.iterable = this.array.slice();

            for(var i = 0; i < this.header.length; i++){
                if(this.header[i].visible && this.header[i].searchable){
                    this.searchable.push({name: this.header[i].name, prop: this.header[i].prop});
                }
            }
            // END FETCHING FROM CONFIGS
            this.ready = true;
        })
    },
    data: function(){
        return {
            title: '',
            iterable: [],
            header: [],
            ready: false,
            sortingBy: '',
            desc: false,
            filter: '',
            highlighted: {},

            //proprietà per cui è possibile filtrare
            searchable: []
        }
    },
    watch: {
        array: function(){
            this.iterable = this.array;
            console.log("array changed");
        },
        filter: function(){
            this.filterTableRows();
        }
    },
    methods: {
        sortBy: function(param){
            if(this.sortingBy == param){ this.desc = !this.desc; } else { this.desc = false;}
            this.sortingBy = param;

            var sort_function;
            if(this.iterable.length > 0){
                if(isNaN(this.iterable[0][param])){
                    if(!this.desc){
                        sort_function = function(a,b){
                            return a[param] < b[param] ? -1 : 1;
                        }
                    } else {
                        sort_function = function(a,b){
                            return a[param] > b[param] ? -1 : 1;
                        }
                    }
                } else {
                    if(!this.desc){
                        sort_function = function(a,b){
                            return a[param] - b[param];
                        }
                    } else {
                        sort_function = function(a,b){
                            return b[param] - a[param];
                        }
                    }
                }
            }
            this.iterable.sort(sort_function);
        },
        filterTableRows: function(){
            if(this.filter == null || this.filter.trim() == ""){
                this.iterable = this.array.slice();
            } else {
                var vm = this;
                var f = this.filter.toLowerCase();
                //rendo l'istanza di vue js visibile all'interno della funzione anonima
                
                this.iterable = this.array.filter(function(row){
                    for(var i = 0; i < vm.searchable.length; i++){
                        var obj = vm.searchable[i]
                        try{
                            if(row[obj.prop].toString().toLowerCase().includes(f)){
                                return true;
                            }
                        } catch(err){ console.log(err); }
                    }
                    return false;
                })
                
            }
        }
    }
}

</script>

<style scoped>
    .row {
        margin: 0px;
    }
    .col-xs-12 {
        padding: 0px;
    }
</style>

<style>
/* Using the bootstrap style, but overriding the font to not draw in
   the Glyphicons Halflings font as an additional requirement for sorting icons.

   An alternative to the solution active below is to use the jquery style
   which uses images, but the color on the images does not match adminlte.

@import url('/static/js/plugins/datatables/jquery.dataTables.min.css');
*/

@import url('/static/js/plugins/datatables/dataTables.bootstrap.css');

table.dataTable thead .sorting:after,
table.dataTable thead .sorting_asc:after,
table.dataTable thead .sorting_desc:after {
  font-family: 'FontAwesome';
}

table.dataTable thead .sorting:after {
  content: "\f0dc";
}

table.dataTable thead .sorting_asc:after {
  content: "\f0dd";
}

table.dataTable thead .sorting_desc:after {
  content: "\f0de";
}
</style>
<style scoped>
.list-group-item {
    padding: 5px 15px;
    text-align: center;
}
</style>

<style scoped>
    tr {
        background-color: white;
    }
    tr.active {
        background-color: #42a5f5;
        color: white;
    }
    tr.active > td {
        background-color: #42a5f5 !important;
        color: white;
    }
    th::after {
        float: right;
    }
    th.xs::after {
        display: none;
    }
</style>