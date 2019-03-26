<template>
  <div class="page-section">
    <div class="panel-group" role="tablist" aria-multiselectable="true" id="accordion">
      <ul class="sidebar-menu">
        <router-link tag="li" to="/" active-class="active" exact>
          <a>
            <i class="fa fa-bar-chart-o"></i>
            <span>Home</span>
          </a>
        </router-link>
        <li class="hasSubmenu" :class="{'open': showCourse}" v-if="enabledOnes.learning == true">
          <a role="button" class="a-this" @click="toggleCourse()">
            <i class="fa fa-mortar-board"></i>
            <span>Corsi</span>
          </a>
          <transition name="menu">
            <div v-show="showCourse" id="collapseOne" class="co-this">
              <ul class="side" id="course-menu">
                <router-link tag="li" to="/app-directory-grid" active-class="active">
                  <a>
                    <span>
                      Griglia
                      Corsi
                    </span>
                  </a>
                </router-link>
                <router-link tag="li" to="/app-directory-list" active-class="active">
                  <a>
                    <span>Lista Corsi</span>
                  </a>
                </router-link>
                <router-link tag="li" to="/app-student-courses" active-class="active">
                  <a>
                    <span>I Miei Corsi</span>
                  </a>
                </router-link>
              </ul>
            </div>
          </transition>
        </li>
        <li class="hasSubmenu" :class="{'open': showForum}" v-if="enabledOnes.learning == true">
          <a role="button" class="a-this" @click="toggleForum()">
            <i class="fa fa-file-text-o"></i>
            <span>Forum</span>
          </a>
          <transition name="menu">
            <div v-show="showForum" id="collapseTwo" class="co-this">
              <ul class="side" id="forum-menu">
                <router-link tag="li" active-class="active" to="/app-forum">
                  <a>
                    <span>Forum Home</span>
                  </a>
                </router-link>
              </ul>
            </div>
          </transition>
        </li>
        <!-- RECRUITING -->
        <li
          class="hasSubmenu"
          :class="{open: showRecruiting}"
          v-if="enabledOnes.recruiting == true"
        >
          <a role="button" @click="toggleRecruiting()">
            <i class="fa fa-users"></i>
            <span>Recruiting</span>
          </a>
          <transition name="menu">
            <div v-show="showRecruiting" id="collapseThree" class="co-this">
              <ul class="side" id="recruiting-menu">
                <router-link tag="li" active-class="active" to="/app-recruiting" exact>
                  <a>
                    <span>Posizioni Aperte</span>
                  </a>
                </router-link>
              </ul>
            </div>
          </transition>
        </li>
        <!-- FEEDBACK -->
        <li class="hasSubmenu" :class="{open: showFeedback}" v-if="enabledOnes.feedback == true">
          <a role="button" @click="toggleFeedback()">
            <i class="fa fa-pencil-square-o"></i>
            <span>Feedback</span>
          </a>
          <transition name="menu">
            <div v-show="showFeedback" id="collapseFour" class="co-this">
              <ul class="side" id="feedback-menu">
                <router-link
                  tag="li"
                  active-class="active"
                  :to="{name: 'personaFeedback', params: { idpersona: me}}"
                  exact
                >
                  <a>
                    <span>Feedback Ricevuti</span>
                  </a>
                </router-link>
                <!--
                        <router-link tag="li" active-class="active"  to="/app-feedbacks/give-feedback">
                              <a><span>Feedback da Assegnare</span></a>
                </router-link>-->
              </ul>
            </div>
          </transition>
        </li>
        <!-- TUTOR -->
        <li class="hasSubmenu" :class="{open: showTutor}" v-if="enabledOnes.tutor == true">
          <a role="button" @click="toggleTutor()">
            <i class="fa fa-pencil-square-o"></i>
            <span>Docente</span>
          </a>
          <transition name="menu">
            <div v-show="showTutor" id="collapseFive" class="co-this">
              <ul class="side" id="tutor-menu">
                <router-link tag="li" active-class="active" :to="{name: 'lista-edizioni'}" exact>
                  <a>
                    <span>Le Mie Edizioni</span>
                  </a>
                </router-link>
                <!--
                        <router-link tag="li" active-class="active"  to="/app-feedbacks/give-feedback">
                              <a><span>Feedback da Assegnare</span></a>
                </router-link>-->
              </ul>
            </div>
          </transition>
        </li>
        <!--
                <router-link tag="li" to="/app-student-messages" active-class="active">
                    <a><i class="fa fa-comments"></i><span>Chat</span></a>
                </router-link>
        -->
        <li>
          <a href="login.html">
            <i class="fa fa-sign-out"></i>
            <span>Logout</span>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { eventBus } from "../eventbus.js";

