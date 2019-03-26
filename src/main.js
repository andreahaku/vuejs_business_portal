// VueJS
import Vue from 'vue';
// HTTP library for Vue
import VueResource from 'vue-resource';
// Vue routing
import VueRouter from 'vue-router';

//Random record generator library
import Chance from 'chance';
//LZ compression library
import LZString from 'lz-string';

// root Vue component
import App from './App.vue';
import {
  store
} from './store';

// http resourse setup
Vue.use(VueResource);
// routing setup
Vue.use(VueRouter);


import Dashboard from './pages/dashboard.vue';
import DashboardConfiguration from './pages/dashboard-configuration.vue';
import AppProfilo from './pages/app-profilo.vue';

var basic_routes = [{
  path: '/',
  component: Dashboard
}, {
  path: '/dashboard',
  name: 'home',
  component: Dashboard
}, {
  path: '/dashboard-configuration',
  name: 'dashboardConfiguration',
  component: DashboardConfiguration
}, {
  path: '/app-profile',
  name: 'profilo',
  component: AppProfilo
}];

/* 0 LEARNING 
import {
  learningRoutes
} from './pages/learning/learning-routes' */
/* 1 RECRUITING 
import {
  jobRoutes
} from './pages/recruiting/recruiting-routes'; */
/* 2 DOCUMENTS
import {
  docRoutes
} from './pages/others/document-routes'; */
/* 3 RUBRICA */
import {
  indexRoutes
} from './pages/others/rubrica-routes';
/* SKILLS - NOT A MODULE YET */
import {
  skillRoutes
} from './pages/others/skill-routes';
/* 4 GOALS */
import {
  goalRoutes
} from './pages/goal/goal-routes';
/* 5 COMPETENZE HITACHI
import {
  competenceHitRoutes
} from './pages/competenzeHIT/eval-routes'; */
/* 6 FEEDBACK */
import {
  feedRoutes
} from './pages/feedback/feedback-routes';
/* 7 TUTOR 
import {
  tutorRoutes
} from './pages/tutor/tutor-routes'; */
/* 8 CALENDAR
import {
  calendarRoutes
} from './pages/calendar/calendar-routes'; */
/* 9 COLLECTION 
import {
  collectionRoutes
} from './pages/data-collection/collection-routes'; */
/* 10 COMPETENZE GENERICHE */
import {
  competenceRoutes
} from './pages/competenze/eval-routes';

var else_route = [{
  path: '*',
  redirect: '/'
}];

var modules = getEnablingObject();
var enabled = basic_routes;

try {

  if (modules.learning) {
    enabled = enabled.concat(learningRoutes);
  }
  if (modules.recruiting || modules.curriculum) {
    //split job routes in: recruiting - curriculum
    //concateno a children solo i figli interessati (wrapper path: '/app-recruiting'),
    //jobRoutes NON COME ARRAY!
    var including_routes = jobRoutes;
    including_routes.children = [];
    if (modules.recruiting) {
      //recruiting children routes
      including_routes.children = including_routes.recruiting_children;
    }
    if (modules.curriculum) {
      //curriculum children routes
      including_routes.children = including_routes.children.concat(including_routes.curriculum_children);
    }
    //including_routes COME ARRAY
    console.log([including_routes])
    enabled = enabled.concat([including_routes]);
  }
  if (modules.documenti) {
    enabled = enabled.concat(docRoutes);
  }
  if (modules.rubrica) {
    enabled = enabled.concat(indexRoutes);
  }
  if (modules.goals) {
    enabled = enabled.concat(goalRoutes);
  }
  if (modules.competenzeHIT) {
    enabled = enabled.concat(competenceHitRoutes);
  }
  if (modules.feedback) {
    enabled = enabled.concat(feedRoutes);
  }
  if (modules.tutor) {
    enabled = enabled.concat(tutorRoutes);
  }
  if (modules.calendar) {
    enabled = enabled.concat(calendarRoutes);
  }
  if (modules.collection) {
    enabled = enabled.concat(collectionRoutes);
  }
  if (modules.competenze) {
    enabled = enabled.concat(competenceRoutes);
  }
  enabled = enabled.concat(else_route);

  var router = new VueRouter({
    routes: enabled
  });

} catch (err) {
  window.alert("caught error on main.js change")
  location.pathname = '/login.html';
}

