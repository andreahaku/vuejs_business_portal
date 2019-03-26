<template>
    <div class="st-pusher" id="content">
        <div class="st-content">
            <div class="st-content-inner padding-none">
                <div class="container-fluid">
                    <br>
                    <div class="row">
                        <div class="item col-xs-12 col-md-4">
                            <div class="row">
                                <div class="col-xs-12">
                                    <h4 class="text-headline margin-none">Bilancio CSR <span class="badge">{{indici.length}}</span></h4>
                                    <p class="text-subhead text-light">Attività di tua competenza</p>
                                </div>
                                <div class="col-xs-12">
                                	<ul class="nav nav-tabs">
									  <li :class="{'active': active_tab == 0}" style="width: 34%; text-align: center;"><a href="#" @click.prevent="filter(null)" style="font-size: smaller">TUTTI</a></li>
									  <li :class="{'active': active_tab == 1}" style="width: 33%; text-align: center;"><a href="#" @click.prevent="filter(true)" style="font-size: smaller">DA FARE</a></li>
									  <li :class="{'active': active_tab == 2}" style="width: 33%; text-align: center;"><a href="#" @click.prevent="filter(false)" style="font-size: smaller">IN ATTESA</a></li>
									</ul>
                                    <div class="panel panel-default paper-shadow animated" data-z="0.5" 
                                    style="overflow-y: auto; margin: 0px">
                                        <div>
                                            <ul v-if="indici.length > 0" class="list-group" style="margin: 0px;">
                                            	<list-index v-for="item in displayindici" :item="item" @openDetail="open_detail"></list-index>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <paginazione v-if="ready" :array="indici" limit="6" @displayChanged="dispatchedPagination($event)" :bottom="true">
                   				</paginazione>
                            </div>
                        </div>
                        <div class="item col-md-8 hidden-xs hidden-sm">
                        	<detail :item="detailProp"></detail>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import detail from './detail.vue'
import listIndex from './list-index.vue'
import paginazione from '../components/paginazione.vue'

	export default {
		components: {
			detail,
			listIndex,
			paginazione
		},
		mounted: function(){
			this.indiciCollection = this.$store.getters.getIndici;
			this.data_copy = this.indiciCollection.data;
			this.initIndexes();
		},
		data: function(){
			return {
				indiciCollection: null,
				indici: [],
				displayindici: [],
				data_copy: [],
				active: null,
				active_tab: 0,
				ready: false,
				// LEGENDA PERMESSI
				// RUOLO : { STATO : ACTION, ... }
				permessi: {
					//compilatore
					1: {
						//"da compilare": true,
						1: 0,
						//"da approvare": false,
						2: 3,
						//"da validare": false,
						3: 3,
						//"validato": false
						4: 3
					},
					//approvatore
					2: {
						//"da approvare": false,
						2: 1,
						//"da validare": false,
						3: 3,
						//"validato": false
						4: 3
					},
					//validatore
					3: {
						//"da approvare": false,
						2: 3,
						//"da validare": false,
						3: 2,
						//"validato": false
						4: 3
					}
				},
				actions: { 
					0 : {id: 0, nome: "compila", class: "btn-primary"},
					1 : {id: 1, nome: "approva", class: "btn-warning"},
					2 : {id: 2, nome: "valida", class: "btn-validate"},
					3 : {id: 3, nome: "vedi", class: "btn-default"}
				},
				//action Object nello stato di validazione
				alternative: {id: 3, nome: "vedi", class: "btn-success"},

				detailProp: null
			}
		},
		methods: {
			open_detail: function($event){
				if(window.innerWidth < 992) {
					if($event.idIndice != null){
						this.$router.push({
		                    name: 'detail',
		                    params: {
		                        idindice: $event.idIndice
		                    }
                		});
	                }
				} else {
					this.detailProp = $event
				}
			},
			initIndexes: function(){
				this.indici = [];
				var updated_copy = [];
				for(var i = 0; i < this.data_copy.length; i++){
					var ret = this.elabIndex(this.data_copy[i]);
					if(ret != null) {
						updated_copy.push(ret)
					}
				}
				this.data_copy = updated_copy;
				this.indici = this.data_copy.slice();
				this.ready = true;
			},
			elabIndex: function(item){
				var object_action;
				try {
					object_action = this.permessi[item.ruolo.id][item.stato.id];

					if(object_action != null){
						object_action = this.actions[object_action];

						if(object_action.id == 3 && item.stato.id == 4){
							item.action = this.alternative;
						} else {
							item.action = object_action;
						}
						item.todo = item.action.id != 3;

						return item;
					}
				} catch(err) {
					console.log(err);
				}
				return null;
			},
			filter: function(what){
				if(what == null){this.active_tab = 0}
				else if(what){this.active_tab = 1}
				else {this.active_tab = 2}

				if(what != null) {
					this.indici = this.data_copy.filter(function(obj){
						if(what == false && obj.stato.id == 4){
							return false;
						}
						return obj.todo == what;
					})
				} else {
					this.indici = this.data_copy.slice();
				}
			},
			dispatchedPagination: function(toDisplay) {
            	this.displayindici = toDisplay;
        	}
		}
	}
</script>
<style scoped>
	.nav-tabs li.active > a {
		background-color: #42a5f5;
		color: white;
	}
	.nav-tabs li:hover {
		cursor: pointer;
	}
</style>