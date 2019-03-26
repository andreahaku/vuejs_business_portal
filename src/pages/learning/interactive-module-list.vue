<template>
<div>
  <div v-for="raccoglitore in moduli" class="panel panel-default curriculum open paper-shadow" data-z="0.5">
    <div class="panel-heading panel-heading-gray" @click="togglePanel(raccoglitore.ref)" style="padding-right: 22px;">
      <div class="media">
        <div class="media-left" style="vertical-align: middle;">
          <span class="icon-block img-circle bg-indigo-300 half text-white"><i class="fa fa-graduation-cap"></i></span>
        </div>
        <div class="media-body">
          <h4 class="text-headline" style="line-height: 1.6rem">{{raccoglitore.nome}}</h4>
        </div>
      </div>
    </div>
    <span class="fa fa-chevron-down collapse-status collapse-close open" aria-hidden="true" @click="togglePanel(raccoglitore.ref)" style="padding: 5px;"></span>
    <!-- asseegno l'id adeguatamente per gestire il toggle -->
    <div class="list-group collapse in" :id="raccoglitore.ref" aria-expanded="true">
      <span class="fa fa-chevron-up collapse-status collapse-close open" aria-hidden="true" @click="togglePanel(raccoglitore.ref)" style="padding: 5px;"></span>
      <div v-for="(modulo,index) in raccoglitore.children" class="list-group-item media" :class="{'active': modulo.id == active}" @click="goToDetail(modulo.id, modulo.allowed_open)">
        <div class="media-body">
          <i class="fa fa-fw fa-circle" v-bind:class="[{'text-grey-300': (modulo.tracking_status!='Iniziato' && modulo.tracking_status!='Completato' && modulo.tracking_status!='Incompleto' ), 'text-orange-300': (modulo.tracking_status=='Iniziato'), 'text-green-300': (modulo.tracking_status=='Completato'), 'text-red-300':(modulo.tracking_status=='Incompleto')}]"></i>          {{modulo.nome}}
        </div>
        <div class="media-right">
          <div class="width-50 text-right text-caption" @click.stop="">
            <div> <router-link tag="span" :to="{name: 'discussione', params: {iddiscussione: modulo.iddisc}}" v-if="modulo.commenti != 0" class="badge badge-primary pad-badge" style="position: absolute; top: 13px; margin-top: 0px;">{{modulo.commenti}}<span v-if="!$root.xs">{{modulo.commenti == 1 ? ' commento' : ' commenti'}}</span></router-link>
            <span v-if="modulo.minuti">{{modulo.minuti}} min</span></div>
           </div>
        </div>
      </div>
    </div>
  </div>
  <div v-if="moduli.length == 0" class="list-group-item paper-shadow animated fadeIn" data-z="0.5" style="padding: 10px 16px; border-width: 2px;">
    <span>Non è presente un indice per questo corso</span>
  </div>
</div>
</template>
<script>
export default {
  props: {
    modules_array: Array,
    flag: false,
    edizione: null,
    active: null
  },
  mounted: function() {
    this.fetch();
    console.log(this.moduli)
  },
  watch: {
    flag: function() {
      this.fetch();
    }
  },
  data: function() {
    return {
      moduli: []
    }
  },
  methods: {
    fetch: function() {
      this.moduli = this.modules_array.slice();
    },
    //esegue il collapse sul panel rispettivo
    togglePanel: function(param) {
      var id = "#" + param;
      $(id).collapse("toggle");
    },
    goToDetail: function(id, allowed) {
      console.log(this.$route)
      var els = location.href.split("/");
      if (els[els.length - 2] === "app-forum-thread") {
        //handles bubbling
      } else if (this.edizione != 0 && this.edizione != null) {
        this.$router.push({
          name: 'modulo',
          params: {
            idmodulo: id,
            idedizione: this.edizione
          }
        })
      }
    }
  }
}
</script>
<style scoped>
.media-body {
  vertical-align: middle;
}

.indice {
  vertical-align: middle !important;
  padding-top: 0px;
}
</style>
