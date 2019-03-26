<template>
	<div id="wrapper" style="background-color: white"> <!-- bgColor Bug? :style="bgStyle" -->
		<div id="wrapped_chat" v-if="messages.length > 0" style="max-height: 400px; overflow-y: auto;">
			<message :key="item.ID" v-for="(item, index) in messages" :item="item" :mycss="mycss" :othcss="othcss"></message>
		</div>
		<div id="answer" :class="{'small_answer' : $root.xs}">
			
			<div class="media" style="margin: 0px;">
				<div v-if="!$root.xs" class="media-left media-img">
			    <p class="wr" style="margin: 0px;">
			      <img class="media-object" :src="me">
			    </p>
			  </div>
			  <div class="media-body mine">
			    	<textarea class="card" cols="30" :rows="$root.xs ? 2 : 3" style="resize: vertical; color: #222;"
			    	placeholder="Scrivi messaggio..." v-model="new_message"></textarea>
			  </div>
			  <div class="media-right media-img">
			  	<button type="button" class="btn btn-primary" @click="send()">
			  		<i class="fa fa-paper-plane" aria-hidden="true"></i>
			  	</button>
			  </div>
			</div>
		</div>
	</div>
</template>
<script>
import Message from './chat/message.vue';
import {handleDataMixin} from './chat/handleDataMixin.js'

	export default {
		props: {
			bgimg: {
				type: String,
				default: null
			},
			metaTxtColor: {
				type: String,
				default: "black"
			},
			bgcolor: {
				type: String,
	            default: 'white'
	        },
			mycss: {
				type: Object,
	            default: function () {
	                return { 
	                    'background-color': '#2ECC71',
	                    color: 'white' 
	                }
	            }
	        },
			othcss: {
				type: Object,
	            default: function () {
	                return { 
	                    'background-color': 'steelblue',
	                    color: 'white' 
	                }
	            }
        	},
        	fetchItem: {
	            type: Function,
	            default(item) {
	                return item;
	            }
	        },
	        items: Array 
		},
    	mixins: [handleDataMixin],
		components: {
			Message
		},
		mounted: function(){
			this.bgStyle["background-color"] = this.bgcolor;
			this.bgStyle["color"] = this.metaTxtColor;
			if(this.bgimg != null){
				this.bgStyle["background-image"] = 'url('+this.bgimg+')';
				console.log(this.bgStyle)
			}

			this.$nextTick(function(){
				$('#wrapped_chat').animate({
	                scrollTop: 9999
	            });
			})
		},
		data: function(){
			return {
				messages: [],
				me: localStorage.getItem("userAvatar"),
				bgStyle: {},
				new_message: null
			}
		},
		methods: {
			send: function(){
				if(this.new_message != null && this.new_message.trim() != ''){
					this.messageAdded(this.new_message);
				}
			}
		}
	}
</script>
<style scoped>
	#wrapped_chat {
		width: 100%;
		max-height: 100%;
		height: 100%;
	}
	#answer {
		background-color: #eee;
		padding: 12px 16px;
		text-align: center;
		border-top: thin groove;
		border-bottom: thin groove;
	}
	#answer.small_answer {
		padding: 4px 8px;
	}

	button {
		border-radius: 50%;
		padding-left: 10px;
		width: 40px;
		height: 40px;
	}
	textarea {
		width: 75%;
		border-radius: 4px;
	}

	img {
	  width: 60px;
	  height: 60px;
	  border-radius: 50%;
	  background-color: #f3f3f3;
	  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
	}

	.media-img {
		padding-top: 0px;
		text-align: center;
	}

	.card {
		padding: 6px 8px;
		width: 100%;
		display: block;
		font-size: 15px;
		background-color: white;
		color: color;
		border-radius: 3px;
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
	}

	.media-left,
	.media-right {
		vertical-align: middle !important;
	}

</style>