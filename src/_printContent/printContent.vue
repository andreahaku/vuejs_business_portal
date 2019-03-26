<template>
	<div>
	</div>
</template>

<script>	
import printMixin from './printContentMixin.js'

export default {
	mixins: [printMixin],
	props: {
		setup: {
            type: Function,
            default(option) {
                return { 
	                'dynamic': null,
	                'container': "#content",
	                'ignore_selector': null,
	                'css_custom': null
	            }
            }
        },
        trigger: {
            type: Boolean,
            default: false
        }
	},
	watch: {
		trigger: function(){
			this.url = location.href;
			var selectors = this.setup();
			this.printContent(selectors.dynamic, selectors.container, selectors.ignore_selector, selectors.css_custom);
		}
	}
}
</script>
	
<style>
	
</style>