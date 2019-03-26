<template> </template>

<script>
    
    import { eventBus } from '../../eventbus.js';
    
    export default {
        mounted : function (){
            this.$nextTick(function(){
                this.handleSidebar();
            });
        },
        props: ["default"],
        methods: {
            handleSidebar: function(){
                
                eventBus.$emit("collapseSideIf", this.default);
            }
        }
    }
    
</script>