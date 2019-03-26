<template>
	<div class="modal-container">
		<div v-if="ready">
	        <div class="modal-header">
	            <slot name="header">
	                <h3>Programma Attività</h3>
	                <h4>Per: {{' ' + anag}}</h4>
	                <h5><strong>Corso:</strong>{{" " + item.TITOLOCORSO}}</h5>
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
	                <button v-if="selected" class="btn btn-sm btn-warning" @click="save">
	                    ASSEGNA
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
				selected: null
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
			},
			close: function(r){
				this.$emit("close", r);
			},
			init: function(){
				this.ready = false;
				console.log(this.item)
				this.selected = null;
				this.getGrouped();
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
	                    	} else if(res.APIPartecipazioni[i].IdEdizione){
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
								}
								
                    			//this.edizioni.push(res.APIEdizioni[i]);
                    		}
                    	}
                    }
				}, (err) => {
					console.log(err)
				})
			},
			save: function(){
				console.log(this.selected)
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
                	console.log("OK " + this.item.IDPartecipazione);
                	this.close(true);
                },(err) => {
            		console.log(err)
            	})
			}
		}
	}
</script>

<style scoped>
	strong {
		font-weight: 700 !important;
	}
</style>