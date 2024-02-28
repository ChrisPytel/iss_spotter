// iss_promised.js

const request = require('request-promise-native');


/* 
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

 */

const fetchMyIP = function() {
  return request('https://api.ipify.org?format=json');
};


const fetchCoordsByIP = function(body) {
  console.log("checking our ip:", body);
  const ip = JSON.parse(body).ip;
  console.log(ip);
  return request(`http://ipwho.is/${ip}`);
};


/* 
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
    } else if (deSerialObj.latitude || deSerialObj.longitude){  //If it DOES locate correct lat/long
      const coords = {
        latitude: deSerialObj.latitude,
        longitude: deSerialObj.longitude
      };
      console.log(`Our Lat/Long is`, coords);
      callback(null, coords); //return no error and proper coordinate data
    }
  });
};
 */


const fetchISSFlyOverTimes = function(body) {
  const { latitude, longitude } = JSON.parse(body);
  const url = `https://iss-flyover.herokuapp.com/json/?lat=${latitude}&lon=${longitude}`;
  return request(url);
};

/* 
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
 */

const nextISSTimesForMyLocation = function() {
    fetchMyIP()
    .then(fetchCoordsByIP)
    .then(fetchISSFlyOverTimes)
    .then((body) => {  
      const deSerialObj = JSON.parse(body);
      const flyoverData = deSerialObj.response;
      console.log(`we got our final data: `, flyoverData); 
      return flyoverData;
    })
    .catch((error) => {
      return error;
    });
  
};

module.exports = { nextISSTimesForMyLocation };