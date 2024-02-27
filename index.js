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
        console.log("Couldnt get iss Info", err);
        return;
      }
      console.log(`we got data`, issData);
    });

  });
});


