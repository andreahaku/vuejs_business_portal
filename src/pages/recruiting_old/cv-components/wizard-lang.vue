<template>
  <div class="media">
    <div class="media-body">
      <div class="media v-middle">
        <div class="media-right">
          <h4 class="text-headline margin-none">Conoscenze Linguistiche</h4>
        </div>
      </div>

      <div class="panel-body">
        <div class="panel panel-default paper-shadow row" style="border-width: 0px;">
          <div class="col-sm-2"></div>

          <div class="col-xs-12 col-md-10">
            <div class="col-xs-12 row">
              <div class="form-group col-xs-12 col-md-6" style="padding-left: 0px;">
                <label for="nome" class="col-sm-12 control-label" style="padding-left: 0px;">
                  <strong>*</strong>Madrelingua(e)
                </label>
                <div class="col-sm-12" style="padding-left: 0px;">
                  <input
                    type="text"
                    class="form-control checkableInput"
                    placeholder="Italiana, Italiana e Inglese..."
                    v-model="madrelingua"
                    :class="{'missing': madrelingua.trim()===''}"
                  >
                </div>
              </div>
            </div>

            <transition-group name="roll-fade">
              <form class="form-horizontal row" v-for="(lang, index) in langs" :key="index">
                <div class="form-group col-xs-12 col-md-6">
                  <label for="nome" class="col-sm-12 control-label">
                    <strong>*</strong>Lingua
                  </label>
                  <div class="col-sm-12">
                    <input
                      type="text"
                      class="form-control checkableInput"
                      placeholder="Inglese, Spagnolo..."
                      v-model="lang.required.lingua"
                      :class="{'missing': lang.missingFields.lingua}"
                    >
                  </div>
                </div>
                <div class="form-group col-xs-12 col-md-6">
                  <label for="nome" class="col-sm-12 control-label">Certificazione</label>
                  <div class="col-sm-12">
                    <input
                      type="text"
                      class="form-control checkableInput"
                      placeholder="B2, B1, C1 ..."
                      v-model="lang.required.livello"
                    >
                  </div>
                </div>

                <!--
                                <div class="form-group col-xs-12">
                                  <label for="end" class="col-sm-12 control-label"><strong>* </strong>Comprensione</label>
                                  <div class="col-sm-12">
                                    <input type="text" class="form-control checkableInput" placeholder="Discreta/ Buona/ Ottima" 
                                    v-model="lang.required.comprensione"
                                    :class="{'missing': lang.missingFields.comprensione}">
                                  </div>
                                </div>

                                <div class="form-group col-xs-12">
                                  <label for="end" class="col-sm-12 control-label"><strong>* </strong>Parlato</label>
                                  <div class="col-sm-12">
                                    <input type="text" class="form-control checkableInput" placeholder="Discreto/ Buono/ Ottimo" 
                                    v-model="lang.required.parlato"
                                    :class="{'missing': lang.missingFields.parlato}">
                                  </div>
                                </div>
                -->

                <div class="form-group col-xs-12 col-md-6">
                  <label for="nome" class="col-sm-3 control-label">
                    <strong class="lang-obbl">*</strong>Livello di comprensione
                  </label>
                  <div class="col-sm-9">
                    <form>
                      <input
                        type="radio"
                        name="gender"
                        value="Discreto"
                        v-model="lang.required.comprensione"
                      > Discreto
                      <br>
                      <input
                        type="radio"
                        name="gender"
                        value="Buono"
                        v-model="lang.required.comprensione"
                      > Buono
                      <br>
                      <input
                        type="radio"
                        name="gender"
                        value="Ottimo"
                        v-model="lang.required.comprensione"
                      > Ottimo
                    </form>
                  </div>
                </div>

                <div class="form-group col-xs-12 col-md-6">
                  <label for="nome" class="col-sm-3 control-label">
                    <strong class="lang-obbl">*</strong>Parlato
                  </label>
                  <div class="col-sm-9">
                    <form>
                      <input
                        type="radio"
                        name="gender"
                        value="Discreto"
                        v-model="lang.required.parlato"
                      > Discreto
                      <br>
                      <input
                        type="radio"
                        name="gender"
                        value="Buono"
                        v-model="lang.required.parlato"
                      > Buono
                      <br>
                      <input
                        type="radio"
                        name="gender"
                        value="Ottimo"
                        v-model="lang.required.parlato"
                      > Ottimo
                    </form>
                  </div>
                </div>

                <span class="pull-right hidden-xs">
                  <a
                    class="btn btn-danger btn-flat"
                    style="margin-right: 50px;"
                    @click="deleteObs(index)"
                  >
                    RIMUOVI
                    <i class="fa fa-minus pad" aria-hidden="true"></i>
                  </a>
                </span>

                <span class="center-delete-btn visible-xs">
                  <a class="btn btn-danger btn-flat" @click="deleteObs(index)">
                    RIMUOVI
                    <i class="fa fa-minus pad" aria-hidden="true"></i>
                  </a>
                </span>

                <hr class="visible-xs">
              </form>
            </transition-group>

            <span class="pull-left">
              <a class="btn btn-primary btn-flat" @click="addEmptyForm()">
                AGGIUNGI
                <i class="fa fa-plus pad" aria-hidden="true"></i>
              </a>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { eventBus } from "../../../eventbus.js";

