<template>
	<div class="st-pusher" id="content">
        <div class="st-content">
            <div class="st-content-inner padding-none">
                <div class="container-fluid">
                   <calendar></calendar>
                </div>
            </div>
        </div>
        <sidejsonly :default="false"></sidejsonly>
    </div>
</template>

<script>
 
import sidejsonly from '../components/side-default-jsonly.vue'
import calendar from './calendar.vue'

export default {
    components: {
        calendar,
        sidejsonly
    }
}
</script>