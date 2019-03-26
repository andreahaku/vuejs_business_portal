export const requirementsHandlerMixin = {
    data: function () {
        return {
            reqs: [],
            reqsBack: [],
            gotReqs: false,

            vals: [{
                val: 1,
                desc: 'Basso'
            },
            {
                val: 2,
                desc: 'Medio-Basso'
            },
            {
                val: 3,
                desc: 'Medio'
            },
            {
                val: 4,
                desc: 'Medio-Alto'
            },
            {
                val: 5,
                desc: 'Alto'
            }
            ]
        }
    },
    methods: {
        findReq: function () {
            var get = this.$store.getters.getRequirements;
            if (get && get.length > 0) {
                this.reqs = get;
                this.gotReqs = true;
            } else {
                this.$http.get(localStorage.getItem("rec-path") + "/Requisito?ID=.", {
                    headers: {
                        'token': "recruiting_token"
                    }
                }).then(function (response) {
                    var res = response.body;
                    try {
                        res = JSON.parse(response.body);
                    } catch (err) { };

                    if (res && res.Requisito) {
                        var reqs = []

                        for (var i = 1; i < res.Requisito.length; i++) {
                            var req = res.Requisito[i];
                            var char = req.NOMEREQUISITO.match(/\D/);
                            var ind = req.NOMEREQUISITO.indexOf(char);
                            var nome = req.NOMEREQUISITO.slice(ind).trim();
                            var obj = {
                                ID: req.ID,
                                nome: nome
                            };
                            reqs.push(obj);
                        }
                        this.reqs = reqs;
                        this.reqs.sort(function (a, b) {
                            if (a.nome < b.nome) {
                                return -1;
                            } else {
                                return 1
                            }
                        })
                        this.gotReqs = true;
                        this.$store.commit('setRequirements', this.reqs);
                    }
                }, function (err) {
                    console.log(err);
                });

            }
        },
        filterReqs: function (i, name) {
            if (this.reqsBack.length == 0) {
                this.reqsBack = this.reqsBack.concat(this.reqs);
            }
            if (name && name.trim() != '') {
                var field = name.trim().toLowerCase();
                this.reqs = this.reqsBack.filter(function (r) {
                    return r.nome.toLowerCase().includes(field);
                })
                if (this.reqs.length > 0) {
                    $("#dropdownMenuReq" + i).collapse('show');
                } else {
                    $("#dropdownMenuReq" + i).collapse('hide');
                }
            } else {
                this.resumeReq();
            }
        },
        blur: function (i) {
            $("#dropdownMenuReq" + i).collapse('hide');
        },
        focus: function (i) {
            this.resumeReq();
            this.filterReqs(i);
        },
        resumeReq: function () {
            if (this.reqsBack.length != 0) {
                var empty = [];
                this.reqs = empty.concat(this.reqsBack);
                this.reqsBack = [];
            }
        },
        afterAssigned: function (i, id) {
            $("#dropdownMenuReq" + i).collapse('hide');
        },
        searchLevel: function (ind, id) {
            this.skills[ind].loadingLiv = true;
            var get = this.$store.getters.getReqLevel(id);
            if (get == null || get == 1) {
                this.skills[ind].loadingLiv = false;
                this.forceDOM()
            } else if (get != -1 && get.length > 0) {
                this.skills[ind].itemVals = get;
                this.skills[ind].loadingLiv = false;
                this.forceDOM()
            } else {

                this.$http.get(localStorage.getItem("rec-path") + "/Livelli?IDRequisiti=" + id, {
                    headers: {
                        'token': "recruiting_token"
                    }
                }).then(function (response) {
                    var res = response.body;
                    try {
                        res = JSON.parse(response.body);
                    } catch (err) { };
                    if (res && res.Livelli) {
                        var newVals = [];
                        for (var i = 0; i < res.Livelli.length; i++) {
                            newVals.push({
                                val: i + 1,
                                desc: res.Livelli[i].DescrizioneLivello
                            });
                        }
                        this.skills[ind].itemVals = newVals;
                        this.$store.commit('addReqLevelMapping', {
                            id: id,
                            levels: newVals
                        });
                    } else {
                        this.skills[ind].itemVals = this.vals;
                        this.$store.commit('addReqLevelMapping', {
                            id: id,
                            levels: this.vals
                        });
                    }
                    this.skills[ind].loadingLiv = false;
                    this.forceDOM();
                }, function (err) {
                    console.log(err);
                    this.skills[ind].loadingLiv = false;
                    this.forceDOM();
                })
            }
        },
        checkName: function (name) {
            var r = [];
            if (this.reqs.length > this.reqsBack.length) {
                r = r.concat(this.reqs);
            } else {
                r = r.concat(this.reqsBack);
            }
            for (var i = 0; i < r.length; i++) {
                if (r[i].nome == name) {
                    return true;
                    break;
                }
            }
            return false;
        },
        forceDOM: function () {
            var place = [];
            place = place.concat(this.skills);
            this.skills = [];
            this.skills = place;
        }
    }
}