Object.defineProperty(Vue.prototype, '$Test', {
  get() {
    return this.$root.test_collection_data;
  }
})

//FETCHING TEST DATA MODULE COLLECTION
import {
  attivita
} from '../static/test/_Json_Di_Prova/attivita'
import {
  chat
} from '../static/test/_Json_Di_Prova/chat'
import {
  tabella
} from '../static/test/_Json_Di_Prova/tabella'

if (getEnablingObject().collection) {
  console.log("Module Collection Enabled")
}
//  END FETCHING
var state_string = null;
var trans_string = 'static/strings.json';
if (modules.competenzeHIT) {
  state_string = 'secondary';
  trans_string = 'static/others/strings_hit.json';
} else if (modules.competenze) {
  state_string = 'primary';
}

import {
  state_config
} from './data_sources/state_config'
import {
  state_config_hit
} from './data_sources/state_config_hit'

var matrice_permessi;
if (state_string != null) {
  if (state_string == 'primary') {
    matrice_permessi = state_config;
  } else if (state_string == 'secondary') {
    matrice_permessi = state_config_hit;
  }
}

var translation;
var xobj = new XMLHttpRequest();
xobj.overrideMimeType("application/json");
xobj.open('GET', trans_string, false); // Replace 'my_data' with the path to your file
xobj.onreadystatechange = function () {
  if (xobj.readyState == 4 && xobj.status == "200") {
    translation = JSON.parse(xobj.responseText);
  }
};
xobj.send(null);


var performance_survey = null;
if (modules.competenze) {
  var sreq = new XMLHttpRequest();
  sreq.overrideMimeType("application/json");
  sreq.open('GET', "static/survey.json", false); // Replace 'my_data' with the path to your file
  sreq.onreadystatechange = function () {
    if (sreq.readyState == 4 && sreq.status == "200") {
      performance_survey = JSON.parse(sreq.responseText);
      console.log(performance_survey)
    }
  };
  sreq.send(null);
}


Vue.http.headers.common['Access-Control-Allow-Origin'] = '*://*/*';
//import eventbus, usato esclusivamente nell'interceptor per comunicare ad App.vue di aprire il popup di login
import {
  eventBus
} from './eventbus.js'
//TOKEN HANDLER INTERCEPTOR
Vue.http.interceptor.before = function (request, next) {
  //non posso configurare il token con Vue.http.common['token'], perchè nel momento in cui il token si aggiorna, non mi è possibile fare l'override
  //quindi sono costretto a fare riferimento al local storage, prima di ogni richiesta http
  var is_recruiting = request.headers.map.token == 'recruiting_token'
  if (!is_recruiting) {
    request.headers.set('token', localStorage.getItem("al_token"));
  } else {
    request.headers.set('token', localStorage.getItem("recruitingToken"));
  }
  next()
}
//401 HANDLER INTERCEPTOR
Vue.http.interceptors.push(function (request, next) {
  next(function (response) {
    if (response.status == 401) { //forcing interceptor

      if (localStorage.getItem("doNotIntercept") != 'true' && localStorage.getItem("TokenScaduto") != 'true') {
        //--- CONDIZIONI RENEW LOGIN AMICHEVOLE ---
        //1ª  -   Username Presente in local Storage
        var gotUser;
        gotUser = vueInstance.lsGet("username");
        //2ª  -   Non è passato troppo tempo (< expiration) dall'ultima richiesta effettuata
        var expiration = null;
        try {
          expiration = JSON.parse(vueInstance.lsGet("configs")).forced_expiration;
        } catch (err) {
          console.log(err)
        }
        //forced_expiration configurabile, di default è 12 ore
        expiration = expiration ? expiration : 43200000;
        console.log(expiration)
        var expired = false;
        //data (in ms) dell'ultima richeista effettuata
        var last_request_time = localStorage.getItem("last_request_time");
        if (last_request_time && last_request_time != '') {
          //se è passato troppo tempo dall'ultima richiesta, non propongo il ripristino amichevole della sessione
          expired = (Date.now() - last_request_time) >= expiration;
        }
        //3ª  -   Nell'header della richeista http, è specificato il campo friendly-renew = -1
        var renewable = false;
        try {
          console.log(request.headers.map['friendly-renew'][0])
          renewable = request.headers.map['friendly-renew'][0] == -1;
          console.log(renewable)
        } catch (err) { }

        //se sono vere 1ª, 2ª e 3ª
        if (gotUser != null && gotUser != '' && !expired && renewable) {
          // viene aperto il popup di rinnovo amichevole
          eventBus.$emit("renewLogin");
          // e la promise 'rimane' risolta con codice 401
        } else {
          //altrimenti, la sessione scade e la navigazione viene forzata verso la pagina di login
          localStorage.setItem("TokenScaduto", true);
          eventBus.$emit("alert", "Sessione scaduta");

          response.ok = true;
        }
      }
    }

    //indipendentemente dal tipo di chiamata e dalla risposta, aggiorno last_request_time
    localStorage.setItem("last_request_time", Date.now())
    // rimuovo il flag in ogni caso (abilitato per recruiting e ripristino sessione)
    if (localStorage.getItem("doNotIntercept") == 'true') {
      localStorage.removeItem('doNotIntercept');
    }
  }.bind(this));
}.bind(this));

