# iBS01RG

INGICS社製の加速度センサーです。

Support device

- iBS01RG

![](image.jpg)


## getPartsClass(name)

```javascript
// Javascript Example
const IBS01RG = Obniz.getPartsClass('iBS01RG');
```

## isDevice(BleRemotePeripheral)

デバイスを発見した場合、trueを返します。

```javascript
// Javascript Example
const IBS01RG = Obniz.getPartsClass('iBS01RG');
await obniz.ble.initWait();
obniz.ble.scan.start(null, { duplicate: true, duration: null });
obniz.ble.scan.onfind = (p) => {
    if (IBS01RG.isDevice(p)) {
        let data = IBS01RG.getData(p);
        console.log(data);
    }
};
```

## getData(BleRemotePeripheral)

発見した場合にデバイスの情報を返します。発見できなかった場合にはNullを返します。

- battery : 電池電圧
- button : ボタンを押すとtrue
- active : 動きがあるとtrue
- acceleration :  x,y,z軸の加速度の配列

```javascript
// Javascript Example
const IBS01RG = Obniz.getPartsClass('iBS01RG');
await obniz.ble.initWait();
obniz.ble.scan.start(null, { duplicate: true, duration: null });
obniz.ble.scan.onfind = (p) => {
    if (IBS01RG.isDevice(p)) {
        let data = IBS01RG.getData(p);
        console.log(data);
    }
};
```

