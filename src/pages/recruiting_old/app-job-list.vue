<template>
    <!-- extra div for emulating position:fixed of the menu -->
    <div class="st-content-inner padding-none">
        <div v-if="loading" class='uil-rolling-css' style='transform:scale(0.71); 
        position: absolute; margin: 0 auto; top: 100px; right: 0px; left: 0px;'>
            <div>
                <div></div>
                <div></div>
            </div>
        </div>
        <div v-else class="container-fluid">
            <div class="row page-section" style="padding-bottom: 20px;">
                <div class="col-xs-12">
                    <div class="media v-middle">
                        <div class="media-body">
                            <div class="panel panel-default" style="border-radius: 5px; border-style: hidden;">
                                <div class="panel-body row topFilter">
                                    <div class="form-group col-xs-12 col-sm-6 col-md-2">
                                        <input type="text" class="filter-field" v-model="filtro" @blur="filterOut()" placeholder="Filtra per titolo...">
                                    </div>
                                    <div class="form-group col-xs-12 col-sm-6 col-md-3">
                                        <div class="col-xs-12 filter-field" style="padding: 0px;">
                                            <div class="col-xs-8" style="color: gray; padding: 10px; padding-right: 0px;">{{regDisplay}}</div>
                                            <button v-if="provsIn" class="btn btn-default pull-right" id="regBtn" data-toggle="collapse" data-target="#rbox" style="width: 39px; height: 39px;">
                                                <i class="fa fa-sort-desc" aria-hidden="true"></i></button>
                                        </div>
                                        <div v-if="regsIn" class="filter-field" style="padding: 5px 0px;">
                                            <div id="rbox" class="panel-body collapse list-group" aria-exanded="false" style="max-height: 150px; width: 100%; overflow-y: auto">
                                                <div class="panel row" style="padding: 5px 0px 5px 3px; margin: 0px;">
                                                    <div v-for="r in regs" :class="{'active': r.id == regFilter}" class="input-group panel panel-default col-xs-12 provs" style="text-align: center; border-width: 0px; padding-bottom: 10px; margin: 0px;" @click="clickedReg(r.id, r.nome)">
                                                        <span style="position: relative; top: 6px;">{{r.nome}}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="form-group col-xs-12 col-sm-6 col-md-3">
                                        <div class="col-xs-12 filter-field" style="padding: 0px;">
                                            <div class="col-xs-8" style="color: gray; padding: 10px; padding-right: 0px;">{{provDisplay}}</div>
                                            <button v-if="provsIn" class="btn btn-default pull-right" id="provBtn" data-toggle="collapse" data-target="#pbox" style="width: 39px; height: 39px;">
                                                <i class="fa fa-sort-desc" aria-hidden="true"></i></button>
                                        </div>
                                        <div v-if="provsIn" class="filter-field" style="padding: 5px 0px;">
                                            <div id="pbox" class="panel-body collapse list-group" aria-exanded="false" style="max-height: 150px; width: 100%; overflow-y: auto">
                                                <div class="panel row" style="padding: 5px 0px 5px 3px; margin: 0px;">
                                                    <div v-for="p in provs" :class="{'active': p.id == provFilter}" class="input-group panel panel-default col-xs-12 provs" style="text-align: center; border-width: 0px; padding-bottom: 10px; margin: 0px;" @click="clickedProv(p.id, p.nome)">
                                                        <span style="position: relative; top: 6px;">{{p.nome}}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="form-group col-xs-12 col-sm-6 col-md-4">
                                        <div class="col-xs-12 filter-field" style="padding: 0px;">
                                            <div class="col-xs-8" style="color: gray; padding: 10px; padding-right: 0px;">{{selectedTags}}</div>
                                            <button v-if="tags.length > 0" class="btn btn-default pull-right" data-toggle="collapse" data-target="#box" style="width: 39px; height: 39px;">
                                                <i class="fa fa-sort-desc" aria-hidden="true"></i></button>
                                        </div>
                                        <div v-if="tags.length > 0" class="filter-field" style="padding: 5px 0px;">
                                            <div id="box" class="panel-body collapse list-group" aria-exanded="false" style="max-height: 150px; width: 100%; overflow-y: auto">
                                                <div class="panel" style="padding: 5px 0px 5px 3px;">
                                                    <div v-for="tag in tags" class="input-group panel panel-default" style="margin: 0px; text-align: center; border-width: 0px; border-top-width: 1px;">
                                                        <span style="position: relative; top: 6px;">{{tag}}</span>
                                                        <span class="input-group-addon">
                                                            <input :id="tag" type="checkbox" aria-label="" @click="clicked(tag)">
                                                          </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <!-- 
                                <div class="panel-body" 
                                   style=" margin: 0px; background-color: #f5f5f5; padding: 20px 16px;
                                   border-style: solid; border-color: gainsboro; border-width: 0px 2px;">
                                </div>
                                -->
                                <div class="panel-body botFilter">
                                    <div class="col-xs-12 col-sm-6 col-lg-3 type-container">
                                        <span class="worker-voice botText"><strong>Tempo Indeterminato</strong></span>
                                        <span class="worker">
                                            
                                            <input name="ind" class="boot-toggle" type="checkbox" data-toggle="toggle" 
                                            data-on="<i class='fa fa-check' aria-hidden='true'></i>" 
                                            data-off="<i class='fa fa-window-minimize' aria-hidden='true'></i>" data-width="10"
                                            data-size="mini" data-onstyle="success" v-model="typesFilter.ind" @change="clickedType()">
                                          </span>
                                    </div>
                                    <div class="col-xs-12 col-sm-6 col-lg-3 type-container">
                                        <span class="worker-voice botText"><strong>Tempo Determinato</strong></span>
                                        <span class="worker">
                                              
                                            <input name="det" class="boot-toggle" type="checkbox" data-toggle="toggle" 
                                            data-on="<i class='fa fa-check' aria-hidden='true'></i>" 
                                            data-off="<i class='fa fa-window-minimize' aria-hidden='true'></i>" data-width="10"
                                            data-size="mini" data-onstyle="success" v-model="typesFilter.det" @change="clickedType()">
                                          </span>
                                    </div>
                                    <div class="col-xs-12 col-sm-6 col-lg-3 type-container">
                                        <span class="worker-voice botText"><strong>COCOCO</strong></span>
                                        <span class="worker">
                                           
                                            <input name="cococo" class="boot-toggle" type="checkbox" data-toggle="toggle" 
                                            data-on="<i class='fa fa-check' aria-hidden='true'></i>" 
                                            data-off="<i class='fa fa-window-minimize' aria-hidden='true'></i>" data-width="10"
                                            data-size="mini" data-onstyle="success" v-model="typesFilter.cococo" @change="clickedType()">
                                          </span>
                                    </div>
                                    <div class="col-xs-12 col-sm-6 col-lg-3 type-container">
                                        <span class="worker-voice botText"><strong>Altri</strong></span>
                                        <span class="worker">
                                            
                                            <input name="altri" class="boot-toggle" type="checkbox" data-toggle="toggle" 
                                            data-on="<i class='fa fa-check' aria-hidden='true'></i>" 
                                            data-off="<i class='fa fa-window-minimize' aria-hidden='true'></i>" data-width="10"
                                            data-size="mini" data-onstyle="success" v-model="typesFilter.altri" @change="clickedType()">
                                          </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="parsedjobs.length > 0" class="panel panel-default paper-shadow" style="margin:0px; background-color: gainsboro;
               border-top-left-radius: 5px; border-top-right-radius: 5px; border-bottom-width: 0px;">
                <p style="padding: 10px 20px; margin: 0px"><strong>{{parsedjobs.length}}</strong>
                    <span v-if="parsedjobs.length > 1">offerte corrispondono ai criteri di ricerca</span>
                    <span v-else>offerta corrisponde ai criteri di ricerca</span>
                </p>
            </div>
            <p></p>
            <div v-for="job in displayjobs" class="panel panel-default paper-shadow animated fadeIn col-xs-12 col-lg-6">
                <div class="panel-body">
                    <div class="media ">
                        <div class="media-left text-center hidden-xs">
                            <div v-if="job.img" class="cover width-100 width-100pc-xs overlay cover-image-full hover margin-v-0-10">
                                <img :src="job.img" alt="">
                            </div>
                        </div>
                        <div class="media-body">
                            <div class="col-xs-12 col-sm-6" style="margin-bottom: 5px;">
                                <router-link class="text-headline" :to="{ name: 'detail', params: {id: job.id}}">{{job.titolo}}</router-link>
                                <h4 v-if="job.nomeSocietà" style="margin: 0; margin-top: 10px;">{{job.nomeSocietà}}</h4>
                            </div>
                            <div class="col-xs-6 col-sm-3" style="padding-top: 10px; color:gray;">
                                <p><i class="fa fa-location-arrow hidden-xs" style="padding-right: 5px;">   
                                </i>{{job.sede}}<span v-if="job.provincia!=null"> ({{job.provincia}})</span></p>
                            </div>
                            <div class="col-xs-6 col-sm-3" style="padding-left: 0px;">
                                <div class="tag" style="font-size: small;
                                padding:5px 15px;
                                border-bottom-left-radius: 0px;" :class="getTypeColor(job.tipoRapporto)">{{job.tipoRapporto}}</div>
                            </div>
                            <div class="col-xs-12" style="padding-left: 5px; margin: 10px 15px;">
                                <div :class="getColor(job.settore)" class="tag" @click="manual(job.settore)" style="cursor: pointer">{{job.settore}}</div>
                            </div>
                            <div v-if="job.img!=null" class="hidden-xs cover overlay cover-image-full hover margin-v-0-10 pull-right visible-xs" style="width: 100px; height: 100px;">
                                <img :src="job.img" alt="" style="margin: 8px;">
                            </div>
                            <div class="col-xs-12">
                                <hr style="margin-right: 150px;" />
                            </div>
                            <div class="col-xs-12">
                                <transition name="expand">
                                    <p v-show="job.show" v-html="job.descrizione"></p>
                                </transition>
                                <div v-if="!job.show">
                                    <a @click="job.show = true;">Mostra Descrizione <i class="fa fa-chevron-down" aria-hidden="true" style="padding-left: 5px"></i></a>
                                </div>
                                <div v-else>
                                    <a @click="job.show = false;">Nascondi Descrizione <i class="fa fa-chevron-up" aria-hidden="true" style="padding-left: 5px"></i></a>
                                </div>
                                <router-link class="btn btn-primary pull-right" :to="{ name: 'detail', params: {id: job.id}}">DETTAGLI</router-link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <paginazione v-if="jobs.length > 0" :array="parsedjobs" limit="4" @displayChanged="dispatchedPagination($event)">
            </paginazione>
            <div v-if="parsedjobs.length <= 0" class="panel panel-default">
                <div class="panel-body">
                    <div class="form-group">
                        <div class="panel-heading">
                            <h5>Nessuna offerta soddisfa i parametri di ricerca</h5></div>
                    </div>
                </div>
            </div>
            <sidejsonly :default="false"></sidejsonly>
        </div>
    </div>
