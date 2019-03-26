
<template>
<div style="text-align: left;">
  <paginazione v-if="array.length > 0" :array="array" :limit="rows" @displayChanged="dispatchedPagination" :bottom="true" :shown="3" :doNotFloat="true"></paginazione>
  <table style="z-index: 0; overflow-y: auto; position: absolute" class="sticked_column" :style="'width: '+rels[0]+'%;'">
    <tr v-if="stickeds.length > 0">
      <th @click="ordinaArray(stickeds[0].prop, stickeds[0].treat_as)">{{stickeds[0].label}}</th>
    </tr>
    <tr v-for="obj in display">
      <td>
        <div :class="{'pointer': s.clickable}" v-for="s in stickeds" @click="tryExecuteClick(s, obj)">
          <div v-if="s.isLead">
            <h4 class="custom_scroll" style="max-height: 36px; overflow-y: auto;"><strong style="font-size: 16px; line-height: 1.5">{{obj[s.prop]}}</strong></h4>
            <div v-if="s.subLeadProp">
              {{obj[s.subLeadProp]}}
            </div>
          </div>
          <div class="custom_scroll" v-else style="max-height: 36px; overflow-y: auto; line-height: 1.2;">{{obj[s.prop]}}</div>
        </div>
      </td>
    </tr>
  </table>
  <div style="position: relative">
    <div style="overflow-x:scroll; float: right;" :style="'width: '+rels[1]+'%;'">

      <table style="z-index: 1; table-layout: fixed;" aria-hidden="true">
        <tr>
          <th v-for="f in floatings" :style="'min-width:'+f.width+'px;'" @click="ordinaArray(f.prop, f.treat_as)">
            <!-- per caret laterale -->
            <!-- <i v-if="ordered.what == f.prop" class="fa" aria-hidden="true" :class="[ordered.asc ? 'fa-sort-asc' : 'fa-sort-desc']"></i> -->{{f.label}}
          </th>
        </tr>
        <tr v-for="obj in display">
          <td v-for="f in floatings">
            <span v-if="!f.isprogress">{{obj[f.prop]}}</span>
            <div v-else class="progress" style="height: 18px; margin-top: 10px; padding-left: 0px; padding-right: 0px; margin: 5px 0px;">
              <div class="progress-bar progress-bar-info" role="progressbar" :aria-valuenow="obj[f.prop]" aria-valuemin="0" aria-valuemax="100" :style="'width:'+obj[f.prop]+'%'">{{obj[f.prop]}}%
              </div>
            </div>
          </td>
        </tr>
      </table>

    </div>
  </div>
</div>
</template>
<script>
import paginazione from '../components/paginazione.vue'

export default {
  props: {
    headers: Array,
    array: Array,
    rel: String,
    rows: Number
  },
  mounted: function() {
    this.init();
    this.rels = this.rel.split(";");
  },
  components: {
    paginazione
  },
  data: function() {
    return {
      stickeds: [],
      floatings: [],
      ordered: {
        what: null,
        asc: true
      },
      display: [],
      rels: []
    }
  },
  methods: {
    init: function() {
      this.stickeds = [];
      this.floatings = [];
      for (var i in this.headers) {
        if (this.headers[i].sticked) {
          this.stickeds.push(this.headers[i]);
        } else {
          this.floatings.push(this.headers[i]);
        }
      }
    },
    tryExecuteClick: function(s, obj) {
      if (s.clickable) {
        s.onClicked(obj);
      }
    },
    dispatchedPagination: function(display) {
      this.display = display;
    },
    ordinaArray: function(field, treat_as) {
      if (this.ordered.what == field) {
        this.ordered.asc = !this.ordered.asc;
      } else {
        this.ordered.what = field;
        this.ordered.asc = true;
      }
      var asc = this.ordered.asc;
      var vm = this;

      if (treat_as === 'string') {
        this.array.sort(function(a, b) {
          var sA = a[field].toLowerCase(),
            sB = b[field].toLowerCase()
          if (sA < sB) { //sort string ascending
            return vm.ordered.asc ? -1 : 1;
          }
          if (sA > sB) {
            return vm.ordered.asc ? 1 : -1;
          }
          return 0 //default return value (no sorting)
        })
      }

      if (treat_as === 'number') {
        this.array.sort(function(a, b) {
          return vm.ordered.asc ? (a[field] - b[field]) : (b[field] - a[field]);
        })
      }

      if (treat_as === 'date') {
        this.array.sort(function(a, b) {
          return vm.ordered.asc ? (Date.parse(a[field]) - Date.parse(b[field])) : (Date.parse(b[field]) - Date.parse(a[field]));
        })
      }
    },
  }
}
</script>
<style scoped>
i.fa {
  float: right;
  top: 5px;
}

th {
  border-bottom-style: solid;
  border-width: 1px;
  border-color: #bbb;
  background-color: white;
  color: #42a5f5;
  cursor: pointer;
  padding: 8px;
  font-size: smaller;
  font-weight: 400;
}

.sticked_column>tr>th {

  background-color: #42a5f5;
  color: white;
  border-right-style: solid;
  cursor: pointer;
  padding: 8px;
  font-size: smaller;
}

td {
  border-top-style: solid;
  border-width: 1px;
  border-color: #ccc;

  background-color: white;
  color: #222;
  padding: 4px;
  font-size: small;
  height: 45px;
}

td,
th {
  text-align: center;
}

th {
  height: 55px;
}

.sticked_column>tr>th,
.sticked_column>tr>td {
  text-align: left;
  padding-right: 16px;
}

.pointer {
  cursor: pointer;
}

.custom_scroll::-webkit-scrollbar,
.custom_scroll::-webkit-scrollbar-thumb {
  width: 8px;
}

.custom_scroll::-webkit-scrollbar-track {
  background-color: white;
}
</style>
