<template>
    <div id="mbo">
        <div id="titolo">
            <h1>ADB XYZ 2017</h1>
        </div>
        <div id="tabella_header">
            <table>
                <tr>
                    <th colspan="1" style="background-color: white;"></th>
                    <th colspan="3" class="primo">TOTAL ADB</th>
                </tr>
                <tr>
                    <th colspan="1" width="140px" class="secondo">Cluster</th>
                    <th colspan="1" width="140px" class="secondo">Target Revenue</th>
                    <th colspan="1" width="140px" class="terzo">Delta Generate</th>
                    <th colspan="1" width="140px" class="quarto">Delta Gestite</th>
                </tr>
            </table>
        </div>
        <div id="tabella_adb">
            <table>
                <tr v-for="(cluster, c) in adb">
                    <td colspan="1" width="140px" :class="{'normale': (c % 2 == 1), 'alternata': (c % 2 == 0)}" style="font-weight: 400; white-space: nowrap;">{{cluster.cluster.toUpperCase()}}</td>
                    <td colspan="1" width="140px" :class="{'normale': (c % 2 == 1), 'alternata': (c % 2 == 0)}" style="font-weight: 400;">{{cluster.target}}</td>
                    <td colspan="1" width="140px" :class="{'normale': (c % 2 == 1), 'alternata': (c % 2 == 0), 'positivo': cluster.delta_generate > 0, 'negativo': cluster.delta_generate <0}" style="font-weight: 400;">{{cluster.delta_generate}} <span style="color:black; font-size:12px;">({{cluster.totale_generate}})</span></td>
                    <td colspan="1" width="140px" :class="{'normale': (c % 2 == 1), 'alternata': (c % 2 == 0), 'positivo': cluster.delta_gestite > 0, 'negativo': cluster.delta_gestite <0}" style="font-weight: 400;">{{cluster.delta_gestite}} <span style="color:black; font-size:12px;">({{cluster.totale_gestite}})</span></td>
                </tr>
                <tr>
                    <td colspan="1" width="140px" style="font-weight: 600;">TOTALI 2017</td>
                    <td colspan="1" width="140px" style="font-weight: 600;">{{totale_target}}</td>
                    <td colspan="1" width="140px" :class="{'positivo': totale_delta_generate > 0, 'negativo': totale_delta_generate <0}" style="font-weight: 600;">{{totale_delta_generate}} <span style="color:black; font-size:12px;">({{totale_totale_generate}})</span></td>
                    <td colspan="1" width="140px" :class="{'positivo': totale_delta_gestite > 0, 'negativo': totale_delta_gestite <0}" style="font-weight: 600;">{{totale_delta_gestite}} <span style="color:black; font-size:12px;">({{totale_totale_gestite}})</span></td>
                </tr>
                <tr>
                    <td colspan="1" width="140px" style="font-weight: 600;">TOTALI 2016</td>
                    <td colspan="1" width="140px" style="font-weight: 600;">0 </td>
                    <td colspan="1" width="140px" style="font-weight: 600;">0 <span style="color:black; font-size:12px;">(0)</span></td>
                    <td colspan="1" width="140px" style="font-weight: 600;">0 <span style="color:black; font-size:12px;">(0)</span></td>
                </tr>
                <tr>
                    <td colspan="4"></td>
                </tr>
            </table>
        </div>
        <div id="tabella_people" class="col-xs-12">
            <table>
                <tr class="bianco">
                    <td class="bianco" :colspan="persone.length * 2"></td>
                </tr>
                <tr>
                    <th v-for="(tipo,i) in tipologie" :colspan="contatore[i] * 2" :class="{'primo': (i % 2==1), 'secondo': (i % 2==0)}" style="white-space: nowrap;">{{tipo}}</th>
                </tr>
                <tr>
                    <th v-for="persona in persone" colspan="2" style="background-color: white; color: black; font-weight: 300; border-left: 1px solid #ddd;border-right: 1px solid #ddd;">
                        <img :src="persona.avatar" alt="" width="100px" height="100px" style="border-radius: 10px;">
                        <br><span style="white-space: nowrap;">{{persona.nome}}</span>
                    </th>
                </tr>
                <tr>
                    <th v-for="n in (persone.length *2)" colspan="1" :class="{'terzo': (n % 2==1), 'quarto': (n % 2==0)}">
                        <span v-if="n%2 == 1">Revenue Generate</span>
                        <span v-if="n%2 == 0">Revenue Gestite</span>
                    </th>
                </tr>
            </table>
        </div>
        <div id="tabella_dati" class="col-xs-12">
            <table>
                <tr v-for="n in adb.length">
                    <td v-for="m in (persone.length * 2)" :class="{'normale': (n % 2 == 0), 'alternata': (n % 2 == 1)}" :key="m">
                        <span :id="'generate-' + m + '-' + n" v-if="m % 2 == 1" @keyup.enter.prevent='edita_generate(m,n)' @click.prevent="edita_generate(m,n)" @blur='edita_generate(m,n)' contenteditable="true">{{persone[Math.ceil(m/2) - 1].generate[n-1]}}</span>
                        <span :id="'gestite-' + m + '-' + n" v-if="m % 2 == 0" @keyup.enter.prevent='edita_gestite(m,n)' @click.prevent="edita_gestite(m,n)" @blur='edita_gestite(m,n)' contenteditable="true">{{persone[Math.ceil(m/2) - 1].gestite[n-1]}}</span>
                    </td>
                </tr>
                <tr>
                    <td :colspan="persone.length * 2" class="normale">
                    </td>
                </tr>
                <tr>
                    <td :colspan="persone.length * 2" class="normale">
                    </td>
                </tr>
                <tr>
                    <td :colspan="persone.length * 2" class="normale">
                    </td>
                </tr>
                <tr>
                    <td :colspan="persone.length * 2" class="normale">
                    </td>
                </tr>
                <tr>
                    <td :colspan="persone.length * 2" class="normale">
                    </td>
                </tr>
            </table>
        </div>
    </div>
