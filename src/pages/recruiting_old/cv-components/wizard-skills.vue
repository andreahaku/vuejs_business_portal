<template>
  <div class="media">
    <div class="media-body">
      <div class="media v-middle">
        <div class="media-right">
          <h4 class="text-headline margin-none">Capacità e competenze</h4>
        </div>
      </div>

      <div class="panel-body">
        <div class="panel panel-default paper-shadow row" style="border-width: 0px;">
          <div class="col-sm-2"></div>

          <div class="col-xs-12 col-md-10">
            <transition-group name="roll-fade">
              <form class="form-horizontal row" v-for="(skill, index) in skills" :key="index">
                <div v-if="gotReqs" class="form-group col-xs-12">
                  <label for="nome" class="col-sm-12 control-label">
                    <strong>*</strong>Nome
                  </label>
                  <div class="col-xs-11" style="padding-right: 0px;">
                    <input
                      type="text"
                      class="form-control"
                      v-model="skill.required.nome"
                      @keydown="filterReqs(index, skill.required.nome)"
                      :class="{'missing': skill.missingFields.nome}"
                      @blur="blur(index)"
                      @focus="focus(index)"
                    >
                  </div>
                  <div class="col-xs-1" style="padding-left: 0px;">
                    <button
                      class="btn btn-default"
                      type="button"
                      data-toggle="collapse"
                      :href="'#dropdownMenuReq'+index"
                      aria-expanded="false"
                      :aria-controls="'dropdownMenuReq'+index"
                      style="background-color: #eeeeee; height: 36px; padding-top: 14px;"
                      @click="focus(index)"
                    >
                      <span class="caret" style="position: relative; top: -5px;"></span>
                    </button>
                  </div>
                  <div
                    class="col-xs-12 collapse"
                    :id="'dropdownMenuReq'+index"
                    style="
                                        position: absolute;
                                        top: 60px;
                                        z-index: 2; 
                                        max-height: 240px;
                                        overflow-y: auto;
                                        padding-right: 0px;"
                  >
                    <div class="panel panel-default" style="padding: 5px 5px;">
                      <div
                        v-for="req in reqs"
                        class="panel-body item-req"
                        style="padding: 3px 5px;"
                        @click="thisReq(index, req.ID, req.nome)"
                      >{{req.nome}}</div>
                    </div>
                  </div>
                </div>

                <div class="form-group col-xs-12">
                  <label for="end" class="col-sm-12 control-label">
                    <strong>*</strong>Valutazione
                  </label>

                  <form style="padding: 5px;">
                    <div
                      class="col-xs-12 col-sm-10"
                      style="margin-top: 7px;"
                      :class="{'missing': skill.missingFields.livello}"
                    >
                      <input
                        :id="'rangeIE'+index"
                        type="range"
                        min="1"
                        :max="skill.itemVals.length"
                        v-model="skill.required.livello"
                        @mouseup="leaveIE(index)"
                      >
                    </div>
                    <div
                      class="col-xs-12 col-sm-2"
                      style="margin-top: 5px;"
                    >{{skill.itemVals[skill.required.livello-1].desc}}</div>
                    <div class="col-xs-12 col-lg-2" style="position: relative;">
                      <div
                        v-if="skill.loadingLiv"
                        class="uil-rolling-css"
                        style="transform:scale(0.12); 
                                            position: absolute; top: -100px; right: 0px; "
                      >
                        <div>
                          <div></div>
                          <div></div>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>

                <div class="form-group col-xs-12">
                  <label for="end" class="col-sm-12 control-label">Dettagli</label>
                  <div class="col-sm-12">
                    <textarea
                      rows="2"
                      cols="50"
                      class="form-control checkableInput"
                      placeholder="Note .."
                      style="margin-left: 0px; padding-left: 10px;"
                      v-model="skill.required.note"
                    ></textarea>
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
import { requirementsHandlerMixin } from "./requirementsHandlerMixin.js";

export default {
  mounted() {
    this.$nextTick(function() {
      this.findReq();
    });
  },
  mixins: [requirementsHandlerMixin],
  created() {
    var vm = this;
    eventBus.$on("pillChanged", function(id) {
      if (id === "competenze") {
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

      skills: [],
      index: 0,
      deleting: 0,
      last: 0,

      isIE: /*@cc_on!@*/ false || !!document.documentMode,
      e: {},
      univoco: "wizard-skill"
    };
  },
  methods: {
    leaveIE(i) {
      if (this.isIE) {
        this.skills[i].required.livello = document.getElementById(
          "rangeIE" + i
        ).value;
      }
    },
    checkRequired() {
      this.valid = 1;
      var missing = [];

      for (var i = 0; i < this.skills.length; i++) {
        if (
          this.skills[i].required.nome.trim() === "" ||
          this.skills[i].required.nome.trim() != this.skills[i].required.goodOne
        ) {
          this.valid = 0;
          if (missing.indexOf("Nome competenza") === -1) {
            missing.push("Nome competenza");
          }
          this.skills[i].missingFields.nome = true;
        } else {
          this.skills[i].missingFields.nome = false;
        }
        if (this.skills[i].required.livello == 0) {
          this.valid = 0;
          if (missing.indexOf("Valutazione") === -1) {
            missing.push("Valutazione");
          }
          this.skills[i].missingFields.livello = true;
        } else {
          this.skills[i].missingFields.livello = false;
        }
      }
      this.$emit("isValid", [this.valid, missing]);
    },
    thisReq(i, id, name) {
      this.skills[i].required.idReq = id;
      this.skills[i].required.nome = name;
      this.skills[i].required.goodOne = name;
      this.searchLevel(i, id);
      this.afterAssigned(i, id);
    },
    save() {
      this.checkRequired();

      var skills = [];
      for (var i = 0; i < this.skills.length; i++) {
        skills.push(this.skills[i].required);
      }

      this.$emit("got", skills);
    },
    addEmptyForm() {
      var emptyElement = {
        required: {
          nome: "",
          livello: 1,
          note: "",
          idReq: -1,

          id: this.last + 1
        },
        missingFields: {
          nome: false,
          livello: false
        },
        itemVals: this.vals,
        loadingLiv: false
      };
      this.last++;
      this.skills.push(emptyElement);
    },
    deleteObs(id) {
      this.deleting = id;
      this.$emit("alert", ["Eliminare questo elemento?", this.univoco]);
    },
    handleChoice($event) {
      if ($event[1] == this.univoco) {
        if ($event[0]) {
          this.skills.splice(this.deleting, 1);
          if (this.skills.length <= 0) {
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

.item-req:hover {
  background-color: #42a5f5;
  color: white;
  cursor: pointer;
}

div.missing {
  border-color: navajowhite;
  border-style: solid;
}
</style>