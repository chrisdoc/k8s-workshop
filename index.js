'use strict';

var express = require('express')
var app = express()

app.get('/', function (req, res) {
    const
      spawn = require( 'child_process' ).spawn,
      hostname = spawn( 'hostname' )
    hostname.stdout.on('data', data =>{
      res.send(`Hello from ${data}!`)
    })

})

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
})
