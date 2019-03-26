import {
  eventBus
} from './eventbus.js';
import {
  competenze
} from './pages/competenzeCommon/competenze.js';
import {
  collection
} from './pages/data-collection/loadCollectionPromises.js';

export const onLoadMixin = {
  mounted: function () {
    this.$nextTick(function () {
      this.init();
    })
  },
  mixins: [competenze, collection],
  data: function () {
    return {
      enablingObject: this.$root.getEnablingObject(),
      path: localStorage.getItem("path"),
      promises: [],
      errorDetected: false,
      //conto le promises risolte, segna loaded solo quando coincidono con promises.length
      count: 0,
      loading: true
    }
  },
  methods: {
    init: function () {
      var vm = this;
      this.promises = [];
      this.errorDetected = false;
      this.count = 0;

      if (this.enablingObject.feedback) {
        this.promises.push(function tryGet() {
          return vm.$http.get(vm.path + "/APIFeedbackRicevuti?ID=.", {
            headers: {
              idPersona: localStorage.getItem("idpersona")
            }
          }).then(function (response) {
            try {
              var res = response.body
              try {
                var res = JSON.parse(response.body);
              } catch (err) { }

              var submitMyFeedback = [];
              if (res && res.APIFeedbackRicevuti) {
                for (var i = 0; i < res.APIFeedbackRicevuti.length; i++) {
                  var f = res.APIFeedbackRicevuti[i];
                  submitMyFeedback.push({
                    id: f.ID,
                    idCompetenza: f.IDSkill,
                    idValutato: f.IDDestinatario,
                    nomeValutato: f.Destinatario,
                    idValutatore: f.IDAutore,
                    nomeValutatore: f.Autore,
                    idRichiedente: f.IDRichiedente,
                    nomeRichiedente: f.Richiedente,
                    dataRichiesta: f.DataRichiesta ? new Date(f.DataRichiesta).toLocaleDateString() : null,
                    data: f.DataFeedback ? new Date(f.DataFeedback).toLocaleDateString() : null,
                    punteggio: f.Feedback,
                    commento: f.CommentoFeedback,
                    avatar: f.ImmagineAutore
                  })
                }
              }
              vm.$store.commit("insertMyFeedback", submitMyFeedback);
              console.log("resolved myfeeds")
              vm.resolved()
            } catch (err) {
              console.log("ERR: " + err)
              throw {
                nome: "Feedback Ricevuti",
                err: tryGet
              };
            }
          }, function (err) {
            console.log(err);
          })
        }());
        this.promises.push(function tryGet() {
          return vm.$http.get(vm.path + "/APIFeedbackRichiesti?ID=.", {
            headers: {
              idPersona: localStorage.getItem("idpersona")
            }
          }).then(function (response) {
            try {
              var res = response.body
              try {
                var res = JSON.parse(response.body);
              } catch (err) { }

              var submitOthersFeedback = [];
              if (res && res.APIFeedbackRichiesti) {
                for (var i = 0; i < res.APIFeedbackRichiesti.length; i++) {
                  var f = res.APIFeedbackRichiesti[i];
                  submitOthersFeedback.push({
                    id: f.ID,
                    idCompetenza: f.IDSkill,
                    idValutatore: f.IDAutore,
                    nomeValutatore: f.Autore,
                    idValutato: f.IDDestinatario,
                    nomeValutato: f.Destinatario,
                    idRichiedente: f.IDRichiedente,
                    nomeRichiedente: f.Richiedente,
                    dataRichiesta: f.DataRichiesta ? new Date(f.DataRichiesta).toLocaleDateString() : null,
                    avatar: f.ImmagineDestinatario
                  })
                }
              }
              vm.$store.commit("insertOthersFeedback", submitOthersFeedback);
              console.log("resolved othersfeeds")
              vm.resolved()
            } catch (err) {
              throw {
                nome: "Feedback Richiesti",
                err: tryGet
              };
            }
          }, function (err) {
            console.log(err);
          })
        }());
      }
      if (this.enablingObject.rubrica) {
        this.promises.push(function tryGet() {
          return vm.$http.get(vm.path + "/APIUO?ID=.").then(function (response) {
            var submitUo = [];
            try {
              var res = response.body
              try {
                var res = JSON.parse(response.body);
              } catch (err) { }

              if (res && res.APIUO) {
                for (var i = 0; i < res.APIUO.length; i++) {
                  submitUo.push({
                    id: res.APIUO[i].ID,
                    nome: res.APIUO[i].UO
                  })
                }
              }
              vm.$store.commit("insertUo", submitUo);
              console.log("resolved uo")
              vm.resolved()
            } catch (err) {
              throw {
                nome: "Uo",
                err: tryGet
              };
            }
          }, function (err) {
            console.log(err);
          })
        }());
        this.promises.push(function tryGet() {
          return vm.$http.get(vm.path + "/APIRuoli?ID=.").then(function (response) {
            var submitRuoli = [];
            try {
              var res = response.body
              try {
                var res = JSON.parse(response.body);
              } catch (err) { }

              if (res && res.APIRuoli) {
                for (var i = 0; i < res.APIRuoli.length; i++) {
                  submitRuoli.push({
                    id: res.APIRuoli[i].ID,
                    nome: res.APIRuoli[i].RUOLO
                  })
                }
              }
              vm.$store.commit("insertRuoli", submitRuoli);
              console.log("resolved ruoli")
              vm.resolved()
            } catch (err) {
              throw {
                nome: "Ruoli",
                err: tryGet
              };
            }
          }, function (err) {
            console.log(err);
          })
        }());
        this.promises.push(function tryGet() {
          return vm.$http.get(vm.path + "/APICompetenze?ID=.").then(function (response) {
            var submitCompetenze = [];
            try {
              var res = response.body
              try {
                var res = JSON.parse(response.body);
              } catch (err) { }

              if (res && res.APICompetenze) {
                for (var i = 0; i < res.APICompetenze.length; i++) {
                  if (res.APICompetenze[i].COMPETENZA.trim() != "") {
                    submitCompetenze.push({
                      id: res.APICompetenze[i].ID,
                      nome: res.APICompetenze[i].COMPETENZA
                    })
                  }
                }
              }
              vm.$store.commit("insertCompetenze", submitCompetenze);
              console.log("resolved competenze")
              vm.resolved()
            } catch (err) {
              throw {
                nome: "Competenze",
                err: tryGet
              };
            }
          }, function (err) {
            console.log(err);
          })
        }());
        this.promises.push(function tryGet() {
          return vm.$http.get(vm.path + "/APIPersone?IDPERSONA=" + localStorage.getItem("idpersona")).then(function (response) {
            var uos;
            try {
              var res = response.body
              try {
                var res = JSON.parse(response.body);
              } catch (err) { }

              if (res && res.APIPersone) {
                if (res.APIPersone.length > 1) {
                  uos = [];
                  for (var i = 0; i < res.APIPersone.length; i++) {
                    uos.push(res.APIPersone[i].IDUO);
                  }
                  uos = uos.join(';');
                } else {
                  uos = res.APIPersone[0].IDUO;
                }
                localStorage.setItem("idUo", uos);
              }
              console.log("resolved persona uo")
              vm.resolved()
            } catch (err) {
              // in caso di errore restituisco la funzione per ri-eseguire la get/promise
              throw {
                nome: "Persone",
                err: tryGet
              };
            }
          }, function (err) {
            console.log(err);
          });
        }());
      }
      if (this.enablingObject.learning) {
        this.promises.push(function tryGet() {
          return vm.$http.get(localStorage.getItem('path') + '/APICorsi?ID=.', {
            headers: {
              light: "1"
            }
          }).then(function (response) {
            var corsi;
            try {
              var res = response.body
              try {
                var res = JSON.parse(response.body);
              } catch (err) { }
              corsi = res.APICorsi;
              vm.$store.commit("insertCorsi", corsi);
              console.log("resolved corsi")
              vm.resolved()
            } catch (err) {
              // in caso di errore restituisco la funzione per ri-eseguire la get/promise
              throw {
                nome: "Corsi",
                err: tryGet
              };
            }
          }, function (err) {
            console.log(err);
          });
        }());
        this.promises.push(function tryGet() {
          return vm.$http.get(localStorage.getItem('path') + '/APIPartecipazioni?IDPartecipante=' + localStorage.getItem("idpersona"))
            .then(function (response) {
              var partecipazioni;
              try {
                var res = response.body
                try {
                  var res = JSON.parse(response.body);
                } catch (err) { }

                if (res && res.APIPartecipazioni) {
                  partecipazioni = res.APIPartecipazioni;
                  vm.$store.commit("insertPartecipazioni", partecipazioni);
                  console.log("resolved partecipazioni")
                }
                vm.resolved()
              } catch (err) {
                // in caso di errore restituisco la funzione per ri-eseguire la get/promise
                throw {
                  nome: "Partecipazioni",
                  err: tryGet
                };
              }
            }, function (err) {
              console.log(err);
            });
        }());
        this.promises.push(function tryGet() {
          return vm.$http.get(localStorage.getItem('path') + '/APIPersonaUO?IDPersona=' + localStorage.getItem("idpersona") + "&Responsabile=I;S")
            .then(function (response) {
              try {
                var res = response.body
                try {
                  var res = JSON.parse(response.body);
                } catch (err) { }

                res = res.APIPersonaUO;
                if (res) {
                  var uos = [];
                  for (var i = 0; i < res.length; i++) {
                    uos.push(res[i].IDUnitàOrganizzativa);
                  }
                  vm.$root.inCharge.is = true;
                  vm.$root.inCharge.uos = uos;
                  console.log("in charge of")
                  console.log(vm.$root.inCharge)
                }
                console.log("resolved persona uo")
                vm.resolved()
              } catch (err) {
                // in caso di errore restituisco la funzione per ri-eseguire la get/promise
                throw {
                  nome: "Partecipazioni",
                  err: tryGet
                };
              }
            }, function (err) {
              console.log(err);
            });
        }());
      }
      if (this.enablingObject.competenze || this.enablingObject.competenzeHIT) {
        this.promises = this.promises.concat(this.promisesCompetenze)
        console.log("AGGIUNTE PROMISES COMPETENZE")
      }
      if (this.enablingObject.collection) {
        this.promises = this.promises.concat(this.promisesCollection)
        console.log("AGGIUNTE PROMISES DATA COLLECTION")
      }
      if (this.promises.length > 0) {
        Promise.all(this.promises).then(function () {
          vm.load()
        }, function (err) {
          if (err.nome != null) {
            vm.errorDetected = true;
            console.log("!ERROR LOADING: " + err.nome);
            err.err()
          } else {
            console.log("ERRORE PROMISE ALL")
            console.log(err);
          }
        })
      } else {
        this.loading = false;
      }
    },
    resolved: function () {
      this.count++;
      if (this.errorDetected) {
        if (this.count == this.promises.length) {
          this.load();
        }
      }
    },
    load: function () {
      console.log("resolved all");
      this.$store.commit("loaded");
      this.loading = false;
      eventBus.$emit("feedsGreen");
    }
  }
}