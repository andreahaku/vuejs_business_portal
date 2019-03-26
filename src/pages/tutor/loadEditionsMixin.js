import {
  eventBus
} from '../../eventbus.js';

export const loadEditionsMixin = {
  mounted: function () {
    this.$nextTick(function () {
      if (this.$store.getters.getEdizioni == null) {
        console.log("init")
        this.init();
      } else {
        //!!!!  app-edition-list methods che tolgo perche è gia compreso nel secondo !!!!
        //this.editionInit();
        this.secondary_init();
      }
    })

  },
  data: function () {
    return {
      path: localStorage.getItem("path"),
      promises: [],
      loading: true,
      //vettore che conterrà gli id dei corsi
      idCorsi: [],
      //vettore che conterrà sia gli id che i nomi dei corsi
      corsi: []
    }
  },
  methods: {
    init: function () {
      this.$http.get(this.path + "/APIDocentiEdizioni?IDPersona=" + localStorage.getItem("idpersona")).then(function (response) {
        var res = response.body
        try {
          var res = JSON.parse(response.body);
        } catch (err) { }
        if (res && res.APIDocentiEdizioni) {
          var ids = [];
          var indexedFlags = {};
          for (var i = 0; i < res.APIDocentiEdizioni.length; i++) {
            ids.push(res.APIDocentiEdizioni[i].IdEdizione);
            //indicizzo oggetto con l'info sui permessi
            indexedFlags[res.APIDocentiEdizioni[i].IdEdizione] = res.APIDocentiEdizioni[i].modificaProgramma == -1;
          }
          ids = ids.join(";");
          var edition_promises = [];
          //this.$root.splitterGet(this.path + "/APIEdizioni?IdEdizione=", ids.split(";"));
          this.$http.get(this.path + "/APIEdizioni?IdEdizione=" + ids).then(function (response) {
            var submitEditions = [];
            var res = response.body
            try {
              var res = JSON.parse(response.body);
            } catch (err) { }
            console.log(res)
            if (res && res.APIEdizioni) {
              for (var i = 0; i < res.APIEdizioni.length; i++) {
                var e = res.APIEdizioni[i];

                submitEditions.push({
                  IdEdizione: e.IdEdizione,
                  Idcorso: e.Idcorso,
                  Corso: e.Idcorso,
                  Edizione: e.Edizione,
                  DataInizio: e.DataInizio,
                  DataFine: e.DataFine,
                  NumPartecipanti: e.NumPartecipanti,
                  NumCompletamenti: null,
                  Stato: e.Stato,
                  ProgrammaCorso: e.ProgrammaCorso,
                  ModificaProgramma: indexedFlags[e.IdEdizione],
                  Allegati: null
                })

                if (this.idCorsi.indexOf(e.Idcorso) == -1) {

                  this.idCorsi.push(e.Idcorso);
                }
              }

              //Variabile che conterrà tutti gli id dei corsi come stringa
              var ids_corsi = this.idCorsi.join(";")
              this.$http.get(this.path + "/APICorsi?ID=" + ids_corsi, {
                headers: {
                  light: "1"
                }
              }).then(function (response1) {
                var res1 = response1.body;
                try {
                  var res1 = JSON.parse(response1.body);
                } catch (err) { }
                if (res1 && res1.APICorsi) {
                  for (var ii = 0; ii < res1.APICorsi.length; ii++) {

                    this.corsi.push({
                      id: res1.APICorsi[ii].ID,
                      name: res1.APICorsi[ii].Titolo
                    });
                  }

                  this.loading = false;
                  console.log(submitEditions)
                  this.$store.commit("insertEdizioni", submitEditions);
                  this.editionInit();
                  console.log("resolved edizioni")
                } else {
                  //Empty API Corsi
                  this.loading = false;
                  console.log(submitEditions)
                  this.$store.commit("insertEdizioni", submitEditions);
                  this.editionInit();
                }

              }, function (err) {
                console.log("ERR in API Corsi Ferching Edition Images")
                console.log(err)
                this.loading = false;
                this.$store.commit("insertEdizioni", submitEditions);
                this.editionInit();
              });
            }
          })
        } else {
          this.loading = false;
        }
      }, function (err) {
        console.log("Error loading tutor's editions");
        console.log(err);
        this.loading = false;
      })
    },
    secondary_init: function () {

      var ids_corsi = this.idCorsi.join(";")
      this.$http.get(this.path + "/APICorsi?ID=" + ids_corsi, {
        headers: {
          light: "1"
        }
      }).then(function (response1) {
        var res1 = response1.body;
        try {
          var res1 = JSON.parse(response1.body);
        } catch (err) { }
        if (res1 && res1.APICorsi) {

          for (var ii = 0; ii < res1.APICorsi.length; ii++) {

            this.corsi.push({
              id: res1.APICorsi[ii].ID,
              name: res1.APICorsi[ii].Titolo
            });
          }

          this.editionInit();
          console.log("resolved edizioni")
        }
        this.loading = false;
      })
    }
  }
}