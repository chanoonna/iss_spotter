/*
  Every request goes through requestJSON function.
  
  requestJSON(url, callback, parse)

  url : string
  callback : function takes parsed JSON data fetched from the url
  parse : how to parse JSON data.
*/

const request = require('request');

const requestError = function(error) {
  if (typeof error === 'number') {
    console.log(`Server responded with following code: ${error}`);
  } else {
    console.log("Following error occured", error);
  }
};

const requestJSON = function(url, callback, parse) {
  request(url, (error, response, body) => {
    if (error) {
      requestError(error);
      return;
    }
    if (response.statusCode !== 200) {
      requestError(response.statusCode);
      return;
    }

    callback(parse(body));
  });
};

const fetchMyIP = function(callback) {
  requestJSON(`https://api.ipify.org?format=json`, callback, (body) => {
    return JSON.parse(body).ip;
  });
};

const fetchCoordsByIP = function(ip, callback) {
  requestJSON(`https://freegeoip.app/json/${ip}`, callback, (body) => {
    const latitude = JSON.parse(body).latitude;
    const longitude = JSON.parse(body).longitude;
    return { latitude, longitude };
  });
};

const fetchISS = function(coords) {
  fetchPassBy(coords);
  
  setInterval(() =>
    requestJSON('http://api.open-notify.org/iss-now.json',
    issLocation,
    (body) => {
      const latitude = JSON.parse(body).iss_position.latitude;
      const longitude = JSON.parse(body).iss_position.longitude;
      return { latitude, longitude };
    }),
  1000
  );
};

const issLocation = function(location) {
  process.stdout.write(`\rISS Location: Latitude ${location.latitude}, Longitude ${location.longitude}`);
};

const fetchPassBy = function(coords) {
  requestJSON(`http://api.open-notify.org/iss-pass.json?lat=${coords.latitude}&lon=${coords.longitude}`,
    printPassBy,
    (body) => {
      return [...JSON.parse(body).response];
    }
  );
};

const printPassBy = function(arr) {
  console.log(`ISS PASS TIME (VANCOUVER/PASIFIC)`);
  arr.forEach((timestamp) => {
    let riseTime = new Date(timestamp.risetime * 1000).toLocaleString('en-US', { timeZone: 'America/Vancouver' });
    let duration = timestamp.duration;
    console.log(`Duration: ${duration}sec ${riseTime}`);
  });
};

module.exports = {
  fetchMyIP,
  fetchCoordsByIP,
  fetchISS
};
