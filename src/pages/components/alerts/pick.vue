<template>
	<div class="modal-container">
		<div v-if="ready" >
	        <div class="modal-header">
	            <slot name="header">
	                <h3>Seleziona Partecipanti</h3>
	                <h4>{{item.titolo}}</h4>
	                <h5 v-if="noteSede != ''"><strong>Edizione:</strong>{{" " + noteSede}}</h5>
	            </slot>
	        </div>
	        <div class="modal-body">
	            <slot name="body">
	                <h4 v-if="item.grouped < 9999">Assegna fino a <strong>{{item.grouped}}</strong> utenti</h4>
	                <div style="margin-top: 5px;">
	                	<v-select value="[]" multiple label="anag" :getOptionLabel="factorLabel" :options="people" :onChange="change" v-model="selected"
	                	:noDrop="dis" :searchable="!dis"></v-select>
	                	<div v-if="!opened_once">
	                		<div style="margin-top:5px" v-if="checkables.length > 0"><strong>Suggeriti:</strong></div>
							<!--<div v-for="p in people" v-if="p.suggested && !p.already" class="checkbox">-->
							<div v-for="p in checkables" class="checkbox">
							<!-- shows already , testing -->
								<input :id="p.ID" type="checkbox" :name="p.ID" v-model="p.picked" :disabled="p.disabled" @change="handleCheckbox()">
								<label :for="p.ID">{{p.anag}}</label>
							</div>
						</div>
	                </div>
	            </slot>
	        </div>
	        <div class="modal-footer">
	            <slot name="footer" v-if="item.DO_NOT_UPDATE != true">
	                <button class="btn btn-sm btn-primary" @click="close">
	                    ANNULLA
	                </button>
	                <button v-if="selected.length > 0 && selected.length <= item.grouped" class="btn btn-sm btn-warning" @click="save">
	                    ISCRIVI
	                </button>
	            </slot>
	            <slot name="footer" v-else>
	            	<button class="btn btn-sm btn-primary" @click="$emit('backward')">
	                    INDIETRO
	                </button>
	                <button v-if="selected.length > 0 && selected.length <= item.grouped" class="btn btn-sm btn-warning" @click="echoCallback()">
	                    ISCRIVI
	                </button>
	            </slot>	
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
		//ITEM NEEDS
		/*
		-IDUnitàOrganizzativa
		-IdEdizione
		-grouped
		-titolo
		-corso

		*/
		props: {
			item: Object
		},
		components: {
			vSelect,
			ClipLoader
		},
		watch: {
			item: function(){
				this.init();
			},
			//LISTENER PER OBS OPTIONCLASSES
			ready: function(){
				if(this.ready){
					this.$nextTick(function(){
						var vm = this;
						$(".v-select").click(function(){
							vm.opened_once = true;
							if(!vm.al_goin){ vm.al_goin = true;
						    	vm.addOptionClasses();
							}
						});
						$(".v-select input").on("focus", function(){
							if(!vm.al_goin){ vm.al_goin = true;
						    	vm.addOptionClasses();
							}
						})
						$(".v-select input").on("keyup", function(){
							vm.$nextTick(function(){
								vm.addOptionClasses();
							});
						})
					})
				}
			}
		},
		data: function(){
			return {
				noteSede: '',
				ready: false,
				people:[],
				available: [],
				selected: [],
				dis: false,
				al_goin: false,
				opened_once: false,
				checkables: []
			}
		},
		methods: {
			echoCallback: function(){
				this.$emit("submit", [this.$http.post(localStorage.getItem("path")+"/Webapi", {dati: "post non prevista", selected: this.selected}, { 
                    headers: {"X-HTTP-Method-Override": "Iscrivi_ERROR"}})])
			},
			handleCheckbox: function(){
				var count = 0;
				var ids = []
				for(var i = 0; i < this.checkables.length; i++){
					if(this.checkables[i].picked == true){
						count++;
						ids.push(this.checkables[i].ID);
					}
				}
				if(count == this.item.grouped){
					for(var i = 0; i < this.checkables.length; i++){
						if(this.checkables[i].picked != true){
							this.checkables[i].disabled = true;
						}
					}
				} else {
					for(var i = 0; i < this.checkables.length; i++){
						this.checkables[i].disabled = false;
					}
				}
				if(ids.length > 0){
					var inject = this.people.filter(function(p){
						for(var i = 0; i < ids.length; i++){
							if(p.ID == ids[i]){return true;}
						}
						return false;
					})
					this.selected = inject;
				} else {
					this.selected = []
				}
			},
			//QUITE OSCENO
			factorLabel: function(option){
				if(option.already == 1){
					return "Già Iscritto: " + option.anag;
				} else {
					return option.anag;
				} 
			},
			addOptionClasses: function(){
				if(!this.dis){
					var renderedPeople = this.people.filter(function(obj){
						return obj.anag != null
					})

					var arr_li = $(".v-select li")
					var arr_a = $(".v-select li>a")
					for(var i = 0; i < arr_a.length; i++){
						//if text exposes denied
						var txt = arr_a[i].innerText
						var den = txt.split(":").length > 1;
						if(den) {arr_li[i].className = "denied"} else { 
							if(arr_li[i].className == 'denied'){arr_li[i].className = ""};

							for(var ii = 0; ii < renderedPeople.length; ii++){
								if(renderedPeople[ii].anag == txt){
									if(renderedPeople[ii].suggested){ arr_a[i].className = "suggested"}
									else { arr_a[i].className -= "suggested" }
									break;
								}
							}
						}
					}
				}
				this.al_goin = false;
			},
			// END OSCENO
			change: function(){
				if(this.selected.length == this.item.grouped){
					this.dis = true;
				} else {
					this.dis = false;
				}
			},
			close: function(r){
				this.selected = [];
				this.opened_once = false;
				for(var i = 0; i < this.checkables.length; i++){
					this.checkables[i].picked = false;
					this.checkables[i].disabled = false;
				}
				this.$emit("close", r);
			},
			getEdizione: function(){
				this.$http.get(localStorage.getItem("path")+"/APIEdizioni?IdEdizione="+this.item.IdEdizione)
				.then((response) => {
					var res = response.body;
                    try {
                        res = JSON.parse(response.body);
                    } catch (err) {};

                    if(res && res.APIEdizioni){
                    	if(res.APIEdizioni[0].NoteSede){
                    		this.noteSede = res.APIEdizioni[0].NoteSede;
                    	}
                    }
				}, (err) => {
					console.log(err);
				})
			},
			getAllPersoneUO: function(){
				this.people = [];
				this.available = [];
				var promises = []
				this.checkables = []
				/*
				this.$http.get(localStorage.getItem("path")+"/APIPersonaUO?IDUnitàOrganizzativa="+this.item.IDUnitàOrganizzativa)
				.then((response) => {
				*/
				this.$http.get(localStorage.getItem("path")+"/APIPersone?IDUO="+this.item.IDUnitàOrganizzativa)
				.then((response) => {
					var res = response.body;
                    try {
                        res = JSON.parse(response.body);
                    } catch (err) {};
					
					/*
                    if(res && res.APIPersonaUO){
                    	for(var i = 0; i < res.APIPersonaUO.length; i++){
                    		this.people.push({
                    			ID: res.APIPersonaUO[i].IDPersona,
                    			suggested: 0,
                    			already: 0
                    		})
                    	}
                    } */
					if(res && res.APIPersone){
						this.people = res.APIPersone.map(function(obj){
							var p = {
								ID: obj.IDPersona,
								suggested: 0,
								already: 0,
								nome: obj.NOME,
                    			cognome: obj.COGNOME,
                    			anag: obj.NOME + " " + obj.COGNOME
							}
							return p;
						})
					}

                    promises.push(this.checkPartecipazioni());
                    //promises.push(this.getNames());
                    Promise.all(promises).then(() => {
						
                		this.people.sort(function(a,b){
                			if(a.already + b.already == 1){
                			//1 already & 1 not
                				return a.already - b.already;
                			} else if(a.already + b.already == 2){
                			//both already
                				return a.cognome < b.cognome ? -1 : 1;
                			} else {
                			//none already
                				if(a.suggested + b.suggested == 1){
                					return b.suggested - a.suggested;
                				}
                				return a.cognome < b.cognome ? -1 : 1;
                			}
                		})

                		for(var i = 0; i < this.people.length; i++){
                			if(this.people[i].suggested && !this.people[i].already){
                				this.checkables.push({ID: this.people[i].ID, picked: false, disabled: false, anag: this.people[i].anag});
                			}
                		}
                		this.ready = true;
	                }, (err) => {
	                	console.log(err);
	                	this.ready = true;
	                });

				}, (err) => {
                    this.ready = true;
					console.log(err);
				})
			},
			checkPartecipazioni: function(){
				 return this.$http.get(localStorage.getItem("path")+"/APIPartecipazioni?IDUnitàOrganizzativa="+this.item.IDUnitàOrganizzativa+"&IDCorso="+this.item.corso+"&IdEdizione=!;" + this.item.IdEdizione)
                .then((response) => {
                	var res = response.body;
                    try {
                        res = JSON.parse(response.body);
                    } catch (err) {};

                    var rem = false;

                    if(res && res.APIPartecipazioni){
                    	for(var i = 0; i < res.APIPartecipazioni.length; i++){
                    		var part = res.APIPartecipazioni[i];
                    		var fpersona = false
                    		for(var ii = 0; ii < this.people.length; ii++){
                    			if(part.IDPartecipante == this.people[ii].ID){
                    				fpersona = true
                    				if(part.IdEdizione == null){
                    					this.people[ii].suggested = 1;
                    					this.people[ii].updatePartecipazione = part.IDPartecipazione;
                    				} else {
                    					this.people[ii].already = 1;
                    					rem = true;
                    				}
                    			}
                    		}
                    		if(!fpersona){
                    			this.available.push(part.IDPartecipazione)
                    		}
                    	}
                    }
                }, (err) => { 
					this.people = [];
					this.ready = true;
					console.log(err) })
			},
			getNames: function(){
				var ids = [];
				for(var i = 0; i < this.people.length; i++){
					if(ids.indexOf(this.people[i].ID) == -1){
						ids.push(this.people[i].ID);
					}
				}
				ids = ids.join(";");

				return this.$http.get(localStorage.getItem("path")+"/APIPersone?IDUO="+this.item.IDUnitàOrganizzativa+"&IDPERSONA="+ids)
                .then((response) => {
                	var res = response.body;
                    try {
                        res = JSON.parse(response.body);
                    } catch (err) {};
                    if(res && res.APIPersone){
                    	for(var i = 0; i < res.APIPersone.length; i++){
                    		var pers = res.APIPersone[i];
                    		for(var ii = 0; ii < this.people.length; ii++){
                    			if(this.people[ii].ID == pers.IDPERSONA){
                    				this.people[ii].nome = pers.NOME;
                    				this.people[ii].cognome = pers.COGNOME;
                    				this.people[ii].anag = pers.NOME + " " + pers.COGNOME;
                    			}	
                    		}
                    	}
                    }
                },(err) => {
					this.people = [];
					this.ready = true;
            		console.log(err)
            	});
			},
			save: function(){
				console.log(this.available)
				var promises = []
				for(var i = 0; i < this.selected.length; i++){
					var json = {
						IdPartecipazione: this.available[i],
						IdPersona: this.selected[i].ID,
						IdEdizione: this.item.IdEdizione,
						Username: this.$root.lsGet("username"),
						IdPartecipazioneDaEliminare: 0
					}
					if(this.selected[i].updatePartecipazione != null){
						json.IdPartecipazione = this.selected[i].updatePartecipazione;
						json.IdPartecipazioneDaEliminare = this.available[i];
					}
					console.log(json);

					promises.push(this.$http.post(localStorage.getItem("path")+"/Webapi", json, {
			                headers: {
			                    'X-HTTP-Method-Override': "AggiornaPartecipazione",
			                    'Content-Type': 'application/json'
			                }
			            })
		                .then((response) => {
		                	console.log("OK " + this.selected[i].ID)
		                },(err) => {
		            		console.log(err)
		            	})
	            	);

				}
				Promise.all(promises).then(() => {
                    this.close(true);
                }, (err) => {
                	console.log(err);
                	this.close(true);
                });
			},
			init: function(){
				this.ready = false;
				this.getEdizione();
				this.getAllPersoneUO();
			}
		},
		mounted: function(){
			this.init();
		}
	}
