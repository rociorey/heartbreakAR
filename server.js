// Setting up express 
const express = require('express');
const router = express.Router();
const app = express();
const server = require('http').createServer(app);


// Setting up airtable
var Airtable = require('airtable');
var base = new Airtable({apiKey: 'keyjOjEJi89anFpa8'}).base('appgC9I1SyuOTCYEw');

// Setting up socket.io
const io = require('socket.io')(server);

let path = require('path');
const { serialize } = require('v8');

app.use(express.static('public'));

// Creating variables for position info
var latData, longData;


app.get('/', function (req,res){
    res.sendFile(path.join(__dirname + '/views/index.html'));
});



io.on('connection', (socket) =>{

  socket.on('userInputData', (data)=> {
      // console.log(data);
      base('User Data').create([
        {
          "fields": {
            "Model": data.modelNumber,
             "Latitude": data.latData,
            "Longitude": data.longData
          }
        },
      ], function(err, records) {
        if (err) {
          console.error(err);
          return;
        }
        records.forEach(function (record) {
          console.log(record.fields);
        });
      });
      

  })
})

server.listen(2000, ()=> {
    console.log('app is listening on ' + server.address().port);
});


// Airtable fetching
var latData;

base('User Data').select({
    // Selecting the first 3 records in Grid view:
    maxRecords: 3,
    view: "Grid view"
}).eachPage(function page(records, fetchNextPage) {
    // This function (`page`) will get called for each page of records.

    records.forEach(function(record) {
      const airtableLat = record.get('Latitude');
      const airtableLong = record.get('Longitude');
      const airtableModel = record.get('Model');
      const airtableDate = record.get('Date');

      const data = {airtableLat, airtableLong, airtableModel, airtableDate};
      // console.log(data);
      socket.emit('airtableData', data);
    });
    fetchNextPage();

}, function done(err) {
    if (err) { console.error(err); return; }
});

