const express = require('express');
const http = require('http');
const path = require('path');

var jobRouteArray = require('./src/backend/routes/jobs');
var jobRoute = jobRouteArray.router;
var progressRoute = require('./src/backend/routes/progress');
var assessmentRoute = require('./src/backend/routes/assessment');
var fileStatusRoute = require('./src/backend/routes/filestatus');
var objectStatusRoute = require('./src/backend/routes/objectstatus');

var app = require('express')();

var fs = require("fs");

require('dotenv').config();

var uniqid = require('uniqid');

const bodyParser = require('body-parser');
app.use(
  bodyParser.urlencoded({extended:true})
  );
  app.use(bodyParser.json());

  app.use(express.static(path.join(__dirname,'dist/CockPit')));
app.get('',(req,res)=>{
  res.sendFile(path.join(__dirname,'dist/CockPit/index.html'));
});
app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin',"*");
    res.setHeader('Access-Control-Allow-Headers',"Origin,X-Requested-With,Content-Type,Accept");
    res.setHeader('Access-Control-Allow-Methods',"GET,POST,PATCH,PUT,DELETE,OPTIONS");

    next();

  });


// console.log('dir name is ' + __dirname);
// console.log('path is ' + path);

const port = process.env.PORT;
app.set('port',port);
//==================================================================


app.use('/cockpit/services/jobs',jobRoute);
app.use('/cockpit/services/progress',progressRoute);
app.use('/cockpit/services/assessment',assessmentRoute);
app.use('/cockpit/services/filestatus',fileStatusRoute);
app.use('/cockpit/services/objectstatus',objectStatusRoute);




//--------------------------------------------------------------------------
const server = http.createServer(app);

server.listen(port,()=>console.log('Running'));

//module.exports = app;
//-------------------------------------------------------------------------
