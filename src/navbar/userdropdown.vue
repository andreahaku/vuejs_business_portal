<template>
<li class="dropdown">
  <a class="dropdown-toggle user" data-toggle="dropdown" href="#" @click="userClicked"><img class="img-circle" :src="userImg" width="40" @error="errImg"> {{nome}}
            <span class="caret"></span></a>
  <ul class="dropdown-menu" role="menu" @click="checkForToggle()">
    <router-link :to="{name: 'cv'}" tag="li" v-if="enabledOnes.curriculum">
      <a>Il Mio Profilo</a>
    </router-link>
    <!--
    <router-link :to="{name: 'profilo'}" tag="li" v-else>
      <a>Il Mio Profilo</a>
    </router-link>
    -->
    <router-link :to="{name: 'documenti'}" tag="li" v-if="enabledOnes.documenti">
      <a>Il Miei Documenti</a>
    </router-link>
    <router-link :to="{name: 'rubrica'}" tag="li" v-if="enabledOnes.rubrica">
      <a>Rubrica Aziendale</a>
    </router-link>

    <router-link :to="{name: 'dashboardConfiguration'}" tag="li">
      <a>Configurazione Home</a>
    </router-link>

    <router-link :to="{name: 'calendar-wrapper'}" v-if="enabledOnes.calendar" tag="li">
      <a>Agenda</a>
    </router-link>

    <!--  HIDE SELEX  -->
      <li><a @click.prevent="showSelectLang()">{{s.selezionaLingua[l]}}</a></li>
  

    <li v-if="swpsw == true"><a @click.prevent="showUpdatePsw()">{{s.cambiaPassword[l]}}</a></li>
    <li>
      <a href="login.html">Logout</a>
    </li>
  </ul>
</li>
</template>
<script>
import {
  eventBus
} from '../eventbus.js';

export default {
  mounted: function() {
    this.$nextTick(function() {
      this.getNome();
      this.enabledOnes = this.$root.getEnablingObject();
      try {
        this.swpsw = JSON.parse(this.$root.lsGet("configs")).swpsw;
      } catch (err) {
        console.log("Error caught in swpsw detection")
        console.log(err)
      }
    });
  },
  created: function() {
    var vm = this;
    eventBus.$on('gotAvatar', function(mess) {
      vm.userImg = localStorage.getItem("userAvatar");
    });
  },
  data: function() {
    return {
      userImg: localStorage.getItem("userAvatar"),
      nome: '',
      enabledOnes: {},

      s: this.$root.getStrings(),
      l: this.$root.lang(),
      swpsw: false
    }
  },
  methods: {
    errImg: function() {
      localStorage.setItem("userAvatar", 'images/profile-photo_small.png');
      this.userImg = 'images/profile-photo_small.png';
    },
    showUpdatePsw: function() {
      eventBus.$emit('changePsw');
    },
    showSelectLang: function() {
      eventBus.$emit('selectLang');
    },
    getNome: function() {

      this.nome = localStorage.getItem('nome')
      if (this.nome == null) {
        var user = this.$root.lsGet("username")

        this.$http.get(localStorage.getItem('path') + '/APIUtenti?IDPersona=' + localStorage.getItem("idpersona"), {
          headers: {
            light: "1"
          }
        }).then((response) => {
          try {
            var utente = response.body;
            try {
              utente = JSON.parse(response.body)
            } catch (err) {}

            this.nome = utente.APIUtenti[0].NomePersona

            localStorage.setItem("nomecognome", utente.APIUtenti[0].Persona)
            localStorage.setItem("nome", utente.APIUtenti[0].NomePersona)
            localStorage.setItem("cognome", utente.APIUtenti[0].CognomePersona)
            localStorage.setItem("idpersona", utente.APIUtenti[0].IDPersona)
            eventBus.$emit("login");
          } catch (err) {
            if (response.status === 401) {
              eventBus.$emit("alert", "Sessione scaduta");
            }
          }
        })
      } else {
        eventBus.$emit("login");
      }
    },
    checkForToggle: function() {
      if (window.innerWidth < 768) {
        $('#main-nav').collapse("toggle");
      }
    },
    userClicked: function() {
      if (window.innerWidth < 768) {
        setTimeout(function(){
            var objDiv = document.getElementById("main-nav");
            console.log(objDiv.scrollHeight)
            objDiv.scrollTop = objDiv.scrollHeight;
        },100)
      }
    }
  }
}
</script>
