// iss.js
/**
 * Makes a single API request to retrieve the lat/lng for a given IPv4 address.
 * Input:
 *   - The ip (ipv4) address (string)
 *   - A callback (to pass back an error or the lat/lng object)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The lat and lng as an object (null if error).
 *      Example: { latitude: '49.27670', longitude: '-123.13000' }
 */

const request = require('request');


const fetchMyIP = function(callback) {
  // use request to fetch IP address from JSON API
  request(`https://api.ipify.org?format=json`, (err, response, body) =>{
    console.log(`Code is: `, response.statusCode);

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
  console.log(`Checking IPstring`, ipAdress);
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
      callback(null, coords); //return no error and coordinates
    }
  });
};

const fetchISSFlyOverTimes  = function(coordinates, callback) {
  const issDataLink = `https://iss-flyover.herokuapp.com/json/?lat=&lon=55.43333.8`;
  // const issDataLink = `https://iss-flyover.herokuapp.com/json/?lat=${coordinates.latitude}&lon=${coordinates.longitude}`;
  console.log("Our working link for ISS data is", issDataLink);

  request(issDataLink, (err, response, body) =>{
    // console.log(`error code:`,response.statusCode);
    if (err){
      return callback (err,null);
    }
    else if(response.statusCode !== 200){
      const msg = `Status Code ${response.statusCode} when fetching ISS Flyoverdata.\nResponse: ${body}`;
      callback(Error(msg), null);
      return;
    }
    const deSerialObj = JSON.parse(body);
    if (!deSerialObj.response){
      const message = `Success status was ${deSerialObj.success}. Server message says: ${deSerialObj.message} when fetching for IP ${deSerialObj.ip}`;
      callback(Error(message), null);
    }


    else{
      console.log(deSerialObj.response);
      callback (null, flyovers)

    }



    
    



  });



};


module.exports = {
  fetchMyIP,
  fetchCoordsByIP,
  fetchISSFlyOverTimes

};