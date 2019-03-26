<template>
	<div class="modal-container panel with-nav-tabs panel-success">
		<div v-if="ready">
			<!-- Nav tabs -->
			<div class="panel-heading">
				<ul class="nav nav-tabs" role="tablist">
				    <li role="presentation" class="active"><a href="#edit" aria-controls="edit" role="tab" data-toggle="tab">Modifica</a></li>
				    <li role="presentation"><a href="#subs" aria-controls="subs" role="tab" data-toggle="tab" @click="getPeople()">Sostituisci</a></li>
				</ul>
			</div>
			<div class="panel-body">
				<div class="tab-content">
		    		<div role="tabpanel" class="tab-pane active" id="edit">
		    			<div class="modal-header">
				            <slot name="header">
				                <h3>Modifica Programmazione</h3>
				                <h4>Per: {{' ' + anag}}</h4>
				                <h5><strong>Corso:</strong>{{" " + item.TITOLOCORSO}}</h5>
				                <h5><strong>Programmazione Corrente:</strong>{{" " + current.IDProvinciaSede}}</h5>
				            </slot>
				        </div>
				        <div class="modal-body">
				            <slot name="body">
				                <h4>Seleziona Edizione</h4>
				                <div style="margin-top: 5px;">
				                	<v-select label="IDProvinciaSede" :getOptionLabel="factorLabel" :options="edizioni" v-model="selected"></v-select>
				                </div>
				            </slot>
				        </div>

				        <div class="modal-footer">
				            <slot name="footer">
				                <span class="pull-left"></span>
				                <button class="btn btn-sm btn-primary" @click="close">
				                    ANNULLA
				                </button>
				                <button v-if="showAssignBtn()" class="btn btn-sm btn-warning" @click="save">
				                    ASSEGNA
				                </button>
				            </slot>
				        </div>
				    </div>
		    		<div role="tabpanel" class="tab-pane" id="subs">
		    			<div class="modal-header">
				            <slot name="header">
				                <h3>Sostituisci Partecipante</h3>
				                <h5><strong>Per Corso:</strong>{{" " + item.TITOLOCORSO}}</h5>
				                <h5><strong>Programmazione:</strong>{{" " + current.IDProvinciaSede}}</h5>
				            </slot>
				        </div>
				        <div class="modal-body">
				            <slot name="body" v-if="subs_ready">
				                <h4>Sostituisci {{" " + this.anag + " "}} con: </h4>
				                <div style="margin-top: 5px;">
				                	<v-select label="anag" :options="subs_people" v-model="subs_selected"></v-select>
				                </div>
				            </slot>
				            <div style="text-align: center; margin-bottom: 10px;">
				            	<clip-loader :loading="!subs_ready" :color="'#42b983'" size="40px"></clip-loader>
				            </div>
				            <div class="modal-footer">
				            <slot name="footer">
				                <span class="pull-left"></span>
				                <button class="btn btn-sm btn-primary" @click="close">
				                    ANNULLA
				                </button>
				                <button v-if="subs_selected" class="btn btn-sm btn-warning" @click="subs_save()">
				                    APPLICA
				                </button>
				            </slot>
				        </div>
				        </div>
		    		</div>
		    	</div>
	    	</div>
	    </div>
    	<div v-else class="modal-header" style="text-align: center;">
        	<clip-loader :loading="!ready" :color="'#42b983'" size="40px"></clip-loader>
        </div>
    </div>
</template>

