// index.js   runs our logic from iss.js and prints data from multiple APIs

const { nextISSTimesForMyLocation } = require('./iss');

nextISSTimesForMyLocation((error, passTimes) => {
  if (error) {
    return console.log("Error Details:\n", error);
  }

  // If all of our APIS are successful and our event chain runs correctly
  // Take our pass times and print them
  for (const pass of passTimes) {
    const datetime = new Date(0);
    datetime.setUTCSeconds(pass.risetime);
    const duration = pass.duration;
    console.log(`Our next flyover is ${datetime} for ${duration} seconds`);
  }
});