router.afterEach(function (transition) {

  localStorage.setItem("prevVisited", localStorage.getItem("lastVisited"));
  localStorage.setItem("lastVisited", transition.path);

  if (vueInstance) {
    //controllo per xs ripetuto ad ogni switch route path
    vueInstance._data.xs = window.innerWidth < 768;
  }
});

Object.defineProperty(Vue.prototype, '$Stati', {
  get() {
    return this.$root.stati_valutazione;
  }
})
Object.defineProperty(Vue.prototype, '$Ev', {
  get() {
    return this.$root.evaluate;
  }
})
console.log(screen)
console.log(screen.orientation)
window.addEventListener("orientationchange", function () {
  vueInstance.orientation = screen.orientation;
  console.log(vueInstance.orientation)
}, false);

import {
  competenceMixin
} from './pages/competenzeCommon/bothCompetenceMixin.js'
import {
  requestSplitterMixin
} from './requestSplitterMixin.js'

var vueInstance = new Vue({
  el: '#app',
  store: store,
  router: router,
  mixins: [competenceMixin, requestSplitterMixin],
  render: h => h(App),
  data: function () {
    return {
      //vedere static/test/_Json_Di_Prova per il formato dei dati
      test_collection_data: {
        attivita: attivita.attivita,
        chat: chat.chat,
        tabella: tabella
      },
      // test collection
      inCharge: {},

      matrice_permessi: matrice_permessi,
      performance_survey_template: performance_survey,
      chance: Chance(),

      xs: window.innerWidth < 768 ? true : false,
      orientation: screen.orientation
    }
  },
  methods: {
    evaluate: function (o) {
      if (o == 3 || o == 5) {
        return 'mod';
      } else if (o == 2) {
        return 'vis';
      } else {
        return null;
      }
    },
    isMandatory: function (auth) {
      return auth == 5;
    },
    getPermessi: function () {
      return matrice_permessi;
    },
    isAdmin: function () {
      if (localStorage.getItem("as") != null) {
        try {
          var a = LZString.decompressFromUTF16(localStorage.getItem("as"));
          console.log(a == 'true')
          return a == 'true';
        } catch (err) {
          console.log(err)
          return false;
        }
      } else {
        return false;
      }
    },
    isVal: function () {
      var v = JSON.parse(this.lsGet("isv"));
      if (v == null) {
        return false
      } else {
        return v;
      }
    },
    lang: function () {
      var l = LZString.decompressFromUTF16(localStorage.getItem("lan"));
      if (l == null) {
        return 0;
      } else {
        if (l == "ita") {
          return 0;
        } else if (l == "eng") {
          return 1;
        } else {
          return 0;
        }
      }
    },
    getLang: function () {
      var l = LZString.decompressFromUTF16(localStorage.getItem("lan"));
      if (l == null) {
        return "ita";
      } else {
        return l;
      }
    },
    getEnablingObject: function () {
      var ones = JSON.parse(this.lsGet("configs"));
      var ch = this.lsGet("ench");
      return EnabledOnes(ones, ch);
    },
    lsSet: function (name, obj) {
      try {
        localStorage.setItem(name, LZString.compressToUTF16(obj));
      } catch (err) {
        localStorage.setItem(name, obj);
      }

    },
    lsGet: function (name) {
      if (localStorage.getItem(name) == null) {
        return null;
      } else {
        try {
          var x = LZString.decompressFromUTF16(localStorage.getItem(name));
          return x;
        } catch (err) {
          return localStorage.getItem(name);
        }
      }
    },
    getModule: function (id) {
      var modules = this.$store.getters.getModuli;
      for (var i = 0; i < modules.length; i++) {
        if (modules[i].name === "moduli" + id) {
          return modules[i];
        }
      }
      return null;
    },
    saveModules: function (idcorso, moduli) {

      let mod = this.$store.getters.getListaModuli;
      if (mod) {
        var index = mod.indexOf(idcorso);
        if (index != -1) {
          mod.splice(index, 1);
        }
      } else {
        mod = [];
      }
      mod.push(idcorso);
      this.$store.commit("listaModuli", mod);
      this.$store.commit("insertModule", {
        id: idcorso,
        mod: moduli
      })
    },
    getStrings: function () {
      return translation;
    },
    getDashConfig: function () {
      if (this.lsGet("colonna_dx") != null && this.lsGet("colonna_sx") != null) {

        return {
          sx: JSON.parse(this.lsGet("colonna_sx")),
          dx: JSON.parse(this.lsGet("colonna_dx"))
        }
      } else {
        return this.initDashConfig()
      }
    },
    initDashConfig: function () {

      var modules = this.getEnablingObject();
      if (modules.learning == null) {
        location.pathname = '/login.html';
      }

      var sx, dx;

      sx = [{
        nome: "appRubrica",
        title: "ricerca rubrica",
        abilitato: modules.rubrica,
        visibile: false
      }, {
        nome: "appWidgetGoal",
        title: "valutazioni ricevute",
        abilitato: modules.goals,
        visibile: false,
        valutatore: false
      }, {
        nome: "appDocumenti",
        title: "i miei documenti",
        abilitato: modules.documenti,
        visibile: false
      }, {
        nome: "appWidgetGiven",
        title: "i miei feedback",
        abilitato: modules.feedback,
        visibile: false
      }, {
        nome: "appWidgetReceived",
        title: "feedback richiesti",
        abilitato: modules.feedback,
        visibile: false
      }, {
        nome: "appWidgetEval",
        title: "le tue schede di performance",
        abilitato: modules.competenzeHIT,
        visibile: false
      }, {
        nome: "appWidgetRicerca",
        title: "ricerca schede valutazione",
        abilitato: (modules.competenzeHIT && this.isAdmin()),
        visibile: false
      }, {
        nome: "appRicercaPartecipazioni",
        title: "ricerca partecipazioni",
        abilitato: modules.learning,
        visibile: false
      }];

      dx = [{
        nome: "appRicerca",
        title: "ricerca corsi",
        abilitato: modules.learning,
        visibile: false
      }, {
        nome: "appMieiCorsi",
        title: "i miei corsi",
        abilitato: modules.learning,
        visibile: false
      }, {
        nome: "appAttivitaForum",
        title: "attività forum",
        abilitato: modules.learning,
        visibile: false
      }, {
        nome: "appFeatured",
        title: "corsi consigliati",
        abilitato: modules.learning,
        visibile: false
      }, {
        nome: "appRicercaGoal",
        title: "ricerca goal",
        abilitato: modules.goals && this.isAdmin(),
        valutatore: false,
        visibile: false
      }, {
        nome: "appWidgetEval",
        title: "schede da valutare",
        abilitato: (modules.competenzeHIT && this.isVal()),
        visibile: false,
        valutatore: true
      }, {
        nome: "appRicercaGoal",
        title: "valutazioni da effettuare",
        abilitato: modules.goals && this.isVal(),
        visibile: false,
        valutatore: true
      }]

      var settings = JSON.parse(this.lsGet("configs"));
      settings = settings.dash;
      if (settings != null) {
        if (settings.sx != null) {
          settings.sx.reverse();
          for (var i = 0; i < settings.sx.length; i++) {
            var found = {
              sx: false,
              index: -1
            };
            sx.filter(function (comp, ind) {
              if (comp.title == settings.sx[i]) {
                found.index = ind;
                found.sx = true;
              }
            })
            if (found.index == -1) {
              dx.filter(function (comp, ind) {
                if (comp.title == settings.sx[i]) {
                  found.index = ind;
                  found.sx = false;
                }
              })
            }
            if (found.index != -1) {
              var replace;
              if (found.sx) {
                replace = sx.splice(found.index, 1);
              } else {
                replace = dx.splice(found.index, 1);
              }
              replace[0].visibile = true;
              sx.unshift(replace[0]);
            }
          }
        }
        if (settings.dx != null) {
          settings.dx.reverse();
          for (var i = 0; i < settings.dx.length; i++) {
            var found = {
              sx: false,
              index: -1
            };
            sx.filter(function (comp, ind) {
              if (comp.title == settings.dx[i]) {
                found.index = ind;
                found.sx = true;
              }
            })
            if (found.index == -1) {
              dx.filter(function (comp, ind) {
                if (comp.title == settings.dx[i]) {
                  found.index = ind;
                  found.sx = false;
                }
              })
            }
            if (found.index != -1) {
              var replace;
              if (found.sx) {
                replace = sx.splice(found.index, 1);
              } else {
                replace = dx.splice(found.index, 1);
              }
              replace[0].visibile = true;
              dx.unshift(replace[0]);
            }
          }
        }
      }

      this.lsSet("colonna_sx", JSON.stringify(sx));
      this.lsSet("colonna_dx", JSON.stringify(dx));

      return {
        sx: sx,
        dx: dx
      }
    }
  }
});

