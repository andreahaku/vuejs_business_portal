<template>
	<div class="st-pusher" id="content">
	<div v-if="loading">
			<div class="st-content-inner padding-none">
                <div class="container-fluid">
                    <div class="page-section row">
                        <div class="media v-middle col-xs-12 col-sm-6">
                            <div class="media-body">
                                <div class="media-left">
                                    <h1 class="text-display-1 margin-none">Tutti i partecipanti</h1>
                                    <p class="text-subhead" style="margin: 0px;">Cerca tra i partecipanti</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="panel panel-primary row int_wrapper" style="margin-bottom: 5px; border-style: none; ">
                    		
                        <div class="col-xs-4 col-md-2 pad int" @click="sort_name()" style="text-align: center">Partecipante</div>
                        <div class="col-xs-4 col-md-2 pad int" @click="sort_edition()" style="text-align: center">Edizione</div>
                        <div class="col-xs-4 col-md-2 pad int" @click="sort_corso()" style="text-align: center">Corso</div>
                        <div class="col-xs-4 col-md-2 pad int" @click="sort_avanz()" style="text-align: center">Avanzamento</div>
                        <div class="col-xs-4 col-md-2 pad int" @click="sort_date()" style="text-align: center">Data Completamento</div>
                        <div class="col-xs-4 col-md-2 pad int" @click="sort_score()" style="text-align: center">Punteggio</div>

                    </div>

                    <!-- TODO add panel for edizioni length == 0-->
                    <div class="list-group-item paper-shadow animated fadeIn" data-z="0.5" style="padding: 10px 16px; border-width: 2px;">
                    	<span>Caricamento partecipanti</span>
						<clip-loader :loading="loading" :color="'rgb(93, 197, 150)'" size="12px"></clip-loader>
                    </div>
			
	                </div>
	            </div>
			
    </div>
	<div v-if="!loading" class="st-content"> 
            <div class="st-content-inner padding-none">
                <div class="container-fluid">
                    <div class="page-section row">
                        <div class="media v-middle col-xs-12 col-sm-6">
                            <div class="media-body">
                                <div class="media-left">
                                    <h1 class="text-display-1 margin-none">Tutti i partecipanti</h1>
                                    <p class="text-subhead" style="margin: 0px;">Cerca tra i partecipanti</p>
                                </div>
                            </div>
                        </div>
                        <div class="media-right col-xs-12 col-sm-6 col-md-4 col-md-offset-2 col-lg-3 col-lg-offset-3">
                            <div class="panel panel-default" style="margin: 0px;">
                                <div class="panel-body" style="padding-top: 8px; padding-bottom: 8px;">
                                    <div class="form-group form-control-material">
                                        <input id="filtraed" type="text" class="form-control" placeholder="parola nel nome" v-model="titleFilter" @blur="filterOut()" style="font-size: small;"/>
                                        <label v-show="!labelout" for="filtraed">Filtra per nome...</label>
                                    </div>
                                </div>
                            </div>
                        </div>
						<div class="container col-md-12">
							<paginazione v-if="persons.length > 0" :array="persons" limit="100" @displayChanged="dispatchedPagination" :bottom="true" pagesDisplayed="10"></paginazione>
                       	</div>
                    </div>
                    <div class="panel panel-primary row int_wrapper" style="margin-bottom: 5px; border-style: none; ">
                    		
                        <div class="col-xs-4 col-md-2 pad int" @click="sort_name()" style="text-align: center">Partecipante</div>
                        <div class="col-xs-4 col-md-2 pad int" @click="sort_edition()" style="text-align: center">Edizione</div>
                        <div class="col-xs-4 col-md-2 pad int" @click="sort_corso()" style="text-align: center">Corso</div>
                        <div class="col-xs-4 col-md-2 pad int" @click="sort_avanz()" style="text-align: center">Avanzamento</div>
                        <div class="col-xs-4 col-md-2 pad int" @click="sort_date()" style="text-align: center">Data Completamento</div>
                        <div class="col-xs-4 col-md-2 pad int" @click="sort_score()" style="text-align: center">Punteggio</div>

                    </div>

                    <!-- TODO add panel for edizioni length == 0-->
                    <div v-if="persons.length == 0" class="list-group-item paper-shadow animated fadeIn" data-z="0.5" style="padding: 10px 16px; border-width: 2px;">
                    	<span>Non ci sono partecipanti per questa edizione</span>
                    </div>
				
					<transition-group v-else name="menu" class="list-group" tag="div">
	                    <div v-for="(p, i) in displayPartecipanti" :key="p.id" class="list-group-item paper-shadow animated fadeIn" data-z="0.5" style="padding: 0px; border-width: 2px;">
							<div class="list-group-item-heading media row" style="padding: 0px 0px 0px 16px; margin: 0px;">
								<div class="media-left col-xs-4 col-sm-4 col-md-4" style="padding: 0px; padding-top: 10px; text-align: center">
									<h4><div><strong>{{p.name}}</strong></div><div id="cliente">{{p.client}}</div></h4>
								</div>
								<div class="media-left col-xs-4 col-sm-4 col-md-4" style="padding: 0px; padding-top: 10px; text-align: center">
									{{p.edition}}
								</div>
								<div class="media-left col-xs-4 col-sm-4 col-md-4" style="padding: 0px; padding-top: 10px; text-align: center">
									{{p.corso}}
								</div>
							</div>
							<hr style="margin: 5px 50px 0px 16px">
	    					<div class="list-group-item-text row" style="padding: 0px; margin: 0px">
								
								<div class="progress col-xs-8 col-md-3" style="height: 18px; margin-top: 10px; margin-bottom: 10px; padding-left: 0px; padding-right: 0px; margin-left: 50px">
									<div class="progress-bar progress-bar-info" role="progressbar" :aria-valuenow="p.percent" aria-valuemin="0" aria-valuemax="100" :style="'width:'+p.percent+'%'">{{p.percent}}%
  									</div>
								</div>

		                    	<div class="col-xs-8 col-md-4 pad" style="text-align: center; padding-left:100px">{{p.datecompl}}</div>
								<div class="col-xs-8 col-md-4 pad" style="text-align: center; padding-left:100px">{{p.score}}</div>
	    					</div>
	                    </div>
	                </transition-group>
	        	</div>
	        </div>
	    </div>
    </div>
