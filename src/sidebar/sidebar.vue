<template>
  <div class="sidebar sidebar-offset-0 sidebar-visible-desktop">
    <transition name="push">
      <div
        class="sidebar left sidebar-size-3 sidebar-offset-0 sidebar-visible-desktop sidebar-visible-mobile sidebar-skin-dark collapse bg"
        id="sidebar-menu"
        data-type="dropdown"
        v-if="sideVisible"
      >
        <div data-scrollable style="overflow:hidden;">
          <userimage></userimage>
          <sidemenu></sidemenu>
        </div>
      </div>
    </transition>

    <div
      v-if="!sideVisible"
      class="sidebar sidebar-offset-0 sidebar-visible-desktop sidebar-skin-dark collapse bg"
      id="placeholder"
    >
      <placeholder></placeholder>
    </div>
  </div>
</template>

<script>
import userimage from "./userimage.vue";
import sidemenu from "./sidemenu.vue";
import placeholder from "./placeholder.vue";

import { eventBus } from "../eventbus.js";

export default {
  data: function() {
    return {
      sideVisible: true,
      avoidUpdate: false,
      target: ""
    };
  },
  components: {
    userimage,
    sidemenu,
    placeholder
  },
  watch: {
    sideVisible: function() {
      //          RECRUITING          //
      eventBus.$emit("listenCV", this.sideVisible);
      //notifica cv per la centratura dell navbar
      //                              //

      if (!this.avoidUpdate) {
        eventBus.$emit("updateYourself");
      } else {
        this.avoidUpdate = false;
        eventBus.$emit("updateTarget", this.target);
      }
      this.checkForContent();
    },

    "$route.path": function() {
      this.checkForContent();
    }
  },
  methods: {
    checkForContent() {
      if (!this.sideVisible) {
        $("#content").css("margin-left", "30px");
      } else {
        var tips = document.getElementsByClassName("tooltip");
        for (var i = 0; i < tips.length; i++) {
          tips[i].parentElement.removeChild(tips[i]);
        }

        $("#content").css("margin-left", "250px");
      }
    },
    hide: function() {
      this.sideVisible = false;
    }
  },
  created: function() {
    var vm = this;
    eventBus.$on("collapseSide", function() {
      vm.sideVisible = !vm.sideVisible;
    });
    eventBus.$on("collapseSideFromApp", function(bool, firstLoad) {
      if (firstLoad) {
        if (bool == false) {
          setTimeout(vm.hide, 1);
        }
      } else {
        if (vm.sideVisible != bool) {
          vm.sideVisible = !vm.sideVisible;
        }
      }
    });
    eventBus.$on("toggleFromPlaceholder", function(target) {
      vm.target = target;
      vm.avoidUpdate = true;
      vm.sideVisible = true;
    });
  }
};
</script>
<style>
.push-enter {
  width: 0px;
}
.push-enter-active {
  transition: width 0.25s ease;
}
.push-leave-active {
  transition: width 0.25s ease;
  width: 0px;
}

@media (max-width: 767px) {
  #content.st-pusher {
    margin-left: 0px !important;
  }
}
#placeholder {
  width: 35px;
}
</style>