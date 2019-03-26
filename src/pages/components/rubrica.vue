<template>
    <div>
        <div class="col-xs-12" style="padding: 0px;">
            <h5 class="text-headline" style="margin-top:2px;">Cerca nella Rubrica</h5>
        </div>
        <div class="col-xs-12 panel panel-default animated fadeIn" style="margin-bottom: 10px;">
            <div class="panel-body  padding-bottom-none">
                <div class="row">
                    <div class="col-xs-12 col-sm-5">
                        <div class="form-group form-control-material">
                            <input id="search_cognome" type="text" class="form-control" placeholder="cognome da cercare" @blur="filterOut_cognome()" v-model="cognome" />
                            <label for="search_cognome" :class="{condati: labelout_cognome}">Cognome...</label>
                        </div>
                    </div>
                    <div class="col-xs-12 col-sm-5">
                        <div class="form-group form-control-material">
                            <input id="search_nome" type="text" class="form-control" placeholder="nome da cercare" @blur="filterOut_nome()" v-model="nome" />
                            <label for="search_nome" :class="{condati: labelout_nome}">Nome...</label>
                        </div>
                    </div>
                    <div class="col-xs-12 col-sm-2" style="text-align: right; margin-bottom: 10px;">
                        <a href="#" @click.prevent="goToRubrica()" class="btn btn-sm btn-primary paper-shadow relative" data-z="0.5" data-hover-z="1">Cerca</a>
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
            nome: '',
            cognome: '',
            filtro: '',
            labelout_nome: false,
            labelout_cognome: false
        }
    },
    methods: {
        goToRubrica() {
            this.$router.push({
                name: 'rubricaCognomeNome',
                params: {
                    cognome: this.cognome.trim().length > 0 ? this.cognome.trim() : '+',
                    nome: this.nome.trim().length > 0 ? this.nome.trim() : '+'
                }
            })
        },
        filterOut_nome: function() {
            if (this.nome.trim() != '') {
                this.labelout_nome = true;
            } else {
                this.labelout_nome = false;
            }
        },
        filterOut_cognome: function() {
            if (this.cognome.trim() != '') {
                this.labelout_cognome = true;
            } else {
                this.labelout_cognome = false;
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

.lista {
    font-size: 1.3rem;
    font-weight: 300;
    padding: 10px;
    border: 1px solid #e9e9e9;
    border-radius: 5px;
}

.dd {
    margin-top: 5px;
}
</style>
