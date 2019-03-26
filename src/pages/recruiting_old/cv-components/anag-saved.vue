<template>
   
    <div class="panel panel-default paper-shadow"  style="margin-left: 10px;" data-z="0.5">  
    <div class="row">
         <div class="col-xs-3 col-md-4" style="text-align: right;">
                <div class="media-body">
                    <div class="media-right" style="padding: 5px 20px;">
                       
                        <h4 class="margin-none" style="padding: 15px 0px; font-size: 32px; text-align: left;">
                            Informazioni Personali
                             </h4>
                        <div class="row">
                            <hr class="col-xs-6" style="border-width: 3px; border-color: #42a5f5; margin-top: 5px;">
                        </div> 
                    </div>
                </div> 
                <br>
            </div>
         <!--<div class ="col-md-9 col-lg-8 right-side" style="vertical-align: middle;">   -->
          <div class="panel-heading right-side pull-right">
            <div class="media v-middle">
              <div class="media-right hidden-xs" style="float: right;">
                <a class="btn btn-primary btn-flat" @click="edit()">MODIFICA <i class="fa fa-pencil-square-o pad" aria-hidden="true"></i></a>
              </div>
            </div>
          </div>
    </div>
    <div class="media v-middle visible-xs" style="margin: 0px;">
      <div class="media-right pull-right" style="padding: 0px 10px;">
        <a class="btn btn-primary btn-flat" @click="edit()">MODIFICA <i class="fa fa-pencil-square-o pad" aria-hidden="true"></i></a>
      </div>
    </div>
    <div class="row">
               <div class="row" style="padding: 20px;">
                  <div class="col-xs-12 row">
                       <div class="col-xs-12 col-sm-6 col-md-4">
                        <div class="panel-body panel panel-default paper-shadow element" style="display: inherit;">

                                <div class="media v-middle">
                                    <div class="media-left">
                                        <i class="fa fa-user fa-3x an-icon"></i>
                                    </div>
                                    <div class="media-body"><strong><h4>Nome:</h4></strong>
                                    <div>
                                        <span v-if="anagraphics.nome!=null" style="color: grey; font-size: 16px;">{{Nome}}</span>
                                        <span v-else style="color: grey; font-size: 16px;">Nome Cognome</span>
                                    </div>
                                    </div>
                                </div>

                          </div>
                        </div>
                        
                        <div class="col-xs-12 col-sm-6 col-md-4" v-if="anagraphics.mail!=null">
                        <div class="panel-body panel panel-default paper-shadow element" style="display: inherit;">

                                <div class="media v-middle">
                                    <div class="media-left">
                                        <i class="fa fa-envelope fa-3x an-icon"></i>
                                    </div>
                                    <div class="media-body"><strong><h4>Email:</h4></strong>
                                    <div>
                                        <span style="color: grey; font-size: 16px;">{{anagraphics.mail}}</span>
                                    </div>
                                    </div>
                                </div>

                          </div>
                        </div>
                        
                        <div class="col-xs-12 col-sm-6 col-md-4">
                        <div class="panel-body panel panel-default paper-shadow element" style="display: inherit;">

                                <div class="media v-middle">
                                    <div class="media-left">
                                        <i class="fa fa-phone fa-3x an-icon"></i>
                                    </div>
                                    <div class="media-body"><strong><h4>Telefono:</h4></strong>
                                    <div>
                                        <span v-if="anagraphics.tel != null" style="color: grey; font-size: 16px;">{{anagraphics.tel}}</span>
                                        <span v-else style="color: grey; font-size: 16px;">XXXX999999</span>
                                    </div>
                                    </div>
                                </div>

                          </div>
                        </div>
                        
                        <div class="col-xs-12 col-sm-6 col-md-4">
                        <div class="panel-body panel panel-default paper-shadow element" style="display: inherit;">

                                <div class="media v-middle">
                                    <div class="media-left">
                                        <i class="fa fa-calendar fa-3x an-icon"></i>
                                    </div>
                                    <div class="media-body"><strong><h4>Data di Nascita:</h4></strong>
                                    <div>
                                        <span v-if="anagraphics.birth!=null" style="color: grey; font-size: 16px;">{{anagraphics.birth}}</span>
                                        <span v-else style="color: grey; font-size: 16px;">31/12/19XX</span>
                                    </div>
                                    </div>
                                </div>

                          </div>
                        </div>
                        
                        <div class="col-xs-12 col-sm-6 col-md-4">
                        <div class="panel-body panel panel-default paper-shadow element" style="display: inherit;">

                                <div class="media v-middle">
                                    <div class="media-left">
                                        <i class="fa fa-location-arrow fa-3x an-icon"></i>
                                    </div>
                                    <div class="media-body"><strong><h4>Indirizzo:</h4></strong>
                                    <div>
                                        <span v-if="anagraphics.indirizzo!=null" style="color: grey; font-size: 16px;">{{anagraphics.indirizzo}}</span>
                                        <span v-else style="color: grey; font-size: 16px;">Via Roma XX, Roma Italia</span>
                                    </div>
                                    </div>
                                </div>

                          </div>
                        </div>
                        
                        <div class="col-xs-12 col-sm-6 col-md-4">
                        <div class="panel-body panel panel-default paper-shadow element" style="display: inherit;">

                                <div class="media v-middle">
                                    <div class="media-left">
                                        <i class="fa fa-flag fa-3x an-icon"></i>
                                    </div>
                                    <div class="media-body"><strong><h4>Cittadinanza:</h4></strong>
                                    <div>
                                        <span v-if="anagraphics.cittadinanza!=null" style="color: grey; font-size: 16px;">{{anagraphics.cittadinanza}}</span>
                                        <span v-else style="color: grey; font-size: 16px;">Italiana</span>
                                    </div>
                                    </div>
                                </div>

                          </div>
                        </div>
                        
                    </div>
                </div>
                <div class="row" v-if="anagraphics.intro != null">
                    <div class="panel-body col-xs-12 col-sm-6 col-md-8" style="display: inherit; padding: 0px 0px 20px 10px;">
                      <div class="panel panel-default paper-shadow" style="border: 0px; padding: 25px;" v-html="anagraphics.intro">
                      </div>
                    </div>
                    <div class="panel-body col-xs-12 col-sm-6 col-md-4" 
                       style="padding: 20px;
                       ">
                        <img :src="userImg" alt="" class="img-circle img-responsive" 
                        style="{width: 100% \9; max-height: 300px; left: 0px; right: 0px; margin: 0 auto;}">
                    </div>
                </div>
                
          </div> 
      </div>
