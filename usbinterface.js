const minimist = require('minimist')
const HID = require('node-hid');
const Max = require('max-api');

const path = require('path');
Max.post(`Loaded the usb-mapper ${path.basename(__filename)} script`);

// node-hid documentation available here
// https://github.com/node-hid/node-hid

// Get all devices available (usb enumeration)
const devices = HID.devices();

// Post to the max console
Max.post('devices:', devices);

// "Example to find a specific Device"
// "Logitech Dual Action"
// "Replace using your own device vendorId and productId"
deviceInfo = devices.find( function(d) {
  var isLogitechDualAction = d.vendorId===0x046D && d.productId===0xC216;
  return isLogitechDualAction && d.usagePage===0x0001 && d.usage===0x0004;
});

// If the device was found
if(deviceInfo) {
  var device = new HID.HID( deviceInfo.path );

  // setup listener for data
  device.on('data', function(data) {
    Max.post('data:', data);
  });

  // setup listener for errors
  device.on("error", function(error) {
    Max.post('error:', error);
  });

  // If the device was found, write something to it
  // https://github.com/node-hid/node-hid#writing-to-a-device
  device.write([0x00, 0x01, 0x01, 0x05, 0xff, 0xff]);
}