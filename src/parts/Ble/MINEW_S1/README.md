# MINEW_S1
Temperature / Humidity beacon made byShenzhen Minew Technologies Co.
It is necessary to set the inkjet output in advance using the dedicated application.

It only supports HT sensor / information　SLOT.

For BLE devices, use `isDevice` instead of` wired`


## isDevice(peripheral)

Check whether it is MINEW_S1 based on the advertisement information

Return true if advertisement is HT sensor / information　SLOT.
iBeacon / UID / URL / TLM SLOT are not supported, and return false.

```javascript
// Javascript Example
await obniz.ble.initWait();
const MINEW_S1 = Obniz.getPartsClass("MINEW_S1");
obniz.ble.scan.start();
obniz.ble.scan.onfind = async (peripheral) => {
  if (MINEW_S1.isDevice(peripheral)) {
    console.log("device find");
  }
};

```


## getHTData()

Get temperature and humidity data based on the advertisement information.
Returns null for different SLOT advertisement information.

```javascript
// Javascript Example
await obniz.ble.initWait();
const MINEW_S1 = Obniz.getPartsClass("MINEW_S1");
obniz.ble.scan.start();
obniz.ble.scan.onfind = (peripheral) => {
  if (MINEW_S1.isDevice(peripheral)) {
    const data = MINEW_S1.getHTData(peripheral);
    console.log(data); 
  }
};

```

Return data format is below.

```javascript
{
  frameType: number;
  versionNumber: number;
  batteryLevel: number;
  temperature: number;
  humidity: number;
  macAddress: string;
}
```



## getHTData()

Get device data based on the advertisement information.
Returns null for different SLOT advertisement information.

```javascript
// Javascript Example
await obniz.ble.initWait();
const MINEW_S1 = Obniz.getPartsClass("MINEW_S1");
obniz.ble.scan.start();
obniz.ble.scan.onfind = (peripheral) => {
  if (MINEW_S1.isDevice(peripheral)) {
    const data = MINEW_S1.getInfoData(peripheral);
    console.log(data); 
  }
};

```

Return data format is below.

```javascript
{
  frameType: number;
  versionNumber: number;
  batteryLevel: number;
  macAddress: string;
  name: string;
}
```
