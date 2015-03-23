/*
A simple node.js application intended to read data from Analog pins on the Intel based development boards such as the Intel(R) Galileo and Edison with Arduino breakout board.
MRAA - Low Level Skeleton Library for Communication on GNU/Linux platforms
Library in C/C++ to interface with Galileo & other Intel platforms, in a structured and sane API with port nanmes/numbering that match boards & with bindings to javascript & python.
The intent is to make it easier for developers and sensor manufacturers to map their sensors & actuators on top of supported hardware and to allow control of low level communication protocol by high level languages & constructs.
*/
var mraa = require('mraa'); //require mraa
var fs = require('fs');
console.log('MRAA Version: ' + mraa.getVersion()); //write the mraa version to the console
var B = 3975;
var analogPin0 = new mraa.Aio(0); //setup access analog input Analog pin #0 (A0)
var analogPin1 = new mraa.Aio(1);
var analogPin2 = new mraa.Aio(2);
var touch_sensor_value = 0, last_t_sensor_value;
//Touch Sensor connected to D2 connector
    var digital_pin_D2 = new mraa.Gpio(2);
    digital_pin_D2.dir(mraa.DIR_IN);

var http = require('http');

// todo


setInterval(function() {
touch_sensor_value = digital_pin_D2.read();
    var analogValue = analogPin0.read(); 
    var decibel = analogPin1.read();
    var potentio = analogPin2.read();
    console.log("Analog Pin (A1) Output: " + decibel);
    console.log("Analog Pin (A2) Output: " + potentio);

    //read the value of the analog pin
    /*console.log(analogValue); //write the value of the analog pin to the console
    console.log("Checking....");
    console.log("Analog Pin (A0) Output: " + analogValue);*/
    var resistance = (1023 - analogValue) * 10000 / analogValue; //get the resistance of the sensor;
    //console.log("Resistance: "+resistance);
    var celsius_temperature = 1 / (Math.log(resistance / 10000) / B + 1 / 298.15) - 273.15; //convert to temperature via datasheet ;
    //console.log("Celsius Temperature "+celsius_temperature);  
    console.log(celsius_temperature + "\t" + Date() + "\n");
    getData("hive1",celsius_temperature,Math.floor(Math.random()*6)+35,Math.floor(Math.random()*10)+40);
}, 5000);

function getData(hiveID,temp,weight,dB) {
  var temp2Digits = Math.round(temp*100)/100;
http.get("http://maxime.test4planet.appspot.com/beeapi/greet?hiveId="+hiveID+"&insideTemp="+temp2Digits+"&weight="+weight+"&dB="+dB, function(res) {
  console.log("Got response: " + res.statusCode);
    
 res.on('data', function (chunk) {
    console.log('BODY: ' + chunk);
  });   
    
}).on('error', function(e) {
  console.log("Got error: " + e.message);
});

}