const request = require('request');

const fetchMyIP = function(callback) {
  request('https://api.ipify.org?format=json', (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }

    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode}. Response ${body}`;
      callback(Error(msg), null);
      return;
    }

    callback(error, JSON.parse(body).ip);
  });
};

const fetchCoordsByIP = function(ip, callback) {
  request(`https://freegeoip.app/json/${ip}`, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }

    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode}. Responst ${body}`;
      callback(Error(msg), null);
      return;
    }

    const coordinates = { latitude: JSON.parse(body).latitude, longitude: JSON.parse(body).longitude };
    callback(error, coordinates);
  });
};

const initializeISS = function(coords) {
  issPassBy(coords);                                                                        // This will printout ISS Pass-by Time (Prints once);
  setInterval(                                                                              // Set interval here to fetch ISS Location in every sec.
    () => request('http://api.open-notify.org/astros.json', (error, response, body) => {    // This is for the number of people in space.
      if (error || response.statusCode !== 200) {
        console.log(error);                                                                 // If there's an error, exit the app.
        process.exit();
      }
      const spacePeople = JSON.parse(body).number;
      issLocation(spacePeople);                                                             // With then number with got from the server, call issLocation.
      return;
    })
    , 1000);                                                                                  // 1000 milsec for setInterval.
};

const issLocation = function(people) {
  request('http://api.open-notify.org/iss-now.json', (error, response, body) => {           // Request ISS Location.
    if (error || response.statusCode !== 200) {
      process.stdout.write(`\rCan't fetch data.`);                                          // If an error, it will show error message. But don't quit.
      return;
    }
    const parsed = JSON.parse(body).iss_position;
    const issLoc = { latitude: parsed.latitude, longitude: parsed.longitude };
    process.stdout.write(`\rSpace people: ${people} || ISS Location: Latitude ${issLoc.latitude}, Longitude ${issLoc.longitude}`);
  });                                                                                       // Print the current location of ISS. (On the same line);
};

const issPassBy = function(coords) {                                                        // This is for fetching Next ISS Pass-bys
  request(`http://api.open-notify.org/iss-pass.json?lat=${coords.latitude}&lon=${coords.longitude}`, (error, response, body) => {
    if (error || response.statusCode !== 200) {
      console.log(`Failed to fetch ISS Passtime at ${coords.latitude}, ${coords.longitude}`);   // Another example being lazy.
      return;
    }
    printPassBy([...JSON.parse(body).response]);                                            // Call print function. Data is a form of array.
  });
};

const printPassBy = function(arr) {
  console.log(`ISS PASS TIME (VANCOUVER/PASIFIC)`);
  arr.forEach((timestamp) => {
    let riseTime = new Date(timestamp.risetime * 1000).toLocaleString('en-US', { timeZone: 'America/Vancouver' });
    let duration = timestamp.duration;
    console.log(`Duration: ${duration} sec || ${riseTime}`);
  });
};

module.exports = {
  fetchMyIP,
  fetchCoordsByIP,
  initializeISS
};
