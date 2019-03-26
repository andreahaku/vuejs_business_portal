<template>
<!-- extra div for emulating position:fixed of the menu -->
<div class="st-content-inner padding-top-none">
  <div v-if="loading" class='uil-rolling-css' style='transform:scale(0.71);
        position: absolute; margin: 0 auto; top: 100px; right: 0px; left: 0px;'>
    <div>
      <div></div>
      <div></div>
    </div>
  </div>
  <div v-else class="container-fluid">
    <div class="media media-grid media-clearfix-xs">
      <div class="media-body">
        <div class="page-section" style="padding-bottom: 20px;">
          <div class="media">
            <div v-if="logoAzienda" class="media-left">
              <img :src="logoAzienda" alt="" style="width: 60px; height: 60px;">
            </div>
            <div class="media-body">
              <h1 class="text-display-1 margin-none">{{titolo}}</h1>
              <h4 class="margin-none">{{nomeAzienda}}  -  {{sede}}</h4>
            </div>
          </div>
        </div>
        <span class="tag text-headline bg-green-300 visible-xs">{{tipoRapporto}}</span>
        <span v-if="orario!=null" class="tag text-headline bg-blue-300 visible-xs">{{orario}}</span>
        <div class="page-section" style="padding: 10px 20px;">
          <p v-html="descrizione"></p>
        </div>
        <span class="tag text-headline bg-green-300 hidden-xs" style="margin:0px 5px 15px 5px;">{{tipoRapporto}}</span>
        <span v-if="orario!=null" class="tag text-headline bg-blue-300 hidden-xs">{{orario}}</span>
        <hr style="margin: 10px 0px 0px 0px;" />
        <div v-if="dateToShow()" class="page-section" style="padding: 15px 0px;">
          <h2 class="text-headline margin-none">Termini e Scadenze</h2>
          <p class="text-subhead text-light">Date di riferimento</p>
          <ul class="list-group relative paper-shadow margin-none" data-hover-z="0.5" data-animated>
            <li class="list-group-item" style="padding: 5px;">
              <div class="media">
                <div class="media-left" style="padding-top: 5px;">
                  <div class="icon-block s30 bg-red-300 text-white img-circle">
                    <i class="fa fa-clock-o" aria-hidden="true"></i>
                  </div>
                </div>
                <div class="media-body text-body-2 row" style="padding: 10px 0px;">
                  <div class="col-xs-12 col-lg-6 row" v-if="dataRichiesta != null" style="margin-bottom: 10px;">
                    <span class="col-xs-12 col-sm-8">Richiesta effettuata in data:</span>
                    <span class="col-xs-12 col-sm-4">{{dataRichiesta}}</span>
                  </div>
                  <div class="col-xs-12 col-lg-6 row" v-if="dataScadenza != null" style="margin-bottom: 10px;">
                    <span class="col-xs-12 col-sm-8">Offerta scadente in data: </span>
                    <span class="col-xs-12 col-sm-4">{{dataScadenza}}</span>
                  </div>
                  <div class="col-xs-12 col-lg-6 row" v-if="dataInizio != null" style="margin-bottom: 10px;">
                    <span class="col-xs-12 col-sm-8">Inizio previsto in data: </span>
                    <span class="col-xs-12 col-sm-4">{{dataInizio}}</span>
                  </div>
                  <div class="col-xs-12 col-lg-6 row" v-if="dataFine != null" style="margin-bottom: 10px;">
                    <span class="col-xs-12 col-sm-8">Termine previsto in data: </span>
                    <span class="col-xs-12 col-sm-4">{{dataFine}}</span>
                  </div>
                  <div class="col-xs-12 col-lg-6 row" v-if="dataPubblicazione != null" style="margin-bottom: 10px;">
                    <span class="col-xs-12 col-sm-8">Pubblicazione effettuata in data: </span>
                    <span class="col-xs-12 col-sm-4">{{dataPubblicazione}}</span>
                  </div>
                  <div class="col-xs-12 col-lg-6 row" v-if="dataFinePubblicazione != null" style="margin-bottom: 10px;">
                    <span class="col-xs-12 col-sm-8">Termine pubblicazione in data: </span>
                    <span class="col-xs-12 col-sm-4">{{dataFinePubblicazione}}</span>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div v-if="nettoProposto != null" class="page-section" style="padding: 15px 0px;">
          <h2 class="text-headline margin-none">Retribuzione</h2>
          <p class="text-subhead text-light">Importi massimi e proposti</p>
          <ul class="list-group relative paper-shadow margin-none" data-hover-z="0.5" data-animated>
            <li class="list-group-item" style="padding: 5px;">
              <div class="media">
                <div class="media-left" style="padding-top: 5px;">
                  <div class="icon-block s30 bg-orange-300 text-white img-circle">
                    <i class="fa fa-usd" aria-hidden="true"></i>
                  </div>
                </div>
                <div class="media-body text-body-2" style="font-size: 16px; padding: 10px 0px;">
                  <div class="row">
                    <div class="col-xs-12 col-md-6">Stipendio netto:</div>
                    <div class="col-xs-12 col-md-6" style="color: #42a5f5; margin-bottom: 10px;">{{nettoProposto}} - {{nettoMax}}
                      <i class="fa fa-euro" aria-hidden="true"></i>
                    </div>
                    <div v-if="incentivoProposto != null" class="col-xs-12 col-md-6">Incentivo:</div>
                    <div v-if="incentivoProposto != null" class="col-xs-12 col-md-6" style="color: #42a5f5;">{{incentivoProposto}} - {{incentivoMax}}
                      <i class="fa fa-euro" aria-hidden="true"></i>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="media-right">
        <div class="page-section width-270 width-auto-xs">
          <!-- .panel -->
          <div class="panel panel-default paper-shadow" data-z="0.5" data-hover-z="1" data-animated>
            <hr class="margin-none" />
            <div class="panel-body text-center">
              <p><a class="btn btn-success btn-lg paper-shadow relative" data-z="1" data-hover-z="2" data-animated @click="send()">Invia Candidatura</a></p>
              <p class="text-body-2">o
                <router-link :to="{name: 'cv'}">modifica il tuo curriculum</router-link>
              </p>
            </div>
          </div>
          <!-- // END .panel -->
          <div class="panel panel-default paper-shadow" data-z="0.5" data-hover-z="1" data-animated>
            <div class="panel-heading">
              <h4 class="text-headline">Richiedente</h4>
            </div>
            <div class="panel-body">
              <div class="media v-middle">
                <div class="media-body">
                  <h4 class="text-title margin-none">{{nomeAzienda}}</h4>
                  <p v-if="sitoAzienda"><a :href="sitoAzienda">{{sitoAzienda}}</a></p>
                </div>
              </div>
              <br/>
              <div v-if="mailAzienda || telAzienda" class="panel-body" style="padding: 5px;">
                <p class="text-caption margin-none">
                  <i v-if="mailAzienda" class="fa fa-envelope fa-fw"></i> E-mail: <span>{{mailAzienda}}</span>
                  <br/>
                  <i v-if="telAzienda" class="fa fa-phone fa-fw"></i> Tel: <span>{{telAzienda}}</span>
                  <br/>
                </p>
              </div>
            </div>
          </div>
          <!-- .panel -->
          <div class="panel panel-default paper-shadow" data-z="0.5" data-hover-z="1" data-animated>
            <div class="panel-heading">
              <h4 class="text-headline">Contatto</h4>
            </div>
            <div class="panel-body">
              <div class="media v-middle">
                <div class="media-left">
                  <img src="images/profile-photo.png" alt="About Adrian" width="60" class="img-circle" />
                </div>
                <div class="media-body">
                  <h4 class="text-title margin-none"><a>{{nomeContatto}}</a></h4>
                  <span v-if="ruoloContatto" class="caption text-light">{{ruoloContatto}}</span>
                </div>
              </div>
              <br/>
              <div class="panel-body" style="padding: 5px;">
                <p class="text-caption margin-none">
                  <span v-if="mailContatto">
                            <i class="fa fa-envelope fa-fw"></i> E-mail: <span>{{mailContatto}}</span>
                  <br/>
                  </span>
                  <span v-if="telContatto">
                            <i class="fa fa-phone fa-fw"></i> Tel: <span>{{telContatto}}</span>
                  <br/>
                  </span>
                </p>
              </div>
            </div>
          </div>
          <!-- // END .panel -->
        </div>
        <!-- // END .page-section -->
      </div>
    </div>
  </div>
