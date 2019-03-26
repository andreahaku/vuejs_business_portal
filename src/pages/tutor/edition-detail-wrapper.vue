<template>
<!-- wraps edition detail container as a SPA page -->
<!-- called in xs -  when detail is a single page -->
<div class="st-pusher" id="content">
    <div class="st-content">
        <div class="st-content-inner padding-none">
            <div class="container-fluid">
                <detail></detail>
            </div>
        </div>
    </div>
</div>
</template>
<script>
import Detail from './edition-detail-container.vue'

export default {
    components: {
        Detail
    }
}
</script>
<style>


</style>