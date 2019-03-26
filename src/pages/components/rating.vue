<template>
    <p class="margin-none" :class="{small: !isbig, large: isbig}">
        <span v-for="star in full" class="fa fa-fw fa-2x fa-star text-yellow-800 m1"></span>
        <span v-for="nostar in empty" class="fa fa-fw fa-2x fa-star-o text-yellow-800 m2"></span>
    </p>
</template>
<script>
    export default {
        mounted : function (){
            this.rate();
        },
        props: ['stars', 'isbig'],
        data : function(){
            return {
                big: false,
                full: '',
                empty: ''
            }
        },
        methods : {
            rate : function (){
                
                if(this.isbig){
                    this.big = this.isbig;
                }
                
                if(this.stars > 5){
                    this.full = this.stars%5;
                } else {
                    this.full = this.stars;
                }
                this.empty = 5-this.full;
                
            }
        }
    }
</script>
<style>
</style>