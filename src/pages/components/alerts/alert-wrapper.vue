<template>
	<transition name="modal">
        <div class="modal-mask" v-show="showAlert">
            <div class="modal-wrapper" :class="{'md-wrapper': isMd, 'xs-wrapper': !isMd}">
            <component :is="which" @close="close" :item="item"></component>
            </div>
        </div>
    </transition>
</template>

<script>

	import edit from './edit.vue'
	import schedule from './schedule.vue'
	import pick from './pick.vue'

	export default {
		components: {
			edit,
			schedule,
			pick
		},
		props: {
			item: Object,
			show: Boolean
			// pick - edit - schedule
		},
		mounted: function() {
			this.$nextTick(function(){
				this.isMd = window.innerWidth >= 992 ? true : false;
			})
		},
		data: function(){
			return {
				which: "",
				showAlert: false,
				component: '',
				isMd: false
			}
		},
		methods: {
			close: function($event){
				this.$emit("close", $event);
			}
		},
		watch: {
			item: function(){
				this.which = this.item.which;
			},
			show: function(){
				this.showAlert = this.show;
			}
		}
	}
</script>

<style>

.md-wrapper .modal-container {
	width: 50%;
	padding: 10px 15px;
}

.xs-wrapper {
	margin: 5px;
}
.xs-wrapper .modal-container {
	width: 95%;
}
	
</style>