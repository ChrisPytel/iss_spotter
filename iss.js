// iss.js

const request = require('request');

const fetchMyIP = function(callback) {
  // use request to fetch IP address from JSON API
  request(`https://api.ipify.org?format=json`, (err, response, body) =>{
    console.log(`Response code for fetching our IP is: `, response.statusCode);
    if (err) {
      return callback(err, null);
    }
    if (response.statusCode !== 200) {  // if non-200 status, assume server error
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    } else {
      const deSerialObj = JSON.parse(body).ip;
      callback(null, deSerialObj);
    }
  });
};


const fetchCoordsByIP = function(ipAdress, callback) {
  console.log(`Checking IPstring:`, ipAdress);
  request(`http://ipwho.is/${ipAdress}`, (err, response, body) =>{
    if (err) {
      return callback(err, null);
    }
    if (response.statusCode !== 200) {  // if non-200 status, assume server error
      const msg = `Status Code ${response.statusCode} when fetching IP.\nResponse: ${body}`;
      callback(Error(msg), null);
      return;
    }
    // if we get a response from server which is 200 but doenst return a proper IP
    const deSerialObj = JSON.parse(body);
    if (!deSerialObj.success) { // check if "success" is true or not, if returns a falsey conclusion, execute this code
      const message = `Success status was ${deSerialObj.success}.\nServer message says: ${deSerialObj.message} when fetching for IP ${deSerialObj.ip}`;
      callback(Error(message), null);
      return;
    } else {  //If it DOES return a proper ip
      const coords = {
        latitude: deSerialObj.latitude,
        longitude: deSerialObj.longitude
      };
      console.log(`Our Lat/Long is`, coords);
      callback(null, coords); //return no error and proper coordinate data
    }
  });
};

const fetchISSFlyOverTimes  = function(coordinates, callback) {
  // const issDataLink = `https://iss-flyover.herokuapp.com/json/?lat=&lon=55.43333.8`;
  const issDataLink = `https://iss-flyover.herokuapp.com/json/?lat=${coordinates.latitude}&lon=${coordinates.longitude}`;
  console.log("Our working link for ISS data is: \n", issDataLink);
  request(issDataLink, (err, response, body) =>{
    if (err){
      return callback (err,null);
    }
    else if(response.statusCode !== 200){
      const msg = `Status Code ${response.statusCode} when fetching ISS Flyoverdata.\nResponse: ${body}`;
      callback(Error(msg), null);
      return;
    }
    const deSerialObj = JSON.parse(body);
    const flyoverData = deSerialObj.response;
    callback(null, flyoverData);
  });
};

//nextISSTimesForMyLocation handles our event chain which was initiated in index.js
const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      console.log("It didn't work! Failed to get our IP");
      return callback(error, null);
    }
    fetchCoordsByIP(ip, (error, loc) => {
      if (error) {
        console.log("It didn't convert our IP to Lat/Long!");
        return callback(error, null);
      }
      fetchISSFlyOverTimes(loc, (error, nextPasses) => {
        if (error) {
          console.log("Couldnt get our ISS data");
          return callback(error, null);
        }
        callback(null, nextPasses);
      });
    });
  });
};


module.exports = {
  nextISSTimesForMyLocation
};  //exports our modules to communicate across files