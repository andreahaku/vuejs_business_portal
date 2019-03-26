<template>
    <div class="panel panel-default animated fadeIn">
        <div class="panel-body padding-bottom-none">
            <div class="row">
                <div class="col-xs-10">
                    <div class="form-group form-control-material">
                        <input id="forumSearch" type="text" class="form-control" placeholder="parole chiave da cercare" @blur="filterOut()" v-model="filtro" @keydown.enter="goToList()" />
                        <label for="forumSearch" :class="{condati: labelout}">Ricerca Corso...</label>
                    </div>
                </div>
                <div class="col-xs-2" style="margin-bottom: 0px;">
                    <a href="#" @click.prevent="goToList()" class="btn btn-sm btn-primary paper-shadow relative pull-right" data-z="0.5" data-hover-z="1">
                        <i class="fa fa-search" aria-hidden="true"></i></a>
                </div>
            </div>
        </div>
    </div>
    </div>
</template>
<script>
export default {
    data: function() {
        return {
            filtro: '',
            labelout: false
        }
    },
    methods: {
        goToList: function() {
            if (this.filtro.trim() != "") {
                this.$router.push({
                    name: 'lista',
                    params: {
                        filtro: this.filtro
                    }
                })
            } else {
                this.$router.push({
                    name: 'list'
                })
            }
        },
        filterOut: function() {
            if (this.filtro.trim() != '') {
                this.labelout = true;
            } else {
                this.labelout = false;
            }
        }
    }
}
</script>
<style>
.condati {
    color: #42a5f5 !important;
    font-size: 1rem !important;
    top: -18px !important;
}
</style>
