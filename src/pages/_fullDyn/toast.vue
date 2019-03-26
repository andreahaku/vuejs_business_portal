<template>
	<transition :name="transition">
        <div v-if="showToast" class="panel vue-toast_message" :style="alignement">
            <div v-html="message"></div>
            <i v-if="closeBtn" class="fa fa-times" aria-hidden="true" @click="showToast = false"
            style="position: absolute;top: 12px;right: 12px; cursor: pointer;"></i>
        </div>
    </transition>
</template>

<script>
	
	export default {
		props: {
			closeBtn: {
                type: Boolean,
                default: true
            },
            position: {
                type: String,
                default: null
            },
            toastCss: {
                type: Object,
                default: function(){ 
                    return {
                        'border-radius': '3px',
                        'background-color': '#5bc0de',
                        'color': 'white'
                    } 
                }
            },
            slide: {
                type: Boolean,
                default: true
            }, 
            slideFromRight: {
                type: Boolean,
                default: true
            },
            closeIconClass: {
                type: String,
                default: 'fa fa-times'
            },
            timeout: {
                type: Number,
                default: 0
            },
            show: {
                type: Boolean,
                default: false
            },
            message: {
                type: String,
                default: "You need to pass the HTML/String message as vuejs prop"
            },
            transition: {
                type: String,
                default: 'slide'
            }
		},
        mounted: function(){
            if(this.show){
                this.showToast = true;
                this.processToast()
            }
        },
        watch: {
            show: function(){
                this.showToast = this.show;
                if(this.showToast){
                    this.processToast()
                }
            },
            position: function(){
                if(this.position != null){
                    this.alignement = {
                        top: null,
                        left: null,
                        right: null,
                        bottom: null,
                        position: 'absolute'
                    }
                    var angs = this.position.split(' ');
                    for(var i = 0; i < angs.length; i++){
                        switch(angs[i]){
                            case 'left':
                            this.alignement.left = '0px';
                            break;
                            case 'top':
                            this.alignement.top = '0px';
                            break;
                            case 'rigth':
                            this.alignement.right = '0px';
                            break;
                            case 'bottom':
                            this.alignement.bottom = '0px';
                            break;
                        }
                    }
                }
            }
        },
        data: function(){
            return {
                showToast: false,
                alignement: {
                    top: null,
                    left: null,
                    right: null,
                    bottom: null
                }
            }
        },
        methods: {
            processToast: function(){
                if(!this.closeBtn){
                    if(this.timeout > 0){
                        var vm = this;
                        setTimeout(function(){
                            vm.showToast = false;
                        }, vm.timeout);
                    }
                }
            }
        }
	}

</script>

<style scoped>
.vue-toast_message {
    position: relative;
    max-width: 100%;
    padding: 12px 32px 12px 16px;
    text-align: left;
    font-size: initial;
}

.slide-enter {
    opacity: 0;
}

.slide-enter-active {
    animation: slide-in 0.5s ease-out forwards;
    transition: opacity 0.5s;
}

.slide-leave-active {
    animation: slide-out 0.5s ease-out forwards;
    transition: opacity 0.5s;
    opacity: 0;
    position: absolute !important;
}

.slide-move {
    transition: transform 0.5s;
}

@keyframes slide-in {
    from {
        transform: translateX(-100px);
    }
    to {
        transform: translateX(0px);
    }
}

@keyframes slide-out {
    from {
        transform: translateX(0px);
    }
    to {
        transform: translateX(100px);
    }
}
</style>