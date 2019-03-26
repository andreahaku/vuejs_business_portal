<template>
    <div class="st-pusher" id="content">
        <div class="st-content">
            <div class="st-content-inner padding-none">
                <div class="container-fluid">
                    <br>
                    <div class="row">
                        <div class="item col-xs-12 col-lg-6">
                            <div class="panel panel-default paper-shadow" data-z="0.5">
                                <ul class="list-group">
                                    <li class="list-group-item">
                                        <div class="media v-middle">
                                            <div class="media-body">
                                                <h4 class="text-headline margin-none">Feedback Categories</h4>
                                                <p class="text-subhead text-light">List of all the available feedback categories.</p>
                                            </div>
                                        </div>
                                    </li>
                                    <li v-for="(fb,i) in feedback" class="list-group-item media v-middle">
                                        <div class="media-left">
                                            <div class="icon-block">
                                                <donut-chart class="donut" :id="'donut'+i" :data="[{label: '1 Star',value: Math.floor(Math.random()*11)}, {label: '2 Stars',value: Math.floor(Math.random()*11)}, {label: '3 Stars',value: Math.floor(Math.random()*11)}, {label: '4 Stars',value: Math.floor(Math.random()*11)}, {label: '5 Stars',value: Math.floor(Math.random()*11)}]" colors='[ "#ff0000", "#bf3f00", "#7f7f00", "#3fbf00","#00ff00" ]' resize="true">
                                            </div>
                                        </div>
                                        <div class="media-body">
                                            <h4 class="text-subhead categoria margin-none">
                                                {{fb.nome}}
                                                    <span class="freccia-cat"><span class="fa fa-angle-right" aria-hidden="true"></span></span>
                                            </h4>
                                            <ul class="list-group">
                                                <li class="list-group-item subcategoria" v-for="n in fb.sub">
                                                    {{n}}
                                                    <span class="freccia"><span class="fa fa-angle-right" aria-hidden="true"></span></span>
                                                </li>
                                            </ul>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <br/>
                        </div>
                        <div class="item col-xs-12 col-lg-6">
                            <widgetreceived></widgetreceived>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <sidejsonly :default="true"></sidejsonly>
    </div>
</template>
<script>
import widgetreceived from './components/widget-received.vue'
import sidejsonly from './components/side-default-jsonly.vue'

import Raphael from 'raphael/raphael'
global.Raphael = Raphael

import {
    DonutChart
} from 'vue-morris'

var fb_init = {
    "feedbacks": [{
        nome: "Consulting Process",
        icon: "business_center",
        sub: [
            "Data evaluation",
            "Problem solving",
            "Autonomous deliverable production, storyboard definition",
            "Methodologies application",
            "Design and prepare client meeting/workshops",
            "Conduct interviews",
            "Trustful relationships with relevant client members"
        ]
    }, {
        nome: "Competency Knowledge",
        icon: "school",
        sub: [
            "Growing Industry know how",
            "Competency specialization",
            "Good methodology knowledge",
            "Know How organization"
        ]
    }, {
        nome: "Engagement Management",
        icon: "mood",
        sub: [
            "Effective collaboration with other work streams & teams"
        ]
    }, {
        nome: "Business Development",
        icon: "domain",
        sub: [
            "Contribution to writing proposals",
            "Awareness of client problems and improvement areas"
        ]
    }, {
        nome: "People management & Practice development",
        icon: "group",
        sub: [
            "Support to internal projects and initiatives"
        ]
    }]
}


import {
    eventBus
} from '../eventbus.js';

export default {
    mounted() {
        this.$nextTick(function() {
            if (localStorage.getItem("TokenScaduto")) {
                localStorage.removeItem("TokenScaduto");
                eventBus.$emit("alert", "Sessione scaduta");
            }
        })
    },
    components: {
        widgetreceived,
        sidejsonly,
        DonutChart
    },
    data: function() {
        return {
            feedback: fb_init.feedbacks,
            donutData: [{
                label: 'Red',
                value: 300
            }, {
                label: 'Blue',
                value: 50
            }, {
                label: 'Yellow',
                value: 100
            }]
        }
    },
    watch: {
        '$route': function() {
            if (localStorage.getItem("TokenScaduto")) {
                localStorage.removeItem("TokenScaduto");
                eventBus.$emit("alert", "Sessione scaduta");
            }
        }
    }
}
</script>
<style scoped>
.donut {
    height: inherit !important;
}

.icon-block {
    background-color: #ececec;
    border-radius: 100%;
}

.text-headline,
.text-subhead,
.list-group-item {
    font-weight: 300;
}

.subcategoria {
    font-size: 1.3rem;
}

.subcategoria:hover {
    background-color: #ececec;
}

.categoria {
    padding-bottom: 5px;
    font-size: 1.5rem;
    font-weight: 400;
    border-bottom: 1px solid black;
    opacity: 1;
}

.freccia {
    position: absolute;
    right: 10px;
    opacity: 0.3;
}

.freccia-cat {
    position: absolute;
    right: 25px;
    opacity: 0.3;
}
</style>