</div>
</template>
<script>
import {
  eventBus
} from '../../eventbus'

export default {
  mounted() {
    this.$nextTick(function() {
      this.checkToken()
    });
  },
  data: function() {
    return {
      id: null,
      titolo: '',
      descrizione: '',
      tipoRapporto: '',
      orario: null,

      idContatto: '',
      nomeContatto: '',
      ruoloContatto: null,
      mailContatto: null,
      telContatto: null,

      sede: '',
      idAzienda: '',
      nomeAzienda: '',
      sitoAzienda: null,
      mailAzienda: null,
      telAzienda: null,
      logoAzienda: null,

      idRuolo: '',
      ruolo: '',

      dataRichiesta: null,
      dataScadenza: null,
      dataInizio: null,
      dataFine: null,
      dataPubblicazione: null,
      dataFinePubblicazione: null,

      nettoProposto: null,
      nettoMax: null,
      incentivoProposto: null,
      incentivoMax: null,

      image: '',
      loading: true,

      baseToken: {}
    }
  },
  methods: {
    getDetail() {
      this.id = this.$route.params.id;
      if (this.id != null) {

        this.$http.get(localStorage.getItem("rec-path") + "/Posizione?ID=" + this.id, {
          headers: this.baseToken
        }).then((response) => {

          var res = response.body;
          try {
            res = JSON.parse(response.body);
          } catch (err) {};

          if (res != null && res.Posizione != null) {
            var job = res.Posizione[0];
            this.titolo = job.Intervento;
            this.descrizione = job.DescrizionePubblicazione;

            this.idAzienda = job.IDSocietà;
            this.sede = job.SedeLavoro;

            this.$http.get(localStorage.getItem("rec-path") + "/Società?ID=" + this.idAzienda, {
              headers: this.baseToken
            }).then((response) => {
              var res = response.body;
              try {
                res = JSON.parse(response.body);
              } catch (err) {};

              if (res && res.Società && res.Società[0]) {
                res = res.Società[0];
                this.nomeAzienda = res.Società;
                this.logoAzienda = res.Logo;

                this.sitoAzienda = res.sito;
                this.mailAzienda = res.Email;
                this.telAzienda = res.Telefono;
              }
            });

            this.idContatto = job.IDReferente;

            this.$http.get(localStorage.getItem("rec-path") + "/Persone?ID=" + this.idContatto, {
              headers: this.baseToken
            }).then((response) => {
              var res = response.body;
              try {
                res = JSON.parse(response.body);
              } catch (err) {};

              if (res && res.Persone && res.Persone[0]) {
                res = res.Persone[0];
                this.nomeContatto = res.Persona;
                this.ruoloContatto = res.ProvenienzaRuolo;
                this.mailContatto = res.Email;
                this.telContatto = res.Telefono;

              }
            });


            this.idRuolo = job.IDRuolo;
            this.tipoRapporto = job.TIPORAPPORTO;

            //campi opzionali
            this.orario = job.Orario;
            this.dataInizio = job.DataInizio;
            this.dataFine = job.DataFine;
            this.dataRichiesta = job.DataRichiesta;
            this.dataScadenza = job.DataScadenza;
            this.dataPubblicazione = job.DataInizioPubblicazione;
            this.dataFinePubblicazione = job.DataFinePubblicazione;

            this.nettoProposto = job.NettoProposto;
            this.nettoMax = job.NettoMax;
            this.incentivoProposto = job.IncentivoProposto;
            this.incentivoMax = job.IncentivoMax;
          }

          this.loading = false;

        }, function(err) {
          eventBus.$emit("alert", "Errore nel reperimento dell'impiego");
          this.$router.replace({
            path: '/app-recruiting'
          })
        });

      } else {
        eventBus.$emit("alert", "Impiego non esistente");
        this.$router.replace({
          path: '/app-recruiting'
        })
      }
    },
    dateToShow() {
      if (this.dataRichiesta != null || this.dataScadenza != null ||
        this.dataInizio != null || this.dataFine != null ||
        this.dataPubblicazione != null || this.dataFinePubblicazione != null) {
        return true;
      }
      return false;
    },
    checkToken() {
      var path = JSON.parse(this.$root.lsGet("configs")).urlApiRecruiting;
      localStorage.setItem("rec-path", path);
      if (localStorage.getItem("recruitingToken") == null) {
        this.$http.get(localStorage.getItem("rec-path") + "/Webapi", {
          headers: {
            'X-HTTP-Method-Override': 'GetToken',
            email: 'maicol.buscherini@bkm.it',
            password: 'Bkm-2008'
          }
        }).then((response) => {

          if (response.body != null) {
            localStorage.setItem("recruitingToken", response.body);
            this.baseToken.token = response.body;
            this.getDetail();
          }
        });
      } else {
        this.baseToken.token = localStorage.getItem("recruitingToken");
        this.getDetail();
      }
    },
    send() {
      if (localStorage.getItem("career-user-logged") != null) {

      } else {
        this.$router.replace({
          name: "log"
        })
      }
    }
  }
}
</script>
<style>
.tag {
  color: white;
  display: inline-block;
  border-radius: 5px;
  padding: 3px 5px;
  margin-right: 5px;
  margin-top: 5px;
}
</style>