var outerBool = false;

export default {
  created: function() {
    var vm = this;
    eventBus.$on("updateYourself", function() {
      vm.checkForActive();
    });
    eventBus.$on("updateTarget", function(target) {
      if (target === "collapseOne") {
        vm.showOnlyCourse();
      } else if (target === "collapseTwo") {
        vm.showOnlyForum();
      } else if (target === "collapseThree") {
        vm.showOnlyRecruiting();
      } else if (target === "collapseFour") {
        vm.showOnlyFeedback();
      } else if (target === "collapseFive") {
        vm.showOnlyTutor();
      }
    });

    this.enabledOnes = this.$root.getEnablingObject();
  },
  data: function() {
    return {
      showCourse: false,
      showForum: false,
      showRecruiting: false,
      showFeedback: false,
      showTutor: false,
      enabledOnes: {},
      me: localStorage.getItem("idpersona")
    };
  },
  watch: {
    "$route.path": function() {
      setTimeout(this.checkForActive, 30);
    }
  },
  methods: {
    toggleCourse: function() {
      if (this.showCourse) {
        this.showCourse = false;
      } else {
        this.showOnlyCourse();
      }
    },
    toggleForum: function() {
      if (this.showForum) {
        this.showForum = false;
      } else {
        this.showOnlyForum();
      }
    },
    toggleRecruiting: function() {
      if (this.showRecruiting) {
        this.showRecruiting = false;
      } else {
        this.showOnlyRecruiting();
      }
    },
    toggleFeedback: function() {
      if (this.showFeedback) {
        this.showFeedback = false;
      } else {
        this.showOnlyFeedback();
      }
    },
    toggleTutor: function() {
      if (this.showTutor) {
        this.showTutor = false;
      } else {
        this.showOnlyTutor();
      }
    },
    showOnlyCourse: function() {
      this.showCourse = true;
      this.showForum = false;
      this.showRecruiting = false;
      this.showFeedback = false;
      this.showTutor = false;
    },
    showOnlyForum: function() {
      this.showCourse = false;
      this.showForum = true;
      this.showRecruiting = false;
      this.showFeedback = false;
      this.showTutor = false;
    },
    showOnlyRecruiting: function() {
      this.showCourse = false;
      this.showForum = false;
      this.showRecruiting = true;
      this.showFeedback = false;
      this.showTutor = false;
    },
    showOnlyFeedback: function() {
      this.showCourse = false;
      this.showForum = false;
      this.showRecruiting = false;
      this.showFeedback = true;
      this.showTutor = false;
    },
    showOnlyTutor: function() {
      this.showCourse = false;
      this.showForum = false;
      this.showRecruiting = false;
      this.showFeedback = false;
      this.showTutor = true;
    },
    checkForActive: function() {
      var liActive = $("ul.side li.active");
      if (liActive.length == 1) {
        var ulId = liActive.parent()[0].id;
        switch (ulId) {
          case "course-menu":
            this.showOnlyCourse();
            break;
          case "forum-menu":
            this.showOnlyForum();
            break;
          case "recruiting-menu":
            this.showOnlyRecruiting();
            break;
          case "feedback-menu":
            this.showOnlyFeedback();
            break;
          case "tutor-menu":
            this.showOnlyTutor();
            break;
        }
      } else {
        this.showCourse = false;
        this.showForum = false;
        this.showRecruiting = false;
        this.showFeedback = false;
        this.showTutor = false;
      }
    }
  }
};
</script>
<style scoped>
/*
    .slide-enter {
        opacity: 0;
        height: 0px;
    }
    .slide-enter-active {
        transition: all 0.5s ease ;
    }
    .slide-leave-active {
        opacity: 0;
        height: 0px;
    }
    */

.menu-enter {
  opacity: 0;
}

.menu-enter-active {
  animation: slide-in 0.5s ease-out forwards;
  transition: opacity 0.5s;
}

.menu-leave-active {
  animation: slide-out 0.5s ease-out forwards;
  transition: opacity 0.5s;
  opacity: 0;
  position: absolute;
}

@keyframes slide-in {
  from {
    transform: translateX(80px);
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
    transform: translateX(80px);
  }
}

.sidebar.sidebar-skin-dark .sidebar-menu a {
  font-weight: 300;
}
</style>
