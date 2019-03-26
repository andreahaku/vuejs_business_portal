<template>
    <div id="rat">
        <span v-for="star in stars" class="fa fa-fw fa-2x text-yellow-800"
            :class="{'fa-star-o': star > selected, 'fa-star': star <= selected}"
            @click="select(star)"
            @mouseover="over(star)"
            @mouseout="leave()"
        ></span>
    </div>
</template>

<script>
     export default {
         mounted(){
            this.$nextTick(function(){
                if(this.rating == null){
                    this.selected = 0;
                    this.old = 0;
                }
            });
         },
         props: {
             rating: {}
         },
         data(){
             return {
                stars: [1,2,3,4,5],
                selected: this.rating,
                old: this.rating
             }
         },
         watch: {
            rating(){
                if(this.rating == 0){
                    this.selected = 0;
                    this.old = 0;
                }
            }  
         },
         methods: {
             over(ind){
                 this.selected = ind;
             },
             leave(){
                 this.selected = this.old;
             },
             select(ind){
                 this.selected = ind;
                 this.old = ind;
                 this.$emit("star", this.selected);
             }
         }
     }
</script>

<style scoped>
    #rat{
        padding: 10px;
    }
</style>