</template>
<script>
import {
    loadTotalParticipantListMixin
} from './loadTotalParticipantListMixin.js';
import paginazione from '../components/paginazione.vue';
import ClipLoader from 'vue-spinner/src/ClipLoader.vue';

	export default {
    	mixins: [loadTotalParticipantListMixin],
		data: function(){
			return {
				displayPartecipanti: [],
				titleFilter: '',
				labelout: false
			}
		},
		watch: {
			titleFilter: function(){

				//vm.titleFilter contiene ciò che ho scritto nel filtro
				var vm = this;
				if(this.titleFilter.trim() != "" && this.persons.length != 0){
					for(var i=this.persons.length-1; i >= 0; i--){

						if(!this.persons[i].name.toUpperCase().includes(vm.titleFilter.toUpperCase()) &&
							!this.persons[i].client.toUpperCase().includes(vm.titleFilter.toUpperCase())){

							this.persons.splice(i, 1);
						}
					}
				}
				else {
					//Lo resetto dall'inizio
					this.persons = this.personsFilter.slice();
				}
			}
		},
		methods: {
			dispatchedPagination: function(display){
				this.displayPartecipanti = display;
			},
			sort_name: function(){

				if(this.ordered[0] == 0){

					this.persons.sort(function(a, b){
   						var nameA=a.name.toLowerCase(), nameB=b.name.toLowerCase()
   						if (nameA < nameB){//sort string ascending
							return -1 
						}  
   						if (nameA > nameB){
							return 1
						}
						return 0 //default return value (no sorting)
					})	
					this.ordered[0] = 1;
				}else{

					this.persons.sort(function(a, b){
   						var nameA=a.name.toLowerCase(), nameB=b.name.toLowerCase()
   						if (nameA > nameB){
							return -1 
						}  
   						if (nameA < nameB){
							return 1
						}
						return 0
					})	
					this.ordered[0] = 0;
				}		
			},
			sort_percent: function(){

				if(this.ordered[1] == 0){
					this.persons.sort(function(a, b){
						return a.percent-b.percent
					})
					this.ordered[1] = 1;
				}else{
					this.persons.sort(function(a, b){
						return b.percent-a.percent
					})
					this.ordered[1] = 0;
				}
			},
			filterOut: function() {
		        if (this.titleFilter != '') {
		            this.labelout = true;
		        } else {
		            this.labelout = false;
		        }
			},
			sort_name: function(){

				if(this.ordered[0] == 0){

					this.persons.sort(function(a, b){
   						var nameA=a.name.toLowerCase(), nameB=b.name.toLowerCase()
   						if (nameA < nameB){//sort string ascending
							return -1 
						}  
   						if (nameA > nameB){
							return 1
						}
						return 0 //default return value (no sorting)
					})	
					this.ordered[0] = 1;
				}else{

					this.persons.sort(function(a, b){
   						var nameA=a.name.toLowerCase(), nameB=b.name.toLowerCase()
   						if (nameA > nameB){
							return -1 
						}  
   						if (nameA < nameB){
							return 1
						}
						return 0
					})	
					this.ordered[0] = 0;
				}		
			},
			sort_edition: function(){

				if(this.ordered[1] == 0){

					this.persons.sort(function(a, b){
   						var nameA=a.edition, nameB=b.edition
   						if (nameA < nameB){//sort string ascending
							return -1 
						}  
   						if (nameA > nameB){
							return 1
						}
						return 0 //default return value (no sorting)
					})	
					this.ordered[1] = 1;
				}else{

					this.persons.sort(function(a, b){
   						var nameA=a.edition, nameB=b.edition
   						if (nameA > nameB){
							return -1 
						}  
   						if (nameA < nameB){
							return 1
						}
						return 0
					})	
					this.ordered[1] = 0;
				}		
			},
			sort_corso: function(){

				if(this.ordered[2] == 0){

					this.persons.sort(function(a, b){
   						var nameA=a.corso.toLowerCase(), nameB=b.corso.toLowerCase()
   						if (nameA < nameB){//sort string ascending
							return -1 
						}  
   						if (nameA > nameB){
							return 1
						}
						return 0 //default return value (no sorting)
					})	
					this.ordered[2] = 1;
				}else{

					this.persons.sort(function(a, b){
   						var nameA=a.corso.toLowerCase(), nameB=b.corso.toLowerCase()
   						if (nameA > nameB){
							return -1 
						}  
   						if (nameA < nameB){
							return 1
						}
						return 0
					})	
					this.ordered[2] = 0;
				}		
			},
			sort_avanz: function(){

				if(this.ordered[3] == 0){
					this.persons.sort(function(a, b){
						return a.percent-b.percent
					})
					this.ordered[3] = 1;
				}else{
					this.persons.sort(function(a, b){
						return b.percent-a.percent
					})
					this.ordered[3] = 0;
				}
			},
			sort_date: function(){

				if(this.ordered[4] == 0){
					this.persons.sort(function(a, b){
						return Date.parse(a.datecompl) - Date.parse(b.datecompl);
					})
					this.ordered[4] = 1;
				}else{
					this.persons.sort(function(a, b){
						return Date.parse(b.datecompl) - Date.parse(a.datecompl);
					})
					this.ordered[4] = 0;
				}
			},
			sort_score: function(){

				if(this.ordered[5] == 0){
					this.persons.sort(function(a, b){
						return a.score-b.score
					})
					this.ordered[5] = 1;
				}else{
					this.persons.sort(function(a, b){
						return b.score-a.score
					})
					this.ordered[5] = 0;
				}
			}
		},
		components: {
			paginazione,
			ClipLoader
		}
	}
