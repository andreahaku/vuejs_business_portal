<template>
  <div class="panel-group">
    <ul class="sidebar-menu">
      <router-link tag="li" :class="{active: this.$route.path=='/'}" to="/">
        <a
          class="pad"
          data-toggle="tooltip"
          data-placement="right"
          data-trigger="hover"
          title="Dashboard"
        >
          <i class="fa fa-bar-chart-o"></i>
        </a>
      </router-link>
      <li :class="{active: isCorsi()}" v-if="enabledOnes.learning == true">
        <a
          class="pad"
          @click="toggleSidebar('collapseOne')"
          data-toggle="tooltip"
          data-placement="right"
          data-trigger="hover"
          title="Corsi"
        >
          <i class="fa fa-mortar-board"></i>
        </a>
      </li>
      <li :class="{active: isForum()}" v-if="enabledOnes.learning == true">
        <a
          class="pad"
          @click="toggleSidebar('collapseTwo')"
          data-toggle="tooltip"
          data-placement="right"
          data-trigger="hover"
          title="Forum"
        >
          <i class="fa fa-file-text-o"></i>
        </a>
      </li>
      <!-- UNUSED
        <li :class="{active: isConto()}">
            <a class="pad" @click="toggleSidebar('collapseThree')"
            data-toggle="tooltip" data-placement="right" title="Conto">
            <i class="fa fa-user"></i></a>
            
      </li>-->
      <li :class="{active: isRecruiting()}" v-if="enabledOnes.recruiting == true">
        <a
          class="pad"
          @click="toggleSidebar('collapseThree')"
          data-toggle="tooltip"
          data-placement="right"
          data-trigger="hover"
          title="Recruiting"
        >
          <i class="fa fa-users"></i>
        </a>
      </li>
      <li :class="{active: isFeedback()}" v-if="enabledOnes.feedback == true">
        <a
          class="pad"
          @click="toggleSidebar('collapseFour')"
          data-toggle="tooltip"
          data-placement="right"
          data-trigger="hover"
          title="Feedbacks"
        >
          <i class="fa fa-pencil-square-o"></i>
        </a>
      </li>
      <!--
        <router-link tag="li" to="/app-student-messages" :class="{active: isChat()}"><a class="pad" 
            data-toggle="tooltip" data-placement="right" data-trigger="hover" title="Messaggi">
            <i class="fa fa-comments"></i></a> 
        </router-link>
      -->
      <li>
        <a
          class="pad"
          href="login.html"
          data-toggle="tooltip"
          data-placement="right"
          data-trigger="hover"
          title="Logout"
        >
          <i class="fa fa-sign-out"></i>
        </a>
      </li>
    </ul>
  </div>
</template>
<script>
import { eventBus } from "../eventbus.js";

export default {
  created: function() {
    this.enabledOnes = this.$root.getEnablingObject();
  },
  data: function() {
    return {
      enabledOnes: {}
    };
  },
  methods: {
    toggleSidebar: function(target) {
      eventBus.$emit("toggleFromPlaceholder", target);
    },
    isCorsi: function() {
      var path = this.$route.path.split("/")[1];
      if (path == "app-directory-grid") {
        return true;
      }
      if (path == "app-directory-list") {
        return true;
      }
      if (path == "app-student-course") {
        return true;
      }
      if (path == "app-student-courses") {
        return true;
      }
      if (path == "app-take-course") {
        return true;
      }
      if (path == "app-take-quiz") {
        return true;
      }

      return false;
    },
    isForum: function() {
      var path = this.$route.path.split("/")[1];
      if (path == "app-forum") {
        return true;
      }
      if (path == "app-forum-category") {
        return true;
      }
      if (path == "app-forum-thread") {
        return true;
      }

      return false;
    },
    isChat: function() {
      var path = this.$route.path.split("/")[1];
      if (path == "app-student-messages") {
        return true;
      }

      return false;
    },
    isRecruiting: function() {
      var path = this.$route.path.split("/")[1];
      if (path == "app-recruiting") {
        return true;
      }

      return false;
    },
    isFeedback: function() {
      var path = this.$route.path.split("/")[1];
      if (path == "app-feedbacks") {
        return true;
      }

      return false;
    }
  }
};
</script>
<style>
a.pad {
  padding: 2px !important;
}

a:hover {
  cursor: pointer;
}
</style>
