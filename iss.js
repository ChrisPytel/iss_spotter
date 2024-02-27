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

module.exports = { fetchMyIP };