</template>
<script>
import paginazione from '../components/paginazione.vue'
import sidejsonly from '../components/side-default-jsonly.vue'

export default {
    mounted() {
            this.$nextTick(function() {
                this.checkToken();
                this.colors = ['bg-purple-300', 'bg-indigo-300', 'bg-red-300', 'bg-orange-300', 'bg-green-300'];
                this.index = Math.floor((Math.random() * this.colors.length));
                if (window.innerWidth < 768) {
                    this.screenxs = true;
                }
                window.addEventListener('resize', this.handleResize);

            })
        },
        data() {
            return {
                filtro: "",
                areafiltro: "",
                labelout: false,
                jobs: [],
                parsedjobs: [],
                displayjobs: [],

                index: 0,
                tags: [],
                tagStack: [],
                colors: [],

                tipiRapporto: [],

                typesReady: false,
                typesFilter: {
                    det: false,
                    ind: false,
                    cococo: false,
                    altri: false
                },

                provsIn: false,
                provs: [],
                provFilter: '-',
                provDisplay: 'Qualsiasi Provincia',

                regsIn: false,
                regs: [],
                regFilter: '-',
                regDisplay: 'Qualsiasi Regione',

                screenxs: false,

                baseToken: {
                    token: ''
                },

                loading: true,

                socToQuery: []
            }
        },
        components: {
            paginazione,
            sidejsonly
        },
        computed: {
            selectedTags: function() {
                if (this.tagStack.length <= 0) {
                    return 'Qualsiasi Ambito'
                } else if (this.tagStack.length === 1) {
                    return this.tagStack[0];
                } else {
                    var tags = this.tagStack[0];
                    for (var i = 1; i < this.tagStack.length; i++) {
                        if (i < 3) {
                            tags += ', ' + this.tagStack[i];
                        } else {
                            tags += ' ...';
                            break;
                        }

                    }
                    return tags;
                }
            },
            typeStyle(type) {
                if (this.typesReady) {
                    return this.Tip
                } else {
                    return {};
                }
            }
        },
        watch: {
            'filtro': function() {
                this.parsedjobs = this.filtraImpieghi();
            },
            loading: function() {
                if (!this.loading) {

                    var vm = this;
                    setTimeout(function() {
                        var bootToggle = document.getElementsByClassName("boot-toggle");

                        for (var i = 0; i < bootToggle.length; i++) {
                            $(bootToggle[i]).bootstrapToggle();

                            $(bootToggle[i]).change(function() {
                                vm.typesFilter[this.name] = !vm.typesFilter[this.name]
                                vm.clickedType();
                            });
                        }
                    }, 50);

                }
            }
        },
        methods: {
            handleResize: function() {
                if (window.innerWidth >= 768) {
                    this.screenxs = false;
                } else {
                    this.screenxs = true;
                }
            },
            manual: function(tag) {
                $(".st-content-inner").scrollTop(0);
                $("#box").collapse('show');
                var el = document.getElementById(tag);
                el.click()
            },
            clicked: function(tag) {
                var isThere = this.tagStack.indexOf(tag);
                if (isThere === -1) {
                    this.tagStack.push(tag);
                } else {
                    this.tagStack.splice(isThere, 1);
                }
                this.parsedjobs = this.filtraImpieghi();
            },
            clickedType: function() {
                this.parsedjobs = this.filtraImpieghi();
            },
            clickedReg: function(val, name) {

                if (this.regFilter != val) {
                    this.provFilter = "-";
                    this.provDisplay = "Qualsiasi Provincia";
                    this.getProvince()
                    if (val != "-") {
                        var reg = val;
                        this.provs = this.provs.filter(function(p) {
                            if (p.reg == reg || p.id == "-") {
                                return true;
                            }
                            return false;
                        })
                    }
                    this.regFilter = val;

                    if (val != '-') {
                        this.regDisplay = name;
                    } else {
                        this.regDisplay = 'Qualsiasi Regione';
                    }
                    this.parsedjobs = this.filtraImpieghi();
                }
                document.getElementById("regBtn").click();
            },
            clickedProv: function(val, name) {
                if (this.provFilter != val) {
                    this.provFilter = val;

                    if (val != '-') {
                        this.provDisplay = name
                    } else {
                        this.provDisplay = "Qualsiasi Provincia";
                    }

                    this.parsedjobs = this.filtraImpieghi();
                }
                document.getElementById("provBtn").click();
            },
            filterOut: function() {
                if (this.filtro != '') {
                    this.labelout = true;
                } else {
                    this.labelout = false;
                }
            },
            filtraImpieghi: function() {
                var parsed = [];
                this.jobs = this.$store.getters.getJobList;
                parsed = parsed.concat(this.jobs);

                if (this.filtro.trim() != "") {
                    var filter = this.filtro;
                    parsed = parsed.filter((element) => {
                        return element.titolo.toLowerCase().includes(filter);
                    });
                }

                if (this.provFilter != "-" && this.provsIn) {
                    parsed = this.filterByProv(parsed);
                } else if (this.regFilter != "-" && this.regsIn) {
                    parsed = this.filterByReg(parsed);
                }

                if (this.typesChecked()) {
                    parsed = this.filterByType(parsed);
                }

                parsed = this.filterByTag(parsed);

                return parsed;
            },
            filterByTag: function(jobsarray) {
                if (this.tagStack.length > 0) {
                    var vm = this;
                    jobsarray = jobsarray.filter(function(job) {
                        if (job.settore != null) {
                            for (var j = 0; j < vm.tagStack.length; j++) {
                                if (job.settore == vm.tagStack[j]) {
                                    return true;
                                }
                            }
                            return false;
                        } else {
                            return false;
                        }
                    });
                }
                return jobsarray;
            },
            filterByType: function(jobsarray) {
                var vm = this;
                jobsarray = jobsarray.filter(function(obj) {
                    if (obj.tipoRapporto === "Tempo determinato" && vm.typesFilter.det) {
                        return true;
                    }
                    if (obj.tipoRapporto === "Tempo indeterminato" && vm.typesFilter.ind) {
                        return true;
                    }
                    if (obj.tipoRapporto === "COCOCO" && vm.typesFilter.cococo) {
                        return true;
                    }
                    if (vm.typesFilter.altri) {
                        if (obj.tipoRapporto != "Tempo determinato" &&
                            obj.tipoRapporto != "Tempo indeterminato" &&
                            obj.tipoRapporto != "COCOCO") {
                            return true;
                        }
                    }
                    return false;
                });
                return jobsarray;
            },
            filterByProv: function(jobsarray) {
                var vm = this;
                jobsarray = jobsarray.filter(function(obj) {
                    if (obj.provincia == vm.provFilter) {
                        return true;
                    }
                    return false;
                })

                return jobsarray;
            },
            filterByReg: function(jobsarray) {
                var vm = this;
                var allProvs = this.$store.getters.getProvinces;
                jobsarray = jobsarray.filter(function(obj) {
                    if (obj.provincia != null) {
                        var ind = -1;
                        allProvs.forEach(function(p, i) {
                            if (obj.provincia == p.id) {
                                ind = i;
                            }
                        })
                        if (ind != -1) {
                            if (allProvs[ind].reg == vm.regFilter) {
                                return true;
                            }
                            return false;
                        }
                        return false;
                    } else {
                        return false;
                    }
                })
                return jobsarray;
            },
            typesChecked: function() {
                if (this.typesFilter.det ||
                    this.typesFilter.ind ||
                    this.typesFilter.cococo || this.typesFilter.altri) {
                    return true;
                }
                return false;
            },
            dispatchedPagination: function(toDisplay) {
                this.displayjobs = toDisplay;
            },
            getColor: function(str) {
                var offset = this.tags.indexOf(str);
                return this.colors[(this.index + offset) % this.colors.length];
            },
            getTypeColor: function(type) {
                var index = this.tipiRapporto.indexOf(type);
                if (index != -1) {
                    return this.colors[index % this.colors.length];
                } else {
                    return "";
                }
            },
            getJobs() {
                this.tagStack = [];
                this.jobs = [];
                this.jobs = this.$store.getters.getJobList;
                if (this.jobs.length > 0) {
                    this.loading = false;
                    this.getTipiRapporto();

                    this.parsedjobs = this.filtraImpieghi();
                } else {
                    try {
                        this.$http.get(localStorage.getItem("rec-path") + "/Posizione?ID=.", {
                            header: this.baseToken
                        }).then((response) => {
                            var res = response.body;
                            try{
                                res = JSON.parse(response.body);
                            } catch(err) {};

                            if (res != null && res.Posizione != null) {
                                var howmany = res.Posizione.length;
                                for (let i = 0; i < res.Posizione.length; i++) {
                                    var pos = res.Posizione[i];
                                    var obj = {
                                        id: pos.ID,
                                        titolo: pos.Intervento,
                                        descrizione: pos.DescrizionePubblicazione,
                                        tipoRapporto: pos.TIPORAPPORTO,
                                        idRuolo: pos.IDRuolo,
                                        idSocietà: pos.IDSocietà,
                                        sede: pos.SedeLavoro,
                                        settore: pos.AREASELEZION,
                                        show: false
                                    }

                                    if (pos.IDProvincia != null) {
                                        obj.provincia = pos.IDProvincia;
                                    }

                                    this.jobs.push(obj);

                                    this.socToQuery.push({
                                        index: i,
                                        soc: obj.idSocietà
                                    });
                                }

                                this.getTipiRapporto();

                                this.$store.commit('setJobList', this.jobs);
                                this.parsedjobs = this.filtraImpieghi();
                            }
                            this.loading = false;
                        })
                    } catch (err) {
                        this.loading = false;
                    }
                }

            },
            socLoad() {
                var ids = [];
                if (this.socToQuery.length > 0) {
                    for (var i = 0; i < this.socToQuery.length > 0; i++) {
                        if (ids.indexOf(this.socToQuery[i].soc) === -1) {
                            ids.push(this.socToQuery[i].soc);
                        }
                    }
                    ids = ids.join(';');

                    this.$http.get(localStorage.getItem("rec-path") + "/Società?ID=" + ids, {
                        headers: this.baseToken
                    }).then((response) => {

                        var res = response.body;
                        try{
                            res = JSON.parse(response.body);
                        } catch(err) {};

                        if (res && res.Società) {
                            for (var i = 0; i < this.socToQuery.length; i++) {
                                for (var j = 0; j < res.Società.length; j++) {
                                    var s = res.Società[j];
                                    if (s.ID == this.socToQuery[i].soc) {
                                        this.jobs[this.socToQuery[i].index].nomeSocietà = s.Società;
                                        if (s.Logo) {
                                            this.jobs[this.socToQuery[i].index].img = s.Logo;
                                        }
                                        break;
                                    }
                                }
                            }
                            this.$store.commit('setJobList', this.jobs);
                            this.parsedjobs = this.filtraImpieghi();
                        }
                    });
                }
            },
            getTipiRapporto() {
                var get = this.$store.getters.getTypes;
                if (get.length > 0) {
                    this.tipiRapporto = get;
                    this.typesReady = true;

                    this.getAree();
                } else {
                    this.$http.get(localStorage.getItem("rec-path") + "/TipoRapporto?ID=.", {
                        headers: this.baseToken
                    }).then((response) => {
                        var res = response.body;
                        try{
                            res = JSON.parse(response.body);
                        } catch(err) {};

                        if (res != null && res.TipoRapporto != null) {
                            for (var i = 0; i < res.TipoRapporto.length; i++) {
                                this.tipiRapporto.push(res.TipoRapporto[i].TipoRapporto);
                            }
                            this.typesReady = true;
                            this.$store.commit("setTypes", this.tipiRapporto);

                            this.getAree();
                        }
                    });
                }
            },
            getRegioni() {
                var get = this.$store.getters.getRegions;
                if (get.length > 0) {
                    this.regs = get;
                    this.regsIn = true;

                } else {
                    this.$http.get(localStorage.getItem("rec-path") + "/Regioni?IdRegione=.", {
                        headers: this.baseToken
                    }).then((response) => {
                        var res = response.body;
                        try{
                            res = JSON.parse(response.body);
                        } catch(err) {};

                        if (res != null && res.Regioni != null) {
                            for (var i = 0; i < res.Regioni.length; i++) {
                                this.regs.push({
                                    id: res.Regioni[i].IdRegione,
                                    nome: res.Regioni[i].Regione.toUpperCase()
                                })
                            }
                            this.regs.splice(0, 0, {
                                id: '-',
                                nome: "TUTTE"
                            });
                        }
                        this.$store.commit("setRegions", this.regs);
                        this.regsIn = true;

                        this.socLoad();
                    });
                }
            },
            getProvince() {
                var get = this.$store.getters.getProvinces;
                if (get.length > 0) {
                    this.provs = get;
                    this.provsIn = true;
                } else {
                    this.$http.get(localStorage.getItem("rec-path") + "/Provincia?ID=.", {
                        headers: this.baseToken
                    }).then((response) => {
                        var res = response.body;
                        try{
                            res = JSON.parse(response.body);
                        } catch(err) {};

                        if (res != null && res.Provincia != null) {
                            for (var i = 0; i < res.Provincia.length; i++) {
                                if (res.Provincia[i].ID != '-') {
                                    this.provs.push({
                                        id: res.Provincia[i].ID,
                                        nome: res.Provincia[i].Provincia,
                                        reg: res.Provincia[i].IDREGIONE
                                    })
                                } else {
                                    this.provs.push({
                                        id: '-',
                                        nome: 'TUTTE'
                                    })
                                }
                            }
                        }
                        this.$store.commit("setProvinces", this.provs);
                        this.provsIn = true;
                    });
                }
            },
            getAree() {
                var get = this.$store.getters.getAreas;
                if (get.length > 0) {
                    this.tags = get;

                    this.getProvince();
                    this.getRegioni();
                } else {
                    this.$http.get(localStorage.getItem("rec-path") + "/AreaSelezione?ID=.", {
                        headers: this.baseToken
                    }).then((response) => {
                        var res = response.body;
                        try{
                            res = JSON.parse(response.body);
                        } catch(err) {};
                            
                        if (res && res.AreaSelezione) {
                            for (var i = 0; i < res.AreaSelezione.length; i++) {
                                var area = res.AreaSelezione[i];
                                this.tags.push(area.AreaSelezione);
                            }
                            this.$store.commit("setAreas", this.tags);

                            this.getProvince();
                            this.getRegioni();
                        }
                    })
                }
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
                            this.getJobs();
                        }
                    });
                } else {
                    this.baseToken.token = localStorage.getItem("recruitingToken");
                    this.getJobs();
                }
            }
        }
}
</script>
<style scoped>
.xs {
    margin-top: 0px;
    position: absolute;
    right: 10px;
    z-index: 1;
}

