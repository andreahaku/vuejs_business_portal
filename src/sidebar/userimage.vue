<template>
  <div class="sidebar-block">
    <div class="profile">
      <a href="#" @click.prevent>
        <img class="img-circle width-80" :src="userImg" @error="errImg">
      </a>
      <h4 class="text-display-1 margin-none">{{nomecognome}}</h4>
    </div>
  </div>
</template>
<script>
import { eventBus } from "../eventbus.js";

export default {
  mounted: function() {
    this.$nextTick(function() {
      this.getNomeCognome();
    });
  },
  data: function() {
    return {
      userImg: "../images/profile-photo.png",
      nomecognome: ""
    };
  },
  created: function() {
    var vm = this;
    eventBus.$on("gotAvatar", function(mess) {
      vm.userImg = localStorage.getItem("userAvatar");
    });
  },
  methods: {
    errImg: function() {
      localStorage.setItem("userAvatar", "images/profile-photo_small.png");
      this.userImg = "images/profile-photo_small.png";
    },
    getNomeCognome: function() {
      this.nomecognome = localStorage.getItem("nomecognome");

      if (this.nomecognome == null) {
        var user = this.$root.lsGet("username");
        if (localStorage.getItem("userAvatar") != null) {
          //this.$http.get(localStorage.getItem('path') + '/APIUtenti?Utente=' + user, {
          this.$http
            .get(
              localStorage.getItem("path") +
                "/APIUtenti?IDPersona=" +
                localStorage.getItem("idpersona"),
              {
                headers: {
                  light: "1"
                }
              }
            )
            .then(response => {
              try {
                var utente = response.body;
                try {
                  utente = JSON.parse(response.body);
                } catch (err) {}

                this.nomecognome = utente.APIUtenti[0].Persona;

                localStorage.setItem(
                  "nomecognome",
                  utente.APIUtenti[0].Persona
                );
                localStorage.setItem("nome", utente.APIUtenti[0].NomePersona);
                localStorage.setItem(
                  "cognome",
                  utente.APIUtenti[0].CognomePersona
                );
                localStorage.setItem(
                  "idpersona",
                  utente.APIUtenti[0].IDPersona
                );

                this.userImg = localStorage.getItem("userAvatar");
              } catch (err) {
                if (response.status === 401) {
                  eventBus.$emit("alert", "Sessione scaduta");
                }
              }
            });
        } else {
          console.log("enter");
          this.$http
            .get(
              localStorage.getItem("path") +
                "/APIUtenti?IDPersona=" +
                localStorage.getItem("idpersona")
            )
            .then(response => {
              try {
                var utente = response.body;
                try {
                  utente = JSON.parse(response.body);
                } catch (err) {}
                console.log(utente);

                this.nomecognome = utente.APIUtenti[0].Persona;

                localStorage.setItem(
                  "nomecognome",
                  utente.APIUtenti[0].Persona
                );
                localStorage.setItem("nome", utente.APIUtenti[0].NomePersona);
                localStorage.setItem(
                  "cognome",
                  utente.APIUtenti[0].CognomePersona
                );
                localStorage.setItem(
                  "idpersona",
                  utente.APIUtenti[0].IDPersona
                );
                this.userImg = localStorage.getItem("userAvatar");
              } catch (err) {
                if (response.status === 401) {
                  eventBus.$emit("alert", "Sessione scaduta");
                }
              }
            });
        }
      } else {
        if (localStorage.getItem("userAvatar") != null) {
          this.userImg = localStorage.getItem("userAvatar");
        } else {
          this.loadImg();
        }
      }
    },
    loadImg: function() {
      var user = this.$root.lsGet("username");
      this.$http
        .get(
          localStorage.getItem("path") +
            "/APIUtenti?IDPersona=" +
            localStorage.getItem("idpersona")
        )
        .then(response => {
          var res = response.body;
          try {
            res = JSON.parse(response.body);
          } catch (err) {}

          if (
            res != null &&
            res.APIUtenti != null &&
            res.APIUtenti[0].FOTO != null
          ) {
            this.userImg = res.APIUtenti[0].FOTO;
            localStorage.setItem("userAvatar", this.userImg);
            eventBus.$emit("gotAvatar");
          }
        });
    }
  }
};
</script>