<script>
import vSelect from "../vueSelectWrapper/components/Select.vue"
import ClipLoader from 'vue-spinner/src/ClipLoader.vue'

	export default {
		props: {
			item: Object
		},
		components: {
			vSelect,
			ClipLoader
		},
		data: function(){
			return {
				someGrouped: [],
				someIgnored: [],
				anag: '',
				ready: false,
				edizioni: [],
				selected: null,
				current: null,

				subs_people: [],
				subs_selected: null,
				subs_ready: false,
				rep: false
			}
		},
		watch: {
			item: function(){
				this.init();
			}
		},
		mounted: function(){
			this.init();
		},
		methods: {
			factorLabel: function(option){
				if(option.rep != true){
					var labels = []
					if(option.DataInizio && (option.DataInizio == option.DataFine)){
						labels.push("Data " + option.DataInizio.replace(/-/g, "/"));
					} else {
						if(option.DataInizio){labels.push("Dal " + option.DataInizio.replace(/-/g, "/"))}
						if(option.DataFine){labels.push("Al " + option.DataFine.replace(/-/g, "/"))}
					}
					if(option.Edizione != option.IdEdizione){labels.push(option.Edizione)}
					if(option.IDProvinciaSede){labels.push(option.IDProvinciaSede)}
					labels.push(option.IdEdizione);
					return labels.join(" - ");
				} else {
					return "Da riprogrammare";
				}
			},
			close: function(r){
				this.$emit("close", r);
			},
			init: function(){
				this.ready = false;
				this.selected = null;
				this.subs_people = [];
				this.getGrouped();
			},
			showAssignBtn: function(){
				return this.selected && this.selected.IdEdizione != this.item.IdEdizione;
			},
			getGrouped: function(){
				this.someGrouped = [];
				this.someIgnored = [];
				this.$http.get(localStorage.getItem('path') + 
				'/APIPartecipazioni?IDUnitàOrganizzativa='+this.item.IDUnitàOrganizzativa+'&IDCorso='+this.item.IDCorso+
				'&IDPartecipante=!;'+this.item.IDPartecipante)
				.then((response) => {
					var res = response.body
                    try {
                        var res = JSON.parse(response.body);
                    } catch (err) {}
                    if(res && res.APIPartecipazioni){
                    	for(var i = 0; i < res.APIPartecipazioni.length; i++){
                    		if(res.APIPartecipazioni[i].IDPartecipante == null){
	                    		var ed = res.APIPartecipazioni[i].IdEdizione;
	                    		var some = this.someGrouped.some(function(e){
	                    			return ed == e.edizione;
	                    		})
	                    		if(!some){
	                    			this.someGrouped.push({
	                    				edizione: ed,
	                    				partecipazione: res.APIPartecipazioni[i].IDPartecipazione
	                    			});
	                    		}
	                    	} else if(res.APIPartecipazioni[i].IdEdizione 
	                    		&& res.APIPartecipazioni[i].IDPartecipazione != this.item.IDPartecipazione){
	                    		this.someIgnored.push(res.APIPartecipazioni[i].IdEdizione);
	                    	} 
                    	}
                    }
                    var promises = [];
					promises.push(this.getPerson());
	                promises.push(this.getEdizioni());
	                Promise.all(promises).then(() => {
	                	this.ready = true;
	                });
				})
			},
			getPerson: function(){
				return this.$http.get(localStorage.getItem("path")+"/APIPersone?IDPERSONA="+this.item.IDPartecipante)
				.then((response) => {
					var res = response.body
                    try {
                        var res = JSON.parse(response.body);
                    } catch (err) {}
                    if(res && res.APIPersone){
                    	this.anag = res.APIPersone[0].NOME + " " + res.APIPersone[0].COGNOME
                    }
				}, (err) => {
					console.log(err)
				})
			},
			getEdizioni: function(){
				this.edizioni = [];
				this.current = {};
				return this.$http.get(localStorage.getItem("path")+"/APIEdizioni?Idcorso="+this.item.IDCorso)
				.then((response) => {
					var res = response.body
                    try {
                        var res = JSON.parse(response.body);
                    } catch (err) {}
                    if(res && res.APIEdizioni){
                    	for(var i = 0; i < res.APIEdizioni.length; i++){
                    		if(this.someIgnored.indexOf(res.APIEdizioni[i].IdEdizione) == -1){
								console.log(Date.now());
								console.log(new Date(res.APIEdizioni[i].DataFine))
								console.log(Date.now() <= new Date(res.APIEdizioni[i].DataFine)) 
								
								if(Date.now() <= new Date(res.APIEdizioni[i].DataFine)){
									this.edizioni.push(res.APIEdizioni[i]);
									if(this.item.IdEdizione == res.APIEdizioni[i].IdEdizione){
										this.selected = res.APIEdizioni[i];
										this.current = res.APIEdizioni[i];
									}
								}
								/*
                    			this.edizioni.push(res.APIEdizioni[i]);
                    			if(this.item.IdEdizione == res.APIEdizioni[i].IdEdizione){
                    				this.selected = res.APIEdizioni[i];
                    				this.current = res.APIEdizioni[i];
                    			}
								*/
                    		}
                    	}
                    	this.edizioni.push({rep: true, IDProvinciaSede: "00"});
                    	console.log(this.edizioni)
                    }
				}, (err) => {
					console.log(err)
				})
			},
			handleCheckbox: function(){
				console.log(this.rep);
			},
			save: function(){
				if(this.selected.rep != true){
					var reserved = null;
					for(var i = 0; i < this.someGrouped.length; i++){
						if(this.selected.IdEdizione == this.someGrouped[i].edizione){
							reserved = this.someGrouped[i].partecipazione;
							break;
						}
					}

					var json = {
						IdPartecipazione: this.item.IDPartecipazione,
						IdPersona: this.item.IDPartecipante,
						IdEdizione: this.selected.IdEdizione,
						Username: this.$root.lsGet("username"),
						IdPartecipazioneDaEliminare: 0
					}
					if(reserved != null){
						json.IdPartecipazioneDaEliminare = reserved;
					}

					console.log(json)
					
					this.$http.post(localStorage.getItem("path")+"/Webapi", json, {
		                headers: {
		                    'X-HTTP-Method-Override': "AggiornaPartecipazione",
		                    'Content-Type': 'application/json'
		                }
		            })
	                .then((response) => {
	                	console.log(this.selected)
	                	console.log("OK " + this.item.IDPartecipazione);
	                	this.close(true);
	                },(err) => {
	            		console.log(err)
	            	})
            	} else {
            		var json = {
						IdPartecipazione: this.item.IDPartecipazione,
						IdPersona: this.item.IDPartecipante,
						IdEdizione: 0,
						Username: this.$root.lsGet("username"),
						IdPartecipazioneDaEliminare: 0
					}

					console.log(json)
					
					this.$http.post(localStorage.getItem("path")+"/Webapi", json, {
		                headers: {
		                    'X-HTTP-Method-Override': "AggiornaPartecipazione",
		                    'Content-Type': 'application/json'
		                }
		            })
	                .then((response) => {
	                	console.log(this.selected)
	                	console.log("Riprogrammato " + this.item.IDPartecipazione);
	                	this.close(true);
	                },(err) => {
	            		console.log(err)
	            	})
            	}
			},
			//SWITCH PARTECIPANTI
			getPeople: function(){
				var promises = [];
				var toIgnore = [];
				if(this.subs_people.length == 0){
					this.subs_people = [];
					this.subs_ready = false;
					promises.push(this.$http.get(localStorage.getItem("path")+"/APIPersonaUO?IDUnitàOrganizzativa="+this.item.IDUnitàOrganizzativa)
						.then((response) => {
							var res = response.body;
		                    try {
		                        res = JSON.parse(response.body);
		                    } catch (err) {};

		                    if(res && res.APIPersonaUO){
		                    	for (var i = 0; i < res.APIPersonaUO.length; i++) {
		                    		if(res.APIPersonaUO[i].IDPersona != this.item.IDPartecipante){
		                    			this.subs_people.push(res.APIPersonaUO[i])
		                    		}
		                    	}
		                    }
						}, (err) => {
							console.log(err)
						})
					);
					promises.push(this.$http.get(localStorage.getItem("path")+"/APIPartecipazioni?IDUnitàOrganizzativa="+this.item.IDUnitàOrganizzativa+"&IDCorso="+this.item.IDCorso + "&IdEdizione=" + this.item.IdEdizione)
						.then((response) => {
							var res = response.body;
		                    try {
		                        res = JSON.parse(response.body);
		                    } catch (err) {};

		                    if(res && res.APIPartecipazioni){
		                    	for (var i = 0; i < res.APIPartecipazioni.length; i++) {
		                    		if(res.APIPartecipazioni[i].IDPartecipante && 
		                    			toIgnore.indexOf(res.APIPartecipazioni[i].IDPartecipante) == -1){
		                    			toIgnore.push(res.APIPartecipazioni[i].IDPartecipante)
		                    		}
		                    	}
		                    }
						}, (err) => {
							console.log(err)
						})
					);
					Promise.all(promises).then(() => {
	                	//this.subs_ready = true;
	                	this.subs_people = this.subs_people.filter(function(obj){
	                		return toIgnore.indexOf(obj.IDPersona) == -1
	                	})
	                	
	                	var ids = [];
	                	for (var i = 0; i < this.subs_people.length; i++) {
	                		ids.push(this.subs_people[i].IDPersona);
	                	}
	                	ids = ids.join(";")
	                	this.$http.get(localStorage.getItem("path")+"/APIPersone?IDPERSONA="+ids)
	                	.then((response) => {
	                		var res = response.body;
		                    try {
		                        res = JSON.parse(response.body);
		                    } catch (err) {};

		                    if(res && res.APIPersone){
		                    	for (var i = 0; i < res.APIPersone.length; i++) {
		                    		for(var ii = 0; ii < this.subs_people.length; ii++){
		                    			if(this.subs_people[ii].IDPersona == res.APIPersone[i].IDPERSONA){
		                    				this.subs_people[ii].anag = res.APIPersone[i].NOME + " " + res.APIPersone[i].COGNOME;
		                    			}
		                    		}
		                    	}
		                    }
		                    console.log(this.subs_people);
		                    this.subs_ready = true;
	                	})

	                });
				}
			},
			subs_save: function(){
				console.log(this.subs_selected);
				this.close();
			}
		}
	}