</script>
<style scoped>
	#cliente{

		font-size: 12px;
	}

	.p-t {
		padding-top: 3px;
	}

	.int {
		border-style: solid;
		border-width: 1px;
		border-color: white;
		cursor: pointer;
	}

	.pad {
		padding: 8px;
		padding-left: 16px;
	}

	.int_wrapper {
		margin: 0px;
		background-color: #42a5f5;
		color: white;
		border-radius: 2px;
		border-top-width: 0px;
		border-bottom-width: 0px;
	}

	.menu-enter {
    	opacity: 0;
	}

	.menu-enter-active {
	    animation: slide-in 0.5s ease-out forwards;
	    transition: opacity 0.5s;
	}

	.menu-leave-active {
	    animation: slide-out 0.5s ease-out forwards;
	    transition: opacity 0.5s;
	    opacity: 0;
	    position: absolute;
	}

	.menu-move {
		transition: transform 0.5s;
	}

	@keyframes slide-in {
	    from {
	        transform: translateX(80px);
	    }
	    to {
	        transform: translateX(0px);
	    }
	}

	@keyframes slide-out {
	    from {
	        transform: translateX(0px);
	    }
	    to {
	        transform: translateX(80px);
	    }
	}
</style>
<style>
	.v-spinner {
		display: initial;
		padding: 0px 2px;
	}
</style>


