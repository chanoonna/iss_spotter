const {
  fetchMyIP,
  fetchCoordsByIP,
  initializeISS,
} = require('./iss');

const getIP = function(error, ip) {                         // Callback for fetchMyIP
  if (error) {
    console.log("It didn't work!", error);                  // Being lazy with error handling.
    return;
  }

  fetchCoordsByIP(ip, getCoords);                           // Fetch coordinates with ip. (callback: getCoords)
};

const getCoords = function(error, coordinates) {            // Callback for getting coordinates
  if (error) {
    console.log("It didn't work!", error);
    return;
  }

  initializeISS(coordinates);                               // Call initializeISS to request ISS data with the coordinates.
};

fetchMyIP(getIP);                                           // Starting Point.
