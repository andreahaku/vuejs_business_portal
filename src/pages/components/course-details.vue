<template>
	<div class="panel panel-default paper-shadow" data-z="0.5" data-hover-z="1" data-animated>
        <div class="panel-heading">
            <h4 class="text-headline">Corso</h4>
        </div>
        <div class="panel-body">
            <p class="text-caption margin-none">
                <i class="fa fa-clock-o fa-fw"></i> {{corso.ore}} ore &nbsp;
                <i class="fa fa-calendar fa-fw"></i> 27/02/17
                <br/>
                <i class="fa fa-user fa-fw"></i> Insegnante: Adriano Darmiano
                <br/>
                <i class="fa fa-mortar-board fa-fw"></i> Studenti Max: 50
                <br/>
                <i class="fa fa-check fa-fw"></i> Studenti Attuali: 30
            </p>
        </div>
        <hr class="margin-none" />
        <div class="panel-body text-center">
            <p><a class="btn btn-primary btn-sm paper-shadow relative" data-z="1" data-hover-z="2" data-animated href="#"
                @click.prevent="iscrivimi()">Iscrivimi</a></p>
            <p v-if="isChief"><a class="btn btn-success btn-sm paper-shadow relative" data-z="1" data-hover-z="2" data-animated href="#"
                @click.prevent="showSuggestion=true">Proponi</a></p>
            <p v-if="isChief"><a class="btn btn-warning btn-sm paper-shadow relative" data-z="1" data-hover-z="2" data-animated href="#" @click.prevent="iscrivi_persone()">Iscrivi Persone</a></p>
        </div>
        <ul class="list-group">
            <li class="list-group-item">
                <a href="#" class="text-light" @click.prevent=""><i class="fa fa-facebook fa-fw"></i> Condividi su facebook</a>
            </li>
            <li class="list-group-item">
                <a href="#" class="text-light" @click.prevent=""><i class="fa fa-twitter fa-fw"></i> Condividi su Twitter</a>
            </li>
        </ul>
        <alertIscrizioni v-if="showEntry" @close="showEntry = false" :me="me"
        :item="{TITOLOCORSO: corso.titolo, UO: uo, IDCorso: corso.id}" ></alertIscrizioni>
        <alertProposte v-if="showSuggestion" @close="showSuggestion = false"
        :item="{TITOLOCORSO: corso.titolo, UO: uo}"></alertProposte>
    </div>
</template>

<script>
import alertIscrizioni from './alerts/alert-iscrizioni.vue'
import alertProposte from './alerts/alert-proposte.vue'

	
	export default {
		props: {
			corso: Object,
			uo: Array
		},
		components: {
			alertIscrizioni,
			alertProposte
		},
		mounted: function(){
			if(this.$root.inCharge){
                this.isChief = true;
            }
		},
		data: function(){
			return {
				showSuggestion: false,
				showEntry: false,
				isChief: false,
				me: false
			}
		},
		methods: {
			iscrivimi: function(){
                this.me = true;
                this.showEntry = true;
            },
            iscrivi_persone: function(){
                this.me = false;
                this.showEntry = true;
            }
		}
	}
</script>

<style>
	
</style>