export default {
  mounted() {
    this.$nextTick(function() {});
  },
  created() {
    var vm = this;
    eventBus.$on("pillChanged", function(id) {
      if (id === "lingue") {
        vm.checkRequired();
      }
    });
    eventBus.$on("saveFirstCv", function() {
      vm.save();
    });

    eventBus.$on("choice", this.handleChoice);
    this.e = eventBus._events.choice[eventBus._events.choice.length - 1];

    this.addEmptyForm();
  },
  beforeDestroy() {
    var index = eventBus._events.choice.indexOf(this.e);
    eventBus._events.choice.splice(index, 1);
  },
  data() {
    return {
      valid: 1,

      madrelingua: "Italiana",
      langs: [],
      deleting: 0,

      e: {},
      univoco: "wizard-lang"
    };
  },
  methods: {
    checkRequired() {
      this.valid = 1;
      var missing = [];

      if (this.madrelingua.trim() === "") {
        this.valid = 0;
        missing.push("Madrelingua");
      }

      for (var i = 0; i < this.langs.length; i++) {
        if (this.langs[i].required.lingua.trim() === "") {
          this.valid = 0;
          if (missing.indexOf("Lingua") === -1) {
            missing.push("Lingua");
          }
          this.langs[i].missingFields.lingua = true;
        } else {
          this.langs[i].missingFields.lingua = false;
        }
      }
      this.$emit("isValid", [this.valid, missing]);
    },
    save() {
      this.checkRequired();

      var langs = [];
      for (var i = 0; i < this.langs.length; i++) {
        langs.push(this.langs[i].required);
      }
      var obj = { madrelingua: this.madrelingua, langs: langs };
      this.$emit("got", obj);
    },
    addEmptyForm() {
      var emptyElement = {
        required: {
          lingua: "",
          livello: "",
          comprensione: "Buono",
          parlato: "Buono"
        },
        missingFields: {
          lingua: false,
          comprensione: false,
          comprensione: false
        }
      };
      this.langs.push(emptyElement);
    },
    deleteObs(id) {
      this.deleting = id;
      this.$emit("alert", ["Eliminare questo elemento?", this.univoco]);
    },
    handleChoice($event) {
      if ($event[1] == this.univoco) {
        if ($event[0]) {
          this.langs.splice(this.deleting, 1);
          if (this.langs.length <= 0) {
            this.addEmptyForm();
          }
        }
        this.deleting = 0;
      }
    }
  }
};
</script>

<style scoped>
.pad {
  padding-left: 5px;
}

.control-label {
  text-align: left;
}
</style>