function getEnablingObject() {
  var ones = null;
  var ch = null;
  try {
    ones = JSON.parse(LZString.decompressFromUTF16(localStorage.getItem("configs")));
    ch = LZString.decompressFromUTF16(localStorage.getItem("ench"));
  } catch (err) {
    console.log(err)
  }

  return EnabledOnes(ones, ch);
}

function EnabledOnes(ones, ch) {
  if (ones == null || ones.modules == null || ch == null) {
    location.pathname = '/login.html';
  }
  var max_length = ones.modules_length;
  ones = ones.modules;
  ch = Number(ch).toString(2);
  if (ch != ones) {
    location.pathname = '/login.html';
  }

  var enabledOnes = {};
  var offset = max_length - ones.length;
  enabledOnes.learning = ones[(max_length - 1) - offset] === '1' ? true : false;
  enabledOnes.recruiting = ones[(max_length - 2) - offset] === '1' ? true : false;
  enabledOnes.documenti = ones[(max_length - 3) - offset] === '1' ? true : false;
  enabledOnes.rubrica = ones[(max_length - 4) - offset] === '1' ? true : false;
  enabledOnes.goals = ones[(max_length - 5) - offset] === '1' ? true : false;
  enabledOnes.competenzeHIT = ones[(max_length - 6) - offset] === '1' ? true : false;
  enabledOnes.feedback = ones[(max_length - 7) - offset] === '1' ? true : false;
  enabledOnes.tutor = ones[(max_length - 8) - offset] === '1' ? true : false;
  enabledOnes.calendar = ones[(max_length - 9) - offset] === '1' ? true : false;
  enabledOnes.collection = ones[(max_length - 10) - offset] === '1' ? true : false;
  enabledOnes.competenze = ones[(max_length - 11) - offset] === '1' ? true : false;
  enabledOnes.curriculum = ones[(max_length - 12) - offset] === '1' ? true : false;
  return enabledOnes;
}