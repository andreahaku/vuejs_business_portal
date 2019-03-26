<template>
<div :class="{'noDash': !dashboard}">
  <div v-if="dashboard">
    <div class="row">
      <div class="col-xs-12 col-sm-8">
        <h4 class="text-headline margin-none">I Miei Feedback <span class="badge">{{quantisono}}</span></h4>
        <p class="text-subhead text-light">La lista dei feedback che hai ricevuto</p>
      </div>
      <div class="col-xs-12 col-sm-4">
        <paginazione :array="myFilteredFeeds" @displayChanged="dispatchedPagination($event)" :limit="perpagina">
        </paginazione>
      </div>
    </div>
  </div>
  <div v-else class="panel panel-default paper-shadow" style="margin: 0px; font-weight: 300">
    <div class="list-group-item" style="border-width: 0px;">
      <h4 class="text-headline margin-none">I Miei Feedback</h4>
      <p class="text-subhead text-light">I feedback che hai ricevuto <span v-if="filtername">filtrati per <span v-if="filtersub">{{filtersub}}</span><span v-else>{{filtername}}</span></span>
      </p>
    </div>
  </div>
  <div id="feeds" class="panel panel-default paper-shadow" :class="{'dashFeeds': dashboard}" data-z="0.5" style="overflow-y: auto; margin-bottom:0px;">
    <div>
      <ul v-if="myFilteredFeeds.length > 0" class="list-group" style="margin: 0px;">
        <li v-if="dashboard" class="list-group-item media v-middle" v-for="(feed, i) in displayfeedbacks" :key="i">
          <div class="media-left">
            <img :src="path+'/'+feed.avatar" onerror="this.src = 'images/profile-photo_small.png'" class="img-circle width-70" />
          </div>
          <div class="media-body row">
            <div class="col-xs-12 col-sm-5" style="padding: 12px 0px 0px 5px;">
              <h4><span style="font-size:1rem;">Da: </span> {{feed.nomeValutatore}}</h4>
              <h5 style="margin-top: 2px;"><span style="font-size:1rem;">Data: </span>{{feed.data}}</h5>
              <button :disabled="feed.commento==null || feed.commento.trim()==''" class="btn btn-primary btn-xs" data-toggle="collapse" :data-target="'#commento_'+i" aria-expanded="false" :aria-controls="'commento_'+i">Commento</button>
              <!--
                                <button v-if="feed.commento.length == 0" disabled class="btn btn-primary btn-xs" data-toggle="collapse" :data-target="'#commento_'+i" aria-expanded="false" :aria-controls="'commento_'+i">COMMENTO</button>
                                 -->
            </div>
            <div class=" col-xs-12 col-sm-7">
              <h4 style="margin-bottom: 5px;">{{feed.nomeCompetenza}}
                            </h4>
              <hr>
              <rating :stars="feed.punteggio"></rating>
            </div>
          </div>
          <div :id="'commento_'+i" class="row collapse col-xs-12">
            <hr v-if="feed.commento != null"> {{feed.commento}}
          </div>
        </li>
        <li v-if="!dashboard" class="list-group-item media v-middle" v-for="(feed,i) in myFilteredFeeds" :key="i">
          <div class="media-left">
            <img :src="feed.avatar" class="img-circle width-70" />
          </div>
          <div class="media-body row">
            <div class=" col-xs-12 col-sm-5" style="padding: 10px 0px 0px 5px;">
              <h5 style="margin-top: 0px;">Feedback inviato in data</h5>
              <h5 style="margin-top: 0px;"><strong>{{feed.data}}</strong></h5>
              <h5>Da: <span style="color: #3b75c3">{{feed.nomeValutatore}}</span></h5>
            </div>
            <div class=" col-xs-12 col-sm-7">
              <h4 style="margin-bottom: 5px;">{{feed.nomeCompetenza}}
                            </h4>
              <rating :stars="feed.punteggio"></rating>
            </div>
            <div class="col-xs-12">
              {{feed.commento}}
            </div>
          </div>
        </li>
      </ul>
      <ul v-else class="list-group" style="margin: 0px;">
        <li class="list-group-item">
          <h4>Non hai ricevuto alcun feedback</h4>
        </li>
      </ul>
    </div>
  </div>
</div>
</template>
<script>
import rating from '../components/rating.vue'
import paginazione from '../components/paginazione.vue'

import {
  eventBus
} from '../../eventbus.js'

export default {
  created: function() {
    this.init()
  },
  computed: {
    quantisono: function() {
      return this.myFilteredFeeds.length;
    },
    perpagina: function() {
      return Math.ceil(this.myFilteredFeeds.length / 4);
    }
  },
  components: {
    rating,
    paginazione
  },
  props: {
    name: {
      type: String
    },
    subname: {
      type: String
    },
    dash: {
      type: Boolean
    }
  },
  data() {
    return {
      skillsCollection: [],
      feedbacksCollection: [],
      myFilteredFeeds: [],
      displayfeedbacks: [],

      filtername: this.name,
      filtersub: this.subname,

      dashboard: this.dash,
      path: localStorage.getItem("path")
    }
  },
  watch: {
    name: function() {
      this.filtername = this.name;
      this.filtra();
    },
    subname: function() {
      this.filtersub = this.subname;
      this.filtra();
    }
  },
  methods: {
    init: function() {
      this.initFeedbacks();
    },
    dispatchedPagination(toDisplay) {
      var parsing = [];
      for (var i = 0; i < toDisplay.length; i++) {
        var obj = toDisplay[i];
        var skill = this.skillsCollection.chain().find({
          'id': obj.idCompetenza
        }).data()[0];
        if (skill) {
          obj.nomeCompetenza = skill.nome;
        }
        parsing.push(obj);
      }
      this.displayfeedbacks = parsing;
    },
    filtra() {
      this.myFilteredFeeds = [];
      if (this.filtername && this.filtername != '') {
        var vm = this;
        this.myFilteredFeeds = this.feedbacks.filter(function(feed) {
          if (feed.feedback == vm.filtername) {
            if (vm.filtersub && vm.filtersub != '') {
              if (feed.subFeedback == vm.filtersub) {
                return true;
              } else {
                return false;
              }
            } else {
              return true;
            }
          } else {
            return false;
          }
        });
      } else {
        this.myFilteredFeeds = this.myFilteredFeeds.concat(this.myFeeds);
      }
    },
    initFeedbacks() {
      this.feedbacksCollection = this.$store.getters.getMyFeedback;
      this.skillsCollection = this.$store.getters.getCompetenze;
      this.myFilteredFeeds = this.feedbacksCollection.data.slice();
    }
  }
}
</script>
<style scoped>
#feeds {
  border-width: 0px;
}

.dashFeeds {
  /*
    max-height: 142px;
    */
}


/* put max-height only dash*/

.noDash h4,
.noDash h5,
.noDash p {
  font-weight: 300;
}

.noDash #feeds {
  max-height: 75vh;
  overflow-y: auto;
}

.badge {
  font-size: 1.5rem;
  font-weight: 300;
  color: white;
}

div.media-left {
  vertical-align: top !important;
  padding-top: 10px;
}

.comp {
  background-color: white;
  padding: 5px;
  border: 1px solid #e3e3e3;
  margin-bottom: 10px;
}

hr {
  margin: 10px;
}
</style>
