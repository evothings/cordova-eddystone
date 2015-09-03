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

    cordova plugin add https://github.com/evothings/cordova-eddystone

Add others plugins (console makes console.log direct output to the log in Xcode or adb logcat, whitelist is needed to access data from the web):

    cordova plugin add cordova-plugin-console
    cordova plugin add cordova-plugin-whitelist

Empty the www folder of the Cordova project and drop in a copy of the example [index.html](example/index.html) file, the result should look like this:

    www
      index.html

Add platforms (Android and/or iOS):

    cordova platform add android
    cordova platform add ios

Build:

    cordova build

Run the app by deploying it to a mobile device.

### Documentation

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

Format:

    evothings.eddystone.stopScan()

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

### Plugin implementation details

The Eddystone plugin is implemented on top the the [Cordova BLE](https://github.com/evothings/cordova-ble) plugin.

The JavaScript code for the plugin is found in file [eddystone-plugin.js](js/eddystone-plugin.js). This file is generated by the Ruby script [buildEddystonePluginJS.rb](buildEddystonePluginJS.rb).

The JavaScript source files for the plugin are found in the [evothings-examples](https://github.com/evothings/evothings-examples/tree/master/resources/libs/evothings) repo. If you would wish to run buildEddystonePluginJS.rb, you need to first clone evothings-examples next to the cordova-eddystone folder.

Do not contribute code directly to eddystone-plugin.js, but rather to the source files in evothings-examples.

It should be noted that it is fully possible to use the Evothings Eddystone libraries without using this plugin. Just add the [Cordova BLE](https://github.com/evothings/cordova-ble) plugin, and include the Eddystone library in index.html, as shown in the [Eddystone Scan](https://github.com/evothings/evothings-examples/blob/master/examples/eddystone-scan/index.html) example app. However, when you use the Eddystone plugin, the required JavaScript libraries are automatically included when you include cordova.js.

### Download Evothings Studio

Explore the world of rapid development of mobile IoT apps! [Download Evothings Studio now](http://evothings.com/download/) - it is easy and fun to get started!
