<template>
    <div class="st-pusher" id="content">
        <!-- sidebar effects INSIDE of st-pusher: -->
        <!-- st-effect-3, st-effect-6, st-effect-7, st-effect-8, st-effect-14 -->
        <!-- this is the wrapper for the content -->
        <div class="st-content">
            <router-view></router-view>
        </div>
    </div>
</template>
<script>
export default {

    mounted() {},
        data() {
            return {
                people: [],
                peopleOk: false
            }
        },
        methods: {}
}
</script>
<style>
</style>
