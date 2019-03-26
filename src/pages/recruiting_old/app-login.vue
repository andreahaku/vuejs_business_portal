<template>
    <!-- extra div for emulating position:fixed of the menu -->
    <div class="st-content-inner padding-top-none">
        <div class="login">
            <div class="lock-container">
                <div class="panel panel-default text-center paper-shadow animated fadeInDown" style="padding: 50px;">
                    <h1 class="text-display-1 text-center" style="margin: 15px 0px;">Login Carriere</h1>
                    <img src="images/logoBKM.png" class="img-rounded width-200">
                    <div class="panel-body">
                        <div v-if="err" class="panel panel-danger">
                            <div class="panel-heading">
                                <h5 style="color: white">{{textErr}}</h5></div>
                        </div>
                        <div class="form-group" on>
                            <div class="form-control-material">
                                <input class="form-control" id="username" type="text" placeholder="mail utente" v-model="mail" @blur="labelout('mail')" @keydown.enter="log()">
                                <label id="usernameLab" for="username" v-if="!labelmailout">Mail Utente</label>
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="form-control-material">
                                <input v-if="!showPsw" class="form-control" id="password" type="password" placeholder="password" @keydown.enter="log()" v-model="psw" @blur="labelout('psw')">
                                <input v-else="!showPsw" class="form-control" id="password" type="text" placeholder="password" @keydown.enter="log()" v-model="psw" @blur="labelout('psw')">
                                <label id="passwordLab" for="password" v-if="!labelpswout">Password</label>
                            </div>
                        </div>
                        <a @click.prevent="log()" class="btn btn-primary">Login <i class="fa fa-fw fa-unlock-alt"></i></a>
                        <div style="position: relative;">
                            <div v-if="loading" class='uil-rolling-css pull-right' style='transform:scale(0.15);
                            margin: 0px; padding: 0px; position: absolute; top: -115px; right: -50px;'>
                                <div>
                                    <div></div>
                                    <div></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="pull-right">
                        <span>Mostra password</span>
                        <input type="checkbox" v-model="showPsw" style="margin: 5px;">
                    </div>
                </div>
            </div>
        </div>
        <sidejsonly :default="false"></sidejsonly>
    </div>
</template>
<script>
import sidejsonly from "../components/side-default-jsonly.vue"
export default {
    components: {
        sidejsonly
    },
    data() {
        return {
            mail: 'maicol.buscherini@bkm.it',
            psw: 'Bkm-2008',
            showPsw: false,

            labelmailout: true,
            labelpswout: true,

            loading: false,
            err: false,
            textErr: ''
        }
    },
    methods: {
        log() {
            if (this.mail.trim() == '') {
                this.err = true;
                this.textErr = 'Campo Mail Utente mancante';
            } else if (this.psw.trim() == '') {
                this.err = true;
                this.textErr = 'Campo Password mancante';
            } else {
                this.loading = true;
                localStorage.setItem('doNotIntercept', true);
                var path = JSON.parse(this.$root.lsGet("configs")).urlApiRecruiting;
                localStorage.setItem("rec-path", path);
                this.$http.get(localStorage.getItem("rec-path") + "/Webapi", {
                    headers: {
                        'X-HTTP-Method-Override': 'GetToken',
                        email: this.mail,
                        password: this.psw
                    }
                }).then((response) => {
                    localStorage.removeItem('doNotIntercept');
                    this.loading = false;
                    localStorage.setItem("career-user-logged", this.mail);
                    localStorage.setItem("recruitingToken", response.body);
                    this.getID();
                }, function(err) {
                    this.err = true;
                    this.textErr = 'Credenziali Errate';
                    this.loading = false;
                    localStorage.removeItem('doNotIntercept');
                });
            }
        },
        getID() {
            this.$http.get(localStorage.getItem("rec-path") + "/Persone?Email=" + localStorage.getItem("career-user-logged"), {
                headers: {
                    'token': localStorage.getItem("recruitingToken")
                }
            }).then((response) => {
                var res = response.body;
                try{
                    res = JSON.parse(response.body);
                } catch(err) {};
                
                if (res.Persone && res.Persone.length == 1) {
                    localStorage.setItem("career-user-id", res.Persone[0].ID);
                    this.goCv();
                } else {
                    alert('Error: more than one user with the same Email');
                }
            });
        },
        goCv() {
            if (localStorage.getItem('goingCv') == 'true') {
                this.$router.replace({
                    name: 'cv'
                })
            } else {
                this.$router.replace({
                    name: 'jobs'
                })
            }
        },
        labelout(what) {
            if (what === 'psw') {
                if (this.psw.trim() != '') {
                    this.labelpswout = true;
                } else {
                    this.labelpswout = false;
                }
            } else {
                if (this.mail.trim() != '') {
                    this.labelmailout = true;
                } else {
                    this.labelmailout = false;
                }
            }
        }
    }
}
</script>
<style scoped>
.login {
    width: 400px;
    margin: 100px auto;
    position: absolute;
    right: 0px;
    left: 0px;
}
</style>