</template>
<script>
// Crezione tabella ADB
// array con tutti gli ADB
var adb_init = []

// numero totale degli ADB
var max_adb = 25

// generazione random dei cluster ADB
for (let i = 0; i < max_adb; i++) {
    adb_init.push({
        cluster: chance.word(),
        target: chance.integer({
            min: 1,
            max: 50
        }) * 100,
        delta_generate: 0,
        delta_gestite: 0,
        totale_generate: 0,
        totale_gestite: 0
    })
}

// Crezione tabella PERSONE
// array con tutte le persone
var people = []

// numero totale delle persone
var max_people = 30

// array con i tipi
var tipi = ['Associate', "Manager Project", "Manager Client", "Senior Manager", "Principal", "Director", "NEP", "Speciali"]
var tipo_espanso = [true, true, true, true, true, true, true, true, true]

// generazione random delle persone
for (let i = 0; i < max_people; i++) {

    let id = chance.integer({
        min: 1,
        max: 90
    })

    let sesso = chance.gender()

    let avatar = (sesso == 'Male') ? 'https://randomuser.me/api/portraits/men/' + id + '.jpg' : 'https://randomuser.me/api/portraits/women/' + id + '.jpg'

    let nome = chance.name({
        nationality: 'it',
        gender: sesso
    })

    people.push({
        avatar: avatar,
        nome: nome,
        tipo: chance.integer({
            min: 0,
            max: 7
        }),
        generate: chance.n(chance.integer, max_adb, {
            min: 0,
            max: 0
        }),
        gestite: chance.n(chance.integer, max_adb, {
            min: 0,
            max: 0
        })
    })
}

people.sort(function(a, b) {
    return a.tipo - b.tipo;
});

// conto occorrenze in base alla tipologia della persona
var contatore_tipi = []

// imposto a 0 tutti i contatori
for (let i = 0; i < tipi.length; i++) {
    contatore_tipi[i] = 0
}
// ciclo tutte le persona per incrementare il contatore
for (let i = 0; i < people.length; i++) {
    contatore_tipi[people[i].tipo]++
}

