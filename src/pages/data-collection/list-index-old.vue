<template>
    <li class="list-group-item media v-middle" :class="[$parent.active == item.idIndice ? 'active' : '', classes[item.stato.id - 1]]">
	    
	    <div class="media-right" style="text-align: center; padding: 5px">
	        
	        <i class="fa fa-2x" :class="icons[item.tipo]" aria-hidden="true" style="padding-top: 5px;"></i>
	    </div>
	    <div  class="media-body">
	        <div style="padding: 5px;">
	        	<h5 style="margin: 0px 0px 6px 0px;"><strong>Stato: </strong>
				{{" " + item.stato.label}}</h5>
		        <h4>{{item.nome}}</h4>
	        </div>
	    </div>
		<hr style="margin: 5px 0px;">
	    <div class="row" style="padding: 0px 5px; margin: 0px;">
	    	<div class="col-xs-8" style="padding: 0px;">
	    		<h5 style="margin: 0px;">{{item.path}}</h5>
	    	</div>
	    	<div class="col-xs-4" style="padding: 0px; text-align: right;">
	    		<button class="btn action paper-shadow relative" @click="open()"    	
	    		:class="item.action.class">{{item.action.nome}}</button>
	    	</div>
	    </div>
	</li>
</template>
<script>
	export default {
		props: {
			item: Object
		},
		mounted: function(){
		},
		data: function(){
			return {
				icons: {
					indicatore: "fa-table",
					contenuto: "fa-file-text-o"
				},
				classes: ['b', 'y', 'v', 'g']
			}
		},
		methods: {
			open: function(){
				if(this.$parent.active != this.item.idIndice){
					this.$parent.active = this.item.idIndice;
					this.$emit("openDetail", this.item);
				}
			}
		}
	}
</script>
<style scoped>
	li {
		padding: 5px 10px 5px 5px; 
		border-left-width: 8px;
	}
	h4, h5 {color: inherit;}

	li.active, li:hover {
		background-color: #333 !important;
		color: white
	}
	li.active.g, li.g:hover{
		border-left-color: #4caf50;
	}
	li.active.g strong, li.g:hover strong {
		color: #4caf50;
	}
	li.active.y, li.y:hover {
		border-left-color: #f0ad4e;
	}
	li.active.y strong, li.y:hover  strong {
		color: #f0ad4e;
	}
	li.active.v, li.v:hover {
		border-left-color: #b366ff;
	}
	li.active.v strong, li.v:hover strong {
		color: #b366ff;
	}
	li.active.b, li.b:hover {
		border-left-color: #42a5f5
	}
	li.active.b strong, li.b:hover strong {
		color: #42a5f5;
	}

	.btn.action {
		font-size: smaller;
		padding: 3px 6px;
	}
	button {
		width: 62px;
	}
	.btn-validate {
		background-color: #b366ff;
		color: white;
	}
	.btn-validate:hover {
		background-color: #9933ff;
	}
</style>