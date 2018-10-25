const HID = require('node-hid');
const usb = require('usb');

const DymoScale = function dymoScale() {
  const vid = 0x0922; // 0x922 dymo 10kg
  const pid = 0x8009; // 0x8003 dymo 10 kg
  let msg = '';


  usb.on('attach', (devicex) => {
    if (devicex.deviceDescriptor.idVendor === vid && devicex.deviceDescriptor.idProduct === pid) {
      msg = 'scale ON';
      console.log(msg);

      this.weight = 0;
      this.error = null;


      this.device = (function findDevice() {
        if (!this.deviceHandle) {
          console.log('running');
          const devices = HID.devices().filter(x => x.manufacturer === 'DYMO');

          if (devices.length > 0) {
            console.log('length');
            this.deviceHandle = new HID.HID(devices[0].path);
          }
        }
        return this.deviceHandle;
      }());

      this.device.on('data', ([,,,, weight]) => {
        this.weight = weight;
        console.log(this.weight);
      });

      this.device.on('error', (error) => {
        console.log(error);
        this.error = error;
      });

      this.read = function callbackFunc(callback) {
        callback(this.error, { value: this.weight });
      };
    } // if devicex
  });// usb on

  usb.on('detach', (devicex) => {
    if (devicex.deviceDescriptor.idVendor === vid && devicex.deviceDescriptor.idProduct === pid) {
      msg = 'Scale OFF';
      console.log(msg);
    }
  });
};


module.exports = new DymoScale();

/* this.weight = 0;
    this.error = null;
    this.device = (function findDevice() {
      if (!this.deviceHandle) {
        const devices = HID.devices().filter(x => x.manufacturer === 'DYMO');

        if (devices.length > 0) {
          this.deviceHandle = new HID.HID(devices[0].path);
        }
      }
      return this.deviceHandle;
    }());


    this.device.on('data', ([,,,, weight]) => {
      this.weight = weight;
      console.log(this.weight);
    });

    this.device.on('error', (error) => {
      this.error = error;
    });


    this.read = function callbackFunc(callback) {
      callback(this.error, { value: this.weight });
    };
  }); */
