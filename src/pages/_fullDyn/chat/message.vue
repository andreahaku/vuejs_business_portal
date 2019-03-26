<template>
<transition name="fade">
  <div v-if="message!= null" class="media" style="padding: 8px 16px; margin: 0px;">
    <div v-if="!message.mine" class="media-left media-img">
      <p class="wr">
        <img class="media-object" :src="message.Immagine">
        <p>{{message.DataInserimento}}</p>
      </p>
    </div>
    <div class="media-body" :class="[message.mine ? 'mine' : 'others']">
      <h5 class="media-heading"><strong>{{message.Persona}}</strong></h5>
      <div class="card" :style="[message.mine ? mycss : othcss]" :class="[$root.xs ? 'hound' : 'eighty']">
        {{message.Testo}}
      </div>
    </div>
    <div v-if="message.mine" class="media-right media-img">
      <p class="wr">
        <img class="media-object" :src="message.Immagine">
        <p>{{message.DataInserimento}}</p>
      </p>
    </div>
  </div>
</transition>
</template>
<script>
export default {
  props: {
    item: Object,
    mycss: Object,
    othcss: Object
  },
  data: function() {
    return {
      message: null
    }
  },
  mounted: function() {
    this.message = this.item;
    if (this.message.IDPersona == localStorage.getItem("idpersona")) {
      this.message.mine = true;
    } else {
      this.message.mine = false;
    }
  }
}
</script>

<style scoped>
img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #f3f3f3;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}

p {
  margin: 0px;
}

p.wr {
  margin-bottom: 5px;
}

p,
h5 {
  color: inherit;
}

.media-img {
  padding-top: 0px;
  text-align: center;
}

.others {
  text-align: left;
}

.card {
  padding: 6px 8px;
  display: block;
  font-size: 15px;
  border-radius: 3px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}

.mine>.card {
  float: right;
}

.card.hound {
  max-width: 100%;
}

.card.eighty {
  max-width: 80%;
}
</style>
