<template>
	<!-- TODO PANEL PARTECIPAZIONE -->
	<li class="list-group-item media v-middle">
	    <div class="media-left">
	        <img v-if="!isGrouped" :src="path+item.Immagine" class="img-circle width-70" onerror="this.src = 'images/profile-photo_small.png'" />
	        <i v-else class="fa fa-question-circle-o fa-4x" aria-hidden="true" 
	        style="width: 70px; text-align: center; color: darkgrey;"></i>
	    </div>
	    <div v-if="isGrouped" class="media-body">
	    	<h4>{{item.grouped + " Partecipanti da definire"}}</h4>
	        <h5 style="margin-top: 5px;" v-if="item.uo_label"><strong>Unità organizzativa: </strong>{{" " + item.uo_label}}</h5>
            <hr style="margin: 5px 0px;">
	        <h5 style="margin: 0px;">{{item.titolo}}</h5>
	        <h5 style="margin-top: 5px;"><strong>Edizione: </strong>{{" " + item.label}}</h5>
	    </div>
	    <div v-else class="media-body">
	        <h4>{{item.PERSONA}} - {{'IDP: ' + item.IDPartecipante}} - {{'ID: ' + item.IDPartecipazione}}</h4>
	        <h5 style="margin-top: 5px;" v-if="item.uo_label"><strong>Unità organizzativa: </strong>{{" " + item.uo_label}}</h5>
	        <hr style="margin: 5px 0px;">
	        <h5 style="margin: 0px;">{{item.TITOLOCORSO}}</h5>
	        <h5 style="margin-top: 5px;"><strong>Stato: </strong>{{" " + item.DescrizioneStato}}</h5>
	        <h5 v-if="item.IdEdizione" style="margin-top: 5px;"><strong>Edizione: </strong>{{" " + item.label}}</h5>
	    </div>
	    <div class="media-right">
	        <button v-if="isGrouped" class="btn btn-sm btn-primary paper-shadow relative" @click="open('pick')">Seleziona</button>
	        <button v-else-if="item.IdEdizione" class="btn btn-sm btn-success paper-shadow relative" @click="open('edit')">Modifica</button>
	        <button v-else class="btn btn-sm btn-danger paper-shadow relative" @click="open('schedule')">Programma</button>
	    </div>
	</li>
</template>

<script>
	export default {
	 	props : {
	 		item: Object
	 	},
	 	watch: {
	 		item : function(){
	 			this.getGrouped()
	 		}
	 	},
	 	mounted: function(){
	 		this.getGrouped()
	 	},
	 	data : function(){
	 		return {
	 			isGrouped: false,
	 			path: localStorage.getItem("path")
	 		}
	 	},
	 	methods : {
	 		getGrouped: function(){
	 			this.isGrouped = this.item.IDPartecipante ==  null ? true : false;
	 		},
	 		open: function(param){
	 			var passing = this.item;
	 			
	 			passing.which = param;
	 			this.$emit("open", passing);
	 		}
	 	}
	 }
</script>

<style>

</style>