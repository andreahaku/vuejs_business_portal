<template>
    <transition name="modal">
        <div class="modal-mask text-center" v-show="datashow" id="pswChangeModal" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
            <div class="modal-dialog" role="document">
                <div class="modal-content" style="margin-top:100px;">
                    <div class="modal-header">
                        <h3 class="modal-title" id="myModalLabel">{{s.modificaPassword[l]}}</h3>
                    </div>
                    <div class="modal-body">
                        <div v-if="errorOccurred" class="panel panel-danger">
                            <div class="panel-body">
                                {{errorText}}
                            </div>
                        </div>
                        <div v-if="success" class="panel panel-success">
                            <div class="panel-body">
                                {{s.pswSuccess[l]}}
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="form-control-material">
                                <input class="form-control" id="old" type="password" :placeholder="s.vecchiaPassword[l]" @keypress="enterModal($event)" @blur="tryFocusOut('old')" v-model="checkOld">
                                <label id="oldLab" for="old">{{s.vecchiaPassword[l]}}</label>
                            </div>
                        </div>
                        <div id="oldAlert" class="alert alert-danger alert-dismissible fade in" :class="{'hide': old}" style="padding:8px;" role="alert">
                            <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">x</span></button>
                            <h4 style="margin-bottom:0px;">{{s.oldError[l]}}</h4>
                        </div>
                        <div class="form-group">
                            <div class="form-control-material">
                                <input class="form-control" id="new" type="password" :placeholder="s.nuovaPassword[l]" @keypress="enterModal($event)" @blur="tryFocusOut('new')" v-model="newPsw">
                                <label id="newLab" for="old">{{s.nuovaPassword[l]}}</label>
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="form-control-material">
                                <input class="form-control" id="checkPsw" type="password" :placeholder="s.nuovaPassword[l]" @keypress="enterModal($event)" @blur="tryFocusOut('checkPsw')" v-model="checkNew">
                                <label id="checkPswLab" for="old">{{s.confermaPassword[l]}}</label>
                            </div>
                        </div>
                        <div id="newAlert" class="alert alert-danger alert-dismissible fade in" :class="{'hide': neww}" style="padding:8px;" role="alert">
                            <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">x</span></button>
                            <h4 style="margin-bottom:0px;">{{s.checkError[l]}}</h4>
                        </div>
                        <button type="button" class="btn btn-primary" @click="updatePassword()">{{s.invia[l]}}</button>
                        <button type="button" class="btn btn-primary" @click.prevent="close()">{{s.chiudi[l]}}</button>
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
            oldPsw: "",
            checkOld: "",
            newPsw: "",
            checkNew: "",

            neww: true,
            old: true,
            errorText: '',
            errorOccurred: false,
            success: false,

            datashow: this.show,


            s: this.$root.getStrings(),
            l: this.$root.lang()
        }
    },
    watch: {
        'show': function() {
            this.datashow = this.show;
            this.recover();
        }
    },
    methods: {
        close: function() {
            this.checkOld = '';
            this.newPsw = '';
            this.checkNew = '';
            this.neww = true;
            this.old = true;
            this.errorText = '';
            this.errorOccurred = false;
            this.success = false;
            this.tryFocusOut('checkPsw', true);
            this.tryFocusOut('new', true);
            this.tryFocusOut('old', true);
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
                this.updatePassword();
            }
        },
        recover: function() {
            this.$http.get(localStorage.getItem('path') + '/APIUtenti?IDPersona=' + localStorage.getItem("idpersona"), {
                headers: {
                    light: "1"
                }
            }).then((response) => {
                var res = response.body;
                try {
                    res = JSON.parse(response.body);
                } catch (err) {};

                if (res != null && res.APIUtenti != null) {
                    res = res.APIUtenti[0];
                    this.oldPsw = res.Password;
                }
            });
        },
        updatePassword: function() {
            if (!this.success) {
                this.errorOccurred = false;
                if (this.newPsw != this.checkNew) {
                    this.neww = false;
                    this.newPsw = "";
                    this.checkNew = "";
                    this.tryFocusOut('checkPsw');
                    document.getElementById('new').focus();

                } else {
                    this.neww = true;
                    if (this.checkOld === this.oldPsw) {
                        this.old = true;

                        var json = {
                            Username: localStorage.getItem("username"),
                            NuovaPassword: this.newPsw
                        };
                        this.$http.post(localStorage.getItem('path') + '/Webapi', json, {
                            headers: {
                                'X-HTTP-Method-Override': "ModificaPassword",
                                'Content-Type': 'application/json'
                            }
                        }).then((response) => {
                            var res = response.body;
                            try {
                                res = JSON.parse(response.body);
                            } catch (err) {};

                            if (res != null && res != "") {
                                if (res.Response.Result != "OK") {
                                    this.errorText = res.Response.Result;
                                    this.errorOccurred = true;
                                } else {
                                    this.success = true;
                                }
                            }
                        });

                    } else {
                        this.checkOld = '';
                        document.getElementById('old').focus();
                        this.old = false;
                    }

                }
            }
        }
    }
}
</script>
<style>
.modal-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    display: table;
    transition: opacity .3s ease;
}

.modal-wrapper {
    display: table-cell;
    vertical-align: middle;
}

.modal-container {
    width: 300px;
    margin: 0px auto;
    padding: 20px 30px;
    background-color: #fff;
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
    transition: all .3s ease;
    font-family: Helvetica, Arial, sans-serif;
}

.modal-header h3 {
    margin-top: 0;
    color: #42b983;
}

.modal-body {
    margin: 0px 0;
}

.modal-default-button {
    float: right;
}


/*
     * the following styles are auto-applied to elements with
     * v-transition="modal" when their visiblity is toggled
     * by Vue.js.
     *
     * You can easily play with the modal transition by editing
     * these styles.
     */


/*
    .modal-enter, .modal-leave {
      opacity: 0;
    }

    .modal-enter .modal-container,
    .modal-leave .modal-container {
      -webkit-transform: scale(1.1);
      transform: scale(1.1);
    }
    */
</style>
