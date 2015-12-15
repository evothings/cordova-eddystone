// File: evothings-base.js
//
// Set up definitions needed by Eddystone JavaScript library.
//

// Global holding everything.
window.evothings = window.evothings || {};

// Define an empty No Operation function. This function is called
// in place of async script loading, since we build a single merged file.
// See the build script buildEddystonePlauginJS.rb which is where
// async loading gets replaced by this function.
evothings.__NOOP_FUN__ = function() {};
