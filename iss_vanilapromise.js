const request = require('request');

const fetchMyIP = function() {
  return new Promise((resolve) => {
    request(`https://api.ipify.org?format=json`, (error, response, body) => {
      if (error || response.statusCode !== 200) {
        console.log(error);
      }
      resolve(JSON.parse(body).ip);
    });
  });
};

const fetchCoordsByIP = function(ip) {
  return new Promise((resolve) => {
    request(`https://freegeoip.app/json/${ip}`, (error, response, body) => {
      if (error || response.statusCode !== 200) {
        console.log(error);
      }
      const latitude = JSON.parse(body).latitude;
      const longitude = JSON.parse(body).longitude;
      resolve({ latitude, longitude });
    });
  });
};

const fetchISSFlyOver = function(coords) {
  return new Promise((resolve) => {
    request(`http://api.open-notify.org/iss-pass.json?lat=${coords.latitude}&lon=${coords.longitude}`, (error, response, body) => {
      if (error || response.statusCode !== 200) {
        console.log(error);
      }
      const passTime = [...JSON.parse(body).response];
      resolve(passTime);
    });
  });
};

const printPassTime = function(passTime) {
  return new Promise((resolve) => {
    passTime.forEach((time) => {
      let riseTime = new Date(time.risetime * 1000).toLocaleString('en-US', { timeZone: 'America/Vancouver' });
      let duration = time.duration;
      console.log(`Duration: ${duration}sec ${riseTime}`);
      resolve();
    });
  });
};

const fetchISSLocation = function() {
  return new Promise((resolve) => {
    request(`http://api.open-notify.org/iss-now.json`, (error, response, body) => {
      if (error || response.statusCode !== 200) {
        console.log(error);
      }
      const latitude = JSON.parse(body).iss_position.latitude;
      const longitude = JSON.parse(body).iss_position.longitude;
      resolve({ latitude, longitude });
    });
  });
};

const printISSLocation = function(location) {
  process.stdout.write(`\rISS Location: Latitude ${location.latitude}, Longitude ${location.longitude}`);
};

module.exports = {
  fetchMyIP,
  fetchCoordsByIP,
  fetchISSFlyOver,
  printPassTime,
  fetchISSLocation,
  printISSLocation
};