<template>
	<span>
		<transition name="modal" v-if="!submitting">
	        <div class="modal-mask">
	            <div class="modal-wrapper" :class="{'md-wrapper': isMd, 'xs-wrapper': !isMd}">
	            	<div class="modal-container">
						<div v-if="ready">
					        <div class="modal-header">
					            <slot name="header">
					                <h3>Proponi questo corso</h3>
					            </slot>
					        </div>
					        <div class="modal-body">
					            <slot name="body">
					            	<h4><strong>A:</strong></h4>
					                <div style="margin-top: 5px;">
					                	<v-select multiple label="anag" :options="people" v-model="people_selected">
					                	</v-select>
					                </div>
					            </slot>
					        </div>
					        <div class="modal-footer">
					            <slot name="footer">
					                <span class="pull-left"></span>
					                <button class="btn btn-sm btn-primary" @click="close">
					                    ANNULLA
					                </button>
					                <button v-if="people_selected" class="btn btn-sm btn-warning" @click="suggest()">
					                    INVIA
					                </button>
					            </slot>
					        </div>
					    </div>
					    <div v-else class="modal-header" style="text-align: center;">
					        	<clip-loader :loading="!ready" :color="'#42b983'" size="40px"></clip-loader>
					    </div>
				    </div>
	            </div>
	        </div>
	    </transition>
	    <alert-loader v-else :promises="promises" @close="close()"
	    :success_message="success_message"
	    :error_message="error_message"></alert-loader>
	</span>
</template>

<script>
	import vSelect from "../vueSelectWrapper/components/Select.vue"
	import alertLoader from './alert-load.vue'
	import ClipLoader from 'vue-spinner/src/ClipLoader.vue'

	export default {
		components: {
			vSelect,
			ClipLoader,
			alertLoader
		},
		props: {
			item: Object
		},
		mounted: function(){
			this.$nextTick(function(){
				this.isMd = window.innerWidth >= 992 ? true : false;
			})
			this.init();
		},
		data: function(){
			return {
				ready: false,
				isMd: false,
				
				promises: [],
				submitting: false,
				success_message: '',
				error_message: '',

				people: [],
				people_selected: null

			}
		},
		methods: {
			close: function(){
				this.$emit("close");
			},
			suggest: function(){
				this.promises = [this.$http.post(localStorage.getItem("path")+"/Webapi", {dati: "suggestion non prevista"}, { 
                    headers: {"X-HTTP-Method-Override": "Iscrivi_ERROR"}})];
                this.success_message = "Proposta inviata con successo"
                this.error_message = "Non sei abilitato a proporre questo corso"
                this.submitting = true
			},
			init: function(){
				this.ready = false;
				this.submitting = false;
				this.promises = [];
				this.getPeople();
			},
			getPeople: function(){
				this.people = []
				var uos = this.item.UO;
				uos = uos ? uos.join(";") : null;
				//TODO: Cancella codice commeentato? Ora Filtra per UO direttamente su APIPersone!!!!!
				/*
				this.$http.get(localStorage.getItem("path")+"/APIPersonaUO?IDUnitàOrganizzativa="+uos)
					.then((response) => {
						var res = response.body;
	                    try {
	                        res = JSON.parse(response.body);
	                    } catch (err) {};

	                    var ids = [];
	                    if(res && res.APIPersonaUO){
	                    	for (var i = 0; i < res.APIPersonaUO.length; i++) {
	                    		if(res.APIPersonaUO[i].IDPersona != this.item.IDPartecipante){
	                    			this.people.push(res.APIPersonaUO[i])
	                    			if(ids.indexOf(res.APIPersonaUO[i].IDPersona) == -1){
	                    				ids.push(res.APIPersonaUO[i].IDPersona);
	                    			}
	                    		}
	                    	}
	                    }
	                    if(ids.length > 0){
	                    	ids = ids.join(";");
	                    	this.$http.get(localStorage.getItem("path")+"/APIPersone?IDPERSONA="+ids)
		                	.then((response) => {
		                		var res = response.body;
			                    try {
			                        res = JSON.parse(response.body);
			                    } catch (err) {};

			                    if(res && res.APIPersone){
			                    	for (var i = 0; i < res.APIPersone.length; i++) {
			                    		for(var ii = 0; ii < this.people.length; ii++){
			                    			if(this.people[ii].IDPersona == res.APIPersone[i].IDPERSONA){
			                    				this.people[ii].anag = res.APIPersone[i].NOME + " " + res.APIPersone[i].COGNOME;
			                    			}
			                    		}
			                    	}
			                    }
			                    console.log(this.people);
			                    this.ready = true;
		                	})
	                    } else {
	                    	this.ready = true;
	                    }
					}, (err) => {
	                    this.ready = true;
						console.log(err)
					})
				*/
				this.$http.get(localStorage.getItem("path")+"/APIPersone?IDUO="+uos)
					.then((response) => {
						var res = response.body;
						try {
							res = JSON.parse(response.body);
						} catch (err) {};
						console.log(res)
						if(res && res.APIPersone){
							this.people = res.APIPersone.map(function(obj){
								obj.anag = obj.NOME + " " + obj.COGNOME;
								return obj;
							})
							console.log(this.people);
							this.ready = true;
	                    } else {
	                    	this.ready = true;
	                    }
					}, (err) => {
	                    this.ready = true;
						console.log(err)
					})
			}
		}
	}
</script>

<style>
	
</style>