/**
 * @packageDocumentation
 * @module ObnizCore.Components.Ble.old
 */
import BleHelper from "./bleHelper";
import BleRemoteAttributeAbstract from "./bleRemoteAttributeAbstract";
/**
 * Deprecated class.
 * Please update obnizOS >= 3.0.0 and use [[ObnizCore.Components.Ble.Hci]]
 * @category Use as Central
 */
export default class BleRemoteDescriptor extends BleRemoteAttributeAbstract {
  public characteristic: any;
  public uuid: any;

  constructor(params: any) {
    super(params);
  }

  get parentName(): string | null {
    return "characteristic";
  }

  public read() {
    const obj: any = {
      ble: {
        read_descriptor: {
          address: this.characteristic.service.peripheral.address,
          service_uuid: BleHelper.uuidFilter(this.characteristic.service.uuid),
          characteristic_uuid: BleHelper.uuidFilter(this.characteristic.uuid),
          descriptor_uuid: BleHelper.uuidFilter(this.uuid),
        },
      },
    };
    this.characteristic.service.peripheral.Obniz.send(obj);
  }

  public write(array: any, needResponse: any) {
    if (needResponse === undefined) {
      needResponse = true;
    }
    const obj: any = {
      ble: {
        write_descriptor: {
          address: this.characteristic.service.peripheral.address,
          service_uuid: BleHelper.uuidFilter(this.characteristic.service.uuid),
          characteristic_uuid: BleHelper.uuidFilter(this.characteristic.uuid),
          descriptor_uuid: BleHelper.uuidFilter(this.uuid),
          data: array,
          needResponse,
        },
      },
    };
    this.characteristic.service.peripheral.Obniz.send(obj);
  }
}
