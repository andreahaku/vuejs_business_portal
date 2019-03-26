export const competenceMixin = {
  data: function () {
    return {
      stati_valutazione: this.getStatus()
    }
  },
  methods: {
    getMaxLengthKPI: function () {
      return 20000;
    },
    getMaxLength: function () {
      return 2000;
    },
    getMaxLengthAS: function () {
      return 2000;
    },
    getRatingsVals() {
      var array = [' '];
      array = array.concat(this.getPermessi().ratings);
      return array;
    },
    getFunzioni: function (callback) {
      this.$http.get(localStorage.getItem('path') + "/APIRuoli?ID=.").then((response) => {
        var res = response.body;
        try {
          res = JSON.parse(response.body);
        } catch (err) { };
        var results = []
        if (res && res.APIRuoli) {
          for (var i = 0; i < res.APIRuoli.length; i++) {
            results.push({
              id: res.APIRuoli[i].ID,
              ruolo: res.APIRuoli[i].RUOLO
            })
          }
          callback(results);
        }
      }, (err) => {
        console.log(err);
        callback([]);
      })
    },
    getStatus: function () {
      var bool;
      try {
        bool = this.getEnablingObject.competenzeHIT;
      } catch (err) {
        console.log("Err on getStatus");
        console.log(err);
        return null;
      }

      if (!bool) {
        return null;
      } else {
        var l = this.$root.lang();
        var s = this.$root.getStrings();

        var array = [];
        var states = this.getPermessi().states;
        if (states != null) {
          if (states.translatable) {
            for (var i = 0; i < states.list.length; i++) {
              array.push({
                stato: states.list[i],
                descrizione: s.stati[i][l]
              });
            }
          } else {
            for (var prop in states.list) {
              array.push({
                stato: parseInt(prop),
                descrizione: states.list[prop]
              });
            }
          }
          return array;
        } else {
          return null;
        }
      }
    }
  }
}