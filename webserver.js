var express = require('express')
var serveStatic = require('serve-static')
var serveIndex = require('serve-index')

var app = express()

app.use(serveStatic(__dirname, {
    'index': ['index.html', 'login.html']
}))
app.use(serveIndex(__dirname))
app.listen(1111)