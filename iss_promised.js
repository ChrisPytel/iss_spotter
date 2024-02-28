// iss_promised.js - refactored for promises

const request = require('request-promise-native');


//accesses an API that determines my local IP adress
const fetchMyIP = function() { 
  //immediately returns the body of our API data  
  return request(`https://api.ipify.org?format=json`);
};

//passes our IP into an API that retrieves location data
const fetchCoordsByIP = function(ipAdress) {
  const ipObject = JSON.parse(ipAdress).ip; //selects only the ip and deserializes it to an obj
  console.log(`Checking our parsed ipObj:`, ipObject);
  return request(`http://ipwho.is/${ipObject}`);
};

const fetchISSFlyOverTimes = function(body) {  
  // console.log(`iss body`, body);
  const { latitude, longitude } = JSON.parse(body); //deserializes lat/long and stores them as numbers
  //Reminder for later: ^ Object destructuring lets you extract properties from an object and assign them to variables with the same name
  console.log(`Lat/Long to pass along to flyoverapi are:`, latitude ,`and`,  longitude);
  return request(`https://iss-flyover.herokuapp.com/json/?lat=${latitude}&lon=${longitude}`);
};


const nextISSTimesForMyLocation = function() {
    fetchMyIP() //runs fetchMyIP and returns its value, passing to the next promise
    .then(fetchCoordsByIP) // runs fetchCoordsByIP and returns its value, passing to the next promise
    .then(fetchISSFlyOverTimes) // runs fetchISSFlyOverTimes and returns its value, passing to the next promise
    .then((body) => {      
      console.log(`Our final data is:`, body);
      // If all of our APIS are successful and our event chain runs correctly
      // Take our pass times and print them

      const effect = {
        reset: "\x1b[0m",
        cyan: "\x1b[36m",
    };

      const passTimes = JSON.parse(body).response;
      for (const pass of passTimes) {
        const datetime = new Date(0);
        datetime.setUTCSeconds(pass.risetime);
        const duration = pass.duration;
        console.log(`\nKeep an eye on the Sky!\nThe ISS will pass overhead on ` + effect.cyan + `${datetime} for` + effect.reset + ` ${duration} seconds!`);
      }
    })
    .catch(error => console.log(`\n!!! Something did not properly, check error log below !!!\n\n${error}`));  
};

module.exports = { 
  fetchMyIP,
  fetchCoordsByIP,
  fetchISSFlyOverTimes,  
  nextISSTimesForMyLocation 
}; //exports our modules for communication across files