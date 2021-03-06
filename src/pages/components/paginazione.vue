<template>
<ul class="pagination margin-bottom-none" v-if="pages > 1" :class="{'bottom': bottom == true, 'doFloat': doNotFloat != true}">
  <!-- freccia sx disabilitata se il primo tag è attivo -->
  <li :class="{disabled: this.active==0}" @click.prevent="checkArrows(false)"><a href="#">&laquo;</a></li>
  <!-- il primo e l'ultimo tag vengono sempre mostrati, anche quando si specifica di visualizzare un massimo numero di tag -->
  <li v-if="!firstCovered" @click.prevent="showCourses(0)"><a href="#">1</a></li>
  <!-- appaiono i punti di sospensione se il primo tag non è immediatamente prima del frame di tag mostrati -->
  <li v-if="firstUnreached"><a @click.prevent="showCourses(firstDisplayed - 1)">...</a></li>
  <!-- itera i tag da mostrare (tutti se la prop shown non è valoraizzata) -->
  <li v-for="showed in displayed" @click.prevent="showCourses(showed)" :class="{active: showed==active}"><a href="#">{{ showed+1 }}</a></li>
  <!-- appaiono i punti di sospensione se l'ultimo tag non è immediatamente dopo il frame di tag mostrati -->
  <li v-if="lastUnreached"><a @click.prevent="showCourses(lastDisplayed + 1)">...</a></li>
  <!-- ultimo tag sempre visibile -->
  <li v-if="!lastCovered" @click.prevent="showCourses(pages - 1)"><a href="#">{{pages}}</a></li>
  <!-- freccia dx disabilitata se l'ultimo tag è attivo -->
  <li :class="{disabled: this.active==pages-1}" @click.prevent="checkArrows(true)"><a href="#">&raquo;</a></li>
</ul>
</template>
<script>
import {
  eventBus
} from '../../eventbus.js';

export default {
  mounted: function() {
    this.$nextTick(function() {
      this.handleCourses();
      this.showCourses(this.active);
    })
  },
  data: function() {
    return {
      active: 0,
      pages: 0,
      displayed: []
    }
  },
  props: ["array", "limit", "large", "bottom", "shown", "doNotFloat"],
  created: function() {
    var vm = this;

    eventBus.$on('updateListRendering', function() {
      vm.pages = 0;
      vm.handleCourses();
      if (action == "added") {
        vm.showCourses(vm.pages - 1);
      } else {
        vm.showCourses(0);
      }
    });
    eventBus.$on('breakpoint', function(lg) {
      if (vm.large && lg) {
        vm.showCourses(0);
      } else if (!vm.large && !lg) {
        vm.showCourses(0);
      }
    });
  },
  watch: {
    'array': function() {
      this.pages = 0;
      this.handleCourses();
      this.showCourses(0);
    }
  },
  computed: {
    firstCovered: function() {
      return this.firstDisplayed == 0;
    },
    lastCovered: function() {
      return this.lastDisplayed == this.pages - 1;
    },
    firstUnreached: function() {
      return this.firstDisplayed > 1;
    },
    lastUnreached: function() {
      return this.lastDisplayed < this.pages - 2;
    },
    firstDisplayed: function() {
      return this.displayed[0];
    },
    lastDisplayed: function() {
      return this.displayed[this.displayed.length - 1];
    }
  },
  methods: {
    // calcola il numero di tag in cui suddividere l'array
    handleCourses: function() {
      if (this.array.length > 0) {
        this.pages = Math.ceil(this.array.length / this.limit);
      }
    },
    showCourses: function(index) {
      //seleziona la frazione di array da mostrare, e aggiorna l'indice attivo
      this.active = index;
      var displayCourses;
      if (index != this.pages - 1) {
        this.displayCourses = this.array.slice(index * this.limit, (index + 1) * this.limit);
      } else {
        this.displayCourses = this.array.slice(index * this.limit, this.array.length);
      }
      this.$emit("displayChanged", this.displayCourses);

      //elaboro quale tag mostrare
      this.displayed = [];
      if (this.shown == null || this.pages <= this.shown) {
        //se la prop shown non è definita o è maggiore dell'effetivo numero di pagine, mostro tutto
        for (var i = 0; i < this.pages; i++) {
          this.displayed.push(i);
        }
      } else {
        var half = Math.floor(this.shown / 2);
        var starting,
          ending;
        if (this.active <= half) {
          starting = 0;
          ending = this.shown;
        } else {
          if (this.active >= this.pages - half) {
            starting = this.pages - this.shown;
            ending = this.pages;
          } else {
            starting = this.active - half;
            ending = this.active + half + 1;
          }
        }
        for (var i = starting; i < ending; i++) {
          this.displayed.push(i);
        }
      }

    },
    checkArrows: function(isRight) {

      if (isRight) {
        if (this.active < this.pages - 1) {
          this.showCourses(this.active + 1);
        }
      } else if (this.active > 0) {
        this.showCourses(this.active - 1);
      }
    }
  }
}
</script>
<style scoped>
.pagination li a {
  margin-top: 10px;
  border-radius: 10%;
  font-size: 1rem;
  font-weight: 300;
  padding: 2px 5px 2px 5px;
}

.bottom {
  margin-top: 5px;
  margin-bottom: 10px !important;
}

.doFloat {
  float: right;
}
</style>
