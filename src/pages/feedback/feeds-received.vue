<template>
    <div class="st-content-inner padding-none">
        <div class="container-fluid">
            <br>
            <div class="row">
                <div class="item col-xs-12 col-lg-6">
                    <div class="panel panel-default paper-shadow" data-z="0.5">
                        <ul class="list-group">
                            <li class="list-group-item tit">
                                <div class="media v-middle">
                                    <div class="media-body">
                                        <h4 class="text-headline margin-none">Feedback Categories</h4>
                                        <p class="text-subhead text-light">List of all the available feedback categories. Select to filter.</p>
                                        <button class="btn btn-primary btn-sm reset" @click="changeFilters('', '')">RESET</button>
                                    </div>
                                </div>
                            </li>
                        </ul>
                        <ul class="list-group feedback-list">
                            <li v-for="(fb,i) in feedback" class="list-group-item media v-middle">
                                <div class="media-left">
                                    <div class="icon-block">
                                        <donut-chart class="donut" :id="'donut'+i" :data="[{label: '1 Star',value: Math.floor(Math.random()*11)}, {label: '2 Stars',value: Math.floor(Math.random()*11)}, {label: '3 Stars',value: Math.floor(Math.random()*11)}, {label: '4 Stars',value: Math.floor(Math.random()*11)}, {label: '5 Stars',value: Math.floor(Math.random()*11)}]" colors='[ "#ff0000", "#bf3f00", "#7f7f00", "#3fbf00","#00ff00" ]' resize="true"></donut-chart>
                                    </div>
                                </div>
                                <div class="media-body">
                                    <h4 class="text-subhead categoria margin-none" @click="changeFilters(fb.nome, '')">
                                        {{fb.nome}}
                                            <span class="freccia-cat"><span class="fa fa-angle-right" aria-hidden="true"></span></span>
                                    </h4>
                                    <ul class="list-group">
                                        <li class="list-group-item subcategoria" v-for="n in fb.sub" @click="changeFilters(fb.nome, n)">
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
                    <widgetreceived :name="filter" :subname="sub"></widgetreceived>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import widgetreceived from './widget-received.vue'

import Raphael from 'raphael/raphael'
global.Raphael = Raphael

import {
    DonutChart
} from 'vue-morris'

export default {
    mounted() {
            this.getFeedbacks();

            var h_finestra = $(window).height();
            $(".feedback-list").height(h_finestra - 265);
            $(".noDash #feeds").css('max-height', (h_finestra - 265) + 'px');

            window.addEventListener('resize', this.handleResize);
        },
        data() {
            return {
                feedback: [],
                filter: '',
                sub: ''
            }
        },
        components: {
            widgetreceived,
            DonutChart
        },
        methods: {
            getFeedbacks() {
                var get = this.$store.getters.getFeedbacks;
                if (get != null) {
                    this.feedback = get;
                } else {
                    this.$store.commit("initFeedbacks");
                    this.feedback = this.$store.getters.getFeedbacks;
                }
            },
            changeFilters(nome, sub) {
                this.filter = nome;
                this.sub = sub;
            },
            handleResize() {
                var h_finestra = $(window).height();
                $(".noDash #feeds").css('max-height', (h_finestra - 265) + 'px');
            }
        }
}
</script>
<style scoped>
.feedback-list {
    height: 75vh;
    overflow-y: auto;
}

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
    padding-left: 20px;
}

.subcategoria:hover,
.categoria:hover {
    background-color: #f6f6f6;
}

.categoria {
    padding-left: 7px;
    padding-top: 5px;
    padding-bottom: 5px;
    font-size: 1.5rem;
    font-weight: 400;
    border-bottom: 5px solid #ececec;
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

.reset {
    position: absolute;
    top: 10px;
    right: 10px;
}
</style>
