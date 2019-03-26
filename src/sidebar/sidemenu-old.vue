<template>
  <div class="page-section">
    <div class="panel-group" role="tablist" aria-multiselectable="true">
      <ul class="sidebar-menu">
        <router-link tag="li" to="/" active-class="active" exact>
          <a>
            <i class="fa fa-bar-chart-o"></i>
            <span>Dashboard</span>
          </a>
        </router-link>

        <li class="hasSubmenu" :class="{open: opened=='collapseOne'}">
          <a
            role="button"
            data-toggle="collapse"
            data-target="#collapseOne"
            @click="toggled('collapseOne', true)"
            class="a-this"
          >
            <i class="fa fa-mortar-board"></i>
            <span>Corsi</span>
          </a>
          <div id="collapseOne" class="panel-collapse collapse co-this" role="tabpanel">
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
        </li>
        <li class="hasSubmenu" :class="{open: opened=='collapseTwo'}">
          <a
            role="button"
            data-toggle="collapse"
            data-target="#collapseTwo"
            @click="toggled('collapseTwo', true)"
            class="a-this"
          >
            <i class="fa fa-file-text-o"></i>
            <span>Forum</span>
          </a>
          <div id="collapseTwo" class="panel-collapse collapse co-this" role="tabpanel">
            <ul class="side" id="forum-menu">
              <router-link tag="li" active-class="active" to="/app-forum">
                <a>
                  <span>Forum Home</span>
                </a>
              </router-link>
            </ul>
          </div>
        </li>

        <!-- --------    RECRUITING    --------- 
        <li class="hasSubmenu" :class="{open: opened=='collapseThree'}">
            <a role="button" data-toggle="collapse" data-target="#collapseThree" @click="toggled('collapseThree', true)" class="a-this">
            <i class="fa fa-users"></i><span>Recruiting</span></a>
            <div id="collapseThree" class="panel-collapse collapse co-this" role="tabpanel">
            <ul class="side" id="recruiting-menu">
               
                <router-link tag="li" active-class="active" :to="{name: jobs}" exact>
                      <a><span>Lista Impieghi</span></a>
                </router-link>
                <router-link tag="li" active-class="active" :to="{name: cv}">
                      <a><span>Curriculum Vitae</span></a>
                </router-link>
                
            </ul>
            </div>
        </li>
        -->

        <router-link tag="li" to="/app-student-messages" active-class="active">
          <a>
            <i class="fa fa-comments"></i>
            <span>Chat</span>
          </a>
        </router-link>

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
  mounted: function() {
    this.$nextTick(function() {
      this.attachListeners();
    });
  },
  data: function() {
    return {
      active: "",
      opened: ""
    };
  },
  created: function() {
    var vm = this;
    eventBus.$on("updateYourself", function() {
      vm.checkForActive();
    });
    eventBus.$on("updateTarget", function(target) {
      $("#" + target).collapse("show");
      vm.toggled(target, false);
    });
  },
  watch: {
    "$route.path": function() {
      //TODO
      setTimeout(this.checkForActive, 50);
    }
  },
  methods: {
    toggled: function(item, toggleFromSuper) {
      //toggle non parte se il click è troppo veloce - bug fix
      if (outerBool == false || !toggleFromSuper) {
        //distinguo fra chiamata da super menù e chiamata per cambio di path per fixare l'icona +/-
        if (item == this.opened && toggleFromSuper) {
          this.opened = "none";
        } else {
          this.opened = item;
        }
        if (this.active != item) {
          switch (this.active) {
            case "collapseOne":
              $("#collapseOne").collapse("hide");
              break;
            case "collapseTwo":
              $("#collapseTwo").collapse("hide");
              break;
            /*
                            case 'collapseThree':
                                $("#collapseThree").collapse('hide');
                                break;  */
          }
          this.active = item;
        }
      }
    },
    checkForActive: function() {
      var check = false;
      var liActive = $("ul.side li.active");
      if (this.checkPathForBug()) {
        check = true;
      }
      if (liActive.length == 1 && check == false) {
        var ulId = liActive.parent()[0].id;
        switch (ulId) {
          case "course-menu":
            $("#collapseOne").collapse("show");
            this.toggled("collapseOne", false);
            break;
          case "forum-menu":
            $("#collapseTwo").collapse("show");
            this.toggled("collapseTwo", false);
            break;
          /*
                        case 'recruiting-menu':
                            $("#collapseThree").collapse('show');
                            this.toggled('collapseThree', false);
                            break;  */
        }
      } else {
        this.toggled("none", false);
      }
    },
    checkPathForBug: function() {
      if (
        this.$route.path == "/" ||
        this.$route.path == "/app-student-messages" ||
        this.$route.path == "/login"
      ) {
        return true;
      }
      return false;
    },
    checkPathWithParams: function(path) {
      if (this.$route.path.split("/")[1] == path.split("/")[1]) {
        return true;
      }
      return false;
    },
    attachListeners: function() {
      $(".co-this").on("show.bs.collapse", function() {
        var x = document.getElementsByClassName("a-this");
        x[0].setAttribute("data-toggle", "");
        x[1].setAttribute("data-toggle", "");
        //x[2].setAttribute("data-toggle", "");
        outerBool = true;
      });
      $(".co-this").on("shown.bs.collapse", function() {
        var x = document.getElementsByClassName("a-this");
        x[0].setAttribute("data-toggle", "collapse");
        x[1].setAttribute("data-toggle", "collapse");
        //x[2].setAttribute("data-toggle", "collapse");
        outerBool = false;
      });
      $(".co-this").on("hide.bs.collapse", function() {
        outerBool = true;
      });
      $(".co-this").on("hidden.bs.collapse", function() {
        outerBool = false;
      });
    }
  }
};
</script>