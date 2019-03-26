<template>
  <div class="media">
    <div class="media-body">
      <div class="media v-middle">
        <div class="media-right">
          <h4 class="text-headline margin-none">Informazione Personali</h4>
        </div>
      </div>
      <div class="panel-body">
        <div class="panel panel-default paper-shadow row" style="border-width: 0px;">
          <div class="col-sm-3"></div>
          <form class="form-horizontal row col-xs-12 col-md-9">
            <div class="form-group col-xs-12 col-md-6">
              <label for="nome" class="col-sm-12 control-label">
                <strong>*</strong>Nome
              </label>
              <div class="col-sm-12">
                <input
                  type="text"
                  class="form-control checkableInput"
                  placeholder="Il tuo nome"
                  v-model="required.nome"
                  :class="{'missing': missingFields.nome}"
                >
              </div>
            </div>
            <div class="form-group col-xs-12 col-md-6">
              <label for="nome" class="col-sm-12 control-label">
                <strong>*</strong>Cognome
              </label>
              <div class="col-sm-12">
                <input
                  type="text"
                  class="form-control checkableInput"
                  placeholder="Il tuo cognome"
                  v-model="required.cognome"
                  :class="{'missing': missingFields.cognome}"
                >
              </div>
            </div>
            <div class="form-group col-xs-12 col-md-6">
              <label for="start" class="col-sm-12 control-label">
                <strong>*</strong>Indirizzo
              </label>
              <div class="col-sm-12">
                <input
                  type="text"
                  class="form-control checkableInput"
                  placeholder="Via , numero"
                  v-model="required.indirizzo"
                  :class="{'missing': missingFields.indirizzo}"
                >
              </div>
            </div>
            <div class="form-group col-xs-12 col-md-6">
              <label for="start" class="col-sm-12 control-label">CAP</label>
              <div class="col-sm-12">
                <input
                  type="text"
                  class="form-control optionalInput"
                  placeholder="Cap"
                  v-model="unrequired.cap"
                >
              </div>
            </div>
            <div class="form-group col-xs-12 col-md-6">
              <label for="start" class="col-sm-12 control-label">
                <strong>*</strong>Città
              </label>
              <div class="col-sm-12">
                <input
                  type="text"
                  class="form-control checkableInput"
                  placeholder="Dove vivi"
                  v-model="required.citta"
                  :class="{'missing': missingFields.citta}"
                >
              </div>
            </div>
            <picker
              v-if="required.provincia != ''"
              :wizard="true"
              :val="unrequired.provincia"
              @changed="updateProv"
            ></picker>
            <div class="form-group col-xs-12 col-md-6">
              <label for="start" class="col-sm-12 control-label">
                <strong>*</strong>Telefono
              </label>
              <div class="col-sm-12">
                <input
                  type="text"
                  class="form-control checkableInput"
                  placeholder="Il tuo numero"
                  v-model="required.tel"
                  :class="{'missing': missingFields.tel}"
                >
              </div>
            </div>
            <div class="form-group col-xs-12 col-md-6">
              <label for="start" class="col-sm-12 control-label">E-mail</label>
              <div class="col-sm-12">
                <input
                  type="text"
                  class="form-control optionalInput"
                  placeholder="Il tuo indirizzo e-mail"
                  v-model="unrequired.mail"
                >
              </div>
            </div>
            <div class="form-group col-xs-12 col-md-6">
              <label for="start" class="col-sm-12 control-label">Cittadinanza</label>
              <div class="col-sm-12">
                <input
                  type="text"
                  class="form-control optionalInput"
                  placeholder="La tua cittadinanza"
                  v-model="unrequired.cittadinanza"
                >
              </div>
            </div>
            <div class="form-group col-xs-12 col-md-6">
              <label for="end" class="col-sm-12 control-label">
                <strong>*</strong>Data di nascita
              </label>
              <div class="col-sm-12">
                <input
                  type="date"
                  class="form-control checkableInput"
                  placeholder="gg/mm/aaaa"
                  v-model="required.birth"
                  :class="{'missing': missingFields.birth}"
                >
              </div>
            </div>
            <div class="form-group col-xs-12 col-md-6">
              <label for="end" class="col-sm-12 control-label">
                <strong>*</strong>Sesso
              </label>
              <div class="col-sm-12">
                <select
                  id="select"
                  class="form-control select2 optionalInput"
                  v-model="required.sesso"
                >
                  <option value="M">M</option>
                  <option value="F">F</option>
                </select>
              </div>
            </div>
            <div class="form-group col-xs-12" style="padding-top: 10px;">
              <label for="nome" class="col-sm-12 control-label">Presentazione</label>
              <div class="col-sm-12">
                <div class="form-group">
                  <textarea
                    rows="5"
                    cols="50"
                    class="form-control optionalInput"
                    placeholder="Presentati.."
                    v-model="unrequired.intro"
                    style="margin-left: 10px;"
                  ></textarea>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { eventBus } from "../../../eventbus.js";
