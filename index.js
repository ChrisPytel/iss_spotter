// index.js

const { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes } = require('./iss');

fetchMyIP((error, ip) => {
  if (error) {
    console.log("It didn't work! Failed to get our IP" , error);
    return;
  }

  console.log('It worked! Returned our IP:' , ip);
  //sends our IP info to the API to get our Lat/Long
  fetchCoordsByIP(ip, (err, coords) => {
    if (err) {
      console.log("It didn't convert our IP to Lat/Long!", err);
      return;
    }
    console.log("SUCCESS! It returned out Lat/Long" , coords, typeof coords);
    //sends our coordinates to the API to get the ISS data
    fetchISSFlyOverTimes(coords,(err, issData) => {
      if (err) {
        console.log("Couldnt get our ISS data: ", err);
        return;
      }
      console.log(`We got our flyover data from our API`, issData);
    });
  });
});