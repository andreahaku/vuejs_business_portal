<template>
<ul class="nav navbar-nav">
  <li class="dropdown" :class="{active: this.$route.path=='/'}" @click="checkForToggle()">
    <router-link class="dropdown-toggle" to="/" tag='a'>
      Home
    </router-link>
    <!--
      <a class="dropdown-toggle" data-toggle="dropdown" href="#"
      >Studente <span class="caret"></span></a>
      <ul class="dropdown-menu" @click="checkForToggle()">
          <router-link to="/" tag='li' :class="{active: this.$route.path=='/'}">
              <a>Dashboard</a>
          </router-link>
    -->
    <!--
        <router-link to="/app-student-messages" tag="li" :class="{active: this.$route.path=='/app-student-messages'}">
            <a>Chat</a>
        </router-link>

    </ul> -->
  </li>
  <li class="dropdown" v-if="enabledOnes.learning == true">
    <a class="dropdown-toggle" data-toggle="dropdown" href="#">Formazione <span class="caret"></span></a>
    <ul class="dropdown-menu" @click="checkForToggle()">
      <!-- HIDING SELEX
      <router-link to="/student-dashboard" tag="li" :class="{active: checkPathWithParams('/student-dashboard')}">
        <a>Dashboard Formazione</a>
      </router-link>
      -->
      <router-link v-if="!$root.xs" to="/app-directory-grid" tag="li" :class="{active: checkPathWithParams('/app-directory-grid')}">
        <a>Griglia Corsi</a>
      </router-link>
      <router-link to="/app-directory-list" tag="li" :class="{active: checkPathWithParams('/app-directory-list')}">
        <a>Lista Corsi</a>
      </router-link>
      <router-link to="/app-student-courses" tag='li' :class="{active: this.$route.path=='/app-student-courses'}">
        <a>I Miei Corsi</a>
      </router-link>
    </ul>
  </li>
  <li class="dropdown" v-if="enabledOnes.learning == true">
    <a class="dropdown-toggle" data-toggle="dropdown" href="#">
                Forum <span class="caret"></span></a>
    <ul class="dropdown-menu" @click="checkForToggle()">
      <router-link to="/app-forum" tag="li" :class="{active: this.$route.path=='/app-forum'}">
        <a>Forum Dashboard</a>
      </router-link>
    </ul>
  </li>
  <!--------- RECRUITING ---------->
  <li user="dropdown" v-if="enabledOnes.recruiting == true">
    <a class="dropdown-toggle" data-toggle="dropdown" href="#">
                Carriera <span class="caret"></span></a>
    <ul class="dropdown-menu" @click="checkForToggle()">
      <router-link :to="{name: 'jobs'}" tag="li" active-class="active" exact>
        <a>Lista Posizioni Aperte</a>
      </router-link>
    </ul>
  </li>
  <!-- FEEDBACKS  -->
  <li user="dropdown" v-if="enabledOnes.feedback == true">
    <a class="dropdown-toggle" data-toggle="dropdown" href="#">
                Feedback <span class="caret"></span></a>
    <ul class="dropdown-menu" @click="checkForToggle()">
      <router-link :to="{name: 'personaFeedback', params: { idpersona: me}}" tag="li" active-class="active" exact>
        <a>Ricevuti</a>
      </router-link>
      <!--
        <router-link :to="{name: 'given'}" tag="li" active-class="active">
            <a>Assegnati</a>
        </router-link>-->
    </ul>
  </li>
  <!-- TUTOR -->
  <li user="dropdown" v-if="enabledOnes.tutor == true">
    <a class="dropdown-toggle" data-toggle="dropdown" href="#">
                Docente <span class="caret"></span></a>
    <ul class="dropdown-menu" @click="checkForToggle()">
      <router-link :to="{name: 'lista-edizioni'}" tag="li" active-class="active" exact>
        <a>Le Mie Edizioni</a>
      </router-link>
    </ul>
  </li>
  <!--
    <li user="dropdown" v-if="enabledOnes.feedback == true">
        <router-link class="dropdown-toggle" to="/app-ricerca-skill" tag='a'>
            Competenze
        </router-link>
    </li>

    <li user="dropdown" v-if="enabledOnes.schedaValutazione == true">
        <router-link class="dropdown-toggle" to="/scheda-impiegato" tag='a'>
            Scheda Impiegato
        </router-link>
    </li>
  -->
  <li class="dropdown" :class="{active: this.$route.path=='/main-board'}" v-if="enabledOnes.collection== true">
    <router-link class="dropdown-toggle" to="/main-board" tag='a'>
      Bilancio CSR
    </router-link>
    <!--
    <a class="dropdown-toggle" data-toggle="dropdown" href="#"
    >Studente <span class="caret"></span></a>
    <ul class="dropdown-menu" @click="checkForToggle()">
      <router-link to="/" tag='li' :class="{active: this.$route.path=='/'}">
          <a>Dashboard</a>
      </router-link>
    -->
    <!--
      <router-link to="/app-student-messages" tag="li" :class="{active: this.$route.path=='/app-student-messages'}">
          <a>Chat</a>
      </router-link>
    </ul> -->
  </li>
</ul>
</template>
<script>
// aggiunto controllo per collassare automaticamente la navbar quando ho selezionato una voce

import {
  eventBus
} from "../eventbus.js";

export default {
  created() {
    var x = this;
    this.enabledOnes = this.$root.getEnablingObject();
  },
  data: function() {
    return {
      enabledOnes: {},
      me: localStorage.getItem("idpersona")
    }
  },
  methods: {
    checkForToggle() {
      if (window.innerWidth < 768) {
        console.log("pf?")
        $('#main-nav').collapse("toggle");
      }
    },
    checkPathWithParams: function(path) {
      if (this.$route.path.split('/')[1] == path.split('/')[1]) {
        return true;
      }
      return false;
    }
  }
}
</script>
<style>
</style>
