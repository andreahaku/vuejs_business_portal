var idbAdapter = new LokiIndexedAdapter();
var db = new loki("db.json", {
  adapter: idbAdapter
});

import Vue from 'vue';
import Vuex from 'vuex';

import LZString from 'lz-string';

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    //cv
    anagraphics: {},
    education: [],
    experiences: [],
    skills: {},
    languages: {},

    levels: [],
    requirements: [],

    reqNameMap: [],
    reqLevelMap: [],
    standardLevels: [],

    //job list
    jobs: [],
    tipiRapporto: [],
    province: [],
    aree: [],
    regioni: [],

    //feedback
    loaded: false,
    people: [],
    feedbacks: [],
    myfeeds: [],
    myrequests: [],
    listaModuli: [],
    db: db
  },
  getters: {
    //job list
    getJobList: (state) => {
      var passing = [];
      passing = passing.concat(state.jobs);
      return passing;
    },
    getTypes: (state) => {
      var passing = [];
      passing = passing.concat(state.tipiRapporto);
      return passing;
    },
    getProvinces: (state) => {
      var passing = [];
      passing = passing.concat(state.province);
      return passing;
    },
    getAreas: (state) => {
      var passing = [];
      passing = passing.concat(state.aree);
      return passing;
    },
    getRegions: (state) => {
      var passing = [];
      passing = passing.concat(state.regioni);
      return passing;
    },
    getReqName: (state) => (id) => {
      var passing = [];
      passing = passing.concat(state.reqNameMap);

      var ind = -1;
      try {
        ind = passing.findIndex(function (a) {
          if (id == a.id) {
            return true;
          }
          return false;
        });
      } catch (err) {
        passing.some(function (a, index) {
          if (id == a.id) {
            ind = index;
            return true;
          }
          return false;
        })
      }

      if (ind === -1) {
        passing = -1;
      } else {
        passing = passing[ind].name;
      }
      return passing;
    },
    //ritorna 1 se i livelli sono lo standard [Basso - MedioBasso - Medio ecc]
    //ritorna -1 se non è ancora stato registrato
    //ritorna il set di livelli corretto altrimenti
    getReqLevel: (state) => (id) => {
      var passing = [];
      passing = passing.concat(state.reqLevelMap);

      var ind = -1;
      try {
        ind = passing.findIndex(function (a) {
          if (id == a.id) {
            return true;
          }
          return false;
        });
      } catch (err) {
        passing.some(function (a, index) {
          if (id == a.id) {
            ind = index;
            return true;
          }
          return false;
        })
      }

      if (ind === -1) {
        if (state.standardLevels.indexOf(id) === -1) {
          passing = -1;
        } else {
          passing = 1;
        }
      } else {
        passing = passing[ind].levels;
      }
      return passing;
    },

    //cv types
    getLevels: (state) => {
      var passing = [];
      passing = passing.concat(state.levels);
      return passing;
    },
    getRequirements: (state) => {
      var passing = [];
      passing = passing.concat(state.requirements);
      return passing;
    },

    //cv
    getLanguages: (state) => {
      state.languages = null;
      if (localStorage.getItem("langs") != null) {
        try {
          state.languages = LZString.decompressFromUTF16(localStorage.getItem("langs"));
        } catch (err) { }
        if (state.languages != null) {
          state.languages = JSON.parse(state.languages);
        }
      }
      return state.languages;
    },
    getSkills: (state) => {
      state.skills = null;
      if (localStorage.getItem("skills") != null) {
        try {
          state.skills = LZString.decompressFromUTF16(localStorage.getItem("skills"));
        } catch (err) { }
        if (state.skills != null) {
          state.skills = JSON.parse(state.skills);
        }
      }
      return state.skills;
    },
    getWorkExperiences: (state) => {
      state.experiences = null;
      if (localStorage.getItem("experiences") != null) {
        try {
          state.experiences = LZString.decompressFromUTF16(localStorage.getItem("experiences"));
        } catch (err) { }
        if (state.experiences != null) {
          state.experiences = JSON.parse(state.experiences);
        }
      }
      return state.experiences;
    },
    getEducation: (state) => {
      state.education = null;
      if (localStorage.getItem("education") != null) {
        try {
          state.education = LZString.decompressFromUTF16(localStorage.getItem("education"));
        } catch (err) { }
        if (state.education != null) {
          state.education = JSON.parse(state.education);
        }
      }
      return state.education;
    },
    getAnagraphics: (state) => {
      state.anagraphics = null;
      if (localStorage.getItem("anagraphics") != null) {
        try {
          state.anagraphics = LZString.decompressFromUTF16(localStorage.getItem("anagraphics"));
        } catch (err) { }
        if (state.anagraphics != null) {
          state.anagraphics = JSON.parse(state.anagraphics);
        }
      }

      var parsed = null;

      if (state.anagraphics != null) {

        parsed = {
          nome: state.anagraphics.nome,
          cognome: state.anagraphics.cognome,
          tel: state.anagraphics.tel,
          cittadinanza: state.anagraphics.cittadinanza,
          birth: state.anagraphics.birth,
          sesso: state.anagraphics.sesso,
        };

        var cap = "";
        cap = state.anagraphics.cap.trim() != "" ? state.anagraphics.cap : cap;

        var provincia = "fc";
        if (state.anagraphics.provincia != null) {
          provincia = state.anagraphics.provincia;
        }

        var address = state.anagraphics.indirizzo + ", " + cap + " " + state.anagraphics.citta + " (" + provincia.toUpperCase() + "), Italia";
        parsed.indirizzo = address;

        if (state.anagraphics.mail.trim() != "") {
          parsed.mail = state.anagraphics.mail;
        }

        if (state.anagraphics.cittadinanza.trim() != "") {
          parsed.cittadinanza = state.anagraphics.cittadinanza;
        }

        if (state.anagraphics.intro.trim() != "") {
          parsed.intro = state.anagraphics.intro;
        }

      }

      return parsed;
    },
    getFullAnagraphics: (state) => {
      state.anagraphics = null;
      if (localStorage.getItem("anagraphics") != null) {
        try {
          state.anagraphics = LZString.decompressFromUTF16(localStorage.getItem("anagraphics"));
        } catch (err) { }
        if (state.anagraphics != null) {
          state.anagraphics = JSON.parse(state.anagraphics);
        }
      }
      return state.anagraphics;
    },

    getPeople: (state) => {
      var people = state.db.getCollection("people");
      return people;
    },
    getRuoli: (state) => {
      var ruoli = state.db.getCollection("ruoli");
      return ruoli;
    },
    getCompetenze: (state) => {
      var comps = state.db.getCollection("competenze");
      return comps;
    },
    getRuoliCompetenze: (state) => {
      var rc = state.db.getCollection("ruoli:competenze");
      return rc;
    },
    getUo: (state) => {
      var uo = state.db.getCollection("uo");
      return uo;
    },
    getMyFeedback: (state) => {
      var f = state.db.getCollection("myfeedback");
      return f;
    },
    getOthersFeedback: (state) => {
      var f = state.db.getCollection("othersfeedback");
      return f;
    },
    getMyTeam: (state) => {
      var p = state.db.getCollection("myteam");
      return p;
    },
    getCorsi: (state) => {
      var p = state.db.getCollection("corsi");
      return p;
    },
    getPartecipazioni: (state) => {
      var p = state.db.getCollection("partecipazioni");
      return p;
    },
    getEdizioni: (state) => {
      var p = state.db.getCollection("edizioni");
      return p;
    },
    getIndici: (state) => {
      var p = state.db.getCollection("indici");
      return p;
    },
    getListaModuli: (state) => {
      return state.listaModuli;
    },
    getModuli: (state) => {
      var ids = state.listaModuli;
      if (ids != null && ids.length > 0) {
        var results = [];
        for (var i = 0; i < ids.length; i++) {
          results.push(state.db.getCollection("moduli" + ids[i]));
        }
        return results;
      } else {
        return []
      }
    },
    getFeedbacks: (state) => {
      state.feedbacks = null;
      if (localStorage.getItem("feedbacks") != null) {
        try {
          state.feedbacks = LZString.decompressFromUTF16(localStorage.getItem("feedbacks"));
        } catch (err) { }
        if (state.feedbacks != null) {
          state.feedbacks = JSON.parse(state.feedbacks);
        }
      }
      return state.feedbacks;
    },
    getMyFeeds: (state) => {
      state.myfeeds = null;
      if (localStorage.getItem("myfeeds") != null) {
        try {
          state.myfeeds = LZString.decompressFromUTF16(localStorage.getItem("myfeeds"));
        } catch (err) { }
        if (state.myfeeds != null) {
          state.myfeeds = JSON.parse(state.myfeeds);
        }
      }
      return state.myfeeds;
    },
    getMyRequests: (state) => {
      state.myrequests = null;
      if (localStorage.getItem("myrequests") != null) {
        try {
          state.myrequests = LZString.decompressFromUTF16(localStorage.getItem("myrequests"));
        } catch (err) { }
        if (state.myrequests != null) {
          state.myrequests = JSON.parse(state.myrequests);
        }
      }
      return state.myrequests;
    },
    isLoaded: (state) => {
      return state.loaded;
    }
  },
  mutations: {
    //job list
    setJobList: (state, obj) => {
      if (obj.length > 0) {
        var setting = [];
        setting = setting.concat(obj);
        state.jobs = setting;
      }
    },
    setTypes: (state, obj) => {
      if (obj.length > 0) {
        var setting = [];
        setting = setting.concat(obj);
        state.tipiRapporto = setting;
      }
    },
    setProvinces: (state, obj) => {
      if (obj.length > 0) {
        var setting = [];
        setting = setting.concat(obj);
        state.province = setting;
      }
    },
    setAreas: (state, obj) => {
      if (obj.length > 0) {
        var setting = [];
        setting = setting.concat(obj);
        state.aree = setting;
      }
    },
    setLevels: (state, obj) => {
      if (obj.length > 0) {
        var setting = [];
        setting = setting.concat(obj);
        state.levels = setting;
      }
    },
    setRegions: (state, obj) => {
      if (obj.length > 0) {
        var setting = [];
        setting = setting.concat(obj);
        state.regioni = setting;
      }
    },

    // types
    setRequirements: (state, obj) => {
      if (obj.length > 0) {
        var setting = [];
        setting = setting.concat(obj);
        state.requirements = setting;
      }
    },

    //cv
    setLanguages: (state, obj) => {
      if (obj.madrelingua.trim() === '') {
        obj.madrelingua = "Italiana";
      }

      localStorage.setItem("langs", LZString.compressToUTF16(JSON.stringify(obj)));
      state.languages = obj;
    },
    setSkills: (state, obj) => {
      // unclassified skills
      /*
      var skills = {pers: [], prof: []};
      for(var i = 0; i < obj.length; i++){
          if(obj[i].tipo === "Personale"){
              skills.pers.push(obj[i]);
          } else if(obj[i].tipo === "Professionale"){
              skills.prof.push(obj[i]);
          }
      }   */
      if (obj.length > 0) {
        //localStorage.setItem("skills", JSON.stringify(skills));

        localStorage.setItem("skills", LZString.compressToUTF16(JSON.stringify(obj)));
        state.skills = obj;
      }
    },
    setWorkExperiences: (state, obj) => {
      if (obj.length > 0) {
        localStorage.setItem("experiences", LZString.compressToUTF16(JSON.stringify(obj)));
        state.experiences = obj;
      }
    },
    fakeCommit: (state) => {
      state.experiences = LZString.decompressFromUTF16(localStorage.getItem("experiences"));
      state.education = LZString.decompressFromUTF16(localStorage.getItem("education"));
      state.skills = LZString.decompressFromUTF16(localStorage.getItem("skills"));
      state.languages = LZString.decompressFromUTF16(localStorage.getItem("langs"));
    },
    setEducation: (state, obj) => {
      if (obj.e.length > 0) {
        // date adjustment
        if (obj.chrome) {
          for (var i = 0; i < obj.e.length; i++) {
            var da = obj.e[i].da;
            var a = obj.e[i].a;

            if (da.indexOf("-") != -1) {
              da = da.split("-")
              da.reverse();
              var n = da[0];
              for (var j = 1; j < da.length; j++) {
                n += "/" + da[j];
              }
              obj.e[i].daChromeFormat = n;
            } else {
              obj.e[i].daChromeFormat = 'Oggi';
            }

            if (a.indexOf("-") != -1) {
              a = a.split("-")
              a.reverse();
              var n = a[0];
              for (var j = 1; j < a.length; j++) {
                n += "/" + a[j];
              }
              obj.e[i].aChromeFormat = n;
            } else {
              obj.e[i].aChromeFormat = 'Oggi';
            }
          }
        }
        localStorage.setItem("education", LZString.compressToUTF16(JSON.stringify(obj.e)));
        state.education = obj.e;
      } else if (obj.delete && obj.delete.length > 0) {
        console.log("HO CANCELLATO TUTTO!")
        localStorage.setItem("education", null);
        state.education = [];
      }
    },
    setAnagraphics: (state, obj) => {
      localStorage.setItem("anagraphics", LZString.compressToUTF16(JSON.stringify(obj)));
      state.anagraphics = obj;
    },
    addReqNameMapping: (state, obj) => {
      if (obj.id != null && obj.name != null && obj.name.trim() != '') {
        var ind = -1;
        try {
          ind = state.reqNameMap.findIndex(function (a) {
            if (a.id == obj.id) {
              return true;
            }
            return false;
          });
        } catch (err) {
          state.reqNameMap.some(function (a, index) {
            if (a.id == obj.id) {
              ind = index;
              return true;
            }
            return false;
          });
        }

        if (ind === -1) {
          state.reqNameMap.push(obj);
        } else { }
      }
    },
    addReqLevelMapping: (state, obj) => {
      if (obj.id != null && obj.levels != null && obj.levels.length > 0) {
        var ind = -1;
        try {
          ind = state.reqLevelMap.findIndex(function (a) {
            if (a.id == obj.id) {
              return true;
            }
            return false;
          });
        } catch (err) {
          state.reqLevelMap.some(function (a, index) {
            if (a.id == obj.id) {
              ind = index;
              return true;
            }
            return false;
          });
        }

        if (ind === -1) {
          if (obj.levels.length == 5 &&
            obj.levels[0].desc == 'Basso' &&
            obj.levels[2].desc == 'Medio' &&
            obj.levels[4].desc == 'Alto') {
            state.standardLevels.push(obj.id);
          } else {
            state.reqLevelMap.push(obj);
          }
        }
      }
    },
    insertUo: (state, arrayObj) => {
      state.db.addCollection("uo", {
        unique: ['id']
      });
      var uo = state.db.getCollection("uo");
      uo.insert(arrayObj);
    },
    insertRuoli: (state, arrayObj) => {
      state.db.addCollection("ruoli", {
        unique: ['id']
      });
      var ruolidb = state.db.getCollection("ruoli");
      ruolidb.insert(arrayObj);
    },
    insertCompetenze: (state, arrayObj) => {
      state.db.addCollection("competenze", {
        unique: ['id']
      });
      var comps = state.db.getCollection("competenze");
      comps.insert(arrayObj);
    },
    insertRuoliCompetenze: (state, arrayObj) => {
      state.db.addCollection("ruoli:competenze", {
        unique: ['id']
      });
      var rcdb = state.db.getCollection("ruoli:competenze");
      rcdb.insert(arrayObj);
    },
    insertMyFeedback: (state, arrayObj) => {
      state.db.addCollection("myfeedback", {
        unique: ['id']
      });
      var myfeeds = state.db.getCollection("myfeedback");
      myfeeds.insert(arrayObj);
    },
    insertOthersFeedback: (state, arrayObj) => {
      state.db.addCollection("othersfeedback", {
        unique: ['id']
      });
      var feeds = state.db.getCollection("othersfeedback");
      feeds.insert(arrayObj);
    },
    removeOthersFeedback: (state, newFeedback) => {
      var feeds = state.db.getCollection("othersfeedback");
      feeds.remove(newFeedback);
    },
    createMyTeam: (state) => {
      state.db.addCollection("myteam", {
        unique: ['$loki']
      });
    },
    insertCorsi: (state, corsi) => {
      state.db.addCollection("corsi", {
        unique: ['$loki']
      })
      var c = state.db.getCollection("corsi");
      c.insert(corsi);
    },
    insertPartecipazioni: (state, partecipazioni) => {
      state.db.addCollection("partecipazioni")
      var p = state.db.getCollection("partecipazioni");
      p.insert(partecipazioni);
    },
    insertEdizioni: (state, edizioni) => {
      state.db.addCollection("edizioni", {
        unique: ['IdEdizione']
      })
      var p = state.db.getCollection("edizioni");
      p.insert(edizioni);
    },
    insertIndici: (state, indici) => {
      state.db.addCollection("indici", {
        unique: ['IdIndice']
      })
      var p = state.db.getCollection("indici");
      p.insert(indici);
    },
    loaded: (state) => {
      state.loaded = true;
    },
    listaModuli: (state, lista) => {
      state.listaModuli = lista;
    },
    insertModule: (state, obj) => {
      var mod = obj.mod.slice()
      var collection;
      if (obj.id != null && mod.length > 0) {
        collection = state.db.getCollection("moduli" + obj.id);
        if (collection != null) {
          collection.removeWhere(function (obj) {
            return true;
          })
        } else {
          state.db.addCollection("moduli" + obj.id, {
            unique: ['$loki']
          })
          collection = state.db.getCollection("moduli" + obj.id);
        }
        collection.insert(mod);
      }
    },
    updateMyRequests: (state, obj) => {
      if (obj.length > 0) {
        localStorage.setItem("myrequests", LZString.compressToUTF16(JSON.stringify(obj)));
        state.myrequests = myrequests;
      }
    }
  }
});