import picker from "./picker.vue";

export default {
  mounted() {
    var vm = this;
    this.$nextTick(function() {
      this.fill();
    });
  },
  created() {
    var vm = this;
    eventBus.$on("pillChanged", function(id) {
      if (id === "anagrafica") {
        vm.checkRequired();
      }
    });
    eventBus.$on("saveFirstCv", function() {
      vm.save();
    });
  },
  components: {
    picker
  },
  data() {
    return {
      required: {
        nome: "",
        cognome: "",
        indirizzo: "",
        citta: "",
        tel: "",
        birth: "",
        sesso: "M"
      },
      unrequired: {
        cap: "",
        cittadinanza: "",
        mail: "",
        intro: "",
        provincia: "fc"
      },
      valid: 1,

      missingFields: {
        nome: false,
        cognome: false,
        indirizzo: false,
        citta: false,
        tel: false,
        birth: false
      },

      isChrome: !!window.chrome && !!window.chrome.webstore
    };
  },
  methods: {
    checkRequired() {
      this.valid = 1;
      var missing = [];

      if (this.required.nome.trim() === "") {
        this.valid = 0;
        missing.push("Nome");
        this.missingFields.nome = true;
      } else {
        this.missingFields.nome = false;
      }
      if (this.required.cognome.trim() === "") {
        this.valid = 0;
        missing.push("Cognome");
        this.missingFields.cognome = true;
      } else {
        this.missingFields.cognome = false;
      }
      if (this.required.indirizzo.trim() === "") {
        this.valid = 0;
        missing.push("Indirizzo di residenza");
        this.missingFields.indirizzo = true;
      } else {
        this.missingFields.indirizzo = false;
      }
      if (this.required.citta.trim() === "") {
        this.valid = 0;
        missing.push("Città di residenza");
        this.missingFields.citta = true;
      } else {
        this.missingFields.citta = false;
      }
      if (this.required.tel.trim() === "") {
        this.valid = 0;
        missing.push("Numero di telefono");
        this.missingFields.tel = true;
      } else {
        this.missingFields.tel = false;
      }
      if (this.required.birth.trim() === "") {
        this.valid = 0;
        missing.push("Data di nascita");
        this.missingFields.birth = true;
      } else {
        if (!this.isChrome && !checkDateFormat(this.required.birth, "Oggi")) {
          this.valid = 0;
          missing.push("Data di nascita - Formato errato");
          this.missingFields.birth = true;
        } else {
          this.missingFields.birth = false;
        }
      }
      this.$emit("isValid", [this.valid, missing]);
    },
    save() {
      this.checkRequired();

      var anagraphics = this.required;

      anagraphics.cap = this.unrequired.cap;
      anagraphics.cittadinanza = this.unrequired.cittadinanza;
      anagraphics.mail = this.unrequired.mail;
      anagraphics.intro = this.unrequired.intro;
      anagraphics.provincia = this.unrequired.provincia;

      this.$emit("got", anagraphics);
    },
    updateProv($event) {
      this.unrequired.provincia = $event;
    },
    fill() {
      if (
        localStorage.getItem("nomewiz") != null &&
        localStorage.getItem("nomewiz") != ""
      ) {
        this.required.nome = localStorage.getItem("nomewiz");
      }
      if (
        localStorage.getItem("cognomewiz") != null &&
        localStorage.getItem("cognomewiz") != ""
      ) {
        this.required.cognome = localStorage.getItem("cognomewiz");
      }
      if (
        localStorage.getItem("mailwiz") != null &&
        localStorage.getItem("mailwiz") != ""
      ) {
        this.unrequired.mail = localStorage.getItem("mailwiz");
      }
    }
  }
};
</script>
<style scoped>
.control-label {
  text-align: left;
  padding-bottom: 5px;
}

.missing {
  background-color: blanchedalmond;
  border-width: 2px;
  border-color: navajowhite;
}
</style>
