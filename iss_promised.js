const request = require('request-promise-native');

const fetchMyIP = function() {
  return request(`http://api.ipify.org?format=json`);
};

const fetchCoordsByIP = function(fetchedIP) {
  const ip = JSON.parse(fetchedIP).ip;
  return request(`https://freegeoip.app/json/${ip}`);
};

const fetchISSFlyOver = function(fetchedCoords) {
  const latitude = JSON.parse(fetchedCoords).latitude;
  const longitude = JSON.parse(fetchedCoords).longitude;
  return request(`http://api.open-notify.org/iss-pass.json?lat=${latitude}&lon=${longitude}`);
};

const printPassTime = function(fetchedTime) {
  const passTime = [...JSON.parse(fetchedTime).response];
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
  return request(`http://api.open-notify.org/iss-now.json`);
};

const printISSLocation = function(location) {
  const latitude = JSON.parse(location).iss_position.latitude;
  const longitude = JSON.parse(location).iss_position.longitude;
  process.stdout.write(`\rISS Location: Latitude ${latitude}, Longitude ${longitude}`);
};

module.exports = {
  fetchMyIP,
  fetchCoordsByIP,
  fetchISSFlyOver,
  printPassTime,
  fetchISSLocation,
  printISSLocation
};