// VUE JS
export default {
    mounted: function() {
        console.log('MBO')
        this.calcola_totali()
    },
    data: function() {
        return {
            adb: adb_init,
            persone: people,
            contatore: contatore_tipi,
            tipologie: tipi,
            totale_target: 0,
            totale_delta_generate: 0,
            totale_totale_generate: 0,
            totale_delta_gestite: 0,
            totale_totale_gestite: 0
        }
    },
    watch: {
        'test': function() {
            this.calling();
        },
        '$route': function() {
            if (localStorage.getItem("TokenScaduto")) {
                localStorage.removeItem("TokenScaduto");
                eventBus.$emit("alert", "Sessione scaduta");
            }
        }
    },
    methods: {
        calcola_totali() {
            let totale_target = 0
            let totale_delta_generate = 0
            let totale_totale_generate = 0
            let totale_delta_gestite = 0
            let totale_totale_gestite = 0

            for (let ii = 0; ii < this.adb.length; ii++) {
                var t_riga_generate = 0
                var t_riga_gestite = 0

                for (let i = 0; i < this.persone.length; i++) {
                    t_riga_generate = t_riga_generate + this.persone[i].generate[ii]
                    t_riga_gestite = t_riga_gestite + this.persone[i].gestite[ii]
                }

                this.adb[ii].totale_generate = parseInt(t_riga_generate)
                this.adb[ii].totale_gestite = parseInt(t_riga_gestite)
                this.adb[ii].delta_generate = parseInt(t_riga_generate - this.adb[ii].target)
                this.adb[ii].delta_gestite = parseInt(t_riga_gestite - this.adb[ii].target)

                totale_target = totale_target + this.adb[ii].target
                totale_delta_generate = totale_delta_generate + this.adb[ii].delta_generate
                totale_totale_generate = totale_totale_generate + this.adb[ii].totale_generate
                totale_delta_gestite = totale_delta_gestite + this.adb[ii].delta_gestite
                totale_totale_gestite = totale_totale_gestite + this.adb[ii].totale_gestite
            }

            this.totale_target = parseInt(totale_target)
            this.totale_delta_generate = parseInt(totale_delta_generate)
            this.totale_totale_generate = parseInt(totale_totale_generate)
            this.totale_delta_gestite = parseInt(totale_delta_gestite)
            this.totale_totale_gestite = parseInt(totale_totale_gestite)
        },
        edita_generate(m, n) {
            let id = '#generate-' + m + '-' + n
            let nuovo_valore = parseInt($(id).text())
            let vecchio_valore = this.persone[Math.ceil(m / 2) - 1].generate[n - 1]

            if (!isNaN(nuovo_valore) && vecchio_valore != nuovo_valore) {
                this.persone[Math.ceil(m / 2) - 1].generate[n - 1] = nuovo_valore
                this.calcola_totali()
            }
        },
        edita_gestite(m, n) {
            let id = '#gestite-' + m + '-' + n
            let nuovo_valore = parseInt($(id).text())
            let vecchio_valore = this.persone[Math.ceil(m / 2) - 1].gestite[n - 1]

            if (!isNaN(nuovo_valore) && vecchio_valore != nuovo_valore) {
                this.persone[Math.ceil(m / 2) - 1].gestite[n - 1] = nuovo_valore
                this.calcola_totali()
            }
        }
    },
    computed: {}
}

var initial_top = $('#tabella_adb').top
var initial_left = $('#tabella_people').left

$(window).scroll(function() {

    var sTop = $(window).scrollTop()
    var sLeft = $(window).scrollLeft()

    document.getElementById("tabella_people").style.left = (initial_left - sLeft) + "px";
    document.getElementById("tabella_adb").style.top = (initial_top - sTop) + "px";
});

$('span[contenteditable]').keydown(function(e) {
    if (e.keyCode === 13) {
        return false;
    }
    if (e.keyCode === 9) {
        e.preventDefault();
    }
});
</script>
<style scoped>
#mbo {
    font-family: 'Roboto', sans-serif;
    font-size: 15px;
    color: #444;
}

table {
    background-color: #fff;
}

th {
    background-color: #3e78b3;
    color: rgba(255, 255, 255, 1);
    cursor: pointer;
    border-right: 1px solid white;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    text-align: center;
    font-size: 16px;
}

td {
    background-color: #f9f9f9;
    font-size: 16px;
    font-weight: 300;
}

th,
td {
    min-width: 100px;
    padding: 10px 20px;
    border-bottom: 1px solid #ddd;
}

td {
    text-align: right;
}

th.active {
    color: #fff;
}

