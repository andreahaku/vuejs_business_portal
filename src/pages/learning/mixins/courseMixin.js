import { eventBus } from '../../../eventbus.js';

export const courseMixin = {
    created: function () {
        this.getCorsi();
    },
    data: function () {
        return {
            filtro: '',
            corsiCollection: {},
            partCollection: {},
            tutticorsi: [],
            corsifiltrati: [],
            displaycorsi: [],
            labelout: false,

            ready: false
        }
    },
    methods: {
        getCorsi: function () {

            if (this.$route.path.split('/')[2]) {

                this.filtro = this.$route.path.split('/')[2];
                this.filtro = decodeURI(this.filtro);
                this.filterOut();
            }

            this.corsiCollection = this.$store.getters.getCorsi;
            var corsi = this.corsiCollection.data;

            if (corsi) {
                for (var i = 0; i < corsi.length; i++) {
                    var corso = corsi[i]
                    if (corso.Catalogo == -1 || corso.alreadyFetched) {
                        this.fetchCorso(corso);
                    }
                }
            } else {
                console.log("APICorsi -list- returns: ")
                console.log(corsi)
            }

            this.partCollection = this.$store.getters.getPartecipazioni;
            var partecipazioni = [];
            if (this.partCollection) {
                partecipazioni = this.partCollection.data
            }

            var ids = []
            for (var i = 0; i < partecipazioni.length; i++) {
                var check = this.tutticorsi.some(function (c) {
                    if (c.idcorso == partecipazioni[i].IDCorso) {
                        return true;
                    }
                })

                if (!check) {
                    if (ids.indexOf(partecipazioni[i].IDCorso) == -1) {
                        ids.push(partecipazioni[i].IDCorso);
                    }
                }
            }
            if (ids.length > 0) {
                ids = ids.join(";");
                console.log(ids)
                this.$http.get(localStorage.getItem("path") + "/APICorsi?ID=" + ids, {
                    headers: {
                        light: "1"
                    }
                }).then(function (response) {
                    console.log("ins")
                    var res = response.body
                    try {
                        var res = JSON.parse(response.body);
                    } catch (err) { }
                    if (res && res.APICorsi) {
                        for (var i = 0; i < res.APICorsi.length; i++) {
                            this.fetchCorso(res.APICorsi[i]);
                            var obj = res.APICorsi[i];
                            obj.alreadyFetched = true;
                            this.corsiCollection.insert(obj);
                        }
                        this.ready = true;
                    }

                }, function (err) {
                    console.log(err);
                    this.ready = true;
                })
            } else {
                this.ready = true;
            }

        },
        fetchCorso: function (corso) {
            var descrizione = '';
            if (corso.Contenuti) {
                descrizione = corso.Contenuti;
                if (descrizione.split('>')[1] != '' && descrizione.split('>')[1] != null) {
                    descrizione = descrizione.split('>')[1].split('</')[0];
                }
            }
            descrizione = descrizione.replace('&egrave', '&egrave;');

            var obj = {
                idcorso: corso.ID,
                idareatematica: corso.IDAreaTematica,
                titolo: corso.Titolo,
                ore: corso.Ore,
                descrizione: descrizione,
                immagine: corso.Immagine ? corso.Immagine : null,
                //temporaneo random rating
                rating: Math.floor((Math.random() * 5) + 1),
                idDocente: corso.IDResponsabile,
                ELearningTipoFormazione: corso.ELearningTipoFormazione

            }

            if (obj.idDocente != null) {
                obj.imgDocente = '/images/profile-photo_small.png'
                obj.docente = '';
            }
            this.tutticorsi.push(obj);
        },
        filtraCorsi: function () {
            var filter = this.filtro.toLowerCase();
            if (this.filtro.trim() != "") {
                var corsi = this.tutticorsi.filter(function (element) {
                    return element.titolo.toLowerCase().includes(filter);
                });
                return corsi;
            } else {
                return this.tutticorsi;
            }
        },
        // metodo per un far sovrappore il filtro con il suo label
        filterOut: function () {
            if (this.filtro != '') {
                this.labelout = true;
            } else {
                this.labelout = false;
            }
        },
        dispatchedPagination: function (toDisplay) {
            this.displaycorsi = toDisplay;
            this.loadImages();
            $(".st-content-inner").scrollTop(0);
        },
        loadImages: function () {
            if (this.displaycorsi.length > 0) {
                var lookForTutor = { indexes: [], string: [] };
                var ids = this.displaycorsi[0].idcorso;
                if (this.displaycorsi[0].idDocente != null) {
                    lookForTutor.indexes.push(0);
                    lookForTutor.string.push(this.displaycorsi[0].idDocente);
                }
                for (var i = 1; i < this.displaycorsi.length; i++) {
                    ids += ";" + this.displaycorsi[i].idcorso;
                    if (this.displaycorsi[i].idDocente != null) {
                        if (lookForTutor.string.indexOf(this.displaycorsi[i].idDocente) == -1) {
                            lookForTutor.string.push(this.displaycorsi[i].idDocente);
                        }
                        lookForTutor.indexes.push(i);
                    }
                }
                this.$http.get(localStorage.getItem('path') + '/APICorsi?ID=' + ids).then(function (response) {
                    var res = response.body;
                    try {
                        res = JSON.parse(response.body);
                    } catch (err) { };

                    if (res && res.APICorsi) {
                        for (var i = 0; i < this.displaycorsi.length; i++) {
                            for (var j = 0; j < res.APICorsi.length; j++) {
                                if (this.displaycorsi[i].idcorso == res.APICorsi[j].ID) {
                                    var corso = res.APICorsi[j];
                                    if (corso.Immagine != null) {
                                        this.displaycorsi[i].immagine = corso.Immagine;
                                    } else {
                                        this.displaycorsi[i].immagine = "images/course-placeholder.png";
                                    }
                                    break;
                                }
                            }

                        }
                    }
                });

                if (lookForTutor.indexes.length > 0) {
                    lookForTutor.string = lookForTutor.string.join(';');

                    this.$http.get(localStorage.getItem('path') + '/APIUtenti?IDPersona=' + lookForTutor.string).then(function (response) {
                        var user = response.body;
                        try {
                            user = JSON.parse(response.body);
                        } catch (err) { };

                        if (user != null && user.APIUtenti != null) {
                            for (var i = 0; i < lookForTutor.indexes.length; i++) {
                                var ind = lookForTutor.indexes[i];
                                for (var j = 0; j < user.APIUtenti.length; j++) {
                                    var us = user.APIUtenti[j];
                                    if (this.displaycorsi[ind] && this.displaycorsi[ind].idDocente == us.IDPersona) {
                                        this.displaycorsi[ind].docente = us.Persona;
                                        if (us.FOTO != null) {
                                            this.displaycorsi[ind].imgDocente = us.FOTO;
                                            if (us.IDPersona == 2834) {
                                                //this.displaycorsi[ind].imgDocente = 'http://www.michaelemerson.net/wp-content/uploads/2012/08/michael_emerson.png';
                                            }
                                        }
                                        break;
                                    }
                                }
                            }
                        }
                    });
                }
            }
        },
    },
    watch: {
        'filtro': function () {
            this.corsifiltrati = this.filtraCorsi();
        },
        'tutticorsi': function () {
            this.corsifiltrati = this.filtraCorsi();
        }
    }
}