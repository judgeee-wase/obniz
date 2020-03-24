"use strict";
/**
 * @packageDocumentation
 * @module Parts.uPRISM
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ObnizPartsBleInterface_1 = __importDefault(require("../../../obniz/ObnizPartsBleInterface"));
class uPRISM {
    constructor(peripheral) {
        this.readIndex = -1;
        this.accelRange = 1024;
        this._uuids = {
            service: "a587905b-ac98-4cb1-8b1d-5e22ae747d17",
            settingEnableChar: "51bc99bd-b22e-4ff5-807e-b641d21af060",
            notifyChar: "0d6fcf18-d935-49d1-836d-384c7b857b83",
        };
        if (peripheral === null) {
            throw new Error("peripheral is null");
        }
        if (peripheral && !uPRISM.isDevice(peripheral)) {
            throw new Error("peripheral is not uPRISM");
        }
        this.periperal = peripheral;
    }
    static info() {
        return {
            name: "uPRISM",
        };
    }
    static isDevice(peripheral) {
        var _a;
        return ((_a = peripheral.localName) === null || _a === void 0 ? void 0 : _a.indexOf("uPrism_")) === 0;
    }
    async connectWait() {
        if (!this.periperal) {
            throw new Error("peripheral is not uPRISM");
        }
        if (!this.periperal.connected) {
            await this.periperal.connectWait();
        }
    }
    async disconnectWait() {
        if (this.periperal && this.periperal.connected) {
            await this.periperal.disconnectWait();
        }
    }
    setAccelRange(range) {
        switch (range) {
            case "2g":
                this.accelRange = 1024;
                break;
            case "4g":
                this.accelRange = 512;
                break;
            case "8g":
                this.accelRange = 256;
                break;
            case "16g":
                this.accelRange = 128;
                break;
        }
    }
    async startNotifyWait() {
        if (!this.periperal || !this.periperal.connected) {
            throw new Error("peripheral not connected uPRISM");
        }
        const rc = this.periperal.getService(this._uuids.service).getCharacteristic(this._uuids.settingEnableChar);
        await rc.writeWait([0x04, 0x03, 0x01]);
        const c = this.periperal.getService(this._uuids.service).getCharacteristic(this._uuids.notifyChar);
        await c.registerNotifyWait((data) => {
            if (data[1] !== 0x14) {
                return;
            }
            if (data[0] === 0xb1) {
                this.readIndex = data[19];
                this.readData = {
                    acceleration: {
                        x: ObnizPartsBleInterface_1.default.signed16FromBinary(data[3], data[2]) / this.accelRange,
                        y: ObnizPartsBleInterface_1.default.signed16FromBinary(data[5], data[4]) / this.accelRange,
                        z: ObnizPartsBleInterface_1.default.signed16FromBinary(data[7], data[6]) / this.accelRange,
                    },
                    geomagnetic: {
                        x: ObnizPartsBleInterface_1.default.signed16FromBinary(data[9], data[8]) / 16,
                        y: ObnizPartsBleInterface_1.default.signed16FromBinary(data[11], data[10]) / 16,
                        z: ObnizPartsBleInterface_1.default.signed16FromBinary(data[13], data[12]) / 16,
                    },
                    time: {
                        year: 0,
                        month: 0,
                        day: 0,
                        hour: data[18],
                        minute: data[17],
                        second: data[16],
                        micro_second: (data[15] << 8) | data[14],
                    },
                    index: data[19],
                    temperature: 0,
                    humidity: 0,
                    ambient_light: 0,
                    uvi: 0,
                    pressure: 0,
                };
            }
            else if (data[0] === 0xb2) {
                if (this.readIndex === data[19] && this.readData) {
                    this.readData.temperature = ObnizPartsBleInterface_1.default.signed16FromBinary(data[3], data[2]) / 100;
                    this.readData.humidity = ((data[5] << 8) | data[4]) / 100;
                    this.readData.ambient_light = ((data[8] << 16) | (data[7] << 8) | data[6]) / 128;
                    this.readData.uvi = data[9] / 16;
                    this.readData.pressure = (data[13] << 16) | (data[12] << 8) | data[11];
                    this.readData.time.day = data[16];
                    this.readData.time.month = data[17];
                    this.readData.time.year = data[18];
                    if (this.onNotify) {
                        this.onNotify(this.readData);
                    }
                    // const r = this.readData;
                    // console.log(
                    //   `accel x:${r.acceleration.x} y:${r.acceleration.y} z:${r.acceleration.z}\n` +
                    //     `geo x:${r.geomagnetic.x} y:${r.geomagnetic.y} z:${r.geomagnetic.z}\n` +
                    //     `temp:${r.temperature}℃ humid:${r.humidity}% light:${r.ambient_light}lx pressure:${r.pressure}Pa UV index:${r.uvi} index:${r.index}\n` +
                    //     `date ${r.time.year}/${r.time.month}/${r.time.day} ${r.time.hour}:${r.time.minute}:${r.time.second}:${r.time.micro_second}`,
                    // );
                }
            }
        });
    }
    async stopNotifyWait() {
        if (!(this.periperal && this.periperal.connected)) {
            return;
        }
        const rc = this.periperal.getService(this._uuids.service).getCharacteristic(this._uuids.settingEnableChar);
        await rc.writeWait([0x04, 0x03, 0x00]);
        const c = this.periperal.getService(this._uuids.service).getCharacteristic(this._uuids.notifyChar);
        await c.unregisterNotifyWait();
    }
}
exports.default = uPRISM;

//# sourceMappingURL=index.js.map