</template>

<script>
    
    import {eventBus} from '../../../eventbus.js'
        
    export default {
        mounted(){
            this.$nextTick(function(){
               this.loadFields(); 
            });
        },
        data(){
            return {
                anagraphics: {},
                placeholders: false,
                
                isChrome: !!window.chrome && !!window.chrome.webstore,
                
                userImg: localStorage.getItem("userAvatar")
            }  
        },
        computed: {
            Nome(){
                return this.anagraphics.nome+ " " + this.anagraphics.cognome;
            }  
        },
        methods: {
            edit: function(){               
                eventBus.$emit('AnagraficSwitch');
            },
            loadFields(){
                this.anagraphics = this.$store.getters.getAnagraphics;
                if(this.isChrome){
                    
                    var data = this.anagraphics.birth;
                    
                    try{
                        data = data.split("-");
                        data.reverse();
                        var n = data[0];
                        for(var j = 1; j < data.length; j++){
                            n += "/"+data[j];
                        }
                        this.anagraphics.birth = n;
                    } catch(err){}
                }
                if(this.anagraphics== null || this.anagraphics== {}){
                    this.anagraphics = {};
                    this.placeholders = true;
                } else {
                    if(window.innerWidth < 768){
                        if(this.anagraphics.mail){
                            var mail = this.anagraphics.mail.split('@');
                            this.anagraphics.mail = mail.join(" @");
                        }   
                    }
                }
            }
        }
    }
        
</script>

<style scoped>
    
    .left-side{
        background-color: blue;
        float: none;
        display: table-cell;
    }
    .right-side{
        float: none;
        display: table-cell;
    }
    h3.marg{
        margin: 0px 0px 3px 0px; 
    }
    .saved{
        border-bottom-style: groove;
        border-bottom-width: 2px;
    }
    .row{
        margin: 0px;
    }
    .an-icon{
        padding-right: 5px;
        color: #42a5f5;
    }
    .element{
        padding: 0px;
        border-width: 0px;
    }
</style>