th.active .arrow {
    opacity: 1;
}

#titolo {
    float: left;
    position: fixed;
    background-color: white;
    top: 0px;
    left: 0px;
    width: 561px;
    height: 164px;
    z-index: 200;
}

#bordo_top {
    position: fixed;
    background-color: white;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 50px;
    z-index: 200;
}

#tabella_header {
    position: fixed;
    padding: 0px !important;
    top: 164px;
    left: 0px;
    z-index: 100;
}

#tabella_adb {
    position: fixed;
    padding: 0px !important;
    top: 270px;
    left: 0px;
    z-index: 99;
    border-right: 1px solid #ddd;
}

#tabella_people {
    position: fixed;
    padding: 0px !important;
    margin: 0px !important;
    left: 561px;
    z-index: 2;
}

#tabella_dati {
    position: absolute;
    padding: 0px !important;
    margin: 0px !important;
    left: 561px;
    top: 270px;
    z-index: 1;
}

h1 {
    position: absolute;
    font-family: 'Roboto', sans-serif;
    font-weight: 300;
    margin: 0px !important;
    padding: 0px !important;
    top: 20px;
    left: 20px;
}

.primo {
    background-color: rgba(62, 120, 179, 1)
}

.secondo {
    background-color: rgba(62, 120, 179, 0.7)
}

.terzo {
    background-color: rgba(0, 0, 0, 0.5)
}

.quarto {
    background-color: rgba(0, 0, 0, 0.4)
}

.bianco {
    background-color: white !important;
    color: white !important;
}

.normale {
    background-color: white;
}

.alternata {
    background-color: #eee;
}

.positivo {
    color: #006400;
}

.negativo {
    color: #f00;
}

/*
#mbo {
    position: relative !important;
    left: 36px;
    font-family: 'Roboto', sans-serif;
    font-size: 15px;
    color: #444;
    overflow: scroll !important;
}

table {
    background-color: #fff;
}

th {
    background-color: #3e78b3;
    color: rgba(255, 255, 255, 1);
    cursor: pointer;
    border-right: 1px solid white;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    text-align: center;
    font-size: 16px;
}

td {
    background-color: #f9f9f9;
    font-size: 16px;
    font-weight: 300;
}

th,
td {
    min-width: 100px;
    padding: 10px 20px;
    border-bottom: 1px solid #ddd;
}

td {
    text-align: right;
}

th.active {
    color: #fff;
}

th.active .arrow {
    opacity: 1;
}

#titolo {
    position: fixed;
    top: 65px;
    left: 35px;
    background-color: white;
    width: 561px;
    height: 164px;
    z-index: 200;
}

#bordo_top {
    position: fixed;
    left: 35px;
    background-color: white;
    width: 100%;
    height: 50px;
    z-index: 200;
}

#tabella_header {
    position: fixed;
    top: 228px;
    left: 35px;
    padding: 0px !important;
    z-index: 100;
}

#tabella_adb {
    position: fixed;
    top: 325px;
    left: 35px;
    padding: 0px !important;
    z-index: 99;
    border-right: 1px solid #ddd;
}

#tabella_people {
    position: fixed;
    top: 67px;
    left: 596px;
    padding: 0px !important;
    margin: 0px !important;
    z-index: 2;
}

#tabella_dati {
    position: fixed;
    left: 596px;
    top: 325px;
    padding: 0px !important;
    margin: 0px !important;
    z-index: 1;
}

h1 {
    position: absolute;
    top: 20px;
    left: 20px;
    font-family: 'Roboto', sans-serif;
    font-weight: 300;
    margin: 0px !important;
    padding: 0px !important;
}

.primo {
    background-color: rgba(62, 120, 179, 1)
}

.secondo {
    background-color: rgba(62, 120, 179, 0.7)
}

.terzo {
    background-color: rgba(0, 0, 0, 0.5);
}

.quarto {
    background-color: rgba(0, 0, 0, 0.4);
}

.bianco {
    background-color: white !important;
    color: white !important;
}

.normale {
    background-color: white;
    height: 42px !important;
}

.alternata {
    background-color: #eee;
    height: 42px !important;
}

.positivo {
    color: #006400;
}

.negativo {
    color: #f00;
}
*/
</style>
