"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bleRemoteValueAttributeAbstract_1 = __importDefault(require("./bleRemoteValueAttributeAbstract"));
/**
 * @category Use as Central
 */
class BleRemoteDescriptor extends bleRemoteValueAttributeAbstract_1.default {
    constructor(params) {
        super(params);
    }
    /**
     * @ignore
     */
    get parentName() {
        return "characteristic";
    }
    /**
     * Read data from descriptor.
     *
     * The return value appears in the callback function [[onread]].
     *
     * ```javascript
     * // Javascript Example
     * await obniz.ble.initWait();
     * var target = {
     *   uuids: ["fff0"],
     * };
     * var peripheral = await obniz.ble.scan.startOneWait(target);
     * if(peripheral){
     *   await peripheral.connectWait();
     *   console.log("connected");
     *   await obniz.wait(1000);
     *
     *   peripheral.getService("FF00").getCharacteristic("FF01").read();
     *
     *   peripheral.getService("FF00").getCharacteristic("FF01").onread = (dataArray)=>{
     *   console.log(dataArray);
     *
     *   }
     * }
     * ```
     *
     */
    read() {
        this.characteristic.service.peripheral.obnizBle.centralBindings.readValue(this.characteristic.service.peripheral.address, this.characteristic.service.uuid, this.characteristic.uuid, this.uuid);
    }
    /**
     * Read data from descriptor.
     *
     * The return value appears in the callback function [[onread]].
     * If reading succeeds an Array with data will be returned.
     * It throws an error when failed.
     *
     * ```javascript
     * // Javascript Example
     * await obniz.ble.initWait();
     * var target = {
     *   uuids: ["fff0"],
     * };
     * var peripheral = await obniz.ble.scan.startOneWait(target);
     * if(peripheral){
     *   await peripheral.connectWait();
     *   console.log("connected");
     *   await obniz.wait(1000);
     *
     *   var dataArray = await peripheral.getService("FF00").getCharacteristic("FF01").readWait();
     *   console.log(dataArray);
     * }
     * ```
     *
     */
    readWait() {
        return super.readWait();
    }
    /**
     * This writes dataArray to descriptor.
     *
     * ```javascript
     * // Javascript Example
     *
     * await obniz.ble.initWait();
     * var target = {
     *   uuids: ["fff0"],
     * };
     * var peripheral = await obniz.ble.scan.startOneWait(target);
     * if(peripheral){
     *   await peripheral.connectWait();
     *   console.log("connected");
     *   await obniz.wait(1000);
     *
     *   var dataArray = [0x02, 0xFF];
     *   peripheral.getService("FF00").getCharacteristic("FF01").getDescriptor("2901").write(dataArray);
     * }
     * ```
     *
     * @param data
     */
    write(data) {
        this.characteristic.service.peripheral.obnizBle.centralBindings.writeValue(this.characteristic.service.peripheral.address, this.characteristic.service.uuid, this.characteristic.uuid, this.uuid, Buffer.from(data));
    }
    /**
     * This writes dataArray to descriptor.
     * It throws an error when failed.
     *
     * ```javascript
     * // Javascript Example
     *
     * await obniz.ble.initWait();
     * var target = {
     *   uuids: ["fff0"],
     * };
     * var peripheral = await obniz.ble.scan.startOneWait(target);
     * if(peripheral){
     *   await peripheral.connectWait();
     *   console.log("connected");
     *   await obniz.wait(1000);
     *
     *   var dataArray = [0x02, 0xFF];
     *   await peripheral.getService("FF00").getCharacteristic("FF01").getDescriptor("2901").writeWait(dataArray);
     *   console.log("write success");
     * }
     * ```
     *
     * @param data
     * @param needResponse
     */
    writeWait(data, needResponse) {
        return super.writeWait(data, needResponse);
    }
}
exports.default = BleRemoteDescriptor;

//# sourceMappingURL=bleRemoteDescriptor.js.map
