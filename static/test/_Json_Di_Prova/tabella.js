export const tabella = {
  "configs": {
    "ISTRUZIONI": "I campi di 'columns' (funzione, 2017, 2016, var) devono obbligatoriamente avere lo stesso nome dei campi in 'dati'",
    "title": "Il Personale Green",
    "visible": true,
    "columns": {
      "funzione": {
        "ISTRUZIONI": "'name': nome riportato nell'header, 'position': da sinistra a destra, 'width': larghezza in percentuale, 'editable': non funziona",
        "name": "Qualifica Personale",
        "position": 1,
        "visible": true,
        "editable": false,
        "width": 40,
        "searchable": true
      },
      "2017": {
        "name": "2017",
        "position": 2,
        "visible": true,
        "editable": false,
        "width": 20
      },
      "2016": {
        "name": "2016",
        "position": 3,
        "visible": true,
        "editable": false,
        "width": 20
      },
      "var": {
        "name": "Var %",
        "position": 4,
        "visible": true,
        "editable": false,
        "width": 20
      }
    }
  },
  "dati": [{
      "ISTRUZIONI": "Record che popolano la tabella",
      "funzione": "Dirigenti",
      "2016": 0.00,
      "2017": 0.00,
      "var": "+0.00"
    },
    {
      "funzione": "Quadri",
      "2016": 0.00,
      "2017": 0.00,
      "var": "+0.00"
    },
    {
      "funzione": "Impiegati",
      "2016": 27.00,
      "2017": 26.00,
      "var": "-3.70"
    },
    {
      "funzione": "Operai",
      "2016": 14.00,
      "2017": 14.00,
      "var": "+0.00"
    },
    {
      "funzione": "Operai Apprendisti",
      "2016": 0.00,
      "2017": 0.00,
      "var": "+0.00"
    }
  ]
}