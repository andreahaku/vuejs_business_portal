<template>
<div class="st-pusher" id="content">
    <div class="st-content">
        <div class="st-content-inner padding-none">
            <div class="container-fluid">
                <div class="page-section row" style="padding-bottom: 0px;">
                    <div class="media v-middle col-xs-12">
                        <div class="media-body">
                            <div class="media-left">
                                <h1 class="text-display-1 margin-none">Il Mio Profilo</h1>
                                <p class="text-subhead" style="margin: 0px;">Visualizza e Modifica le tue informazioni personali</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="loading" class='uil-rolling-css' style='transform:scale(0.71);
                    position: absolute; margin: 0 auto; top: 150px; right: 0px; left: 0px;'>
                <div>
                    <div></div>
                    <div></div>
                    </div>
                </div>
                <div v-else class="row">
                    <div class="col-xs-12" style="text-align: left; margin: 15px 5px;">
                    <!--
                        <div class="thumbnail">
                            <img :src="path + userdata.Immagine"  onerror="this.src = 'images/profile-photo_small.png'" >
                            <div class="caption" style="text-align: center;">
                                <h3>{{userdata.Nome + " " + userdata.Cognome}}</h3>
                                <h4>{{userdata.UO}}</h4>
                                <span class="caption text-light">{{userdata.Ruolo}}</span>
                            </div>
                        </div>
                    -->
                        <div class="media">
                            <div class="media-left" style="padding-right: 20px;">
                                <a href="#">
                                    <img :src="userdata.Immagine" @click.prevent="showUp = true" onerror="this.src = 'images/profile-photo_small.png'" style="border-radius: 10px;">
                                </a>
                            </div>
                            <div class="media-body" style="vertical-align: middle; margin-left: 10px;">
                                <h3 class="media-heading">{{userdata.Nome + " " + userdata.Cognome}}</h3>
                                <h4>{{userdata.UO}}</h4>
                                <span class="caption text-light">{{userdata.Ruolo}}</span>
                            </div>
                        </div>

                    </div>
                    <div class="col-xs-12">
                        <h4 class="text-headline margin-none" style="text-align: center;">Curriculum</h4>
                        <div v-if="!editmode">
                            <div class="well" v-html="userdata.Biografia"></div>
                            <a href="#" class="btn btn-primary btn-sm" style="float: right;" @click.prevent="startedit()"><i class="fa fa-edit"></i>MODIFICA</a>
                        </div>
                        <div v-else>
                            <vue-html-editor name="html-editor" v-model="userdata.Biografia" language="it-IT"></vue-html-editor>
                            <a href="#" class="btn btn-warning btn-sm" style="float: right;" @click.prevent="endedit()"><i class="fa fa-edit"></i>SALVA</a>
                            <a href="#" class="btn btn-info btn-sm" style="float: right; margin-right: 8px;" @click.prevent="canceledit()"><i class="fa fa-reply"></i>ANNULLA</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- POPUPS -->
      <image-upload :show="showUp" @closed="showUp = false;"></image-upload>
    </div>
    </div>
</div>
</template>
<script>

import {
  eventBus
} from '../eventbus.js';

import vueHtmlEditor from './_fullDyn/htmlEditor.vue'
import ImageUpload from './components/ImageUpload.vue'

export default {
    mounted: function(){
        this.getSelf();
    },
    components: {
        vueHtmlEditor,
        ImageUpload
    },
    created: function() {
        var vm = this;
        eventBus.$on('gotAvatar', function(mess) {
            vm.userdata.Immagine = localStorage.getItem("userAvatar");
        });
    },
    data: function(){
        return {
            loading: true,
            userdata: {},
            editmode: false,
            backup: null,
            path: localStorage.getItem("path"),
            showUp: false
        }
    },
    methods: {
        getSelf: function(){
            var testing = false;

            this.$http.get(this.path + "/APIPersone?IDPERSONA=" +localStorage.getItem("idpersona")).then((response) => {
                var res = response.body;
                try {
                    res = JSON.parse(response.body);
                } catch (err) {};

                var source = {}; 
                if(res && res.APIPersone){
                    source = res.APIPersone[0];
                    source.Biografia = source.Biografia ? source.Biografia : !testing ? "" : "Lorem ipsum dolor sit amet, quot purto reprimique ad pri, usu odio illum dolorum ea. Ea dicat atomorum sapientem his, eu duo suas iuvaret voluptatibus, ad vel iisque repudiare patrioque. Enim principes pri an, eam vero tation eripuit ne, vivendum contentiones definitiones ad nec. Decore tibique pri in. Eos enim lorem mentitum eu. Usu in partem facilisis, vel in quis everti omittam."
                    
                } else {
                    if(testing){
                        source = {
                            IDPERSONA: 1521,
                            NOME: "Maicol",
                            COGNOME: "Buscherini",
                            RUOLO: "Analista Programmatore",
                            UO: "Management",
                            IMMAGINE: null,
                            //Biografia: "<ul><li>Morbi in sem quis dui placerat ornare. Pellentesque odio nisi, euismod in, pharetra a, ultricies in, diam. Sed arcu. Cras consequat.</li><li>Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat. Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus.</li><li>Phasellus ultrices nulla quis nibh. Quisque a lectus. Donec consectetuer ligula vulputate sem tristique cursus. Nam nulla quam, gravida non, commodo a, sodales sit amet, nisi.</li><li>Pellentesque fermentum dolor. Aliquam quam lectus, facilisis auctor, ultrices ut, elementum vulputate, nunc.</li></ul>"
                            Biografia: '<h3>Biografia di Maicol Buscherini - <a href="http://www.bkm.it/" target="_blank">Bookmark</a></h3><p><strong>Pellentesque habitant morbi tristique</strong> senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. <em>Aenean ultricies mi vitae est.</em> Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, <code>commodo vitae</code>, ornare sit amet, wisi. Aenean fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui. <a href="#">Donec non enim</a> in turpis pulvinar facilisis. Ut felis.</p><h2>Header Level 2</h2><ol>   <li>Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</li> <li>Aliquam tincidunt mauris eu risus.</li></ol><h3>Header Level 3</h3><ul>  <li>Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</li><li>Aliquam tincidunt mauris eu risus.</li></ul>'
                            }
                    } else {
                        this.exit();
                    }
                }
                this.userdata.ID = source.IDPERSONA;
                this.userdata.Nome = source.NOME;
                this.userdata.Cognome = source.COGNOME;
                this.userdata.Ruolo = source.RUOLO;
                this.userdata.UO = source.UO;

                this.userdata.Immagine = localStorage.getItem("userAvatar") ? localStorage.getItem("userAvatar") : this.path + source.IMMAGINE;
                this.userdata.Biografia = source.Biografia;
                console.log(this.userdata)
                this.loading = false;
            }, (err) => {
                this.loading = false;
                this.exit();
            });
        },
        exit: function(){
            eventBus.$emit("alert", "Nessuna Persona associata all'utente corrente")
            this.$router.replace({
                name: 'home'
            });
        },
        startedit: function(){
            this.editmode = true;
            this.backup = this.userdata.Biografia;
        },
        endedit: function(){    
            //this.$http.get()
            this.editmode = false;
        },
        canceledit: function(){
            this.userdata.Biografia = this.backup;
            this.editmode = false;
        }
    }
}
</script>
<style scoped>
.btn-sm > i {
    margin-right: 5px;
}
</style>