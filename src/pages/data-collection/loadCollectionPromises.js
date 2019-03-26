export const collection = {
  data: function () {
    return {
      promisesCollection: []
    }
  },
  mounted: function () {
    if (this.enablingObject.collection) {
      this.initCollections();
    }
  },
  methods: {
    initCollections: function () {
      var vm = this;
      this.promisesCollection = [];
      this.promisesCollection.push(function tryGet() {
        return vm.$http.get(localStorage.getItem('path') + '/APIIndici?IDPersona=' + localStorage.getItem("idpersona"))
          .then(function (response) {
            try {
              var res = response.body
              try {
                var res = JSON.parse(response.body);
              } catch (err) { }

              res = res.APIIndici;
              if (res) {
                //TODO FETCHING DATA STRUCTURE
              }

              vm.$store.commit("insertIndici", partecipazioni);
              console.log("resolved indici")
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
            console.log("Generating data...")
            var indici = this.$Test.attivita;

            for (var i = 0; i < indici.length; i++) {
              switch (indici[i].ruolo) {
                case 1:
                  indici[i].ruolo = {
                    id: indici[i].ruolo,
                    label: 'compilatore'
                  };
                  break;
                case 2:
                  indici[i].ruolo = {
                    id: indici[i].ruolo,
                    label: 'approvatore'
                  };
                  break;
                case 3:
                  indici[i].ruolo = {
                    id: indici[i].ruolo,
                    label: 'validatore'
                  };
                  break;
              }
              switch (indici[i].stato) {
                case 1:
                  indici[i].stato = {
                    id: indici[i].stato,
                    label: 'da compilare'
                  };
                  break;
                case 2:
                  indici[i].stato = {
                    id: indici[i].stato,
                    label: 'da approvare'
                  };
                  break;
                case 3:
                  indici[i].stato = {
                    id: indici[i].stato,
                    label: 'da validare'
                  };
                  break;
                case 4:
                  indici[i].stato = {
                    id: indici[i].stato,
                    label: 'validato'
                  };
                  break;
              }
            }
            console.log(indici)
            //console.log(JSON.stringify(indici))
            vm.$store.commit("insertIndici", indici);
            console.log("resolved indici")
            vm.resolved()

          });
      }());
    }
  }
}