"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @packageDocumentation
 *
 * @ignore
 */
// let debug = require('debug')('gap');
/**
 * @ignore
 */
const debug = () => { };
const events_1 = __importDefault(require("events"));
const hci_1 = __importDefault(require("../hci"));
/**
 * @ignore
 */
class Gap extends events_1.default.EventEmitter {
    constructor(hci) {
        super();
        this._hci = hci;
        this._scanState = null;
        this._scanFilterDuplicates = null;
        this._discoveries = {};
        this._hci.on("error", this.onHciError.bind(this));
        this._hci.on("leScanParametersSet", this.onHciLeScanParametersSet.bind(this));
        this._hci.on("leScanEnableSet", this.onHciLeScanEnableSet.bind(this));
        this._hci.on("leAdvertisingReport", this.onHciLeAdvertisingReport.bind(this));
        this._hci.on("leScanEnableSetCmd", this.onLeScanEnableSetCmd.bind(this));
        this._hci.on("leAdvertisingParametersSet", this.onHciLeAdvertisingParametersSet.bind(this));
        this._hci.on("leAdvertisingDataSet", this.onHciLeAdvertisingDataSet.bind(this));
        this._hci.on("leScanResponseDataSet", this.onHciLeScanResponseDataSet.bind(this));
        this._hci.on("leAdvertiseEnableSet", this.onHciLeAdvertiseEnableSet.bind(this));
    }
    startScanning(allowDuplicates, activeScan) {
        this._scanState = "starting";
        this._scanFilterDuplicates = !allowDuplicates;
        this._discoveries = {};
        // Always set scan parameters before scanning
        // https://www.bluetooth.org/docman/handlers/downloaddoc.ashx?doc_id=229737
        // p106 - p107
        this._hci.setScanEnabled(false, true);
        // console.log("scan enable false");
        this._hci.once("leScanEnableSet", (scanStopStatus) => {
            this._hci.setScanParameters(activeScan);
            this._hci.once("leScanParametersSet", (setParamStatus) => {
                setTimeout(() => {
                    this._hci.setScanEnabled(true, this._scanFilterDuplicates);
                }, 1000);
            });
        });
    }
    stopScanning() {
        this._scanState = "stopping";
        this._hci.setScanEnabled(false, true);
    }
    onHciLeScanParametersSet() { }
    // Called when receive an event "Command Complete" for "LE Set Scan Enable"
    onHciLeScanEnableSet(status) {
        // Check the status we got from the command complete function.
        if (status !== 0) {
            // If it is non-zero there was an error, and we should not change
            // our status as a result.
            return;
        }
        if (this._scanState === "starting") {
            this._scanState = "started";
            this.emit("scanStart", this._scanFilterDuplicates);
        }
        else if (this._scanState === "stopping") {
            this._scanState = "stopped";
            this.emit("scanStop");
        }
    }
    // Called when we see the actual command "LE Set Scan Enable"
    onLeScanEnableSetCmd(enable, filterDuplicates) {
        // Check to see if the new settings differ from what we expect.
        // If we are scanning, then a change happens if the new command stops
        // scanning or if duplicate filtering changes.
        // If we are not scanning, then a change happens if scanning was enabled.
        if (this._scanState === "starting" || this._scanState === "started") {
            if (!enable) {
                this.emit("scanStop");
            }
            else if (this._scanFilterDuplicates !== filterDuplicates) {
                this._scanFilterDuplicates = filterDuplicates;
                this.emit("scanStart", this._scanFilterDuplicates);
            }
        }
        else if ((this._scanState === "stopping" || this._scanState === "stopped") && enable) {
            // Someone started scanning on us.
            this.emit("scanStart", this._scanFilterDuplicates);
        }
    }
    onHciLeAdvertisingReport(status, type, address, addressType, eir, rssi) {
        const previouslyDiscovered = !!this._discoveries[address];
        const advertisement = previouslyDiscovered
            ? this._discoveries[address].advertisement
            : {
                localName: undefined,
                txPowerLevel: undefined,
                manufacturerData: undefined,
                serviceData: [],
                serviceUuids: [],
                solicitationServiceUuids: [],
                advertisementRaw: [],
                scanResponseRaw: [],
                raw: [],
            };
        let discoveryCount = previouslyDiscovered ? this._discoveries[address].count : 0;
        let hasScanResponse = previouslyDiscovered ? this._discoveries[address].hasScanResponse : false;
        if (type === 0x04) {
            hasScanResponse = true;
            if (eir.length > 0) {
                advertisement.scanResponseRaw = Array.from(eir);
            }
        }
        else {
            // reset service data every non-scan response event
            advertisement.serviceData = [];
            advertisement.serviceUuids = [];
            advertisement.serviceSolicitationUuids = [];
            if (eir.length > 0) {
                advertisement.advertisementRaw = Array.from(eir);
            }
        }
        discoveryCount++;
        let i = 0;
        let j = 0;
        let serviceUuid = null;
        let serviceSolicitationUuid = null;
        while (i + 1 < eir.length) {
            const length = eir.readUInt8(i);
            if (length < 1) {
                debug("invalid EIR data, length = " + length);
                break;
            }
            const eirType = eir.readUInt8(i + 1); // https://www.bluetooth.org/en-us/specification/assigned-numbers/generic-access-profile
            if (i + length + 1 > eir.length) {
                debug("invalid EIR data, out of range of buffer length");
                break;
            }
            const bytes = eir.slice(i + 2).slice(0, length - 1);
            switch (eirType) {
                case 0x02: // Incomplete List of 16-bit Service Class UUID
                case 0x03: // Complete List of 16-bit Service Class UUIDs
                    for (j = 0; j < bytes.length; j += 2) {
                        serviceUuid = bytes.readUInt16LE(j).toString(16);
                        if (advertisement.serviceUuids.indexOf(serviceUuid) === -1) {
                            advertisement.serviceUuids.push(serviceUuid);
                        }
                    }
                    break;
                case 0x06: // Incomplete List of 128-bit Service Class UUIDs
                case 0x07: // Complete List of 128-bit Service Class UUIDs
                    for (j = 0; j < bytes.length; j += 16) {
                        serviceUuid = bytes
                            .slice(j, j + 16)
                            .toString("hex")
                            .match(/.{1,2}/g)
                            .reverse()
                            .join("");
                        if (advertisement.serviceUuids.indexOf(serviceUuid) === -1) {
                            advertisement.serviceUuids.push(serviceUuid);
                        }
                    }
                    break;
                case 0x08: // Shortened Local Name
                case 0x09: // Complete Local Name
                    advertisement.localName = bytes.toString("utf8");
                    break;
                case 0x0a: {
                    // Tx Power Level
                    advertisement.txPowerLevel = bytes.readInt8(0);
                    break;
                }
                case 0x14: {
                    // List of 16 bit solicitation UUIDs
                    for (j = 0; j < bytes.length; j += 2) {
                        serviceSolicitationUuid = bytes.readUInt16LE(j).toString(16);
                        if (advertisement.serviceSolicitationUuids.indexOf(serviceSolicitationUuid) === -1) {
                            advertisement.serviceSolicitationUuids.push(serviceSolicitationUuid);
                        }
                    }
                    break;
                }
                case 0x15: {
                    // List of 128 bit solicitation UUIDs
                    for (j = 0; j < bytes.length; j += 16) {
                        serviceSolicitationUuid = bytes
                            .slice(j, j + 16)
                            .toString("hex")
                            .match(/.{1,2}/g)
                            .reverse()
                            .join("");
                        if (advertisement.serviceSolicitationUuids.indexOf(serviceSolicitationUuid) === -1) {
                            advertisement.serviceSolicitationUuids.push(serviceSolicitationUuid);
                        }
                    }
                    break;
                }
                case 0x16: {
                    // 16-bit Service Data, there can be multiple occurences
                    const serviceDataUuid = bytes
                        .slice(0, 2)
                        .toString("hex")
                        .match(/.{1,2}/g)
                        .reverse()
                        .join("");
                    const serviceData = bytes.slice(2, bytes.length);
                    advertisement.serviceData.push({
                        uuid: serviceDataUuid,
                        data: serviceData,
                    });
                    break;
                }
                case 0x20: {
                    // 32-bit Service Data, there can be multiple occurences
                    const serviceData32Uuid = bytes
                        .slice(0, 4)
                        .toString("hex")
                        .match(/.{1,2}/g)
                        .reverse()
                        .join("");
                    const serviceData32 = bytes.slice(4, bytes.length);
                    advertisement.serviceData.push({
                        uuid: serviceData32Uuid,
                        data: serviceData32,
                    });
                    break;
                }
                case 0x21: {
                    // 128-bit Service Data, there can be multiple occurences
                    const serviceData128Uuid = bytes
                        .slice(0, 16)
                        .toString("hex")
                        .match(/.{1,2}/g)
                        .reverse()
                        .join("");
                    const serviceData128 = bytes.slice(16, bytes.length);
                    advertisement.serviceData.push({
                        uuid: serviceData128Uuid,
                        data: serviceData128,
                    });
                    break;
                }
                case 0x1f: // List of 32 bit solicitation UUIDs
                    for (j = 0; j < bytes.length; j += 4) {
                        serviceSolicitationUuid = bytes.readUInt32LE(j).toString(16);
                        if (advertisement.serviceSolicitationUuids.indexOf(serviceSolicitationUuid) === -1) {
                            advertisement.serviceSolicitationUuids.push(serviceSolicitationUuid);
                        }
                    }
                    break;
                case 0xff: // Manufacturer Specific Data
                    advertisement.manufacturerData = bytes;
                    break;
            }
            i += length + 1;
        }
        debug("advertisement = " + JSON.stringify(advertisement, null, 0));
        const connectable = type === 0x04 && previouslyDiscovered ? this._discoveries[address].connectable : type !== 0x03;
        this._discoveries[address] = {
            address,
            addressType,
            connectable,
            advertisement,
            rssi,
            count: discoveryCount,
            hasScanResponse,
        };
        this.emit("discover", status, address, addressType, connectable, advertisement, rssi);
    }
    startAdvertising(name, serviceUuids) {
        debug("startAdvertising: name = " + name + ", serviceUuids = " + JSON.stringify(serviceUuids, null, 2));
        let advertisementDataLength = 3;
        let scanDataLength = 0;
        const serviceUuids16bit = [];
        const serviceUuids128bit = [];
        let i = 0;
        if (name && name.length) {
            scanDataLength += 2 + name.length;
        }
        if (serviceUuids && serviceUuids.length) {
            for (i = 0; i < serviceUuids.length; i++) {
                const serviceUuid = Buffer.from(serviceUuids[i]
                    .match(/.{1,2}/g)
                    .reverse()
                    .join(""), "hex");
                if (serviceUuid.length === 2) {
                    serviceUuids16bit.push(serviceUuid);
                }
                else if (serviceUuid.length === 16) {
                    serviceUuids128bit.push(serviceUuid);
                }
            }
        }
        if (serviceUuids16bit.length) {
            advertisementDataLength += 2 + 2 * serviceUuids16bit.length;
        }
        if (serviceUuids128bit.length) {
            advertisementDataLength += 2 + 16 * serviceUuids128bit.length;
        }
        const advertisementData = Buffer.alloc(advertisementDataLength);
        const scanData = Buffer.alloc(scanDataLength);
        // flags
        advertisementData.writeUInt8(2, 0);
        advertisementData.writeUInt8(0x01, 1);
        advertisementData.writeUInt8(0x06, 2);
        let advertisementDataOffset = 3;
        if (serviceUuids16bit.length) {
            advertisementData.writeUInt8(1 + 2 * serviceUuids16bit.length, advertisementDataOffset);
            advertisementDataOffset++;
            advertisementData.writeUInt8(0x03, advertisementDataOffset);
            advertisementDataOffset++;
            for (i = 0; i < serviceUuids16bit.length; i++) {
                serviceUuids16bit[i].copy(advertisementData, advertisementDataOffset);
                advertisementDataOffset += serviceUuids16bit[i].length;
            }
        }
        if (serviceUuids128bit.length) {
            advertisementData.writeUInt8(1 + 16 * serviceUuids128bit.length, advertisementDataOffset);
            advertisementDataOffset++;
            advertisementData.writeUInt8(0x06, advertisementDataOffset);
            advertisementDataOffset++;
            for (i = 0; i < serviceUuids128bit.length; i++) {
                serviceUuids128bit[i].copy(advertisementData, advertisementDataOffset);
                advertisementDataOffset += serviceUuids128bit[i].length;
            }
        }
        // name
        if (name && name.length) {
            const nameBuffer = Buffer.from(name);
            scanData.writeUInt8(1 + nameBuffer.length, 0);
            scanData.writeUInt8(0x08, 1);
            nameBuffer.copy(scanData, 2);
        }
        this.startAdvertisingWithEIRData(advertisementData, scanData);
    }
    startAdvertisingIBeacon(data) {
        debug("startAdvertisingIBeacon: data = " + data.toString("hex"));
        const dataLength = data.length;
        const manufacturerDataLength = 4 + dataLength;
        const advertisementDataLength = 5 + manufacturerDataLength;
        const advertisementData = Buffer.alloc(advertisementDataLength);
        const scanData = Buffer.alloc(0);
        // flags
        advertisementData.writeUInt8(2, 0);
        advertisementData.writeUInt8(0x01, 1);
        advertisementData.writeUInt8(0x06, 2);
        advertisementData.writeUInt8(manufacturerDataLength + 1, 3);
        advertisementData.writeUInt8(0xff, 4);
        advertisementData.writeUInt16LE(0x004c, 5); // Apple Company Identifier LE (16 bit)
        advertisementData.writeUInt8(0x02, 7); // type, 2 => iBeacon
        advertisementData.writeUInt8(dataLength, 8);
        data.copy(advertisementData, 9);
        this.startAdvertisingWithEIRData(advertisementData, scanData);
    }
    startAdvertisingWithEIRData(advertisementData, scanData) {
        advertisementData = advertisementData || Buffer.alloc(0);
        scanData = scanData || Buffer.alloc(0);
        debug("startAdvertisingWithEIRData: advertisement data = " +
            advertisementData.toString("hex") +
            ", scan data = " +
            scanData.toString("hex"));
        let error = null;
        if (advertisementData.length > 31) {
            error = new Error("Advertisement data is over maximum limit of 31 bytes");
        }
        else if (scanData.length > 31) {
            error = new Error("Scan data is over maximum limit of 31 bytes");
        }
        if (error) {
            this.emit("advertisingStart", error);
        }
        else {
            this._advertiseState = "starting";
            this._hci.setScanResponseData(scanData);
            this._hci.setAdvertisingData(advertisementData);
            this._hci.setAdvertiseEnable(true);
            this._hci.setScanResponseData(scanData);
            this._hci.setAdvertisingData(advertisementData);
        }
    }
    restartAdvertising() {
        this._advertiseState = "restarting";
        this._hci.setAdvertiseEnable(true);
    }
    stopAdvertising() {
        this._advertiseState = "stopping";
        this._hci.setAdvertiseEnable(false);
    }
    onHciError(error) { }
    onHciLeAdvertisingParametersSet(status) { }
    onHciLeAdvertisingDataSet(status) { }
    onHciLeScanResponseDataSet(status) { }
    onHciLeAdvertiseEnableSet(status) {
        if (this._advertiseState === "starting") {
            this._advertiseState = "started";
            let error = null;
            if (status) {
                error = new Error(hci_1.default.STATUS_MAPPER[status] || "Unknown (" + status + ")");
            }
            this.emit("advertisingStart", error);
        }
        else if (this._advertiseState === "stopping") {
            this._advertiseState = "stopped";
            this.emit("advertisingStop");
        }
    }
}
exports.default = Gap;

//# sourceMappingURL=gap.js.map
