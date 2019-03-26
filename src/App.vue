<template>
  <!-- <button id="show-modal" @click="showModal = true">Show Modal</button> -->
  <div id="app" class="st-container">
    <alert :show="showModal" :message="message" @closed="showModal = false;"></alert>
    <check :show="showCheck" @closed="showCheck = false;"></check>
    <modal :show="showPswChange" @closed="showPswChange = false;"></modal>
    <alert-select :show="showSelLang" @closed="showSelLang = false;"></alert-select>
    <alert-renew-login :show="showRenewLogin" @closed="showRenewLogin = false;"></alert-renew-login>
    <navbar></navbar>
    <sidebar></sidebar>
    <div
      v-if="loading"
      class="uil-rolling-css hidden-xs"
      style="transform:scale(0.71);
        position: absolute; margin: 0 auto; top: 150px; right: 0px; left: 250px;"
    >
      <div>
        <div></div>
        <div></div>
      </div>
    </div>
    <div
      v-if="loading"
      class="uil-rolling-css visible-xs-block"
      style="transform:scale(0.71);
        position: absolute; margin: 0 auto; top: 150px; right: 0px; left: 0px;"
    >
      <div>
        <div></div>
        <div></div>
      </div>
    </div>
    <router-view v-if="logged && !loading"></router-view>
  </div>
</template>
<script>
import navbar from "./navbar/navbar.vue";
import sidebar from "./sidebar/sidebar.vue";
import footerline from "./footer/footerline.vue";

import alert from "./pages/components/alert.vue";
import check from "./pages/components/alert-check.vue";
import modal from "./pages/components/alert-psw-modal.vue";
import alertSelect from "./pages/components/alert-select.vue";
import alertRenewLogin from "./pages/components/alert-renew-login.vue";

import { eventBus } from "./eventbus.js";
import { onLoadMixin } from "./onLoadMixin.js";

export default {
  name: "app",
  mixins: [onLoadMixin],
  beforeCreate: function() {
    if (!this.$root.lsGet("username") || !this.$root.lsGet("configs")) {
      location.pathname = "/login.html";
    }
  },
  mounted: function() {
    eventBus.$emit("sideUpdate");
    if (
      localStorage.getItem("lastFound") &&
      localStorage.getItem("lastFound") != "/"
    ) {
      //this.showCheck = true;
    } else if (localStorage.getItem("lastFound") == "/") {
      localStorage.removeItem("lastFound");
    }
  },
  created: function() {
    var vm = this;
    eventBus.$on("alert", function(mess) {
      vm.showModal = true;
      vm.message = mess;
    });
    eventBus.$on("changePsw", function() {
      vm.showPswChange = true;
    });
    eventBus.$on("renewLogin", function() {
      vm.showRenewLogin = true;
    });
    eventBus.$on("selectLang", function() {
      vm.showSelLang = true;
    });
    eventBus.$on("collapseSideIf", function(bool) {
      eventBus.$emit("collapseSideFromApp", bool, vm.firstLoad);
      vm.firstLoad = false;
    });
    eventBus.$on("login", function() {
      vm.logged = true;
    });
  },
  data: function() {
    return {
      firstLoad: true,
      logged: false,
      showModal: false,
      showCheck: false,
      showPswChange: false,
      showSelLang: false,
      showRenewLogin: false,
      message: ""
    };
  },
  components: {
    navbar,
    sidebar,
    footerline,

    alert,
    check,
    modal,
    alertSelect,
    alertRenewLogin
  }
};
</script>
<style>
.st-content {
  background-color: #eee !important;
}

.st-content-inner {
  overflow-y: auto;
}

.btn {
  font-weight: 300;
}

label {
  font-weight: 300 !important;
}

.title-shrinked {
  font-size: 20px;
  line-height: 1.2;
  text-align: center;
}

.center-align {
  text-align: center;
}

.i-b {
  display: inline-block;
}

.roll-fade-enter {
  opacity: 0;
}
.roll-fade-enter-active {
  animation: slide-in 0.5s ease-out forwards;
  transition: opacity 0.5s;
}
.roll-fade-leave-active {
  animation: slide-out 0.5s ease-out forwards;
  transition: opacity 0.5s;
  opacity: 0;
  position: absolute;
}
.roll-fade-move {
  transition: transform 0.5s;
}

@keyframes slide-in {
  from {
    transform: translateX(100px);
  }
  to {
    transform: translateX(0px);
  }
}

@keyframes slide-out {
  from {
    transform: translateX(0px);
  }
  to {
    transform: translateX(100px);
  }
}
</style>
