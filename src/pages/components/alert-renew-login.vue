<template>
<transition name="modal">
  <div class="modal-mask text-center" v-show="datashow" id="loginRenewModal" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
      <div class="modal-content" style="margin-top:100px;">
        <div class="modal-header">
          <h3 class="modal-title" id="myModalLabel">{{s.sessionExpired[l]}}</h3>
          <h5>{{s.sessioneExpiredSubtitle[l]}}</h5>
        </div>
        <div class="modal-body">
          <div v-if="success" class="panel panel-result panel-success">
            <div class="panel-body">
              {{s.messLoginSuccess[l]}}
              <i class="fa fa-check" aria-hidden="true"></i>
            </div>
          </div>
          <div v-else-if="errorOccurred" class="panel panel-result panel-danger">
            <div class="panel-body">
              {{s.authError[l]}}
              <i class="fa fa-times" aria-hidden="true"></i>
            </div>
          </div>
          <div v-else-if="loading" class="panel panel-result panel-info">
            <div class="panel-body">
              {{s.checkAuth[l]}}
              <i class="fa fa-spinner" aria-hidden="true"></i>
            </div>
          </div>

          <div class="form-group">
            <div class="form-control-material">
              <input class="form-control" id="user" type="text" v-model="user" disabled>
              <label id="userLab" for="old">{{s.user[l]}}</label>
            </div>
          </div>
          <div class="form-group">
            <div class="form-control-material">
              <input class="form-control" id="psw" type="password" :placeholder="s.psw[l]" @keypress.enter="enterModal($event)" @blur="tryFocusOut('psw')" v-model="password">
              <label id="pswLab" for="old">{{s.psw[l]}}</label>
            </div>
          </div>

          <button type="button" class="btn btn-danger" @click.prevent="logout()">logout</button>
          <button type="button" class="btn btn-primary" @click="login()">login</button>
        </div>
      </div>
    </div>
  </div>
</transition>
</template>
<script>
export default {
  props: {
    show: {
      type: Boolean
    }
  },
  data: function() {
    return {
      user: "",
      password: "",

      errorText: '',
      errorOccurred: false,
      success: false,
      loading: false,

      datashow: this.show,

      s: this.$root.getStrings(),
      l: this.$root.lang()
    }
  },
  watch: {
    'show': function() {
      this.datashow = this.show;
      this.init();
    }
  },
  methods: {
    init: function() {
      this.user = this.$root.lsGet('username');
      this.$nextTick(function() {
        this.tryFocusOut('user');
      })
    },
    close: function() {
      this.password = '';
      this.errorText = '';
      this.errorOccurred = false;
      this.success = false;
      this.tryFocusOut('user', true);
      this.tryFocusOut('psw', true);
      this.datashow = false;
      this.$emit('closed');
    },
    tryFocusOut: function(id, emp) {
      if (document.getElementById(id).value == "" || emp) {
        document.getElementById(id + "Lab").className = "";
      } else {
        document.getElementById(id + "Lab").className = "hidden";
      }
    },
    enterModal: function(e) {
      if (e.keyCode == 13) {
        this.login();
      }
    },
    logout: function() {
      location.pathname = "login.html"
    },
    login: function() {
      this.success = false;
      this.errorOccurred = false;
      this.loading = false;
      if (this.password == null || this.password.trim() == '') {
        this.errorOccurred = true;
        this.errorText = "Password mancante";
      } else {
        this.loading = true;
        localStorage.setItem('doNotIntercept', true);
        this.$http.get(localStorage.getItem("path") + '/Webapi', {
          headers: {
            'X-HTTP-Method-Override': "GetToken",
            'Content-Type': 'application/json',
            'ignoraToken': 'true',
            'username': this.user,
            'password': this.password
          }
        }).then((response) => {
          var res = response.body;
          try {
            res = JSON.parse(response.body);
          } catch (err) {};
          this.loading = false;
          this.success = true;
          // BB7A4F91-1865-430F-AD32-A3870E077493|0|Clemente Claudio|immagini/persone/4995.jpeg|4995|3|8|
          var infos = res.split('|');

          if (infos[0] && infos[0] != '') {
            infos = infos[0];
            localStorage.setItem("al_token", infos);
          }

          setTimeout(this.close, 800)
        }, (err) => {
          console.log(err)
          this.loading = true;
          this.errorOccurred = true;
          this.errorText = err.bodyText ? err.bodyText : 'Error not detected'
        });
      }
    }
  }
}
</script>
<style scoped>
.panel-result {
  padding: 0px;
  border-radius: 3px;
}

.panel-result.panel-danger {
  color: #a94442;
  background-color: #f2dede;
  border-color: #ebccd1;
}

.panel-result.panel-success {
  color: #3c763d;
  background-color: #dff0d8;
  border-color: #d6e9c6;
}

.panel-result.panel-info {
  color: #31708f;
  background-color: #d9edf7;
  border-color: #bce8f1
}

.panel-result .panel-body {
  padding: 12px 16px;
}

.panel-result i.fa {
  float: left;
}
</style>
