var express = require("express")
var path = require("path")
var bodyParser = require("body-parser")
var request = require('request')
var fs = require('fs')

var app = express()

var jsonParser = bodyParser.json({
    limit: 1024 * 1024 * 100,
    type: 'application/json'
})

var urlencodedParser = bodyParser.urlencoded({
    extended: true,
    limit: 1024 * 1024 * 100,
    type: 'application/x-www-form-urlencoding'
})

app.use(jsonParser)
app.use(urlencodedParser)

app.get('/', function (req, res) {
    res.send('The WebAPI only works on POST calls')
})

app.post('/', function (req, res) {
    var contents = fs.readFileSync('configs.json').toString();
    console.log(contents.toString());
    var urlAPI = JSON.parse(contents).urlApiLearning;

    var token = req.headers.token
    var risposta = ''

    console.log('Token:', req.headers.token)
    console.log('Body:', req.body)

    var IdPartecipazione = req.body.IdPartecipazione
    var IdPartecipante = req.body.IdPartecipante
    var IdCorso = req.body.IdCorso
    var IdEdizione = req.body.IdEdizione
    var IdModulo = req.body.IdModulo
    var TipoFattibilita = req.body.TipoFattibilita
    var FlagDocente = req.body.FlagDocente
    var TipoModulo = req.body.TipoModulo

    console.log('Valori:')
    console.log(IdPartecipazione, IdPartecipante, IdCorso, IdEdizione, IdModulo, TipoFattibilita, FlagDocente, TipoModulo)

    console.log('effettuo request:')

    //Lets configure and request

    request({
        url: urlAPI + '/Webapi', //URL to hit
        headers: {
            "token": token,
            "Content-Type": 'application/json',
            "X-HTTP-Method-Override": "ApriModuli"
        },
        method: 'POST',
        //Lets post the following key/values as form
        json: {
            "IdPartecipazione": IdPartecipazione,
            "IdPartecipante": IdPartecipante,
            "IdCorso": IdCorso,
            "IdEdizione": IdEdizione,
            "IdModulo": IdModulo,
            "TipoFattibilita": TipoFattibilita,
            "FlagDocente": FlagDocente,
            "TipoModulo": TipoModulo
        }
    }, function (error, response, body) {
        if (error) {
            console.log("ERRORE:", error);
        } else {

            var bod = body.split('{ "Response": ')[1].split('}')[0] + "}"
            bod = JSON.parse(bod)
            var IdTracking = bod.IdTracking
            var Messaggio = bod.Messaggio
            var Attestato = bod.Attestato

            var guid = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 20);
            base64_decode(Attestato, 'pdf/' + guid + '.pdf');

            risposta = {
                "Response": {
                    "IdTracking": IdTracking,
                    "Messaggio": Messaggio,
                    "Attestato": guid
                }
            }

            res.set({
                'Access-Control-Allow-Origin': '*'
            });
            res.send(risposta);
        }
    });

})

app.options('/', function (req, res) {
    var headers = {};

    headers["Access-Control-Allow-Origin"] = "*";
    headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS";
    headers["Access-Control-Allow-Credentials"] = false;
    headers["Access-Control-Max-Age"] = '86400'; // 24 hours
    headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Access-Control-Allow-Origin, token";
    res.writeHead(204, headers);
    res.end();
})

app.listen(8082, function () {
    console.log('PDF WebAPI listening on port 8082!')
})

// function to create file from base64 encoded string
function base64_decode(base64str, file) {
    // create buffer object from base64 encoded string, it is important to tell the constructor that the string is base64 encoded
    var pdf_file = new Buffer(base64str, 'base64');

    // write buffer to file
    fs.writeFileSync(file, pdf_file);
    console.log('******** File created from base64 encoded string ********');
}
