<template>
    <div class="navbar navbar-size-large navbar-default navbar-fixed-top bg" role="navigation">
        <div class="container-fluid">
            <logo></logo>
            <div class="collapse navbar-collapse" id="main-nav">
                <dropdownmenu></dropdownmenu>
                <ul class="nav navbar-nav navbar-nav-bordered navbar-right">
                    <notifier></notifier>
                    <userdropdown></userdropdown>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
import logo from './logo.vue'
import dropdownmenu from './dropdownmenu.vue'
import notifier from './notifier.vue'
import userdropdown from './userdropdown.vue'

import {
    eventBus
} from '../eventbus.js';

export default {
    components: {
        logo,
        dropdownmenu,
        notifier,
        userdropdown
    },
    methods: {
        // per far comunicare navbar e sidebar, uso come tramite il padre App.vue
        dispatchEvent: function() {
            eventBus.$emit("collapseSide");
        }
    }
}
</script>
<style>
.navbar-nav .dropdown-menu > li.active > a,
.navbar-nav .dropdown-menu > li a {
    font-weight: 400;
}
</style>