.margin-t {
    margin-top: 10px;
}

.type-container {
    position: relative;
    padding: 10px;
}

.worker {
    position: absolute;
    left: 180px;
}

.worker-voice {
    color: white;
    font-size: 14px;
}

.filter-field {
    background-color: white;
    margin: 10px 10px;
    padding: 10px 10px;
    border-radius: 5px;
    width: 100%;
    border-style: hidden;
}

.active {
    background-color: rgb(66, 165, 245);
    color: white;
}

.provs:hover {
    background-color: rgb(66, 165, 245);
    color: white;
}

.provs {
    cursor: pointer;
}

.expand-enter {}

.expand-enter-active {
    animation: expand-in 0.5s ease-out forwards
}

.expand-leave {}

.expande-leave-active {
    animation: expand-out 0.5s ease-out forwards
}

@keyframes expand-in {
    from {
        transform: translateY(-40px);
    }
    to {
        transform: translateY(0px);
    }
}

@keyframes expand-out {
    from {
        transform: translateY(0px);
    }
    to {
        transform: translateY(-40px);
    }
}

.topFilter {
    margin: 0px;
    background-color: #42a5f5;
    padding-left: 0px;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    border-style: hidden;
}

.botFilter {
    margin: 0px;
    background-color: rgb(240, 240, 240);
    padding: 20px 16px;
    border-bottom-right-radius: 5px;
    border-bottom-left-radius: 5px;
    border-style: solid;
    border-color: gainsboro;
    border-width: 0px 2px 2px 2px;
}

.botText {
    color: black;
}


/*
    .topFilter {
       margin: 0px; 
       background-color: #212121; 
       padding-left: 0px;
       border-top-left-radius: 5px; 
       border-top-right-radius: 5px; 
       border-style: hidden;
    }
    .botFilter{
       margin: 0px; 
       background-color: #42a5f5; 
       padding: 20px 16px;
       border-bottom-right-radius: 5px;
       border-bottom-left-radius: 5px;
       border-style: hidden; 
    }
    .botText{
       color: white; 
    }*/

.panel-default {
    /* border-color: #eee; */
    border: 5px solid #eee;
    border-radius: 10px;
    margin-bottom: 0px;
}
</style>
