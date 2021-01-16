const {
  fetchMyIP,
  fetchCoordsByIP,
  fetchISSFlyOver,
  printPassTime,
  fetchISSLocation,
  printISSLocation
} = require('./iss_promised');

fetchMyIP()
  .then((body) => fetchCoordsByIP(body))
  .then((coords) => fetchISSFlyOver(coords))
  .then((passTime) => {
    printPassTime(passTime);
    setInterval(() => {
      fetchISSLocation()
        .then((coords) => printISSLocation(coords));
    }, 1000);
  })
  .catch((err) => console.log(err));
