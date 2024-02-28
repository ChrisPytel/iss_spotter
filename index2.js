// index2.js

const { nextISSTimesForMyLocation } = require('./iss_promised');

nextISSTimesForMyLocation((error, flyoverData) => {
  if (error) {
    return console.log("Error Details:\n", error);
  }

  // If all of our APIS are successful and our event chain runs correctly
  // Take our pass times and print them
  for (const pass of flyoverData) {
    const datetime = new Date(0);
    datetime.setUTCSeconds(pass.risetime);
    const duration = pass.duration;
    console.log(`Our next flyover is ${datetime} for ${duration} seconds`);
  }
});
