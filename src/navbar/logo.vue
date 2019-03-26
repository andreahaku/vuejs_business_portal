<template>
    <div class="navbar-header">
        <button class="navbar-toggle collapsed" data-target="#main-nav" data-toggle="collapse" type="button">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span></button>
        <div class="navbar-brand navbar-brand-primary navbar-brand-logo navbar-nav-padding-left container-fluid">
            <div class="row">
                <div class="hidden-xs col-sm-3">
                    <a class="btn btn-primary" type="button" id="ooh" @click="dispatchEvent()">
                        <i class="fa fa-bars"></i></a>
                </div>
                <div class="col-xs-12 col-sm-9">
                    <span v-if="!logo" style="font-weight:100;font-size:2rem;text-align: center;">{{title}}</span>
                    <div v-else>
                        <img class="logo img-rounded" :src="logo">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {
    eventBus
} from '../eventbus.js';

export default {
    mounted: function() {
        this.$nextTick(function() {
            this.init();
        })
    },
    data: function() {
        return {
            title: '',
            logo: ''
        }
    },
    methods: {
        // per far comunicare navbar e sidebar, uso come tramite il padre App.vue
        dispatchEvent: function() {
            eventBus.$emit("collapseSide");
        },
        init: function() {
            var j = this.$root.lsGet("configs");
            if (j != null) {
                j = JSON.parse(j);
                this.title = j.title;
                this.logo = j.logo_menu;
                document.getElementById("indexTitle").innerHTML = j.title;
            }
        }
    }
}
</script>
