<template>
  <div class="st-pusher" id="content">
    <!-- sidebar effects INSIDE of st-pusher: -->
    <!-- st-effect-3, st-effect-6, st-effect-7, st-effect-8, st-effect-14 -->
    <!-- this is the wrapper for the content -->
    <div class="st-content">
      <div
        v-if="!canNavigate"
        class="uil-rolling-css"
        style="transform:scale(0.71); 
            position: absolute; margin: 0 auto; top: 100px; right: 0px; left: 0px;"
      >
        <div>
          <div></div>
          <div></div>
        </div>
      </div>
      <router-view v-if="canNavigate"></router-view>
    </div>
  </div>
</template>
<script>
export default {
  mounted() {
    this.$nextTick(function() {
      this.getToken();
    });
  },
  data() {
    return {
      canNavigate: false
    };
  },
  methods: {
    getToken() {
      var path = JSON.parse(this.$root.lsGet("configs")).urlApiRecruiting;
      localStorage.setItem("rec-path", path);
      if (localStorage.getItem("recruitingToken") == null) {
        this.$http
          .get(localStorage.getItem("rec-path") + "/Webapi", {
            headers: {
              "X-HTTP-Method-Override": "GetToken",
              email: "luigi.pippo@libero.it",
              password: "pippo"
            }
          })
          .then(response => {
            if (response.body != null) {
              localStorage.setItem("recruitingToken", response.body);

              this.canNavigate = true;
            }
          });
      } else {
        this.canNavigate = true;
      }
    }
  }
};
</script>
<style>
</style>
