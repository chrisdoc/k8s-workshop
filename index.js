'use strict';

var express = require('express')
var app = express()
const os = require('os')
const hostname = os.hostname()

app.get('/', function (req, res) {
  res.send(`Hello from ${hostname}!`)
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
