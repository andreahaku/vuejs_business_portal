<template>
	<span>
		<transition name="modal" v-if="!submitting">
	        <div class="modal-mask">
	            <div class="modal-wrapper" :class="{'md-wrapper': isMd, 'xs-wrapper': !isMd}">
	            	<div class="modal-container" v-if="!edition_picked">
						<div v-if="ready">
					        <div class="modal-header">
					            <slot name="header">
					                <h3>Seleziona un'edizione</h3>
					                <h5><strong>Corso:</strong>{{" " + item.TITOLOCORSO}}</h5>
					            </slot>
					        </div>
					        <div class="modal-body">
					            <slot name="body">
					                <div style="margin-top: 5px;">
					                	<v-select label="IDProvinciaSede" :getOptionLabel="factorLabel" :options="edizioni" v-model="edition_selected">
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
					                <button v-if="edition_selected && !me" class="btn btn-sm btn-warning" @click="forward()">
					                    AVANTI
					                </button>
					                <button v-if="edition_selected && me" class="btn btn-sm btn-warning" @click="iscrivimi()">
					                    ISCRIVITI
					                </button>
					            </slot>
					        </div>
					    </div>
					    <div v-else class="modal-header" style="text-align: center;">
					        	<clip-loader :loading="!ready" :color="'#42b983'" size="40px"></clip-loader>
					    </div>
				    </div>
				    <pick v-else :item="pick_props" @backward="edition_picked = false;" @submit="submit"></pick>
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
	import pick from './pick.vue'

	export default {
		components: {
			vSelect,
			ClipLoader,
			alertLoader,
			pick
		},
		//TITOLO CORSO E UO
		props: {
			item: Object,
			me: Boolean
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
				edition_picked: false,
				edition_selected: null,
				edizioni: [],
				pick_props: {},
				
				promises: [],
				submitting: false,
				success_message: '',
				error_message: ''

			}
		},
		methods: {
			close: function(){
				this.$emit("close");
			},
			iscrivimi: function() {
				this.promises = [this.$http.post(localStorage.getItem("path")+"/Webapi", {dati: "post non prevista"}, { 
                    headers: {"X-HTTP-Method-Override": "Iscrivi_ERROR"}})];
                this.success_message = "Iscrizione effettuata con successo"
                this.error_message = "Iscrizione non abilitata"
                this.submitting = true
			},
			submit: function(promises){
				this.promises = promises;
				this.success_message = "Iscrizioni effettuate con successo"
				this.error_message = "Iscrizione multipla non abilitata"
				this.submitting = true;
			},
			forward: function(){
				this.pick_props.IdEdizione = this.edition_selected.IdEdizione;
				console.log(this.pick_props)
				this.edition_picked = true;
			},
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
			init: function(){
				this.ready = false;
				this.edition_picked = false;
				this.edition_selected = null
				this.getEdizioni();

				this.pick_props = {
					IDUnitàOrganizzativa: this.item.UO ? this.item.UO.join(";") : null,//[0],
					IdEdizione: null,
					grouped: 9999,
					titolo: this.item.TITOLOCORSO,
					corso: this.item.IDCorso,
					DO_NOT_UPDATE: true
				}
			},
			getEdizioni: function(){
				this.edizioni = [];
				this.$http.get(localStorage.getItem("path")+"/APIEdizioni?Idcorso="+this.item.IDCorso)
				.then((response) => {
					var res = response.body
                    try {
                        var res = JSON.parse(response.body);
                    } catch (err) {}
                    if(res && res.APIEdizioni){
                    	for(var i = 0; i < res.APIEdizioni.length; i++){
							console.log(Date.now());
							console.log(new Date(res.APIEdizioni[i].DataFine))
							console.log(Date.now() <= new Date(res.APIEdizioni[i].DataFine)) 
							
							if(Date.now() <= new Date(res.APIEdizioni[i].DataFine)){
								this.edizioni.push(res.APIEdizioni[i]);
							}
							
                    		//this.edizioni.push(res.APIEdizioni[i]);
                    	}
                    }
                    this.ready = true;
				}, (err) => {
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