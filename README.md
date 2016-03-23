## Cordova/PhoneGap Eddystone Plugin

This is a Cordova plugin for Eddystone Beacons on Android and iOS. Use this plugin to scan for Eddystone beacons from your mobile application.

![Eddystone Lighthouse Workflow](https://evomedia.evothings.com/2015/07/Eddystone_Lighthouse.jpg)

### Use Evothings Studio for fast and easy Eddystone mobile app development

Evothings Studio is a rapid development tool for mobile IoT apps. It is fully compatible with Apache Cordova and PhoneGap.

With Evothings Studio the edit/run turn-around cycle is just a second or two, which is much faster compared to the traditional method of rebuilding the Cordova project for each update.

[![Evothings Studio](https://evomedia.evothings.com/2015/02/workbench-client-evothings.jpg)](http://evothings.com)

### Getting started

Create a Cordova project (replace folder, domain and app name with your own names):

    cordova create appfolder com.mydomain.myeddystoneapp Eddystone

Go to the project folder:

    cd appfolder

Add the Eddystone plugin:

    cordova plugin add cordova-plugin-eddystone

Add others plugins you find useful, such as cordova-plugin-console, which makes console.log direct output to the log in Xcode or adb logcat:

    cordova plugin add cordova-plugin-console

Empty the www folder of the Cordova project and drop in a copy of the example [index.html](example/index.html) file, the result should look like this:

    www
      index.html

Add platforms (Android and/or iOS):

    cordova platform add android
    cordova platform add ios

Build:

    cordova build

Run the app by deploying it to a mobile device.

### Background notifications

For displaying notifications when the app is running in the background, use the plugin [de.appplant.cordova.plugin.local-notification](https://github.com/katzer/cordova-plugin-local-notifications):

    cordova plugin add de.appplant.cordova.plugin.local-notification

### Use the plugin or the library?

The Eddystone library is built on top of the Cordova BLE plugin. The Eddystone plugin packages the BLE plugin and the required JavaScript libraries into one package for convenience.

It can however be more flexible to use the Eddystone library on top of the BLE plugin, and include the libraries yourself. This is how the Eddystone example apps shipped with Evothings Studio work. This makes it possible to modify the Eddystone code on-the-fly, the library files are not "locked in" to a plugin.

To use Eddystone libraries directly, use Evothings Viewer or build a custom Cordova app and add the the [Cordova BLE](https://github.com/evothings/cordova-ble) plugin. Then include `libs/evothings/eddystone/eddystone.js` in `index.html`, as shown in the [Eddystone Scan](https://github.com/evothings/evothings-examples/blob/master/generated/examples/eddystone-scan/index.html) example app. The actual library files are in the folder [libs](https://github.com/evothings/evothings-examples/tree/master/generated/examples/eddystone-scan), copy this folder to the Cordova `www` directory.

### Documentation

[Generated documentation](https://evothings.com/doc/lib-doc/evothings.eddystone.html) is found at the Evothings documentation site.

Below follows an overview of the functions and data strutures in the Eddystone library.

#### evothings.eddystone.startScan

Starts scanning for Eddystone devices. Found devices and errors will be reported to the supplied callbacks.

successCallback is a function that is called repeatedly when a device is found. Typically the same device is reported multiple times. The interval will depend of the advertisement interval of the beacon, among other things.

startScan will keep scanning until you call stopScan().

To conserve energy, call stopScan() as soon as you've found the device you're looking for. Calling this function while scanning is in progress will produce an error.

Format:

    evothings.eddystone.startScan(successCallback, errorCallback)

Format for successCallback (beacon is an object that represents the found device, see description of EddystoneDevice below):

    successCallback({EddystoneDevice} beacon)

Format for errorCallback (error is a string value):

    errorCallback({string} error)

#### EddystoneDevice

Object representing an Eddystone BLE device. Inherits from evothings.easyble.EasyBLEDevice. Note that the Eddystone specific object properties are optional, they may be missing from the object (give value null when accessed). Property values are filled in as different Eddystone frame types broadcasted from the beacon are detected.

The following are properties relevant for Eddystone beacons:

* {string} url - An Internet URL.
* {number} txPower - A signed integer, the signal strength in decibels, factory-measured at a range of 0 meters.
* {Uint8Array} nid - 10-byte namespace ID.
* {Uint8Array} bid - 6-byte beacon ID.
* {number} voltage - Device's battery voltage, in millivolts, or 0 (zero) if device is not battery-powered.
* {number} temperature - Device's ambient temperature in 256:ths of degrees Celcius, or 0x8000 if device has no thermometer.
* {number} adv_cnt - Count of advertisement frames sent since device's startup.
* {number} dsec_cnt - Time since device's startup, in deci-seconds (10 units equals 1 second).
* @property {number} rssi - Received signal strength indicator (RSSI), a negative integer reporting the signal strength in decibels. May have the value of 127, which means undefined RSSI value.

Other properties that may be of interest:

* @property {string} address - Uniquely identifies the device. The format of the address depends on the host platform. On Android this is the MAC address of the device, on iOS it is a temporary UUID.
* @property {string} name - The advertised BLE device name, or null.

#### evothings.eddystone.stopScan

Stops scanning for Eddystone devices.

Example:

    evothings.eddystone.stopScan()

#### evothings.eddystone.calculateAccuracy

To find the approximate distance in meters from the beacon, use function calculateAccuracy:

    var distance = evothings.eddystone.calculateAccuracy(
        beacon.txPower, beacon.rssi)

Note that beacon.txPower and beacon.rssi many be undefined, in which case calculateAccuracy returns null. This happens before txPower and rssi values have been reported by the beacon.

### Quick tutorial

Here is a quick guide to how to use the Eddystone plugin.

#### Scan for beacons

This is how to scan for beacons:

    function foundBeacon(beacon)
    {
       // Note that beacon.url will be null until the URL
       // has been received. Also note that not all Eddystone
       // beacons broadcast URLs, they may send UIDs only.
       console.log('Found beacon: ' + beacon.url)
    }

    function scanError(error)
    {
       console.log('Eddystone scan error: ' + error)
    }

    evothings.eddystone.startScan(foundBeacon, scanError)

Alternative syntax:

    evothings.eddystone.startScan(
        function(beacon)
        {
            console.log('Found beacon: ' + beacon.url)
        },
        function(error)
        {
            console.log('Eddystone scan error: ' + error)
        })

#### Display beacon object

This will log all device properties:

    function foundBeacon(beacon)
    {
        console.log(JSON.stringify(beacon))
    }

#### Stop scanning for beacons

    evothings.eddystone.stopScan()

### Example code

There is an example app bundled with the plugin, see file [index.html](example/index.html) in the examples folder.

### Plugin details

The Eddystone plugin is implemented on top the the [Cordova BLE](https://github.com/evothings/cordova-ble) plugin.

The JavaScript code for the plugin is found in file [eddystone-plugin.js](js/eddystone-plugin.js). This file is generated by the Ruby script [buildEddystonePluginJS.rb](buildEddystonePluginJS.rb).

The JavaScript source files for the plugin are found in the [evothings-examples](https://github.com/evothings/evothings-libraries/tree/master/libs/evothings) repo. If you would wish to run buildEddystonePluginJS.rb yourself, you need to first clone evothings-libraries next to the cordova-eddystone folder.

Do not contribute code directly to eddystone-plugin.js, but rather to the source files in evothings-libraries.

### Download Evothings Studio

Explore the world of rapid development of mobile IoT apps! [Download Evothings Studio now](http://evothings.com/download/) - it is easy and fun to get started!
