// index2.js - For starting our promise callback event chain

const { nextISSTimesForMyLocation, fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes} = require('./iss_promised');

nextISSTimesForMyLocation(); //begin our event chain