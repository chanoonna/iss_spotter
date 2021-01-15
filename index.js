const {
  fetchMyIP,
  fetchCoordsByIP,
  fetchISS,
} = require('./iss');

const getIP = function(ip) {
  fetchCoordsByIP(ip, getCoords);
};

const getCoords = function(coords) {
  fetchISS(coords);
};

fetchMyIP(getIP);