</script>

<style scoped>
strong {
	font-weight: 700 !important;
}

input {
	display: none;
}

label {
	font-size: 15px;
	color: #bfbfbf;
	padding: 0 0 0 1em;
	cursor: pointer;
}
.checkbox {
	text-align: left;
}
label:before {
	content: '';
	background: #55D8C6;
	position: absolute;
	left: 0;
	top: 0px;
	height: 16px;
	width: 16px;
	margin-right: 10px;
	border-radius: 80%;
	box-shadow: 0px 1px 0 0 rgba(0, 0, 0, .2);
	border: 8px solid #fff;
	transition: border .3s ease;
}
label:after {
	display: none;
}

input:checked + label:before {
	border-color: #fff;
	border-width: 3px;
}
input + label {
	transition: color .7s ease;
}
input:checked + label {
	color: #5D5D5D;
}
</style>

<style>
.v-select li {
    padding: 0px;
    margin: 0px;
    border-width: 0px;
}
.v-select ul.dropdown-menu {
	max-height: 250px !important;
	box-shadow: none;
	overflow-y: auto;
}

.v-select ul.dropdown-menu li > a {
	border-color: white;
	border-style: solid;
	border-width: 1px;
}

.v-select ul.dropdown-menu li.highlight > a {
	background-color: white;
	border-color: #42a5f5;
    color: #42a5f5;
}

.v-select ul.dropdown-menu li > a.suggested {
	background-color: #42b983;
	color: white;
}

.v-select ul.dropdown-menu li.active > a {
	background-color: #42a5f5;
    color: white;
}

.v-select ul.dropdown-menu li.denied {
	background-color: #f0f0f0 !important;
    cursor: not-allowed !important;
    pointer-events: none !important;
}
</style>