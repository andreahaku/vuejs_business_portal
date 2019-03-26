<template>
<li class="list-group-item media v-middle" :class="[$parent.active == item.IdEdizione ? 'active' : '', getClass(item)]" @click="open()" style="cursor: pointer;">
  <!--
  <div class="media-left" style="text-align: center; padding: 5px; width: 80px;">
    <div class="cover overlay overlay-full v-top hover cont bg-img" :style="'background-image:url(' +img+ ')'"></div>
  </div>
  <div class="media-body">
    <div style="padding: 5px;">
      <h5 style="margin: 0px 0px 6px 0px;"><strong>Completato da: </strong><span v-if="item.NumCompletamenti != null">{{item.NumCompletamenti}}</span><span v-else class="custom_spinner"></span> su <span>{{item.NumPartecipanti}}</span></h5>
      <h4>{{item.Edizione}}</h4>
    </div>
  </div>
  <div class="media-footer row " style="padding: 0px 5px; margin: 0px; ">
    <span style="margin: 3px 0px 0px 0px; float: left;"><strong>Data Inizio:  </strong>{{item.DataInizio}}</span>
    <span style="margin: 3px 0px 0px 0px; float: right;"><strong>Data Fine:  </strong>{{item.DataFine}}</span>
  </div>
  <hr style=" margin: 5px 0px; ">
  <div class="media-footer row " style="padding: 0px 5px; margin: 0px; ">
    <div class="col-xs-12 " style="padding: 0px; ">
      <h5 style="margin: 0px; ">{{item.Corso}}</h5>
    </div>
  </div>
  -->

  <div class="media-left" style="text-align: center; padding: 5px; width: 80px;">
    <div class="cover overlay overlay-full v-top hover cont bg-img" :style="'background-image:url(' +img+ ')'"></div>
  </div>
  <div class="media-body">
    <div style="padding: 5px;">
      <h5>{{item.Corso}}</h5>
      <h5 style="margin-bottom: 0px;"><strong>Edizione:  </strong> {{item.Edizione}}</h5>
    </div>
  </div>
  <hr style=" margin: 5px 0px; ">
  <div class="media-footer row " style="padding: 0px 5px; margin: 0px; ">
    <div class="col-xs-12 " style="padding: 0px; ">
      <span style="margin: 3px 0px 0px 0px;"><strong>Da:  </strong>{{item.DataInizio ? new Date(item.DataInizio).toLocaleDateString() : ''}}</span>
      <span style="margin: 3px 0px 0px 5px;"><strong>a:  </strong>{{item.DataFine ? new Date(item.DataFine).toLocaleDateString() : ''}}</span>
      <span style="margin: 0px 0px 6px 0px; float: right"><strong>Completato da: </strong><span v-if="item.NumCompletamenti != null">{{item.NumCompletamenti}}</span><span v-else class="custom_spinner"></span> su <span>{{item.NumPartecipanti}}</span></span>
      
    </div>
  </div>

</li>
</template>
<script>
export default {
  name: 'edition_node',
  props: {
    item: Object
  },
  mounted: function() {
    this.img = null;
    this.pickImg();
  },
  watch: {
    item: function() {
      this.img = null;
      this.pickImg();
    }
  },
  data: function() {
    return {
      icons: {
        indicatore: "fa-table",
        contenuto: "fa-file-text-o"
      },
      classes: ['b', 'y'],
      img: '',
      default: 'images/course-placeholder.png'
    }
  },
  methods: {
    getClass: function(edizione) {
      return this.classes[new Date(edizione.DataFine) < new Date() ? 0 : 1];
    },
    open: function() {
      if (this.$parent.active != this.item.IdEdizione) {
        this.$parent.active = this.item.IdEdizione;
        this.$emit("openDetail", this.item);
      }
    },
    pickImg: function() {
      var img = this.$parent.imgContainer[this.item.Idcorso];

      if (img == 0) {
        this.img = this.default;
      } else if (img != -1) {
        this.img = this.$parent.imgContainer[this.item.Idcorso]
      }
    }
  }
}
</script>
<style scoped>
.bg-img {
  width: 70px;
  height: 50px !important;
  background-position: center;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  margin: 2px !important;
  border-radius: 3px;
}

li {
  padding: 5px 10px 5px 5px;
  border-left-width: 8px;
  border-left-color: white;
  border-top-color: white;
  border-bottom-color: #eee;
  border-bottom-width: 3px;
}

h4,
h5 {
  color: inherit;
}

li.active,
li:hover {
  background-color: #777 !important;
  border-bottom-color: #eee !important;
  color: white
}

li.active.g,
li.g:hover {
  border-left-color: #4caf50;
}

li.active.g strong,
li.g:hover strong {
  color: #4caf50;
}

li.active.y,
li.y:hover {
  border-left-color: #f0ad4e;
}

li.active.y strong,
li.y:hover strong {
  color: #f0ad4e;
}

li.active.v,
li.v:hover {
  border-left-color: #c65353;
}

li.active.v strong,
li.v:hover strong {
  color: #c65353;
}

li.active.b,
li.b:hover {
  border-left-color: #42a5f5;
}

li.active.b strong,
li.b:hover strong {
  color: #42a5f5;
}

.btn.action {
  font-size: smaller;
  padding: 3px 6px;
}

button {
  width: 62px;
}
</style>
<style>
.btn-validate {
  background-color: #c65353;
  color: white !important;
}

.btn-validate:hover {
  background-color: #bf4040;
  color: white;
}
</style>
