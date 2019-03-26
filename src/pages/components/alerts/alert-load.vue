<template>
	<transition name="modal">
        <div class="modal-mask">
            <div class="modal-wrapper" :class="{'md-wrapper': isMd, 'xs-wrapper': !isMd}">
				<div class="modal-container panel with-nav-tabs panel-success">
					<div v-if="!loading">
						<!--
				        <div class="modal-header">
				            <slot name="header">
				                <h3>Seleziona Partecipanti</h3>
				                <h4>{{item.titolo}}</h4>
				                <h5><strong>Edizione:</strong>{{" " + noteSede}}</h5>
				            </slot>
				        </div>
				    	-->
				        <div class="modal-body" style="text-align:center">
				            <slot name="body">
				            	<div v-if="!success" style="color: #42b983">
				            		<i class="fa fa-check fa-5x" aria-hidden="true"></i>
				            		<h3 style="color: #42b983">{{success_message}}</h3>
				            	</div>
				            	<div v-else style="color: #942a25">
				            		<i class="fa fa-times fa-5x" aria-hidden="true"></i>
				            		<h3  style="color: #942a25">{{error_message}}</h3>
				            	</div>
				            </slot>
				        </div>
				        <div class="modal-footer">
				            <slot name="footer">
				                <span class="pull-left"></span>
				                <button class="btn btn-sm btn-primary" @click="close">
				                    CHIUDI
				                </button>
				            </slot>
				        </div>
			        </div>
			    	<div v-else class="modal-header" style="text-align: center;">
			        	<clip-loader :loading="loading" :color="'#42b983'" size="40px"></clip-loader>
			        </div>
			    </div>
			</div>
		</div>
	</transition>
</template>

<script>
	import ClipLoader from 'vue-spinner/src/ClipLoader.vue'

	export default {
		components:{
			ClipLoader
		},
		props:{
			promises: Array,
			success_message: String,
			error_message: String
		},
		mounted: function(){
			this.$nextTick(function(){
				this.isMd = window.innerWidth >= 992 ? true : false;
			})
			this.launchPromises()
		},
		data: function(){
			return {
				isMd: false,
				loading: true,
				success: false	
			}
		},
		methods: {
			launchPromises: function(){
				if(this.promises && this.promises.length > 0){
					//promises all
					console.log("PROMISES ALL")
					Promise.all(this.promises).then(() => {
						this.loading = false;
						this.success = true;
						console.log(this.success)
	                }, (err) => {
	                	console.log(err);
	                	var vm = this;
	                	setTimeout(function(){
	                		vm.loading = false;
	                		vm.success = false;
	                		console.log(vm.success)
	                	}, 1000)
	                });
				}
			},
			close: function(){
				this.$emit("close", this.success);
			}
		}
	}
</script>

<style scoped>
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