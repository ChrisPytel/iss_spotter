/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */

const request = require('request');


const fetchMyIP = function(callback) {
  // use request to fetch IP address from JSON API
  request(`https://api.ipify.org?format=json`, (err, response, body) =>{
    console.log(`Code is: `, response.statusCode);

    if (err) {
      return callback(error, null);      
    }         
    if (response.statusCode !== 200) {  // if non-200 status, assume server error
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
    return;
    }
    else {
      const deSerialObj = JSON.parse(body).ip;
      callback(null, deSerialObj);
    }
  });
};



const fetchCoordsByIP = function (string, callback){
  console.log(`Checking IPstring`, string);
  request(`http://ipwho.is/5`, (err, response, body) =>{
    console.log(`Code for ipwho is: `, response.statusCode);
    console.log(`body is`, body);
    if (err) {
      return callback(error, null);      
    }
    if (response.statusCode !== 200) {  // if non-200 status, assume server error
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
    return;
    }
    // if we get a response from server which is 200 but doenst return a proper IP
    const deSerialObj = JSON.parse(body);    
    if (!deSerialObj.success) { // check if "success" is true or not, if returns a falsey conclusion, execute this code
      const message = `Success status was ${deSerialObj.success}. Server message says: ${deSerialObj.message} when fetching for IP ${deSerialObj.ip}`;
      callback(Error(message), null);
      return;
    }    
    //If it DOES return a proper ip
    else {
      const coords = {
        latitude: deSerialObj.latitude,
        longitude: deSerialObj.longitude
      }
      callback(null, coords); //return no error and coordinates
    }
  });



}


module.exports = { 
  fetchMyIP,
  fetchCoordsByIP
 };