// index.js
const { fetchMyIP } = require('./iss');
const { fetchCoordsByIP } = require('./iss');

fetchMyIP((error, ip) => {
  if (error) {
    console.log("It didn't work! Failed to get our IP" , error);
    return;
  }
  console.log('It worked! Returned our IP:' , ip);


  fetchCoordsByIP(ip, (err,data) => {
  if (err) {
    console.log("It didn't convert our IP to Lat/Long!", err);
    return;
  }
  else if (data) {
    console.log("SUCCESS! It returned out Lat/Long" , data, typeof data);
    return;
  }
  });
});