</script>

<style scoped>
strong {
	font-weight: 700 !important;
}
.panel.with-nav-tabs .panel-heading{
    padding: 5px 5px 0 5px;
    background-color: white;
    border-color: #42b983;
}
.panel.with-nav-tabs .nav-tabs{
	border-bottom: none;
}
/*** PANEL SUCCESS ***/
.with-nav-tabs.panel-success .nav-tabs > li > a,
.with-nav-tabs.panel-success .nav-tabs > li > a:hover,
.with-nav-tabs.panel-success .nav-tabs > li > a:focus {
	color: #42b983;
}
.with-nav-tabs.panel-success .nav-tabs > .open > a,
.with-nav-tabs.panel-success .nav-tabs > .open > a:hover,
.with-nav-tabs.panel-success .nav-tabs > .open > a:focus,
.with-nav-tabs.panel-success .nav-tabs > li > a:hover,
.with-nav-tabs.panel-success .nav-tabs > li > a:focus {
	color: white;
	background-color: #42b983;
	border-color: transparent;
}
.with-nav-tabs.panel-success .nav-tabs > li.active > a,
.with-nav-tabs.panel-success .nav-tabs > li.active > a:hover,
.with-nav-tabs.panel-success .nav-tabs > li.active > a:focus {
	color: #42b983;
	background-color: #fff;
	border-color: #42b983;
	border-bottom-color: transparent;
}

.panel-body {
	padding: 4px
}
</style>