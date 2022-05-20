
// let socket = io();

let latData, longData;
var modelNumber;
var show_box, show_box2;

// //  Setting up the button on click
const model1Button = document.getElementById('model1');
const model2Button = document.getElementById('model2');

let heartbreakModel2 = document.getElementById('#heartModel2');

getLocation();

//data not coming through in client side
// socket.on('airtableData', (data)=> {
//   console.log(data);

// })

model1Button.addEventListener('click',event => {
  heartbreakModel2.setAttribute('visible', true);

    const data = {latData, longData,modelNumber};
//   socket.emit('userInputData', data);

})

model2Button.addEventListener('click',event => {
  modelNumber = 2;
    const data = {latData, longData,modelNumber };
  // console.log(data);
//   socket.emit('userInputData', data);

})

// Setting up airtable
var Airtable = require('airtable');
var base = new Airtable({apiKey: 'THEKEY'}).base('appgC9I1SyuOTCYEw');

// Setting up socket.io
// const io = require('socket.io')(server);

// let path = require('path');
// const { serialize } = require('v8');

// app.use(express.static('public'));

// Creating variables for position info
var latData, longData;


// app.get('/', function (req,res){
//     res.sendFile(path.join(__dirname + '/views/index.html'));
// });



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
//       socket.emit('airtableData', data);
    });
    fetchNextPage();

}, function done(err) {
    if (err) { console.error(err); return; }
});


// AR

  // Note to self: this wasn't working in mobile since the location wasn't super accurate. Once I added the exact location it worked
  // I guess in the future this would be the data stored in Airtable?
  var myLat=51.5518948;
  var myLong= -0.1519312;

  
  // boolean to show the box
  var show_box=false;
  var show_box2=false;
 
  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }

  
function showPosition(position) {

  latData = position.coords.latitude;
  longData = position.coords.longitude;


  // Selecting gps-entity-place attributes and assigning them the lat and lon data
  let modelLat = document.querySelector('[gps-entity-place]').getAttribute('latitude');
  modelLat = latData;

  let modelLon = document.querySelector('[gps-entity-place]').getAttribute('longitude');
  modelLon = longData;

// console.log('model entity data: ' + modelLat,modelLon);

  let dLat=Math.abs(myLat-position.coords.latitude);
  let dLong=Math.abs(myLong-position.coords.longitude);
  
  //don't forget to multiply distance by cosine of latitude to get actual distance
  // because latitude is 1 degree per nautical mile, but longitude is only this at the 
  // equator
  
  let hypot = Math.sqrt((dLat * dLat) + (Math.cos(dLat) * dLong * dLong));
  
  //convert to nautical miles and then to meters
  hypot = hypot * 60 * 1852;


  let success = "You are probably not in Mick's office";
  show_box = false;
  
  //if (dLat <= 0.00002 && dLong <= 0.00002) { // actually a perfectly fine way to do it
   
  if (hypot < 7) {
  success = "You are probably in Mick's office" //this is actually a terrible measure
  show_box = true;
  // console.log('hypot: ' hypot);
  //     console.log('box state: ' show_box);
  }
  
  //console.log("Latitude: " + position.coords.latitude + "<br>Longitude: " + position.coords.longitude + "<br>LatDist: " + dLat + "<br>LongDist: " + dLong + "<br>" + success + "<br> Approx. Dist = " + hypot + " metres");

}

// get the scene  
let scene = document.querySelector('a-scene');   
// if the scene has loaded, run the play function
scene.addEventListener('loaded', play);
 
// this function can be used just like the processing play function.
  
function play() {
  // get the box
  let box = document.getElementById('#heartModel');
  let box2 = document.getElementById('#healedModel');
  // make it invisible
  box.setAttribute('visible', false);
  box2.setAttribute('visible', false);
	// get the user's location
  getLocation();
  
  // console.log(show_box);
  // console.log(show_box2);
  // if the user is close, show_box will be true

  
  if (show_box) {
     // here I'm just making it visible. Lots of other ways to do it.
     box.setAttribute('visible', true);

    }

      // this function calls itself in a nice threaded way so it keeps going.
      requestAnimationFrame(play);
    }
  
