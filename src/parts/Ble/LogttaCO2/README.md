# Logtta CO2
Look for Logtta CO2 and get the data.

![](image.jpg)



## getPartsClass(name)

```javascript
// Javascript Example
const LOGTTA_CO2 = Obniz.getPartsClass('Logtta_CO2');
```

## isDevice(BleRemotePeripheral)

Returns true if a device was found.

```javascript
// Javascript Example
const LOGTTA_CO2 = Obniz.getPartsClass('Logtta_CO2');
await obniz.ble.initWait();
obniz.ble.scan.start(null, { duplicate: true, duration: null });
obniz.ble.scan.onfind = (p) => {
    if (LOGTTA_CO2.isDevice(p)) {
        console.log("find");
    }
};
```

## new Logtta_CO2(peripheral)

Create an instance based on the advertisement information received by BLE.

```javascript
// Javascript Example
const LOGTTA_CO2 = Obniz.getPartsClass('Logtta_CO2');
await obniz.ble.initWait();
obniz.ble.scan.start();
obniz.ble.scan.onfind = async (peripheral) => {
  if (LOGTTA_CO2.isDevice(peripheral) ) {
    console.log("device find");
    const device = new LOGTTA_CO2(peripheral);
  }
};

```


## [await]connectWait()

Connect to the device.

```javascript
// Javascript Example
const LOGTTA_CO2 = Obniz.getPartsClass('Logtta_CO2');
await obniz.ble.initWait();
obniz.ble.scan.start();
obniz.ble.scan.onfind = async (peripheral) => {
  if (LOGTTA_CO2.isDevice(peripheral)) {
    console.log("find");
    const device = new LOGTTA_CO2(peripheral);
    await device.connectWait();
    console.log("connected");
  }
};

```


## [await]disconnectWait()

Disonnect to the device.

```javascript
// Javascript Example
const LOGTTA_CO2 = Obniz.getPartsClass('Logtta_CO2');
await obniz.ble.initWait();
obniz.ble.scan.start();
obniz.ble.scan.onfind = async (peripheral) => {
  if (LOGTTA_CO2.isDevice(peripheral) ) {
    console.log("find");
    const device = new LOGTTA_CO2(peripheral);
    await device.connectWait();
    console.log("connected");
    await device.disconnectWait();
    console.log("disconnected");
  }
};

```


## onNotify =  function (data){}

When data is received, return the data in a callback function.

Called every time data comes from the device after starting `` startNotifyWait () ``.

```javascript
// Javascript Example
const LOGTTA_CO2 = Obniz.getPartsClass('Logtta_CO2');
await obniz.ble.initWait();
obniz.ble.scan.start();
obniz.ble.scan.onfind = async (peripheral) => {
  if (LOGTTA_CO2.isDevice(peripheral)) {
    console.log("find");
    const device = new LOGTTA_CO2(peripheral);
    await device.connectWait();
    console.log("connected");
        device.onNotify = (co2) => {
            console.log(`CO2 ${co2}ppm`);
        };
    device.startNotifyWait();
  }
};
```

## startNotifyWait()

Instructs to start sending sensor data.

```javascript
// Javascript Example
const LOGTTA_CO2 = Obniz.getPartsClass('Logtta_CO2');
await obniz.ble.initWait();
obniz.ble.scan.start();
obniz.ble.scan.onfind = async (peripheral) => {
  if (LOGTTA_CO2.isDevice(peripheral)) {
    console.log("find");
    const device = new LOGTTA_CO2(peripheral);
    await device.connectWait();
    console.log("connected");
    device.onNotify = (co2) => {
        console.log(`CO2 ${co2}ppm`);
    };
    device.startNotifyWait();
  }
};
```


## [await]getWait()
Get Data from device.

```javascript
// Javascript Example
const LOGTTA_CO2 = Obniz.getPartsClass('Logtta_CO2');
await obniz.ble.initWait();
obniz.ble.scan.start();
obniz.ble.scan.onfind = async (peripheral) => {
  if (LOGTTA_CO2.isDevice(peripheral)) {
    console.log("find");
    const device = new LOGTTA_CO2(peripheral);
    await device.connectWait();
    console.log("connected");
    
    const co2 = await device.getWait();
    console.log(`CO2 ${co2}ppm`);
  }
};
```
